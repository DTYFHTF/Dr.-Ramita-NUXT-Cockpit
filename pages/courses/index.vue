<template>
   <IndexSection
    section-id="courses"
    bg-class="bg-herbal-light"
    title="Our Courses"
    subtitle="Learn ancient wisdom and modern wellness practices"
    :items="coursesWithImages"
    :card-component="CourseCard"
    :loading="coursesLoading"
    :error="coursesError"
    loading-text="Loading courses..."
    error-text="Failed to load courses"
    empty-text="No courses available at the moment"
    :showViewMore="false"
  />
</template>

<script setup>
import CourseCard from "~/components/CourseCard.vue";
import { computed, watch, ref } from 'vue';
import { useApiLaravel } from '@/composables/useApi.js'
import { useImageUrl } from '@/composables/useImageUrl.js'

const { data: coursesData, error, loading } = useApiLaravel('courses');
const courses = ref([]);
const { getImageUrl } = useImageUrl();

const addImageUrl = (item, fallback = '/placeholder-course.jpg') => ({
  ...item,
  image: getImageUrl(item.image, fallback),
});

watch(coursesData, (val) => {
  if (!val || !val.data) return;
  courses.value = val.data.map(course => addImageUrl(course));
}, { immediate: true });

const coursesWithImages = computed(() => courses.value);
const coursesLoading = loading;
const coursesError = error;

// SEO Meta Tags
usePageSeo({
  title: 'Ayurveda Courses - Learn Ancient Wisdom',
  description: 'Explore comprehensive Ayurveda courses taught by expert practitioners. Learn ancient wisdom, holistic healing, wellness practices, and traditional medicine from certified instructors.',
  keywords: 'ayurveda courses, wellness education, ayurvedic training, holistic health courses, traditional medicine classes, online ayurveda learning',
  path: '/courses',
});
</script>
