# Stock Management & GST Analysis

## 1. Order Placement Performance Issue (20-30 seconds)

### Problem
Order placement is taking 20-30 seconds instead of being fast like before.

### Investigation Needed
Let's trace the exact bottleneck by adding performance logging:

**Backend (PaymentController.php)** - Lines to check:
- Line 88-117: Stock validation loop
- Line 137-145: Shipping calculation
- Line 193-220: Order item creation loop
- Line 280-310: Razorpay order creation

**Potential Causes:**
1. **N+1 Query Problem**: Loading products/variations one by one in cart loop
2. **PriceEngine overhead**: Computing prices for each item individually
3. **Shipping calculation**: Complex weight/zone calculations
4. **Razorpay API latency**: External API call taking time
5. **GST calculation overhead**: Multiple calculations per item

**Quick Win Solutions:**
- Use eager loading for products with variations
- Batch price computations
- Cache shipping rates
- Add query logging to identify slow queries

---

## 2. Stock Items vs Product.stock Field Relationship

### Current Architecture

**There are TWO separate stock systems:**

#### System 1: Simple Stock (Currently Active)
- **Location**: `products.stock` column and `product_variations.stock` column
- **Used By**: Frontend product display, cart validation, order processing
- **Updates**: Direct decrements in PaymentController during order creation
- **Code**: Line 232-240 in PaymentController.php
```php
// Decrement stock
if ($item['variation_id']) {
    $variation = ProductVariation::find($item['variation_id']);
    $variation->decrement('stock', $item['quantity']);
} else {
    $product = Product::find($item['product_id']);
    $product->decrement('stock', $item['quantity']);
}
```

#### System 2: Advanced Stock Items (NOT LINKED)
- **Location**: `stock_items` table (polymorphic)
- **Features**: 
  - Warehouse management
  - Stock reservations
  - Stock movements tracking
  - Reorder points
- **Current Status**: **NOT connected to products.stock field**
- **Model**: `App\Models\StockItem`

### The Problem

**You updated stock_items (9000 products) but products are not showing because:**
1. `products.stock` field is still `0`
2. Frontend reads from `products.stock`, NOT from `stock_items`
3. There's NO automatic sync between `stock_items.quantity` → `products.stock`

### Solution Options

#### Option A: Link StockItem to Product.stock (Recommended)
Add relationship and sync mechanism:

```php
// In Product.php
public function stockItems()
{
    return $this->morphMany(StockItem::class, 'stockable');
}

// Override stock accessor to sum from stock_items if exists
protected function stock(): Attribute
{
    return Attribute::make(
        get: function () {
            // If stockItems exist, use their total
            if ($this->relationLoaded('stockItems') && $this->stockItems->count() > 0) {
                return $this->stockItems->sum('quantity');
            }
            
            // Check if we should eager load
            $stockItems = $this->stockItems()->sum('quantity');
            if ($stockItems > 0) {
                return $stockItems;
            }
            
            // Fallback to products.stock column
            return $this->attributes['stock'] ?? 0;
        }
    );
}
```

#### Option B: Sync Stock Items to Product.stock (Immediate Fix)
Run a migration/command to sync:

```php
// Command: php artisan stock:sync-to-products

foreach (Product::all() as $product) {
    $totalStock = StockItem::where('stockable_type', Product::class)
                           ->where('stockable_id', $product->id)
                           ->sum('quantity');
    
    if ($totalStock > 0) {
        $product->update(['stock' => $totalStock]);
    }
}
```

#### Option C: Use StockItems Everywhere (Major Refactor)
- Update ProductResource to read from stockItems
- Update cart validation to check stockItems
- Update order processing to use StockItem->reserve() and ->fulfill()
- Remove products.stock dependency entirely

---

## 3. GST Implementation Details

### Current GST System Architecture

#### A. GST Calculator Service
**Location**: `app/Services/GSTCalculator.php`

**Features:**
- Calculates GST for inclusive/exclusive pricing
- Generates item-level GST breakdown
- Aggregates order-level GST by rate
- Supports multiple GST rates per order

**Key Methods:**
```php
GSTCalculator::calculate($product, $finalPrice, $quantity)
// Returns: unit_price, price_before_gst, gst_rate, gst_amount, hsn_code, totals

GSTCalculator::calculateOrderGST($items)
// Returns: total_gst, total_before_gst, breakdown by rate
```

#### B. Product/Variation GST Fields
**Database columns:**
- `gst_rate` (decimal) - Default: 18%
- `hsn_code` (string) - Harmonized System Nomenclature
- `gst_inclusive` (boolean) - Whether price includes GST

#### C. Order GST Storage
**Orders table:**
- `customer_gstin` (string, 15 chars) - Customer's GST number
- `total_gst_amount` (decimal) - Total GST for order
- `gst_breakdown` (JSON) - GST grouped by rate

**Order Items table:**
- `unit_price` (with GST)
- `price_before_gst`
- `gst_rate`
- `gst_amount` (per unit)
- `hsn_code`

### Where GST is Currently Displayed

#### ✅ OrderConfirmation.vue (After Order Placed)
- Shows customer GSTIN
- Displays total GST amount
- HSN codes table with quantities
- **Location**: Lines 61-105

#### ❌ Checkout Page Order Summary (MISSING)
- **Location**: `pages/checkout.vue` lines 190-240
- **Currently shows**: Subtotal, Shipping, Total
- **Missing**: GST breakdown before order placement

### Adding GST to Checkout Order Summary

**Current Summary Structure:**
```vue
<div class="summary-totals">
  <div class="total-row">Subtotal: ₹{{ totalPrice }}</div>
  <div class="total-row">Shipping: ₹{{ shippingCost }}</div>
  <div class="total-row final-total">Total: ₹{{ grandTotal }}</div>
</div>
```

**Needed: Add GST Calculation**
Since cart items have prices with GST included (from PriceEngine), we need to:
1. Calculate GST breakdown from cart items
2. Display GST summary before final total
3. Show inclusive vs. exclusive pricing

**Problem**: Cart items from backend have `price` (final price), but we need GST breakdown.

**Solution Options:**

**Option 1**: Backend sends GST breakdown in cart response
- Update CartController->getCart() to include GST info per item
- Add computed GST summary in checkout.vue

**Option 2**: Calculate GST on frontend
- Fetch product GST rates
- Calculate based on prices
- Less accurate if prices changed

**Recommendation**: Option 1 - Let backend calculate accurate GST

---

## 4. Immediate Action Items

### Priority 1: Fix Stock Display Issue
```bash
# Create sync command
php artisan make:command SyncStockItems

# Or run manual sync in tinker:
php artisan tinker
$products = Product::all();
foreach ($products as $product) {
    $stockTotal = DB::table('stock_items')
        ->where('stockable_type', 'App\\Models\\Product')
        ->where('stockable_id', $product->id)
        ->sum('quantity');
    
    if ($stockTotal > 0) {
        $product->update(['stock' => $stockTotal, 'is_active' => true]);
        echo "Updated {$product->name}: {$stockTotal}\n";
    }
}
```

### Priority 2: Investigate Order Slowness
```php
// Add to PaymentController@createOrder (line 35)
$startTime = microtime(true);
Log::info('[PERF] Order creation started');

// Before validation
Log::info('[PERF] Validation: ' . round((microtime(true) - $startTime) * 1000, 2) . 'ms');

// After cart item loop
Log::info('[PERF] Cart processing: ' . round((microtime(true) - $startTime) * 1000, 2) . 'ms');

// After shipping calculation
Log::info('[PERF] Shipping calc: ' . round((microtime(true) - $startTime) * 1000, 2) . 'ms');

// After Razorpay call
Log::info('[PERF] Razorpay order: ' . round((microtime(true) - $startTime) * 1000, 2) . 'ms');
```

### Priority 3: Add GST to Checkout Summary
1. Update CartController to include GST breakdown
2. Add GST display section in checkout.vue order summary
3. Test with different GST rates

---

## 5. Questions to Answer

1. **Do you want to use StockItems system?**
   - If YES: Need to link it properly
   - If NO: Can remove stock_items table and use simple stock

2. **Should GST be shown in checkout before placing order?**
   - Currently only shown AFTER order in confirmation
   - Users might want to see GST breakdown before paying

3. **Is the 20-30 second delay happening for all orders?**
   - COD orders?
   - Razorpay orders?
   - Both?

4. **Are you using multiple warehouses?**
   - If NO: StockItems might be overkill
   - If YES: Need proper StockItems integration

---

## Next Steps

Please confirm:
1. Should I create a sync command to update products.stock from stock_items?
2. Should I add performance logging to track the slowness?
3. Should I add GST breakdown to checkout page order summary?
4. Do you want to fully integrate StockItems or stick with simple stock?
