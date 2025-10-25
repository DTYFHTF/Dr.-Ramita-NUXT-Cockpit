import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

export interface PaymentOrderData {
  payment_id: number
  key_id: string
  order_id: string
  amount: number
  currency: string
  expires_at: string
}

export interface PaymentVerificationData {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

export interface PaymentResult {
  success: boolean
  payment_id?: number
  status?: string
  message?: string
  error?: string
}

export interface UsePaymentOptions {
  onSuccess?: (result: PaymentResult) => void
  onError?: (error: Error | string) => void
  onCancel?: () => void
}

export const usePayment = (options: UsePaymentOptions = {}) => {
  const config = useRuntimeConfig()
  const userStore = useUserStore()
  const isProcessing = ref(false)
  const error = ref<string | null>(null)
  const currentPaymentId = ref<number | null>(null)

  /**
   * Load Razorpay checkout script dynamically.
   */
  const loadRazorpayScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'))
      document.head.appendChild(script)
    })
  }

  /**
   * Create a payment order on the server.
   */
  const createPaymentOrder = async (
    payableType: string,
    payableId: number,
    amountCents: number,
    metadata: Record<string, any> = {},
    ttlMinutes: number = 15
  ): Promise<PaymentOrderData> => {
    try {
      isProcessing.value = true
      error.value = null

      const response = await $fetch<{ success: boolean; data: PaymentOrderData }>(
        `${config.public.apiBase}/payments/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${userStore.token}`,
          },
          credentials: 'include',
          body: {
            payable_type: payableType,
            payable_id: payableId,
            amount_cents: amountCents,
            ttl_minutes: ttlMinutes,
            metadata,
          },
        }
      )

      if (!response.success || !response.data) {
        throw new Error('Failed to create payment order')
      }

      currentPaymentId.value = response.data.payment_id

      return response.data
    } catch (err: any) {
      const errorMessage = err?.data?.message || err.message || 'Failed to create payment order'
      error.value = errorMessage
      
      // If error is about existing pending payment, try to fetch it
      if (errorMessage.includes('pending payment already exists')) {
        throw new Error('PENDING_PAYMENT_EXISTS')
      }
      
      throw new Error(errorMessage)
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Get existing pending payment for a resource.
   */
  const getPendingPayment = async (
    payableType: string,
    payableId: number
  ): Promise<PaymentOrderData | null> => {
    try {
      const response = await $fetch<{ success: boolean; data: PaymentOrderData }>(
        `${config.public.apiBase}/payments/pending/${encodeURIComponent(payableType)}/${payableId}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${userStore.token}`,
          },
          credentials: 'include',
        }
      )

      if (response.success && response.data) {
        currentPaymentId.value = response.data.payment_id
        return response.data
      }

      return null
    } catch (err: any) {
      // No pending payment found is not an error
      return null
    }
  }

  /**
   * Cancel a pending payment.
   */
  const cancelPayment = async (paymentId: number): Promise<boolean> => {
    try {
      const response = await $fetch<{ success: boolean }>(
        `${config.public.apiBase}/payments/${paymentId}/cancel`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${userStore.token}`,
          },
          credentials: 'include',
        }
      )

      return response.success
    } catch (err: any) {
      return false
    }
  }

  /**
   * Verify payment after Razorpay checkout success.
   */
  const verifyPayment = async (
    paymentId: number,
    verificationData: PaymentVerificationData
  ): Promise<PaymentResult> => {
    try {
      isProcessing.value = true
      error.value = null

      const response = await $fetch<{ success: boolean; data?: any; message?: string }>(
        `${config.public.apiBase}/payments/${paymentId}/verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${userStore.token}`,
          },
          credentials: 'include',
          body: verificationData,
        }
      )

      if (!response.success) {
        throw new Error(response.message || 'Payment verification failed')
      }

      return {
        success: true,
        payment_id: response.data?.payment_id,
        status: response.data?.status,
        message: response.message,
      }
    } catch (err: any) {
      const errorMessage = err?.data?.message || err.message || 'Payment verification failed'
      error.value = errorMessage
      return {
        success: false,
        error: errorMessage,
      }
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Open Razorpay checkout and handle payment flow.
   */
  const processPayment = async (
    payableType: string,
    payableId: number,
    amountCents: number,
    {
      customerName,
      customerEmail,
      customerPhone,
      description,
      metadata = {},
      ttlMinutes = 15,
    }: {
      customerName?: string
      customerEmail?: string
      customerPhone?: string
      description?: string
      metadata?: Record<string, any>
      ttlMinutes?: number
    } = {}
  ): Promise<PaymentResult> => {
    try {
      isProcessing.value = true
      error.value = null

      // Load Razorpay script
      await loadRazorpayScript()

      // Try to create order on server
      let orderData: PaymentOrderData
      try {
        orderData = await createPaymentOrder(
          payableType,
          payableId,
          amountCents,
          metadata,
          ttlMinutes
        )
      } catch (err: any) {
        // If pending payment exists, try to fetch and reuse it
        if (err.message === 'PENDING_PAYMENT_EXISTS') {
          const existingPayment = await getPendingPayment(payableType, payableId)
          if (existingPayment) {
            orderData = existingPayment
          } else {
            throw new Error('Unable to retrieve existing payment')
          }
        } else {
          throw err
        }
      }

      // Open Razorpay checkout
      return new Promise((resolve) => {
        // Ensure key_id is available, fallback to config if not in orderData
        const razorpayKey = orderData.key_id || config.public.razorpayKeyId
        
        if (!razorpayKey) {
          const keyError = 'Razorpay key not configured'
          error.value = keyError
          options.onError?.(keyError)
          isProcessing.value = false
          resolve({ success: false, error: keyError })
          return
        }

        const razorpayOptions = {
          key: razorpayKey,
          amount: orderData.amount,
          currency: orderData.currency,
          order_id: orderData.order_id,
          name: 'Dr. Ramita Ayurveda',
          description: description || 'Payment',
          prefill: {
            name: customerName,
            email: customerEmail,
            contact: customerPhone,
          },
          handler: async (response: any) => {
            // Verify payment on server
            const verificationData: PaymentVerificationData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }

            const result = await verifyPayment(orderData.payment_id, verificationData)

            if (result.success) {
              options.onSuccess?.(result)
            } else {
              options.onError?.(result.error || 'Payment verification failed')
            }

            isProcessing.value = false
            resolve(result)
          },
          modal: {
            ondismiss: () => {
              isProcessing.value = false
              options.onCancel?.()
              resolve({
                success: false,
                error: 'Payment cancelled by user',
              })
            },
          },
          theme: {
            color: '#10b981', // Green color matching ayurveda theme
          },
        }

        const razorpay = new (window as any).Razorpay(razorpayOptions)
        razorpay.open()
      })
    } catch (err: any) {
      isProcessing.value = false
      const errorMessage = err.message || 'Payment processing failed'
      error.value = errorMessage
      options.onError?.(errorMessage)
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  return {
    isProcessing: computed(() => isProcessing.value),
    error: computed(() => error.value),
    currentPaymentId: computed(() => currentPaymentId.value),
    processPayment,
    createPaymentOrder,
    verifyPayment,
    getPendingPayment,
    cancelPayment,
    loadRazorpayScript,
  }
}
