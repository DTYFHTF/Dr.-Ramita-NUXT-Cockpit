
<template>
  <div>
    <BannerCarousel 
      :banners="banners" 
      :loading="homepageLoading" 
      :error="homepageError" 
    />
    
    <FeaturedCategories 
      :categories="featuredCategories" 
      :loading="homepageLoading" 
    />
  </div>
</template>

<script setup>
import BannerCarousel from '@/components/BannerCarousel.vue';
import FeaturedCategories from '@/components/categories/FeaturedCategories.vue';
import { useApiLaravel } from '@/composables/useApi.js';
import { useImageUrl } from '@/composables/useImageUrl.js';

const { data: homepageData, error: homepageError, loading: homepageLoading } = useApiLaravel('homepage');
const { getImageUrl } = useImageUrl();

const addImageUrl = (item, fallback = '/placeholder-banner.jpg') => {
  let img = item.image || '';
  if (typeof img === 'string' && img.startsWith('http')) {
    return { ...item, image: img };
  }
  return { ...item, image: getImageUrl(img, fallback) };
};

const banners = computed(() => {
  const section = (homepageData.value?.sections || []).find(s => s.type === 'banner');
  if (!section || !Array.isArray(section.data?.banners)) return [];
  return section.data.banners.map(b => addImageUrl(b, '/placeholder-banner.jpg'));
});

const featuredCategories = computed(() => {
  const section = (homepageData.value?.sections || []).find(s => s.type === 'auto_featured_categories');
  if (!section || !Array.isArray(section.data?.categories)) return [];
  return section.data.categories.map(category => addImageUrl(category, '/placeholder-category.jpg'));
});
</script>

<style scoped>
/* Add page-specific styles here if needed */
</style>
