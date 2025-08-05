<template>
  <div v-if="hasActiveFilters" class="active-filters">
    <div class="active-filters-label">Active Filters:</div>
    <div class="filter-tags">
      <span v-if="category" class="filter-tag">
        Category: {{ category }}
        <button @click="$emit('clear-category')" class="remove-filter">
          <LucideIcon icon="mdi:close" />
        </button>
      </span>
      <span v-if="priceMin || priceMax" class="filter-tag">
        Price: ₹{{ priceMin || 0 }} - ₹{{ priceMax || '∞' }}
        <button @click="$emit('clear-price-range')" class="remove-filter">
          <LucideIcon icon="mdi:close" />
        </button>
      </span>
      <span v-if="searchQuery" class="filter-tag">
        Search: "{{ searchQuery }}"
        <button @click="$emit('clear-search')" class="remove-filter">
          <LucideIcon icon="mdi:close" />
        </button>
      </span>
      <span v-if="inStock === false" class="filter-tag">
        Out of Stock
        <button @click="$emit('clear-stock')" class="remove-filter">
          <LucideIcon icon="mdi:close" />
        </button>
      </span>
      <span v-if="onSale" class="filter-tag">
        On Sale
        <button @click="$emit('clear-sale')" class="remove-filter">
          <LucideIcon icon="mdi:close" />
        </button>
      </span>
      <span v-if="rating" class="filter-tag">
        Rating: {{ rating }}+ stars
        <button @click="$emit('clear-rating')" class="remove-filter">
          <LucideIcon icon="mdi:close" />
        </button>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import LucideIcon from '@/components/LucideIcon.vue';

const props = defineProps<{
  category?: string;
  priceMin?: number | null;
  priceMax?: number | null;
  searchQuery?: string;
  inStock?: boolean | undefined;
  onSale?: boolean;
  rating?: number | null;
}>();

const emit = defineEmits<{
  (e: 'clear-category'): void;
  (e: 'clear-price-range'): void;
  (e: 'clear-search'): void;
  (e: 'clear-stock'): void;
  (e: 'clear-sale'): void;
  (e: 'clear-rating'): void;
}>();

const hasActiveFilters = computed(() => {
  return !!(
    props.category ||
    props.priceMin || 
    props.priceMax || 
    props.searchQuery || 
    props.inStock === false || 
    props.onSale || 
    props.rating
  );
});
</script>

<style scoped>
.active-filters {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--background-light);
  border-radius: 12px;
  flex-wrap: wrap;
}

.active-filters-label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
  white-space: nowrap;
}

.filter-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--background-white);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.remove-filter {
  background: none;
  border: none;
  color: var(--color-error);
  cursor: pointer;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.remove-filter:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .active-filters {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-tags {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .filter-tag {
    font-size: 0.8rem;
    padding: 0.4rem 0.6rem;
  }
}
</style>
