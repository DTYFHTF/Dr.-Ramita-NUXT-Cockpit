<template>
  <div class="container py-4">
    <div class="d-flex flex-wrap align-items-center mb-3 gap-3">
      <div class="flex-grow-1">
        <h1 class="mb-0">Products</h1>
      </div>
      <div class="d-flex gap-2 flex-wrap">
        <div>
          <label class="form-label mb-0 me-2">Sort by:</label>
          <select v-model="sort" class="form-select form-select-sm d-inline w-auto" @change="onSortChange">
            <option value="">Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Rating: High to Low</option>
            <option value="rating_asc">Rating: Low to High</option>
          </select>
        </div>
        <div>
          <label class="form-label mb-0 me-2">Category:</label>
          <select v-model="category" class="form-select form-select-sm d-inline w-auto" @change="onCategoryChange">
            <option value="">All</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
        <div class="d-flex align-items-center">
          <label class="form-label mb-0 me-2">Price:</label>
          <input type="range" class="form-range w-100" min="minPrice" :max="maxPrice" v-model.number="priceMax" @input="onPriceChange" />
          <span class="ms-2">Up to ₹{{ priceMax }}</span>
        </div>
      </div>
    </div>
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>
    </div>
    <div v-else-if="error" class="alert alert-danger text-center">{{ error }}</div>
    <div v-else-if="products.length === 0" class="alert alert-info text-center">No products found.</div>
    <div class="row g-4">
      <div v-for="product in paginatedProducts" :key="product.id" class="col-12 col-sm-6 col-lg-4">
        <div class="card h-100 product-card position-relative overflow-hidden">
          <NuxtLink :to="`/products/${product.slug}`" class="stretched-link">
            <div class="product-image-wrapper position-relative">
              <img :src="imageUrl(product.image)" :alt="product.name" class="card-img-top product-image main-img" />
              <img v-if="product.image_2" :src="imageUrl(product.image_2)" :alt="product.name" class="card-img-top product-image hover-img position-absolute top-0 start-0 w-100 h-100" />
              <span class="badge bg-success position-absolute top-0 end-0 m-2" v-if="product.stock > 0">In Stock</span>
              <span class="badge bg-danger position-absolute top-0 end-0 m-2" v-else>Sold Out</span>
            </div>
            <div class="card-body">
              <h5 class="card-title mb-2">{{ product.name }}</h5>
              <div class="mb-2">
                <span v-if="product.sale_price" class="text-success fw-bold">₹{{ product.sale_price }}</span>
                <span v-else class="fw-bold">₹{{ product.price }}</span>
                <span v-if="product.sale_price" class="text-muted ms-2 text-decoration-line-through">₹{{ product.price }}</span>
              </div>
              <div class="mb-2">
                <span v-html="starRating(product.avg_rating)"></span>
                <span class="ms-1 text-muted">({{ product.avg_rating?.toFixed(1) || '0.0' }})</span>
              </div>
              <button class="btn btn-outline-success w-100 mt-2" :disabled="product.stock === 0">Add to Cart</button>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
    <nav v-if="totalPages > 1" class="mt-4 d-flex justify-content-center">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: page === 1 }">
          <button class="page-link" @click="goToPage(page - 1)" :disabled="page === 1">Previous</button>
        </li>
        <li v-for="p in totalPages" :key="p" class="page-item" :class="{ active: p === page }">
          <button class="page-link" @click="goToPage(p)">{{ p }}</button>
        </li>
        <li class="page-item" :class="{ disabled: page === totalPages }">
          <button class="page-link" @click="goToPage(page + 1)" :disabled="page === totalPages">Next</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useProducts } from '@/composables/useProducts'
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const { products, loading, error, fetchProducts } = useProducts()
const route = useRoute()
const router = useRouter()

const sort = ref(route.query.sort || '')
const category = ref(route.query.category || '')
const priceMax = ref(Number(route.query.priceMax) || 10000)
const page = ref(Number(route.query.page) || 1)
const perPage = 9

const categories = ref([
  { id: '', name: 'All' },
  { id: 1, name: 'Herbal' },
  { id: 2, name: 'Skincare' },
  { id: 3, name: 'Supplements' }
])

const minPrice = 0
const maxPrice = 10000

onMounted(() => {
  fetchProducts()
})

watch([sort, category, priceMax, page], () => {
  router.replace({
    query: {
      ...route.query,
      sort: sort.value || undefined,
      category: category.value || undefined,
      priceMax: priceMax.value || undefined,
      page: page.value || undefined
    }
  })
})

const filteredProducts = computed(() => {
  let filtered = products.value
  if (category.value) filtered = filtered.filter(p => String(p.category_id) === String(category.value))
  filtered = filtered.filter(p => Number(p.sale_price || p.price) <= priceMax.value)
  return filtered
})

const sortedProducts = computed(() => {
  let arr = [...filteredProducts.value]
  if (sort.value === 'price_asc') arr.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price))
  if (sort.value === 'price_desc') arr.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price))
  if (sort.value === 'rating_desc') arr.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0))
  if (sort.value === 'rating_asc') arr.sort((a, b) => (a.avg_rating || 0) - (b.avg_rating || 0))
  return arr
})

const totalPages = computed(() => Math.ceil(sortedProducts.value.length / perPage))
const paginatedProducts = computed(() => sortedProducts.value.slice((page.value - 1) * perPage, page.value * perPage))

function goToPage(p: number) {
  if (p < 1 || p > totalPages.value) return
  page.value = p
}

function onSortChange() { page.value = 1 }
function onCategoryChange() { page.value = 1 }
function onPriceChange() { page.value = 1 }

function imageUrl(img: string) {
  if (!img) return '/fallback.jpg'
  if (img.startsWith('http')) return img
  return `http://ayurveda-marketplace.test/storage/${img}`
}

function starRating(rating: number) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return (
    '<span class="text-warning">' +
    '★'.repeat(full) +
    (half ? '½' : '') +
    '<span class="text-muted">' + '★'.repeat(empty) + '</span>' +
    '</span>'
  )
}
</script>

<style scoped>
.product-card {
  transition: box-shadow 0.2s, transform 0.2s;
}
.product-card:hover {
  box-shadow: 0 6px 24px rgba(0,0,0,0.13);
  transform: translateY(-4px) scale(1.02);
  z-index: 2;
}
.product-image-wrapper {
  height: 220px;
  background: #f8f8f8;
  position: relative;
  overflow: hidden;
}
.product-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  transition: opacity 0.3s;
  display: block;
}
.hover-img {
  opacity: 0;
  pointer-events: none;
}
.product-card:hover .main-img {
  opacity: 0;
}
.product-card:hover .hover-img {
  opacity: 1;
  pointer-events: auto;
}
.card-title {
  font-size: 1.1rem;
  font-weight: 600;
}
</style>
