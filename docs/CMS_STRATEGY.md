# CMS Integration Strategy for Different Page Types

## ✅ **Pages NOW Using CMS** (Completed)

All policy/legal pages now support CMS with static fallback:

| Page | Route | Slug | Status |
|------|-------|------|--------|
| Shipping Policy | /shipping-policy | `shipping-policy` | ✅ CMS-ready |
| Privacy Policy | /privacy-policy | `privacy-policy` | ✅ CMS-ready |
| Terms of Service | /terms-of-service | `terms-of-service` | ✅ CMS-ready |
| Return Policy | /return-policy | `return-policy` | ✅ CMS-ready |
| Medical Disclaimer | /medical-disclaimer | `medical-disclaimer` | ✅ CMS-ready |

**How they work:**
- If CMS page exists → Shows CMS content ✅
- If CMS page missing → Shows static hardcoded content ✅
- Never breaks, always has content ✅

---

## 📋 **Other Content Pages - Recommendations**

### **1. FAQ Page** (`pages/faq.vue`)

**Current**: Interactive FAQ with 41 questions, search, categories, accordion UI

**Recommendation**: **❌ DO NOT use CMS**

**Why?**
- Complex interactive features (search, filtering, accordion)
- JavaScript-driven functionality
- Category system
- Would lose interactivity with plain CMS content

**Alternative**: Keep as Vue component for interactivity

---

### **2. About Page** (`pages/about.vue`)

**Current**: Company story, mission cards, values, team, commitment sections

**Recommendation**: **⚠️ HYBRID APPROACH**

**Options:**

**Option A - Keep Static** (Recommended for now)
- Multiple sections with custom layouts
- Icon cards, grid layouts
- Complex structure
- Better as Vue components

**Option B - CMS Only Text Sections**
- Use CMS for: Company story, commitment text
- Keep static: Mission cards, values grid, team section
- More complex implementation

**Decision**: Keep static for now, complex layouts don't suit CMS rich editor

---

### **3. Contact Page** (`pages/contact.vue`)

**Current**: Contact form with validation, social links, business info

**Recommendation**: **❌ DO NOT use CMS**

**Why?**
- Form with JavaScript validation
- Social media integration (already uses composable)
- Google Maps integration
- Dynamic functionality
- Already optimized with FormInput components

---

### **4. Product Pages** (`pages/products/[slug].vue`)

**Current**: Dynamic product data from Laravel API

**Recommendation**: **✅ Already using proper data source (Product API)**

**Why?**
- Products have complex data (variations, stock, pricing)
- Images, categories, reviews
- E-commerce specific fields
- Use Product model in Laravel, not Pages

---

### **5. Blog Pages** (`pages/blog/*`)

**Current**: Recipes, home remedies from Cockpit CMS

**Recommendation**: **✅ Already using CMS (Cockpit)** - Different CMS system

**Why?**
- Blog content managed in Cockpit CMS
- Different from policy pages
- Rich content with images, categories
- Don't migrate to Pages table

---

### **6. Courses/Events** (`pages/courses/`, `pages/events/`)

**Current**: Dynamic from Laravel API (Course, Event models)

**Recommendation**: **✅ Keep using dedicated models**

**Why?**
- Complex data (dates, pricing, registration)
- Student enrollment tracking
- Payment integration
- Event capacity management

---

## 🎯 **Summary: CMS Usage Decision Matrix**

### **✅ USE CMS FOR:**
- **Legal/Policy documents** (privacy, terms, shipping, returns, disclaimers)
- **Simple text pages** (basic company info, announcements)
- **Static informational content** (no forms, no interactivity)
- **Content that changes occasionally** (policies, disclaimers)

**Why?** Easy for non-technical staff to edit, no deployment needed

---

### **❌ DON'T USE CMS FOR:**
- **Interactive pages** (FAQ with search/filters, contact forms)
- **Complex layouts** (multi-column grids, card layouts)
- **Pages with custom Vue components** (sliders, modals, tabs)
- **E-commerce data** (products, orders, carts)
- **User-generated content** (reviews, comments)
- **Dynamic data** (courses, events with enrollment)

**Why?** CMS rich editor can't handle complex layouts/functionality

---

### **🤔 HYBRID APPROACH (Advanced):**
- **About page sections** - CMS for story/text, static for grids
- **Landing pages** - CMS for hero text, static for features
- **Product descriptions** - Use Product model, not Pages

**Implementation:** More complex, requires conditional rendering logic

---

## 📝 **How to Create CMS Pages Now**

### **Step 1: Access Admin**
Visit: `/admin/pages`

### **Step 2: Create Page**

**For Shipping Policy:**
```
Title: Shipping Policy
Slug: shipping-policy
Type: shipping
Subtitle: Fast and reliable delivery
Content: (Use rich text editor)
  - Add headings (H2, H3)
  - Format text (bold, lists)
  - Create sections
Active: ✓ ON
Last Updated: 2026-01-07
```

### **Step 3: Repeat for Others**

| Page | Title | Slug | Type |
|------|-------|------|------|
| Privacy | Privacy Policy | `privacy-policy` | privacy |
| Terms | Terms of Service | `terms-of-service` | terms |
| Return | Return & Refund Policy | `return-policy` | return |
| Medical | Medical Disclaimer | `medical-disclaimer` | medical |

### **Step 4: Test**
1. Visit each page (e.g., `/shipping-policy`)
2. Should see CMS content instead of static
3. If CMS page not created → Shows static (safe fallback)

---

## 🚀 **Content Editing Workflow**

### **Before (Static):**
```
Need to update shipping policy
  ↓
Ask developer
  ↓
Developer edits .vue file
  ↓
Git commit & push
  ↓
Deploy to production
  ↓
Wait 5-10 minutes
```

### **After (CMS):**
```
Need to update shipping policy
  ↓
Login to /admin/pages
  ↓
Edit Shipping Policy page
  ↓
Click "Save"
  ↓
LIVE immediately ✅
```

---

## 💡 **Best Practices**

### **Rich Text Editor Tips:**

1. **Use Headings Properly**
   - H2 for main sections
   - H3 for subsections
   - Don't skip levels (H2 → H4)

2. **Lists for Readability**
   - Use bullet points for benefits
   - Use numbered lists for steps
   - Keep items concise

3. **Formatting**
   - Bold for emphasis (not all caps)
   - Links for related pages
   - Short paragraphs (3-4 sentences)

4. **Structure**
   ```html
   <h2>1. Section Title</h2>
   <p>Introduction paragraph...</p>
   
   <h3>1.1 Subsection</h3>
   <p>Details...</p>
   <ul>
     <li>Point 1</li>
     <li>Point 2</li>
   </ul>
   ```

### **SEO Optimization:**

1. **Meta Title** (50-60 characters)
   - Example: "Shipping Policy - Dr. Ramita Ayurveda"

2. **Meta Description** (150-160 characters)
   - Example: "Learn about our shipping terms, delivery times, and costs. Free shipping on orders over ₹999."

3. **Meta Keywords** (5-10 keywords)
   - Example: shipping, delivery, India, fast shipping, free shipping

---

## 🔮 **Future Enhancements**

### **Phase 1 (Current):**
- ✅ Policy pages with CMS
- ✅ Static fallback
- ✅ Admin panel editing

### **Phase 2 (Later):**
- 📋 Version history for pages
- 📋 Preview before publish
- 📋 Schedule publish dates
- 📋 Multi-language support

### **Phase 3 (Advanced):**
- 📋 Page templates (different layouts)
- 📋 Custom blocks/widgets
- 📋 A/B testing content
- 📋 Analytics integration

---

## ❓ **FAQ**

### **Q: Can I add images to CMS pages?**
A: Currently the rich text editor supports HTML. You can add:
```html
<img src="/images/example.jpg" alt="Description" />
```
Upload images to `/public/images/` first.

### **Q: What happens if I delete a CMS page?**
A: Site automatically shows static fallback content. No 404 errors.

### **Q: Can I use custom CSS in CMS content?**
A: No, use predefined styles (H2, H3, lists, bold). Custom CSS won't work.

### **Q: How do I link between pages?**
A: Use relative links:
```html
See our <a href="/privacy-policy">Privacy Policy</a>
```

### **Q: Can I edit About/FAQ via CMS?**
A: No, those pages have complex layouts and JavaScript. Keep them static.

---

## 📞 **Support**

**Issues with CMS?**
- Check [CMS_INTEGRATION_GUIDE.md](CMS_INTEGRATION_GUIDE.md)
- Verify slug matches route exactly
- Ensure "Active" is toggled ON
- Test API: `/api/pages/{slug}`

**Need help?** Contact development team.

---

**Last Updated:** January 7, 2026  
**Status:** Active - All policy pages CMS-ready ✅
