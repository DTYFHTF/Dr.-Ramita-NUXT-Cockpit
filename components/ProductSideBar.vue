<template>
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
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useProducts } from "@/composables/useProducts";

const { categories } = useProducts();
const sort = ref("");
const category = ref("");
const priceMax = ref(100000);
const inStock = ref(true);

function onSortChange() {
  // Emit or handle sort change logic
}
function onCategoryChange() {
  // Emit or handle category change logic
}
function onPriceChange() {
  // Emit or handle price change logic
}
function onStockChange() {
  // Emit or handle stock change logic
}
</script>

<style scoped>
.card {
  margin-bottom: 1rem;
}
</style>