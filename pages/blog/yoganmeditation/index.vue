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
import { useApiLaravel } from '@/composables/useApi.js'
import { useImageUrl } from '@/composables/useImageUrl.js'
import YogaMeditationCard from "~/components/YogaMeditationCard.vue";
import { computed } from 'vue';

const { data: yoganMeditationData, error, loading } = useApiLaravel('yoga-meditations');
const { getImageUrl } = useImageUrl();

const yogaandmeditation = computed(() => {
  return yoganMeditationData.value?.data?.map(item => ({
    ...item,
    image: getImageUrl(item.image, '/placeholder-yoga.jpg'),
    title: item.title,
    short_description: item.short_description,
    tags: item.tags || 'Uncategorized',
    duration: item.duration || 'N/A',
    slug: item.slug
  })) || [];
});
</script>

