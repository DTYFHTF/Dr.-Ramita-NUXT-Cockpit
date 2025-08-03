<template>
  <div class="category-demo">
    <div class="container py-5">
      <h1 class="mb-4">
        3-Level Hierarchical Categories Demo
        <span v-if="loading" class="badge bg-secondary ms-2">Loading...</span>
        <span v-else class="badge bg-success ms-2">Live Data</span>
      </h1>
      
      <div class="row">
        <!-- Category Tree -->
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <LucideIcon icon="mdi:file-tree" class="me-2" />
                Category Tree
              </h5>
            </div>
            <div class="card-body">
              <!-- Loading state -->
              <div v-if="loading" class="text-center p-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading categories...</span>
                </div>
                <p class="mt-2 text-muted">Loading categories from your API...</p>
              </div>
              
              <!-- Error state -->
              <div v-else-if="error" class="alert alert-warning">
                <LucideIcon icon="mdi:alert-triangle" class="me-2" />
                <strong>Error:</strong> {{ error }}
                <p class="mb-0 mt-2">
                  <small>Could not load categories from your API.</small>
                </p>
              </div>
              
              <!-- Categories loaded -->
              <div v-else-if="displayCategories.length > 0">
                <div class="alert alert-success mb-3">
                  <LucideIcon icon="mdi:check-circle" class="me-2" />
                  <strong>Live Data:</strong> Connected to your API! Categories loaded successfully.
                </div>
                <HierarchicalCategoryTree
                  :categories="displayCategories"
                  :active-category="selectedCategory"
                  @category-select="handleCategorySelect"
                />
                
                <!-- Debug Info -->
                <div class="mt-3">
                  <small class="text-muted">
                    <strong>Debug:</strong> 
                    {{ displayCategories.length }} root categories loaded.
                    ID Types: {{ displayCategories.map(c => `${c.name}(${typeof c.id}:${c.id})`).join(', ') }}
                  </small>
                </div>
              </div>
              
              <!-- No categories found -->
              <div v-else class="text-center p-4 text-muted">
                <LucideIcon icon="mdi:folder-outline" class="fs-1 mb-3" />
                <p>No categories found in your database.</p>
                <p><small>Add some categories to your Laravel backend to see them here.</small></p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Selected Category Info -->
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <LucideIcon icon="mdi:information" class="me-2" />
                Selected Category
              </h5>
            </div>
            <div class="card-body">
              <div v-if="selectedCategoryData" class="selected-category-info">
                <h6>{{ selectedCategoryData.name }}</h6>
                <p><strong>Level:</strong> {{ selectedCategoryData.level }}</p>
                <p><strong>Products:</strong> {{ getCategoryProductCount(selectedCategoryData) }}</p>
                <p v-if="selectedCategoryData.parent"><strong>Parent:</strong> {{ selectedCategoryData.parent.name }}</p>
                <p v-if="categoryPath.length > 0"><strong>Path:</strong> {{ categoryPath.map(c => c.name).join(' › ') }}</p>
                
                <div v-if="selectedCategoryData.children && selectedCategoryData.children.length > 0" class="mt-3">
                  <strong>Children:</strong>
                  <ul class="list-unstyled mt-2">
                    <li v-for="child in selectedCategoryData.children" :key="child.id" class="mb-1">
                      <LucideIcon :icon="child.icon || 'mdi:tag'" class="me-2" />
                      {{ child.name }} ({{ getCategoryProductCount(child) }} products)
                    </li>
                  </ul>
                </div>
              </div>
              <div v-else class="text-muted">
                Select a category to see details
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- JSON Data Preview -->
      <div class="row mt-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <LucideIcon icon="mdi:code-json" class="me-2" />
                Real Category Data Structure
                <span v-if="loading" class="badge bg-warning ms-2">Loading...</span>
                <span v-else-if="error" class="badge bg-warning ms-2">Demo Mode</span>
                <span v-else class="badge bg-success ms-2">Live Data</span>
              </h5>
            </div>
            <div class="card-body">
              <div v-if="loading" class="text-center p-4">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2">Loading category data...</p>
              </div>
              
              <div v-else-if="error" class="alert alert-info">
                <p><strong>API Connection:</strong> {{ error }}</p>
                <p class="mb-0">To see your real categories, make sure your Laravel API is running and accessible.</p>
              </div>
              
              <div v-else-if="displayCategories.length > 0">
                <pre class="bg-light p-3 rounded" style="max-height: 400px; overflow-y: auto;"><code>{{ JSON.stringify(displayCategories.slice(0, 3), null, 2) }}</code></pre>
                <p class="text-muted mt-2">
                  <small>
                    Showing first 3 categories. Total: {{ displayCategories.length }} categories loaded from your API.
                  </small>
                </p>
              </div>
              
              <div v-else>
                <div class="alert alert-warning">
                  <p><strong>No Categories Found</strong></p>
                  <p class="mb-0">Your API returned no categories. Add some categories to your Laravel backend to see them here.</p>
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
import { ref, computed, onMounted } from 'vue';
import type { Category } from '@/types';
import HierarchicalCategoryTree from '@/components/categories/HierarchicalCategoryTree.vue';
import LucideIcon from '@/components/LucideIcon.vue';
import { useHierarchicalCategories } from '@/composables/useHierarchicalCategories';

// Use real categories from your API
const { 
  hierarchicalCategories, 
  fetchCategories, 
  loading, 
  error,
  getCategoryPath,
  findCategoryById 
} = useHierarchicalCategories();


// Fetch categories when component mounts
onMounted(async () => {
  await fetchCategories();
});

// Use only real categories from API
const displayCategories = computed(() => {
  if (loading.value) return [];
  return hierarchicalCategories.value;
});

const selectedCategory = ref<string>('');
const selectedCategoryData = ref<Category | null>(null);

// Get category path for breadcrumbs
const categoryPath = computed(() => {
  if (!selectedCategory.value) return [];
  return getCategoryPath(selectedCategory.value);
});


// Helper to get product count for a category, summing children if needed
const getCategoryProductCount = (category: any): number => {
  if (typeof category.products_count === 'number') return category.products_count;
  if (Array.isArray(category.products)) return category.products.length;
  if (Array.isArray(category.children) && category.children.length > 0) {
    return category.children.reduce((sum: number, child: any) => sum + getCategoryProductCount(child), 0);
  }
  return 0;
};

// Handle category selection (always fetch full details from API)
const handleCategorySelect = async (category: Category) => {
  selectedCategory.value = String(category.id); // Normalize to string
  try {
    const config = useRuntimeConfig();
    // Use slug if available, else fallback to id
    const slugOrId = category.slug || category.id;
    const detail = await $fetch(`${config.public.apiBase}/categories/${slugOrId}`, {
      headers: { Accept: 'application/json' }
    });
      selectedCategoryData.value = detail as Category;
  } catch (e) {
    // fallback to original object if fetch fails
    selectedCategoryData.value = category;
  }
  console.log('Category selected:', {
    category: selectedCategoryData.value,
    path: categoryPath.value.map(c => c.name).join(' › ')
  });
};

// Set page title
useHead({
  title: '3-Level Category System Demo - Real Data'
});
</script>

<style scoped lang="scss">
.category-demo {
  min-height: 100vh;
  background: var(--background-light);
  
  .card {
    border: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    
    .card-header {
      background: var(--color-primary);
      color: white;
      border-bottom: none;
    }
  }
  
  .selected-category-info {
    h6 {
      color: var(--color-primary);
      font-weight: 600;
      margin-bottom: 1rem;
    }
    
    p {
      margin-bottom: 0.5rem;
    }
    
    ul li {
      padding: 0.25rem 0;
      color: var(--text-secondary);
    }
  }
  
  pre {
    max-height: 400px;
    overflow-y: auto;
    font-size: 0.85rem;
    
    code {
      color: var(--text-primary);
    }
  }
}
</style>
