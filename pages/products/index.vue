<template>
  <div class="container py-4">
    <div class="row">
      <!-- Sidebar -->
      <aside class="col-12 col-md-3 mb-4 mb-md-0">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <h5 class="card-title mb-3">Filter & Sort</h5>
            <div class="mb-3">
              <label class="form-label mb-1">Sort by:</label>
              <select v-model="sort" class="form-select form-select-sm" @change="onSortChange">
                <option value="">Default</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Rating: High to Low</option>
                <option value="rating_asc">Rating: Low to High</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label mb-1">Category:</label>
              <select v-model="category" class="form-select form-select-sm" @change="onCategoryChange">
                <option value="">All</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label mb-1">Price:</label>
              <select v-model="priceMax" class="form-select form-select-sm" @change="onPriceChange">
                <option :value="500">Under ₹500</option>
                <option :value="1000">Under ₹1000</option>
                <option :value="2000">Under ₹2000</option>
                <option :value="100000">Above ₹2000</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label mb-1">Stock Status:</label>
              <select v-model="inStock" class="form-select form-select-sm" @change="onStockChange">
                <option :value="true">In Stock</option>
                <option :value="false">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>
      </aside>
      <!-- Main content -->
      <div class="col-12 col-md-9">
        <h1 class="mb-4">Products</h1>
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else-if="error" class="alert alert-danger text-center">
          {{ error }}
        </div>
        <div v-else-if="products.length === 0" class="alert alert-info text-center">
          No products found.
        </div>
        <div class="row g-4">
          <div v-for="product in products" :key="product.id" class="col-12 col-sm-6 col-lg-4">
            <ProductCard :product="product" />
          </div>
        </div>
        <nav v-if="pagination && pagination.last_page > 1" class="mt-4 d-flex justify-content-center">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: page === 1 }">
              <button class="page-link" @click="goToPage(page - 1)" :disabled="page === 1">Previous</button>
            </li>
            <li v-for="p in pagination.last_page" :key="p" class="page-item" :class="{ active: p === page }">
              <button class="page-link" @click="goToPage(p)">{{ p }}</button>
            </li>
            <li class="page-item" :class="{ disabled: page === pagination.last_page }">
              <button class="page-link" @click="goToPage(page + 1)" :disabled="page === pagination.last_page">Next</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProducts } from "@/composables/useProducts";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ProductCard from "@/components/ProductCard.vue";

const { products, loading, error, fetchProducts, categories, fetchCategories, pagination } = useProducts();
const route = useRoute();
const router = useRouter();

const sort = ref(Array.isArray(route.query.sort) ? route.query.sort[0] || "" : route.query.sort || "");
const category = ref(Array.isArray(route.query.category) ? route.query.category[0] || "" : route.query.category || "");
const maxPrice = ref(100000);
const priceMax = ref(Number(route.query.priceMax) || maxPrice.value);
const page = ref(Number(route.query.page) || 1);
const perPage = 30;
const inStock = ref(true);

onMounted(() => {
  fetchProducts(page.value, perPage, sort.value, category.value, priceMax.value, inStock.value);
  fetchCategories();
});

watch([sort, category, priceMax, page, inStock], () => {
  router.replace({
    query: {
      ...route.query,
      sort: sort.value || undefined,
      category: category.value || undefined,
      priceMax: priceMax.value || undefined,
      page: page.value || undefined,
      inStock: inStock.value || undefined,
    },
  });
  fetchProducts(page.value, perPage, sort.value, category.value, priceMax.value, inStock.value);
});

function goToPage(p: number) {
  if (!pagination.value || p < 1 || p > pagination.value.last_page) return;
  page.value = p;
}

function onSortChange() {
  page.value = 1;
}
function onCategoryChange() {
  page.value = 1;
}
function onPriceChange() {
  page.value = 1;
}
function onStockChange() {
  page.value = 1;
}
</script>

<style scoped>
.product-card {
  transition: box-shadow 0.2s, transform 0.2s;
}
.product-card:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.13);
  transform: translateY(-4px) scale(1.02);
  z-index: 2;
}
</style>