import { useUserStore } from '@/stores/user'

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()
  // If not authenticated, redirect to login
  if (!userStore.token) {
    return navigateTo('/login')
  }
})
