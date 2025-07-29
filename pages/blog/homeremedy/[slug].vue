<template>
  <div class="remedy-detail">
    <!-- Enhanced Loading State -->
    <div v-if="loading && !remedy" class="loading-state text-center py-9">
      <div
        class="spinner-grow text-primary"
        style="width: 3rem; height: 3rem"
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-4 text-muted fs-5">Fetching your remedy...</p>
    </div>

    <!-- Enhanced Error State -->
    <div v-else-if="error && !remedy" class="error-state text-center py-9">
      <div
        class="alert alert-danger mx-auto p-4 shadow-sm"
        style="max-width: 500px"
      >
        <LucideIcon icon="mdi:alert-circle-outline" class="me-2 fs-4" />
        <strong class="fs-5">Error:</strong>
        <p class="mt-2 mb-0">
          {{ error.message || "Unable to fetch the remedy details." }}
        </p>
      </div>
      <button class="btn btn-smooth-primary mt-4 px-5 py-3" @click="fetchRemedyDetails">
        <LucideIcon icon="mdi:refresh" class="me-2" />Retry
      </button>
    </div>

    <!-- Remedy Content -->
    <article v-if="remedy" class="remedy-container">
      <!-- Enhanced Header Section -->
      <header class="remedy-header mb-7">
        <div class="container">
          <div class="header-content max-w-800 mx-auto py-6">
            <h3 class="remedy-title display-4 fw-bold mb-4">
              {{ remedy.disease_name }}
            </h3>
            <p class="remedy-description lead fs-3 text-muted mb-5">
              <DynamicContent :content="remedy.disease_description || ''" />
            </p>
          </div>
        </div>
      </header>

      <!-- Enhanced Cover Image -->
      <div v-if="remedy.imageUrl && remedy.imageUrl !== '/fallback.jpg'" class="remedy-image mb-7">
        <div class="container px-xxl-12">
          <div class="row">
            <!-- Cover Image Column -->
            <div class="col-lg-8">
              <img
                :src="remedy.imageUrl"
                :alt="remedy.diseaseName"
                class="img-fluid rounded-4 shadow-lg"
                loading="lazy"
                style="max-height: 600px; object-fit: cover"
              />
            </div>

            <!-- Similar Reads Column (Temporarily Commented Out) -->
            
            <div class="col-lg-4">
              <SimilarReads :posts="latestPosts" basePath="/homeremedy" />
            </div>
           
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="container">
        <!-- Enhanced Everyday Home Remedies Section -->
        <ListSection
          v-if="remedy.general_remedies && remedy.general_remedies.length"
          :title="'Everyday Home Remedies'"
          :subtitle="'Nourish your body with natural ingredients'"
          :items="remedy.general_remedies"
        />

        <!-- Enhanced Spice & Food Therapy -->
        <ListSection
          v-if="remedy.spices_and_food_therapy && remedy.spices_and_food_therapy.length"
          :title="'Spice & Food Therapy'"
          :subtitle="'Nourish your body with natural ingredients'"
          :items="remedy.spices_and_food_therapy"
        />

        <!-- Enhanced Associated Dosha Tag -->
        <section v-if="remedy.dosha && remedy.dosha.length" class="associated-dosha mb-7">
          <div class="section-header mb-6">
            <h3 class="section-title">Associated Dosha</h3>
            <p class="section-subtitle text-muted fs-5">
              Balancing your dosha for harmony
            </p>
          </div>
          <p class="text-muted fs-5">{{ remedy.dosha.join(', ') }}</p>
        </section>

        <!-- Replace repeated section code with TagListSection -->
        <TagListSection
          v-if="remedy.pranayama && remedy.pranayama.length"
          :title="'Pranayama'"
          :subtitle="'Breathing techniques for vitality'"
          :items="remedy.pranayama"
          section-class="pranayama mb-7"
        />

        <TagListSection
          v-if="remedy.yoga_asanas && remedy.yoga_asanas.length"
          :title="'Asanas'"
          :subtitle="'Yoga poses for physical and mental balance'"
          :items="remedy.yoga_asanas"
          section-class="asanas mb-7"
        />

        <TagListSection
          v-if="remedy.mudra && remedy.mudra.length"
          :title="'Mudras'"
          :subtitle="'Hand gestures for energy flow'"
          :items="remedy.mudra"
          section-class="mudras mb-7"
        />

        <TagListSection
          v-if="remedy.bandha && remedy.bandha.length"
          :title="'Bandhas'"
          :subtitle="'Energy locks for inner strength'"
          :items="remedy.bandha"
          section-class="bandhas mb-7"
        />

        <!-- Enhanced Kriyas Section -->
        <ListSection
          v-if="remedy.kriya && remedy.kriya.length"
          :title="'Kriyas'"
          :subtitle="'Cleansing techniques for purification'"
          :items="remedy.kriya"
        />
        
        <!-- Enhanced Mindful Practices Section -->
        <TagListSection
          v-if="remedy.mindful_practices && remedy.mindful_practices.length"
          :title="'Mindful Practices'"
          :subtitle="'Techniques for present moment awareness'"
          :items="remedy.mindful_practices"
          section-class="mindful-practices mb-7"
        />

        <!-- Enhanced Dhyana / Meditation -->
        <TagListSection
          v-if="remedy.meditation && remedy.meditation.length"
          :title="'Dhyana / Meditation'"
          :subtitle="'Practices for mental clarity and peace'"
          :items="[remedy.meditation.join(', ')]"
          section-class="dhyana-meditation mb-7"
        />

        <!-- Enhanced Color Therapy -->
        <TagListSection
          v-if="remedy.color_therapy"
          :title="'Color Therapy'"
          :subtitle="'Healing through colors'"
          :items="[remedy.color_therapy]"
          section-class="color-therapy mb-7"
        />

        <!-- Enhanced Energy Management System Section -->
        <TagListSection
          v-if="remedy.ems && remedy.ems.length"
          :title="'Energy Management System'"
          :subtitle="'Techniques for managing and balancing your energy'"
          :items="remedy.ems"
          section-class="energy-management-system mb-7"
        />
      </div>
    </article>
  </div>
</template>

<script setup>
import LucideIcon from "@/components/LucideIcon.vue";
import { useApiLaravel } from '@/composables/useApi.js'
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import useSimilarPosts from '@/composables/useSimilarPosts.js'
import { useImageUrl } from '@/composables/useImageUrl.js'

const route = useRoute();
const slug = route.params.slug;
const { data: remedyData, error, loading } = useApiLaravel(`home-remedies/${slug}`);
const { data: allRemediesData } = useApiLaravel('home-remedies');
const remedy = ref(null);
const latestPosts = ref([]);
const { getImageUrl } = useImageUrl();

watch(remedyData, (val) => {
  if (!val || !val.data) return;
  remedy.value = Object.assign({}, val.data, {
    imageUrl: val.data.image ? getImageUrl(val.data.image, '/fallback.jpg') : undefined
  });
  // Use useSimilarPosts after remedy is set
  const { posts } = useSimilarPosts('home-remedies', {
    excludeId: val.data.id,
    basePath: '/homeremedy',
    count: 4
  });
  latestPosts.value = posts.value;
}, { immediate: true });
</script>

<style scoped lang="scss">
@use "sass:color";

.remedy-header {
  // background-color: $accent-soft-green;
  margin-top: 2rem;

  @media (max-width: 768px) {
    margin-top: 1rem;
  }
}

.container {
  margin-bottom: 2rem;
}

/* Add any additional page-specific styles here */
.loading-state, .error-state {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
