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
</script>

