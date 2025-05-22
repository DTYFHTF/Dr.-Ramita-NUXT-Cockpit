// This plugin hydrates the user store from localStorage on client-side mount.
import { useUserStore } from '../stores/user';

export default defineNuxtPlugin(() => {
  if (process.client) {
    const userStore = useUserStore();
    userStore.hydrateFromLocalStorage();
  }
});
