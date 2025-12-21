import { watch } from 'vue'
import { useUserStore } from '@/stores/user'

export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore()

  // Wait for persisted store to hydrate (avoid flash)
  if (!userStore.hydrated) {
    await new Promise<void>((resolve) => {
      const stop = watch(() => userStore.hydrated, (val) => {
        if (val) {
          stop()
          resolve()
        }
      })
      // Safety fallback in case hydration doesn't change quickly
      setTimeout(() => {
        try { stop() } catch (e) {}
        resolve()
      }, 500)
    })
  }

  // If user is present or token exists, redirect away from guest pages
  if (userStore.user || userStore.token) {
    return navigateTo('/dashboard')
  }
})
