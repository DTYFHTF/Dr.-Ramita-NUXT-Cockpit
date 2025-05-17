<template>
  <div class="product-card">
    <NuxtLink :to="`/products/${product.slug}`">
      <img :src="product.image" :alt="product.name" class="product-image" />
      <div class="product-info">
        <h3>{{ product.name }}</h3>
        <p class="product-price">${{ product.price }}</p>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{ product: { name: string; price: number; image: string; slug: string } }>()
</script>

<style scoped>
.product-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  overflow: hidden;
  transition: box-shadow 0.2s;
  margin-bottom: 1.5rem;
}
.product-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}
.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.product-info {
  padding: 1rem;
}
.product-price {
  color: #2d8f6f;
  font-weight: bold;
  margin-top: 0.5rem;
}
</style>
