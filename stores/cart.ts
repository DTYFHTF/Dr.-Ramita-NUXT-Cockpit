import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { Product, CartItem } from '@/types';
import { useUserStore } from '@/stores/user';


export const useCartStore = defineStore('cart', () => {
  const config = useRuntimeConfig();
  const API_BASE = config.public.apiBase;

  const cart = ref<CartItem[]>([]);
  const userStore = useUserStore();
  const isInitialized = ref(false);

  // Helper to build cart key
  function cartKey(productId: number, variationId: number | null) {
    return `${productId}:${variationId === null ? 'null' : variationId}`;
  }

  // API helpers
  const fetchCart = async () => {
    if (!userStore.token) return;
    try {
      const response = await $fetch<{ cart: any[] }>(`${API_BASE}/cart`, {
        headers: { Authorization: `Bearer ${userStore.token}` }
      });
      cart.value = (response.cart || []).map(item => ({
        product_id: item.product_id,
        variation_id: item.variation_id === null ? null : Number(item.variation_id),
        name: item.name,
        variation_name: item.variation_name ?? null,
        price: item.price,
        image: item.image,
        stock: item.stock,
        quantity: item.quantity
      }));
    } catch (e) {
      cart.value = [];
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!userStore.token) throw new Error('Authentication required');
    
    const product_id = (product as any).parent_id ? (product as any).parent_id : product.id;
    let variation_id: number | null = null;
    if ('variation_id' in product && product.variation_id !== undefined && product.variation_id !== null) {
      variation_id = Number(product.variation_id);
      if (isNaN(variation_id)) variation_id = null;
    }
    
    const payload = {
      product_id,
      variation_id,
      quantity: Math.max(1, Number(quantity))
    };
    
    
    try {
      await $fetch(`${API_BASE}/cart`, {
        method: 'POST',
        body: payload,
        headers: { 
          Authorization: `Bearer ${userStore.token}`,
          'Content-Type': 'application/json'
        }
      });
      await fetchCart();
    } catch (error: any) {
      console.error('[CART] Add to cart failed:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId: number, variationId: number | null) => {
    if (!userStore.token) return;
    const key = cartKey(productId, variationId);
    try {
      await $fetch(`${API_BASE}/cart/${key}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userStore.token}` }
      });
      await fetchCart();
    } catch {}
  };

  const updateQuantity = async (productId: number, variationId: number | null, newQuantity: number) => {
    if (!userStore.token) return;
    const numericQuantity = Math.max(1, Number(newQuantity));
    await $fetch(`${API_BASE}/cart`, {
      method: 'POST',
      body: {
        product_id: productId,
        variation_id: variationId,
        quantity: numericQuantity,
        replace: true // Ensure backend sets the quantity, not increments
      },
      headers: { Authorization: `Bearer ${userStore.token}` }
    });
    await fetchCart();
  };

  const clearCart = async () => {
    cart.value = [];
    if (userStore.token) {
      try {
        await $fetch(`${API_BASE}/cart/clear`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${userStore.token}` }
        });
        await fetchCart();
      } catch {}
    }
  };

  // Auth state watcher: just clear cart on logout, fetch on login
  watch(
    () => userStore.token,
    async (newToken, oldToken) => {
      if (newToken) {
        await fetchCart();
      } else {
        cart.value = [];
      }
    },
    { immediate: true }
  );

  // Initial load
  if (!isInitialized.value) {
    if (userStore.token) {
      fetchCart();
    } else {
      cart.value = [];
    }
    isInitialized.value = true;
  }

  // Computed properties
  const totalItems = computed(() =>
    cart.value.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
  );
  const totalPrice = computed(() =>
    cart.value.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return sum + (price * quantity);
    }, 0)
  );

  return {
    cart,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    fetchCart
  };
});