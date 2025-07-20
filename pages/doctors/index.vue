<template>
  <div class="doctors-page">


    <!-- Main Content Section -->
    <section class="doctors-section bg-sandal-light" id="doctors">
      <div class="container">
        <h1 class="text-center">Our Expert Doctors</h1>
        <p class="sub-heading text-center">Connect with qualified Ayurvedic practitioners for personalized consultations</p>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-grow text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3 text-muted">Loading doctors...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-5">
          <div class="alert alert-danger mx-auto" style="max-width: 500px">
            <strong>Error:</strong> {{ error.message || 'Failed to load doctors' }}
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!doctors.length" class="text-center text-muted py-5">
          <p>No doctors available at the moment.</p>
        </div>

        <!-- Doctors Grid -->
        <div v-else class="row">
          <div
            v-for="doctor in doctors"
            :key="doctor.id"
            class="col-md-4 mb-4"
          >
            <DoctorCard :doctor="doctor" />
          </div>
        </div>
      </div>
    </section>

    <!-- Pagination removed -->
  </div>
</template>

<script setup lang="ts">
 import { useDoctorStore } from '@/stores/doctorStore';
 import type { Doctor } from '@/types/index';
definePageMeta({
  title: 'Our Doctors - Ayurveda Marketplace',
  description: 'Browse our expert Ayurvedic doctors and book consultations'
});

const doctorStore = useDoctorStore();
const loading = ref(true);
const error = ref<Error | null>(null);

const doctors = computed(() => doctorStore.doctors as Doctor[]);

onMounted(async () => {
  try {
    await doctorStore.fetchDoctors();
  } catch (err) {
    error.value = err as Error;
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.doctors-page {
  min-height: 100vh;
}


.doctors-section {
  padding: 5rem 0;
  margin-bottom: 2rem;
}

.sub-heading {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 3rem;
  text-align: center;
}

.spinner-grow {
  width: 3rem;
  height: 3rem;
}

.alert-danger {
  background-color: var(--background-light);
  border-color: var(--border-color);
  color: var(--text-error);
  padding: 1rem;
  border-radius: 0.25rem;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
