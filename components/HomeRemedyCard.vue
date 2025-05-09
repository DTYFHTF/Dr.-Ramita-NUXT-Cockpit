<template>
  <div class="home-remedy-card">
    <div class="card-header">
      <span class="category-tag">{{ associatedDosha || 'Uncategorized' }}</span>
      <img 
        :src="image || '/placeholder-remedy.jpg'" 
        :alt="diseaseName"
        class="remedy-image"
      />
    </div>

    <div class="card-content">
      <div class="text-content">
        <h3 class="title">{{ diseaseName }}</h3>
        <p class="description">{{ truncatedDescription }}</p>
      </div>

      <NuxtLink 
        v-if="slug"
        :to="`/homeremedy/${slug}`"
        class="btn-smooth-success mt-auto w-100"
      >
        Explore Remedy
        <LucideIcon icon="mdi:arrow-right" color="white" class="btn-icon" />
      </NuxtLink>
      <div v-else class="btn-smooth disabled mt-auto w-100">
        Remedy Link Unavailable
      </div>
    </div>
  </div>
</template>

<script setup>
import LucideIcon from '@/components/LucideIcon.vue';
import { computed } from 'vue';

function stripHtmlTags(html) {
  if (typeof window !== 'undefined') {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
  return html; // Return the original string if executed on the server
}

const props = defineProps({
  diseaseName: String,
  diseaseDescription: String,
  image: String, // Renamed from diseaseImage to image
  slug: String,
  associatedDosha: String,
});

const truncatedDescription = computed(() => {
  const maxLength = 100; // Set a fixed length for the description
  const plainText = stripHtmlTags(props.diseaseDescription || '');
  return plainText.length > maxLength
    ? plainText.slice(0, maxLength) + '...'
    : plainText;
});
</script>

<style scoped>
.home-remedy-card {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.home-remedy-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.card-header {
  position: relative;
}

.remedy-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background-color: #f0f0f0; /* Add a fallback background color */
}

.card-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.description {
  font-size: 1rem;
  color: var(--text-medium-gray);
  margin-bottom: 1rem;
}

.btn-smooth-success {
  margin-top: auto;
}
</style>