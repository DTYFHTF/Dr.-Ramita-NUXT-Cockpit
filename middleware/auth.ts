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
            if (userStore.user && !userStore.user.email_verified_at && to.path !== '/email/verify/resend') {
              resolve(navigateTo('/email/verify/resend'))
              return
            }
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
  // Prevent access if email is not verified
  if (userStore.user && !userStore.user.email_verified_at && to.path !== '/email/verify/resend') {
    return navigateTo('/email/verify/resend')
  }
})
