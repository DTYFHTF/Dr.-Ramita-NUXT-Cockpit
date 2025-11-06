<template>
  <div class="my-courses-section">
    <h2 class="section-title">My Courses</h2>
    
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading courses...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      <LucideIcon name="AlertCircle" :size="20" class="me-2" />
      {{ error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="!courses || courses.length === 0" class="empty-state">
      <div class="empty-icon">
        <LucideIcon name="GraduationCap" :size="64" />
      </div>
      <h3>No Enrolled Courses Yet</h3>
      <p>Start your Ayurveda learning journey today</p>
      <NuxtLink to="/courses" class="btn btn-smooth-success btn-lg">
        <LucideIcon icon="mdi:clipboard-text-search-outline" :size="20" class="me-2" />
        Browse Courses
      </NuxtLink>
    </div>

    <!-- Courses Grid -->
    <div v-else class="courses-grid">
      <div v-for="course in courses" :key="course.id" class="course-wrapper">
        <CourseCard
          :title="course.title"
          :description="course.description"
          :image="course.image"
          :price="course.price"
          :duration="course.duration"
          :level="course.level"
          :slug="course.slug"
          :button-text="'Continue Learning'"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

interface Course {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string;
  price: number;
  duration: string;
  level: string;
  enrolled_at: string;
  status: string;
}

const userStore = useUserStore();
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;
const courses = ref<Course[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchCourses = async () => {
  try {
    loading.value = true;
    error.value = null;

    const result = await $fetch<{ success: boolean; data: Course[] }>(`${apiBase}/user/courses`, {
      headers: { 
        Authorization: `Bearer ${userStore.token}`,
        Accept: 'application/json'
      }
    });

    if (result?.success) {
      courses.value = result.data;
    }
  } catch (err: any) {
    error.value = err?.data?.message || err?.message || 'Unable to load your courses';
    console.error('Error fetching courses:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCourses();
});
</script>

<style scoped lang="scss">
.my-courses-section {
  .section-title {
    font-size: 1.75rem;
    font-weight: 600;
color: var(--text-primary);
    margin-bottom: 1.5rem;
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    
    .empty-icon {
      color: var(--text-muted);
      margin-bottom: 1.5rem;
    }

    h3 {
      font-size: 1.5rem;
      font-weight: 600;
color: var(--text-primary);      margin-bottom: 0.5rem;
    }

    p {
      color: var(--text-secondary);
      font-size: 1.125rem;
      margin-bottom: 2rem;
    }
  }

  .courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  .course-wrapper {
    position: relative;
  }
}
</style>
