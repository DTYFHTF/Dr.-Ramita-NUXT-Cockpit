<template>
  <div class="category-page">
    

    <!-- Category Header removed: title and meta are now omitted, breadcrumb provides context -->
    <!-- Breadcrumbs - Moved to top -->
    <div class="breadcrumb-section">
      <div class="container">
        <CategoryBreadcrumb 
          :categories="categoryPath"
          class="py-3"
        />
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
              :price-min="priceMin"
              :price-max="priceMax"
              :in-stock="inStock"
              :price-ranges="priceRanges"
              @category-change="handleCategoryChange"
              @price-range-change="handlePriceRangeChange"
              @stock-change="handleStockChange"
            />
          </div>

          <!-- Main Content -->
          <div class="col-lg-9">
            <!-- Search & Sort Header -->


            <div class="products-header">
              <div class="title-search-row">
                <h1 class="results-title">
                  {{ currentCategory?.name ? `${currentCategory.name}` : 'All Products' }}
                  <span v-if="filteredProducts.length" class="results-count">({{ filteredProducts.length }})</span>
                </h1>
                <div class="inline-search">
                  <ProductSearch 
                    v-model:query="searchQuery"
                    :all-products="categoryProducts"
                    @search="handleSearch"
                    class="search-component"
                    :placeholder="`Search in ${currentCategory?.name || 'category'}...`"
                  />
                </div>
                <ProductSortControls :sort="sortBy" @toggle-sort="toggleSort" />
              </div>
            </div>

            <!-- Active Filters Display -->
            <ActiveFilters 
              :price-min="priceMin" 
              :price-max="priceMax"
              :search-query="searchQuery"
              :in-stock="inStock"
              @clear-price-range="() => { priceMin = undefined; priceMax = undefined; currentPage = 1; }"
              @clear-search="() => { searchQuery = ''; currentPage = 1; }"
              @clear-stock="() => { inStock = true; currentPage = 1; }"
            />

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
import { useProductFilters } from '@/composables/useProductFilters'

// Components
import CategoryBreadcrumb from '@/components/categories/CategoryBreadcrumb.vue'
import FilterSidebar from '@/components/products/FilterSidebar.vue'
import ProductList from '@/components/products/ProductList.vue'
import LucideIcon from '@/components/LucideIcon.vue'
import ProductSearch from '@/components/products/ProductSearch.vue'
import ProductSortControls from '@/components/products/ProductSortControls.vue'
import ActiveFilters from '@/components/products/ActiveFilters.vue'

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
  totalProducts
} = useCategoryProducts()

const { 
  hierarchicalCategories, 
  fetchCategories, 
  findCategoryById
} = useHierarchicalCategories()

// Get priceRanges from useProductFilters for FilterSidebar
const { priceRanges } = useProductFilters()

// Local state
const searchQuery = ref('')
const sortBy = ref('')
const viewMode = ref<'grid' | 'list'>('grid')
const currentPage = ref(1)
const itemsPerPage = ref(12)
// Price and stock filters
const priceMin = ref<number | undefined>(undefined)
const priceMax = ref<number | undefined>(undefined)
const inStock = ref<boolean | undefined>(undefined)

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

// Use the same ancestry logic as HierarchicalCategoryTree for breadcrumbs
const categoryPath = computed(() => {
  if (!categorySlug.value || !hierarchicalCategories.value) return []

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

  // Find the full ancestry path for the current category
  const findCategoryPath = (categoryId: string, categories: Category[]): Category[] | null => {
    for (const category of categories) {
      if (String(category.id) === String(categoryId)) {
        return [category]
      }
      if (category.children && category.children.length > 0) {
        const childPath = findCategoryPath(categoryId, category.children)
        if (childPath) {
          return [category, ...childPath]
        }
      }
    }
    return null
  }

  // First, find the category by slug to get its ID
  const category = findCategoryBySlug(hierarchicalCategories.value, categorySlug.value)
  if (!category) return []
  const path = findCategoryPath(String(category.id), hierarchicalCategories.value)
  return path || []
})

const subcategories = computed(() => {
  if (!currentCategory.value) return []
  return currentCategory.value.children || []
})

const categoryProducts = computed(() => {
  if (!currentCategory.value?.products) return []
  // No mapping needed; backend guarantees display_price, display_sale_price, and average_rating
  return currentCategory.value.products
})

const filteredProducts = computed(() => {
  let filtered = [...categoryProducts.value]
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    )
  }
  // Price filter
  if (typeof priceMin.value === 'number') {
    filtered = filtered.filter(product => parseFloat(product.display_price || product.price) >= priceMin.value!)
  }
  if (typeof priceMax.value === 'number') {
    filtered = filtered.filter(product => parseFloat(product.display_price || product.price) <= priceMax.value!)
  }
  // Stock filter
  if (inStock.value === true) {
    filtered = filtered.filter(product => product.in_stock ?? (product.stock > 0))
  } else if (inStock.value === false) {
    filtered = filtered.filter(product => !(product.in_stock ?? (product.stock > 0)))
  }
  // Sorting
  switch (sortBy.value) {
    case 'display_price_asc':
      filtered.sort((a, b) => parseFloat(a.display_price || a.price) - parseFloat(b.display_price || b.price))
      break
    case 'display_price_desc':
      filtered.sort((a, b) => parseFloat(b.display_price || b.price) - parseFloat(a.display_price || a.price))
      break
    case 'rating_asc':
      filtered.sort((a, b) => (a.average_rating || 0) - (b.average_rating || 0))
      break
    case 'rating_desc':
      filtered.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
      break
    default:
      // Default sort by name
      filtered.sort((a, b) => a.name.localeCompare(b.name))
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

// Filter handlers
function handlePriceRangeChange(range: { min: number | null, max: number | null }) {
  priceMin.value = typeof range.min === 'number' ? range.min : undefined
  priceMax.value = typeof range.max === 'number' ? range.max : undefined
}

function handleStockChange(val: boolean | null) {
  inStock.value = typeof val === 'boolean' ? val : undefined
}

// Methods
const handleSearch = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value
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

function toggleSort(type: string) {
  if (sortBy.value === `${type}_asc`) {
    sortBy.value = `${type}_desc`;
  } else {
    sortBy.value = `${type}_asc`;
  }
  currentPage.value = 1;
}
</script>

<style scoped lang="scss">
.category-page {
  min-height: 100vh;
  background: var(--background-light);
}

.breadcrumb-section {
  background: var(--background-white);
  /* border-bottom removed */
  padding: 0.5rem 0 0.5rem 0;
  min-height: 40px;
}

.category-header {
  background: var(--background-white);
  
}

.category-hero {
  .category-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-primary);
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
}

/* Products Header */
.products-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--background-light);
  gap: 2rem;
}

@media (max-width: 768px) {
  .products-header {
    flex-direction: column;
    gap: 1rem;
  }
}

.title-search-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 0.5rem;
  flex: 1;
}

@media (max-width: 768px) {
  .title-search-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

.results-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.results-count {
  font-size: 1rem;
  font-weight: 400;
  color: var(--text-secondary);
}

.inline-search {
  flex-shrink: 0;
  min-width: 300px;
}

@media (max-width: 768px) {
  .inline-search {
    width: 100%;
    min-width: unset;
  }
}

.search-component {
  background: var(--background-white);
  border-radius: 12px;
  border: 2px solid var(--border-color);
  overflow: hidden;
  transition: all 0.2s ease;
}

.search-component:focus-within {
  border-color: var(--color-success);
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
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
