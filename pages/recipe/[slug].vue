<template>
  <div class="recipe-detail">
    <!-- Loading State -->
    <div v-if="loading && !recipe" class="loading-state text-center py-5">
      <div class="spinner-grow text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-muted">Loading recipe details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error && !recipe" class="error-state text-center py-5">
      <div class="alert alert-danger mx-auto" style="max-width: 500px">
        <LucideIcon icon="alert-triangle" class="me-2" />
        <strong>Error:</strong> {{ error.message || 'Failed to load recipe details' }}
      </div>
      <button class="btn btn-primary mt-3" @click="retryFetch">
        <LucideIcon icon="refresh" class="me-2" />Try Again
      </button>
    </div>

    <!-- Recipe Content -->
    <article v-if="recipe" class="recipe-container">
      <!-- Header Section - Simplified and More Focused -->
      <div class="recipe-header mb-4">
        <div class="row align-items-center">
          <div class="col-lg-7">
            <h1 class="recipe-title">{{ recipe.title }}</h1>
            <p class="recipe-description">{{ recipe.description || '' }}</p>
            
            <div class="recipe-meta">
              <div class="meta-item">
                <LucideIcon icon="clock" />
                <span>{{ recipe.preparationTime || 'N/A' }}</span>
              </div>
              <div class="meta-item">
                <LucideIcon icon="users" />
                <span>{{ recipe.servings || 0 }} servings</span>
              </div>
            </div>
          </div>
          
          <div class="col-lg-5">
            <div class="image-container">
              <div class="tag-badge">{{ recipe.category || 'Main Dishes' }}</div>
              <img 
                :src="recipe.imageUrl" 
                :alt="`${recipe.title}`" 
                class="recipe-image"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Content Sections with Better Layout -->
      <div class="recipe-content-sections">
        <div class="row">
          <!-- Ingredients Section - Left Side -->
          <div class="col-lg-4">
            <div class="content-section ingredients-section">
              <h2 class="section-title">Ingredients</h2>
              <ul class="ingredients-list">
                <li v-for="(ingredient, index) in recipe.ingredients || []" :key="index">
                  {{ ingredient }}
                </li>
              </ul>
            </div>
          </div>
          
          <!-- Instructions Section - Right Side -->
          <div class="col-lg-8">
            <div class="content-section instructions-section">
              <h2 class="section-title">Instructions</h2>
              <div class="instructions-content" v-html="renderMarkdown(recipe.instructions || '')"></div>
            </div>
          </div>
        </div>
        
        <!-- Health Benefits Section - Displayed Horizontally -->
        <div v-if="recipe.healthBenefits && recipe.healthBenefits.length" class="content-section health-benefits-section">
          <h2 class="section-title">Health Benefits</h2>
          <ul class="health-benefits-list">
            <li v-for="(benefit, index) in recipe.healthBenefits" :key="index">
              {{ benefit }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Navigation - Clear Call to Action -->
      <div class="navigation-actions">
        <NuxtLink to="/recipe" class="back-button">
          <LucideIcon icon="arrow-left" />
          Back to Recipes
        </NuxtLink>
      </div>
    </article>
  </div>
</template>

<script setup>
// Import necessary modules and components
import LucideIcon from '@/components/LucideIcon.vue';
import { ref, watchEffect } from 'vue';
import { marked } from 'marked';
import { useRoute } from 'vue-router';
import { useApi } from '@/composables/useApi';

// Initialize route and reactive variables
const route = useRoute();
const recipe = ref(null);
const error = ref(null);

// Fetch recipe data using useApi composable with slug parameter
const { data, error: apiError, loading, refetch } = useApi(`items/recipies?filter={"slug":"${route.params.slug}"}`);

// Markdown rendering utility
const renderMarkdown = (content) => (content ? marked.parse(content) : '');

// Retry fetch logic
const retryFetch = async () => {
  error.value = null;
  await refetch();
};

// Watch for data changes and update recipe details
watchEffect(() => {
  try {
    if (data.value && Array.isArray(data.value) && data.value.length > 0) {
      // Using the first item if the API returns an array of matching recipes
      const recipeData = data.value[0];
      recipe.value = mapRecipeData(recipeData);
    } else if (data.value && typeof data.value === 'object' && data.value._id) {
      // Handle if API returns a single object instead of an array
      recipe.value = mapRecipeData(data.value);
    } else if (data.value === null || data.value === undefined) {
      error.value = new Error('No recipe found with this slug');
    } else {
      error.value = null; // Clear error since we have data
    }
    
    if (apiError.value) {
      error.value = apiError.value;
    }
  } catch (e) {
    error.value = e;
  }
});

// Helper function to map API response property names to component property names
function mapRecipeData(data) {
  if (!data) return null;
  
  return {
    ...data,
    // Map snake_case properties to camelCase
    preparationTime: data.preparation_time || 'N/A',
    healthBenefits: data.health_benefits || [],
    // Add imageUrl for displaying images
    imageUrl: data.image?._id
      ? `http://localhost:9000/assets/link/${data.image._id}`
      : '/placeholder-recipe.jpg'
  };
}
</script>

<style lang="scss" scoped>
// @import '@/assets/scss/variables.scss';

.recipe-detail {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #333;
  
  // Recipe Header Styles
  .recipe-header {
    padding-bottom: 2rem;
    border-bottom: 1px solid #eee;
    
    .recipe-title {
      font-size: 2.2rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: $text-deep-green;
      line-height: 1.2;
    }
    
    .recipe-description {
      font-size: 1.1rem;
      margin-bottom: 1.5rem;
      line-height: 1.5;
      color: #555;
    }
    
    .recipe-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      margin-top: 1.5rem;
      
      .meta-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1rem;
        color: #666;
        
        svg {
          color: #555;
          width: 1.2rem;
          height: 1.2rem;
        }
      }
    }
    
    .image-container {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
      
      .tag-badge {
        position: absolute;
        top: 15px;
        left: 15px;
        background: rgba(255, 255, 255, 0.9);
        color: #555;
        padding: 0.4rem 0.8rem;
        font-size: 0.9rem;
        border-radius: 20px;
        z-index: 5;
      }
      
      .recipe-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        aspect-ratio: 4/3;
        vertical-align: middle;
      }
    }
  }
  
  // Content Sections
  .recipe-content-sections {
    margin-top: 2rem;
    
    .content-section {
      background: #fff;
      border-radius: 10px;
      padding: 1.8rem;
      margin-bottom: 2rem;
      box-shadow: $card-shadow;
      
      .section-title {
        font-size: 1.4rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        color: $text-deep-green;
        position: relative;
        display: inline-block;
        padding-bottom: 0.3rem;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 3px;
          background: $accent-soft-green;
        }
      }
    }
    
    // Ingredients styles
    .ingredients-section {
      height: 100%;
      
      .ingredients-list {
        list-style: none;
        padding: 0;
        margin: 0;
        
        li {
          padding: 0.7rem 0;
          border-bottom: 1px solid #f0f0f0;
          position: relative;
          padding-left: 1.5rem;
          
          &:last-child {
            border-bottom: none;
          }
          
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 1rem;
            width: 0.5rem;
            height: 0.5rem;
            background-color: $accent-soft-green;
            border-radius: 50%;
          }
        }
      }
    }
    
    // Instructions styles
    .instructions-section {
      height: 100%;
      
      .instructions-content {
        font-size: 1.05rem;
        line-height: 1.8;
        
        /* Better handling of instruction content */
        :deep(pre), :deep(code) {
          white-space: pre-wrap !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
          max-width: 100% !important;
          background-color: transparent !important;
          padding: 0 !important;
          border: none !important;
          display: block !important;
          margin: 0 !important;
          color: inherit !important;
          font-family: inherit !important;
        }
        
        /* Remove any unwanted styles from the Markdown renderer */
        :deep(p) {
          margin-bottom: 1rem;
        }
        
        /* Format numbered steps nicely */
        :deep(ol), :deep(ul) {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
          
          li {
            margin-bottom: 0.5rem;
          }
        }
      }
    }
    
    // Health Benefits styles
    .health-benefits-section {
      .health-benefits-list {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        padding: 0;
        margin: 0;
        list-style: none;
        
        li {
          background-color: #f4f9f6;
          padding: 0.6rem 1.2rem;
          border-radius: 25px;
          font-size: 0.95rem;
          color: #666;
          display: inline-flex;
          align-items: center;
          
          &::before {
            content: '•';
            margin-right: 0.5rem;
            color: $accent-soft-green;
          }
        }
      }
    }
  }
  
  // Navigation Actions
  .navigation-actions {
    margin-top: 1.5rem;
    display: flex;
    justify-content: center;
    
    .back-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.8rem 1.5rem;
      background-color: #f9f9f9;
      color: $text-deep-green;
      border-radius: 30px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s ease;
      border: 1px solid #eee;
      
      svg {
        width: 1.1rem;
        height: 1.1rem;
      }
      
      &:hover {
        background-color: #f4f9f6;
        color: darken($accent-soft-green, 5%);
        transform: translateY(-2px);
        box-shadow: $btn-hover-shadow;
      }
    }
  }
  
  // Responsive Adjustments
  @media (max-width: 992px) {
    .recipe-header {
      .recipe-title {
        font-size: 1.8rem;
      }
      
      .image-container {
        margin-top: 1.5rem;
      }
    }
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    
    .recipe-content-sections {
      .health-benefits-section {
        .health-benefits-list {
          flex-direction: column;
          gap: 0.7rem;
          
          li {
            width: 100%;
          }
        }
      }
    }
  }
  
  @media (min-width: 768px) and (max-width: 992px) {
    .recipe-content-sections {
      .health-benefits-section {
        .health-benefits-list {
          li {
            flex-basis: calc(50% - 0.5rem);
          }
        }
      }
    }
  }
}
</style>