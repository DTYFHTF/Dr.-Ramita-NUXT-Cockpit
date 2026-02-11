<template>
  <IndexSection
    section-id="events"
    bg-class="bg-light"
    title="Upcoming Events"
    subtitle="Join us for exciting events and workshops"
    :items="eventsWithImages"
    :card-component="EventCard"
    :loading="loading"
    :error="error"
    loading-text="Loading events..."
    error-text="Failed to load events"
    empty-text="No events available at the moment"
    :showViewMore="false"
  />
</template>

<script setup>
import EventCard from '~/components/EventCard.vue';
import IndexSection from '~/components/IndexSection.vue';
import { useApiLaravel } from '@/composables/useApi.js'
import { useImageUrl } from '@/composables/useImageUrl.js'
import { computed } from 'vue';

const { data: eventsData, error, loading } = useApiLaravel('events');
const { getImageUrl } = useImageUrl();

const eventsWithImages = computed(() => {
  return eventsData.value?.data?.map(event => ({
    ...event,
    image: getImageUrl(event.image || event.image_url, '/placeholder-event.jpg'),
    title: event.title,
    short_description: event.short_description || event.description,
    slug: event.slug || event.id
  })) || [];
});

// SEO Meta Tags
usePageSeo({
  title: 'Wellness Events & Workshops - Join Our Community',
  description: 'Join our Ayurvedic wellness events, workshops, and seminars. Learn from experts, connect with like-minded individuals, and deepen your wellness journey.',
  keywords: 'ayurveda events, wellness workshops, ayurvedic seminars, health events, yoga workshops, meditation retreats',
  path: '/events',
});
</script>


<style scoped>
</style>



