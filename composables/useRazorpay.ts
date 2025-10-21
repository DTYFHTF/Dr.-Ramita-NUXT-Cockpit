/**
 * Razorpay Payment Gateway Composable
 * Handles payment initialization and verification
 */

export const useRazorpay = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const razorpayKeyId = config.public.razorpayKeyId

  /**
   * Initialize Razorpay payment
   */
  const initiatePayment = async (
    orderData: any,
    onSuccess: (response: any) => void,
    onError: (error: any) => void
  ) => {
    try {
      // Check if Razorpay is loaded
      if (typeof (window as any).Razorpay === 'undefined') {
        throw new Error('Razorpay SDK not loaded. Please refresh the page.')
      }

      const options = {
        key: razorpayKeyId,
        amount: orderData.amount, // Amount in paise
        currency: orderData.currency || 'INR',
        name: 'Rishi Store',
        description: 'Authentic Eco-friendly hand-crafted Products made with love',
        order_id: orderData.razorpay_order_id,
        handler: function (response: any) {
          // Payment successful - verify on backend
          onSuccess(response)
        },
        prefill: {
          name: orderData.user.name,
          email: orderData.user.email,
          contact: orderData.user.contact
        },
        notes: {
          order_id: orderData.order_id
        },
        theme: {
          color: '#10b981' // Your success green color
        },
        modal: {
          ondismiss: function() {
            onError({ message: 'Payment cancelled by user' })
          },
          escape: false,
          backdropclose: false
        }
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()

    } catch (error) {
      console.error('Razorpay initialization error:', error)
      onError(error)
    }
  }

  /**
   * Verify payment on backend
   */
  const verifyPayment = async (orderId: number, paymentResponse: any, token: string) => {
    try {
      const response = await $fetch<{ success: boolean; order: any }>(`${apiBase}/payments/verify/${orderId}`, {
        method: 'POST',
        body: {
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_signature: paymentResponse.razorpay_signature
        },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })

      return {
        success: true,
        order: response.order
      }
    } catch (error: any) {
      console.error('Payment verification error:', error)
      return {
        success: false,
        error: error?.data?.error || error?.message || 'Payment verification failed'
      }
    }
  }

  return {
    initiatePayment,
    verifyPayment
  }
}
