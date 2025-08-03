<template>
  <div class="categories-index">
    <!-- Hero Section -->
    <div class="categories-hero">
      <div class="container">
        <div class="text-center py-5">
          <h1 class="hero-title">Browse Categories</h1>
          <p class="hero-subtitle">
            Explore our comprehensive collection of authentic Ayurvedic products
          </p>
        </div>
      </div>
    </div>

    <!-- Categories Grid -->
    <div class="categories-grid-section">
      <div class="container">
        <div v-if="loading" class="loading-state">
          <div class="row">
            <div v-for="n in 6" :key="n" class="col-lg-4 col-md-6 mb-4">
              <div class="category-card-skeleton"></div>
            </div>
          </div>
        </div>

        <div v-else-if="error" class="error-state alert alert-danger">
          {{ error }}
        </div>

        <div v-else class="categories-grid">
          <div class="row">
            <div 
              v-for="category in level1Categories" 
              :key="category.id"
              class="col-lg-4 col-md-6 mb-4"
            >
              <NuxtLink 
                :to="`/category/${category.slug}`"
                class="category-card"
              >
                <div class="category-card-header">
                  <div class="category-icon-wrapper">
                    <LucideIcon 
                      :icon="category.icon || 'Package'" 
                      size="32"
                      class="category-icon"
                    />
                  </div>
                  <h3 class="category-title">{{ category.name }}</h3>
                </div>
                
                <div class="category-card-body">
                  <div class="category-stats">
                    <div class="stat-item">
                      <span class="stat-value">{{ category.products_count || 0 }}</span>
                      <span class="stat-label">Products</span>
                    </div>
                    <div v-if="category.children?.length" class="stat-item">
                      <span class="stat-value">{{ category.children.length }}</span>
                      <span class="stat-label">Subcategories</span>
                    </div>
                  </div>
                  
                  <!-- Subcategories Preview -->
                  <div v-if="category.children?.length" class="subcategories-preview">
                    <h4 class="preview-title">Popular Subcategories:</h4>
                    <div class="subcategory-tags">
                      <span 
                        v-for="subcategory in category.children.slice(0, 3)" 
                        :key="subcategory.id"
                        class="subcategory-tag"
                      >
                        {{ subcategory.name }}
                      </span>
                      <span v-if="category.children.length > 3" class="more-tag">
                        +{{ category.children.length - 3 }} more
                      </span>
                    </div>
                  </div>
                </div>

                <div class="category-card-footer">
                  <span class="explore-link">
                    Explore Category
                    <LucideIcon icon="ArrowRight" size="16" class="ms-1" />
                  </span>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- All Categories Tree (Optional) -->
        <div v-if="!loading && !error" class="all-categories-section mt-5">
          <div class="row">
            <div class="col-lg-8 mx-auto">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title mb-0">All Categories</h3>
                </div>
                <div class="card-body">
                  <HierarchicalCategoryTree
                    :categories="hierarchicalCategories"
                    :navigation-mode="true"
                    :loading="loading"
                    :error="error || undefined"
                  />
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
import { computed, onMounted } from 'vue'
import { useHierarchicalCategories } from '@/composables/useHierarchicalCategories'
import HierarchicalCategoryTree from '@/components/categories/HierarchicalCategoryTree.vue'

// Meta
definePageMeta({
  layout: 'auth'
})

// Composables
const { 
  hierarchicalCategories, 
  loading, 
  error, 
  fetchCategories 
} = useHierarchicalCategories()

// Computed
const level1Categories = computed(() => {
  return hierarchicalCategories.value.filter(cat => cat.level === 1)
})

// SEO
useSeoMeta({
  title: 'Browse Categories - Dr. Ramita Ayurveda',
  description: 'Explore our comprehensive collection of authentic Ayurvedic products organized by categories.',
  ogTitle: 'Browse Categories - Dr. Ramita Ayurveda',
  ogDescription: 'Explore our comprehensive collection of authentic Ayurvedic products organized by categories.',
  ogType: 'website',
})

// Lifecycle
onMounted(() => {
  fetchCategories()
})
</script>

<style scoped lang="scss">
.categories-index {
  min-height: 100vh;
  background: var(--background-light);
}

.categories-hero {
  background: var(--background-white);
  border-bottom: 1px solid var(--border-color);
  
  .hero-title {
    font-size: 3rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto;
  }
}

.categories-grid-section {
  padding: 3rem 0;
}

.category-card {
  display: block;
  background: var(--background-white);
  border: 2px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  text-decoration: none;
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(var(--color-primary-rgb), 0.15);
    text-decoration: none;
  }
  
  .category-card-header {
    text-align: center;
    margin-bottom: 1.5rem;
    
    .category-icon-wrapper {
      width: 80px;
      height: 80px;
      background: var(--background-light);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      transition: all 0.3s ease;
      
      .category-icon {
        color: var(--color-primary);
      }
    }
    
    .category-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }
  }
  
  .category-card-body {
    margin-bottom: 1.5rem;
    
    .category-stats {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-bottom: 1.5rem;
      
      .stat-item {
        text-align: center;
        
        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-primary);
        }
        
        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
      }
    }
    
    .subcategories-preview {
      text-align: center;
      
      .preview-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 0.75rem;
      }
      
      .subcategory-tags {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.5rem;
        
        .subcategory-tag,
        .more-tag {
          font-size: 0.875rem;
          background: var(--background-light);
          color: var(--text-secondary);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }
        
        .more-tag {
          color: var(--color-primary);
          font-weight: 500;
        }
      }
    }
  }
  
  .category-card-footer {
    text-align: center;
    
    .explore-link {
      color: var(--color-primary);
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-size: 1rem;
    }
  }
  
  &:hover {
    .category-icon-wrapper {
      background: var(--color-primary);
      
      .category-icon {
        color: var(--text-white);
      }
    }
  }
}

.all-categories-section {
  .card {
    border: 2px solid var(--border-color);
    border-radius: 16px;
    background: var(--background-white);
    
    .card-header {
      background: var(--background-light);
      border-bottom: 1px solid var(--border-color);
      padding: 1.5rem;
      border-radius: 14px 14px 0 0;
      
      .card-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
      }
    }
    
    .card-body {
      padding: 1.5rem;
    }
  }
}

.loading-state {
  .category-card-skeleton {
    height: 300px;
    background: linear-gradient(90deg, var(--background-light) 0%, var(--border-color) 50%, var(--background-light) 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 16px;
  }
}

.error-state {
  margin: 2rem 0;
  text-align: center;
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
  .categories-hero {
    .hero-title {
      font-size: 2rem;
    }
    
    .hero-subtitle {
      font-size: 1.1rem;
    }
  }
  
  .category-card {
    padding: 1.5rem;
    
    .category-card-header {
      .category-icon-wrapper {
        width: 60px;
        height: 60px;
      }
      
      .category-title {
        font-size: 1.25rem;
      }
    }
    
    .category-stats {
      gap: 1rem !important;
    }
  }
}
</style>
