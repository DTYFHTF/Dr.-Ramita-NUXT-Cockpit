import { ref } from 'vue'

export interface BulkOrderProduct {
  product_id: number | null
  product_name: string
  quantity: number
}

export interface BulkOrderInquiryData {
  name: string
  email: string
  phone: string
  phone_country_code?: string
  company_name?: string
  tax_number?: string
  shipping_address: string
  shipping_area?: string
  shipping_landmark?: string
  shipping_city: string
  shipping_state: string
  shipping_pincode: string
  shipping_country: string
  products: BulkOrderProduct[]
  message?: string
  special_instructions?: string
  expected_delivery_date?: string
  budget_range?: string
}

export function useBulkOrderInquiry() {
  const loading = ref(false)
  const error = ref('')
  const success = ref(false)
  
  const config = useRuntimeConfig()
  const API_BASE = config.public.apiBase
  
  /**
   * Submit bulk order inquiry
   */
  async function submitInquiry(data: BulkOrderInquiryData, token: string) {
    loading.value = true
    error.value = ''
    success.value = false
    
    try {
      const response = await $fetch(`${API_BASE}/bulk-order-inquiries`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      }) as any
      
      success.value = true
      return {
        success: true,
        data: response.data,
        message: response.message
      }
    } catch (e: any) {
      error.value = e?.data?.message || e?.message || 'Failed to submit bulk order inquiry'
      success.value = false
      
      // Return validation errors if available
      return {
        success: false,
        error: error.value,
        errors: e?.data?.errors || null
      }
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Get user's bulk order inquiries
   */
  async function getUserInquiries(token: string) {
    loading.value = true
    error.value = ''
    
    try {
      const response = await $fetch(`${API_BASE}/bulk-order-inquiries`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }) as any
      
      return response.data || []
    } catch (e: any) {
      error.value = e?.data?.message || e?.message || 'Failed to fetch inquiries'
      return []
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Get single inquiry details
   */
  async function getInquiry(id: number, token: string) {
    loading.value = true
    error.value = ''
    
    try {
      const response = await $fetch(`${API_BASE}/bulk-order-inquiries/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }) as any
      
      return response.data
    } catch (e: any) {
      error.value = e?.data?.message || e?.message || 'Failed to fetch inquiry'
      return null
    } finally {
      loading.value = false
    }
  }
  
  return {
    loading,
    error,
    success,
    submitInquiry,
    getUserInquiries,
    getInquiry
  }
}
