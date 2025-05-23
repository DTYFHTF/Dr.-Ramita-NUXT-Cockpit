<template>
  <button @click="logout" :disabled="loading" :class="['logout-btn', $attrs.class]">
    <slot>Logout</slot>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const loading = ref(false)
const error = ref('')
const router = useRouter()
const userStore = useUserStore()

const API_BASE = 'http://ayurveda-marketplace.test'

async function logout() {
  error.value = ''
  loading.value = true
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) throw new Error('Not logged in')
    await $fetch(`${API_BASE}/api/logout`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
  } catch (err: any) {
    // Ignore unauthenticated errors, still proceed to clear user/token
    if (err?.data?.message && err.data.message !== 'Unauthenticated.') {
      error.value = err.data.message
      alert(error.value)
    }
  } finally {
    userStore.setUser(null)
    userStore.setToken(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    router.push('/')
    loading.value = false
  }
}
</script>

