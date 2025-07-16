<template>
  <div class="doctor-page">
    <!-- Loading State -->
    <div v-if="pending" class="loading-container">
      <div class="text-center py-5">
        <div class="spinner-border text-primary mb-3"></div>
        <p class="text-muted">Loading doctor information...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="container py-5">
        <div class="alert alert-danger text-center">
          <h4>Doctor Not Found</h4>
          <p>The doctor you're looking for doesn't exist or has been removed.</p>
          <NuxtLink to="/doctors" class="btn btn-primary">
            Browse All Doctors
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Doctor Profile -->
    <div v-else-if="doctor" class="doctor-profile">
      <!-- Main Content -->
      <section class="doctor-content">
        <div class="container">
          <div class="row">
            <!-- Left Column - Details -->
            <div class="col-lg-8">
              <!-- Doctor Header Section -->
              <div class="doctor-header">
                <div class="row align-items-center mb-4">
                  <div class="col-md-3">
                    <div class="doctor-avatar">
                      <img 
                        :src="doctorImage" 
                        :alt="doctor.name"
                        @error="handleImageError"
                      />
                    </div>
                  </div>
                  <div class="col-md-9">
                    <div class="doctor-info">
                      <h1 class="doctor-name">{{ doctor.name }}</h1>
                      <p v-if="doctor.specialization" class="doctor-specialization">
                        {{ doctor.specialization }}
                      </p>
                      <div class="doctor-rating" v-if="doctor.rating">
                        <div class="stars">
                          <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= Math.floor(doctor.rating) }">
                            ★
                          </span>
                        </div>
                        <span class="rating-text">{{ doctor.rating }}/5 ({{ doctor.reviews_count || 0 }} reviews)</span>
                      </div>
                      
                      <!-- Enhanced Meta Information -->
                      <div class="doctor-meta-cards">
                        <div v-if="doctor.experience_years" class="meta-card">
                          <div class="meta-icon">
                            <LucideIcon icon="mdi:school" />
                          </div>
                          <div class="meta-content">
                            <span class="meta-label">Experience</span>
                            <span class="meta-value">{{ doctor.experience_years }} years</span>
                          </div>
                        </div>
                        
                        <div v-if="doctor.contact" class="meta-card">
                          <div class="meta-icon">
                            <LucideIcon icon="mdi:phone" />
                          </div>
                          <div class="meta-content">
                            <span class="meta-label">Contact</span>
                            <span class="meta-value">{{ doctor.contact }}</span>
                          </div>
                        </div>
                        <div v-if="doctor.location" class="meta-card">
                          <div class="meta-icon">
                            <LucideIcon icon="mdi:map-marker" />
                          </div>
                          <div class="meta-content">
                            <span class="meta-label">Location</span>
                            <span class="meta-value">{{ doctor.location }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- About Section -->
              <div class="content-section">
                <h2>About Dr. {{ doctor.name }}</h2>
                <div class="about-content">
                  <p v-if="doctor.bio">{{ doctor.bio }}</p>
                  <p v-else>
                    Dr. {{ doctor.name }} is a certified {{ doctor.specialization || 'Ayurvedic' }} practitioner 
                    with {{ doctor.experience_years || 'several' }} years of experience in holistic healthcare.
                  </p>
                </div>
              </div>

              <!-- Qualifications -->
              <div v-if="doctor.qualifications" class="content-section">
                <h2>Qualifications</h2>
                <div class="qualifications-content">
                  <p>{{ doctor.qualifications }}</p>
                </div>
              </div>
              <div v-if="doctor.treatment_specialties && doctor.treatment_specialties.length" class="content-section">
                <h2>Treatment Specialties</h2>
                <div class="treatment-specialties-minimal">
                  <span 
                    v-for="specialty in doctor.treatment_specialties" 
                    :key="specialty.condition"
                    class="specialty-pill pill-badge"
                  >
                    {{ specialty.condition }}
                  </span>
                </div>
              </div>

              <!-- Awards -->
              <div v-if="doctor.awards && doctor.awards.length" class="content-section">
                <h2>Awards & Recognition</h2>
                <div class="awards-list">
                  <div 
                    v-for="award in doctor.awards" 
                    :key="award"
                    class="award-item"
                  >
                    <LucideIcon icon="mdi:trophy" />
                    <span>{{ award }}</span>
                  </div>
                </div>
              </div>

              <!-- Memberships -->
              <div v-if="doctor.memberships && doctor.memberships.length" class="content-section">
                <h2>Professional Memberships</h2>
                <div class="memberships-list">
                  <div 
                    v-for="membership in doctor.memberships" 
                    :key="membership"
                    class="membership-item"
                  >
                    <LucideIcon icon="mdi:certificate" />
                    <span>{{ membership }}</span>
                  </div>
                </div>
              </div>

              <!-- Languages -->
              <div v-if="doctor.languages && doctor.languages.length" class="content-section">
                <h2>Languages</h2>
                <div class="languages-list">
                  <span 
                    v-for="language in doctor.languages" 
                    :key="language"
                    class="language-tag"
                  >
                    {{ language }}
                  </span>
                </div>
              </div>

              <!-- Social Links -->
              <div v-if="doctor.social_links && doctor.social_links.length" class="content-section">
                <h2>Connect</h2>
                <div class="social-links">
                  <a 
                    v-for="link in doctor.social_links" 
                    :key="link"
                    :href="link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="social-link"
                  >
                    <LucideIcon icon="mdi:link" />
                    {{ link }}
                  </a>
                </div>
              </div>
            </div>

            <!-- Right Column - Booking Widget -->
            <div class="col-lg-4">
              <div class="booking-widget sticky-top">
                <div class="booking-card">
                  <h3>Book Consultation</h3>
                  <div class="consultation-fee">
                    <span class="fee-amount">₹{{ formatFee(doctor.consultation_fee) }}</span>
                    <span class="fee-label">consultation fee</span>
                  </div>
                  
                  <!-- Consultation Modes -->
                  <div v-if="doctor.consultation_modes && doctor.consultation_modes.length" class="consultation-modes">
                    <h4>Available Modes</h4>
                    <div class="modes-list">
                      <span 
                        v-for="mode in doctor.consultation_modes" 
                        :key="mode"
                        class="mode-badge pill-badge"
                        :class="`mode-${mode.replace('_', '-')}`"
                      >
                        {{ formatMode(mode) }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Availability -->
                  <div v-if="doctor.available_days && doctor.available_days.length" class="availability-section">
                    <h4>Available Days</h4>
                    <div class="days-list">
                      <span 
                        v-for="day in doctor.available_days" 
                        :key="day"
                        class="day-badge"
                      >
                        {{ day }}
                      </span>
                    </div>
                  </div>

                  <!-- Working Hours -->
                  <div v-if="doctor.working_hours && doctor.working_hours.length" class="working-hours-section">
                    <h4>Working Hours</h4>
                    <div class="working-hours">
                      <div 
                        v-for="schedule in doctor.working_hours" 
                        :key="schedule.day"
                        class="schedule-item"
                      >
                        <span class="day">{{ schedule.day }}</span>
                        <span class="time">{{ schedule.start }} - {{ schedule.end }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Book Now Button -->
                  <button 
                    class="btn btn-primary w-100 btn-book"
                    @click="handleBookConsultation"
                  >
                    <LucideIcon icon="mdi:calendar-plus" />
                    Book Consultation
                  </button>

                  <!-- Quick Contact -->
                  <div class="quick-contact">
                    <p class="text-muted small">
                      <template v-if="doctor.contact">
                        Contact: <a :href="`tel:${doctor.contact}`" class="text-primary">{{ doctor.contact }}</a>
                      </template>
                      <template v-else>
                        Need help? Contact us at 
                        <a href="tel:+1234567890" class="text-primary">+1 (234) 567-890</a>
                      </template>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useImageUrl } from '@/composables/useImageUrl.js';
import { useDoctorStore } from '@/stores/doctorStore';
import { useBookingStore } from '@/stores/booking';
import type { Doctor } from '@/types/index';

const route = useRoute();
const router = useRouter();
const doctorStore = useDoctorStore();
const bookingStore = useBookingStore();

const showAllReviews = ref(false);

// Get doctor slug from route
const slug = computed(() => route.params.slug as string);

// Fetch doctor data
const { data: doctor, pending, error } = await useLazyAsyncData<Doctor | null>(
  `doctor-${slug.value}`,
  () => doctorStore.fetchDoctorBySlug(slug.value)
);

// Computed properties
const { getImageUrl } = useImageUrl();
const doctorImage = computed(() => {
  return getImageUrl(doctor.value?.photo, '/default-doctor.svg');
});

// Set meta tags
useHead(() => ({
  title: doctor.value ? `Dr. ${doctor.value.name} - ${doctor.value.specialization || 'Ayurvedic Practitioner'}` : 'Doctor Profile',
  meta: [
    {
      name: 'description',
      content: doctor.value 
        ? `Consult with Dr. ${doctor.value.name}, a certified ${doctor.value.specialization || 'Ayurvedic'} practitioner with ${doctor.value.experience_years || 'several'} years of experience.`
        : 'Expert doctor profile and consultation booking'
    }
  ]
}));

// Methods
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/default-doctor.svg';
};

const handleBookConsultation = () => {
  if (doctor.value) {
    // Navigate to booking page with doctor ID as query parameter
    router.push(`/booking?doctor=${doctor.value.id}`);
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const formatFee = (fee?: number) => {
  if (!fee) return 'N/A';
  return fee.toLocaleString('en-IN');
};

const formatMode = (mode: string) => {
  switch (mode) {
    case 'in_person': return 'In-Person';
    case 'phone': return 'WhatsApp/ Phone Call';
    case 'online': return 'Online (Zoom / Google Meet)';
    default: return mode;
  }
};

// Handle 404 if doctor not found
if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Doctor not found'
  });
}
</script>

<style lang="scss" scoped>
// Use global utility classes and variables for DRY and maintainability
.doctor-page {
  min-height: 100vh;
}

.loading-container,
.error-container {
  min-height: 60vh;
  @extend .d-flex !optional;
  @extend .align-items-center !optional;
  @extend .justify-content-center !optional;
}

.doctor-content {
  padding: 2rem 0;
}

.doctor-header {
  background: var(--background-white);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--card-shadow);
}

.doctor-avatar img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-primary);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.doctor-info .doctor-name {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}
.doctor-info .doctor-specialization {
  font-size: 1.1rem;
  color: var(--color-primary);
  font-weight: 600;
  margin-bottom: 1rem;
}

.doctor-rating {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.doctor-rating .stars {
  display: flex;
  gap: 2px;
}
.doctor-rating .star {
  color: #ddd;
  font-size: 1.1rem;
}
.doctor-rating .star.filled {
  color: #ffd700;
}
.doctor-rating .rating-text {
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.9rem;
}

.doctor-meta-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}
.meta-card {
  background: var(--background-light);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}
.meta-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.meta-icon {
  background: var(--color-primary);
  color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}
.meta-icon :deep(.lucide-icon) {
  color: #fff;
  width: 20px;
  height: 20px;
}
.meta-content {
  display: flex;
  flex-direction: column;
}
.meta-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.meta-value {
  font-size: 0.95rem;
  color: var(--text-primary);
  font-weight: 600;
  margin-top: 0.2rem;
}

.content-section {
  margin-bottom: 3rem;
}
.content-section h2 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: 0.5rem;
  display: inline-block;
}
.treatment-specialties-minimal {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.pill-badge {
  background: var(--color-primary);
  color: #fff;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.2px;
  border: none;
  transition: background 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
.pill-badge:hover {
  background: var(--color-secondary);
}

.about-content {
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

.languages-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.language-tag {
  background: var(--color-primary);
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.awards-list, .memberships-list, .social-links {
  .award-item, .membership-item, .social-link {
    background: var(--background-light);
    padding: 1rem 1.5rem;
    border-radius: 8px;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .social-link {
    text-decoration: none;
    color: var(--text-primary);
    transition: all 0.3s ease;
  }
  .social-link:hover {
    background: var(--color-primary);
    color: #fff;
  }
  .social-link:hover :deep(.lucide-icon) {
    color: #fff;
  }
}

.consultation-modes {
  margin-bottom: 1.5rem;
}
.consultation-modes h4 {
  font-size: 1rem;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}
.modes-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.mode-badge {
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
}
.mode-badge :deep(.lucide-icon) {
  width: 14px;
  height: 14px;
}
.mode-badge.mode-online,
.mode-badge.mode-phone,
.mode-badge.mode-in-person {
  /* Unified color, no extra style needed */
}

.working-hours-section {
  margin-bottom: 1.5rem;
}
.working-hours-section h4 {
  font-size: 1rem;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}
.working-hours {
  background: var(--background-light);
  border-radius: 8px;
  padding: 1rem;
}
.schedule-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
}
.schedule-item:last-child {
  border-bottom: none;
}
.schedule-item .day {
  font-weight: 500;
  color: var(--text-primary);
}
.schedule-item .time {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.booking-widget {
  top: 2rem;
}
.booking-card {
  background: var(--background-white);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--card-shadow);
}
.booking-card h3 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  text-align: center;
}
.consultation-fee {
  text-align: center;
  margin-bottom: 2rem;
}
.fee-amount {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
}
.fee-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.availability-section,
.time-slots-section {
  margin-bottom: 1.5rem;
}
.availability-section h4,
.time-slots-section h4 {
  font-size: 1rem;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}
.days-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.day-badge {
  background: var(--color-secondary);
  color: #fff;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.btn-book {
  margin: 2rem 0 1rem;
  padding: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.btn-book :deep(.lucide-icon) {
  width: 18px;
  height: 18px;
}

.quick-contact {
  text-align: center;
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
}

@media (max-width: 992px) {
  .booking-widget {
    margin-top: 2rem;
    position: static !important;
  }
}
@media (max-width: 768px) {
  .doctor-header {
    padding: 1.5rem;
  }
  .doctor-header .row {
    text-align: center;
  }
  .doctor-avatar img {
    width: 100px;
    height: 100px;
  }
  .doctor-info .doctor-name {
    font-size: 1.75rem;
  }
  .doctor-meta-cards {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  .doctor-content {
    padding: 1.5rem 0;
  }
  .time-slots {
    grid-template-columns: 1fr;
  }
}
</style>
