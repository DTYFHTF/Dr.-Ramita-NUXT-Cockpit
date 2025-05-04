<template>
  <div class="container">
    <!-- Loading State -->
    <div v-if="!course && !error" class="loading-state">
      <div class="spinner-grow text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-muted">Loading course details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="alert alert-danger">
        <LucideIcon icon="mdi:alert-triangle" class="me-2" />
        <strong>Error:</strong> {{ error.message || 'Failed to load course details' }}
      </div>
      <button class="btn btn-primary" @click="retryFetch">
        <LucideIcon icon="mdi:refresh" class="me-2" />Try Again
      </button>
    </div>

    <!-- Course Content -->
    <article v-else class="course-article">
      <!-- Header Section -->
      <header class="course-header">
        <h1 class="course-title">{{ course.title }}</h1>
        <p class="course-description">{{ course.shortDescription }}</p>
        <div class="course-meta">
          <div class="meta-item">
            <LucideIcon icon="mdi:account" class="me-2" /> Skill level: {{ course.skills.level[0][0] }}
            
          </div>
          <div class="meta-item">
            <LucideIcon icon="mdi:clock" class="me-2" /> Time to complete: {{ course.duration || 'Approx. 20 hours' }}
          </div>
          <div class="meta-item">
            <LucideIcon icon="mdi:certificate" class="me-2" />
            Certificate: {{ course.certification ? 'Available' : 'Not available' }}
          </div>
        </div>
        <img 
          :src="course.imageUrl" 
          :alt="`Cover image for ${course.title}`" 
          class="course-cover"
          loading="lazy"
        />
      </header>

      <!-- About Section -->
      <section class="about-section">
        <h2>About this course</h2>
        <p v-html="renderMarkdown(course.description)"></p>
      </section>

      <!-- Skills Section -->
      <section class="common-list-section">
        <h2>Skills you'll gain</h2>
        <ul class="common-list">
          <li v-for="skill in course.skills.skill" :key="skill" class="common-list-item">
            <LucideIcon icon="mdi:check-circle" class="common-checkmark-icon" />
            <span class="skill-name">{{ skill }}</span>
          </li>
        </ul>
        
      </section>

      <!-- What you'll learn Section -->
      <section class="common-list-section">
        <h2>What you'll learn</h2>
        <ul class="common-list">
          <li v-for="item in course.learningOutcomes" :key="item" class="common-list-item">
            <LucideIcon icon="mdi:check-circle" class="common-checkmark-icon" />
            <span class="learning-text">{{ item }}</span>
          </li>
        </ul>
      </section>

      <!-- Instructor Card -->
      <h2 class="instructor-heading">Course Instructor</h2> 
      <div class="instructor-card" v-if="course.instructor">
        
        <img 
          :src="course.instructorImageUrl"
          :alt="`Instructor ${course.instructor.name}`" 
          class="instructor-avatar"
          loading="lazy"
        />
        <div class="instructor-details">
          <h3 class="instructor-name">{{ course.instructor.name }}</h3>
          <p class="instructor-title text-muted">
            <LucideIcon icon="mdi:account" class="me-2" />{{ course.instructor.position }}
          </p>
        </div>
      </div>

      <!-- Call to Action -->
      <footer class="cta-footer">
        <div class="cta-card">
          <a 
            :href="course.external_link" 
            class="btn btn-primary btn-lg enroll-btn"
            target="_blank"
            rel="noopener"
          >
            {{ course.price === 0 ? 'Get instant access for Free' : `Get Instant access for ₹${course.price}` }}
          </a>
        </div>
      </footer>
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

// Fetch course data using useApi composable
const { data, error: apiError, refetch } = useApi(`item/courses/${route.params.id}`);

// Markdown rendering utility
const renderMarkdown = (content) => (content ? marked.parse(content) : '');

// Retry fetch logic
const retryFetch = async () => {
  error.value = null;
  await refetch();
};

// Watch for data changes and update course details
watchEffect(() => {
  if (data.value) {
    course.value = {
      ...data.value,
      imageUrl: data.value.image?._id
        ? `http://localhost:9000/assets/link/${data.value.image._id}`
        : '/placeholder-course.jpg',
      instructorImageUrl: data.value.instructor?.image?._id
        ? `http://localhost:9000/assets/link/${data.value.instructor.image._id}`
        : '/placeholder-course.jpg',
    };
  }
  error.value = apiError.value;
});

// Compute the last skill level for display
const lastSkillLevel = computed(() => {
  const levels = course.value?.skills?.level?.[0] || [];
  return levels[levels.length - 1] || null;
});
</script>

<style scoped>
/* General container styling */
.container {
  max-width: 800px;
  padding: 2rem 1rem;
}

/* Loading state styling */
.loading-state {
  min-height: 50vh;
  display: grid;
  place-items: center;
  text-align: center;
}

/* Course header styling */
.course-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.course-title {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-deep-green);
}

.course-description {
  font-size: 1.125rem;
  color: var(--text-medium-gray);
  margin-bottom: 1.5rem;
}

.course-meta {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: var(--text-medium-gray);
}

.course-cover {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 12px;
  margin-top: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Instructor card styling */
.instructor-card {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  background: var(--background-very-light-gray);
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 0.5rem;
}

.instructor-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.instructor-name {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

/* CTA footer styling */
.cta-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--background-muted-green-gray);
  text-align: center;
}

.cta-card {
  display: inline-block;
  background: var(--primary-blue);
  border-radius: 50px;
  padding: 0.75rem 1.5rem;
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.enroll-btn {
  display: inline-block;
  color: var(--text-deep-green);
  text-decoration: none;
  background-color: white;
  border: 2px solid var(--text-deep-green);
  border-radius: 50px;
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.enroll-btn:hover {
  background-color: var(--accent-soft-green);
  transform: translateY(-2px);
}

/* Common list section styling */
.common-list-section {
  margin-top: 2rem;
}

.common-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.common-list-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.common-checkmark-icon {
  color: var(--accent-soft-green);
}
</style>