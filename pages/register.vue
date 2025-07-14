<template>
  <div class="register-page d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
    <div class="w-100" style="max-width: 420px;">
      <h2 class="mb-3 text-center fw-bold">Create your account</h2>
      <RegisterForm
        :error="error"
        :loading="loading"
        @submit="register"
      />
      <div class="text-center my-4">
        <button class="btn btn-primary w-100" @click="loginWithGoogle">
          <svg style="vertical-align:middle;margin-right:8px;" width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.39 30.18 0 24 0 14.82 0 6.71 5.48 2.69 13.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.59C43.93 37.13 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.65c-1.13-3.36-1.13-6.99 0-10.35l-7.98-6.2C.64 16.09 0 19.01 0 22c0 2.99.64 5.91 1.69 8.55l7.98-6.2z"/><path fill="#EA4335" d="M24 44c6.18 0 11.64-2.03 15.54-5.53l-7.19-5.59c-2.01 1.35-4.59 2.13-8.35 2.13-6.38 0-11.87-3.63-14.33-8.89l-7.98 6.2C6.71 42.52 14.82 48 24 48z"/></g></svg>
          Sign up with Google
        </button>
      </div>
      <div v-if="showVerifyMsg" class="alert alert-success mt-3 text-center">
        Registration successful! Please check your email for a verification link.<br>
        <button class="btn btn-link p-0 mt-2" @click="resendVerification" :disabled="resending">
          Didn't receive the email? <span v-if="resending">Resending...</span><span v-else>Resend verification email</span>
        </button>
        <div v-if="resendMsg" class="text-success small mt-1">{{ resendMsg }}</div>
      </div>
      <div class="text-center mt-3">
        <span class="text-muted">Already have an account?</span>
        <NuxtLink to="/login" class="ms-1 fw-semibold text-primary">Login</NuxtLink>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import RegisterForm from '@/components/RegisterForm.vue'
import { loginWithGoogle } from '@/composables/useApi'

const error = ref('')
const loading = ref(false)
const showVerifyMsg = ref(false)
const resending = ref(false)
const resendMsg = ref('')
const router = useRouter()
const userStore = useUserStore()
const config = useRuntimeConfig()

const API_BASE = config.public.apiBase

async function register({ first_name, last_name, email, phone, password, password_confirmation }: { first_name: string, last_name: string, email: string, phone: string, password: string, password_confirmation: string }) {
  error.value = ''
  loading.value = true
  showVerifyMsg.value = false
  try {
    const response = await $fetch(`${API_BASE}/register`, {
      method: 'POST',
      body: { first_name, last_name, email, phone, password, password_confirmation },
      headers: { Accept: 'application/json' }
    }) as { token?: string, user?: any, message?: string }
    if (response.user && response.user.email_verified_at === null) {
      showVerifyMsg.value = true
      return
    }
    if (!response.token) throw new Error('No token returned from API')
    localStorage.setItem('auth_token', response.token)
    userStore.setUser(response.user)
    router.push('/')
  } catch (err: any) {
    if (err?.data?.message) {
      error.value = err.data.message
    } else if (err?.message) {
      error.value = err.message
    } else {
      error.value = 'Registration failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

async function resendVerification() {
  resending.value = true
  resendMsg.value = ''
  try {
    await $fetch(`${API_BASE}/email/resend`, {
      method: 'POST',
      body: {},
      headers: { Accept: 'application/json', Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    })
    resendMsg.value = 'Verification email resent! Please check your inbox.'
  } catch (e) {
    resendMsg.value = 'Failed to resend verification email.'
  } finally {
    resending.value = false
  }
}
</script>

<style scoped>
.register-page {
  background: var(--background-light);
}
</style>
