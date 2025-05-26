<template>
  <teleport to="body">
    <div class="quick-view-modal" v-show="product">
      <div class="quick-view-content">
        <!-- Modal header with title and close button -->

        <button
          class="close-btn ms-3"
          @click="$emit('close')"
          aria-label="Close"
        >
          &times;
        </button>

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
            <!-- View Details button fixed to bottom -->
            <NuxtLink
              :to="`/products/${product.slug}`"
              class="btn btn-smooth-primary view-details-btn"
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
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import LucideIcon from "./LucideIcon.vue";
import { useCart } from "@/composables/useCart";
import type { Product } from "@/types";

const props = defineProps<{ product: Product }>();
const emit = defineEmits(["close", "add-to-cart"]);

const { addToCart } = useCart();
const quantity = ref(1);
const selectedVariationId = ref<string | null>(null);

const inStock = computed(() => {
  return props.product.in_stock ?? (props.product.stock ?? 0) > 0;
});

// Computed array of images for the carousel
const images = computed(() => {
  const imgs = [
    props.product.image,
    props.product.image_2,
    props.product.image_3,
  ].filter(Boolean);
  // Remove duplicates and falsy values
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
    // Emit the selected variation as a product-like object, including quantity
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
    quantity.value = 1; // Reset quantity to 1 when changing variation
  }
}

function shareUrl(platform: string) {
  const url = `https://ayurveda-marketplace.test/products/${props.product.slug}`;
  // WhatsApp and Twitter require a single decoded string for the text param
  const title = props.product.name;
  const desc = props.product.description || "";
  const message = `${title}\n${desc}\n\n${url}`;
  const encodedMessage = encodeURIComponent(message);
  switch (platform) {
    case "facebook":
      // Facebook will scrape the URL for og:image and og:description
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`;
    case "twitter":
      // Twitter: only the URL at the end will generate a preview
      return `https://twitter.com/intent/tweet?text=${encodedMessage}`;
    case "whatsapp":
      // WhatsApp: only the URL at the end will generate a preview
      return `https://wa.me/?text=${encodedMessage}`;
    case "instagram":
      // Instagram does not support direct web sharing
      return `https://www.instagram.com/`;
    default:
      return url;
  }
}
</script>

<style scoped lang="scss">
.quick-view-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}
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
.quick-view-header {
  min-height: 48px;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
  /* Remove flex, use block layout */
  position: relative;
}
.close-btn {
  position: absolute;
  top: 18px;
  right: 24px;
  font-size: 2rem;
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  z-index: 10;
  line-height: 1;
  transition: color 0.2s;
}
.close-btn:hover {
  color: #c00;
}
.quick-view-image {
  max-width: 100%;
  max-height: 350px;
  border-radius: 8px;
  object-fit: contain;
  margin: 0 auto;
  display: block;
}
.product-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #222;
  margin: 0;
  padding-right: 2.5rem; /* space for close button */
}
.product-price {
  font-size: 1.3rem;
}
.product-description {
  color: #555;
  font-size: 1.05rem;
}
.clamp-4-lines {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  max-height: 6.2em; /* ~4 lines for 1.05rem font-size */
}
.share-section a {
  color: #333;
  margin-right: 10px;
  font-size: 1.2rem;
  transition: color 0.2s;
}
.share-section a:hover {
  color: #1abc9c;
}
.carousel-inner {
  width: 100%;
  text-align: center;
}
.carousel-item img {
  max-width: 100%;
  max-height: 350px;
  border-radius: 8px;
  object-fit: contain;
  margin: 0 auto;
  display: block;
}
/* Make carousel control icons dark on white background */
.carousel-control-prev-icon,
.carousel-control-next-icon {
  filter: invert(1) brightness(0.2);
}
.col-md-6.position-relative {
  min-height: 420px;
}
.image-col {
  position: relative;
}
.view-details-btn {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  z-index: 2;
  opacity: 0;
  pointer-events: none;
  transform: none !important;
}
.image-col:hover .view-details-btn,
.image-col:focus-within .view-details-btn {
  opacity: 1;
  pointer-events: auto;
}
.quick-view-image,
.carousel-inner {
  margin-bottom: 3.5rem; /* space for button */
}
</style>
