<template>
  <RegisterForm
    :error="error"
    :loading="loading"
    @submit="register"
  />
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
/* Add any page-specific styles here */
</style>
