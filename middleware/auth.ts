import { useUserStore } from '@/stores/user'
import { watch } from 'vue'

export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware on server-side
  if (process.server) return

  const userStore = useUserStore()

  // Wait for hydration before making auth decisions
  if (!userStore.hydrated) {
    return new Promise((resolve) => {
      const maxWaitTime = 2000 // 2 seconds max wait
      let timeoutId: NodeJS.Timeout
      
      const checkAuth = () => {
        if (userStore.token) {
          clearTimeout(timeoutId)
          resolve()
        } else {
          clearTimeout(timeoutId)
          resolve(navigateTo('/login'))
        }
      }

      const stopWatching = watch(
        () => userStore.hydrated,
        (hydrated) => {
          if (hydrated) {
            stopWatching()
            checkAuth()
          }
        },
        { immediate: true }
      )

      // Fallback timeout in case hydration never completes
      timeoutId = setTimeout(() => {
        stopWatching()
        checkAuth()
      }, maxWaitTime)
    })
  }

  // If hydrated and not authenticated, redirect to login
  if (!userStore.token) {
    return navigateTo('/login')
  }
  
  // Allow access
})
