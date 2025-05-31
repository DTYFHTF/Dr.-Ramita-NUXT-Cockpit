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
      <button class="btn btn-smooth-primary mt-4 px-5 py-3" @click="retryFetch">
        <LucideIcon icon="mdi:refresh" class="me-2" />Retry
      </button>
    </div>

    <!-- Remedy Content -->
    <article v-if="remedy" class="remedy-container">
      <!-- Enhanced Header Section -->
      <header class="remedy-header mb-7">
        <div class="container">
          <div class="header-content max-w-800 mx-auto py-6">
            <h1 class="remedy-title display-4 fw-bold mb-4">
              {{ remedy.diseaseName }}
            </h1>
            <p class="remedy-description lead fs-3 text-muted mb-5">
              <DynamicContent :content="remedy.diseaseDescription || ''" />
            </p>
          </div>
        </div>
      </header>

      <!-- Enhanced Cover Image -->
      <div v-if="remedy.image" class="remedy-image mb-7">
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

            <!-- Similar Reads Column -->
            <div class="col-lg-4">
              <SimilarReads :posts="latestPosts" />
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="container">
        <!-- Enhanced Everyday Home Remedies Section -->
        <ListSection
          :title="'Everyday Home Remedies'"
          :subtitle="'Nourish your body with natural ingredients'"
          :items="remedy.generalRemedies"
        />

        <!-- Enhanced Spice & Food Therapy -->
        <ListSection
          :title="'Spice & Food Therapy'"
          :subtitle="'Nourish your body with natural ingredients'"
          :items="remedy.spiceAndFoodTherapy"
        />

        <!-- Enhanced Associated Dosha Tag -->
        <section v-if="remedy.associatedDoshaTag" class="associated-dosha mb-7">
          <div class="section-header mb-6">
            <h2 class="section-title">Associated Dosha</h2>
            <p class="section-subtitle text-muted fs-5">
              Balancing your dosha for harmony
            </p>
          </div>
          <p class="text-muted fs-5">{{ remedy.associatedDoshaTag }}</p>
        </section>

        <!-- Enhanced Pranayama Section -->
        <section v-if="remedy.pranayama.length" class="pranayama mb-7">
          <div class="section-header mb-6">
            <h2 class="section-title">Pranayama</h2>
            <p class="section-subtitle text-muted fs-5">
              Breathing techniques for vitality
            </p>
          </div>
          <ul class="list-unstyled">
            <li
              v-for="(item, index) in remedy.pranayama"
              :key="index"
              class="fs-5 lh-lg mb-2"
            >
              <DynamicContent :content="item" />
            </li>
          </ul>
        </section>

        <!-- Enhanced Asanas Section -->
        <section v-if="remedy.asanas.length" class="asanas mb-7">
          <div class="section-header mb-6">
            <h2 class="section-title">Asanas</h2>
            <p class="section-subtitle text-muted fs-5">
              Yoga poses for physical and mental balance
            </p>
          </div>
          <ul class="list-unstyled">
            <li
              v-for="(item, index) in remedy.asanas"
              :key="index"
              class="fs-5 lh-lg mb-2"
            >
              <DynamicContent :content="item" />
            </li>
          </ul>
        </section>

        <!-- Enhanced Mudras Section -->
        <section v-if="remedy.mudras.length" class="mudras mb-7">
          <div class="section-header mb-6">
            <h2 class="section-title">Mudras</h2>
            <p class="section-subtitle text-muted fs-5">
              Hand gestures for energy flow
            </p>
          </div>
          <ul class="list-unstyled">
            <li
              v-for="(item, index) in remedy.mudras"
              :key="index"
              class="fs-5 lh-lg mb-2"
            >
              <DynamicContent :content="item" />
            </li>
          </ul>
        </section>

        <!-- Enhanced Bandhas Section -->
        <section v-if="remedy.bandhas.length" class="bandhas mb-7">
          <div class="section-header mb-6">
            <h2 class="section-title">Bandhas</h2>
            <p class="section-subtitle text-muted fs-5">
              Energy locks for inner strength
            </p>
          </div>
          <ul class="list-unstyled">
            <li
              v-for="(item, index) in remedy.bandhas"
              :key="index"
              class="fs-5 lh-lg mb-2"
            >
              <DynamicContent :content="item" />
            </li>
          </ul>
        </section>

        <!-- Enhanced Kriyas Section -->

        <ListSection
          :title="'Kriyas'"
          :subtitle="'Cleansing techniques for purification'"
          :items="remedy.kriyas"
        />

        <!-- Enhanced Energy Management System -->
        <section
          v-if="remedy.energyManagementSystem.length"
          class="energy-management mb-7"
        >
          <div class="section-header mb-6">
            <h2 class="section-title">Energy Management System</h2>
            <p class="section-subtitle text-muted fs-5">
              Techniques to balance your energy
            </p>
          </div>
          <ul class="list-unstyled">
            <li
              v-for="(item, index) in remedy.energyManagementSystem"
              :key="index"
              class="fs-5 lh-lg mb-2"
            >
              <DynamicContent :content="item" />
            </li>
          </ul>
        </section>

        <!-- Enhanced Dhyana / Meditation -->
        <section v-if="remedy.dhyanaMeditation" class="dhyana-meditation mb-7">
          <div class="section-header mb-6">
            <h2 class="section-title">Dhyana / Meditation</h2>
            <p class="section-subtitle text-muted fs-5">
              Practices for mental clarity and peace
            </p>
          </div>
          <p class="text-muted fs-5">
            <DynamicContent :content="remedy.dhyanaMeditation " />
          </p>
        </section>

        <!-- Enhanced Color Therapy -->
        <section v-if="remedy.colorTherapy" class="color-therapy mb-7">
          <div class="section-header mb-6">
            <h2 class="section-title">Color Therapy</h2>
            <p class="section-subtitle text-muted fs-5">
              Healing through colors
            </p>
          </div>
          <p class="text-muted fs-5">
                        <DynamicContent :content="remedy.colorTherapy " />

          </p>
        </section>

        <!-- Enhanced Notes Section -->
        <section v-if="remedy.notes" class="notes mb-7">
          <div class="section-header mb-6">
            <h2 class="section-title">Notes</h2>
          </div>
          <p class="text-muted fs-5">
            <DynamicContent :content="remedy.notes " />
          </p>
        </section>
      </div>
    </article>
  </div>
</template>

<script setup>
import LucideIcon from "@/components/LucideIcon.vue";
import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useApi } from "@/composables/useApi";
import { sanitizedDescription } from '@/composables/sanitizeUtils';
import DynamicContent from "@/components/DynamicContent.vue";



const route = useRoute();
const remedy = ref(null);
const error = ref(null);

const {
  data,
  error: apiError,
  loading,
  refetch,
} = useApi(`items/homeRemedies?filter={"slug":"${route.params.slug}"}`);

const retryFetch = async () => {
  error.value = null;
  await refetch();
};

watchEffect(() => {
  try {
    if (data.value?.[0]) {
      remedy.value = mapRemedyData(data.value[0]);
    } else if (data.value === null) {
      error.value = new Error("Content not found");
    }
    error.value = apiError.value;
  } catch (e) {
    error.value = e;
  }
});

function mapRemedyData(data) {
  return {
    ...data,
    imageUrl: data.image?._id
      ? `http://localhost:9000/assets/link/${data.image._id}`
      : "/placeholder-remedy.jpg",
    homeRemedies: data.homeRemedies || [],
    notes: data.notes || "",
    associatedDosha: data.associatedDosha || "",
    spiceAndFoodTherapy: data.spicesandFoodTherapy || [],
    pranayama: data.pranayama || [],
    asanas: data.asana || [],
    mudras: data.mudra || [],
    bandhas: data.bandha || [],
    kriyas: data.kriya || [],
    energyManagementSystem: data.ems || [],
    dhyanaMeditation: data.meditation || "",
    colorTherapy: data.colorTherapy || "",
    generalRemedies: data.generalRemedies || [],
  };
}

// Fetch similar posts
const { posts: latestPosts } = useSimilarPosts('items/homeRemedies', {
  count: 4,
  fallbackImage: '/fallback-remedy.jpg',
  basePath: '/homeremedy'
});


</script>

<style scoped lang="scss">
@use "sass:color";

.remedy-header {
  background-color: $accent-soft-green;
  margin-top: 2rem;

  @media (max-width: 768px) {
    margin-top: 1rem;
  }
}

.container {
  margin-bottom: 2rem;
}
</style>
