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
        {{ loading ? 'Registering...' : 'Register Now' }}
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
  error.value = ''
  success.value = ''
  loading.value = true
  
  try {
    const config = useRuntimeConfig()
    const { useAuthApi } = await import('@/composables/useApi')
    const authApi = useAuthApi()
    
    // Step 1: Create registration
    const registrationResponse = await authApi.post(
      `events/${props.eventSlug}/register`,
      userStore.token,
      { phone: form.value.phone || null }
    )
    
    if (!registrationResponse?.data) {
      throw new Error('Invalid registration response')
    }

    const { registration_id, requires_payment, status } = registrationResponse.data
    
    // Step 2: If payment required, initiate payment flow
    if (requires_payment && status === 'pending') {
      success.value = 'Registration created. Initiating payment...'
      
      // Create payment order for this registration
      await initiateEnrollmentPayment(registration_id, 'event')
    } else {
      // Free event - registration confirmed
      success.value = registrationResponse.message || 'Registration successful!'
      emit('registration-success', registrationResponse)
      
      // Refresh after delay
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.reload()
        }
      }, 1500)
    }
  } catch (e) {
    if (e?.status === 401) {
      error.value = 'Session expired. Please log in again.'
      userStore.logout()
      setTimeout(() => navigateTo('/login'), 1000)
    } else if (e?.data?.message) {
      error.value = e.data.message
    } else {
      error.value = e.message || 'Registration failed. Please try again.'
    }
    loading.value = false
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
      success.value = verifyResponse.message || 'Payment successful! Registration confirmed.'
      emit('registration-success', verifyResponse)
      
      // Refresh page to show confirmed registration
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.reload()
        }
      }, 2000)
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
</style>
