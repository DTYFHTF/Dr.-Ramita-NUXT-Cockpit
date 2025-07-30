<template>
  <div class="forgot-password-page d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
    <div class="w-100" style="max-width: 420px;">
      <h2 class="mb-3 text-center fw-bold">Reset your password</h2>
      <p class="text-center text-muted mb-4">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      
      <!-- Success message -->
      <div v-if="successMessage" class="alert alert-success mb-3 text-center">
        {{ successMessage }}
      </div>
      
      <!-- Error message -->
      <div v-if="error" class="alert alert-danger mb-3 text-center">
        {{ error }}
      </div>
      
      <form @submit.prevent="sendResetLink" class="auth-form">
        <div class="form-group">
          <label for="email" class="form-label">Email Address<span class="required">*</span></label>
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
        
        <button 
          type="submit" 
          class="btn btn-primary w-100 mb-3"
          :disabled="loading || !email"
        >
          <span v-if="loading">Sending...</span>
          <span v-else>Send Reset Link</span>
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
import { ref } from 'vue'

const email = ref('')
const error = ref('')
const successMessage = ref('')
const loading = ref(false)

const { sendResetLink: sendResetLinkAPI } = usePasswordReset()

async function sendResetLink() {
  if (!email.value) return
  
  error.value = ''
  successMessage.value = ''
  loading.value = true
  
  try {
    const result = await sendResetLinkAPI(email.value)
    
    if (result.success) {
      successMessage.value = result.message
      email.value = '' // Clear the form
    } else {
      error.value = result.message
    }
  } catch (err: any) {
    console.error('Send reset link error:', err)
    error.value = 'An unexpected error occurred. Please try again later.'
  } finally {
    loading.value = false
  }
}

// SEO Meta
useHead({
  title: 'Reset Password - Ayurveda Marketplace',
  meta: [
    { name: 'description', content: 'Reset your password for Ayurveda Marketplace account' }
  ]
})
</script>

<style scoped>
.forgot-password-page {
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
