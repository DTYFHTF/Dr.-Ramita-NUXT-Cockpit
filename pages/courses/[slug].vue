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
      <button class="btn btn-smooth-success mt-3" @click="retryFetch">
        <LucideIcon icon="mdi:refresh" class="me-2" />Try Again
      </button>
    </div>

    <!-- Course Content -->
    <article v-else class="course-container">
      <!-- Header Section -->
      <header class="course-header text-center mb-5">
        <div class="course-badge mb-3">
          <span class="badge" :class="course.price === 0 ? 'bg-success' : 'bg-warning text-dark'">
            {{ course.price === 0 ? "Free" : `${course.price}` }}
          </span>
        </div>
        <h1 class="course-title mb-3">{{ course.title }}</h1>

        <div class="course-meta d-flex justify-content-center gap-4 flex-wrap mb-4">
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

        <!-- Course Features -->
        <div class="course-features d-flex justify-content-center gap-3 flex-wrap mb-4">
          <div class="feature-badge">
            <LucideIcon icon="mdi:infinity" class="me-2" />
            <span>Lifetime Access</span>
          </div>
          <div class="feature-badge">
            <LucideIcon icon="mdi:account-group" class="me-2" />
            <span>Community Support</span>
          </div>
          <div class="feature-badge">
            <LucideIcon icon="mdi:devices" class="me-2" />
            <span>Mobile & Desktop Friendly</span>
          </div>
        </div>
        <img :src="course.imageUrl" :alt="`Cover image for ${course.title}`"
          class="course-cover img-fluid rounded-3 shadow-lg" loading="lazy" />
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
                <li v-for="skill in course.skills" :key="skill" class="list-before">
                  <DynamicContent :content="skill" />
                </li>
              </ul>
            </section>
          </div>

          <div class="col-md-6">
            <section class="course-section">
              <h2 class="mb-4">What You'll Learn</h2>
              <ul class="course-list">
                <li v-for="item in course.learning_outcomes" :key="item" class="list-before">
                  <DynamicContent :content="item" />
                </li>
              </ul>
            </section>
          </div>
        </div>

        <!-- Instructor Section -->
        <section class="course-section mt-5">
          <h2 class="mb-4">Course Instructor</h2>
          <div class="instructor-card card border-0 shadow-sm" v-if="course.instructor">
            <div class="card-body d-flex align-items-center gap-4">
              <img :src="course.instructorImageUrl" :alt="`Instructor ${course.instructor.name}`"
                class="instructor-avatar rounded-circle" width="100" height="100" loading="lazy" />
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
          <!-- Show enrollment status if already enrolled -->
          <div v-if="isEnrolled" class="enrolled-status mx-auto" style="max-width: 400px">
            <div class="enrolled-badge">
              <LucideIcon icon="mdi:check-circle" :size="24" class="me-2" />
              <div>
                <div class="enrolled-title">Already Enrolled</div>
                <div class="enrolled-subtitle">
                  {{ enrollmentStatus === 'confirmed' ? 'Start learning now!' : 'Payment pending' }}
                </div>
              </div>
            </div>
            <NuxtLink to="/dashboard?tab=courses" class="btn btn-smooth-success w-100 mt-3">
              <LucideIcon icon="mdi:school" class="me-2" />
              Go to My Courses
            </NuxtLink>
          </div>
          
          <!-- Show enroll button if not enrolled -->
          <div v-else class="d-grid gap-2 mx-auto" style="max-width: 400px">
            <button class="btn-smooth-primary" @click="showEnrollModal = true" :disabled="checkingEnrollment">
              {{
                checkingEnrollment ? 'Checking...' :
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
              <CourseRegistrationForm 
                :course-slug="course.slug" 
                @enrollment-success="handleEnrollmentSuccess"
              />
            </div>
          </BaseModal>
          
          <!-- Success Modal -->
          <SuccessModal
            :show="enrollmentSuccess"
            type="enrollment"
            :message="successMessage"
            action-text="Start Learning"
            @close="handleSuccessModalClose"
          />
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
import { useUserStore } from '@/stores/user'
import { computed, ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import BaseModal from '@/components/BaseModal.vue';
import CourseRegistrationForm from '@/components/CourseRegistrationForm.vue';
import SuccessModal from '@/components/SuccessModal.vue';

const userStore = useUserStore()
const showEnrollModal = ref(false);
const enrollmentSuccess = ref(false);
const successMessage = ref('');
const isEnrolled = ref(false);
const enrollmentStatus = ref('');
const checkingEnrollment = ref(false);

// Handle successful enrollment
const handleEnrollmentSuccess = (response) => {
  showEnrollModal.value = false; // Close the enrollment modal
  enrollmentSuccess.value = true; // Show success modal
  successMessage.value = response?.message || 'Successfully enrolled!';
  // Recheck enrollment status
  checkEnrollmentStatus();
}

// Handle success modal close - redirect to dashboard
const handleSuccessModalClose = () => {
  enrollmentSuccess.value = false;
  navigateTo('/dashboard?tab=courses');
}

// Initialize route and reactive variables
const route = useRoute();
const slug = route.params.slug;
const { data: courseData, error, loading: isLoading } = useApiLaravel(`courses/${slug}`);
const { getImageUrl } = useImageUrl();

// Create computed course object that properly handles the image URL
const course = computed(() => {
  if (!courseData.value?.data) {
    return {
      title: '',
      price: 0,
      duration: '',
      certification: false,
      imageUrl: '/placeholder-course.jpg',
      description: '',
      skills: [],
      learning_outcomes: [],
      instructor: { name: '', position: '' },
      instructorImageUrl: '/placeholder-instructor.jpg',
      external_link: '',
      slug: ''
    };
  }

  const data = courseData.value.data;
  return {
    ...data,
    imageUrl: data.image ? getImageUrl(data.image, '/placeholder-course.jpg') : '/placeholder-course.jpg',
    instructorImageUrl: data.instructor?.image ? getImageUrl(data.instructor.image, '/placeholder-instructor.jpg') : '/placeholder-instructor.jpg'
  };
});

// Retry fetch logic
const retryFetch = () => {
  // Force refresh by navigating to same route
  window.location.reload();
};

// Check if user is enrolled in this course
const checkEnrollmentStatus = async () => {
  if (!userStore.token || !slug) {
    isEnrolled.value = false;
    return;
  }
  
  checkingEnrollment.value = true;
  try {
    const config = useRuntimeConfig();
    const baseUrl = config.public.apiBase;
    const response = await $fetch(`${baseUrl}/user/courses`, {
      headers: {
        'Authorization': `Bearer ${userStore.token}`,
        'Accept': 'application/json'
      }
    });
    
    
    if (response?.success && response?.data) {
      const enrollment = response.data.find(c => c.slug === slug);
      if (enrollment) {
        isEnrolled.value = true;
        enrollmentStatus.value = enrollment.status;
      } else {
        isEnrolled.value = false;
      }
    }
  } catch (e) {
    console.error('Failed to check enrollment status:', e);
    isEnrolled.value = false;
  } finally {
    checkingEnrollment.value = false;
  }
};

// Check enrollment on mount and when user logs in
onMounted(() => {
  if (userStore.token) {
    checkEnrollmentStatus();
  }
});

// Watch for user login/logout
watch(() => userStore.token, (newToken) => {
  if (newToken) {
    checkEnrollmentStatus();
  } else {
    isEnrolled.value = false;
  }
});

// Watch for course data to load
watch(() => courseData.value, (newData) => {
  if (newData && userStore.token) {
    checkEnrollmentStatus();
  }
});
</script>

<style lang="scss" scoped>
// @import '@/assets/scss/variables';

.course-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: var(--text-primary);

  .course-header {
    .course-badge {
      .badge {
        font-size: 1.1rem;
        padding: 0.5rem 1.25rem;
        border-radius: 2rem;
      }
    }

    .course-title {
      color: var(--text-primary);
    }

    .course-meta {
      .meta-item {
        color: var(--text-secondary);
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
    color: var(--text-primary);

    h2 {
      color: var(--text-primary);
    }

    .course-list {
      list-style: none;
      padding: 0;
      margin: 0;

      &-item {
        padding: 0.75rem 0;
        display: flex;
        align-items: center;
        border-bottom: 1px solid var(--border-color);
        color: var(--text-primary);

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }

  .instructor-card {
    background: var(--background-white);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    
    &.card {
      background: var(--background-white);
      border-color: var(--border-color);
    }
    
    .card-body {
      color: var(--text-primary);
    }
    
    .instructor-avatar {
      object-fit: cover;
      border: 3px solid var(--color-secondary);
    }

    .instructor-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-primary);
    }
    
    .instructor-title {
      color: var(--text-secondary) !important;
      
      &.text-muted {
        color: var(--text-secondary) !important;
      }
    }
  }

  .cta-section {
    border-top: 1px solid var(--border-color);
    
    .enrolled-status {
      text-align: center;
      
      .enrolled-badge {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 1.5rem;
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
        border: 2px solid var(--color-success);
        border-radius: 12px;
        
        .enrolled-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-success);
          margin-bottom: 0.25rem;
        }
        
        .enrolled-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
      }
    }
    
    .btn {
      padding: 1rem 2rem;
      border-radius: 2rem;
      font-weight: 600;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--btn-hover-shadow, 0 4px 15px rgba(135, 197, 164, 0.3));
      }
    }
    
    .text-muted {
      color: var(--text-secondary) !important;
    }
  }

  // Global dark mode overrides for this component
  .text-muted {
    color: var(--text-secondary) !important;
  }
  
  .text-center {
    color: inherit;
  }
  
  .alert {
    background: var(--background-white);
    border-color: var(--border-color);
    color: var(--text-primary);
  }
  
  .spinner-grow {
    color: var(--color-primary);
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
