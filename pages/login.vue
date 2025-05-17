<template>
  <div class="login-page">
    <AuthForm
      :submit-label="'Login'"
      :error="error"
      :loading="loading"
      @submit="login"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import AuthForm from '@/components/AuthForm.vue'

const error = ref('')
const loading = ref(false)
const router = useRouter()
const userStore = useUserStore()

const API_BASE = 'http://ayurveda-marketplace.test'

async function login({ email, password }: { email: string, password: string }) {
  error.value = ''
  loading.value = true
  try {
    const loginResponse = await $fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      body: { email, password },
      headers: { Accept: 'application/json' }
    }) as { token: string, user: any }
    if (!loginResponse.token) throw new Error('No token returned from API')
    userStore.setToken(loginResponse.token)
    userStore.setUser(loginResponse.user)
    router.push('/profile')
  } catch (err: any) {
    if (err?.data?.message) {
      error.value = err.data.message
    } else if (err?.message) {
      error.value = err.message
    } else {
      error.value = 'Login failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: 60px auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
}
</style>
