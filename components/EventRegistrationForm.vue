<template>
  <div class="event-registration-wrapper">
    <!-- Show login prompt if not authenticated -->
    <div v-if="!userStore.token" class="auth-required-message">
      <p class="message-text">
        <LucideIcon name="Lock" :size="20" />
        Please log in to register for this event
      </p>
      <div class="auth-actions">
        <NuxtLink to="/login" class="btn btn-smooth-success">
          Log In
        </NuxtLink>
        <NuxtLink to="/register" class="btn btn-outline">
          Register
        </NuxtLink>
      </div>
    </div>

    <!-- Show registration form if authenticated -->
    <form v-else @submit.prevent="submitForm" class="event-registration-form">
      <div class="form-group">
        <label for="phone" class="form-label">Phone (Optional)</label>
        <input 
          v-model="form.phone" 
          id="phone" 
          type="text" 
          class="form-input"
          placeholder="Enter your phone number"
          maxlength="20" 
          :disabled="loading" 
        />
      </div>
      <div v-if="error" class="form-error">{{ error }}</div>
      <div v-if="success" class="form-success">{{ success }}</div>
      <button type="submit" class="btn btn-smooth-success" :disabled="loading">
        <span v-if="loading" class="d-flex align-items-center justify-content-center gap-2">
          <span class="spinner-small"></span>
          Processing...
        </span>
        <span v-else>Register Now</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  eventId: {
    type: [String, Number],
    required: false
  },
  eventSlug: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['registration-success'])
const userStore = useUserStore()

const form = ref({
  phone: ''
})
const loading = ref(false)
const error = ref('')
const success = ref('')

// Pre-fill phone if user is logged in
onMounted(() => {
  if (userStore.user?.phone) {
    form.value.phone = userStore.user.phone
  }
  
  // Load Razorpay script
  loadRazorpayScript()
})

const loadRazorpayScript = () => {
  if (typeof window !== 'undefined' && window.Razorpay) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'))
    document.head.appendChild(script)
  })
}

const submitForm = async () => {
  // Clear previous messages
  error.value = ''
  success.value = ''
  loading.value = true
  
  try {
    const config = useRuntimeConfig()
    const { useAuthApi } = await import('@/composables/useApi')
    const authApi = useAuthApi()
    
    // Step 1: Create registration or get event details for payment
    const registrationResponse = await authApi.post(
      `events/${props.eventSlug}/register`,
      userStore.token,
      { phone: form.value.phone || null }
    )
    
    if (!registrationResponse?.data) {
      throw new Error('Invalid registration response')
    }

    const responseData = registrationResponse.data
    
    // Step 2: If payment required, initiate payment flow
    if (responseData.requires_payment) {
      // For paid events, open payment gateway
      // Keep loading true, initiateEventPayment will handle state changes
      await initiateEventPayment(responseData.event_id, responseData.event_slug, responseData.price, form.value.phone)
    } else {
      // Free event - registration confirmed immediately
      loading.value = false
      success.value = `🎉 Successfully registered for "${responseData.event_title}"!`
      emit('registration-success', {
        success: true,
        event_title: responseData.event_title,
        message: `Successfully registered for ${responseData.event_title}`
      })
      
      setTimeout(() => {
        navigateTo('/dashboard?tab=events')
      }, 3000)
    }
  } catch (e) {
    loading.value = false
    
    if (e?.status === 401) {
      error.value = '🔒 Session expired. Please log in again.'
      userStore.logout()
      setTimeout(() => navigateTo('/login'), 2000)
    } else if (e?.status === 409) {
      error.value = '✓ You are already registered for this event! Redirecting to your events...'
      setTimeout(() => navigateTo('/dashboard?tab=events'), 2500)
    } else if (e?.data?.message) {
      error.value = e.data.message
    } else {
      error.value = e.message || 'Registration failed. Please try again.'
    }
  }
}

const initiateEventPayment = async (eventId, eventSlug, price, phone) => {
  try {
    // Clear any previous messages before opening payment
    error.value = ''
    success.value = 'Opening payment gateway...'
    
    const config = useRuntimeConfig()
    const { useAuthApi } = await import('@/composables/useApi')
    const authApi = useAuthApi()
    
    // Create payment order for event using unified enrollment payment endpoint
    const paymentResponse = await authApi.post(
      'enrollments/payments/create',
      userStore.token,
      {
        registration_type: 'event',
        event_id: eventId,
        event_slug: eventSlug,
        phone: phone
      }
    )
    
    if (!paymentResponse.success) {
      throw new Error(paymentResponse.error || 'Failed to create payment order')
    }
    
    // Clear success message before opening Razorpay modal
    success.value = ''
    
    // Open Razorpay checkout
    const razorpayOptions = {
      key: paymentResponse.key_id || config.public.razorpayKeyId,
      amount: paymentResponse.amount,
      currency: paymentResponse.currency,
      order_id: paymentResponse.razorpay_order_id,
      name: 'Dr. Ramita Ayurveda',
      description: `Event Registration: ${paymentResponse.item_name}`,
      prefill: {
        name: paymentResponse.user.name,
        email: paymentResponse.user.email,
        contact: paymentResponse.user.contact,
      },
      handler: async (razorpayResponse) => {
        // Payment successful, verify and create registration
        await verifyEventPayment(
          eventId, 
          eventSlug, 
          phone, 
          paymentResponse.payment_id, 
          razorpayResponse
        )
      },
      modal: {
        ondismiss: () => {
          // User closed the payment modal without completing
          success.value = ''
          error.value = 'Payment cancelled. Please try again to complete your registration.'
          loading.value = false
        },
      },
      theme: {
        color: '#10b981',
      },
    }
    
    const razorpay = new window.Razorpay(razorpayOptions)
    razorpay.open()
    
  } catch (e) {
    loading.value = false
    success.value = ''
    error.value = e?.data?.error || e.message || 'Failed to initiate payment'
  }
}

const verifyEventPayment = async (eventId, eventSlug, phone, paymentId, razorpayResponse) => {
  try {
    // Clear messages and show verifying state
    error.value = ''
    success.value = 'Verifying payment...'
    
    const { useAuthApi } = await import('@/composables/useApi')
    const authApi = useAuthApi()
    const userStore = useUserStore()
    
    const verifyResponse = await authApi.post(
      'enrollments/payments/verify',
      userStore.token,
      {
        registration_type: 'event',
        event_id: eventId,
        event_slug: eventSlug,
        phone: phone,
        payment_id: paymentId,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
      }
    )
    
    if (verifyResponse.success) {
      loading.value = false
      success.value = '✅ Payment successful! Registration confirmed.'
      
      emit('registration-success', {
        success: true,
        message: 'Payment successful! Registration confirmed.',
        event_title: verifyResponse.event_title
      })
      
      setTimeout(() => {
        navigateTo('/dashboard?tab=events')
      }, 2000)
    } else {
      throw new Error(verifyResponse.message || 'Payment verification failed')
    }
    
  } catch (e) {
    loading.value = false
    success.value = ''
    error.value = e?.data?.message || e.message || 'Payment verification failed. Please contact support.'
  }
}

const initiateEnrollmentPayment = async (registrationId, registrationType) => {
  try {
    const config = useRuntimeConfig()
    const { useAuthApi } = await import('@/composables/useApi')
    const authApi = useAuthApi()
    
    // Create payment order
    const paymentResponse = await authApi.post(
      'enrollments/payments/create',
      userStore.token,
      {
        registration_id: registrationId,
        registration_type: registrationType
      }
    )
    
    if (!paymentResponse.success) {
      throw new Error('Failed to create payment order')
    }
    
    const {
      payment_id,
      razorpay_order_id,
      amount,
      currency,
      key_id,
      user,
      item_name
    } = paymentResponse
    
    // Open Razorpay checkout
    const razorpayOptions = {
      key: key_id || config.public.razorpayKeyId,
      amount: amount,
      currency: currency,
      order_id: razorpay_order_id,
      name: 'Dr. Ramita Ayurveda',
      description: `Event Registration: ${item_name}`,
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.contact,
      },
      handler: async (response) => {
        // Payment successful, verify it
        await verifyEnrollmentPayment(registrationId, registrationType, response)
      },
      modal: {
        ondismiss: () => {
          error.value = 'Payment cancelled. Your registration is pending payment.'
          loading.value = false
        },
      },
      theme: {
        color: '#10b981',
      },
    }
    
    const razorpay = new window.Razorpay(razorpayOptions)
    razorpay.open()
  } catch (e) {
    error.value = e?.data?.error || e.message || 'Failed to initiate payment'
    loading.value = false
  }
}

const verifyEnrollmentPayment = async (registrationId, registrationType, razorpayResponse) => {
  try {
    const config = useRuntimeConfig()
    const { useAuthApi} = await import('@/composables/useApi')
    const authApi = useAuthApi()
    
    const verifyResponse = await authApi.post(
      'enrollments/payments/verify',
      userStore.token,
      {
        registration_id: registrationId,
        registration_type: registrationType,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
      }
    )
    
    if (verifyResponse.success) {
      success.value = '✅ Payment successful! Registration confirmed.'
      emit('registration-success', {
        success: true,
        message: 'Payment successful! Registration confirmed.'
      })
      
      // Redirect to dashboard my events tab
      setTimeout(() => {
        navigateTo('/dashboard?tab=events')
      }, 3000)
    } else {
      throw new Error(verifyResponse.error || 'Payment verification failed')
    }
  } catch (e) {
    error.value = e?.data?.error || e.message || 'Payment verification failed'
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.event-registration-wrapper {
  width: 100%;
}

.auth-required-message {
  text-align: center;
  padding: 2rem;
  background: rgba(var(--primary-rgb), 0.05);
  border-radius: 12px;
  border: 2px dashed var(--primary);

  .message-text {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--text-primary);
  }

  .auth-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn {
    min-width: 120px;
  }
}

.event-registration-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-error {
  color: var(--color-error);
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  border-left: 4px solid var(--color-error);
}

.form-success {
  color: var(--color-success);
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.75rem;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 8px;
  border-left: 4px solid var(--color-success);
}

.spinner-small {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.d-flex {
  display: flex;
}

.align-items-center {
  align-items: center;
}

.justify-content-center {
  justify-content: center;
}

.gap-2 {
  gap: 0.5rem;
}
</style>
