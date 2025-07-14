<template>
  <div class="card h-100 product-card border shadow-sm">
    <NuxtLink
      :to="`/products/${product.slug}`"
      class="text-decoration-none product-link d-flex flex-column h-100"
    >
      <div class="image-container">
        <img
          v-if="images[0]"
          :src="images[0]"
          :alt="product.name"
          class="card-img-top main-image"
        />
        <img
          v-if="images[1]"
          :src="images[1]"
          :alt="`${product.name} - alternate view`"
          class="card-img-top hover-image"
        />
      </div>
      <div class="card-body d-flex flex-column align-items-start p-3">
        <h3 class="card-title fs-6 fw-semibold mb-2">{{ product.name }}</h3>
        <div class="mb-2 d-flex align-items-center gap-2">
          <template v-if="product.variations && product.variations.length">
            <span v-if="minVariationPrice !== maxVariationPrice" class="price">
              From ₹{{ minVariationPrice }}
            </span>
            <span v-else>
              ₹{{ minVariationPrice }}
            </span>
          </template>
          <template v-else>
            <span v-if="product.sale_price && product.sale_price < product.price">
              <span class="text-decoration-line-through  text-muted ">
                ₹{{ product.price }}
              </span>
              <span class="ms-1 price fw-bold">
                ₹{{ product.sale_price }}
              </span>
            </span>
            <span v-else class="price fw-bold">
              ₹{{ product.price }}
            </span>
          </template>
          <span v-if="product.average_rating !== undefined" class="ms-2 d-flex align-items-center">
            <LucideIcon icon="mdi:star" color="var(--color-warning)" size="18" class="me-1" />
            <span class="fw-semibold">{{ product.average_rating?.toFixed(1) || '0.0' }}</span>
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
    <div class="d-flex align-items-center w-100 px-3 pb-3" :class="{ 'justify-content-center': hideActions, 'justify-content-between': !hideActions }">
      <button 
        @click="handleWishlistToggle" 
        :class="[
          'btn wishlist-btn', 
          isInWishlist ? 'btn-danger' : 'btn-outline-secondary'
        ]" 
        :title="isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'"
      >
        <LucideIcon 
          :icon="isInWishlist ? 'mdi:heart' : 'mdi:heart-outline'" 
          :color="isInWishlist ? 'white' : 'var(--text-primary)'" 
        />
      </button>
      <template v-if="!hideActions">
        <button
          class="btn btn-primary add-to-cart-btn"
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
          <LucideIcon icon="mdi:eye-outline" :color="'var(--text-primary)'" />
        </button>
      </template>
    </div>
    <ProductQuickView v-if="showQuickView" :product="product" @close="closeQuickView" @add-to-cart="onQuickViewAddToCart" />
  </div>
  <div v-if="showNotification" class="toast-message">
    Product added to cart!
    <NuxtLink to="/CartPage" class="ms-2 text-white text-decoration-underline d-inline-flex align-items-center">
      <LucideIcon icon="mdi:cart" class="me-1" size="16" />
      View Cart
    </NuxtLink>
  </div>
  <div v-if="showWishlistNotification" class="toast-message wishlist-toast">
    Product added to wishlist! 
    <NuxtLink to="/wishlist" class="ms-2 text-white text-decoration-underline">View wishlist</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from 'vue';
import LucideIcon from './LucideIcon.vue';
import ProductQuickView from './ProductQuickView.vue';
import { useCart } from '@/composables/useCart';
import { useWishlist } from '@/composables/useWishlist';
import { useUserStore } from '@/stores/user';
import { useImageUrl } from '@/composables/useImageUrl.js'
import type { Product } from '@/types';

const { addToCart } = useCart();
const wishlistStore = useWishlist();
const userStore = useUserStore();
const { getImageUrl } = useImageUrl();

const showNotification = ref(false);
const showWishlistNotification = ref(false);
const showQuickView = ref(false);

const isAuthenticated = computed(() => !!userStore.token);
const isInWishlist = computed(() => wishlistStore.isInWishlist(props.product.id));

const handleWishlistToggle = async () => {
  if (!userStore.hydrated) {
    alert('Please wait, authentication state is loading.');
    return;
  }
  if (!isAuthenticated.value) {
    alert('You need to be logged in to manage your wishlist.');
    return;
  }
  try {
    const wasInWishlist = isInWishlist.value;
    await wishlistStore.toggleWishlist(props.product);
    
    // Show notification only when adding to wishlist
    if (!wasInWishlist) {
      showWishlistNotification.value = true;
      setTimeout(() => {
        showWishlistNotification.value = false;
      }, 3000);
    }
  } catch (err: any) {
    alert('Error updating wishlist: ' + (err?.message || err));
  }
};

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
    // If product has variations, open quick view for selection
    if (product.variations && product.variations.length) {
      openQuickView();
      return;
    }
    await addToCart(product);
    showNotification.value = true;
    setTimeout(() => {
      showNotification.value = false;
    }, 2000); // Hide notification after 2 seconds
  } catch (err: any) {
    alert('Error adding to cart: ' + (err?.message || err));
  }
};

// Listen for an event from ProductQuickView when a variation is selected and added
function onQuickViewAddToCart(payload: Product & { quantity?: number; variation_id?: number }) {
  // Only add variation_id if it exists in the payload
  const productToAdd: Product & { variation_id?: number } = { ...props.product };
  if (payload.variation_id !== undefined) {
    productToAdd.variation_id = payload.variation_id;
  }
  addToCart(productToAdd, payload.quantity ?? 1);
  showNotification.value = true;
  setTimeout(() => {
    showNotification.value = false;
  }, 2000);
  closeQuickView();
}

const openQuickView = () => {
  showQuickView.value = true;
};
const closeQuickView = () => {
  showQuickView.value = false;
};

const props = defineProps<{ 
  product: Product;
  hideActions?: boolean; // New prop to hide add to cart and quick view buttons
}>();

const images = computed(() => {
  // Only use image and image_2 for the product card
  const imgs = [props.product.image, props.product.image_2].filter(Boolean).map(imageUrl);
  return Array.from(new Set(imgs));
});

const minVariationPrice = computed(() => {
  if (props.product.variations && props.product.variations.length) {
    return Math.min(...props.product.variations.map(v => v.sale_price ?? v.price));
  }
  return props.product.sale_price ?? props.product.price;
});
const maxVariationPrice = computed(() => {
  if (props.product.variations && props.product.variations.length) {
    return Math.max(...props.product.variations.map(v => v.sale_price ?? v.price));
  }
  return props.product.sale_price ?? props.product.price;
});

// Helper for image fallback
function imageUrl(img: string) {
  const config = useRuntimeConfig();
  if (!img) return "/fallback.jpg";
  if (img.startsWith("http")) return img;
  return `${config.public.baseUrl}/storage/${img}`;
}


</script>

<style scoped lang="scss">
.product-card {
  transition: box-shadow 0.18s, transform 0.18s;
  box-shadow: 0 4px 8px rgba(var(--shadow-light-rgb), 0.1);
  border-radius: 8px;
  background-color: var(--background-white);
  border-color: var(--border-color);
}

.product-link {
  color: var(--text-primary) !important;
  
  &:hover {
    color: var(--text-primary) !important;
  }
}
.product-card:hover {
  box-shadow: 0 6px 12px rgba(var(--shadow-medium-rgb), 0.15);
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
  opacity: 0;
}
.main-image {
  opacity: 1;
  z-index: 1;
  transform: scale(1);
}
.hover-image {
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
  background-color: var(--background-white);
  border-color: var(--border-color);
}
.wishlist-btn:hover,
.quick-view-btn:hover {
  background-color: var(--background-light);
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
.price{
  color: var(--color-success);
  font-weight: 500;
}

.wishlist-toast {
  background-color: var(--color-success) !important;
  bottom: 80px !important; // Position above cart notification if both show
}

.wishlist-toast a {
  color: white !important;
  text-decoration: underline !important;
}

.wishlist-toast a:hover {
  opacity: 0.8;
}

.wishlist-only {
  justify-content: center !important;
}

// Toast notifications with dark mode support
.toast-message {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: var(--color-success);
  color: var(--text-white);
  padding: 12px 24px;
  border-radius: 8px;
  z-index: 1050;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-weight: 500;
  
  a {
    color: var(--text-white) !important;
    text-decoration: underline !important;
    
    &:hover {
      opacity: 0.8;
    }
  }
}


</style>