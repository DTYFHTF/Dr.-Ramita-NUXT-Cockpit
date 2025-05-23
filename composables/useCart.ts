import { ref, computed, watch } from 'vue';
import type { Product } from '@/types';
import { useUserStore } from '@/stores/user';

type CartItem = Product & { quantity: number };

const API_BASE = 'http://ayurveda-marketplace.test';

export function useCart() {
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
    const merged: Record<number, CartItem> = {};
    server.forEach(item => {
      const id = Number(item.id);
      merged[id] = {
        ...item,
        id: id,
        quantity: Number(item.quantity),
        price: Number(item.price),
        stock: Number(item.stock)
      };
    });
    local.forEach(item => {
      const id = Number(item.id);
      if (merged[id]) {
        merged[id].quantity += Number(item.quantity);
      } else {
        merged[id] = {
          ...item,
          id: id,
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
      cart.value = (response.cart || []).map(item => ({
        ...item,
        id: Number(item.id),
        quantity: Number(item.quantity),
        price: Number(item.price),
        stock: Number(item.stock),
        sale_price: item.sale_price ? Number(item.sale_price) : null
      }));
    } catch {
      cart.value = [];
    }
  };

  const syncCartToServer = async () => {
    try {
      if (!userStore.token) return;
      await $fetch(`${API_BASE}/api/cart`, {
        method: 'POST',
        body: {
          items: cart.value.map(item => ({
            product_id: Number(item.id),
            quantity: Number(item.quantity)
          }))
        },
        headers: { Authorization: `Bearer ${userStore.token}` }
      });
    } catch {}
  };

  // Cart operations
  const addToCart = async (product: Product, quantity: number = 1) => {
    const numericQuantity = Math.max(1, Number(quantity));
    const priceToUse = product.sale_price && product.sale_price < product.price
      ? Number(product.sale_price)
      : Number(product.price);
    const existing = cart.value.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += numericQuantity;
    } else {
      cart.value.push({
        ...product,
        price: priceToUse,
        quantity: numericQuantity,
        id: Number(product.id),
        stock: Number(product.stock)
      });
    }
    if (userStore.token) {
      await syncCartToServer();
    } else {
      saveCart();
    }
  };

  const removeFromCart = async (productId: number) => {
    const numericId = Number(productId);
    cart.value = cart.value.filter(item => Number(item.id) !== numericId);
    if (userStore.token) {
      try {
        await $fetch(`${API_BASE}/api/cart/${numericId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${userStore.token}` }
        });
        await fetchCart();
      } catch {}
    } else {
      saveCart();
    }
  };

  const updateQuantity = async (productId: number, newQuantity: number) => {
    const numericId = Number(productId);
    const numericQuantity = Math.max(1, Number(newQuantity));
    const item = cart.value.find(item => Number(item.id) === numericId);
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
}