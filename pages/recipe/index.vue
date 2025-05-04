<template>Hello World!</template>
<!-- <template>
    <main class="container mx-auto px-4 py-12">
      <section class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">Ayurvedic Recipes</h1>
        <p class="text-gray-600 text-lg max-w-2xl mx-auto">
          Nourish your body with traditional healing recipes
        </p>
      </section>
  
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="n in 3" :key="n" class="recipe-card-skeleton h-96 bg-gray-100 rounded-lg"></div>
      </div>
  
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <RecipeCard 
          v-for="recipe in recipes" 
          :key="recipe._id" 
          :recipe="recipe"
        />
      </div>
  
      <section v-if="!pending && recipes.length === 0" class="text-center py-16">
        <p class="text-gray-500">No recipes found. Please check back later.</p>
      </section>
    </main>
  </template>
  
  

  <script setup>
// Import necessary modules and components
import LucideIcon from '@/components/LucideIcon.vue';
import { ref, computed, watchEffect } from 'vue';
import { marked } from 'marked';
import { useRoute } from 'vue-router';
import { useApi } from '@/composables/useApi';

// Initialize route and reactive variables
const route = useRoute();
const course = ref(null);
const error = ref(null);

// Fetch course data using useApi composable
const { data, error: apiError, refetch } = useApi(`item/recipies/${route.params.id}`);

// Markdown rendering utility
const renderMarkdown = (content) => (content ? marked.parse(content) : '');

// Retry fetch logic
const retryFetch = async () => {
  error.value = null;
  await refetch();
};

// Watch for data changes and update course details
watchEffect(() => {
  if (data.value) {
    course.value = {
      ...data.value,
      imageUrl: data.value.image?._id
        ? `http://localhost:9000/assets/link/${data.value.image._id}`
        : '/placeholder-recipies.jpg',
    };
  }
  error.value = apiError.value;
});

</script>
  
  <style>
  .recipe-card-skeleton {
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  </style> -->