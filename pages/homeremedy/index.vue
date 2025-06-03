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
import { ref, computed, onMounted } from 'vue';
import HomeRemedyCard from '~/components/HomeRemedyCard.vue';
import IndexSection from '~/components/IndexSection.vue'; // Assuming this is your reusable section component

const config = useRuntimeConfig();
const apiBase = config.public.apiBase; // Make sure this is configured in your nuxt.config.ts to point to your Laravel backend

const homeRemedies = ref([]);
const loading = ref(true);
const error = ref(null);

async function fetchHomeRemedies() {
  loading.value = true;
  error.value = null;
  try {
    // Adjust the endpoint to match your Laravel API structure
    const response = await fetch(`${apiBase}/home-remedies`); 
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Assuming Laravel API returns data in a 'data' property for paginated results,
    // or directly as an array for non-paginated results.
    homeRemedies.value = Array.isArray(data) ? data : (data.data || []);
  } catch (e) {
    console.error("Failed to fetch home remedies:", e);
    error.value = e.message || 'Failed to fetch home remedies. Please try again later.';
  } finally {
    loading.value = false;
  }
}

const homeRemediesWithImages = computed(() => {
  return homeRemedies.value.map(remedy => ({
    ...remedy,
    // Assuming your Laravel API returns a full 'image_url'
    // If not, you might need to construct it, e.g., `${apiBase}/${remedy.image_path}`
    // Or, if it's just a placeholder or relative path from public:
    image: remedy.image_url || remedy.image || '/placeholder-remedy.jpg', 
    // Ensure other properties expected by HomeRemedyCard are present or have defaults
    title: remedy.title || 'Untitled Remedy',
    description: remedy.subtitle || remedy.description || 'No description available.'
  }));
});

onMounted(() => {
  fetchHomeRemedies();
});
</script>

<style scoped>
/* Add any page-specific styles here */
</style>