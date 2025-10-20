<template>
  <div class="product-search navbar-search-wrapper">
  <form class="navbar-search-form" @submit.prevent="emit('search', internalQuery)">
      <input
        type="text"
        class="search-input"
        :value="internalQuery"
        @input="onInput"
        :placeholder="props.placeholder || 'Search products'"
        @focus="onFocus"
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
          @click="selectSuggestion(suggestion)"
        >
          <span class="suggestion-img-wrapper" v-if="suggestion.image">
            <img :src="suggestion.image" alt="" class="suggestion-img" />
          </span>
          <div class="suggestion-content">
            <div class="suggestion-header">
              <span class="suggestion-name">{{ suggestion.name }}</span>
              <!-- Price on the right -->
              <div v-if="suggestion.final_price" class="suggestion-price-right">
                <span v-if="suggestion.has_discount && suggestion.original_price" class="price-original">${{ suggestion.original_price }}</span>
                <span class="price-final">${{ suggestion.final_price }}</span>
              </div>
            </div>
            <div class="suggestion-meta">
              <!-- Category -->
              <span v-if="suggestion.category_name" class="suggestion-category">
                {{ suggestion.category_name }}
              </span>
              <!-- Rating -->
              <span v-if="suggestion.average_rating && suggestion.average_rating > 0" class="suggestion-rating">
                <span class="rating-stars">⭐ {{ suggestion.average_rating }}</span>
                <span v-if="suggestion.review_count && suggestion.review_count > 0" class="review-count">({{ suggestion.review_count }})</span>
              </span>
              <!-- Discount Badge -->
              <span v-if="suggestion.discount_percentage && suggestion.discount_percentage > 0" class="price-discount">-{{ Math.round(suggestion.discount_percentage) }}%</span>
            </div>
          </div>
        </NuxtLink>
      </li>
      <!-- "View all results" footer -->
      <li class="suggestion-footer">
        <button @click="viewAllResults" class="view-all-btn">
          <LucideIcon icon="mdi:magnify" size="16" />
          View all results for "{{ internalQuery }}"
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/types';
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
let debounceTimer: NodeJS.Timeout | null = null;

watch(() => props.query, (newQuery) => {
  internalQuery.value = newQuery;
});

// Debounced API call (300ms delay)
watch(internalQuery, async (val) => {
  // Clear any existing timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  
  if (val && val.length >= 2) {
    loadingSuggestions.value = true;
    
    // Debounce API call by 300ms
    debounceTimer = setTimeout(async () => {
      try {
        const res = await $fetch<Product[] | { data: Product[] }>(`${config.public.apiBase}/products/suggest?q=${encodeURIComponent(val)}`);
        apiSuggestions.value = Array.isArray(res) ? res : res.data;
      } catch (e) {
        console.error('Error fetching suggestions:', e);
        apiSuggestions.value = [];
      } finally {
        loadingSuggestions.value = false;
      }
    }, 300);
  } else {
    apiSuggestions.value = [];
    loadingSuggestions.value = false;
  }
});

const suggestions = computed(() => {
  if (loadingSuggestions.value) return [];
  if (apiSuggestions.value.length) return apiSuggestions.value;
  if (!internalQuery.value || internalQuery.value.length < 2) {
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

const onFocus = () => {
  // Only show suggestions if there's a query with 2+ characters
  if (internalQuery.value && internalQuery.value.length >= 2) {
    showSuggestions.value = true;
  }
};

const selectSuggestion = (suggestion: Product) => {
  internalQuery.value = suggestion.name;
  emit('update:query', suggestion.name);
  showSuggestions.value = false;
  
  // Analytics event
  trackSuggestionClick(suggestion);
  
  // Note: Navigation happens via NuxtLink, not emit
  // The @search event is NOT emitted here to avoid conflicting navigation
};

const viewAllResults = () => {
  emit('search', internalQuery.value);
  showSuggestions.value = false;
};

const trackSuggestionClick = (suggestion: any) => {
  // Track analytics event (can be expanded with actual analytics service)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'search_suggestion_click', {
      search_term: internalQuery.value,
      product_id: suggestion.id,
      product_name: suggestion.name,
    });
  }
  console.log('Search suggestion clicked:', {
    query: internalQuery.value,
    product: suggestion.name,
    productId: suggestion.id
  });
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
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
  text-decoration: none;
  color: inherit;
}
.suggestion-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}
.suggestion-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}
.suggestion-name {
  flex: 1;
  font-size: 1.08rem;
  font-weight: 500;
  color: var(--text-primary, #222);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.suggestion-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: var(--text-muted, #666);
}
.suggestion-category {
  padding: 0.125rem 0.5rem;
  background: var(--background-light, #f5f5f5);
  border-radius: 4px;
  font-size: 0.75rem;
}
.suggestion-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.rating-stars {
  color: #f59e0b;
  font-size: 0.85rem;
}
.review-count {
  color: var(--text-muted, #999);
  font-size: 0.75rem;
}
.suggestion-price-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.125rem;
  flex-shrink: 0;
}
.price-original {
  text-decoration: line-through;
  color: var(--text-muted, #999);
  font-size: 0.85rem;
  white-space: nowrap;
}
.price-final {
  font-weight: 600;
  color: var(--color-primary, #2e7d32);
  font-size: 1.15rem;
  white-space: nowrap;
}
.price-discount {
  background: var(--color-danger, #dc3545);
  color: white;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}
.suggestion-footer {
  border-top: 2px solid var(--background-light, #f0f0f0);
  padding: 0.5rem 0.5rem;
  margin-top: 0.25rem;
}
.view-all-btn {
  width: 100%;
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  color: var(--color-primary, #2e7d32);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s;
}
.view-all-btn:hover {
  background: var(--background-light, #f5f5f5);
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
  z-index: 1040;
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
  z-index: 1050;
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
