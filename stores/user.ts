import { defineStore } from 'pinia'
import type { User } from '@/types';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    hydrated: false as boolean
  }),
  actions: {
    setUser(user: User | null) {
      this.user = user;
      if (typeof window !== 'undefined') {
        if (user) localStorage.setItem('user', JSON.stringify(user));
        else localStorage.removeItem('user');
      }
    },
    setToken(token: string | null) {
      this.token = token;
      if (typeof window !== 'undefined') {
        if (token) localStorage.setItem('auth_token', token);
        else localStorage.removeItem('auth_token');
      }
    },
    logout() {
      this.user = null;
      this.setToken(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    },
    hydrateFromLocalStorage() {
      if (typeof window !== 'undefined') {
        const userRaw = localStorage.getItem('user');
        const tokenRaw = localStorage.getItem('auth_token');
        this.user = userRaw ? JSON.parse(userRaw) : null;
        this.token = tokenRaw;
        this.hydrated = true;
      }
    }
  }
})
