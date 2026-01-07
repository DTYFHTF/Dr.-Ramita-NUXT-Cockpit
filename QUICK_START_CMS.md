# 🚀 Quick Start: Test Your CMS Now!

## Step 1: Create a Test Page

Open your terminal in the **Laravel project**:

```bash
cd /Users/dtyfhtf/ayurveda-marketplace
php artisan tinker
```

Then paste this (one line at a time):

```php
$page = App\Models\Page::create([
    'title' => 'Shipping Policy',
    'slug' => 'shipping-policy',
    'subtitle' => 'Fast and reliable delivery to your doorstep',
    'type' => 'shipping',
    'content' => '<h2>🚚 Delivery Times</h2><p>We deliver across India:</p><ul><li><strong>Metro Cities:</strong> 3-5 business days</li><li><strong>Other Cities:</strong> 5-7 business days</li><li><strong>Remote Areas:</strong> 7-10 business days</li></ul><h2>💰 Shipping Costs</h2><ul><li>FREE shipping on orders above ₹999</li><li>₹99 flat fee for orders below ₹999</li></ul><h2>📦 Order Tracking</h2><p>Track your order anytime with the tracking link sent to your email.</p>',
    'meta_title' => 'Shipping Policy - Dr. Ramita Ayurveda',
    'meta_description' => 'Learn about our shipping terms, delivery times, and free shipping on orders over ₹999.',
    'meta_keywords' => ['shipping', 'delivery', 'India', 'free shipping'],
    'is_active' => true,
    'last_updated' => now(),
]);

echo "✅ Created: {$page->title} (ID: {$page->id})\n";
```

Type `exit` to leave Tinker.

---

## Step 2: View Your Page

Visit in browser:
```
http://localhost:3000/shipping-policy
```

**You should see:**
- 🎨 New hero section (from PageHero component)
- ✨ CMS content (not the old static content!)
- 📅 "Last Updated" date at bottom

---

## Step 3: Create All Policy Pages

Repeat Step 1 for each page:

### Privacy Policy
```php
App\Models\Page::create([
    'title' => 'Privacy Policy',
    'slug' => 'privacy-policy',
    'subtitle' => 'Your privacy is important to us',
    'type' => 'privacy',
    'content' => '<h2>1. Information We Collect</h2><p>We collect information when you create an account, make purchases, or contact us.</p><h2>2. How We Use Information</h2><p>Your data is used to process orders and improve our services.</p>',
    'is_active' => true,
    'last_updated' => now(),
]);
```

### Terms of Service
```php
App\Models\Page::create([
    'title' => 'Terms of Service',
    'slug' => 'terms-of-service',
    'subtitle' => 'Please read our terms carefully',
    'type' => 'terms',
    'content' => '<h2>1. Acceptance of Terms</h2><p>By using our site, you agree to these terms.</p><h2>2. User Obligations</h2><p>You must provide accurate information and use the site lawfully.</p>',
    'is_active' => true,
    'last_updated' => now(),
]);
```

### Return Policy
```php
App\Models\Page::create([
    'title' => 'Return & Refund Policy',
    'slug' => 'return-policy',
    'subtitle' => 'Easy returns within 7 days',
    'type' => 'return',
    'content' => '<h2>Return Eligibility</h2><p>Items can be returned within 7 days if unused and in original packaging.</p><h2>Refund Process</h2><p>Refunds are processed within 5-7 business days after we receive your return.</p>',
    'is_active' => true,
    'last_updated' => now(),
]);
```

### Medical Disclaimer
```php
App\Models\Page::create([
    'title' => 'Medical Disclaimer',
    'slug' => 'medical-disclaimer',
    'subtitle' => 'Important health information',
    'type' => 'medical',
    'content' => '<h2>Consultation Required</h2><p>Always consult with a qualified healthcare professional before using Ayurvedic products.</p><h2>Not Medical Advice</h2><p>Information on this site is for educational purposes only and is not medical advice.</p>',
    'is_active' => true,
    'last_updated' => now(),
]);
```

---

## Step 4: Use Admin Panel (Better Way!)

Instead of Tinker, use the beautiful admin interface:

1. Visit: `http://localhost/admin/pages` (or your Laravel URL)
2. Login with your admin credentials
3. Click **"New Page"**
4. Fill in the form with rich text editor
5. Click **"Create"**

Much better! 🎉

---

## Step 5: Edit Content

To update content:

**Via Admin Panel:**
1. Go to `/admin/pages`
2. Click on page to edit
3. Update content in rich editor
4. Click "Save"
5. Refresh frontend → See changes instantly!

**Via Tinker:**
```php
$page = App\Models\Page::where('slug', 'shipping-policy')->first();
$page->content = '<h2>Updated Content</h2><p>New text here!</p>';
$page->save();
```

---

## Step 6: Deactivate Page (Test Fallback)

To test static fallback:

```php
$page = App\Models\Page::where('slug', 'shipping-policy')->first();
$page->is_active = false;
$page->save();
```

Now visit `/shipping-policy` → You'll see the old static content!

Reactivate:
```php
$page->is_active = true;
$page->save();
```

---

## 🎯 Expected Results

### All Pages Working:
- ✅ `/shipping-policy` - CMS or static fallback
- ✅ `/privacy-policy` - CMS or static fallback
- ✅ `/terms-of-service` - CMS or static fallback
- ✅ `/return-policy` - CMS or static fallback
- ✅ `/medical-disclaimer` - CMS or static fallback

### About/FAQ/Contact:
- ✅ `/about` - Static (complex layouts)
- ✅ `/faq` - Static (interactive JavaScript)
- ✅ `/contact` - Static (form validation)

---

## 🐛 Troubleshooting

### "Still seeing old content"
1. Hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
2. Check page is active: `is_active = true`
3. Check slug matches exactly
4. Clear browser cache

### "API error"
Check Laravel API is running:
```bash
php artisan serve
```

### "TypeScript errors"
All fixed! But if you see any:
```bash
cd /Users/dtyfhtf/Dr.-Ramita-NUXT-Cockpit
npm run dev
```

---

## 📚 Next Steps

1. ✅ Create pages via admin panel
2. ✅ Test each page in browser
3. ✅ Edit content and see live updates
4. 📖 Read [CMS_STRATEGY.md](CMS_STRATEGY.md) for full guide
5. 📖 Read [CMS_INTEGRATION_GUIDE.md](CMS_INTEGRATION_GUIDE.md) for details

---

## 🎉 Success Checklist

- [ ] Created at least one page via Tinker or Admin
- [ ] Visited page and saw CMS content (not static)
- [ ] Edited page content and saw update
- [ ] Tested with `is_active = false` (saw fallback)
- [ ] Reactivated page (CMS content returned)
- [ ] Used admin panel instead of Tinker
- [ ] All 5 policy pages created

**All checked?** You're ready! 🚀

---

**Need Help?** Check the docs or ask questions!
