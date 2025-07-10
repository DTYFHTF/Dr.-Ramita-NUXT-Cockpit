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
        <LucideIcon icon="mdi:alert-triangle" class="me-2" />
        <strong>Error:</strong>
        {{ error.message || "Failed to load recipe details" }}
      </div>
      <button class="btn btn-primary mt-3" @click="retryFetch">
        <LucideIcon icon="mdi:refresh" class="me-2" />Try Again
      </button>
    </div>

    <!-- Recipe Content -->
    <article v-if="recipe" class="recipe-container">
      <!-- Header Section - Simplified and More Focused -->
      <div class="recipe-header mb-4">
        <div class="row align-items-center">
          <div class="col-lg-7">
            <h1>{{ recipe.title }}</h1>
            <p class="recipe-description">
              <DynamicContent :content="recipe.description || ''" />
            </p>

            <div class="recipe-meta">
              <div class="meta-item">
                <LucideIcon icon="mdi:clock" />
                <span>{{ recipe.preparation_time || "N/A" }}</span>
              </div>
              <div class="meta-item">
                <LucideIcon icon="mdi:users" />
                <span>{{ recipe.servings || 0 }} servings</span>
              </div>
            </div>
          </div>

          <div class="col-lg-5">
            <div class="image-container">
              <div class="tag-badge">
                {{ recipe.category || "Main Dishes" }}
              </div>
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
      <div class="recipe-content-sections ">
        <div class="row">
          <!-- Ingredients Section - Left Side -->
          <div class="col-lg-4">
            <div class="content-section">
              <h2>Ingredients</h2>
              
                <li
                  v-for="(ingredient, index) in recipe.ingredients || []"
                  :key="index"
                  class="list-before"
                >
                  <DynamicContent :content="ingredient || ''" />
                </li>
            </div>
          </div>

          <!-- Instructions Section - Right Side -->
          <div class="col-lg-8">
            <div class="content-section">
              <h2>Instructions</h2>
              <DynamicContent :content="recipe.instructions || ''" />
            </div>
          </div>
        </div>

        <!-- Health Benefits Section - Displayed Horizontally -->
        <div
          v-if="recipe.health_benefits && recipe.health_benefits.length"
          class="content-section health-benefits-section"
        >
          <h2>Health Benefits</h2>
          <ul class="health-benefits-list">
            <li v-for="(benefit, index) in recipe.health_benefits" :key="index" class="list-before">
              <DynamicContent :content="benefit" />
            </li>
          </ul>
        </div>
      </div>

      <!-- Navigation - Clear Call to Action -->
      <div class="navigation-actions">
        <NuxtLink to="/recipe" class="btn btn-smooth-success back-button">
          <LucideIcon icon="mdi:arrow-left" color="white" />
          Back to All Recipes
        </NuxtLink>
      </div>
    </article>
  </div>
</template>

<script setup>
// Import necessary modules and components
import LucideIcon from "@/components/LucideIcon.vue";
import DynamicContent from "@/components/DynamicContent.vue";
import { useApiLaravel } from '@/composables/useApi.js'
import { useImageUrl } from '@/composables/useImageUrl.js'
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

// Initialize route and reactive variables
const route = useRoute();
const recipe = ref(null);
const { getImageUrl } = useImageUrl();
const { data: recipeData, error, loading } = useApiLaravel(`recipes/${route.params.slug}`);

// Retry fetch logic
const retryFetch = async () => {
  error.value = null;
  await refetch();
};

// Watch for data changes and update recipe details
watch(recipeData, (val) => {
  if (!val || !val.data) return;
  recipe.value = {
    ...val.data,
    imageUrl: getImageUrl(val.data.image, '/placeholder-recipe.jpg'),
    
  };
}, { immediate: true });


</script>

<style scoped lang="scss" >

.recipe-detail {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem;
  color: $text-secondary;

  // Recipe Header Styles
  .recipe-header {
    padding-bottom: 2rem;
    border-bottom: 1px solid $border-color;

    .recipe-description {
      font-size: 1.1rem;
      margin-bottom: 1.5rem;
      line-height: 1.5;
      color: $text-secondary;
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
      }
    }

    .image-container {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 6px 16px rgba($color-primary, 0.1);
      

      .recipe-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        aspect-ratio: 1/1;
        vertical-align: middle;
      }
    }
  }

  // Content Sections
  .recipe-content-sections {
    margin-top: 2rem;

    .content-section {
      background: rgba($background-light,0.5);
      border-radius: 10px;
      padding: 1.8rem;
      margin-bottom: 2rem;
      box-shadow: $card-shadow;
    }

     //Ingredients
  li {
          padding: 0.7rem 0;
          border-bottom: 1px solid $border-color;
          position: relative;
          padding-left: 1.5rem;
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
          background-color: rgba($color-secondary, 0.1);
          padding: 0.6rem 1.2rem;
          border-radius: 25px;
          font-size: 0.95rem;
          color: $text-secondary;
          display: inline-flex;
          align-items: center;}
      }
    }
  }
  
 


  .navigation-actions {
    margin-top: 1.5rem;
    display: flex;
    justify-content: center; 
  }
}

</style>
