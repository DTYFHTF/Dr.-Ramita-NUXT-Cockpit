<template>
  <div class="category-page">
    <!-- Category Header -->
    <div class="category-header">
      <div class="container">
        <!-- Breadcrumbs -->
        <CategoryBreadcrumb 
          v-if="categoryPath.length"
          :categories="categoryPath"
          class="mb-3"
        />
        
        <!-- Category Title & Description -->
        <div class="category-hero">
          <div class="row align-items-center">
            <div class="col-lg-8">
              <h1 class="category-title">
                <LucideIcon 
                  v-if="currentCategory?.icon" 
                  :icon="currentCategory.icon" 
                  class="me-3 category-icon"
                />
                {{ currentCategory?.name || 'Category' }}
              </h1>
              <div class="category-meta">
                <span class="badge category-badge me-2">
                  {{ totalProducts }} {{ totalProducts === 1 ? 'Product' : 'Products' }}
                </span>
                <span v-if="currentCategory?.level" class="badge category-level-badge">
                  Level {{ currentCategory.level }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Subcategories (if any) -->
    <div v-if="subcategories.length > 0" class="subcategories-section">
      <div class="container">
        <h2 class="section-title">Browse Subcategories</h2>
        <div class="row">
          <div 
            v-for="subcategory in subcategories" 
            :key="subcategory.id"
            class="col-lg-3 col-md-4 col-sm-6 mb-4"
          >
            <NuxtLink 
              :to="`/category/${subcategory.slug}`"
              class="subcategory-card"
            >
              <div class="subcategory-icon">
                <LucideIcon 
                  :icon="subcategory.icon || 'Package'" 
                  size="24"
                />
              </div>
              <h3 class="subcategory-name">{{ subcategory.name }}</h3>
              <div class="subcategory-count">
                {{ subcategory.products_count || 0 }} products
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Products Section -->
    <div v-if="categoryProducts.length > 0" class="products-section">
      <div class="container">
        <div class="row">
          <!-- Sidebar Filters -->
          <div class="col-lg-3 mb-4">
            <FilterSidebar
              :hierarchical-categories="hierarchicalCategories"
              :active-category="activeCategoryId || undefined"
              @category-change="handleCategoryChange"
            />
          </div>

          <!-- Main Content -->
          <div class="col-lg-9">
            <!-- Search & Sort Header -->
            <div class="products-header">
              <div class="row align-items-center mb-4">
                <div class="col-md-6">
                  <input
                    v-model="searchQuery"
                    type="text"
                    class="form-input"
                    :placeholder="`Search in ${currentCategory?.name || 'category'}...`"
                    @input="handleSearch"
                  />
                </div>
                <div class="col-md-6">
                  <div class="d-flex align-items-center justify-content-md-end">
                    <label class="form-label me-2 mb-0">Sort by:</label>
                    <select 
                      v-model="sortBy" 
                      class="form-select sort-select"
                      @change="handleSortChange"
                    >
                      <option value="name">Name</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Products Grid -->
            <ProductList
              :products="displayProducts"
              :loading="loading"
              :view-mode="viewMode"
              :show-view-toggle="true"
              @view-change="handleViewChange"
            />

            <!-- Pagination -->
            <nav v-if="totalPages > 1" class="mt-4">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link" @click="handlePageChange(currentPage - 1)">
                    &laquo; Previous
                  </button>
                </li>
                
                <li
                  v-for="page in visiblePages"
                  :key="page"
                  class="page-item"
                  :class="{ active: page === currentPage }"
                >
                  <button 
                    v-if="typeof page === 'number'"
                    class="page-link" 
                    @click="handlePageChange(page)"
                  >
                    {{ page }}
                  </button>
                  <span v-else class="page-link disabled">{{ page }}</span>
                </li>

                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button class="page-link" @click="handlePageChange(currentPage + 1)">
                    Next &raquo;
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="empty-state">
      <div class="container text-center py-5">
        <LucideIcon icon="Package" size="64" class="text-muted mb-3" />
        <h3 class="empty-title">No Products Found</h3>
        <p class="empty-description">
          {{ searchQuery 
            ? `No products found matching "${searchQuery}" in this category.`
            : 'This category doesn\'t have any products yet.'
          }}
        </p>
        <div class="empty-actions">
          <NuxtLink to="/products" class="btn btn-outline-primary">
            Browse All Products
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="container">
        <div class="row">
          <div class="col-lg-3">
            <div class="skeleton-sidebar"></div>
          </div>
          <div class="col-lg-9">
            <div class="skeleton-products"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Category } from '@/types'
import { useCategoryProducts } from '@/composables/useCategoryProducts'
import { useHierarchicalCategories } from '@/composables/useHierarchicalCategories'

// Components
import CategoryBreadcrumb from '@/components/categories/CategoryBreadcrumb.vue'
import FilterSidebar from '@/components/products/FilterSidebar.vue'
import ProductList from '@/components/products/ProductList.vue'

// Meta and SEO
definePageMeta({
  layout: 'auth'
})

// Composables
const route = useRoute()
const router = useRouter()
const { 
  loading, 
  error,
  categoryData,
  fetchCategoryProducts,
  totalProducts,
  category
} = useCategoryProducts()

const { 
  hierarchicalCategories, 
  fetchCategories, 
  getCategoryPath,
  findCategoryById
} = useHierarchicalCategories()

// Local state
const searchQuery = ref('')
const sortBy = ref('name')
const viewMode = ref<'grid' | 'list'>('grid')
const currentPage = ref(1)
const itemsPerPage = ref(12)

// Computed properties
const categorySlug = computed(() => {
  const slugArray = route.params.slug as string[]
  return slugArray[slugArray.length - 1] // Get the last slug for current category
})

// Find the category ID by slug for the tree
const activeCategoryId = computed(() => {
  if (!categorySlug.value || !hierarchicalCategories.value) return null
  
  // Find category by slug in the hierarchical tree
  const findCategoryBySlug = (categories: Category[], slug: string): Category | null => {
    for (const category of categories) {
      if (category.slug === slug) {
        return category
      }
      if (category.children && category.children.length > 0) {
        const found = findCategoryBySlug(category.children, slug)
        if (found) return found
      }
    }
    return null
  }
  
  const category = findCategoryBySlug(hierarchicalCategories.value, categorySlug.value)
  return category ? String(category.id) : null
})

const currentCategory = computed(() => {
  return categoryData.value
})

const categoryPath = computed(() => {
  return getCategoryPath(categorySlug.value)
})

const subcategories = computed(() => {
  if (!currentCategory.value) return []
  return currentCategory.value.children || []
})

const categoryProducts = computed(() => {
  return currentCategory.value?.products || []
})

const filteredProducts = computed(() => {
  let filtered = [...categoryProducts.value]
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    )
  }
  
  // Apply sorting
  switch (sortBy.value) {
    case 'price_asc':
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
      break
    case 'price_desc':
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
      break
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'newest':
      filtered.sort((a, b) => {
        const dateA = new Date(a.created_at || 0)
        const dateB = new Date(b.created_at || 0)
        return dateB.getTime() - dateA.getTime()
      })
      break
    case 'rating':
      filtered.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
      break
  }
  
  return filtered
})

const displayProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value)
})

const visiblePages = computed(() => {
  const current = currentPage.value
  const total = totalPages.value
  const pages = []
  
  // Always show first page
  if (current > 3) pages.push(1)
  if (current > 4) pages.push('...')
  
  // Show pages around current
  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
    pages.push(i)
  }
  
  // Always show last page
  if (current < total - 3) pages.push('...')
  if (current < total - 2) pages.push(total)
  
  return pages
})

// Methods
const handleSearch = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value
  currentPage.value = 1
}

const handleSortChange = () => {
  currentPage.value = 1
}

const handleViewChange = (mode: 'grid' | 'list') => {
  viewMode.value = mode
}

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleCategoryChange = (categoryId: string) => {
  const category = findCategoryById(categoryId)
  if (category?.slug) {
    router.push(`/category/${category.slug}`)
  }
}

// SEO and meta
const seoTitle = computed(() => {
  if (currentCategory.value) {
    return `${currentCategory.value.name} - Ayurveda Products | Dr. Ramita`
  }
  return 'Category - Dr. Ramita Ayurveda'
})

const seoDescription = computed(() => {
  return `Browse our curated collection of ${totalProducts.value} authentic Ayurvedic products in ${currentCategory.value?.name || 'this category'}.`
})

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogType: 'website',
})

// Lifecycle
onMounted(async () => {
  await fetchCategories()
  await fetchCategoryProducts(categorySlug.value)
})

// Watch for route changes
watch(() => route.params.slug, async (newSlug) => {
  if (newSlug) {
    const slug = Array.isArray(newSlug) ? newSlug[newSlug.length - 1] : newSlug
    await fetchCategoryProducts(slug)
    currentPage.value = 1
  }
}, { immediate: true })
</script>

<style scoped lang="scss">
.category-page {
  min-height: 100vh;
  background: var(--background-light);
}

.category-header {
  background: var(--background-white);
  border-bottom: 1px solid var(--border-color);
  padding: 2rem 0;
  margin-bottom: 2rem;
}

.category-hero {
  .category-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    
    .category-icon {
      color: var(--color-primary);
    }
  }
  
  .category-description {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin-bottom: 1rem;
    line-height: 1.6;
  }
  
  .category-meta {
    .category-badge {
      background: var(--color-primary);
      color: var(--text-white);
      font-weight: 600;
      padding: 0.5rem 1rem;
      border-radius: 8px;
    }
    
    .category-level-badge {
      background: var(--accent-soft-green);
      color: var(--text-primary);
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 8px;
    }
  }
}

.category-image-wrapper {
  .category-image {
    width: 100%;
    max-width: 200px;
    height: auto;
    border-radius: 12px;
    box-shadow: var(--card-shadow);
  }
}

.subcategories-section {
  background: var(--background-white);
  padding: 3rem 0;
  margin-bottom: 2rem;
  
  .section-title {
    font-size: 2rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .subcategory-card {
    display: block;
    background: var(--background-white);
    border: 2px solid var(--border-color);
    border-radius: 12px;
    padding: 1.5rem;
    text-decoration: none;
    transition: all 0.3s ease;
    height: 100%;
    
    &:hover {
      border-color: var(--color-primary);
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(var(--color-primary-rgb), 0.15);
      text-decoration: none;
    }
    
    .subcategory-icon {
      width: 48px;
      height: 48px;
      background: var(--background-light);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      color: var(--color-primary);
    }
    
    .subcategory-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }
    
    .subcategory-description {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .subcategory-count {
      font-size: 0.875rem;
      color: var(--color-primary);
      font-weight: 600;
    }
  }
}

.products-section {
  background: var(--background-white);
  padding: 2rem 0;
  
  .products-header {
    .sort-select {
      max-width: 200px;
      border-color: var(--border-color);
      border-radius: 8px;
      
      &:focus {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
      }
    }
  }
}

.empty-state {
  background: var(--background-white);
  padding: 4rem 0;
  
  .empty-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }
  
  .empty-description {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
  }
  
  .empty-actions {
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
    }
  }
}

.loading-state {
  padding: 2rem 0;
  
  .skeleton-sidebar {
    height: 400px;
    background: linear-gradient(90deg, var(--background-light) 0%, var(--border-color) 50%, var(--background-light) 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 8px;
  }
  
  .skeleton-products {
    height: 600px;
    background: linear-gradient(90deg, var(--background-light) 0%, var(--border-color) 50%, var(--background-light) 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 8px;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

// Responsive design
@media (max-width: 768px) {
  .category-hero {
    text-align: center;
    
    .category-title {
      font-size: 2rem;
      flex-direction: column;
      gap: 0.5rem;
    }
  }
  
  .subcategories-section {
    .subcategory-card {
      margin-bottom: 1rem;
    }
  }
  
  .products-header {
    .row {
      flex-direction: column;
      gap: 1rem;
    }
  }
}
</style>
