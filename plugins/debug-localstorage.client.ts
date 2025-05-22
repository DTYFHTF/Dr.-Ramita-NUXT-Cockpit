// This plugin logs localStorage values after client-side mount to debug SSR/client mismatch.
export default defineNuxtPlugin(() => {
  if (process.client) {
    window.addEventListener('DOMContentLoaded', () => {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('auth_token');
      console.log('[Nuxt:plugin] After DOMContentLoaded, localStorage:', { user, token });
    });
  }
});
