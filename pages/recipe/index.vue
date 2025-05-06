<template>
  <div class="container">
    <h1 class="text-center my-4">Ayurvedic Recipes</h1>
    <p class="text-center text-muted mb-4">Nourish your body with traditional healing recipes</p>
    
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-grow text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-muted">Loading recipes...</p>
    </div>
    
    <div v-else-if="error" class="text-center py-5">
      <div class="alert alert-danger mx-auto" style="max-width: 500px">
        <strong>Error:</strong> {{ error.message || 'Failed to load recipes' }}
      </div>
    </div>
    
    <div v-else-if="recipesWithImages.length === 0" class="text-center text-muted">
      <p>No recipes available at the moment. Please check back later!</p>
    </div>
    
    <div v-else class="row">
      <div 
        class="col-md-4 mb-4" 
        v-for="recipe in recipesWithImages" 
        :key="recipe._id">
        <RecipeCard 
          :id="recipe._id" 
          :title="recipe.title" 
          :slug="recipe.slug" 
          :description="recipe.description"
          :image="recipe.image" 
          :category="recipe.category"
          :preparation-time="recipe.preparationTime"
          :servings="recipe.servings"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import RecipeCard from '@/components/RecipeCard.vue';
import { useApi } from '@/composables/useApi';
import { computed } from 'vue';

// Fetch recipes data using the useApi composable
const { data: recipes, error, loading } = useApi('items/recipies');

// Add image URLs to recipes
const recipesWithImages = computed(() => {
  if (!recipes.value) {
    return [];
  }
  
  try {
    return recipes.value.map(recipe => {
      if (!recipe) {
        return null;
      }
      
      const imageId = recipe.image?._id;
      const fullImageUrl = imageId ? `http://localhost:9000/assets/link/${imageId}` : '';
      return { ...recipe, image: fullImageUrl };
    }).filter(recipe => recipe !== null) || [];
  } catch (e) {
    return [];
  }
});
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>