<template>
  <div class="cart-page container py-5">
    <div class="cart-header text-center mb-5">
      <h1 class="cart-title">Your Cart</h1>
      <p class="cart-subtitle">Review your items and proceed to checkout</p>
    </div>
    
    <div v-if="cart.length === 0" class="empty-cart">
      <div class="empty-cart-icon">
        <LucideIcon icon="mdi:cart-outline" size="4em" />
      </div>
      <h2 class="empty-title">Your cart is empty</h2>
      <p class="empty-message">Discover amazing Ayurvedic products and start your wellness journey!</p>
      <router-link to="/products" class="btn btn-primary">
        <LucideIcon icon="mdi:shopping" class="me-2" />
        Start Shopping
      </router-link>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items">
        <div class="items-header">
          <LucideIcon icon="mdi:cart" class="header-icon" />
          <h3 class="header-title">Cart Items ({{ totalItems }})</h3>
        </div>
        
        <div class="items-list">
          <div v-for="item in cart" :key="`${item.product_id}:${item.variation_id}`" class="cart-item">
            <div class="item-image">
              <img :src="imageUrl(item.image)" :alt="item.name" class="product-img" />
            </div>
            
            <div class="item-details">
              <h5 class="item-name">{{ item.name }}</h5>
              <p v-if="item.variation_name" class="item-variation">{{ item.variation_name }}</p>
              <p class="item-price">₹{{ item.price }} <span class="price-label">each</span></p>
              <p class="item-stock">
                <LucideIcon icon="mdi:package-variant" class="stock-icon" />
                {{ item.stock }} in stock
              </p>
            </div>
            
            <div class="item-controls">
              <div class="quantity-controls">
                <label class="quantity-label">Quantity</label>
                <div class="quantity-input">
                  <button 
                    class="qty-btn minus" 
                    @click="updateQuantity(item.product_id, item.variation_id, item.quantity - 1)"
                    :disabled="item.quantity <= 1"
                  >
                    <LucideIcon icon="mdi:minus" />
                  </button>
                  <input 
                    type="number" 
                    class="qty-field" 
                    v-model.number="item.quantity"
                    min="1"
                    :max="item.stock"
                    @change="updateQuantity(item.product_id, item.variation_id, item.quantity)"
                  >
                  <button 
                    class="qty-btn plus" 
                    @click="updateQuantity(item.product_id, item.variation_id, item.quantity + 1)"
                    :disabled="item.quantity >= item.stock"
                  >
                    <LucideIcon icon="mdi:plus" />
                  </button>
                </div>
              </div>
              
              <button 
                class="remove-btn"
                @click="removeFromCart(item.product_id, item.variation_id)"
                title="Remove from cart"
              >
                <LucideIcon icon="mdi:delete-outline" />
                Remove
              </button>
            </div>
            
            <div class="item-total">
              <span class="total-label">Total</span>
              <span class="total-price">₹{{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="cart-summary">
        <div class="summary-card">
          <div class="summary-header">
            <LucideIcon icon="mdi:receipt" class="summary-icon" />
            <h3 class="summary-title">Order Summary</h3>
          </div>
          
          <div class="summary-details">
            <div class="summary-row">
              <span>Total Items</span>
              <span class="summary-value">{{ totalItems }}</span>
            </div>
            <div class="summary-row">
              <span>Subtotal</span>
              <span class="summary-value">₹{{ totalPrice.toFixed(2) }}</span>
            </div>
            <div class="summary-row shipping-info">
              <span>
                <LucideIcon icon="mdi:truck" class="me-1" />
                Shipping
              </span>
              <span class="summary-value">₹85.00</span>
            </div>
            <div class="summary-row total-row">
              <span>Total</span>
              <span class="total-amount">₹{{ (totalPrice + 85).toFixed(2) }}</span>
            </div>
          </div>
          
          <div class="summary-actions">
            <router-link to="/checkout" class="btn btn-primary checkout-btn">
              <LucideIcon icon="mdi:check" class="me-2" />
              Proceed to Checkout
            </router-link>
            <router-link to="/products" class="btn btn-outline continue-shopping">
              <LucideIcon icon="mdi:arrow-left" class="me-2" />
              Continue Shopping
            </router-link>
          </div>
          
          <div class="delivery-info">
            <LucideIcon icon="mdi:clock-outline" class="delivery-icon" />
            <div class="delivery-text">
              <span class="delivery-title">Estimated Delivery</span>
              <span class="delivery-time">3-7 business days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCart } from '@/composables/useCart';
import { useImageUrl } from '@/composables/useImageUrl.js'
import LucideIcon from '@/components/LucideIcon.vue';

const cartStore = useCart();
const { cart, totalItems, totalPrice } = storeToRefs(cartStore);
const { updateQuantity, removeFromCart } = cartStore;
const { getImageUrl } = useImageUrl();

function imageUrl(img: string) {
  return getImageUrl(img, '/fallback.jpg');
}
</script>

<style scoped>
/* Main Layout */
.cart-page {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.cart-header {
  margin-bottom: 3rem;
}

.cart-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.cart-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

/* Empty Cart */
.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--background-white);
  border-radius: 20px;
  box-shadow: var(--card-shadow);
  max-width: 500px;
  margin: 0 auto;
}

.empty-cart-icon {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.empty-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.empty-message {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

/* Cart Content */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;
  align-items: start;
}

@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

/* Cart Items */
.cart-items {
  background: var(--background-white);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: var(--card-shadow);
}

.items-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--background-light);
}

.header-icon {
  color: var(--color-success);
  width: 24px;
  height: 24px;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 120px 1fr auto auto;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem;
  border: 2px solid var(--background-light);
  border-radius: 16px;
  transition: all 0.2s ease;
}

.cart-item:hover {
  border-color: var(--color-success);
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.15);
}

.item-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid var(--border-color);
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.item-variation {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
}

.item-price {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-success);
  margin: 0;
}

.price-label {
  font-weight: 400;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.item-stock {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0;
}

.stock-icon {
  width: 16px;
  height: 16px;
}

/* Item Controls */
.item-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.quantity-controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.quantity-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.quantity-input {
  display: flex;
  align-items: center;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.qty-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--background-light);
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.qty-btn:hover:not(:disabled) {
  background: var(--color-success);
  color: var(--text-white);
}

.qty-btn:disabled {
  background: var(--text-muted);
  color: var(--background-white);
  cursor: not-allowed;
  opacity: 0.5;
}

.qty-field {
  width: 60px;
  height: 36px;
  text-align: center;
  border: none;
  background: var(--background-white);
  color: var(--text-primary);
  font-weight: 600;
}

.qty-field:focus {
  outline: none;
}

.remove-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--color-error);
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* Item Total */
.item-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.total-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.total-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-success);
}

/* Cart Summary */
.cart-summary {
  position: sticky;
  top: 2rem;
}

.summary-card {
  background: var(--background-white);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: var(--card-shadow);
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--background-light);
}

.summary-icon {
  color: var(--color-success);
  width: 24px;
  height: 24px;
}

.summary-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.summary-details {
  margin-bottom: 2rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--background-light);
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-value {
  font-weight: 600;
  color: var(--text-primary);
}

.shipping-info {
  color: var(--text-secondary);
}

.total-row {
  border-top: 2px solid var(--border-color);
  padding-top: 1rem;
  margin-top: 1rem;
  font-size: 1.125rem;
  font-weight: 700;
}

.total-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-success);
}

.summary-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary {
  background: var(--color-success);
  color: var(--text-white);
}

.btn-primary:hover {
  background: var(--primary-dark);
  color: var(--text-white);
  text-decoration: none;
  transform: translateY(-1px);
}

.btn-outline {
  background: var(--background-white);
  color: var(--text-secondary);
  border: 2px solid var(--border-color);
}

.btn-outline:hover {
  background: var(--background-light);
  color: var(--text-primary);
  text-decoration: none;
}

.delivery-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--background-light);
  border-radius: 12px;
}

.delivery-icon {
  color: var(--color-success);
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.delivery-text {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.delivery-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.delivery-time {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Responsive Design */
@media (max-width: 768px) {
  .cart-page {
    padding: 1rem;
  }
  
  .cart-title {
    font-size: 2rem;
  }
  
  .cart-items, .summary-card, .empty-cart {
    padding: 1.5rem;
  }
  
  .cart-item {
    grid-template-columns: 1fr;
    gap: 1rem;
    text-align: center;
  }
  
  .item-details {
    align-items: center;
  }
  
  .item-controls {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .item-total {
    align-items: center;
  }
  
  .product-img {
    width: 80px;
    height: 80px;
  }
  
  .summary-actions {
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .cart-header {
    margin-bottom: 2rem;
  }
  
  .empty-cart {
    padding: 2rem 1rem;
  }
  
  .cart-item {
    padding: 1rem;
  }
  
  .quantity-input {
    scale: 0.9;
  }
}
</style>