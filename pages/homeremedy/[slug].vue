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
              {{ remedy.diseaseName }} <!-- Mapped from API disease_name -->
            </h3>
            <p class="remedy-description lead fs-3 text-muted mb-5">
              <DynamicContent :content="remedy.diseaseDescription || ''" /> <!-- Mapped from API disease_description -->
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
          v-if="remedy.generalRemedies && remedy.generalRemedies.length"
          :title="'Everyday Home Remedies'"
          :subtitle="'Nourish your body with natural ingredients'"
          :items="remedy.generalRemedies"
        />

        <!-- Enhanced Spice & Food Therapy -->
        <ListSection
          v-if="remedy.spiceAndFoodTherapy && remedy.spiceAndFoodTherapy.length"
          :title="'Spice & Food Therapy'"
          :subtitle="'Nourish your body with natural ingredients'"
          :items="remedy.spiceAndFoodTherapy"
        />

        <!-- Enhanced Associated Dosha Tag -->
        <section v-if="remedy.associatedDoshaTag" class="associated-dosha mb-7">
          <div class="section-header mb-6">
            <h3 class="section-title">Associated Dosha</h3>
            <p class="section-subtitle text-muted fs-5">
              Balancing your dosha for harmony
            </p>
          </div>
          <p class="text-muted fs-5">{{ remedy.associatedDoshaTag }}</p> <!-- Mapped from API dosha (JSON array) -->
        </section>

        <!-- Enhanced Pranayama Section -->
        <section v-if="remedy.pranayama && remedy.pranayama.length" class="pranayama mb-7">
          <div class="section-header mb-6">
            <h3 class="section-title">Pranayama</h3>
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
        <section v-if="remedy.asanas && remedy.asanas.length" class="asanas mb-7">
          <div class="section-header mb-6">
            <h3 class="section-title">Asanas</h3>
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
        <section v-if="remedy.mudras && remedy.mudras.length" class="mudras mb-7">
          <div class="section-header mb-6">
            <h3 class="section-title">Mudras</h3>
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
        <section v-if="remedy.bandhas && remedy.bandhas.length" class="bandhas mb-7">
          <div class="section-header mb-6">
            <h3 class="section-title">Bandhas</h3>
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
          v-if="remedy.kriyas && remedy.kriyas.length"
          :title="'Kriyas'"
          :subtitle="'Cleansing techniques for purification'"
          :items="remedy.kriyas"
        />
        
        <!-- Enhanced Mindful Practices Section -->
        <section v-if="remedy.mindfulPractices && remedy.mindfulPractices.length" class="mindful-practices mb-7">
          <div class="section-header mb-6">
            <h3 class="section-title">Mindful Practices</h3>
            <p class="section-subtitle text-muted fs-5">
              Techniques for present moment awareness
            </p>
          </div>
          <ul class="list-unstyled">
            <li
              v-for="(item, index) in remedy.mindfulPractices"
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
            <h3 class="section-title">Dhyana / Meditation</h3>
            <p class="section-subtitle text-muted fs-5">
              Practices for mental clarity and peace
            </p>
          </div>
          <p class="text-muted fs-5">
            <DynamicContent :content="remedy.dhyanaMeditation" />
          </p>
        </section>

        <!-- Enhanced Color Therapy -->
        <section v-if="remedy.colorTherapy" class="color-therapy mb-7">
          <div class="section-header mb-6">
            <h3 class="section-title">Color Therapy</h3>
            <p class="section-subtitle text-muted fs-5">
              Healing through colors
            </p>
          </div>
          <p class="text-muted fs-5">
            <DynamicContent :content="remedy.colorTherapy" />
          </p>
        </section>

        <!-- Enhanced Energy Management System Section -->
        <section v-if="remedy.energyManagementSystem && remedy.energyManagementSystem.length" class="energy-management-system mb-7">
          <div class="section-header mb-6">
            <h3 class="section-title">Energy Management System</h3>
            <p class="section-subtitle text-muted fs-5">
              Techniques for managing and balancing your energy
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

        <!-- Enhanced Notes Section (Example: if you want to add a 'notes' field from API) -->
        <!-- <section v-if="remedy.notes" class="notes mb-7">
          <div class="section-header mb-6">
            <h3 class="section-title">Notes</h3>
          </div>
          <p class="text-muted fs-5">
            <DynamicContent :content="remedy.notes" />
          </p>
        </section> -->
      </div>
    </article>
  </div>
</template>

<script setup>
import LucideIcon from "@/components/LucideIcon.vue";
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import DynamicContent from "@/components/DynamicContent.vue";
// ListSection is likely auto-imported by Nuxt 3 or globally registered

const route = useRoute();
const config = useRuntimeConfig();
const remedy = ref(null);
const loading = ref(true);
const error = ref(null);
const latestPosts = ref([]); // For SimilarReads, temporarily commented out

// Helper function to safely parse JSON
function safeJsonParse(jsonString, defaultValue = []) {
  if (!jsonString) return defaultValue;
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : (typeof parsed === 'object' && parsed !== null ? [parsed] : defaultValue);
  } catch (e) {
    console.warn("Failed to parse JSON string:", jsonString, e);
    return defaultValue;
  }
}

// Helper function to split a string into a list, by sentences.
function splitStringBySentences(str) {
  if (!str || typeof str !== 'string') return [];
  // Split by common sentence endings. Filter out empty strings.
  return str.split(/[.\\!\\?](?=\\s+[A-Z]|$)/g).map(s => s.trim()).filter(s => s.length > 0);
}


function getImageUrl(imgPath) {
  if (!imgPath) return "/fallback.jpg"; // Ensure you have a fallback.jpg in your public folder
  if (imgPath.startsWith("http")) return imgPath;
  // Assuming config.public.baseUrl is your Laravel app's base URL (e.g., http://localhost:8000)
  // And images are served from Laravel's public/storage directory
  return `${config.public.baseUrl || config.public.apiBase.replace('/api', '')}/storage/${imgPath}`;
}

async function fetchRemedyDetails() {
  loading.value = true;
  error.value = null;
  remedy.value = null;
  const slug = route.params.slug;

  if (!slug) {
    error.value = { message: "No remedy slug provided." };
    loading.value = false;
    return;
  }

  try {
    const response = await fetch(`${config.public.apiBase}/home-remedies/${slug}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Remedy not found.');
      }
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    const apiResponse = await response.json();
    const rawData = apiResponse.data; // Assuming API returns { data: { ... } }

    if (!rawData) {
        throw new Error('Remedy data is missing in API response.');
    }

    // Transform data
    remedy.value = {
      id: rawData.id,
      title: rawData.title,
      diseaseName: rawData.disease_name,
      diseaseDescription: rawData.disease_description,
      imageUrl: getImageUrl(rawData.image),
      associatedDoshaTag: Array.isArray(rawData.dosha) ? rawData.dosha.join(', ') : '',
      generalRemedies: Array.isArray(rawData.general_remedies) ? rawData.general_remedies : [],
      spiceAndFoodTherapy: Array.isArray(rawData.spices_and_food_therapy) ? rawData.spices_and_food_therapy : [],
      pranayama: Array.isArray(rawData.pranayama) ? rawData.pranayama : [],
      asanas: Array.isArray(rawData.yoga_asanas) ? rawData.yoga_asanas : [],
      mudras: Array.isArray(rawData.mudra) ? rawData.mudra : [],
      bandhas: Array.isArray(rawData.bandha) ? rawData.bandha : [],
      kriyas: Array.isArray(rawData.kriya) ? rawData.kriya : [],
      mindfulPractices: Array.isArray(rawData.mindful_practices) ? rawData.mindful_practices : [],
      dhyanaMeditation: Array.isArray(rawData.meditation) ? rawData.meditation.join(', ') : '',
      colorTherapy: rawData.color_therapy,
      energyManagementSystem: Array.isArray(rawData.ems) ? rawData.ems : [],
    };

    // Fetch all remedies for SimilarReads (latestPosts)
    const allRemediesRes = await fetch(`${config.public.apiBase}/home-remedies`);
    if (allRemediesRes.ok) {
      const allRemediesData = await allRemediesRes.json();
      // Assuming API returns { data: [ ... ] }
      if (Array.isArray(allRemediesData.data)) {
        // Filter out the current remedy and pick the latest 4
        latestPosts.value = allRemediesData.data
          .filter(r => r.id !== rawData.id)
          .slice(0, 4)
          .map(post => ({
            ...post,
            imageUrl: getImageUrl(post.image)
          }));
      }
    }

  } catch (e) {
    console.error("Failed to fetch or process remedy details:", e);
    error.value = e;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchRemedyDetails();
});

watch(() => route.params.slug, (newSlug, oldSlug) => {
  if (newSlug && newSlug !== oldSlug) {
    fetchRemedyDetails();
  }
});

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
