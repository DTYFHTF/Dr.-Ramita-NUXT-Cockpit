# Design Token System

## Overview

This project uses a **Brand → Semantic → Theme** mapping pattern, similar to modern design systems used by Stripe, Vercel, and Shopify. This architecture ensures:

- **Theme consistency**: Colors adapt automatically between light and dark modes
- **Maintainability**: Change colors in one place, update everywhere
- **Scalability**: Easy to add new themes or modify existing ones
- **Component isolation**: Components use semantic tokens, not raw colors

---

## Token Architecture

### 1. Brand Tokens (Theme-Agnostic)
Located in `assets/scss/variables.scss`

These are your core brand colors that **never change between themes**:

```scss
$brand-forest: #2a4d3a;    // Primary brand green
$brand-sage: #6b9c7d;      // Secondary brand green  
$brand-mint: #87c5a4;      // Accent green
$brand-teal: #2D7B7B;      // Action color
```

**Rule**: Components should NOT use these directly.

### 2. Semantic Tokens (Theme-Aware)
Located in `assets/scss/main.scss`

These are CSS custom properties that components should use:

#### Surface Tokens (Backgrounds)
| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--surface-base` | #ffffff | #0f1512 | Page background |
| `--surface-primary` | #ffffff | #161d19 | Cards, modals |
| `--surface-secondary` | #f8faf9 | #1e2721 | Subtle sections |
| `--surface-muted` | #f0f5f2 | #1e2721 | Disabled areas |
| `--surface-hover` | #f0f5f2 | #262f29 | Hover states |

#### Text Tokens
| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--text-primary` | #1a2e23 | #ecf0ed | Headings, body |
| `--text-secondary` | #4a5d52 | #a8b5ac | Supporting text |
| `--text-muted` | #6b7c72 | #7a8a7e | Hints, disabled |
| `--text-placeholder` | #94a39a | #5c6b5f | Input placeholders |
| `--text-inverse` | #ffffff | #0f1512 | Text on dark bg |

#### Border Tokens
| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--border-default` | #dce5df | #2e3a32 | Standard borders |
| `--border-muted` | #e8efe9 | #252f28 | Subtle dividers |
| `--border-emphasis` | #c4d4ca | #3d4a41 | Emphasized borders |

#### Accent Tokens
| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--accent-primary` | #2a4d3a | #6ee7a0 | Primary accent |
| `--accent-secondary` | #6b9c7d | #8bc9a8 | Secondary accent |
| `--accent-soft` | #87c5a4 | #a7d5c4 | Soft accent |

#### Action Tokens (Interactive Elements)
| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--action-primary` | #2D7B7B | #2dd4bf | Primary buttons |
| `--action-primary-hover` | darker | #14b8a6 | Button hover |
| `--action-primary-text` | #ffffff | #0f1512 | Button text |

#### Status Tokens
| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--status-success` | #059669 | #34d399 | Success states |
| `--status-error` | #dc2626 | #f87171 | Error states |
| `--status-warning` | #d97706 | #fbbf24 | Warning states |

#### Shadow Tokens
| Token | Description |
|-------|-------------|
| `--shadow-sm` | Subtle shadow for small elements |
| `--shadow-md` | Medium shadow for cards |
| `--shadow-lg` | Large shadow for modals/dropdowns |
| `--shadow-xl` | Extra large for important elements |

---

## Usage Guidelines

### ✅ DO: Use Semantic Tokens

```scss
.card {
  background: var(--surface-primary);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-md);
  
  h2 {
    color: var(--text-primary);
  }
  
  p {
    color: var(--text-secondary);
  }
}

.btn-primary {
  background: var(--action-primary);
  color: var(--action-primary-text);
  
  &:hover {
    background: var(--action-primary-hover);
  }
}
```

### ❌ DON'T: Use Brand Tokens Directly

```scss
// BAD - These won't adapt to dark mode
.card {
  background: $brand-forest;  // ❌
  color: $text-primary;       // ❌
}

// ALSO BAD - Hardcoded colors
.card {
  background: #2a4d3a;        // ❌
  color: #101e16;             // ❌
}
```

### Hero Sections with Fixed Brand Colors

For hero sections with gradient backgrounds, use `--brand-*` tokens directly:

```scss
.hero-section {
  // Brand tokens are fine here since we want consistent branding
  background: linear-gradient(135deg, var(--brand-forest) 0%, #1e3624 100%);
  color: white;  // Fixed white text on brand background
}
```

---

## Dark Mode Design Philosophy

Our dark mode follows the **Charcoal + Sage** palette, inspired by modern apps like Stripe and Vercel:

- **Not neon**: Accent colors are muted and readable, not bright/saturated
- **Subtle contrast**: Surfaces use charcoal tones with slight green undertones
- **Readable text**: High contrast without being harsh on the eyes
- **Consistent brand**: Green accents remain identifiable but adapted

---

## Legacy Support

For backward compatibility, legacy variables are mapped to semantic tokens:

```scss
// These still work but prefer semantic tokens
--color-primary: var(--accent-primary);
--background-white: var(--surface-primary);
--background-light: var(--surface-muted);
--border-color: var(--border-default);
```

---

## Adding New Components

When creating new components:

1. **Always use CSS custom properties** (semantic tokens)
2. **Never hardcode colors** - use `var(--token-name)`
3. **Test both themes** - verify light and dark mode appearance
4. **Follow the hierarchy**: background → surface, text → text tokens

Example new component:

```vue
<style scoped lang="scss">
.my-component {
  background: var(--surface-primary);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  padding: 1.5rem;
  
  .title {
    color: var(--text-primary);
    font-weight: 600;
  }
  
  .description {
    color: var(--text-secondary);
  }
  
  .action-btn {
    background: var(--action-primary);
    color: var(--action-primary-text);
    
    &:hover {
      background: var(--action-primary-hover);
      box-shadow: var(--shadow-md);
    }
  }
}
</style>
```

---

## Files Changed

- `assets/scss/variables.scss` - Brand tokens and primitives
- `assets/scss/main.scss` - Semantic token definitions and theme mappings
- Key pages updated: about.vue, contact.vue
- Key components updated: Footer.vue

## Migration Notes

Some legacy pages still use SCSS variables (`$color-primary`, etc.). These work due to backward compatibility mappings, but should be gradually migrated to CSS custom properties for full dark mode support.
