import { useUserStore } from '@/stores/user'
import { watch } from 'vue'

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()

  // Wait for hydration before making auth decisions
  if (!userStore.hydrated) {
    return new Promise((resolve) => {
      const stop = watch(
        () => userStore.hydrated,
        (hydrated) => {
          if (hydrated) {
            stop()
            // After hydration, check auth
            if (!userStore.token) {
              resolve(navigateTo('/login'))
              return
            }
            // Allow access to dashboard even without email verification
            // Email verification can be handled within the dashboard
            resolve()
          }
        },
        { immediate: true }
      )
    })
  }

  // If not authenticated, redirect to login
  if (!userStore.token) {
    return navigateTo('/login')
  }
  
  // Allow access - email verification is not mandatory for dashboard access
  // Users can verify email from within their dashboard if needed
})
