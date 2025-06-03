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
          <h2 class="section-title mb-4">About This Course</h2>
          <div class="section-content">
            <DynamicContent :content="course.description" />
             <!-- <span>{{ course.description }}</span> -->

          </div>
        </section>

        <!-- Skills & Learning Sections -->
        <div class="row g-4">
          <div class="col-md-6">
            <section class="course-section">
              <h2 class="section-title mb-4">Skills You'll Gain</h2>
              <ul class="course-list">
                <li
                  v-for="skill in course.skills?.skill || []"
                  :key="skill"
                  class="course-list-item"
                >
                  <LucideIcon
                    icon="mdi:check-circle"
                    class="text-success me-2"
                  />

                  <DynamicContent :content="skill" />
                                <!-- <span>{{ skill }}</span> -->

                </li>
              </ul>
            </section>
          </div>

          <div class="col-md-6">
            <section class="course-section">
              <h2 class="section-title mb-4">What You'll Learn</h2>
              <ul class="course-list">
                <li
                  v-for="item in course.learningOutcomes"
                  :key="item"
                  class="course-list-item"
                >
                  <LucideIcon
                    icon="mdi:check-circle"
                    class="text-success me-2"
                  />
                  <DynamicContent :content="item" />
                   <!-- <span>{{item}}</span> -->
                </li>
              </ul>
            </section>
          </div>
        </div>

        <!-- Instructor Section -->
        <section class="course-section mt-5">
          <h2 class="section-title mb-4">Course Instructor</h2>
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
            <a
              :href="course.external_link"
              class="btn-smooth-primary"
              target="_blank"
              rel="noopener"
            >
              {{
                course.price === 0
                  ? "Enroll for Free"
                  : `Enroll Now - ₹${course.price}`
              }}
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
import LucideIcon from "@/components/LucideIcon.vue";
import DynamicContent from "@/components/DynamicContent.vue";
import { ref, computed, watchEffect } from "vue";
import { marked } from "marked";
import { useRoute } from "vue-router";

// Initialize route and reactive variables
const route = useRoute();
const course = ref(null);
const error = ref(null);
const isLoading = ref(true);
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

// Fetch course data from Laravel API
async function fetchCourse() {
  isLoading.value = true;
  error.value = null;
  try {
    const res = await fetch(`${apiBase}/courses/${route.params.slug}`);
    if (!res.ok) throw new Error("Failed to fetch course");
    const data = await res.json();
    // Comment out the published check for development or preview
    // if (!data.published) throw new Error("Course not published");
    course.value = mapCourseData(data.data); // <-- Fix: use data.data
  } catch (e) {
    error.value = e;
  } finally {
    isLoading.value = false;
  }
}

// Helper function to map API response property names to component property names
function mapCourseData(data) {
  if (!data) return null;
  // Support both full URLs and relative paths for image fields
  const getImageUrl = (img) => {
    if (!img) return "/placeholder-course.jpg";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/")) return img;
    return `${config.public.baseUrl}/storage/${img}`;
  };
  return {
    ...data,
    duration: data.duration || "Approx. 20 hours",
    skills: data.skills || [],
    learningOutcomes: data.learning_outcomes || [],
    certification: data.certification || false,
    imageUrl: getImageUrl(data.image),
    instructorImageUrl: getImageUrl(data.instructor?.image),
    instructor: data.instructor || null,
    videoType: data.video_type,
    videoUrl: data.video_url ? getImageUrl(data.video_url) : null,
    coursePreviewUrl: data.course_preview_url || null,
    external_link: data.external_link || null,
  };
}

// Retry fetch logic
const retryFetch = async () => {
  await fetchCourse();
};

// Fetch course on mount and when slug changes
watchEffect(() => {
  fetchCourse();
});

// Markdown rendering utility
const renderMarkdown = (content) => (content ? marked.parse(content) : "");

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
