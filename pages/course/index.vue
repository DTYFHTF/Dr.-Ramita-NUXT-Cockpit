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
import { useApi } from '@/composables/useApi';
import CourseCard from "~/components/CourseCard.vue";
import { computed } from 'vue';

// Destructure loading and error from useApi
const { data: rawCourses, error, loading } = useApi("items/courses");

// Enhanced computed property with error handling
const coursesWithImages = computed(() => {
  try {
    return rawCourses.value?.map(course => {
      if (!course) return null;
      
      return {
        ...course,
        image: course.image?._id 
          ? `http://localhost:9000/assets/link/${course.image._id}`
          : "/placeholder-course.jpg",
        price: course.price ? `${course.price}` : 'Free'
      };
    }).filter(course => course !== null) || [];
  } catch (e) {
    console.error("Error processing course data:", e);
    return [];
  }
});

// Optional debugging
watchEffect(() => {
  console.log("Course data:", rawCourses.value);
});
</script>
