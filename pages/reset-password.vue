<template>
  <div class="reset-password-page d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
    <div class="w-100" style="max-width: 420px;">
      <h2 class="mb-3 text-center fw-bold">Set new password</h2>
      <p class="text-center text-muted mb-4">
        Enter your new password below.
      </p>
      
      <!-- Error message -->
      <ErrorAlert
        v-if="error"
        :message="error"
        type="error"
        :dismissible="true"
        @dismiss="error = ''"
      />
      <div v-if="isRateLimited" class="alert alert-info mt-2 text-center">
        <small>You can try again in a few minutes, or <NuxtLink to="/forgot-password" class="text-primary">request a new reset link</NuxtLink>.</small>
      </div>
      
      <form @submit.prevent="resetPassword" class="auth-form">
        <FormInput
          v-model="email"
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          :required="true"
          :disabled="loading"
        />
        
        <FormInput
          v-model="password"
          label="New Password"
          type="password"
          placeholder="Enter your new password"
          :required="true"
          :disabled="loading"
          min="8"
        />
        
        <FormInput
          v-model="passwordConfirmation"
          label="Confirm Password"
          type="password"
          placeholder="Confirm new password"
          :required="true"
          :disabled="loading"
        />
          <input 
          v-model="passwordConfirmation"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your new password"
          :required="true"
          :disabled="loading"
          min="8"
        />
        
        <LoadingButton
          type="submit"
          variant="primary"
          :loading="loading"
          loading-text="Resetting..."
          full-width
          :disabled="!password || !passwordConfirmation || !email"
        >
          Reset Password
        </LoadingButton>
      </form>
      
      <div class="text-center mt-3">
        <span class="text-muted">Remember your password?</span>
        <NuxtLink to="/login" class="ms-1 fw-semibold text-primary">Back to Login</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import FormInput from '@/components/FormInput.vue';
import LoadingButton from '@/components/LoadingButton.vue';
import ErrorAlert from '@/components/ErrorAlert.vue';

definePageMeta({ middleware: 'guest', layout: 'auth' })

const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const error = ref('')
const loading = ref(false)

const router = useRouter()
const route = useRoute()
const { resetPassword: resetPasswordAPI } = usePasswordReset()

// Get token and email from URL parameters
const token = ref('')

// Check if error is related to rate limiting
const isRateLimited = computed(() => {
  return error.value.toLowerCase().includes('wait') || 
         error.value.toLowerCase().includes('retry') ||
         error.value.toLowerCase().includes('rate') ||
         error.value.toLowerCase().includes('too many')
})

onMounted(() => {
  // Get token from URL query parameters
  token.value = route.query.token as string || ''
  email.value = route.query.email as string || ''
  
  
  if (!token.value) {
    error.value = 'Invalid or missing reset token. Please request a new password reset link.'
  }
})

async function resetPassword() {
  if (!password.value || !passwordConfirmation.value || !email.value || !token.value) {
    
    return
  }
  
  if (password.value !== passwordConfirmation.value) {
    error.value = 'Passwords do not match.'
    return
  }
  
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters long.'
    return
  }
  
  error.value = ''
  loading.value = true
  
  
  
  try {
    const result = await resetPasswordAPI({
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
      token: token.value
    })
    
    
    if (result.success) {
      // Redirect to login with success message
      router.push('/login?success=password-reset')
    } else {
      error.value = result.message
      console.error('Password reset failed:', result.message)
    }
  } catch (err: any) {
    console.error('Password reset error:', err)
    error.value = 'An unexpected error occurred. Please try again later.'
  } finally {
    loading.value = false
  }
}

// SEO Meta
useHead({
  title: 'Reset Password - Ayurveda Marketplace',
  meta: [
    { name: 'description', content: 'Set your new password for Ayurveda Marketplace account' }
  ]
})
</script>

<style scoped>
.reset-password-page {
  background: var(--background-light);
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-dark);
}

.required {
  color: #dc3545;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-input:focus {
  outline: none;
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.form-input:disabled {
  background-color: #f8f9fa;
  opacity: 0.65;
}

.btn {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.btn-primary {
  background-color: #0d6efd;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0b5ed7;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.auth-form {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}
</style>
