<template>
  <Card
    :title="diseaseName"
    :description="stripHtmlTags(truncatedDescription)"
    :image="image || '/placeholder-remedy.jpg'"
    :imageAlt="diseaseName"
    :badge="associatedDosha || 'Uncategorized'"
    :link="slug ? `/homeremedy/${slug}` : null"
    customClass="home-remedy-card"
  >
    <template #button>
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
    </template>
  </Card>
</template>

<script setup>
import Card from './Card.vue';
import LucideIcon from '@/components/LucideIcon.vue';
import { computed } from 'vue';
import { stripHtmlTags } from '@/composables/sanitizeUtils'; 

const props = defineProps({
  diseaseName: String,
  diseaseDescription: String,
  image: String, // Renamed from diseaseImage to image
  slug: String,
  associatedDosha: String,
});



const truncatedDescription = computed(() => {
  const maxLength = 100; // Set a fixed length for the description
  const plainText = props.diseaseDescription || '';
  return plainText.length > maxLength
    ? plainText.slice(0, maxLength) + '...'
    : plainText;
});
</script>

<style scoped>
.home-remedy-card {
  margin-bottom: 1.5rem; /* Example spacing */
}
</style>