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
        <strong>Error:</strong>
        {{ error.message || "Failed to load course details" }}
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
          <span
            class="badge"
            :class="course.price === 0 ? 'bg-success' : 'bg-warning text-dark'"
          >
            {{ course.price === 0 ? "Free" : `${course.price}` }}
          </span>
        </div>
        <h1 class="course-title mb-3">{{ course.title }}</h1>

        <div
          class="course-meta d-flex justify-content-center gap-4 flex-wrap mb-4"
        >
          <div class="meta-item d-flex align-items-center">
            <LucideIcon icon="mdi:clock" class="me-2" />
            <span>{{ course.duration || "Approx. 20 hours" }}</span>
          </div>
          <div class="meta-item d-flex align-items-center">
            <LucideIcon icon="mdi:certificate" class="me-2" />
            <span>{{
              course.certification ? "Certificate Available" : "No Certificate"
            }}</span>
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
          <h2 class="mb-4">About This Course</h2>
          <div class="section-content">
            <DynamicContent :content="course.description" />
          </div>
        </section>

        <!-- Skills & Learning Sections -->
        <div class="row g-4">
          <div class="col-md-6">
            <section class="course-section">
              <h2 class="mb-4">Skills You'll Gain</h2>
              <ul class="course-list">
                <li
                  v-for="skill in course.skills"
                  :key="skill"
                  class="list-before"
                >
                  <DynamicContent :content="skill" />
                </li>
              </ul>
            </section>
          </div>

          <div class="col-md-6">
            <section class="course-section">
              <h2 class="mb-4">What You'll Learn</h2>
              <ul class="course-list">
                <li
                  v-for="item in course.learning_outcomes"
                  :key="item"
                  class="list-before"
                >
                  <DynamicContent :content="item" />
                </li>
              </ul>
            </section>
          </div>
        </div>

        <!-- Instructor Section -->
        <section class="course-section mt-5">
          <h2 class="mb-4">Course Instructor</h2>
          <div
            class="instructor-card card border-0 shadow-sm"
            v-if="course.instructor"
          >
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
                <h3 class="instructor-name mb-1">
                  {{ course.instructor.name }}
                </h3>
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
            <button
              class="btn-smooth-primary"
              @click="showEnrollModal = true"
            >
              {{
                course.price === 0
                  ? "Enroll for Free"
                  : `Enroll Now - ₹${course.price}`
              }}
            </button>
            <p class="text-muted text-center small mt-2">
              <LucideIcon icon="mdi:lock" class="me-1" />
              Secure payment processing
            </p>
          </div>
          <BaseModal :show="showEnrollModal" @close="showEnrollModal = false">
            <div class="modal-narrow">
              <CourseRegistrationForm :course-slug="course.slug" />
            </div>
          </BaseModal>
        </footer>
      </div>
    </article>
  </div>
</template>

<script setup>
// Import necessary modules and components
import LucideIcon from "@/components/LucideIcon.vue";
import DynamicContent from "@/components/DynamicContent.vue";
import { useApiLaravel } from '@/composables/useApi.js'
import { useImageUrl } from '@/composables/useImageUrl.js'
import { ref, watch, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import BaseModal from '@/components/BaseModal.vue';
import CourseRegistrationForm from '@/components/CourseRegistrationForm.vue';
const showEnrollModal = ref(false);

// Initialize route and reactive variables
const route = useRoute();
const slug = route.params.slug;
const { data: courseData, error, loading } = useApiLaravel(`courses/${slug}`);
const course = ref({
  title: '',
  price: 0,
  duration: '',
  certification: false,
  imageUrl: '',
  description: '',
  skills: [],
  learningOutcomes: [],
  instructor: { name: '', position: '' },
  instructorImageUrl: '',
  external_link: ''
});
const { getImageUrl } = useImageUrl();

watch(courseData, (val) => {
  if (!val || !val.data) return;
  course.value = {
    ...val.data,
    imageUrl: val.data.image ? getImageUrl(val.data.image, '/placeholder-course.jpg') : undefined,
    instructorImageUrl: val.data.instructor?.image ? getImageUrl(val.data.instructor.image, '/placeholder-instructor.jpg') : undefined
  };
}, { immediate: true });

// Retry fetch logic
const retryFetch = async () => {
  await fetchCourse();
};

// Fetch course on mount and when slug changes
const fetchCourse = async () => {
  if (!slug) return;
  const { data, error } = await useApiLaravel(`courses/${slug}`);
  if (data?.value?.data) {
    course.value = {
      ...data.value.data,
      imageUrl: data.value.data.image ? getImageUrl(data.value.data.image, '/placeholder-course.jpg') : undefined
    };
  } else {
    console.error('Failed to fetch course:', error);
  }
};

watchEffect(() => {
  fetchCourse();
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

    .course-cover {
      max-height: 500px;
      object-fit: cover;
      margin-top: 2rem;
    }
  }

  .course-section {
    padding: 2rem;
    background: var(--background-white);
    border-radius: 1rem;
    box-shadow: var(--card-shadow);

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
      border: 3px solid $color-secondary;
    }

    .instructor-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: $color-primary;
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
    }
    .course-section {
      padding: 1.5rem;
    }
  }
}
</style>
