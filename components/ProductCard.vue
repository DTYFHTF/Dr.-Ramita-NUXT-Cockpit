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
        <!-- Product name with badges on the right -->
        <div class="d-flex align-items-center justify-content-between w-100 mb-2">
          <h3 class="card-title fs-6 fw-semibold mb-0 flex-grow-1">{{ product.name }}</h3>
          
          <!-- Product type badges - reusable component -->
          <ProductBadges :product="product" :size="20" />
        </div>
        
        <!-- Stock badge at top: show availability clearly -->
        

        <!-- Simple pricing using price_breakdown if available, otherwise fallback to existing logic -->
        <div class="mb-2 d-flex align-items-center gap-2 price-and-badges">
          <div class="price-block d-flex align-items-center gap-2">
            <!-- Show discounted (final) price first, then original struck price when a discount exists -->
            <template v-if="product.price_breakdown">
              <span class="ms-1 price fw-bold">
                <template v-if="product.has_variations">From </template>₹{{ product.price_breakdown.final_price }}
              </span>
              <span v-if="product.price_breakdown.discount_amount > 0" class="text-decoration-line-through text-secondary ms-2 small">
                ₹{{ product.price_breakdown.original_price }}
              </span>
            </template>

            <!-- Fallback to applied_promotions logic -->
            <template v-else-if="product.applied_promotions && product.applied_promotions.length">
              <span class="ms-1 price fw-bold">
                <template v-if="product.has_variations">From </template>₹{{ product.display_price }}
              </span>
              <span v-if="product.discount_percentage" class="text-decoration-line-through text-secondary ms-2 small">
                ₹{{ product.price }}
              </span>
            </template>

            <!-- Fallback to manual sale price -->
            <template v-else-if="isOnSale">
              <span class="ms-1 price fw-bold">
                <template v-if="product.has_variations">From </template>₹{{ product.display_price }}
              </span>
              <span class="text-decoration-line-through text-secondary ms-2 small">
                ₹{{ product.price }}
              </span>
            </template>

            <!-- Regular price -->
            <template v-else>
              <span class="price fw-bold">
                <template v-if="product.has_variations">From </template>₹{{ product.display_price ?? product.price }}
              </span>
            </template>
          </div>

          <!-- Inline promotion badges aligned to the right on wide screens -->
          <div v-if="getPromotions().length" class="promotion-badges ms-auto d-flex gap-2 align-items-center">
            <PromotionBadge 
              v-for="promo in getPromotions()" 
              :key="promo.id || promo.name"
              :promotion="promo"
              compact
            />
          </div>
        </div>
        <!-- Rating -->
        <div v-if="product.average_rating !== undefined" class="mb-2 d-flex align-items-center">
          <LucideIcon icon="mdi:star" color="var(--color-warning)" size="18" class="me-1" />
          <span class="fw-semibold">{{ product.average_rating?.toFixed(1) || '0.0' }}</span>
        </div>
        <div class="mb-2">
          <span class="badge stock-badge" :class="isInStock ? 'bg-success' : 'bg-danger'">
            {{ isInStock ? 'In stock' : 'Out of stock' }}
          </span>
        </div>
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
          :color="isInWishlist ? 'var(--color-error)' : 'var(--text-primary)'" 
        />
      </button>
      <template v-if="!hideActions">
        <button
          class="btn btn-smooth-success add-to-cart-btn"
          :disabled="!isInStock"
          @click.stop="handleAddToCart(product)"
        >
          <span class="add-to-cart-text">Add to Cart</span>
          <LucideIcon
            icon="mdi:cart"
            color="white"
            class="add-to-cart-icon"
          />
        </button>
        <button class="btn btn-outline-secondary quick-view-btn" title="Product Quick View" @click.stop="openQuickView" :disabled="isLoadingProduct">
          <LucideIcon v-if="!isLoadingProduct" icon="mdi:eye-outline" :color="'var(--text-primary)'" />
          <div v-else class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </button>
      </template>
    </div>
    <ProductQuickView v-if="showQuickView && fullProduct" :product="fullProduct" @close="closeQuickView" @add-to-cart="onQuickViewAddToCart" />
  </div>
  <CartToast :show="showNotification" message="Product added to cart!" link-href="/CartPage" link-text="View Cart" />
  <div v-if="showWishlistNotification" class="toast-message wishlist-toast">
    Product added to wishlist! 
    <NuxtLink to="/dashboard?tab=wishlist" class="ms-2 text-white text-decoration-underline">View wishlist</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from 'vue';
import LucideIcon from './LucideIcon.vue';
import ProductQuickView from './ProductQuickView.vue';
import ProductBadges from './ProductBadges.vue';
import PromotionBadge from './PromotionBadge.vue';
import CartToast from './CartToast.vue';
import { useCart } from '@/composables/useCart';
import { useWishlist } from '@/composables/useWishlist';
import { useUserStore } from '@/stores/user';
import { useProducts } from '@/composables/useProducts';
import type { Product } from '@/types';

const { addToCart } = useCart();
const wishlistStore = useWishlist();
const userStore = useUserStore();
const { fetchProduct, product: fetchedProduct } = useProducts();

const showNotification = ref(false);
const showWishlistNotification = ref(false);
const showQuickView = ref(false);
const fullProduct = ref<Product | null>(null);
const isLoadingProduct = ref(false);

const isAuthenticated = computed(() => !!userStore.token);
const isInWishlist = computed(() => wishlistStore.isInWishlist(props.product.id));

// Price calculations for the new components
const isOnSale = computed(() => {
  const displaySalePrice = (props.product as any).display_sale_price ?? null;
  const displayPrice = props.product.display_price ?? props.product.price;
  return displaySalePrice && Number(displaySalePrice) < Number(displayPrice);
});

const originalPrice = computed(() => {
  return isOnSale.value ? (props.product.price) : (props.product.display_price ?? props.product.price);
});

// Simple and reliable stock checking - back to basics


const isInStock = computed(() => {
  if (props.product.has_variations) {
    return (props.product.total_stock ?? 0) > 0;
  } else {
    // Use the original logic that was working
    return props.product.in_stock ?? ((props.product.stock ?? 0) > 0);
  }
});

// Get promotions from price_breakdown if available, otherwise fallback to applied_promotions
const getPromotions = () => {
  if (props.product.price_breakdown?.applied_promotions?.length) {
    return props.product.price_breakdown.applied_promotions;
  }
  return props.product.applied_promotions ?? [];
};

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
    // If product has variations, always open quick view for selection
    if (product.has_variations && product.variations && product.variations.length > 0) {
      openQuickView();
      return;
    }
    
    // For products without variations, add directly to cart
    await addToCart(product);
    showNotification.value = true;
    setTimeout(() => {
      showNotification.value = false;
    }, 2000); // Hide notification after 2 seconds
  } catch (err: any) {
    console.error('Add to cart error:', err);
    
    // Better error handling for 422 validation errors
    if (err?.status === 422) {
      if (err?.data?.error?.includes('variation')) {
        // If it's a variation error, open quick view
        openQuickView();
        return;
      }
      alert('Validation error: ' + (err?.data?.error || err?.data?.message || 'Invalid product data'));
    } else {
      alert('Error adding to cart: ' + (err?.data?.message || err?.message || 'Unknown error'));
    }
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

const openQuickView = async () => {
  // If product already has variations, just show it
  if (props.product.has_variations && props.product.variations && props.product.variations.length > 0) {
    fullProduct.value = props.product;
    showQuickView.value = true;
    return;
  }
  
  // Otherwise, fetch the full product with variations
  try {
    isLoadingProduct.value = true;
    await fetchProduct(props.product.slug);
    
    // Use the fetched product if available, otherwise fallback to current product
    fullProduct.value = fetchedProduct.value || props.product;
    showQuickView.value = true;
  } catch (error) {
    console.error('Error fetching product details:', error);
    // Fallback to original product if fetch fails
    fullProduct.value = props.product;
    showQuickView.value = true;
  } finally {
    isLoadingProduct.value = false;
  }
};
const closeQuickView = () => {
  showQuickView.value = false;
  fullProduct.value = null;
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

// Helper for image fallback
function imageUrl(img: string) {
  const config = useRuntimeConfig();
  if (!img) return "/fallback.jpg";
  if (img.startsWith("https")) return img;
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
  transition: all 0.3s ease;
  background-color: var(--background-white);
  border-color: var(--border-color);
}

.wishlist-btn:hover,
.quick-view-btn:hover,
.wishlist-btn:active,
.quick-view-btn:active {
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

/* Layout tweaks: put promotion badges beside price on larger screens */
.price-and-badges {
  width: 100%;
}

.promotion-badges {
  flex-shrink: 0;
}

@media (max-width: 767px) {
  .price-and-badges {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .promotion-badges {
    width: 100%;
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
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

