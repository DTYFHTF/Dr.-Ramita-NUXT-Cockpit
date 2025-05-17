<template>
  <div class="product-detail-page">
    <div v-if="loading">Loading product...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="product">
      <img :src="product.image" :alt="product.name" class="product-detail-image" />
      <h1>{{ product.name }}</h1>
      <p class="product-price">${{ product.price }}</p>
      <p class="product-description">{{ product.description }}</p>
    </div>
    <div v-else>
      <p>Product not found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useProducts } from '@/composables/useProducts'
import { onMounted, watch } from 'vue'

const route = useRoute()
const { product, loading, error, fetchProduct } = useProducts()

let lastSlug = ''

async function loadProduct(slug: string) {
  if (slug === lastSlug && error.value) return // Prevent repeated fetches on error
  lastSlug = slug
  try {
    await fetchProduct(slug)
    // If product.value is wrapped in { data: ... }, unwrap it
    if (product.value && product.value.data) {
      product.value = product.value.data
    }
  } catch (e: any) {
    if (e?.status === 404) {
      error.value = 'Product not found.'
    } else {
      error.value = e?.data?.message || e?.message || 'Failed to fetch product.'
    }
  }
}

onMounted(() => {
  loadProduct(route.params.slug as string)
})

watch(() => route.params.slug, (slug) => {
  if (slug) loadProduct(slug as string)
})
</script>

<style scoped>
.product-detail-page {
  max-width: 600px;
  margin: 40px auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
}
.product-detail-image {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 2rem;
}
.product-price {
  color: #2d8f6f;
  font-weight: bold;
  font-size: 1.3rem;
  margin: 1rem 0;
}
.product-description {
  font-size: 1.1rem;
  color: #444;
}
.error {
  color: #c00;
  text-align: center;
  margin: 2rem 0;
}
</style>
