<template>
  <div class="product-search position-relative">
    <input
      type="text"
      class="search-input"
      :value="query"
      @input="onInput"
      :placeholder="props.placeholder || 'Search products'"
      @focus="showSuggestions = true"
      @blur="onBlur"
      aria-label="Search products"
    />
    <ul v-if="showSuggestions && suggestions.length" class="suggestions-list">
      <li
        v-for="suggestion in suggestions"
        :key="suggestion.id"
        class="suggestion-item"
        @mousedown="selectSuggestion(suggestion)" 
      >
        {{ suggestion.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Product } from '@/types';

const props = defineProps<{
  query: string;
  allProducts: Product[];
  placeholder?: string;
}>();

const emit = defineEmits(['update:query', 'search']);

const internalQuery = ref(props.query);
const showSuggestions = ref(false);
const apiSuggestions = ref<Product[]>([]);
const loadingSuggestions = ref(false);

watch(() => props.query, (newQuery) => {
  internalQuery.value = newQuery;
});

watch(internalQuery, async (val) => {
  if (val && val.length >= 2) {
    loadingSuggestions.value = true;
    try {
      const res = await fetch(`/api/products/suggest?q=${encodeURIComponent(val)}`);
      if (res.ok) {
        const data = await res.json();
        apiSuggestions.value = Array.isArray(data) ? data : [];
      } else {
        apiSuggestions.value = [];
      }
    } catch (e) {
      apiSuggestions.value = [];
    } finally {
      loadingSuggestions.value = false;
    }
  } else {
    apiSuggestions.value = [];
  }
});

const suggestions = computed(() => {
  if (loadingSuggestions.value) return [];
  if (apiSuggestions.value.length) return apiSuggestions.value;
  if (!internalQuery.value || internalQuery.value.length < 2) {
    showSuggestions.value = false;
    return [];
  }
  const lowerQuery = internalQuery.value.toLowerCase();
  return props.allProducts.filter(product =>
    product.name.toLowerCase().includes(lowerQuery) ||
    (product.description && product.description.toLowerCase().includes(lowerQuery))
  ).slice(0, 10);
});

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  internalQuery.value = target.value;
  emit('update:query', internalQuery.value);
  if (internalQuery.value.length >= 2) {
    showSuggestions.value = true;
  } else {
    showSuggestions.value = false;
  }
};

const selectSuggestion = (suggestion: Product) => {
  internalQuery.value = suggestion.name;
  emit('update:query', suggestion.name);
  emit('search', suggestion.name);
  showSuggestions.value = false;
};

const onBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 150);
};
</script>

<style scoped>
.product-search {
  position: relative;
  z-index: 1;
}

/* Removed duplicate .search-input styles - using global CSS from main.scss */

.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--background-white);
  border: 2px solid var(--color-muted);
  border-top: none;
  border-radius: 0 0 12px 12px;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: var(--card-shadow);
  z-index: 1000;
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestion-item {
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  cursor: pointer;
  border-bottom: 1px solid var(--background-light);
  transition: all 0.2s ease;
}

.suggestion-item:hover {
  background: var(--background-light);
  color: var(--color-success);
}

.suggestion-item:last-child {
  border-bottom: none;
}
</style>
