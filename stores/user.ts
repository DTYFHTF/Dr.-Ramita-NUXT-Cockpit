import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const hydrated = ref(false) // Start as false, will be set to true after hydration

  // Set hydrated to true after a short delay to allow for restoration
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      hydrated.value = true
    }, 100)
  }

  function setUser(u: User | null) {
    user.value = u
  }
  function setToken(t: string | null) {
    token.value = t
  }
  function logout() {
    user.value = null
    setToken(null)
  }
  async function fetchUserProfile() {
    try {
      const { useAuthApi } = await import('@/composables/useApi')
      const authApi = useAuthApi()
      if (!token.value) throw new Error('No auth token available')
      let response;
      try {
        response = await authApi.get('user', token.value)
      } catch (userError: any) {
        if (userError?.status === 405 || userError?.status === 404) {
          response = await authApi.get('user/profile', token.value)
        } else {
          throw userError
        }
      }
      if (response?.data) {
        setUser(response.data)
      } else if (response?.user) {
        setUser(response.user)
      } else if (response) {
        setUser(response)
      } else {
        throw new Error('No user data in response')
      }
    } catch (e: any) {
      if (typeof window !== 'undefined') {
        console.error('[DEBUG] Failed to fetch user profile:', e)
        console.error('[DEBUG] Error status:', e?.status)
        console.error('[DEBUG] Error data:', e?.data)
      }
      if (e?.status === 401 || e?.status === 403 || e?.data?.message?.includes('Unauthenticated')) {
        logout()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      } else {
        console.warn('[DEBUG] Profile fetch failed, keeping existing user data')
      }
      throw e
    }
  }

  return { user, token, hydrated, setUser, setToken, logout, fetchUserProfile }
}, {
  persist: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    pick: ['user', 'token']
  }
})
