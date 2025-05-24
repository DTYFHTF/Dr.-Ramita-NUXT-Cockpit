<template>
  <div class="card h-100 product-card border shadow-sm">
    <NuxtLink
      :to="`/products/${product.slug}`"
      class="text-decoration-none text-dark d-flex flex-column h-100"
    >
      <div class="image-container">
        <img
          :src="product.image"
          :alt="product.name"
          class="card-img-top main-image"
        />
        <img
          v-if="product.image_2"
          :src="product.image_2"
          :alt="`${product.name} - alternate view`"
          class="card-img-top hover-image"
        />
      </div>
      <div class="card-body d-flex flex-column align-items-start p-3">
        <h3 class="card-title fs-6 fw-semibold mb-2">{{ product.name }}</h3>
        <div class="mb-2 d-flex align-items-center gap-2">
          <span
            v-if="product.sale_price && product.sale_price < product.price"
          >
            <span class="text-decoration-line-through text-muted">
              ${{ product.price }}
            </span>
            <span class="ms-1 text-danger fw-bold">
              ${{ product.sale_price }}
            </span>
          </span>
          <span v-else class="product-price fw-bold text-success">
            ${{ product.price }}
          </span>
        </div>
        <span
          class="badge mb-2"
          :class="
            product.in_stock ?? ((product.stock ?? 0) > 0)
              ? 'bg-success'
              : 'bg-danger'
          "
        >
          {{
            product.in_stock ?? ((product.stock ?? 0) > 0)
              ? 'In stock'
              : 'Out of stock'
          }}
        </span>
        <p class="product-description mb-0">
          {{ product.description }}
        </p>
      </div>
    </NuxtLink>
    <div class="d-flex justify-content-between align-items-center w-100 px-3 pb-3">
      <button class="btn btn-outline-secondary wishlist-btn" title="Add to Wishlist">
        <LucideIcon icon="mdi:heart-outline" color="black" />
      </button>
      <button
        class="btn btn-smooth-success add-to-cart-btn"
        :disabled="!(product.in_stock ?? ((product.stock ?? 0) > 0))"
        @click.stop="handleAddToCart(product)"
      >
        <span class="add-to-cart-text">Add to Cart</span>
        <LucideIcon
          icon="mdi:cart"
          color="white"
          class="add-to-cart-icon"
        />
      </button>
      <button class="btn btn-outline-secondary quick-view-btn" title="Product Quick View" @click.stop="openQuickView">
        <LucideIcon icon="mdi:eye-outline" color="black" />
      </button>
    </div>
    <ProductQuickView v-if="showQuickView" :product="product" @close="closeQuickView" />
  </div>
  <div v-if="showNotification" class="toast-message">Product added to cart!</div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from 'vue';
import LucideIcon from './LucideIcon.vue';
import ProductQuickView from './ProductQuickView.vue';
import { useCart } from '@/composables/useCart';
import { useUserStore } from '@/stores/user';
import type { Product } from '@/types';

const { addToCart } = useCart();
const userStore = useUserStore();

const showNotification = ref(false);
const showQuickView = ref(false);

const isAuthenticated = computed(() => !!userStore.token);

const handleAddToCart = async (product: Product) => {
  if (!userStore.hydrated) {
    alert('Please wait, authentication state is loading.');
    return;
  }
  if (!isAuthenticated.value) {
    alert('You need to be logged in to add products to the cart.');
    return;
  }
  try {
    await addToCart(product);
    showNotification.value = true;
    setTimeout(() => {
      showNotification.value = false;
    }, 2000); // Hide notification after 2 seconds
  } catch (err: any) {
    alert('Error adding to cart: ' + (err?.message || err));
  }
};

const openQuickView = () => {
  showQuickView.value = true;
};
const closeQuickView = () => {
  showQuickView.value = false;
};

defineProps<{
  product: Product;
}>();
</script>

<style scoped lang="scss">
.product-card {
  transition: box-shadow 0.18s, transform 0.18s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
.product-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px) scale(1.02);
}
.image-container {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}
.card-img-top {
  object-fit: contain;
  width: 100%;
  height: 100%;
  transition: transform 1.5s ease-in-out, opacity 0.6s ease-in-out;
  position: absolute;
  top: 0;
  left: 0;
}
.main-image {
  opacity: 1;
  z-index: 1;
  transform: scale(1);
}
.hover-image {
  opacity: 0;
  z-index: 2;
  transform: scale(1.1);
}
.image-container:hover .main-image {
  opacity: 0;
  transform: scale(1.1);
}
.image-container:hover .hover-image {
  opacity: 1;
  transform: scale(1);
}
.wishlist-btn,
.quick-view-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}
.wishlist-btn:hover,
.quick-view-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
.add-to-cart-btn {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
}
.add-to-cart-text {
  transition: opacity 0.3s ease-in-out;
  opacity: 1;
  z-index: 1;
}
.add-to-cart-icon {
  position: absolute;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  z-index: 2;
}
.add-to-cart-btn:hover .add-to-cart-text {
  opacity: 0;
}
.add-to-cart-btn:hover .add-to-cart-icon {
  opacity: 1;
}
.product-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}
.toast-message {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: $accent-soft-green;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: fadeInOut 2s ease-in-out;
}


</style>