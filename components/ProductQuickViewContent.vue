<template>
  <div class="quick-view-content">
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
          :src="product.image"
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
        <div class="product-description mb-3">
          <span class="clamp-4-lines">{{ product.description }}</span>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import LucideIcon from "./LucideIcon.vue";
import type { Product } from "@/types";

const props = defineProps<{ product: Product, showViewDetails?: boolean }>();
const emit = defineEmits(["add-to-cart"]);

const quantity = ref(1);
const selectedVariationId = ref<string | null>(null);

const inStock = computed(() => {
  return props.product.in_stock ?? (props.product.stock ?? 0) > 0;
});

const images = computed(() => {
  const imgs = [
    props.product.image,
    props.product.image_2,
    props.product.image_3,
  ].filter(Boolean);
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
.quick-view-content {
  background: #fff;
  border-radius: 10px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
}
.quick-view-image {
  min-width: 260px;
  min-height: 340px;
  max-width: 260px;
  max-height: 340px;
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
</style>
