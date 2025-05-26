import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { Product } from '@/types';
import { useUserStore } from '@/stores/user';

export type CartItem = {
  id?: number;
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

  // Save/load cart from localStorage
  const saveCart = () => {
    if (!userStore.token && typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart.value));
    }
  };

  const loadCart = () => {
    if (!userStore.token && typeof window !== 'undefined') {
      const initialCart = localStorage.getItem('cart');
      cart.value = initialCart ? JSON.parse(initialCart) : [];
    }
  };

  // Merge carts
  const mergeCarts = (local: CartItem[], server: CartItem[]): CartItem[] => {
    const merged: Record<string, CartItem> = {};
    server.forEach(item => {
      const key = `${item.product_id}:${item.variation_id}`;
      merged[key] = {
        ...item,
        quantity: Number(item.quantity),
        price: Number(item.price),
        stock: Number(item.stock)
      };
    });
    local.forEach(item => {
      const key = `${item.product_id}:${item.variation_id}`;
      if (merged[key]) {
        merged[key].quantity += Number(item.quantity);
      } else {
        merged[key] = {
          ...item,
          quantity: Number(item.quantity),
          price: Number(item.price),
          stock: Number(item.stock)
        };
      }
    });
    return Object.values(merged);
  };

  // API helpers
  const fetchCart = async () => {
    try {
      if (!userStore.token) return;
      const response = await $fetch<{ cart: any[] }>(`${API_BASE}/api/cart`, {
        headers: { Authorization: `Bearer ${userStore.token}` }
      });
      console.log('[fetchCart] Response from backend:', response);
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
      console.log('[fetchCart] Cart after mapping:', cart.value);
    } catch (e) {
      console.error('[fetchCart] Error:', e);
      cart.value = [];
    }
  };

  const syncCartToServer = async () => {
    try {
      if (!userStore.token) return;
      const payload = {
        items: cart.value.map(item => ({
          product_id: item.product_id,
          variation_id: item.variation_id,
          quantity: item.quantity
        }))
      };
      console.log('[syncCartToServer] Sending payload:', payload);
      await $fetch(`${API_BASE}/api/cart`, {
        method: 'POST',
        body: payload,
        headers: { Authorization: `Bearer ${userStore.token}` }
      });
    } catch (e) {
      console.error('[syncCartToServer] Error:', e);
    }
  };

  // Cart operations
  const addToCart = async (product: Product, quantity: number = 1) => {
    const product_id = product.id;
    const variation_id = (product as any).variation_id ?? null;
    const variation_name = (product as any).variation_name ?? (product as any).name !== product.name ? (product as any).name : null;
    const price = (product as any).sale_price && (product as any).sale_price < (product as any).price ? (product as any).sale_price : (product as any).price;
    const image = product.image;
    const stock = (product as any).stock ?? product.stock;
    const payload: CartItem = {
      product_id,
      variation_id,
      name: product.name,
      variation_name,
      price,
      image,
      stock,
      quantity: Math.max(1, Number(quantity))
    };
    const cartKey = `${product_id}:${variation_id}`;
    const existing = cart.value.find(item => `${item.product_id}:${item.variation_id}` === cartKey);
    if (existing) {
      existing.quantity += payload.quantity;
    } else {
      cart.value.push(payload);
    }
    if (userStore.token) {
      await syncCartToServer();
    } else {
      saveCart();
    }
  };

  const removeFromCart = async (productId: number, variationId: number | null) => {
    const cartKey = `${productId}:${variationId}`;
    cart.value = cart.value.filter(item => `${item.product_id}:${item.variation_id}` !== cartKey);
    if (userStore.token) {
      try {
        await $fetch(`${API_BASE}/api/cart/${productId}:${variationId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${userStore.token}` }
        });
        await fetchCart();
      } catch {}
    } else {
      saveCart();
    }
  };

  const updateQuantity = async (productId: number, variationId: number | null, newQuantity: number) => {
    const cartKey = `${productId}:${variationId}`;
    const numericQuantity = Math.max(1, Number(newQuantity));
    const item = cart.value.find(item => `${item.product_id}:${item.variation_id}` === cartKey);
    if (item) {
      item.quantity = numericQuantity;
      if (userStore.token) {
        await syncCartToServer();
      } else {
        saveCart();
      }
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
      } catch {}
    }
    saveCart();
  };

  // Auth state watcher
  watch(
    () => userStore.token,
    async (newToken, oldToken) => {
      if (newToken) {
        try {
          await fetchCart();
          const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
          if (localCart.length) {
            cart.value = mergeCarts(localCart, cart.value);
            await syncCartToServer();
            localStorage.removeItem('cart');
          }
        } catch {}
      } else {
        cart.value = [];
        saveCart();
      }
    },
    { immediate: true }
  );

  // Initial load
  if (!isInitialized.value) {
    if (userStore.token) {
      fetchCart();
    } else {
      loadCart();
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
