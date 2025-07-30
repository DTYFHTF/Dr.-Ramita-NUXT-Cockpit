<template>
  <div class="reset-password-page d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
    <div class="w-100" style="max-width: 420px;">
      <h2 class="mb-3 text-center fw-bold">Set new password</h2>
      <p class="text-center text-muted mb-4">
        Enter your new password below.
      </p>
      
      <!-- Error message -->
      <div v-if="error" class="alert alert-danger mb-3 text-center">
        {{ error }}
        <div v-if="isRateLimited" class="mt-2">
          <small class="text-muted">You can try again in a few minutes, or <NuxtLink to="/forgot-password" class="text-primary">request a new reset link</NuxtLink>.</small>
        </div>
      </div>
      
      <form @submit.prevent="resetPassword" class="auth-form">
        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <input 
            v-model="email" 
            id="email" 
            type="email" 
            class="form-input"
            placeholder="Enter your email address"
            required 
            :disabled="loading"
          />
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">New Password<span class="required">*</span></label>
          <input 
            v-model="password" 
            id="password" 
            type="password" 
            class="form-input"
            placeholder="Enter your new password"
            required 
            :disabled="loading"
            minlength="8"
          />
        </div>
        
        <div class="form-group">
          <label for="password_confirmation" class="form-label">Confirm Password<span class="required">*</span></label>
          <input 
            v-model="passwordConfirmation" 
            id="password_confirmation" 
            type="password" 
            class="form-input"
            placeholder="Confirm your new password"
            required 
            :disabled="loading"
            minlength="8"
          />
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary w-100 mb-3"
          :disabled="loading || !password || !passwordConfirmation || !email"
        >
          <span v-if="loading">Resetting...</span>
          <span v-else>Reset Password</span>
        </button>
      </form>
      
      <div class="text-center mt-3">
        <span class="text-muted">Remember your password?</span>
        <NuxtLink to="/login" class="ms-1 fw-semibold text-primary">Back to Login</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

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
  
  console.log('Reset password page loaded with:', { token: token.value, email: email.value })
  
  if (!token.value) {
    error.value = 'Invalid or missing reset token. Please request a new password reset link.'
  }
})

async function resetPassword() {
  if (!password.value || !passwordConfirmation.value || !email.value || !token.value) {
    console.log('Missing required fields:', { 
      password: !!password.value, 
      passwordConfirmation: !!passwordConfirmation.value, 
      email: !!email.value, 
      token: !!token.value 
    })
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
  
  console.log('Attempting password reset with:', { 
    email: email.value, 
    token: token.value.substring(0, 10) + '...' // Log partial token for debugging
  })
  
  try {
    const result = await resetPasswordAPI({
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
      token: token.value
    })
    
    console.log('Password reset result:', result)
    
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
