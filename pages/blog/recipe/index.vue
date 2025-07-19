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
import { useApiLaravel } from '@/composables/useApi.js'
import { useImageUrl } from '@/composables/useImageUrl.js'
import RecipeCard from '~/components/RecipeCard.vue';
import { computed } from 'vue';

const { data: recipesData, error, loading } = useApiLaravel('recipes');
const { getImageUrl } = useImageUrl();

const recipes = computed(() => {
  try {
    return recipesData.value?.data?.map(item => {
      if (!item) return null;
      return {
        ...item,
        image: getImageUrl(item.image, '/placeholder-recipe.jpg'),
        title: item.title,
        shortDescription: item.short_description || item.shortDescription || '',
        tags: item.tags || 'Uncategorized',
        duration: item.duration || 'N/A',
        slug: item.slug
      };
    }).filter(item => item !== null) || [];
  } catch (e) {
    console.error('Error processing recipe data:', e);
    return [];
  }
});

const recipesWithImages = computed(() => {
  return recipes.value.map(recipe => ({
    ...recipe,
    image: recipe.image || '/placeholder-recipe.jpg',
    title: recipe.title || '',
    shortDescription: recipe.shortDescription || '',
    tags: recipe.tags || 'Uncategorized',
    duration: recipe.duration || 'N/A',
    slug: recipe.slug || '',
    // Ensure ingredients and healthBenefits are always arrays
    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
    healthBenefits: Array.isArray(recipe.healthBenefits) ? recipe.healthBenefits : [],
  }));
});

const recipesLoading = loading;
const recipesError = error;
</script>
