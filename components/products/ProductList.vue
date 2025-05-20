<template>
  <div>
    <div v-if="pagination?.total" class="mb-3 text-muted">
      {{ pagination.total }} products found
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>

    <div v-else-if="products.length === 0" class="alert alert-info text-center">
      No products found matching your criteria
    </div>

    <div v-else class="row g-4">
      <div v-for="product in products" :key="product.id" class="col-12 col-sm-6 col-lg-4">
        <ProductCard :product="product" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product, Pagination } from '@/types';

defineProps<{
  products: Product[];
  loading: boolean;
  error?: string;
  pagination?: Pagination;
}>();
</script>