<template>
  <div class="register-page d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
    <div class="w-100" style="max-width: 420px;">
      <h2 class="mb-3 text-center fw-bold">Create your account</h2>
      <RegisterForm
        :error="error"
        :loading="loading"
        @submit="register"
      />
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
const router = useRouter()
const userStore = useUserStore()

const API_BASE = 'http://ayurveda-marketplace.test'

async function register({ name, email, password, password_confirmation }: { name: string, email: string, password: string, password_confirmation: string }) {
  error.value = ''
  loading.value = true
  try {
    const response = await $fetch(`${API_BASE}/api/register`, {
      method: 'POST',
      body: { name, email, password, password_confirmation },
      headers: { Accept: 'application/json' }
    }) as { token: string, user: any }
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
</script>

<style scoped>
.register-page {
  background: #f8fafc;
}
</style>
