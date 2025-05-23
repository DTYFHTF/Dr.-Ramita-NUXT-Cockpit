<template>
  <div class="container py-4">
    <div class="row">
      <!-- Desktop Filters -->
      <aside class="col-12 col-md-3 mb-4 mb-md-0 d-none d-md-block">
        <FilterSidebar
          :active-filters="activeFilters"
          :price-ranges="priceRanges"
          :visible-categories="visibleCategories"
          :active-category="category"
          :show-more="showMoreCategories"
          :show-more-button="categories.length > 5"
          :remaining-categories="remainingCategories"
          :price-min="priceMin ?? undefined"
          :price-max="priceMax ?? undefined"
          :in-stock="inStock"
          @price-range-change="handlePriceRangeChange"
          @category-change="selectCategory"
          @stock-change="handleStockChange"
          @toggle-show-more="toggleShowMoreCategories"
          @clear-all-filters="clearAllFilters"
        />
      </aside>

      <!-- Mobile Filters -->
      <div class="d-md-none">
        <button 
          class="btn btn-primary mb-3" 
          type="button" 
          data-bs-toggle="offcanvas" 
          data-bs-target="#filterOffcanvas"
        >
          Filter & Sort
        </button>
        <div class="offcanvas offcanvas-start" tabindex="-1" id="filterOffcanvas">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title">Filter & Sort</h5>
            <button 
              type="button" 
              class="btn-close" 
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div class="offcanvas-body">
            <FilterSidebar
              :active-filters="activeFilters"
              :price-ranges="priceRanges"
              :visible-categories="visibleCategories"
              :active-category="category"
              :show-more="showMoreCategories"
              :show-more-button="categories.length > 5"
              :remaining-categories="remainingCategories"
              :price-min="priceMin ?? undefined"
              :price-max="priceMax ?? undefined"
              :in-stock="inStock"
              @price-range-change="handlePriceRangeChange"
              @category-change="selectCategory"
              @stock-change="handleStockChange"
              @toggle-show-more="toggleShowMoreCategories"
              @clear-all-filters="clearAllFilters"
            />
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <main class="col-12 col-md-9">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="h3 mb-0">Products</h1>
          <div class="d-flex gap-3 sort-controls">
            <button
              class="btn btn-link p-0"
              :class="{ 'text-primary': sort.includes('price') }"
              @click="toggleSort('price')"
            >
              Price {{ sortArrow('price') }}
            </button>
            <button
              class="btn btn-link p-0"
              :class="{ 'text-primary': sort.includes('rating') }"
              @click="toggleSort('rating')"
            >
              Rating {{ sortArrow('rating') }}
            </button>
          </div>
        </div>

        <ProductList
          :products="products"
          :loading="loading"
          :error="error"
          :pagination="pagination"
        />

        <Pagination
          v-if="pagination?.last_page > 1"
          :current-page="pagination.current_page"
          :last-page="pagination.last_page"
          @page-change="page = $event"
          class="mt-5"
        />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed } from 'vue';
import { useProductFilters } from '@/composables/useProductFilters';

// Dynamic imports
const FilterSidebar = defineAsyncComponent(() => 
  import('@/components/products/FilterSidebar.vue')
);
const ProductList = defineAsyncComponent(() => 
  import('@/components/products/ProductList.vue')
);
const Pagination = defineAsyncComponent(() => 
  import('@/components/products/Pagination.vue')
);

const {
  products,
  loading,
  error,
  categories,
  pagination,
  sort,
  category,
  priceMin,
  priceMax,
  page,
  inStock,
  onSale,
  showMoreCategories,
  visibleCategories,
  remainingCategories,
  activeFilters,
  priceRanges,
  toggleSort,
  toggleShowMoreCategories,
  selectCategory,
  handlePriceRangeChange,
  clearAllFilters
} = useProductFilters();

import { ref } from 'vue';

function handleStockChange(val: boolean) {
  inStock.value = val;
  page.value = 1;
}

const sortArrow = (type: string) => {
  if (sort.value === `${type}_asc`) return '↓';
  if (sort.value === `${type}_desc`) return '↑';
  return '↓';
};
</script>

<style scoped lang="scss">
.sort-controls {
  button {
    font-size: 1rem;
    transition: all 0.2s ease;
    
    &:hover {
      opacity: 0.8;
      transform: translateY(-1px);
    }
    
    &.text-primary {
      font-weight: 500;
    }
  }
}

.offcanvas {
  max-width: 300px;
}
.btn-link{
  color: $text-deep-green;
    font-weight: 500;
}

.offcanvas-body {
  max-height: calc(100vh - 100px); /* Ensures the content fits within the viewport */
  overflow-y: auto; /* Enables scrolling within the offcanvas */
}
</style>