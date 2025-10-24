<template>
  <div class="auth-callback d-flex flex-column align-items-center justify-content-center min-vh-100">
    <div class="text-center">
      <div v-if="loading" class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Processing...</span>
      </div>
      <div v-if="error" class="alert alert-danger mt-3">
        {{ error }}
        <div class="mt-3">
          <NuxtLink to="/login" class="btn btn-primary">Back to Login</NuxtLink>
        </div>
      </div>
      <p v-if="loading" class="mt-3 text-muted">Completing Google sign in...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    // Check for error in URL
    if (route.query.error) {
      error.value = route.query.error
      loading.value = false
      return
    }

    // Get token and user from URL parameters
    const token = route.query.token
    const userDataEncoded = route.query.user

    if (!token) {
      error.value = 'No authentication token received'
      loading.value = false
      return
    }

    // Parse user data
    let userData = null
    if (userDataEncoded) {
      try {
        userData = JSON.parse(decodeURIComponent(userDataEncoded))
      } catch (e) {
        console.error('Failed to parse user data:', e)
      }
    }

    // Store token in localStorage
    localStorage.setItem('token', token)

    // Set user in store
    if (userData) {
      userStore.setUser(userData)
    }

    // Redirect to home or dashboard
    router.push('/')
  } catch (err) {
    console.error('Auth callback error:', err)
    error.value = 'Failed to complete authentication'
    loading.value = false
  }
})
</script>

<style scoped>
.auth-callback {
  background: var(--background-light);
}
</style>
