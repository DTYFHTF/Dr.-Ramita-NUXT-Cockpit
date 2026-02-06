# Color System Migration Progress

**Goal**: Migrate all components and pages from legacy color tokens to semantic tokens for full dark mode support.

## Migration Pattern

### Legacy → Semantic Token Mapping

| Legacy Token | New Semantic Token | Purpose |
|--------------|-------------------|---------|
| `--color-primary` | `--accent-primary` | Primary brand accent |
| `--primary-dark` | `--accent-primary-hover` | Hover state |
| `--background-white` | `--surface-primary` | Cards, modals, content |
| `--background-light` | `--surface-muted` | Subtle backgrounds |
| `--border-color` | `--border-default` | Standard borders |
| `--primary` | `--accent-primary` | Brand accent (alias) |

### SCSS Variables → CSS Custom Properties

| SCSS Variable | New CSS Custom Property |
|---------------|------------------------|
| `$color-primary` | `var(--accent-primary)` |
| `$background-light` | `var(--surface-muted)` |
| `$border-color` | `var(--border-default)` |
| `$text-primary` | `var(--text-primary)` |

---

## ✅ Completed (4 files)

### Components
- [x] **SeasonalProducts.vue** - 10 tokens migrated
  - `--background-white` → `--surface-base`
  - `--primary` → `--accent-primary`
  - `--border-color` → `--border-default`
  - `--background-light` → `--surface-muted`

- [x] **ProductCard.vue** - 9 tokens migrated
  - All surface, border tokens updated

- [x] **CategoryCard.vue** - 2 tokens migrated
  - Surface and border tokens updated

- [x] **GenericSlider.vue** - 2 tokens migrated
  - Accent color tokens updated

---

## 🔄 In Progress (0 files)

*No files currently in progress*

---

## 📋 Remaining Work

### High Priority - User-Facing Pages (31 tokens total)

#### E-commerce Critical
- [ ] **checkout.vue** - 23 tokens
  - Multiple `--background-white`, `--background-light`, `--border-color`, `--color-primary`
  - Priority: HIGH (checkout flow critical)

- [ ] **CartPage.vue** - 9 tokens
  - Surface, border, and background tokens
  - Priority: HIGH (shopping experience)

- [ ] **products/[slug].vue** - 6 tokens
  - Product detail page styling
  - Priority: HIGH (conversion critical)

#### Doctor/Course Booking
- [ ] **doctors/[slug].vue** - 12 tokens
  - Doctor profile styling
  - Priority: MEDIUM

- [ ] **courses/[slug].vue** - 9 tokens
  - Course detail styling
  - Priority: MEDIUM

- [ ] **events/[slug].vue** - 5 CSS tokens + SCSS `$color-primary`
  - Event detail styling
  - Priority: MEDIUM

#### Other Features
- [ ] **bulk-order.vue** - 12 tokens
  - Bulk order form styling
  - Priority: LOW

### Small Pages (Quick Wins - 10 tokens)

- [ ] **orders.vue** - 2 tokens
  - `--background-white`, `--border-color`

- [ ] **wishlist.vue** - 2 tokens
  - `--background-white`, `--border-color`

- [ ] **blog/yoganmeditation/[slug].vue** - 3 tokens
  - `--border-color`, `--background-white`

### Auth Pages (5 files - 3 tokens)

- [ ] **login.vue** - 1 token (`--background-light`)
- [ ] **register.vue** - 1 token (`--background-light`)
- [ ] **forgot-password.vue** - 1 token (`--background-light`)
- [ ] **reset-password.vue** - 1 token (`--background-light`)
- [ ] **auth/callback.vue** - 1 token (`--background-light`)
- [ ] **auth/google-callback.vue** - 1 token (`--color-primary`)
- [ ] **doctors/index.vue** - 2 tokens

### Legal/Content Pages with SCSS (6 pages - ~60 tokens)

**Pattern**: These use SCSS variables like `$color-primary` that need converting to `var(--accent-primary)`

- [ ] **faq.vue** - ~15 SCSS variables
  - `$color-primary`, `$background-light`, `darken()` functions
  - Note: Has `darken($color-primary, 15%)` - replace with `--accent-primary-hover`

- [ ] **privacy-policy.vue** - ~10 SCSS variables
  - Legal page styling

- [ ] **terms-of-service.vue** - ~10 SCSS variables
  - Legal page styling

- [ ] **return-policy.vue** - ~8 SCSS variables
  - Legal page styling

- [ ] **shipping-policy.vue** - ~8 SCSS variables
  - Legal page styling

- [ ] **medical-disclaimer.vue** - ~9 SCSS variables
  - Legal page styling

### Glossary Pages with SCSS (2 pages)

- [ ] **glossary/index.vue** - ~15 SCSS variables
  - Complex styling with `rgba($color-primary, 0.3)` patterns
  - Replace with CSS custom properties

- [ ] **glossary/[slug].vue** - ~3 tokens
  - `--color-primary`, `--border-color`

### Content Pages

- [ ] **contact.vue** - ~15 SCSS variables
  - Remaining SCSS tokens (some already migrated to CSS vars)
  - `$color-primary`, `$background-light`, `darken()` functions

### Components with SCSS (3 files)

- [ ] **LegalPage.vue** - ~8 SCSS variables
  - Reusable legal page component

- [ ] **IndexSection.vue** - 2 SCSS variables
  - `$background-light`, `$border-color`

- [ ] **PageHero.vue** - SCSS gradient with `darken()`
  - `linear-gradient(135deg, $color-primary 0%, darken($color-primary, 15%) 100%)`
  - Replace with CSS custom properties or keep as brand gradient

### Special Cases

- [ ] **booking.vue** - 1 token
  - Uses gradient: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))`
  - Keep as brand gradient or migrate to semantic

---

## 📊 Migration Statistics

- **Total Files**: ~40 files
- **Completed**: 4 files (10%)
- **Remaining**: 36 files (90%)
- **Estimated Tokens**: ~180 legacy tokens to migrate

### By Priority
- 🔴 **High Priority**: 3 files (38 tokens) - E-commerce critical paths
- 🟡 **Medium Priority**: 5 files (36 tokens) - Booking/detail pages
- 🟢 **Low Priority**: 28 files (~106 tokens) - Legal, auth, content pages

---

## 🎯 Recommended Approach

1. **Phase 1 - Critical E-commerce** (Next)
   - checkout.vue
   - CartPage.vue
   - products/[slug].vue

2. **Phase 2 - Quick Wins**
   - All small pages (orders, wishlist, blog, auth)

3. **Phase 3 - Legal Pages**
   - Batch convert all legal pages with SCSS
   - Use multi-replace for efficiency

4. **Phase 4 - Components & Special Cases**
   - LegalPage, IndexSection, PageHero
   - Booking gradients

---

## 🔍 Testing Checklist

After migration, test each page in:
- [ ] Light theme
- [ ] Dark theme
- [ ] Mobile viewport
- [ ] Desktop viewport

**Note**: All legacy tokens have backward compatibility, so nothing will break during migration.
