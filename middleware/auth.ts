import { useUserStore } from '@/stores/user'

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()
  // If not authenticated, redirect to login
  if (!userStore.token) {
    return navigateTo('/login')
  }
  // Prevent access if email is not verified
  if (userStore.user && !userStore.user.email_verified_at && to.path !== '/email/verify/resend') {
    return navigateTo('/email/verify/resend')
  }
})
