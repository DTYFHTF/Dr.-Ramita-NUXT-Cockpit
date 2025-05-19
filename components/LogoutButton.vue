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
    userStore.setUser(null)
    localStorage.removeItem('auth_token')
    router.push('/')
  } catch (err: any) {
    error.value = err?.data?.message || err?.message || 'Logout failed.'
    alert(error.value)
  } finally {
    loading.value = false
  }
}
</script>

