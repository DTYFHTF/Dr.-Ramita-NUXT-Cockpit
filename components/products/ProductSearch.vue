<template>
  <div class="product-search position-relative">
    <input
      type="text"
      class="search-input"
      :value="query"
      @input="onInput"
      placeholder="Search products"
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
}>();

const emit = defineEmits(['update:query', 'search']);

const internalQuery = ref(props.query);
const showSuggestions = ref(false);

watch(() => props.query, (newQuery) => {
  internalQuery.value = newQuery;
});

const suggestions = computed(() => {
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

.search-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--background-white);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-success);
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.2);
}

.search-input::placeholder {
  color: var(--text-muted);
  opacity: 0.8;
}

.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--background-white);
  border: 2px solid var(--border-color);
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
