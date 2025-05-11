<template>
  <IndexSection
    section-id="recipes"
    bg-class="bg-herbal-light"
    title="Ayurvedic Recipes"
    subtitle="Nourish your body with traditional healing recipes"
    :items="recipesWithImages"
    :card-component="RecipeCard"
    :loading="recipesLoading"
    :error="recipesError"
    loading-text="Loading recipes..."
    error-text="Failed to load recipes"
    empty-text="No recipes available at the moment"
    :showViewMore="false"
  />
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
      
      return { 
        ...recipe, 
        image: fullImageUrl
      };
    }).filter(recipe => recipe !== null) || [];
  } catch (e) {
    return [];
  }
});
</script>
