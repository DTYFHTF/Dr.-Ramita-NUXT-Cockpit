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
      <div class="product-reviews mt-5">
        <h4 class="mb-2">Customer Reviews</h4>
        <div v-if="(product.review_count ?? 0) > 0" class="mb-2">
          <span class="fs-5 fw-bold">{{ product.average_rating?.toFixed(1) || '0.0' }}</span>
          <span class="text-warning ms-1">
            <ProductStarIcon v-for="i in 5" :key="i" :filled="i <= Math.round(product.average_rating || 0)" />
          </span>
          <span class="text-muted ms-2">({{ product.review_count ?? 0 }} reviews)</span>
        </div>
        <div v-else class="text-muted mb-2">No reviews yet.</div>

        <!-- Latest 3 Reviews -->
        <div v-if="product.latest_reviews && product.latest_reviews.length">
          <div v-for="review in product.latest_reviews.slice(0, 3)" :key="review.id" class="review-card mb-3 p-3 border rounded">
            <div class="d-flex align-items-center mb-1">
              <span class="fw-semibold me-2">{{ review.user?.name || 'Anonymous' }}</span>
              <span class="text-muted small">{{ review.user?.email }}</span>
              <span class="ms-auto text-warning">
                <ProductStarIcon v-for="i in 5" :key="i" :filled="i <= review.rating" />
                <span class="ms-1 small">({{ review.rating }})</span>
              </span>
            </div>
            <div class="review-comment mb-1">{{ review.comment }}</div>
            <div v-if="review.reply" class="admin-reply bg-light p-2 rounded small mt-2">
              <span class="fw-bold text-success">Admin reply:</span>
              <span>{{ review.reply }}</span>
              <span v-if="review.replied_by" class="text-muted ms-2">- {{ review.replied_by?.name }}</span>
            </div>
            <div class="text-muted small mt-1">{{ new Date(review.created_at).toLocaleString() }}</div>
          </div>
        </div>
      </div>
      
    </div>
    <div v-else>
      <p class="visually-hidden">Product not found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useProducts } from "@/composables/useProducts";
import { onMounted, watch, computed, ref } from "vue";
import { useHead } from 'nuxt/app';
import { useCart } from '@/composables/useCart';
import ProductQuickViewContent from '@/components/ProductQuickViewContent.vue';
import ProductStarIcon from '@/components/ProductStarIcon.vue';

const route = useRoute();
const { product, loading, error, fetchProduct } = useProducts();
const { addToCart } = useCart();

let lastSlug = "";

// Helper for image fallback
function imageUrl(img: string) {
  if (!img) return "/fallback.jpg";
  if (img.startsWith("http")) return img;
  return `http://ayurveda-marketplace.test/storage/${img}`;
}

// Helper for star rating (rounded to 1 decimal, up to 5 stars)
const starArray = computed(() => {
  const rating = product.value?.rating || 0;
  const rounded = Math.round(rating * 2) / 2;
  return Array.from({ length: 5 }, (_, i) => {
    if (i + 1 <= rounded) return "full";
    if (i + 0.5 === rounded) return "half";
    return "empty";
  });
});

// Helper for price display
const isOnSale = computed(
  () =>
    product.value?.sale_price && product.value.sale_price < product.value.price
);

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
    const url = `https://ayurveda-marketplace.test/products/${p.slug || route.params.slug}`;
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

function handleAddToCartProxy(payload: any) {
  // Accepts the payload from ProductQuickViewContent and calls addToCart
  if (payload.variation_id) {
    addToCart(payload, payload.quantity || 1);
  } else {
    addToCart(payload, payload.quantity || 1);
  }
}
</script>

<style scoped>
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
  background: #fff;
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
  background: #f8f9fa;
  border: 1px solid #dee2e6;
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
  color: #c00;
  text-align: center;
  margin: 2rem 0;
}
</style>
