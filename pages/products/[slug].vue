<template>
  <div class="product-detail-page">
    <div v-if="loading" class="d-flex justify-content-center align-items-center min-vh-100">
      <div class="spinner-border text-success" style="width: 3rem; height: 3rem;" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="product">
      
      <div class="product-detail-flex">
        <!-- Content column -->
        <div class="product-detail-content-col">
          <ProductQuickViewContent :product="product" @add-to-cart="handleAddToCartProxy" :show-view-details="false" />
        </div>
      </div>

      <!-- Product Reviews Section -->
      <ProductReviewSection
        :product="product"
        :user="user"
        :isAdmin="isAdmin"
        @refresh="fetchProduct(route.params.slug as string)"
      />
      
    </div>
    <div v-else>
      <p class="visually-hidden">Product not found.</p>
    </div>

    <!-- Toast Notification -->
    <div v-if="showNotification" class="toast-message">Product added to cart!</div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useProducts } from "@/composables/useProducts";
import { onMounted, watch, computed, ref } from "vue";
import { useHead } from 'nuxt/app';
import { useCart } from '@/composables/useCart';
import ProductQuickViewContent from '@/components/ProductQuickViewContent.vue';
import ProductReviewSection from '@/components/ProductReviewSection.vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import type { User } from '@/types';
import { useImageUrl } from '@/composables/useImageUrl.js'

const route = useRoute();
const { product, loading, error, fetchProduct } = useProducts();
const { addToCart } = useCart();
const userStore = useUserStore();
const { user } = storeToRefs(userStore) as { user: Ref<User | null> };

let lastSlug = "";

// Admin check (customize as needed)
const isAdmin = computed(() => !!(user.value && user.value.role === 'admin'));

const { getImageUrl } = useImageUrl();

function imageUrl(img: string) {
  return getImageUrl(img, '/fallback.jpg');
}

// Helper for stock
const inStock = computed(
  () => product.value?.in_stock ?? product.value?.stock > 0
);

const selectedVariationId = ref<string | null>(null);
const selectedVariation = computed(() => {
  if (!product.value?.variations) return null;
  return product.value.variations.find((v: any) => v.id === selectedVariationId.value) || product.value.variations[0];
});

const canAddToCart = computed(() => {
  if (product.value?.variations?.length) {
    return selectedVariation.value && (selectedVariation.value.stock ?? 0) > 0;
  }
  return inStock.value;
});

async function loadProduct(slug: string) {
  if (slug === lastSlug && error.value) return; // Prevent repeated fetches on error
  lastSlug = slug;
  try {
    await fetchProduct(slug);
    // If product.value is wrapped in { data: ... }, unwrap it
    if (product.value && product.value.data) {
      product.value = product.value.data;
    }
  } catch (e: any) {
    if (e?.status === 404) {
      error.value = "Product not found.";
    } else {
      error.value =
        e?.data?.message || e?.message || "Failed to fetch product.";
    }
  }
}

onMounted(() => {
  loadProduct(route.params.slug as string);
});

watch(
  () => route.params.slug,
  (slug) => {
    if (slug) loadProduct(slug as string);
  }
);

watch(
  () => product.value?.variations,
  (vars) => {
    if (vars && vars.length) {
      selectedVariationId.value = vars[0].id;
    }
  },
  { immediate: true }
);

// --- SEO META TAGS ---
watch(
  () => product.value,
  (p) => {
    if (!p) return;
    const config = useRuntimeConfig();
    const url = `${config.public.baseUrl}/products/${p.slug || route.params.slug}`;
    useHead({
      title: p.name,
      meta: [
        { name: 'description', content: p.description || 'Shop Ayurvedic products.' },
        { property: 'og:title', content: p.name },
        { property: 'og:description', content: p.description || 'Shop Ayurvedic products.' },
        { property: 'og:image', content: imageUrl(p.image) },
        { property: 'og:url', content: url },
        { property: 'og:type', content: 'product' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: p.name },
        { name: 'twitter:description', content: p.description || 'Shop Ayurvedic products.' },
        { name: 'twitter:image', content: imageUrl(p.image) },
        { name: 'twitter:url', content: url },
      ],
      link: [
        { rel: 'canonical', href: url },
      ],
    });
  },
  { immediate: true }
);

const showNotification = ref(false);

function handleAddToCartProxy(payload: any) {
  // Always pass parent product, and set variation_id explicitly
  addToCart({ ...product.value, variation_id: payload.variation_id }, payload.quantity || 1);
  showNotification.value = true;
  setTimeout(() => {
    showNotification.value = false;
  }, 2000);
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/variables.scss';

.product-detail-page {
  width: 100vw;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.product-detail-flex {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  max-width: 1200px;
  margin: 48px auto 0 auto;
  gap: 0;
}
.product-detail-content-col {
  flex: 1 1 0;
  min-width: 0;
  max-width: none;
  display: flex;
  align-items: stretch;
  justify-content: center;
}
.quick-view-content {
  width: 100%;
  max-width: 1200px;
  min-height: 500px;
  padding:0px !important;
  background: $background-white;
  border-radius: 0;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2.5rem 2.5rem 2rem 2.5rem;
}
.product-reviews {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2.5rem;
}
.review-card {
  background: $background-light;
  border: 1px solid $border-color;
  border-radius: 0.375rem;
  transition: transform 0.2s;
}
.review-card:hover {
  transform: translateY(-2px);
}
@media (max-width: 1100px) {
  .product-detail-flex {
    flex-direction: column;
    align-items: center;
    gap: 0;
  }
  .product-detail-content-col {
    max-width: 100%;
    min-width: 0;
    width: 100%;
    justify-content: center;
  }
  .quick-view-content {
    padding: 1.5rem 0.5rem 1.5rem 0.5rem;
    min-height: 0;
  }
}
.error {
  color: $text-error;
  text-align: center;
  margin: 2rem 0;
}
.discount-badge {
  background: $color-secondary !important;
  color: $text-light !important;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.35rem;
  display: inline-block;
  vertical-align: middle;
  margin-left: 0.5rem;
}
</style>
