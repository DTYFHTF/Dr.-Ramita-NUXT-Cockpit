<template>
  <div class="register-page d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
    <div class="w-100" style="max-width: 420px;">
      <h2 class="mb-3 text-center fw-bold">Create your account</h2>
      <RegisterForm
        :error="error"
        :loading="loading"
        @submit="register"
      />
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

const error = ref('')
const loading = ref(false)
const showVerifyMsg = ref(false)
const resending = ref(false)
const resendMsg = ref('')
const router = useRouter()
const userStore = useUserStore()

const API_BASE = 'http://ayurveda-marketplace.test'

async function register({ first_name, last_name, email, phone, password, password_confirmation }: { first_name: string, last_name: string, email: string, phone: string, password: string, password_confirmation: string }) {
  error.value = ''
  loading.value = true
  showVerifyMsg.value = false
  try {
    const response = await $fetch(`${API_BASE}/api/register`, {
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
    await $fetch(`${API_BASE}/api/email/resend`, {
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
  background: #f8fafc;
}
</style>
