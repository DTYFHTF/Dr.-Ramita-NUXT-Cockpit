 <template>
  <div class="hierarchical-category-tree">
    <div v-if="loading" class="loading-state">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading categories...</span>
      </div>
    </div>
    
    <div v-else-if="error" class="error-state alert alert-danger">
      {{ error }}
    </div>
    
    <div v-else class="category-tree">
      <!-- Level 1 Categories -->
      <div 
        v-for="level1 in rootCategories" 
        :key="level1.id"
        class="level-1-category"
        :class="{ 'expanded': expandedCategories.has(normalizeId(level1.id)) }"
      >
        <div 
          class="category-item level-1"
          :class="{ 
            'active': activeCategory === normalizeId(level1.id),
            'has-children': level1.children && level1.children.length > 0 
          }"
          @click="!navigationMode && handleCategoryClick(level1)"
        >
          <NuxtLink 
            v-if="navigationMode"
            :to="`/category/${level1.slug}`"
            class="category-content navigation-link"
          >
            <span v-if="level1.children && level1.children.length > 0" class="chevron-indicator" :class="{ expanded: expandedCategories.has(normalizeId(level1.id)) }">&#8250;</span>
            <span class="category-name">{{ level1.name }}</span>
            <span class="product-count">({{ getCategoryProductCount(level1) }})</span>
          </NuxtLink>
          <div v-else class="category-content">
            <span v-if="level1.children && level1.children.length > 0" class="chevron-indicator" :class="{ expanded: expandedCategories.has(normalizeId(level1.id)) }">&#8250;</span>
            <span class="category-name">{{ level1.name }}</span>
            <span class="product-count">({{ getCategoryProductCount(level1) }})</span>
          </div>
        </div>

        <!-- Level 2 Categories -->
        <div 
          v-if="level1.children && level1.children.length > 0 && expandedCategories.has(normalizeId(level1.id))"
          class="level-2-container"
        >
          <div 
            v-for="level2 in level1.children" 
            :key="level2.id"
            class="level-2-category"
            :class="{ 'expanded': expandedCategories.has(normalizeId(level2.id)) }"
          >
            <div 
              class="category-item level-2"
              :class="{ 
                'active': activeCategory === normalizeId(level2.id),
                'has-children': level2.children && level2.children.length > 0 
              }"
              @click="!navigationMode && handleCategoryClick(level2)"
            >
              <NuxtLink 
                v-if="navigationMode"
                :to="`/category/${level2.slug}`"
                class="category-content navigation-link"
              >
                <span v-if="level2.children && level2.children.length > 0" class="chevron-indicator" :class="{ expanded: expandedCategories.has(normalizeId(level2.id)) }">&#8250;</span>
                <span class="category-name">{{ level2.name }}</span>
                <span class="product-count">({{ getCategoryProductCount(level2) }})</span>
              </NuxtLink>
              <div v-else class="category-content">
                <span v-if="level2.children && level2.children.length > 0" class="chevron-indicator" :class="{ expanded: expandedCategories.has(normalizeId(level2.id)) }">&#8250;</span>
                <span class="category-name">{{ level2.name }}</span>
                <span class="product-count">({{ getCategoryProductCount(level2) }})</span>
              </div>
            </div>

            <!-- Level 3 Categories -->
            <div 
              v-if="level2.children && level2.children.length > 0 && expandedCategories.has(normalizeId(level2.id))"
              class="level-3-container"
            >
              <div 
                v-for="level3 in level2.children" 
                :key="level3.id"
                class="level-3-category"
              >
                <div 
                  class="category-item level-3"
                  :class="{ 'active': activeCategory === normalizeId(level3.id) }"
                  @click="!navigationMode && handleCategoryClick(level3)"
                >
                  <NuxtLink 
                    v-if="navigationMode"
                    :to="`/category/${level3.slug}`"
                    class="category-content navigation-link"
                  >
                    <!-- Icon removed -->
                    <span class="category-name">{{ level3.name }}</span>
                    <span class="product-count">({{ getCategoryProductCount(level3) }})</span>
                  </NuxtLink>
                  <div v-else class="category-content">
                    <!-- Icon removed -->
                    <span class="category-name">{{ level3.name }}</span>
                    <span class="product-count">({{ getCategoryProductCount(level3) }})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import type { Category } from '@/types';
// import LucideIcon from '@/components/LucideIcon.vue';
import { useProducts } from '@/composables/useProducts';

// Helper to get product count for a category (must be a function, not const, for template access)
const { products } = useProducts();
function getCategoryProductCount(cat: any): number {
  if (typeof cat.products_count === 'number') return cat.products_count;
  if (products.value && products.value.length > 0) {
    return products.value.filter((p: any) => {
      if (Array.isArray(p.categories)) {
        return p.categories.some((c: any) => c.id === cat.id || c.slug === cat.slug);
      }
      return false;
    }).length;
  }
  return 0;
}
// Helper to get product count for a category

// Props
const props = defineProps<{
  categories: Category[];
  activeCategory?: string;
  loading?: boolean;
  error?: string;
  navigationMode?: boolean; // If true, use NuxtLink navigation instead of events
}>();

// Emits
const emit = defineEmits<{
  'category-select': [category: Category];
  'category-expand': [categoryId: string];
}>();

// Reactive state
const expandedCategories = ref(new Set<string>());

// Helper function to normalize ID to string for consistent comparisons
const normalizeId = (id: string | number): string => String(id);

// Use categories as-is (already nested from backend)
const rootCategories = computed(() => {
  // Defensive: ensure children is always an array and normalize IDs
  function normalizeChildren(arr: any[]): Category[] {
    if (!Array.isArray(arr)) return [];
    return arr.map((cat: any): Category => ({
      ...cat,
      id: normalizeId(cat.id),
      parent_id: cat.parent_id ? normalizeId(cat.parent_id) : null,
      children: Array.isArray(cat.children) ? normalizeChildren(cat.children) : []
    }));
  }
  return normalizeChildren(props.categories);
});

const selectedCategoryPath = computed(() => {
  if (!props.activeCategory) return null;
  
  const findCategoryPath = (categoryId: string, categories: Category[]): Category[] | null => {
    for (const category of categories) {
      if (normalizeId(category.id) === normalizeId(categoryId)) {
        return [category];
      }
      
      if (category.children && category.children.length > 0) {
        const childPath = findCategoryPath(categoryId, category.children);
        if (childPath) {
          return [category, ...childPath];
        }
      }
    }
    return null;
  };
  
  return findCategoryPath(props.activeCategory, rootCategories.value);
});

// Methods
const handleCategoryClick = (category: Category) => {
  // Toggle expansion for categories with children
  if (category.children && category.children.length > 0) {
    toggleCategoryExpansion(normalizeId(category.id));
  }
  
  // Always emit selection
  emit('category-select', category);
};

const toggleCategoryExpansion = (categoryId: string) => {
  if (expandedCategories.value.has(categoryId)) {
    expandedCategories.value.delete(categoryId);
  } else {
    expandedCategories.value.add(categoryId);
    emit('category-expand', categoryId);
  }
};

// Auto-expand path to active category
const expandPathToCategory = (categoryId: string) => {
  const path = selectedCategoryPath.value;
  if (path) {
    // Expand all parent categories in the path
    path.forEach((category, index) => {
      if (index < path.length - 1) { // Don't expand the last item (the selected category itself)
        expandedCategories.value.add(normalizeId(category.id));
      }
    });
  }
};

// Watch for active category changes
watch(() => props.activeCategory, (newCategoryId) => {
  if (newCategoryId) {
    expandPathToCategory(newCategoryId);
  }
}, { immediate: true });

onMounted(() => {
  if (props.activeCategory) {
    expandPathToCategory(props.activeCategory);
  }
});
</script>

<style scoped lang="scss">
.hierarchical-category-tree {
  .loading-state, .error-state {
    padding: 1rem;
    text-align: center;
  }

  .category-tree {
    .level-1-category {
      margin-bottom: 0.5rem;
      
      .level-2-container {
        margin-left: 1rem;
        margin-top: 0.25rem;
        
        .level-2-category {
          margin-bottom: 0.25rem;
          
          .level-3-container {
            margin-left: 1rem;
            margin-top: 0.25rem;
            
            .level-3-category {
              margin-bottom: 0.25rem;
            }
          }
        }
      }
    }

    .category-item {
      cursor: pointer;
      padding: 0.5rem 0.75rem;
      border-radius: 0.375rem;
      transition: all 0.2s ease;
      
      &:hover {
        background-color: var(--background-light);
        color: var(--color-primary);
      }
      
      &.active {
        background-color: var(--background-light);
        color: var(--color-primary);
        
        .category-icon, .expand-icon {
          color: white;
        }
        
        .product-count {
          color: rgba(255, 255, 255, 0.8);
        }
      }
      
      &.has-children {
        .category-content {
          .expand-icon {
            opacity: 1;
          }
        }
      }
      
      .category-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        color: inherit;
        width: 100%;
        
        &.navigation-link {
          &:hover {
            color: var(--color-primary);
            text-decoration: none;
          }
        }
        
        .chevron-indicator {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1em;
          height: 1em;
          color: var(--text-secondary);
          font-size: 1.1em;
          transition: transform 0.2s;
          margin-right: 0.2em;
          vertical-align: middle;
          &.expanded {
            transform: rotate(90deg);
          }
        }
        
        .category-name {
          flex: 1;
          font-weight: 500;
          font-size: 0.9rem;
        }
        
        .product-count {
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-weight: 400;
        }
      }
      
      // Level-specific styling
      &.level-1 {
        font-weight: 600;
        
        .category-name {
          font-size: 1rem;
        }
        
        .category-icon {
          width: 20px;
          height: 20px;
        }
      }
      
      &.level-2 {
        font-weight: 500;
        
        .category-icon {
          width: 18px;
          height: 18px;
        }
      }
      
      &.level-3 {
        font-weight: 400;
        
        .category-icon {
          width: 16px;
          height: 16px;
        }
        
        .category-name {
          font-size: 0.85rem;
        }
      }
    }
  }

  
}
</style>
