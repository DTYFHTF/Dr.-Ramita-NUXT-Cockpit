<template>
  <div class="auth-callback-page">
    <div v-if="loading" class="loading">Authenticating with Google...</div>
    <div v-else-if="error" class="error">Google authentication failed. Please try again.</div>
    <div v-else class="success">Successfully authenticated! Redirecting...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useApiLaravel } from '~/composables/useApi'
import { useUserStore } from '~/stores/user'

const loading = ref(true)
const error = ref(false)
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

onMounted(async () => {
  // Assume backend redirects here with ?token=... or ?code=...
  const token = route.query.token
  const code = route.query.code

  if (token) {
    // If backend provides a JWT token directly
    userStore.setToken(token)
    await userStore.fetchUser()
    loading.value = false
    setTimeout(() => router.push('/'), 1000)
  } else if (code) {
    // If backend provides a code, exchange it for a token (POST request)
    try {
      const { data, error: apiError } = await useApiLaravel('auth/google/callback').post({ code })
      if (data.value && data.value.token) {
        userStore.setToken(data.value.token)
        await userStore.fetchUser()
        loading.value = false
        setTimeout(() => router.push('/'), 1000)
      } else {
        error.value = true
        loading.value = false
      }
    } catch (e) {
      error.value = true
      loading.value = false
    }
  } else {
    error.value = true
    loading.value = false
  }
})
</script>

<style scoped>
.auth-callback-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}
.loading { color: var(--text-muted); }
.error { color: var(--color-error); }
.success { color: var(--color-primary); }
</style>
