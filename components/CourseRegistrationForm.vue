<template>
  <div class="course-registration-wrapper">
    <!-- Show login prompt if not authenticated -->
    <div v-if="!userStore.token" class="auth-required-message">
      <p class="message-text">
        <LucideIcon name="Lock" :size="20" />
        Please log in to enroll in this course
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

    <!-- Show enrollment form if authenticated -->
    <form v-else @submit.prevent="submitForm" class="course-registration-form">
      <div class="form-group">
        <label for="phone" class="form-label">Phone (Optional)</label>
        <input 
          v-model="form.phone" 
          id="phone" 
          type="text" 
          class="form-input"
          placeholder="Enter your phone number"
          maxlength="20" 
          :disabled="loading || processingPayment" 
        />
      </div>
      <div v-if="error" class="form-error">
        <LucideIcon name="AlertCircle" :size="20" />
        <span>{{ error }}</span>
      </div>
      <div v-if="success" class="form-success">
        <LucideIcon name="CheckCircle" :size="20" />
        <span>{{ success }}</span>
      </div>
      <button 
        type="submit" 
        class="btn btn-smooth-success" 
        :disabled="loading || processingPayment || enrollmentComplete"
      >
        <span v-if="!loading && !processingPayment && !enrollmentComplete">Enroll Now</span>
        <span v-else-if="processingPayment" class="d-flex align-items-center justify-content-center gap-2">
          <span class="spinner-small"></span>
          Processing Payment...
        </span>
        <span v-else-if="loading" class="d-flex align-items-center justify-content-center gap-2">
          <span class="spinner-small"></span>
          {{ loadingMessage || 'Processing...' }}
        </span>
        <span v-else-if="enrollmentComplete" class="d-flex align-items-center justify-content-center gap-2">
          <LucideIcon name="Check" :size="18" />
          Enrolled Successfully!
        </span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  courseSlug: {
    type: String,
    required: true
  },
  courseId: {
    type: [String, Number],
    required: false
  }
})

const emit = defineEmits(['enrollment-success'])
const userStore = useUserStore()

const form = ref({
  phone: ''
})
const loading = ref(false)
const error = ref('')
const success = ref('')
const processingPayment = ref(false)
const enrollmentComplete = ref(false)
const loadingMessage = ref('')

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
  loadingMessage.value = 'Checking enrollment...'
  enrollmentComplete.value = false
  
  try {
    const config = useRuntimeConfig()
    const { useAuthApi } = await import('@/composables/useApi')
    const authApi = useAuthApi()
    
    // Step 1: Check enrollment eligibility
    const enrollmentResponse = await authApi.post(
      `courses/${props.courseSlug}/enroll`,
      userStore.token,
      { phone: form.value.phone || null }
    )
    
    if (!enrollmentResponse) {
      throw new Error('Invalid enrollment response')
    }

    const { requires_payment, course_id, course_slug, course_title, price } = enrollmentResponse
    
    // Step 2: If payment required, initiate payment flow directly
    if (requires_payment) {
      loading.value = false
      success.value = 'Opening payment gateway...'
      
      // Create payment order linked to Course (NOT registration)
      await initiateCoursePayment(course_id, course_slug, course_title, price)
    } else {
      // Free course - enrollment confirmed immediately
      const { registration_id, status } = enrollmentResponse.data
      enrollmentComplete.value = true
      success.value = `🎉 Successfully enrolled in "${course_title}"!`
      loading.value = false
      
      emit('enrollment-success', { 
        success: true, 
        course_title,
        message: `Successfully enrolled in ${course_title}`
      })
    }
  } catch (e) {
    enrollmentComplete.value = false
    if (e?.status === 401) {
      error.value = '🔒 Session expired. Please log in again.'
      userStore.logout()
      setTimeout(() => navigateTo('/login'), 2000)
    } else if (e?.status === 409) {
      error.value = '✓ You are already enrolled in this course! Redirecting to your courses...'
      setTimeout(() => navigateTo('/my-courses'), 2500)
    } else if (e?.data?.message) {
      error.value = e.data.message
    } else {
      error.value = e.message || 'Enrollment failed. Please try again.'
    }
    loading.value = false
  }
}

const initiateCoursePayment = async (courseId, courseSlug, courseTitle, price) => {
  try {
    processingPayment.value = true
    const config = useRuntimeConfig()
    const { useAuthApi } = await import('@/composables/useApi')
    const authApi = useAuthApi()
    
    // Create payment order linked to Course (payment-first flow)
    const paymentResponse = await authApi.post(
      'enrollments/payments/create',
      userStore.token,
      {
        registration_type: 'course',
        course_id: courseId,
        course_slug: courseSlug,
        phone: form.value.phone || null,
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
    
    // Clear the success message before opening payment gateway
    success.value = ''
    
    // Open Razorpay checkout
    const razorpayOptions = {
      key: key_id || config.public.razorpayKeyId,
      amount: amount,
      currency: currency,
      order_id: razorpay_order_id,
      name: 'E-rishikulum',
      description: `Course Enrollment: ${item_name}`,
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.contact,
      },
      handler: async (response) => {
        // Payment successful, verify it
        await verifyCoursePayment(courseId, courseSlug, payment_id, razorpay_order_id, response)
      },
      modal: {
        ondismiss: () => {
          // Clear all success/loading states
          success.value = ''
          processingPayment.value = false
          enrollmentComplete.value = false
          
          error.value = 'Payment cancelled. Please try again when ready.'
        },
      },
      theme: {
        color: '#10b981',
      },
    }
    
    const razorpay = new window.Razorpay(razorpayOptions)
    razorpay.open()
  } catch (e) {
    success.value = ''
    processingPayment.value = false
    enrollmentComplete.value = false
    error.value = e?.data?.error || e.message || 'Failed to initiate payment'
  }
}

const verifyCoursePayment = async (courseId, courseSlug, paymentId, orderId, razorpayResponse) => {
  try {
    processingPayment.value = true
    loadingMessage.value = 'Verifying payment...'
    
    const config = useRuntimeConfig()
    const { useAuthApi } = await import('@/composables/useApi')
    const authApi = useAuthApi()
    
    const verifyResponse = await authApi.post(
      'enrollments/payments/verify',
      userStore.token,
      {
        registration_type: 'course',
        course_id: courseId,
        course_slug: courseSlug,
        payment_id: paymentId,
        phone: form.value.phone || null,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
      }
    )
    
    if (verifyResponse.success) {
      enrollmentComplete.value = true
      processingPayment.value = false
      success.value = '✅ Payment successful! Enrollment confirmed.'
      
      emit('enrollment-success', {
        success: true,
        message: 'Payment successful! Enrollment confirmed.'
      })
    } else {
      throw new Error(verifyResponse.error || 'Payment verification failed')
    }
  } catch (e) {
    processingPayment.value = false
    enrollmentComplete.value = false
    success.value = ''
    error.value = e?.data?.error || e.message || 'Payment verification failed'
  }
}
</script>

<style lang="scss" scoped>
.course-registration-wrapper {
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

.course-registration-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-error {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-error);
  font-size: 0.875rem;
  font-weight: 500;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  border-left: 4px solid var(--color-error);
}

.form-success {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-success);
  font-size: 0.95rem;
  font-weight: 500;
  padding: 1rem 1.25rem;
  background: rgba(16, 185, 129, 0.15);
  border-radius: 8px;
  border-left: 4px solid var(--color-success);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.spinner-small {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.btn {
  cursor: pointer !important;
  pointer-events: auto !important;
  
  &:not(:disabled) {
    cursor: pointer !important;
  }
  
  &:disabled {
    cursor: not-allowed !important;
    opacity: 0.6;
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
