<template>
  <div class="products-page">
    <div class="container products-container">
      <div class="products-layout">
        <!-- Desktop Filters Sidebar -->
        <aside class="filters-sidebar">
          <div class="filters-card">
            <div class="filters-header">
              <LucideIcon icon="mdi:filter-variant" class="filter-icon me-2" />
              <div class="d-flex align-items-center justify-content-center w-100 mb-2">
                <h3 class="filters-title mb-0">Filters</h3>
              </div>
              <button v-if="hasActiveFilters" @click="clearAllFilters" class="clear-all-btn">
                Clear All
              </button>
            </div>

            <FilterSidebar :active-filters="activeFilters" :price-ranges="priceRanges"
              :stock-status="stockStatus"
              :visible-categories="categoriesWithCounts" :active-category="category" :show-more="showMoreCategories" :show-more-button="categories.length > 5"
              :remaining-categories="remainingCategories" :price-min="priceMin ?? undefined"
              :price-max="priceMax ?? undefined" :in-stock="inStock" @price-range-change="handlePriceRangeChange"
              @category-change="selectCategory" @stock-change="handleStockChange"
              @toggle-show-more="toggleShowMoreCategories" @clear-all-filters="clearAllFilters" />
          </div>
        </aside>

        <!-- Mobile Filter Button -->
        <div class="mobile-filter-btn">
          <button class="btn btn-smooth-success filter-toggle" type="button" data-bs-toggle="offcanvas"
            data-bs-target="#filterOffcanvas">
            <LucideIcon icon="mdi:filter-variant" class="me-2" />
            Filters & Sort
            <span v-if="hasActiveFilters" class="filter-badge">{{ activeFilterCount }}</span>
          </button>
        </div>

        <!-- Mobile Filter Offcanvas -->
        <div class="offcanvas offcanvas-start filter-offcanvas" tabindex="-1" id="filterOffcanvas">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title">
              <LucideIcon icon="mdi:filter-variant" class="me-2" />
              Filters & Sort
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
          </div>
          <div class="offcanvas-body">
            <FilterSidebar :active-filters="activeFilters" :price-ranges="priceRanges"
              :stock-status="stockStatus"
              :visible-categories="categoriesWithCounts" :active-category="category" :show-more="showMoreCategories" :show-more-button="categories.length > 5"
              :remaining-categories="remainingCategories" :price-min="priceMin ?? undefined"
              :price-max="priceMax ?? undefined" :in-stock="inStock" @price-range-change="handlePriceRangeChange"
              @category-change="selectCategory" @stock-change="handleStockChange"
              @toggle-show-more="toggleShowMoreCategories" @clear-all-filters="clearAllFilters" />
          </div>
        </div>

        <!-- Main Products Content -->
        <main class="products-main">
          <!-- Products Header -->
          <div class="products-header">
            <div class="results-info">
              <div class="title-search-row">
                <h1 class="results-title">
                  {{ promotionTitle || (category ? `${category} Products` : pageTitle) }}
                  <span v-if="pagination?.total" class="results-count">({{ pagination.total }})</span>
                </h1>

                <!-- Inline Search Bar -->
                <div class="inline-search">
                  <ProductSearch v-model:query="searchQuery" :all-products="products" @search="handleSearch"
                    class="search-component" />
                </div>
              </div>

              <p v-if="searchQuery" class="search-info">
                <LucideIcon icon="mdi:magnify" class="me-1" />
                Results for "<strong>{{ searchQuery }}</strong>"
              </p>
            </div>

            <!-- Sort Controls -->
            <ProductSortControls :sort="sort" @toggle-sort="toggleSort" />
          </div>

          <!-- Active Filters Display -->
          <ActiveFilters :category="category" :price-min="priceMin" :price-max="priceMax" :search-query="searchQuery"
            :in-stock="inStock" :on-sale="onSale" :rating="rating" @clear-category="handleClearCategory"
            @clear-price-range="handleClearPriceRange" @clear-search="() => { searchQuery = ''; page = 1; }"
            @clear-stock="handleStockChange(true)" @clear-sale="() => { onSale = false; page = 1; }"
            @clear-rating="() => { rating = null; page = 1; }" />

          <!-- Products Grid -->
          <div class="products-content">
            <ProductList :products="products" :loading="loading" :error="error" :pagination="pagination" />
          </div>

          <!-- Pagination -->
          <div v-if="pagination?.last_page > 1" class="pagination-wrapper">
            <Pagination :current-page="pagination.current_page" :last-page="pagination.last_page"
              @page-change="page = $event" />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed } from "vue";
import { useRoute } from 'vue-router';
import { useProductFilters } from "@/composables/useProductFilters";
import LucideIcon from '@/components/LucideIcon.vue';
import ProductSortControls from '@/components/products/ProductSortControls.vue';
import ActiveFilters from '@/components/products/ActiveFilters.vue';

// Dynamic imports
const FilterSidebar = defineAsyncComponent(
  () => import("@/components/products/FilterSidebar.vue")
);
const ProductList = defineAsyncComponent(
  () => import("@/components/products/ProductList.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/products/Pagination.vue")
);
const ProductSearch = defineAsyncComponent(
  () => import("@/components/products/ProductSearch.vue")
);

const route = useRoute();
const searchQuery = ref(route.query.search?.toString() || "");

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
  rating,
  collection,
  promotion,
  showMoreCategories,
  visibleCategories,
  remainingCategories,
  activeFilters,
  priceRanges,
  stockStatus,
  hierarchicalCategories,
  categoriesWithCounts,
  pageTitle,
  toggleSort,
  toggleShowMoreCategories,
  selectCategory,
  handlePriceRangeChange,
  clearAllFilters,
} = useProductFilters(searchQuery);

import { ref } from "vue";

// Computed properties for active filters
const hasActiveFilters = computed(() => {
  return !!(priceMin.value || priceMax.value || !inStock.value || searchQuery.value || onSale.value || rating.value);
});

const activeFilterCount = computed(() => {
  let count = 0;
  if (priceMin.value || priceMax.value) count++;
  if (!inStock.value) count++;
  if (onSale.value) count++;
  if (rating.value) count++;
  if (searchQuery.value) count++;
  return count;
});

// Computed property for promotion title (clean, user-friendly)
const promotionTitle = computed(() => {
  if (!promotion.value) return '';
  
  // Convert slug to title case (e.g., "herbal-supplements-special" -> "Herbal Supplements Special")
  return promotion.value
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
});

function handleSearch(query: string) {
  searchQuery.value = query;
  page.value = 1;
}

function handleStockChange(val: boolean) {
  inStock.value = val;
  page.value = 1;
}

function handleClearCategory() {
  selectCategory();
}

function handleClearPriceRange() {
  priceMin.value = null;
  priceMax.value = null;
  onSale.value = false;
}
</script>

<style scoped>
/* Main Layout */
.products-page {
  min-height: 100vh;
  background: var(--background-light);
  padding: 2rem 0;
}

/* Container */
.products-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.products-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 1024px) {
  .products-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

/* Filters Sidebar */
.filters-sidebar {
  position: sticky;
  top: 2rem;
}

@media (max-width: 1024px) {
  .filters-sidebar {
    display: none;
  }
}

.filters-card {
  background: var(--background-white);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: var(--card-shadow);
}

.filters-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--background-light);
}

.filter-icon {
  color: var(--color-success);
  width: 24px;
  height: 24px;
}

.filters-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.clear-all-btn {
  background: none;
  border: none;
  color: var(--color-error);
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.clear-all-btn:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* Mobile Filter Button */
.mobile-filter-btn {
  display: none;
  margin-bottom: 1rem;
}

@media (max-width: 1024px) {
  .mobile-filter-btn {
    display: block;
  }
}

.filter-toggle {
  position: relative;
  background: var(--color-success);
  color: var(--text-white);
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.filter-toggle:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
}

.filter-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--color-error);
  color: var(--text-white);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

/* Mobile Filter Offcanvas */
.filter-offcanvas {
  max-width: 350px;
}

.offcanvas-header {
  background: var(--background-light);
  border-bottom: 2px solid var(--border-color);
}

.offcanvas-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary);
  font-weight: 600;
}

.offcanvas-body {
  background: var(--background-white);
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

/* Products Main */
.products-main {
  background: var(--background-white);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: var(--card-shadow);
}

/* Products Header */
.products-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--background-light);
  gap: 2rem;
}

@media (max-width: 768px) {
  .products-header {
    flex-direction: column;
    gap: 1rem;
  }
}

.results-info {
  flex: 1;
}

.title-search-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .title-search-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

.results-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.inline-search {
  flex-shrink: 0;
  min-width: 300px;
  position: relative;
  z-index: 100;
}

@media (max-width: 768px) {
  .inline-search {
    width: 100%;
    min-width: unset;
  }
}

.search-component {
  background: var(--background-white);
  border-radius: 12px;
  border: 2px solid var(--border-color);
  overflow: hidden;
  transition: all 0.2s ease;
}

.search-component:focus-within {
  border-color: var(--color-success);
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
}

.results-count {
  font-size: 1rem;
  font-weight: 400;
  color: var(--text-secondary);
}

.search-info {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.95rem;
}

/* Products Content */
.products-content {
  margin-bottom: 2rem;
}

/* Pagination */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding-top: 2rem;
  border-top: 2px solid var(--background-light);
}

/* Responsive Design */
@media (max-width: 768px) {
  .products-page {
    padding: 1rem 0;
  }

  .products-container {
    padding: 0 0.5rem;
  }

  .products-main {
    padding: 1.5rem;
  }

  .results-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .products-main {
    padding: 1rem;
  }

  .products-header {
    gap: 0.75rem;
  }

  .results-title {
    font-size: 1.25rem;
  }

  .inline-search {
    min-width: unset;
  }
}
</style>
