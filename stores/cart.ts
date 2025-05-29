import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { Product } from '@/types';
import { useUserStore } from '@/stores/user';

export type CartItem = {
  product_id: number;
  variation_id: number | null;
  name: string;
  variation_name: string | null;
  price: number;
  image: string;
  stock: number;
  quantity: number;
};

const API_BASE = 'http://ayurveda-marketplace.test';

export const useCartStore = defineStore('cart', () => {
  const cart = ref<CartItem[]>([]);
  const userStore = useUserStore();
  const isInitialized = ref(false);

  // API helpers
  const fetchCart = async () => {
    if (!userStore.token) return;
    try {
      const response = await $fetch<{ cart: any[] }>(`${API_BASE}/api/cart`, {
        headers: { Authorization: `Bearer ${userStore.token}` }
      });
      cart.value = (response.cart || []).map(item => ({
        product_id: item.product_id,
        variation_id: item.variation_id,
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
    if (!userStore.token) return;
    const product_id = product.id;
    let variation_id: number | null = null;
    if (typeof (product as any).variation_id !== 'undefined' && (product as any).variation_id !== null) {
      variation_id = Number((product as any).variation_id);
      if (isNaN(variation_id)) variation_id = null;
    }
    const payload = {
      product_id,
      variation_id,
      quantity: Math.max(1, Number(quantity))
    };
    await $fetch(`${API_BASE}/api/cart`, {
      method: 'POST',
      body: payload,
      headers: { Authorization: `Bearer ${userStore.token}` }
    });
    await fetchCart();
  };

  const removeFromCart = async (productId: number, variationId: number | null) => {
    if (!userStore.token) return;
    const cartKey = `${productId}:${variationId}`;
    cart.value = cart.value.filter(item => `${item.product_id}:${item.variation_id}` !== cartKey);
    try {
      await $fetch(`${API_BASE}/api/cart/${cartKey}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userStore.token}` }
      });
      await fetchCart();
    } catch {}
  };

  const updateQuantity = async (productId: number, variationId: number | null, newQuantity: number) => {
    if (!userStore.token) return;
    const cartKey = `${productId}:${variationId}`;
    const numericQuantity = Math.max(1, Number(newQuantity));
    const item = cart.value.find(item => `${item.product_id}:${item.variation_id}` === cartKey);
    if (item) {
      item.quantity = numericQuantity;
      await $fetch(`${API_BASE}/api/cart`, {
        method: 'POST',
        body: {
          product_id: productId,
          variation_id: variationId,
          quantity: numericQuantity
        },
        headers: { Authorization: `Bearer ${userStore.token}` }
      });
      await fetchCart();
    }
  };

  const clearCart = async () => {
    cart.value = [];
    if (userStore.token) {
      try {
        await $fetch(`${API_BASE}/api/cart/clear`, {
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
