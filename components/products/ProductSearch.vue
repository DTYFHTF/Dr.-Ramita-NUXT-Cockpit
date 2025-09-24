<template>
  <div class="product-search navbar-search-wrapper">
  <form class="navbar-search-form" @submit.prevent="emit('search', internalQuery)">
      <input
        type="text"
        class="search-input"
        :value="internalQuery"
        @input="onInput"
        :placeholder="props.placeholder || 'Search products'"
        @focus="showSuggestions = true"
        @blur="onBlur"
        aria-label="Search products"
        autocomplete="off"
      />
      <button type="submit" class="navbar-search-btn" aria-label="Search">
        <LucideIcon icon="mdi:magnify" size="22" />
      </button>
    </form>
    <ul v-if="showSuggestions && suggestions.length" class="suggestions-list">
      <li
        v-for="suggestion in suggestions"
        :key="suggestion.id"
        class="suggestion-item"
      >
        <NuxtLink
          :to="`/products/${suggestion.slug}`"
          class="suggestion-link"
          @click.stop="selectSuggestion(suggestion)"
        >
          <span class="suggestion-img-wrapper" v-if="suggestion.image">
            <img :src="suggestion.image" alt="" class="suggestion-img" />
          </span>
          <span class="suggestion-name">{{ suggestion.name }}</span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">


import { useRuntimeConfig } from 'nuxt/app';

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
const config = useRuntimeConfig();

watch(() => props.query, (newQuery) => {
  internalQuery.value = newQuery;
});

watch(internalQuery, async (val) => {
  if (val && val.length >= 2) {
    loadingSuggestions.value = true;
    try {
      const res = await $fetch(`${config.public.apiBase}/products/suggest?q=${encodeURIComponent(val)}`);
      apiSuggestions.value = Array.isArray(res) ? res : res.data;
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
.suggestion-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  text-decoration: none;
  color: inherit;
}
.suggestion-img-wrapper {
  display: inline-block;
  vertical-align: middle;
  margin-right: 0.75rem;
}
.suggestion-img {
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 8px;
  background: var(--background-light, #f5f5f5);
  border: 1px solid var(--border-color, #e0e0e0);
}
.suggestion-name {
  vertical-align: middle;
}
.search-input:focus {
  outline: none;
  box-shadow: none;
  border-color: inherit;
}
.navbar-search-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
  z-index: 2;
}

.navbar-search-form {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 640px;
  background: var(--search-bg,);
  border-radius: 2.5rem;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.07);
  border: 2px solid #cccbcb;
  padding: 2px 8px 2px 16px;
  position: relative;
}
.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1.08rem;
  padding: 0.7rem 0 0.7rem 0;
  border-radius: 2rem;
  color: var(--search-text, #f3f3f3);
}
.search-input::placeholder {
  color: var(--search-placeholder, #bfc8db);
  opacity: 1;
  font-style: italic;
}



.navbar-search-btn {
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  cursor: pointer;
  transition: background 0.15s;
  padding: 0;
}
.navbar-search-btn:hover {
  background: #e0e0e0;
}


.suggestions-list {
  position: absolute;
  top: 110%;
  left: 0;
  right: 0;
  background: var(--background-white, #fff);
  border: 2px solid var(--color-muted, #e0e0e0);
  border-top: none;
  border-radius: 0 0 16px 16px;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.10);
  z-index: 1000;
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestion-item:hover {
  background: var(--background-light, #f5f5f5);
  color: var(--color-success, #2e7d32);
}

.suggestion-item:last-child {
  border-bottom: none;
}

/* Improved product suggestion dropdown styles */
.suggestions-list {
  position: absolute;
  top: 110%;
  left: 0;
  right: 0;
  background: var(--background-white, #fff);
  border: 2px solid var(--color-muted, #e0e0e0);
  border-top: none;
  border-radius: 14px;
  max-height: 320px;
  overflow-y: auto;
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.12);
  z-index: 1000;
  list-style: none;
  padding: 0.25rem 0;
  margin: 0;
}
.suggestion-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.65rem 1.2rem;
  color: var(--text-primary, #222);
  cursor: pointer;
  border-bottom: 1px solid var(--background-light, #f5f5f5);
  transition: background 0.18s, color 0.18s;
  border-radius: 10px;
  margin: 0.15rem 0.5rem;
}
.suggestion-item:hover {
  background: var(--background-light, #f5f5f5);
  color: var(--color-primary, #2e7d32);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.suggestion-img-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  min-height: 36px;
  background: var(--background-light, #f5f5f5);
  border-radius: 8px;
  overflow: hidden;
}
.suggestion-img {
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 6px;
  background: var(--background-light, #f5f5f5);
  border: none;
  display: block;
}
.suggestion-name {
  font-size: 1.08rem;
  font-weight: 500;
  color: var(--text-primary, #222);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
