import { ref } from 'vue'

const API_BASE = 'http://ayurveda-marketplace.test'

export function useProducts() {
  const products = ref<any[]>([])
  const product = ref<any>(null)
  const loading = ref(false)
  const error = ref('')
  const categories = ref<any[]>([])

  async function fetchProducts() {
    loading.value = true
    error.value = ''
    try {
      const response = await $fetch(`${API_BASE}/api/products`, {
        headers: { Accept: 'application/json' }
      })
      products.value = Array.isArray(response) ? response : response.data
    } catch (e: any) {
      error.value = e?.data?.message || e?.message || 'Failed to fetch products.'
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    try {
      const response = await $fetch(`${API_BASE}/api/categories`, {
        headers: { Accept: 'application/json' }
      })
      categories.value = Array.isArray(response) ? response : response.data
    } catch (e: any) {
      categories.value = []
    }
  }

  async function fetchProduct(slug: string) {
    loading.value = true
    error.value = ''
    product.value = null
    try {
      product.value = await $fetch(`${API_BASE}/api/products/${slug}`, {
        headers: { Accept: 'application/json' }
      })
    } catch (e: any) {
      if (e?.status === 404) {
        error.value = 'Product not found.'
      } else {
        error.value = e?.data?.message || e?.message || 'Failed to fetch product.'
      }
      product.value = null
    } finally {
      loading.value = false
    }
  }

  return { products, product, loading, error, fetchProducts, fetchProduct, categories, fetchCategories }
}
