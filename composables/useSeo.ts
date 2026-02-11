/**
 * SEO Composable - DRY approach for all page SEO meta tags
 * 
 * Provides two helpers:
 * - usePageSeo()  → for static pages (about, faq, policies, etc.)
 * - useDynamicSeo() → for data-driven pages ([slug] pages with async data)
 * 
 * Both handle: title, description, keywords, OG tags, Twitter cards, canonical URL, robots
 */

interface SeoOptions {
  /** Page title (brand name is appended automatically) */
  title: string
  /** Meta description for search engines */
  description: string
  /** Optional keywords (comma-separated) */
  keywords?: string
  /** Canonical URL path (e.g. '/about', '/products/my-product'). Auto-prepends baseUrl. */
  path?: string
  /** OG image path or full URL. Defaults to brand logo. */
  image?: string
  /** OG type - defaults to 'website' */
  ogType?: string
  /** Robots directive - e.g. 'noindex, nofollow' for auth pages */
  robots?: string
  /** Whether to append brand name to title. Defaults to true. */
  appendBrand?: boolean
}

/**
 * Static page SEO - use for pages with known content (about, faq, policies, etc.)
 * 
 * @example
 * usePageSeo({
 *   title: 'About Us',
 *   description: 'Learn about our mission.',
 *   path: '/about'
 * })
 */
export function usePageSeo(options: SeoOptions) {
  const brand = useBrand()
  const config = useRuntimeConfig()
  const baseUrl = config.public.baseUrl || 'https://rishipath.com'

  const fullTitle = options.appendBrand === false
    ? options.title
    : `${options.title} | ${brand.name}`

  const canonicalUrl = options.path
    ? `${baseUrl}${options.path}`
    : baseUrl

  const imageUrl = options.image
    ? (options.image.startsWith('http') ? options.image : `${baseUrl}${options.image}`)
    : `${baseUrl}${brand.logo}`

  const meta: Array<Record<string, string>> = [
    { name: 'description', content: options.description },
    // Open Graph
    { property: 'og:type', content: options.ogType || 'website' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: options.description },
    { property: 'og:image', content: imageUrl },
    { property: 'og:site_name', content: brand.fullName },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: options.description },
    { name: 'twitter:image', content: imageUrl },
  ]

  if (options.keywords) {
    meta.push({ name: 'keywords', content: options.keywords })
  }

  if (options.robots) {
    meta.push({ name: 'robots', content: options.robots })
  }

  useHead({
    title: fullTitle,
    meta,
    link: [
      { rel: 'canonical', href: canonicalUrl }
    ]
  })
}

/**
 * Dynamic page SEO - use for pages with async data ([slug] pages)
 * Automatically handles loading state with fallback title/description.
 * 
 * @example
 * useDynamicSeo(() => {
 *   if (!product.value) return null
 *   return {
 *     title: product.value.name,
 *     description: product.value.description,
 *     path: `/products/${product.value.slug}`,
 *     image: getImageUrl(product.value.image),
 *     ogType: 'product'
 *   }
 * }, {
 *   fallbackTitle: 'Product',
 *   fallbackDescription: 'Shop authentic Ayurvedic products.'
 * })
 */
export function useDynamicSeo(
  getData: () => SeoOptions | null,
  fallback: { fallbackTitle: string; fallbackDescription: string }
) {
  const brand = useBrand()
  const config = useRuntimeConfig()
  const baseUrl = config.public.baseUrl || 'https://rishipath.com'

  useHead(() => {
    const data = getData()

    if (!data) {
      return {
        title: `${fallback.fallbackTitle} | ${brand.name}`,
        meta: [
          { name: 'description', content: fallback.fallbackDescription },
          { property: 'og:site_name', content: brand.fullName },
        ]
      }
    }

    const fullTitle = data.appendBrand === false
      ? data.title
      : `${data.title} | ${brand.name}`

    const canonicalUrl = data.path
      ? `${baseUrl}${data.path}`
      : baseUrl

    const imageUrl = data.image
      ? (data.image.startsWith('http') ? data.image : `${baseUrl}${data.image}`)
      : `${baseUrl}${brand.logo}`

    const meta: Array<Record<string, string>> = [
      { name: 'description', content: data.description },
      // Open Graph
      { property: 'og:type', content: data.ogType || 'article' },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: data.description },
      { property: 'og:image', content: imageUrl },
      { property: 'og:site_name', content: brand.fullName },
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: data.description },
      { name: 'twitter:image', content: imageUrl },
    ]

    if (data.keywords) {
      meta.push({ name: 'keywords', content: data.keywords })
    }

    if (data.robots) {
      meta.push({ name: 'robots', content: data.robots })
    }

    return {
      title: fullTitle,
      meta,
      link: [
        { rel: 'canonical', href: canonicalUrl }
      ]
    }
  })
}

/**
 * Helper to strip HTML tags from a string (useful for CMS content descriptions)
 */
export function stripHtml(html: string | undefined | null): string {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').trim()
}

/**
 * Helper to truncate text to a maximum length for meta descriptions
 */
export function truncateMeta(text: string, maxLength = 160): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3).trim() + '...'
}
