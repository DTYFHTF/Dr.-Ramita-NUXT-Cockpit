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
            <button class="btn filter-item border-success-subtle p-1  ms-2 mb-2" @click="clearAllFilters" style="font-weight: 500;">Clear All</button>
          </div>
        </div>
      </slot>

      <hr>

      
      <!-- Categories -->
      <div class="mb-3">
        <label class="form-label mb-1 fw-bold">Category:</label>
        
        <!-- Hierarchical Category Tree -->
        <HierarchicalCategoryTree
          v-if="hierarchicalCategories && hierarchicalCategories.length"
          :categories="hierarchicalCategories"
          :active-category="activeCategory"
          :loading="false"
          @category-select="handleCategorySelect"
        />
        
        <!-- Fallback: Simple category list for backward compatibility -->
        <ul v-else-if="visibleCategories && visibleCategories.length" class="list-unstyled">
          <li v-for="cat in visibleCategories" :key="cat.id">
            <a
              href="#"
              class="filter-item"
              @click.prevent="$emit('category-change', String(cat.id))"
              :class="{ active: activeCategory === String(cat.id) }"
            >
              <LucideIcon :icon="cat.icon" class="me-2" />
              {{ cat.name }}
              <span class="badge bg-light text-dark ms-2" v-if="getCategoryProductCount(cat) !== null">
                {{ getCategoryProductCount(cat) }}
              </span>
            </a>
          </li>
        </ul>
        <template v-else>
          <div class="text-muted small ps-1">Loading categories...</div>
        </template>

        
        
        <!-- Show More Button (only for simple list) -->
        <div v-if="!hierarchicalCategories && showMoreButton" class="pb-2">
          <button
            @click="$emit('toggle-show-more')"
            class="btn btn-link filter-item border-success-subtle p-2" style="font-weight: 500;"
          >
            {{ showMore ? 'Show Less' : `Show ${remainingCategories} More` }}
          </button>
        </div>
      </div>
      
      <hr>
      <!-- Price Ranges -->
      <div class="mb-3">
        <label class="form-label mb-1 fw-bold">Price:</label>
        <ul v-if="priceRanges && priceRanges.length" class="list-unstyled">
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
        <div v-else class="text-muted small ps-1">
          <template v-if="priceRangesLoading">Loading price ranges...</template>
          <template v-else>No price ranges available</template>
        </div>
      </div>
      <hr>
      <!-- Stock Status -->
      <div class="mb-3">
        <label class="form-label mb-1 fw-bold">Stock Status:</label>
        <ul class="list-unstyled">
          <li>
            <a
              href="#"
              class="filter-item"
              @click.prevent="$emit('stock-change', true)"
              :class="{ active: inStock === true }"
            >
              In Stock
            </a>
          </li>
          <li>
            <a
              href="#"
              class="filter-item"
              @click.prevent="$emit('stock-change', false)"
              :class="{ active: inStock === false }"
            >
              Out of Stock
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Category } from '@/types';
import HierarchicalCategoryTree from '@/components/categories/HierarchicalCategoryTree.vue';
import { useHierarchicalCategories } from '@/composables/useHierarchicalCategories';
import { useProducts } from '@/composables/useProducts';

// Define Filter type if not already imported
type Filter = {
  label: string;
  remove: () => void;
};

// Define OptimizedPriceRange locally to match the one in useProductFilters
interface OptimizedPriceRange {
  label: string;
  min: number | null;
  max: number | null;
  onSale: boolean;
  count: number;
}

// Props
const props = defineProps({
  activeFilters: Array as () => Filter[],
  priceRanges: Array as () => OptimizedPriceRange[],
  priceRangesLoading: Boolean,
  visibleCategories: Array as () => Category[],
  hierarchicalCategories: Array as () => Category[],
  activeCategory: String,
  showMore: Boolean,
  showMoreButton: Boolean,
  remainingCategories: Number,
  priceMin: Number,
  priceMax: Number,
  inStock: Boolean,
  onSale: Boolean,
  icon:String,
});

// Local state for categories if not provided by parent
const { hierarchicalCategories: fetchedCategories, fetchCategories } = useHierarchicalCategories();
const { products, fetchProducts } = useProducts();
const router = useRouter();
const loadingCategories = ref(false);
const loadingPriceRanges = ref(false);

onMounted(async () => {
  if ((!props.hierarchicalCategories || props.hierarchicalCategories.length === 0) &&
      (!props.visibleCategories || props.visibleCategories.length === 0)) {
    loadingCategories.value = true;
    await fetchCategories();
    loadingCategories.value = false;
  }
});

// Use only the priceRanges prop from parent
const priceRanges = computed(() => props.priceRanges ?? []);

// Expose a simple loading flag for template logic
const priceRangesLoading = computed(() => props.priceRangesLoading ?? false);

// Helper to get product count for a category
function getCategoryProductCount(cat: Category): number | null {
  // Use the products_count from API if available (this should be the primary source)
  if (typeof cat.products_count === 'number') {
    return cat.products_count;
  }
  
  // Fallback: count products in this category from products composable
  if (products.value && products.value.length > 0) {
    return products.value.filter(p => {
      // Check if product belongs to this category (by id or slug)
      if (Array.isArray(p.categories)) {
        return p.categories.some((c: any) => c.id === cat.id || c.slug === cat.slug);
      }
      return false;
    }).length;
  }
  
  return 0;
}

// Emits
const emit = defineEmits<{
  (e: 'price-range-change', range: OptimizedPriceRange): void;
  (e: 'category-change', id: string): void;
  (e: 'stock-change', value: boolean): void;
  (e: 'toggle-show-more'): void;
  (e: 'clear-all-filters'): void;
}>();


// Use categories from backend (which now includes proper hierarchical counts)
const hierarchicalCategories = computed(() => {
  // Prioritize explicitly passed categories with counts from product-filters endpoint
  if (props.visibleCategories && props.visibleCategories.length > 0) {
    // Check if it's already hierarchical
    const isAlreadyHierarchical = props.visibleCategories.some(cat => 
      Array.isArray(cat.children) && cat.children.length > 0
    );
    
    if (isAlreadyHierarchical) {
      // Already hierarchical - use as-is
      return props.visibleCategories;
    }
    
    // Build hierarchical structure from flat array (counts already calculated by backend)
    return buildHierarchicalStructure(props.visibleCategories);
  }
  
  // Fallback to hierarchicalCategories prop
  if (props.hierarchicalCategories && props.hierarchicalCategories.length > 0) {
    return props.hierarchicalCategories;
  }
  
  // Use fetched categories if nothing provided
  return fetchedCategories.value || [];
});

// Helper function to build hierarchical structure (without count calculation)
const buildHierarchicalStructure = (flatCategories: Category[]) => {
  const categoryMap = new Map<string, Category & { children: Category[] }>();
  const rootCategories: (Category & { children: Category[] })[] = [];

  // First pass: create map of all categories
  flatCategories.forEach(cat => {
    const categoryWithChildren = {
      ...cat,
      id: String(cat.id),
      parent_id: cat.parent_id ? String(cat.parent_id) : null,
      children: [] as Category[],
      // Use products_count as-is from backend (already includes hierarchical calculation)
      products_count: cat.products_count || 0
    };
    categoryMap.set(String(cat.id), categoryWithChildren);
  });

  // Second pass: build tree structure
  flatCategories.forEach(cat => {
    const categoryId = String(cat.id);
    const parentId = cat.parent_id ? String(cat.parent_id) : null;
    const categoryItem = categoryMap.get(categoryId)!;
    
    if (parentId && categoryMap.has(parentId)) {
      const parent = categoryMap.get(parentId)!;
      parent.children.push(categoryItem);
    } else {
      rootCategories.push(categoryItem);
    }
  });

  return rootCategories;
};

// Handle category selection from hierarchical tree
const handleCategorySelect = (category: Category) => {
  // Check if category has children
  if (category.children && category.children.length > 0) {
    // Category has children - just let the tree handle expansion, don't emit anything
    // The HierarchicalCategoryTree already handles the expansion internally
    return;
  } else {
    // Leaf category - navigate to category page
    if (category.slug) {
      router.push(`/category/${category.slug}`);
    } else {
      // Fallback: emit event for filtering (for backward compatibility)
      emit('category-change', String(category.id));
    }
  }
};

// Methods
const isPriceRangeActive = (range: OptimizedPriceRange) => {
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
  background: var(--background-white);
  color: var(--text-primary);
  border: 1px solid var(--border-color);

  &:hover {
    background-color: var(--background-light);
    transform: translateY(-1px);
    color: var(--text-primary);
  }
}

.filter-item {
  color: var(--text-primary);
  padding: 0.25rem 0;
  text-decoration: none;
  display: block;
  transition: all 0.2s ease;

  &:hover {
    color: var(--color-success);
    transform: translateX(3px);
    text-decoration: none;
  }

  &.active {
    color: var(--color-success);
    font-weight: 600;
    text-decoration: underline;
  }
}

.card {
  background: var(--background-white);
  border-color: var(--border-color);
}

.card-title {
  color: var(--text-primary);
}

.form-label {
  color: var(--text-primary);
}
</style>