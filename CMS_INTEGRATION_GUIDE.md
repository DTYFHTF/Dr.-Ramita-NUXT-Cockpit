# CMS Integration Guide

## How It Works

The CMS system allows you to edit page content from the Filament admin panel without touching code. Here's how it integrates with your site:

## 1. Admin Panel

**Access**: `/admin/pages`

You can create and edit pages with:
- Title & Slug (URL-friendly name)
- Subtitle
- Content (Rich text editor)
- Type (shipping, privacy, terms, etc.)
- SEO fields (meta title, description, keywords)
- Publish status (active/inactive)

## 2. Frontend Integration

### Static Pages with CMS Fallback

Pages like `shipping-policy.vue`, `privacy-policy.vue`, etc. now:

1. **Try to fetch CMS content first** from `/api/pages/{slug}`
2. **If CMS content exists** → Display CMS content
3. **If CMS content doesn't exist** → Display static (hardcoded) content

This means:
- ✅ Pages work immediately (static content)
- ✅ You can override with CMS content anytime
- ✅ No breaking changes if CMS is empty

### Example Flow

**Shipping Policy Page** (`/shipping-policy`):

```vue
// 1. Page loads, tries to fetch from CMS
const { data: cmsPage, error } = await useFetch('/api/pages/shipping-policy')

// 2. If CMS page exists (you created it in admin)
<div v-if="cmsPage">
  <!-- Shows CMS content -->
</div>

// 3. If CMS page doesn't exist (404 error)
<div v-else>
  <!-- Shows static hardcoded content -->
</div>
```

## 3. How to Use CMS

### Step 1: Create Page in Admin

1. Go to `/admin/pages`
2. Click "New Page"
3. Fill in:
   - **Title**: "Shipping Policy"
   - **Slug**: "shipping-policy" (must match existing route)
   - **Type**: Select "shipping"
   - **Content**: Write your policy using rich text editor
   - **Active**: Toggle ON to publish
4. Save

### Step 2: View Live Page

Visit `/shipping-policy` on your site → You'll now see CMS content instead of static content!

### Important: Slug Naming

The **slug** must match your existing route:

| Route | Required Slug |
|-------|---------------|
| /shipping-policy | shipping-policy |
| /privacy-policy | privacy-policy |
| /terms-of-service | terms-of-service |
| /return-policy | return-policy |
| /medical-disclaimer | medical-disclaimer |

## 4. Dynamic Routes

For custom pages (not policy pages), use:

**URL**: `/page/your-custom-slug`

Example:
- Create page with slug: "about-founder"
- Access at: `/page/about-founder`

This route (`pages/page/[slug].vue`) only uses CMS content (no static fallback).

## 5. API Endpoints

### Get All Pages
```
GET /api/pages
```

Optional filters:
- `?type=shipping` - Filter by type
- `?search=privacy` - Search in titles

### Get Single Page
```
GET /api/pages/{slug}
```

Example: `GET /api/pages/shipping-policy`

Returns:
```json
{
  "title": "Shipping Policy",
  "slug": "shipping-policy",
  "subtitle": "Our shipping terms",
  "content": "<h2>1. Coverage</h2><p>...</p>",
  "type": "shipping",
  "meta_title": "Shipping Policy - Dr. Ramita",
  "meta_description": "...",
  "meta_keywords": ["shipping", "delivery"],
  "is_active": true,
  "last_updated": "2026-01-07"
}
```

## 6. Content Management

### Rich Text Editor Features

In the admin panel, you can:
- Format text (bold, italic, headings)
- Create lists (bullet, numbered)
- Add links
- Insert quotes
- Structure content with H2, H3 headings

### SEO Management

Each page has:
- **Meta Title**: For Google search results
- **Meta Description**: Summary in search results
- **Meta Keywords**: Search terms (comma-separated)

### Versioning

Pages have a `version` field to track changes (for future revision history).

## 7. Which Pages Use CMS?

### Currently Integrated (Static + CMS Fallback)
- ✅ `/shipping-policy`
- ⏳ `/privacy-policy` (can be updated similarly)
- ⏳ `/terms-of-service` (can be updated similarly)
- ⏳ `/return-policy` (can be updated similarly)
- ⏳ `/medical-disclaimer` (can be updated similarly)

### Pure CMS Pages
- ✅ `/page/[slug]` - Any custom slug

### Not Using CMS (Static Only)
- Contact page
- FAQ page
- About page
- Product pages
- Blog pages

## 8. Updating More Pages

To make other policy pages use CMS, update them like `shipping-policy.vue`:

1. Add CMS fetch:
```vue
const { data: cmsPage, error } = await useFetch(`${config.public.apiBase}/pages/privacy-policy`)
```

2. Add conditional rendering:
```vue
<!-- CMS Content -->
<div v-if="cmsPage">
  <PageHero :title="cmsPage.title" :subtitle="cmsPage.subtitle" />
  <div class="cms-content" v-html="cmsPage.content"></div>
</div>

<!-- Static Fallback -->
<div v-else>
  <!-- Existing hardcoded content -->
</div>
```

3. Add imports:
```vue
import PageHero from '@/components/PageHero.vue';
```

## 9. Troubleshooting

### "Page not updating after editing in admin"

1. Check slug matches exactly
2. Make sure "Active" is toggled ON
3. Clear browser cache (Ctrl+Shift+R)

### "Seeing static content instead of CMS"

This means the page wasn't found in CMS:
- Check the slug in admin matches route
- Verify page is published (active = true)
- Check API endpoint works: `/api/pages/{slug}`

### "404 error when accessing CMS page"

For dynamic routes, make sure you're using `/page/{slug}`, not `/{slug}`.

## 10. Benefits

### Before CMS
❌ Edit content → Update code → Deploy → Wait for deployment  
❌ Non-technical staff can't edit  
❌ Need developer for every change  

### After CMS
✅ Edit content → Save → Live immediately  
✅ Marketing team can update policies  
✅ No deployment needed  
✅ Faster content updates  
✅ Version history (coming soon)  

## 11. Best Practices

1. **Always set a slug** that matches your route
2. **Write descriptive meta descriptions** (150-160 characters)
3. **Use proper heading hierarchy** (H2, then H3, not random)
4. **Keep content organized** with sections
5. **Preview before publishing** (set Active = false first)
6. **Update "Last Updated" date** when making changes

## 12. Next Steps

To fully migrate to CMS:

1. ✅ Update `privacy-policy.vue` (same as shipping)
2. ✅ Update `terms-of-service.vue`
3. ✅ Update `return-policy.vue`
4. ✅ Update `medical-disclaimer.vue`
5. Create initial content in admin for all policies
6. Test all pages
7. Remove static content once CMS is populated

---

**Questions?** Check `/admin/pages` to see examples or create test pages to experiment!
