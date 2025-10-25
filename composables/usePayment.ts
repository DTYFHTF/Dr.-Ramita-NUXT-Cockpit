import { ref, computed } from 'vue'

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
        `${config.public.apiBaseUrl}/payments/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
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
      throw new Error(errorMessage)
    } finally {
      isProcessing.value = false
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
        `${config.public.apiBaseUrl}/payments/${paymentId}/verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
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

      // Create order on server
      const orderData = await createPaymentOrder(
        payableType,
        payableId,
        amountCents,
        metadata,
        ttlMinutes
      )

      // Open Razorpay checkout
      return new Promise((resolve) => {
        const razorpayOptions = {
          key: orderData.key_id,
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
    loadRazorpayScript,
  }
}
