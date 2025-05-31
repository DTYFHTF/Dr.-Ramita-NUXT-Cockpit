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
import { ref, computed, watchEffect } from 'vue';

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

const courses = ref([]);
const coursesLoading = ref(true);
const coursesError = ref(null);

async function fetchCourses() {
  coursesLoading.value = true;
  coursesError.value = null;
  try {
    const res = await fetch(`${apiBase}/courses`);
    if (!res.ok) throw new Error('Failed to fetch courses');
    const data = await res.json();
    // Support both array and object with data property
    const courseArray = Array.isArray(data) ? data : data.data;
    courses.value = (courseArray || []).filter(c => c.published);
  } catch (e) {
    coursesError.value = e;
  } finally {
    coursesLoading.value = false;
  }
}

const coursesWithImages = computed(() => {
  const getImageUrl = (img) => {
    if (!img) return '/placeholder-course.jpg';
    if (img.startsWith('http')) return img;
    if (img.startsWith('/')) return img;
    return `/storage/${img}`;
  };
  return courses.value.map(course => ({
    ...course,
    image: getImageUrl(course.image),
    price: course.price ? course.price : 0,
    duration: course.duration || 'Approx. 20 hours',
    lessons: course.lessons || 0,
  }));
});

watchEffect(() => {
  fetchCourses();
});
</script>
