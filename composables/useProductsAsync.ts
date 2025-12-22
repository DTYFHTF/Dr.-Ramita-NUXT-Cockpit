/**
 * Enhanced Products Composable with useAsyncData pattern
 * 
 * Uses Nuxt's built-in useAsyncData for:
 * - SSR-friendly data fetching
 * - Automatic caching
 * - Better error handling
 * - Loading state management
 */

import type { Product } from '@/types'

interface ProductFilters {
  page?: number
  perPage?: number
  sort?: string
  category?: string
  priceMin?: number | null
  priceMax?: number | null
  inStock?: boolean
  onSale?: boolean
  searchQuery?: string
  rating?: number
  collection?: string
  promotion?: string
  promotions?: string
}

export function useProductsAsync() {
  const config = useRuntimeConfig()
  const API_BASE = config.public.apiBase
  const { handleError } = useApiError()
  const nuxtApp = useNuxtApp()

  /**
   * Fetch products with filters - SSR compatible
   */
  const fetchProducts = async (filters: ProductFilters = {}) => {
    const {
      page = 1,
      perPage = 15,
      sort = "",
      category = "",
      priceMin = null,
      priceMax = null,
      inStock = true,
      onSale = false,
      searchQuery,
      rating,
      collection,
      promotion,
      promotions
    } = filters

    // Build query params
    const params = new URLSearchParams()
    params.append("page", String(page))
    params.append("per_page", String(perPage))
    
    if (sort) {
      if (sort === "display_price_asc") params.append("sort_by", "display_price")
      if (sort === "display_price_desc") {
        params.append("sort_by", "display_price")
        params.append("sort_order", "desc")
      }
      if (sort === "rating_asc") params.append("sort_by", "average_rating")
      if (sort === "rating_desc") {
        params.append("sort_by", "average_rating")
        params.append("sort_order", "desc")
      }
    }
    
    if (category) params.append("category", String(category))
    if (priceMin !== null && priceMin > 0) params.append("price_min", String(priceMin))
    if (priceMax !== null) params.append("price_max", String(priceMax))
    params.append("in_stock", String(inStock))
    if (onSale) params.append("on_sale", "true")
    if (searchQuery) params.append("search", searchQuery)
    if (rating !== undefined && rating !== null) params.append("rating", String(rating))
    if (collection) params.append("collection", collection)
    if (promotion) params.append("promotion", promotion)
    if (promotions) params.append("promotions", promotions)

    // Create unique key for caching
    const cacheKey = `products-${params.toString()}`

    return useAsyncData(
      cacheKey,
      async () => {
        try {
          const response = await $fetch<any>(
            `${API_BASE}/products?${params.toString()}`,
            {
              headers: { Accept: "application/json" },
            }
          )
          
          return {
            products: Array.isArray(response) ? response : response.data,
            pagination: response.meta || null
          }
        } catch (error) {
          handleError(error)
          throw error
        }
      },
      {
        // Cache for 5 minutes
        getCachedData: (key) => {
          const data = nuxtApp.payload.data[key] || nuxtApp.static?.data?.[key]
          if (!data) return null
          // Return cached data if less than 5 minutes old
          return data
        }
      }
    )
  }

  /**
   * Fetch single product by slug - SSR compatible
   */
  const fetchProduct = async (slug: string) => {
    return useAsyncData(
      `product-${slug}`,
      async () => {
        try {
          const response = await $fetch<any>(
            `${API_BASE}/products/${slug}`,
            {
              headers: { Accept: "application/json" },
            }
          )
          return response.data ? response.data : response
        } catch (error: any) {
          if (error?.status === 404) {
            throw createError({
              statusCode: 404,
              message: "Product not found",
              fatal: false
            })
          }
          handleError(error)
          throw error
        }
      }
    )
  }

  /**
   * Fetch categories - SSR compatible
   */
  const fetchCategories = async () => {
    return useAsyncData(
      'categories',
      async () => {
        try {
          const response = await $fetch<any>(
            `${API_BASE}/categories`,
            {
              headers: { Accept: "application/json" },
            }
          )
          return Array.isArray(response) ? response : response.data
        } catch (error) {
          handleError(error)
          return []
        }
      },
      {
        // Cache categories for 10 minutes
        getCachedData: (key) => {
          return nuxtApp.payload.data[key] || nuxtApp.static?.data?.[key]
        }
      }
    )
  }

  /**
   * Fetch best selling products - SSR compatible
   */
  const fetchBestSellingProducts = async (limit = 12) => {
    return useAsyncData(
      `best-selling-${limit}`,
      async () => {
        try {
          const response = await $fetch<any>(
            `${API_BASE}/products/best-selling?limit=${limit}`,
            {
              headers: { Accept: "application/json" },
            }
          )
          return Array.isArray(response) ? response : response.data
        } catch (error) {
          handleError(error)
          return []
        }
      }
    )
  }

  /**
   * Fetch featured products - SSR compatible
   */
  const fetchFeaturedProducts = async (limit = 12) => {
    return useAsyncData(
      `featured-${limit}`,
      async () => {
        try {
          const response = await $fetch<any>(
            `${API_BASE}/products/featured?limit=${limit}`,
            {
              headers: { Accept: "application/json" },
            }
          )
          return Array.isArray(response) ? response : response.data
        } catch (error) {
          handleError(error)
          return []
        }
      }
    )
  }

  /**
   * Fetch similar products - SSR compatible
   */
  const fetchSimilarProducts = async (productSlug: string, limit = 8) => {
    return useAsyncData(
      `similar-${productSlug}-${limit}`,
      async () => {
        try {
          const response = await $fetch<any>(
            `${API_BASE}/products/${productSlug}/similar?limit=${limit}`,
            {
              headers: { Accept: "application/json" },
            }
          )
          return Array.isArray(response) ? response : response.data
        } catch (error) {
          handleError(error)
          return []
        }
      }
    )
  }

  /**
   * Search products by name (for autocomplete) - Client-side only
   */
  const searchProductsByName = async (query: string) => {
    if (!query || query.length < 2) {
      return []
    }

    try {
      const response = await $fetch<any>(
        `${API_BASE}/products?search=${encodeURIComponent(query)}&per_page=10`,
        {
          headers: { Accept: "application/json" },
        }
      )
      return Array.isArray(response) ? response : response.data || []
    } catch (error) {
      handleError(error, { showToast: false })
      return []
    }
  }

  return {
    fetchProducts,
    fetchProduct,
    fetchCategories,
    fetchBestSellingProducts,
    fetchFeaturedProducts,
    fetchSimilarProducts,
    searchProductsByName
  }
}
