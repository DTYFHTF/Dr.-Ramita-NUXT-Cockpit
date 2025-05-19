<template>
  <div class="card h-100 product-card border-0 shadow-sm">
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
        <div class="mb-2">
          <span
            v-html="starRating(product.avg_rating || product.rating || 0)"
          ></span>
          <span class="ms-1 text-muted">
            ({{ (product.avg_rating || product.rating || 0).toFixed(1) }})
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
        <button
          class="btn btn-smooth-success w-100 mt-auto add-to-cart-btn"
          :disabled="!(product.in_stock ?? ((product.stock ?? 0) > 0))"
        >
          <span class="add-to-cart-text">Add to Cart</span>
          <LucideIcon
            icon="mdi:cart"
            color="white"
            class="add-to-cart-icon"
          />
        </button>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import LucideIcon from './LucideIcon.vue';

defineProps<{
  product: {
    name: string;
    price: number;
    sale_price?: number;
    image: string;
    image_2?: string;
    slug: string;
    avg_rating?: number;
    rating?: number;
    in_stock?: boolean;
    stock?: number;
  };
}>();

function starRating(rating: number) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    '<span class="text-warning">' +
    '★'.repeat(full) +
    (half ? '½' : '') +
    '<span class="text-muted">' +
    '★'.repeat(empty) +
    '</span>' +
    '</span>'
  );
}
</script>

<style scoped>
.product-card {
  transition: box-shadow 0.18s, transform 0.18s;
}
.product-card:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.13) !important;
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
  transform: scale(1.1); /* Zoom-in effect */
}
.image-container:hover .main-image {
  opacity: 0;
  transform: scale(1.1); /* Zoom-in effect */
}
.image-container:hover .hover-image {
  opacity: 1;
  transform: scale(1); /* Reset zoom for hover image */
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
</style>
