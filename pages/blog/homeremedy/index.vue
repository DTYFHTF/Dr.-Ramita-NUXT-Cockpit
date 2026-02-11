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
import { ref, watch, computed } from 'vue';

const { data: remediesData, error, loading } = useApiLaravel('home-remedies');
const remedies = ref([]);
const { getImageUrl } = useImageUrl();

watch(remediesData, (val) => {
  if (!val || !val.data) return;
  remedies.value = val.data.map(remedy => ({
    ...remedy,
    image: getImageUrl(remedy.image, '/placeholder-remedy.jpg'),
  }));
}, { immediate: true });

const homeRemediesWithImages = computed(() => remedies.value);

// SEO Meta Tags
usePageSeo({
  title: 'Natural Home Remedies - Ayurvedic Healing Solutions',
  description: 'Explore natural Ayurvedic home remedies for common health conditions. Traditional healing solutions using herbs, spices, and holistic practices for wellness.',
  keywords: 'ayurvedic home remedies, natural healing, herbal remedies, traditional medicine, holistic health, dosha remedies',
  path: '/blog/homeremedy',
});

</script>

<style scoped>
</style>