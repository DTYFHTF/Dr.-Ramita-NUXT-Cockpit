<template>
  <div class="quick-view-content">
    <div class="row g-0">
      <div class="col-12">
        <NuxtLink v-if="!showViewDetails" to="/products" class="d-inline-flex align-items-center mb-3 back-to-products-btn" title="Back to Products">
          <LucideIcon icon="mdi:view-grid" />
        </NuxtLink>
      </div>
    </div>
    <div class="row g-0">
      <div
        class="col-md-6 d-flex align-items-center justify-content-center flex-column position-relative image-col"
      >
        <!-- Bootstrap Carousel for product images -->
        <div
          v-if="images.length > 1"
          id="quickViewCarousel"
          class="carousel slide w-100"
          data-bs-ride="carousel"
        >
          <div class="carousel-inner">
            <div
              v-for="(img, idx) in images"
              :key="img"
              :class="['carousel-item', { active: idx === 0 }]"
            >
              <img
                :src="img"
                :alt="product.name"
                class="quick-view-image d-block mx-auto"
              />
            </div>
          </div>
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#quickViewCarousel"
            data-bs-slide="prev"
          >
            <span
              class="carousel-control-prev-icon custom-carousel-icon"
              aria-hidden="true"
            ></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#quickViewCarousel"
            data-bs-slide="next"
          >
            <span
              class="carousel-control-next-icon custom-carousel-icon"
              aria-hidden="true"
            ></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
        <!-- Fallback to single image if only one -->
        <img
          v-else
          :src="images[0]"
          :alt="product.name"
          class="quick-view-image"
        />
        <!-- View Details button fixed to bottom, full width, only on hover -->
        <NuxtLink
          v-if="showViewDetails !== false"
          :to="`/products/${product.slug}`"
          class="btn btn-smooth-primary view-details-btn w-100 position-absolute start-0 end-0 bottom-0 rounded-0"
        >
          View Details
        </NuxtLink>
      </div>
      <div class="col-md-6 p-4">
        <h2 class="product-title my-3">{{ product.name }}</h2>
        <div class="product-description mb-3">
          <span class="clamp-4-lines">{{ product.description }}</span>
        </div>
        <!-- Variations Dropdown -->
        <div
          v-if="product.variations && product.variations.length"
          class="mb-3"
        >
          <label class="fw-semibold mb-1">Choose a variation:</label>
          <select
            v-model="selectedVariationId"
            class="form-select mb-2"
            @change="updateSelectedVariation"
          >
            <option
              v-for="variation in product.variations"
              :key="variation.id"
              :value="variation.id"
            >
              {{ variation.name }}
              ({{ variation.stock ?? "Out of stock" }})
            </option>
          </select>
          <div v-if="selectedVariation">
            <span
              v-if="
                selectedVariation.sale_price &&
                selectedVariation.sale_price < selectedVariation.price
              "
            >
              <span class="text-decoration-line-through text-muted"
                >₹{{ selectedVariation.price }}</span
              >
              <span class="ms-2 text-success fw-bold"
                >₹{{ selectedVariation.sale_price }}</span
              >
            </span>
            <span v-else class="fw-bold text-success"
              >₹{{ selectedVariation.price }}</span
            >
            <span
              class="badge ms-2"
              :class="
                (selectedVariation.stock ?? 0) > 0
                  ? 'bg-success'
                  : 'bg-danger'
              "
            >
              {{ (selectedVariation.stock ?? 0) > 0 ? "In stock" : "Out of stock" }}
            </span>
            <div
              v-if="selectedVariation.sku"
              class="mt-1 text-muted small"
            >
              SKU: {{ selectedVariation.sku }}
            </div>
          </div>
        </div>
        <!-- Fallback if no variations -->
        <div v-else class="product-price mb-3">
          <span
            v-if="product.sale_price && product.sale_price < product.price"
          >
            <span class="text-decoration-line-through text-muted"
              >₹{{ product.price }}</span
            >
            <span class="ms-2 text-success fw-bold"
              >₹{{ product.sale_price }}</span
            >
          </span>
          <span v-else class="fw-bold text-success"
            >₹{{ product.price }}</span
          >
        </div>
        
        <div class="d-flex align-items-center mb-3">
          <button
            class="btn btn-outline-secondary"
            @click="decrement"
            :disabled="quantity <= 1"
          >
            -
          </button>
          <input
            type="number"
            class="form-control mx-2 text-center"
            style="width: 60px"
            v-model.number="quantity"
            min="1"
          />
          <button class="btn btn-outline-secondary" @click="increment">
            +
          </button>
          <button
            class="btn btn-smooth-success ms-3"
            :disabled="!canAddToCart"
            @click="addToCartHandler"
          >
            Add to cart
          </button>
        </div>
        <div class="mb-2">
          <span class="badge" :class="canAddToCart ? 'bg-success' : 'bg-danger'">
            {{ canAddToCart ? 'In stock' : 'Out of stock' }}
          </span>
        </div>
        <div class="share-section mt-3">
          <span class="me-2">Share:</span>
          <a
            :href="shareUrl('whatsapp')"
            target="_blank"
            rel="noopener"
            title="Share on WhatsApp"
            ><LucideIcon icon="mdi:whatsapp"
          /></a>
          <a
            :href="shareUrl('facebook')"
            target="_blank"
            rel="noopener"
            title="Share on Facebook"
            ><LucideIcon icon="mdi:facebook"
          /></a>
          <a
            :href="shareUrl('twitter')"
            target="_blank"
            rel="noopener"
            title="Share on Twitter"
            ><LucideIcon icon="mdi:twitter"
          /></a>
          <a
            :href="shareUrl('instagram')"
            target="_blank"
            rel="noopener"
            title="Share on Instagram"
            ><LucideIcon icon="mdi:instagram"
          /></a>
        </div>
      </div>
      <!-- Product Reviews Section removed from Quick View -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import LucideIcon from "./LucideIcon.vue";
import type { Product } from "@/types";

// --- Props ---
const props = defineProps<{ product: Product; showViewDetails?: boolean }>();
const emit = defineEmits(["add-to-cart"]);

const quantity = ref(1);
const selectedVariationId = ref<string | null>(null);

const inStock = computed(() => {
  return props.product.in_stock ?? (props.product.stock ?? 0) > 0;
});

// Helper for image fallback
function imageUrl(img: string) {
  if (!img) return "/fallback.jpg";
  if (img.startsWith("http")) return img;
  return `http://ayurveda-marketplace.test/storage/${img}`;
}

const images = computed(() => {
  const imgs = [
    props.product.image,
    props.product.image_2,
    props.product.image_3,
  ].filter(Boolean).map(imageUrl);
  return Array.from(new Set(imgs));
});

const selectedVariation = computed(() => {
  if (!props.product.variations) return null;
  return (
    props.product.variations.find((v: any) => v.id === selectedVariationId.value) ||
    props.product.variations[0]
  );
});
const canAddToCart = computed(() => {
  if (props.product.variations?.length) {
    return selectedVariation.value && (selectedVariation.value.stock ?? 0) > 0;
  }
  return inStock.value;
});

watch(
  () => props.product.variations,
  (vars) => {
    if (vars && vars.length) {
      selectedVariationId.value = vars[0].id;
    }
  },
  { immediate: true }
);

function increment() {
  quantity.value++;
}
function decrement() {
  if (quantity.value > 1) quantity.value--;
}
function addToCartHandler() {
  if (props.product.variations?.length && selectedVariation.value) {
    emit("add-to-cart", {
      ...props.product,
      ...selectedVariation.value,
      variation_id: selectedVariation.value.id,
      quantity: quantity.value
    });
  } else {
    emit("add-to-cart", { ...props.product, quantity: quantity.value });
  }
}

function updateSelectedVariation() {
  const variation = props.product.variations?.find(
    (v) => v.id === selectedVariationId.value
  );
  if (variation) {
    quantity.value = 1;
  }
}

function shareUrl(platform: string) {
  const url = `https://ayurveda-marketplace.test/products/${props.product.slug}`;
  const title = props.product.name;
  const desc = props.product.description || "";
  const message = `${title}\n${desc}\n\n${url}`;
  const encodedMessage = encodeURIComponent(message);
  switch (platform) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?text=${encodedMessage}`;
    case "whatsapp":
      return `https://wa.me/?text=${encodedMessage}`;
    case "instagram":
      return `https://www.instagram.com/`;
    default:
      return url;
  }
}
</script>

<style scoped lang="scss">
.back-to-products-btn {
  position: absolute;
  top: 9px;
  right: 27px;
  left: auto;
  z-index: 10;
  font-size: 1rem;
  background:transparent;
}
.quick-view-content {
  position: relative;
  background: #fff;
  border-radius: 10px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
}
.quick-view-image {
  min-width: 280px;
  min-height: 340px;
  max-height: 420px;
  object-fit: contain;
  border-radius: 8px;
  margin: 0 auto;
  display: block;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.image-col {
  position: relative;
  &:hover .view-details-btn,
  &:focus-within .view-details-btn {
    opacity: 1;
    pointer-events: auto;
  }
}
.view-details-btn {
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  z-index: 2;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  border-radius: 0 0 8px 8px;
  /* Prevent parent transform/translate from affecting this button */
  transform: none !important;
}
.share-section a {
  margin-right: 16px;
  font-size: 1.5rem;
  vertical-align: middle;
  display: inline-flex;
}


.carousel-control-prev-icon,
.carousel-control-next-icon {
  filter: none !important;
  background-color: transparent !important;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  opacity: 1;
  box-shadow: none;
  mask-image: none !important;
  -webkit-mask-image: none !important;
}
.carousel-control-prev-icon {
  background-image: none !important;
  /* Use SVG for left arrow */
  mask: url('data:image/svg+xml;utf8,<svg fill="%23226144" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M11 2 5 8l6 6" stroke="%23226144" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>') center/1.5rem 1.5rem no-repeat !important;
  -webkit-mask: url('data:image/svg+xml;utf8,<svg fill="%23226144" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M11 2 5 8l6 6" stroke="%23226144" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>') center/1.5rem 1.5rem no-repeat !important;
  background-color: #226144 !important;
}
.carousel-control-next-icon {
  background-image: none !important;
  /* Use SVG for right arrow */
  mask: url('data:image/svg+xml;utf8,<svg fill="%23226144" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M5 2l6 6-6 6" stroke="%23226144" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>') center/1.5rem 1.5rem no-repeat !important;
  -webkit-mask: url('data:image/svg+xml;utf8,<svg fill="%23226144" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M5 2l6 6-6 6" stroke="%23226144" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>') center/1.5rem 1.5rem no-repeat !important;
  background-color: #226144 !important;
}
.product-reviews {
  border-top: 1px solid #e9ecef;
  padding-top: 1.5rem;
}
.review-card {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  padding: 1rem;
  transition: transform 0.2s;
}
.review-card:hover {
  transform: translateY(-2px);
}
.admin-reply {
  background: #e2f7e2;
  border-left: 4px solid #28a745;
}
</style>
