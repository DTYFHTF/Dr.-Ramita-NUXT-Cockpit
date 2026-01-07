# FAQ Management System Guide

## 🎯 System Overview

You have **TWO different FAQ systems**:

### **1. FAQ Model System (Database-Driven)** ✅
- **Backend**: Laravel Faq model + Filament admin
- **Admin Panel**: `/admin/faqs`
- **API**: `/api/faqs` and `/api/faqs?category=bulk-order`
- **Used By**: 
  - ✅ `/bulk-order` page (already using it!)
  - ✅ `/faq` page (NOW using it!)

### **2. Page CMS System** ✅
- **Backend**: Page model + Filament admin
- **Admin Panel**: `/admin/pages`
- **API**: `/api/pages/{slug}`
- **Used By**: Policy pages (shipping, privacy, terms, return, medical)

---

## ✅ **UPDATED: FAQ Page Now Dynamic!**

### **What Changed:**

**Before:**
```vue
// pages/faq.vue - Hardcoded FAQs
const faqData = [
  { name: 'General', items: [...] },
  { name: 'Products', items: [...] }
]
```

**After:**
```vue
// pages/faq.vue - Fetches from API
const { data: faqResponse } = await useFetch('/api/faqs')
const faqData = computed(() => transformAPIData(faqResponse))
```

### **Benefits:**
- ✅ Edit FAQs from admin panel
- ✅ No code deployment needed
- ✅ Changes live immediately
- ✅ Same system for all FAQs
- ✅ Fallback to static if API fails

---

## 📋 **FAQ Categories**

### **Recommended Categories:**

| Category | Purpose | Used By |
|----------|---------|---------|
| `general` | General questions about Rishipath | Main FAQ page |
| `products` | Product-related questions | Main FAQ page |
| `orders-shipping` | Orders, delivery, tracking | Main FAQ page |
| `consultations` | Booking, practitioners, sessions | Main FAQ page |
| `courses-events` | Course enrollment, certificates | Main FAQ page |
| `account-privacy` | Account, privacy, data | Main FAQ page |
| `bulk-order` | Wholesale, bulk pricing | **Bulk Order page ONLY** |

### **Important:**

**Bulk Order FAQs are SEPARATE:**
- Create FAQs with `category = 'bulk-order'`
- These show ONLY on `/bulk-order` page
- Won't mix with general FAQs
- Specific to wholesale customers

---

## 🚀 **How to Manage FAQs**

### **Step 1: Access Admin Panel**
Visit: `/admin/faqs`

### **Step 2: Create FAQ**

**Example - General FAQ:**
```
Category: general
Question: What is Rishipath?
Answer: Rishipath is a comprehensive Ayurvedic wellness platform...
Order: 1
Active: ✓ ON
```

**Example - Bulk Order FAQ:**
```
Category: bulk-order
Question: What is the minimum order quantity?
Answer: Minimum 10 units per product for bulk orders.
Order: 1
Active: ✓ ON
```

### **Step 3: View Live**
- General FAQs: Visit `/faq`
- Bulk Order FAQs: Visit `/bulk-order` (scroll down)

---

## 🔄 **Migration from Hardcoded to Database**

### **Current State:**

**Main FAQ Page (`/faq`):**
- ✅ Now fetches from `/api/faqs`
- ✅ Shows all categories except `bulk-order`
- ✅ Fallback to hardcoded if API fails
- ✅ Search and filter still work

**Bulk Order Page (`/bulk-order`):**
- ✅ Already fetches from `/api/faqs?category=bulk-order`
- ✅ Falls back to all FAQs if bulk-order empty
- ✅ Working perfectly

---

## 📝 **How to Migrate Existing FAQs**

You have **41 hardcoded FAQs** in `/faq` page that need to be added to database.

### **Option 1: Manual Entry (Recommended)**

1. Go to `/admin/faqs`
2. Click "New FAQ"
3. Copy question/answer from existing page
4. Select correct category
5. Set order number
6. Toggle Active ON
7. Save
8. Repeat for all 41 FAQs

**Time:** ~30-45 minutes for all FAQs

### **Option 2: Bulk Import via Seeder**

Create a seeder to import all at once. I can create this for you if needed.

---

## 🎨 **FAQ Structure**

### **Database Fields:**

```php
faqs table:
- id (auto)
- category (string) - e.g., 'general', 'bulk-order'
- question (text) - The FAQ question
- answer (text) - HTML allowed
- order (integer) - Display order (1, 2, 3...)
- is_active (boolean) - Show/hide
- created_at, updated_at
```

### **API Response:**

**All FAQs (grouped):**
```json
GET /api/faqs
{
  "success": true,
  "data": {
    "general": [
      { "id": 1, "question": "...", "answer": "...", "order": 1 }
    ],
    "products": [
      { "id": 5, "question": "...", "answer": "...", "order": 1 }
    ]
  }
}
```

**Category Specific:**
```json
GET /api/faqs?category=bulk-order
{
  "success": true,
  "data": [
    { "id": 10, "question": "...", "answer": "...", "order": 1 }
  ]
}
```

---

## ✨ **Features**

### **In Admin Panel (`/admin/faqs`):**
- ✅ Create/Edit/Delete FAQs
- ✅ Organize by category
- ✅ Set display order
- ✅ Toggle active/inactive
- ✅ Rich text for answers
- ✅ Search and filter
- ✅ Bulk actions

### **On Frontend:**
- ✅ Search functionality
- ✅ Category filtering
- ✅ Accordion UI
- ✅ HTML in answers (links, formatting)
- ✅ Loading states
- ✅ Fallback to static if needed

---

## 🎯 **Best Practices**

### **1. Naming Categories:**
- Use lowercase with hyphens: `bulk-order`, `account-privacy`
- Keep consistent across all FAQs
- Don't create too many categories (5-7 max)

### **2. Order Numbers:**
- Start at 1 for each category
- Increment by 1: 1, 2, 3, 4...
- Most important questions first
- Can use 10, 20, 30 if you plan to insert between

### **3. Writing Answers:**
- Keep concise (2-4 sentences)
- Use HTML for formatting: `<strong>`, `<ul>`, `<li>`, `<a>`
- Link to relevant pages: `<a href="/contact">Contact Us</a>`
- Break long answers into bullet points

### **4. Answer HTML Examples:**

**With Links:**
```html
See our <a href="/shipping-policy">Shipping Policy</a> for details.
```

**With Lists:**
```html
<p>Follow these steps:</p>
<ul>
  <li>Login to your account</li>
  <li>Go to "My Orders"</li>
  <li>Click "Request Return"</li>
</ul>
```

**With Emphasis:**
```html
<strong>Always consult your doctor</strong> before starting new supplements.
```

---

## 🔧 **Maintenance Tasks**

### **Regular Updates:**
- Review FAQs monthly
- Update outdated information
- Add new common questions
- Remove duplicate FAQs
- Check all links work

### **After Policy Changes:**
- Update related FAQs
- Link to new policy pages
- Add new questions about changes
- Notify customers of updates

---

## 🐛 **Troubleshooting**

### **"FAQs not showing on /faq page"**
1. Check FAQs are active (`is_active = true`)
2. Verify API works: `/api/faqs`
3. Check category matches
4. Clear browser cache

### **"Bulk order FAQs showing general FAQs"**
**This is by design!** If no `bulk-order` category FAQs exist, it shows all FAQs as fallback.

**Solution:**
1. Create FAQs with `category = 'bulk-order'`
2. Only bulk-specific questions
3. They'll appear ONLY on bulk order page

### **"Can't edit FAQ categories"**
Categories are plain text fields. Type the exact category name:
- `general` ✅
- `General` ❌ (wrong - case sensitive)
- `bulk-order` ✅
- `bulk_order` ❌ (wrong - use hyphen)

---

## 📚 **Next Steps**

### **Immediate:**
1. ✅ Test FAQ page: Visit `/faq` (should load from API)
2. ✅ Create test FAQ in admin panel
3. ✅ Verify it appears on frontend
4. ✅ Create bulk-order specific FAQs

### **Short Term:**
1. Migrate all 41 hardcoded FAQs to database
2. Organize into proper categories
3. Add bulk-order specific FAQs (5-10 questions)
4. Review and update all answers

### **Long Term:**
1. Add FAQ voting (helpful/not helpful)
2. Track most viewed FAQs
3. Add related questions
4. Multi-language support

---

## 🎉 **Summary**

**Before:**
- ❌ Main FAQ page: Hardcoded in Vue
- ✅ Bulk order FAQ: Dynamic from database
- ❌ Had to redeploy to update FAQs

**After:**
- ✅ Main FAQ page: Dynamic from database
- ✅ Bulk order FAQ: Dynamic from database (separate category)
- ✅ Edit from admin panel, live immediately
- ✅ No code changes needed
- ✅ Consistent system across all pages

**Your FAQ system is now fully dynamic and manageable!** 🚀

---

**Questions?** Check admin panel at `/admin/faqs` to start creating FAQs!
