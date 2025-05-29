<template>
  <div class="product-search position-relative">
    <input
      type="text"
      class="form-control"
      :value="query"
      @input="onInput"
      placeholder="Search products"
      @focus="showSuggestions = true"
      @blur="onBlur"
      aria-label="Search products"
    />
    <ul v-if="showSuggestions && suggestions.length" class="list-group suggestions-list position-absolute w-100 shadow-sm">
      <li
        v-for="suggestion in suggestions"
        :key="suggestion.id"
        class="list-group-item list-group-item-action"
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
  z-index: 1;
}
.suggestions-list {
  border-top: none;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  max-height: 300px;
  overflow-y: auto;
}
.list-group-item-action {
  cursor: pointer;
}
</style>
