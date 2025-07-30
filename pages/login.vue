<template>
  <div class="login-page d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
    <div class="w-100" style="max-width: 420px;">
      <h2 class="mb-3 text-center fw-bold">Sign in to your account</h2>
      
      <!-- Success message for successful registration or password reset -->
      <div v-if="showSuccessMessage" class="alert alert-success mb-3 text-center">
        {{ successMessage }}<br>
        <small v-if="route.query.success === 'registration'" class="text-muted">
          If your account requires email verification, please check your email and verify before logging in.
        </small>
      </div>
      
      <AuthForm
        :submit-label="'Login'"
        :error="error"
        :loading="loading"
        @submit="login"
      />
      
      <!-- Forgot Password Link -->
      <div class="text-center mt-3">
        <NuxtLink to="/forgot-password" class="text-primary text-decoration-none">
          Forgot your password?
        </NuxtLink>
      </div>
      
      <div class="text-center mt-4">
        <button class="btn btn-smooth-success w-100" @click="loginWithGoogle">
          <svg style="vertical-align:middle;margin-right:8px;" width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.39 30.18 0 24 0 14.82 0 6.71 5.48 2.69 13.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.59C43.93 37.13 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.65c-1.13-3.36-1.13-6.99 0-10.35l-7.98-6.2C.64 16.09 0 19.01 0 22c0 2.99.64 5.91 1.69 8.55l7.98-6.2z"/><path fill="#EA4335" d="M24 44c6.18 0 11.64-2.03 15.54-5.53l-7.19-5.59c-2.01 1.35-4.59 2.13-8.35 2.13-6.38 0-11.87-3.63-14.33-8.89l-7.98 6.2C6.71 42.52 14.82 48 24 48z"/></g></svg>
          Sign in with Google
        </button>
      </div>
      <div class="text-center mt-3">
        <span class="text-muted">Don't have an account yet?</span>
        <NuxtLink to="/register" class="ms-1 fw-semibold text-primary">Sign up</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import AuthForm from '@/components/AuthForm.vue'
import { loginWithGoogle } from '@/composables/useApi'

const error = ref('')
const loading = ref(false)
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// Check if we came from registration success or password reset success
const showSuccessMessage = computed(() => {
  return route.query.success === 'registration' || route.query.success === 'password-reset'
})

const successMessage = computed(() => {
  if (route.query.success === 'registration') {
    return 'Registration successful! You can now login.'
  } else if (route.query.success === 'password-reset') {
    return 'Password reset successful! You can now login with your new password.'
  }
  return ''
})

console.log('[LOGIN] userStore before login:', JSON.stringify(userStore.user), userStore.token)

const API_BASE = useRuntimeConfig().public.apiBase

async function login({ email, password }: { email: string, password: string }) {
  error.value = ''
  loading.value = true
  try {
    const loginResponse = await $fetch<any>(`${API_BASE}/login`, {
      method: 'POST',
      body: { email, password },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    console.log('[LOGIN] loginResponse:', JSON.stringify(loginResponse))
    if (!loginResponse.token) throw new Error('No token returned from API')
    userStore.setToken(loginResponse.token)
    userStore.setUser(loginResponse.user)
    console.log('[LOGIN] userStore after setUser/setToken:', JSON.stringify(userStore.user), userStore.token)
    await nextTick()
    console.log('[LOGIN] userStore after nextTick:', JSON.stringify(userStore.user), userStore.token)
    router.push('/dashboard')
  } catch (err: any) {
    if (err?.data?.message) {
      error.value = err.data.message
    } else if (err?.message) {
      error.value = err.message
    } else {
      error.value = 'An error occurred during login.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  background: var(--background-light);
}
</style>
