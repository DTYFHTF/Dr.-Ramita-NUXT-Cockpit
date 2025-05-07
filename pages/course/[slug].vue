<template>
  <div class="course-detail">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state text-center py-5">
      <div class="spinner-grow text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-muted">Loading course details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state text-center py-5">
      <div class="alert alert-danger mx-auto" style="max-width: 500px">
        <LucideIcon icon="mdi:alert-triangle" class="me-2" />
        <strong>Error:</strong> {{ error.message || 'Failed to load course details' }}
      </div>
      <button class="btn btn-primary mt-3" @click="retryFetch">
        <LucideIcon icon="mdi:refresh" class="me-2" />Try Again
      </button>
    </div>

    <!-- Course Content -->
    <article v-else class="course-container">
      <!-- Header Section -->
      <header class="course-header text-center mb-5">
        <div class="course-badge mb-3">
          <span class="badge" :class="course.price === 0 ? 'bg-success' : 'bg-warning text-dark'">
            {{ course.price === 0 ? 'Free' : `₹${course.price}` }}
          </span>
        </div>
        <h1 class="course-title mb-3">{{ course.title }}</h1>
        <p class="course-description lead">{{ course.shortDescription }}</p>
        <div class="course-meta d-flex justify-content-center gap-4 flex-wrap mb-4">
          <div class="meta-item d-flex align-items-center">
            <LucideIcon icon="mdi:clock" class="me-2" />
            <span>{{ course.duration || 'Approx. 20 hours' }}</span>
          </div>
          <div class="meta-item d-flex align-items-center">
            <LucideIcon icon="mdi:certificate" class="me-2" />
            <span>{{ course.certification ? 'Certificate Available' : 'No Certificate' }}</span>
          </div>
        </div>
        <img 
          :src="course.imageUrl" 
          :alt="`Cover image for ${course.title}`" 
          class="course-cover img-fluid rounded-3 shadow-lg"
          loading="lazy"
        />
      </header>

      <!-- Main Content -->
      <div class="course-content">
        <!-- About Section -->
        <section class="course-section mb-5">
          <h2 class="section-title mb-4">About This Course</h2>
          <div class="section-content" v-html="renderMarkdown(course.description)"></div>
        </section>

        <!-- Skills & Learning Sections -->
        <div class="row g-4">
          <div class="col-md-6">
            <section class="course-section">
              <h2 class="section-title mb-4">Skills You'll Gain</h2>
              <ul class="course-list">
                <li v-for="skill in (course.skills?.skill || [])" :key="skill" class="course-list-item">
                  <LucideIcon icon="mdi:check-circle" class="text-success me-2" />
                  {{ skill }}
                </li>
              </ul>
            </section>
          </div>
          
          <div class="col-md-6">
            <section class="course-section">
              <h2 class="section-title mb-4">What You'll Learn</h2>
              <ul class="course-list">
                <li v-for="item in course.learningOutcomes" :key="item" class="course-list-item">
                  <LucideIcon icon="mdi:check-circle" class="text-success me-2" />
                  {{ item }}
                </li>
              </ul>
            </section>
          </div>
        </div>

        <!-- Instructor Section -->
        <section class="course-section mt-5">
          <h2 class="section-title mb-4">Course Instructor</h2>
          <div class="instructor-card card border-0 shadow-sm" v-if="course.instructor">
            <div class="card-body d-flex align-items-center gap-4">
              <img 
                :src="course.instructorImageUrl"
                :alt="`Instructor ${course.instructor.name}`" 
                class="instructor-avatar rounded-circle"
                width="100"
                height="100"
                loading="lazy"
              />
              <div>
                <h3 class="instructor-name mb-1">{{ course.instructor.name }}</h3>
                <p class="instructor-title text-muted mb-0">
                  <LucideIcon icon="mdi:account" class="me-2" />
                  {{ course.instructor.position }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <footer class="cta-section mt-5 pt-4 border-top">
          <div class="d-grid gap-2 mx-auto" style="max-width: 400px">
            <a 
              :href="course.external_link" 
              class="btn btn-lg btn-primary"
              target="_blank"
              rel="noopener"
            >
              {{ course.price === 0 ? 'Enroll for Free' : `Enroll Now - ₹${course.price}` }}
            </a>
            <p class="text-muted text-center small mt-2">
              <LucideIcon icon="mdi:lock" class="me-1" />
              Secure payment processing
            </p>
          </div>
        </footer>
      </div>
    </article>
  </div>
</template>

<script setup>
// Import necessary modules and components
import LucideIcon from '@/components/LucideIcon.vue';
import { ref, computed, watchEffect } from 'vue';
import { marked } from 'marked';
import { useRoute } from 'vue-router';
import { useApi } from '@/composables/useApi';

// Initialize route and reactive variables
const route = useRoute();
const course = ref(null);
const error = ref(null);
const isLoading = ref(true); // Add loading state

// Fetch course data using useApi composable
const { data, error: apiError, refetch } = useApi(`items/courses?filter={"slug":"${route.params.slug}"}`);

// Markdown rendering utility
const renderMarkdown = (content) => (content ? marked.parse(content) : '');

// Helper function to map API response property names to component property names
function mapCourseData(data) {
  if (!data) return null;

  return {
    ...data,
    // Map snake_case properties to camelCase
    duration: data.duration || 'Approx. 20 hours',
    skills: data.skills || { skill: [] },
    learningOutcomes: data.learningOutcomes || [],
    certification: data.certification || false,
    // Add imageUrl for displaying images
    imageUrl: data.image?._id
      ? `http://localhost:9000/assets/link/${data.image._id}`
      : '/placeholder-course.jpg',
    instructorImageUrl: data.instructor?.image?._id
      ? `http://localhost:9000/assets/link/${data.instructor.image._id}`
      : '/placeholder-course.jpg'
  };
}

// Retry fetch logic
const retryFetch = async () => {
  error.value = null;
  isLoading.value = true; // Set loading state
  await refetch();
  isLoading.value = false; // Clear loading state
};

// Watch for data changes and update course details
watchEffect(() => {
  try {
    isLoading.value = true; // Set loading state
    if (data.value && Array.isArray(data.value) && data.value.length > 0) {
      // Using the first item if the API returns an array of matching courses
      const courseData = data.value[0];
      course.value = mapCourseData(courseData);
      error.value = null; // Clear error since we have data
    } else if (data.value && typeof data.value === 'object' && data.value._id) {
      // Handle if API returns a single object instead of an array
      course.value = mapCourseData(data.value);
      error.value = null; // Clear error since we have data
    } else if (data.value === null || data.value === undefined) {
      error.value = new Error('No course found with this slug');
    }

    if (apiError.value) {
      error.value = apiError.value;
    }
  } catch (e) {
    error.value = e;
  } finally {
    isLoading.value = false; // Clear loading state
  }
});

// Compute the last skill level for display
const lastSkillLevel = computed(() => {
  const levels = course.value?.skills?.level?.[0] || [];
  return levels[levels.length - 1] || null;
});
</script>

<style lang="scss" scoped>
// @import '@/assets/scss/variables';

.course-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;

  .course-header {
    .course-badge {
      .badge {
        font-size: 1.1rem;
        padding: 0.5rem 1.25rem;
        border-radius: 2rem;
      }
    }

    .course-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: $text-deep-green;
      line-height: 1.2;
    }

    .course-description {
      font-size: 1.25rem;
      color: $text-medium-gray;
      max-width: 800px;
      margin: 0 auto;
    }

    .course-cover {
      max-height: 500px;
      object-fit: cover;
      margin-top: 2rem;
    }
  }

  .course-section {
    padding: 2rem;
    background: white;
    border-radius: 1rem;
    box-shadow: $card-shadow;

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: $text-deep-green;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid $accent-soft-green;
    }

    .course-list {
      list-style: none;
      padding: 0;
      margin: 0;

      &-item {
        padding: 0.75rem 0;
        display: flex;
        align-items: center;
        border-bottom: 1px solid $border-color;

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }

  .instructor-card {
    .instructor-avatar {
      object-fit: cover;
      border: 3px solid $accent-soft-green;
    }

    .instructor-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: $text-deep-green;
    }
  }

  .cta-section {
    .btn {
      padding: 1rem 2rem;
      border-radius: 2rem;
      font-weight: 600;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: $btn-hover-shadow;
      }
    }
  }

  @media (max-width: 768px) {
    .course-header {
      .course-title {
        font-size: 2rem;
      }

      .course-description {
        font-size: 1.1rem;
      }
    }

    .course-section {
      padding: 1.5rem;
    }
  }
}
</style>