<template>
  <IndexSection
    section-id="yoga-meditation"
    bg-class="bg-herbal-light"
    title="Yoga and Meditation"
    subtitle="Transform your mind and body through ancient practices"
    :items="yogaandmeditation"
    :card-component="YogaMeditationCard"
    :loading="loading"
    :error="error"
    loading-text="Loading practices..."
    error-text="Failed to load yoga content"
    empty-text="No yoga content available"
    :showViewMore="false"
  />
</template>

<script setup>
import { useApi } from '@/composables/useApi';
import YogaMeditationCard from "~/components/YogaMeditationCard.vue";
import { computed } from 'vue';

// Destructure loading and error from useApi
const { data: yoganmeditation, error, loading } = useApi("items/yoganmeditation");

// Enhanced computed property with error handling
const yogaandmeditation = computed(() => {
  try {
    return yoganmeditation.value?.map(item => {
      if (!item) return null;
      
      return {
        ...item,
        image: item.image?._id 
          ? `http://localhost:9000/assets/link/${item.image._id}`
          : "/placeholder-remedy.jpg"
      };
    }).filter(item => item !== null) || [];
  } catch (e) {
    console.error("Error processing yoga data:", e);
    return [];
  }
}); 


</script>

