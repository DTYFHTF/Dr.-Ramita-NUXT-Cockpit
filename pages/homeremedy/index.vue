<template>
  <div>
    <IndexSection
      section-id="home-remedies"
      bg-class="bg-sandal-light"
      title="Home Remedies"
      subtitle="Explore natural remedies for holistic health"
      :items="homeRemediesWithImages"
      :card-component="HomeRemedyCard"
      :loading="loading"
      :error="error"
      loading-text="Loading home remedies..."
      error-text="Failed to load home remedies"
      empty-text="No home remedies available at the moment"
      :showViewMore="false" 
    />
  </div>
</template>

<script setup>
import HomeRemedyCard from '~/components/HomeRemedyCard.vue';
import IndexSection from '~/components/IndexSection.vue'; // Assuming this is your reusable section component
import { useApiLaravel } from '@/composables/useApi.js'
import { useImageUrl } from '@/composables/useImageUrl.js'
import { ref, watch } from 'vue';

const { data: remediesData, error, loading } = useApiLaravel('home-remedies');
const remedies = ref([]);
const { getImageUrl } = useImageUrl();

watch(remediesData, (val) => {
  if (!val || !val.data) return;
  remedies.value = val.data.map(remedy => ({
    ...remedy,
    imageUrl: remedy.image ? getImageUrl(remedy.image, '/fallback.jpg') : undefined
  }));
}, { immediate: true });

const homeRemediesWithImages = computed(() => {
  return remedies.value.map(remedy => ({
    ...remedy,
    image: remedy.image_url || remedy.image || '/placeholder-remedy.jpg', 
    title: remedy.title || 'Untitled Remedy',
    description: remedy.subtitle || remedy.description || 'No description available.'
  }));
});
</script>

<style scoped>
/* Add any page-specific styles here */
</style>