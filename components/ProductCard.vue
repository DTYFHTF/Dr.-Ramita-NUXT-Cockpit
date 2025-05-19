<template>
  <div class="card h-100 product-card border-0 shadow-sm">
    <NuxtLink
      :to="`/products/${product.slug}`"
      class="text-decoration-none text-dark d-flex flex-column h-100"
    >
      <img
        :src="product.image"
        :alt="product.name"
        class="card-img-top object-fit-cover"
        style="height: 180px; background: #f8f8f8"
      />
      <div class="card-body d-flex flex-column align-items-start p-3">
        <h3 class="card-title fs-6 fw-semibold mb-2">{{ product.name }}</h3>
        <p class="card-text product-price fw-bold text-success mb-0">
          ${{ product.price }}
        </p>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps<{
  product: { name: string; price: number; image: string; slug: string };
}>();
</script>

<style scoped>
.product-card {
  transition: box-shadow 0.18s, transform 0.18s;
}
.product-card:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.13) !important;
  transform: translateY(-4px) scale(1.02);
}
</style>
