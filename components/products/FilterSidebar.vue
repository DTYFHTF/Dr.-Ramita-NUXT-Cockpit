<template>
  <div class="card shadow-sm border-0">
    <div class="card-body">
      <h5 class="card-title mb-3 fw-bold">Filter & Sort</h5>
      
      <!-- Active Filters -->
      <slot name="active-filters" :filters="activeFilters" :clear-all="clearAllFilters">
        <div class="mb-3">
          <div v-if="(activeFilters?.length)" class="mb-3 d-flex align-items-center flex-wrap">
            <span
              v-for="(filter, idx) in activeFilters"
              :key="idx"
              class="btn border me-2 mb-2 filter-pill"
              @click="filter.remove"
            >
              {{ filter.label }} <span class="ms-1">&times;</span>
            </span>
            <button class="btn btn-link ms-2 mb-2" @click="clearAllFilters">Clear All</button>
          </div>
        </div>
      </slot>

      <!-- Price Ranges -->
      <div class="mb-3">
        <label class="form-label mb-1 fw-bold">Price:</label>
        <ul class="list-unstyled">
          <li v-for="range in priceRanges" :key="range.label">
            <a
              href="#"
              class="filter-item"
              @click.prevent="$emit('price-range-change', range)"
              :class="{ active: isPriceRangeActive(range) }"
            >
              {{ range.label }}
            </a>
          </li>
        </ul>
      </div>

      <!-- Categories -->
      <div class="mb-3">
        <label class="form-label mb-1 fw-bold">Category:</label>
        <ul class="list-unstyled">
          <li v-for="cat in visibleCategories" :key="cat.id">
            <a
              href="#"
              class="filter-item"
              @click.prevent="$emit('category-change', cat.id)"
              :class="{ active: activeCategory === cat.id }"
            >
              {{ cat.name }} ({{ cat.products_count || 0 }})
            </a>
          </li>
        </ul>
        <button
          v-if="showMoreButton"
          @click="$emit('toggle-show-more')"
          class="btn btn-link show-more-btn"
        >
          {{ showMore ? 'Show Less' : `Show ${remainingCategories} More` }}
        </button>
      </div>

      <!-- Stock Status -->
      <div class="mb-3">
        <label class="form-label mb-1 fw-bold">Stock Status:</label>
        <select
          class="form-select form-select-sm"
          :value="inStock"
          @change="$emit('stock-change', ($event.target as HTMLSelectElement).value === 'true')"
        >
          <option :value="true">In Stock</option>
          <option :value="false">Out of Stock</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PriceRange, Category } from '@/types';

// Props
const props = defineProps({
  activeFilters: Array as () => Filter[],
  priceRanges: Array as () => PriceRange[],
  visibleCategories: Array as () => Category[],
  activeCategory: String,
  showMore: Boolean,
  showMoreButton: Boolean,
  remainingCategories: Number,
  priceMin: Number,
  priceMax: Number,
  inStock: Boolean,
  onSale: Boolean,
});

// Emits
const emit = defineEmits<{
  (e: 'price-range-change', range: PriceRange): void;
  (e: 'category-change', id: string): void;
  (e: 'stock-change', value: boolean): void;
  (e: 'toggle-show-more'): void;
  (e: 'clear-all-filters'): void;
}>();

// Methods
const isPriceRangeActive = (range: PriceRange) => {
  return range.min === props.priceMin && range.max === props.priceMax;
};

const clearAllFilters = () => {
  emit('clear-all-filters');
};
</script>

<style scoped lang="scss">
.filter-pill {
  font-size: 0.9rem;
  padding: 0.25rem 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--bs-light);
    transform: translateY(-1px);
  }
}

.filter-item {
  color: var(--bs-gray-700);
  padding: 0.25rem 0;
  text-decoration: none;
  display: block;
  transition: all 0.2s ease;

  &:hover {
    color: var(--bs-primary);
    transform: translateX(3px);
  }

  &.active {
    color: var(--bs-primary);
    font-weight: 500;
    text-decoration: underline;
  }
}

.show-more-btn {
  font-size: 0.9rem;
  padding: 0;
}
</style>