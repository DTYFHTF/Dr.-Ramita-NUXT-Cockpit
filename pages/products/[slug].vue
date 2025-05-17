<template>
  <div class="product-detail-page container">
    <div v-if="loading">Loading product...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="product">
      <!-- Breadcrumbs -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <NuxtLink to="/products">Shop</NuxtLink>
          </li>
          <li v-if="product.category" class="breadcrumb-item">
            <NuxtLink :to="`/products?category=${product.category}`">{{ product.category }}</NuxtLink>
          </li>
          <li class="breadcrumb-item active" aria-current="page">{{ product.name }}</li>
        </ol>
      </nav>
      <div class="row g-4 align-items-start">
        <!-- Images column -->
        <div class="col-12 col-md-6">
          <ProductImages :image="product.image" :image2="product.image_2" :image3="product.image_3" :name="product.name" />
        </div>
        <!-- Content column -->
        <div class="col-12 col-md-6">
          <h1 class="mb-2">{{ product.name }}</h1>
          <div class="mb-2 text-muted" v-if="product.category">
            Category: <NuxtLink :to="`/products?category=${product.category}`">{{ product.category }}</NuxtLink>
          </div>
          <div class="mb-2 d-flex align-items-center gap-3">
            <span v-if="product.sale_price && product.sale_price < product.price">
              <span class="text-decoration-line-through text-muted">${{ product.price }}</span>
              <span class="ms-2 text-danger fw-bold">${{ product.sale_price }}</span>
            </span>
            <span v-else class="product-price">${{ product.price }}</span>
            <span class="badge" :class="product.in_stock ? 'bg-success' : 'bg-danger'">
              {{ product.in_stock ? 'In stock' : 'Out of stock' }}
            </span>
          </div>
          <div class="mb-3">
            <span class="star-rating">
              <span v-for="(star, index) in starArray" :key="index">
                <i class="bi" :class="star === 'full' ? 'bi-star-fill' : (star === 'half' ? 'bi-star-half' : 'bi-star')"></i>
              </span>
              <span class="ms-2">{{ product.rating ? product.rating.toFixed(1) : '0.0' }}/5</span>
            </span>
          </div>
          <div class="product-description mb-4">
            {{ product.description || 'No description available.' }}
          </div>
          <button class="btn btn-primary" :disabled="!inStock">Add to cart</button>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Product not found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useProducts } from '@/composables/useProducts'
import { onMounted, watch, computed } from 'vue'

const route = useRoute()
const { product, loading, error, fetchProduct } = useProducts()

let lastSlug = ''

// Helper for image fallback
function imageUrl(img: string) {
  if (!img) return '/fallback.jpg'
  if (img.startsWith('http')) return img
  return `http://ayurveda-marketplace.test/storage/${img}`
}

// Helper for star rating (rounded to 1 decimal, up to 5 stars)
const starArray = computed(() => {
  const rating = product.value?.rating || 0
  const rounded = Math.round(rating * 2) / 2
  return Array.from({ length: 5 }, (_, i) => {
    if (i + 1 <= rounded) return 'full'
    if (i + 0.5 === rounded) return 'half'
    return 'empty'
  })
})

// Helper for price display
const isOnSale = computed(() => product.value?.sale_price && product.value.sale_price < product.value.price)

// Helper for stock
const inStock = computed(() => product.value?.in_stock ?? product.value?.stock > 0)

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
  max-width: 1200px;
  margin: 40px auto;
  padding: 2rem;
  background: #fff;
}
.product-detail-image {
  width: 100%;
  max-width: 350px;
  height: 320px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 2rem;
  background: #f8f8f8;
}
.product-thumb {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #eee;
  margin-bottom: 8px;
  background: #f8f8f8;
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
.star-rating i {
  color: #f7b500;
  font-size: 1.2rem;
}
.breadcrumb {
  background: none;
  padding: 0;
  margin-bottom: 1rem;
}
@media (max-width: 767px) {
  .product-detail-image {
    margin-bottom: 1rem;
    max-width: 100%;
    height: 220px;
  }
  .product-thumb {
    width: 50px;
    height: 50px;
  }
}
</style>
