<template>
  <div class="quick-view-content">
    <div class="row g-0">
      <div class="col-12">
        <NuxtLink
          v-if="!showViewDetails"
          to="/products"
          class="d-inline-flex align-items-center mb-3 back-to-products-btn"
          title="Back to Products"
        >
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
          class="btn btn-smooth-success view-details-btn w-100 position-absolute start-0 end-0 bottom-0 rounded-0"
        >
          View Details
        </NuxtLink>
      </div>
      <div class="col-md-6 p-4">
          <div class="product-meta d-flex align-items-center mb-2 gap-2">
            <span
              v-if="product.average_rating"
              class="rating-badge d-inline-flex align-items-center px-2 py-1 rounded bg-success text-white fw-bold me-2"
            >
              <LucideIcon
                icon="mdi:star"
                size="16"
                color="white"
                class="me-1"
              />
              {{ product.average_rating.toFixed(1) }}
            </span>
            <h2>{{ product.name }}</h2>
          </div>
          
          <!-- Promotion badges -->
          <div v-if="product.applied_promotions && product.applied_promotions.length" class="promotions-section mb-3">
            <div class="d-flex gap-2 flex-wrap">
              <PromotionBadge 
                v-for="promo in product.applied_promotions" 
                :key="promo.id || promo.name"
                :promotion="promo"
              />
            </div>
            <div v-if="product.discount_percentage" class="savings-text mt-2 text-success fw-semibold">
              <LucideIcon icon="mdi:tag" size="16" class="me-1" />
              You save {{ product.discount_percentage }}%
            </div>
          </div>
          <div v-if="selectedVariation">
            <span
              v-if="
                selectedVariation.sale_price &&
                selectedVariation.sale_price < selectedVariation.price
              "
              class="d-flex "
            >
              <h4 class="text-decoration-line-through text-muted me-3">
                ₹{{ selectedVariation.price }}
              </h4>
              <h4 class="text-success fw-bold">
                ₹{{ selectedVariation.sale_price }}
              </h4>
            </span>
            <h4 v-else class="fw-bold text-success">
              ₹{{ selectedVariation.price }}
            </h4>
            <span
              class="badge ms-2"
              :class="
                (selectedVariation.stock ?? 0) > 0 ? 'bg-success' : 'bg-danger'
              "
            >
              {{
                (selectedVariation.stock ?? 0) > 0 ? "In stock" : "Out of stock"
              }}
            </span>
            <div v-if="selectedVariation.sku" class="my-1 text-muted small">
              SKU: {{ selectedVariation.sku }}
            </div>
          </div>
          <!-- Fallback if no variations -->
        <div v-else class="product-price mb-3">
          <!-- Show promotion pricing if available -->
          <template v-if="product.applied_promotions && product.applied_promotions.length">
            <div class="d-flex align-items-center gap-2">
              <h4 class="text-decoration-line-through text-muted mb-0">₹{{ product.price }}</h4>
              <h4 class="text-success fw-bold mb-0">₹{{ product.display_price }}</h4>
              <span class="badge bg-success">{{ product.discount_percentage }}% OFF</span>
            </div>
          </template>
          <!-- Fallback to manual sale price logic -->
          <template v-else-if="product.display_sale_price && Number(product.display_sale_price) < Number(product.price)">
            <div class="d-flex align-items-center gap-2">
              <h4 class="text-decoration-line-through text-muted mb-0">₹{{ product.price }}</h4>
              <h4 class="text-success fw-bold mb-0">₹{{ product.display_sale_price }}</h4>
            </div>
          </template>
          <!-- Regular price -->
          <template v-else>
            <h4 class="fw-bold text-success mb-0">₹{{ product.display_price ?? product.price }}</h4>
          </template>
        </div>
        <div class="product-description mb-3">
          <span class="clamp-4-lines">{{ product.description }}</span>
        </div>
        <!-- Variations Dropdown -->
        <div
          v-if="product.has_variations && product.variations && product.variations.length"
          class="mb-3"
        >
          <label class="fw-semibold mb-3">Quantity:</label>
          <div class="variation-buttons mb-2 d-flex flex-wrap gap-2">
            <button
              v-for="variation in product.variations"
              :key="variation.id"
              type="button"
              class="btn btn-outline btn-sm variation-btn py-2"
              :class="{
                active: selectedVariationId === variation.id,
                'out-of-stock': (variation.stock ?? 0) <= 0,
              }"
              :disabled="(variation.stock ?? 0) <= 0"
              @click="
                selectedVariationId = variation.id;
                updateSelectedVariation();
              "
            >
              {{ variation.name }}
            </button>
          </div>
          
        </div>
        

        <div class="d-flex align-items-center">
          <button class="btn btn-outline" @click="decrement" :disabled="quantity <= 1">
            -
          </button>
          <input
            type="number"
            class="form-control mx-2 text-center"
            style="width: 60px"
            v-model.number="quantity"
            min="1"
          />
          <button class="btn btn-outline" @click="increment">
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
          <span
            class="badge"
            :class="canAddToCart ? 'bg-success' : 'bg-danger'"
          >
            {{ canAddToCart ? "In stock" : "Out of stock" }}
          </span>
        </div>
        
        <div class="share-section mt-3">
          <span class="me-2">Share:</span>
          <a
            :href="shareUrl('whatsapp')"
            target="_blank"
            rel="noopener"
            title="Share on WhatsApp"
            ><LucideIcon icon="mdi:whatsapp" color="var(--brand-whatsapp)"
          /></a>
          <a
            :href="shareUrl('facebook')"
            target="_blank"
            rel="noopener"
            title="Share on Facebook"
            ><LucideIcon icon="mdi:facebook" color="var(--brand-facebook)"
          /></a>
          <a
            :href="shareUrl('twitter')"
            target="_blank"
            rel="noopener"
            title="Share on Twitter"
            ><LucideIcon icon="mdi:twitter" color="var(--brand-twitter)"
          /></a>
          <a
            :href="shareUrl('instagram')"
            target="_blank"
            rel="noopener"
            title="Share on Instagram"
            ><LucideIcon icon="mdi:instagram" color="var(--brand-instagram)"
          /></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import LucideIcon from "./LucideIcon.vue";
import PromotionBadge from "./PromotionBadge.vue";
import { useImageUrl } from '@/composables/useImageUrl.js'
import type { Product } from "@/types";

// --- Props ---
const props = defineProps<{ product: Product; showViewDetails?: boolean }>();
const emit = defineEmits(["add-to-cart"]);

const quantity = ref(1);
const selectedVariationId = ref<string | null>(null);

const inStock = computed(() => {
  return props.product.in_stock ?? (props.product.stock ?? 0) > 0;
});

function imageUrl(img: string) {
  const config = useRuntimeConfig();
  if (!img) return "/fallback.jpg";
  if (img.startsWith("http")) return img;
  return `${config.public.baseUrl}/storage/${img}`;
}


// Helper for image fallback
const images = computed(() => {
  const imgs = [
    props.product.image,
    props.product.image_2,
    props.product.image_3,
  ]
    .filter(Boolean)
    .map(imageUrl);
  return Array.from(new Set(imgs));
  
});

const selectedVariation = computed(() => {
  if (!props.product.has_variations || !props.product.variations) return null;
  return (
    props.product.variations.find(
      (v: any) => v.id === selectedVariationId.value
    ) || props.product.variations[0]
  );
});
const canAddToCart = computed(() => {
  if (props.product.has_variations && props.product.variations?.length) {
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
  if (props.product.has_variations && props.product.variations?.length && selectedVariation.value) {
    // Only pass parent product info, and set variation_id explicitly
    emit("add-to-cart", {
      ...props.product,
      variation_id: selectedVariation.value.id,
      quantity: quantity.value,
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
  const config = useRuntimeConfig();
  const url = `${config.public.baseUrl}/products/${props.product.slug}`;
  const title = props.product.name;
  const desc = props.product.description || "";
  const message = `${title}\n${desc}\n\n${url}`;
  const encodedMessage = encodeURIComponent(message);
  switch (platform) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
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
  background: transparent;
}
.quick-view-content {
  position: relative;
  background: var(--background-light); 
  border-radius: 10px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(var(--shadow-rgb), 0.18);
}
.quick-view-image {
  min-width: 200px;
  min-height: 200px;
  max-width: 100%;
  max-height: 420px;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  margin: 0 auto;
  display: block;
  box-shadow: 0 2px 8px rgba(var(--shadow-rgb), 0.04);
}

@media (max-width: 768px) {
  .quick-view-image {
    max-width: 100vw;
    max-height: 40vh;
    min-width: 120px;
    min-height: 120px;
  }
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
  border: none;
  border-left: 2px solid var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
  transform: rotate(45deg);
  width: 1rem;
  height: 1rem;
  background: none;
  mask: none !important;
  -webkit-mask: none !important;
}

.carousel-control-next-icon {
  background-image: none !important;
  border: none;
  border-right: 2px solid var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
  transform: rotate(-45deg);
  width: 1rem;
  height: 1rem;
  background: none;
  mask: none !important;
  -webkit-mask: none !important;
}

.btn.variation-btn.active {
  background-color: var(--color-success) !important; 
  color: var(--text-white) !important;
  border-color: var(--color-success) !important;
}
.carousel-inner {
  height: auto;
  min-height: 420px; 
  display: flex;
  align-items: center;
  background: transparent;
  transition: height 0.3s ease-in-out; 
}

@media (max-width: 768px) {
  .carousel-inner {
    height: 40vh;
  }
}
</style>
