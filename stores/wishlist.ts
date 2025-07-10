import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { Product, WishlistItem } from '@/types';
import { useUserStore } from '@/stores/user';

export const useWishlistStore = defineStore('wishlist', () => {
  const config = useRuntimeConfig();
  const API_BASE = config.public.apiBase;

  const wishlist = ref<WishlistItem[]>([]);
  const userStore = useUserStore();
  const isInitialized = ref(false);

  // API helpers
  const fetchWishlist = async () => {
    if (!userStore.token) return;
    try {
      const response = await $fetch<{ wishlist: WishlistItem[] }>(`${API_BASE}/wishlist`, {
        headers: { Authorization: `Bearer ${userStore.token}` }
      });
      wishlist.value = response.wishlist || [];
    } catch (e) {
      wishlist.value = [];
    }
  };

  const addToWishlist = async (product: Product) => {
    if (!userStore.token) return;
    
    try {
      await $fetch(`${API_BASE}/wishlist`, {
        method: 'POST',
        body: { product_id: product.id },
        headers: { Authorization: `Bearer ${userStore.token}` }
      });
      await fetchWishlist();
    } catch (e) {
      console.error('Failed to add to wishlist:', e);
      throw e;
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!userStore.token) return;
    try {
      await $fetch(`${API_BASE}/wishlist/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userStore.token}` }
      });
      await fetchWishlist();
    } catch (e) {
      console.error('Failed to remove from wishlist:', e);
    }
  };

  const toggleWishlist = async (product: Product) => {
    if (!userStore.token) return;
    
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  const clearWishlist = async () => {
    wishlist.value = [];
    if (userStore.token) {
      try {
        await $fetch(`${API_BASE}/wishlist/clear`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${userStore.token}` }
        });
        await fetchWishlist();
      } catch {}
    }
  };

  // Auth state watcher: clear wishlist on logout, fetch on login
  watch(
    () => userStore.token,
    async (newToken, oldToken) => {
      if (newToken) {
        await fetchWishlist();
      } else {
        wishlist.value = [];
      }
    },
    { immediate: true }
  );

  // Initial load
  if (!isInitialized.value) {
    if (userStore.token) {
      fetchWishlist();
    } else {
      wishlist.value = [];
    }
    isInitialized.value = true;
  }

  // Helper functions
  const isInWishlist = (productId: number): boolean => {
    return wishlist.value.some(item => item.product_id === productId);
  };

  // Computed properties
  const totalItems = computed(() => wishlist.value.length);

  const wishlistProducts = computed(() => 
    wishlist.value.map(item => item.product)
  );

  return {
    wishlist,
    totalItems,
    wishlistProducts,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    fetchWishlist,
    isInWishlist
  };
});
