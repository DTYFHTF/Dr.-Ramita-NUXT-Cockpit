import { defineStore } from 'pinia'

export interface User {
  id: number
  name: string
  email: string
  // Add more fields as needed
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    token: typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null as string | null
  }),
  actions: {
    setUser(user: User | null) {
      this.user = user
    },
    setToken(token: string | null) {
      this.token = token
      if (typeof window !== 'undefined') {
        if (token) localStorage.setItem('auth_token', token)
        else localStorage.removeItem('auth_token')
      }
    },
    logout() {
      this.user = null
      this.setToken(null)
    }
  }
})
