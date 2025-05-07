<template>
  <div class="container">
    <h1 class="text-center my-4">All Courses</h1>
    <div v-if="coursesWithImages.length === 0" class="text-center text-muted">
      <p>No courses available at the moment. Please check back later!</p>
    </div>
    <div v-else class="row">
      <div 
        class="col-md-4 mb-4" 
        v-for="course in coursesWithImages" 
        :key="course.id">
        <CourseCard 
          :slug="course.slug" 
          :title="course.title" 
          :description="course.description" 
          :duration="course.duration"
          :link="course.link" 
          :image="course.image" 
          :price="course.price"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import CourseCard from '@/components/CourseCard.vue';
import { useApi } from '@/composables/useApi';
import { computed } from 'vue';

const { data: courses } = useApi('items/courses');

const coursesWithImages = computed(() => {
  return courses.value?.map(course => {
    const imageId = course.image?._id;
    const fullImageUrl = imageId ? `http://localhost:9000/assets/link/${imageId}` : '';
    return { ...course, image: fullImageUrl };
  }) || [];
});
</script>

<style>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.row {
  display: flex;
  flex-wrap: wrap;
}

.text-muted {
  color: var(--text-medium-gray);
}
</style>