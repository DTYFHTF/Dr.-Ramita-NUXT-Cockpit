import { ref, computed } from 'vue';
import type { Product } from '@/types';

type CartItem = Product & { quantity: number };

export function useCart() {
  const cart = ref<CartItem[]>([]);

  // Load cart from localStorage (client-side only)
  if (typeof window !== 'undefined') {
    const initialCart = localStorage.getItem('cart');
    if (initialCart) {
      cart.value = JSON.parse(initialCart);
    }
  }

  // Total items in cart
  const totalItems = computed(() => 
    cart.value.reduce((sum, item) => sum + item.quantity, 0)
  );

  // Total price
  const totalPrice = computed(() =>
    cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );

  // Add to cart
  const addToCart = (product: Product, quantity: number = 1) => {
    

    const priceToUse = product.sale_price && product.sale_price < product.price
      ? product.sale_price
      : product.price;

    const existing = cart.value.find(item => item.slug === product.slug);
    
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.value.push({ ...product, price: priceToUse, quantity });
    }
    
    saveCart();
  };

  // Remove from cart
  const removeFromCart = (productSlug: string) => {
    cart.value = cart.value.filter(item => item.slug !== productSlug);
    saveCart();
  };

  // Update quantity
  const updateQuantity = (productSlug: string, newQuantity: number) => {
    const item = cart.value.find(item => item.slug === productSlug);
    if (item) {
      item.quantity = Math.max(1, newQuantity);
      saveCart();
    }
  };

  // Clear cart
  const clearCart = () => {
    cart.value = [];
    saveCart();
  };

  // Save to localStorage (client-side only)
  const saveCart = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart.value));
    }
  };

  return {
    cart,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
}