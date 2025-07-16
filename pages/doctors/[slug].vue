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
      <!-- Hero Section -->
      <section class="doctor-hero">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-4 text-center">
              <div class="doctor-avatar-large">
                <img 
                  :src="doctorImage" 
                  :alt="doctor.name"
                  @error="handleImageError"
                />
              </div>
            </div>
            <div class="col-lg-8">
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
                <div class="doctor-meta">
                  <div v-if="doctor.experience_years" class="meta-item">
                    <i class="fas fa-graduation-cap"></i>
                    <span>{{ doctor.experience_years }} years experience</span>
                  </div>
                  <div v-if="doctor.consultation_fee" class="meta-item">
                    <i class="fas fa-rupee-sign"></i>
                    <span>₹{{ formatFee(doctor.consultation_fee) }} consultation fee</span>
                  </div>
                  <div v-if="doctor.location" class="meta-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>{{ doctor.location }}</span>
                  </div>
                  <div v-if="doctor.contact" class="meta-item">
                    <i class="fas fa-phone"></i>
                    <span>{{ doctor.contact }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <section class="doctor-content">
        <div class="container">
          <div class="row">
            <!-- Left Column - Details -->
            <div class="col-lg-8">
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

              <!-- Awards -->
              <div v-if="doctor.awards && doctor.awards.length" class="content-section">
                <h2>Awards & Recognition</h2>
                <div class="awards-list">
                  <div 
                    v-for="award in doctor.awards" 
                    :key="award"
                    class="award-item"
                  >
                    <i class="fas fa-trophy"></i>
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
                    <i class="fas fa-certificate"></i>
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
                    <i class="fas fa-external-link-alt"></i>
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
                        class="mode-badge"
                        :class="`mode-${mode.replace('_', '-')}`"
                      >
                        <i :class="getModeIcon(mode)"></i>
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
                        v-for="schedule in doctor.working_hours.slice(0, 3)" 
                        :key="schedule.day"
                        class="schedule-item"
                      >
                        <span class="day">{{ schedule.day }}</span>
                        <span class="time">{{ schedule.start }} - {{ schedule.end }}</span>
                      </div>
                      <div v-if="doctor.working_hours.length > 3" class="more-hours">
                        +{{ doctor.working_hours.length - 3 }} more days
                      </div>
                    </div>
                  </div>

                  <!-- Book Now Button -->
                  <button 
                    class="btn btn-primary w-100 btn-book"
                    @click="handleBookConsultation"
                  >
                    <i class="fas fa-calendar-plus me-2"></i>
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
    case 'phone': return 'Phone';
    case 'online': return 'Online';
    default: return mode;
  }
};

const getModeIcon = (mode: string) => {
  switch (mode) {
    case 'in_person': return 'fas fa-user-md';
    case 'phone': return 'fas fa-phone';
    case 'online': return 'fas fa-video';
    default: return 'fas fa-stethoscope';
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
.doctor-page {
  min-height: 100vh;
}

.loading-container,
.error-container {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.doctor-hero {
  background: linear-gradient(135deg, var(--background-light) 0%, var(--background-white) 100%);
  padding: 3rem 0;
  border-bottom: 1px solid var(--border-color);
}

.doctor-avatar-large {
  img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid white;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
}

.doctor-info {
  .doctor-name {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }
  
  .doctor-specialization {
    font-size: 1.2rem;
    color: var(--color-primary);
    font-weight: 600;
    margin-bottom: 1rem;
  }
}

.doctor-rating {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  .stars {
    display: flex;
    gap: 2px;
    
    .star {
      color: #ddd;
      font-size: 1.2rem;
      
      &.filled {
        color: #ffd700;
      }
    }
  }
  
  .rating-text {
    color: var(--text-secondary);
    font-weight: 500;
  }
}

.doctor-meta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--text-secondary);
    
    i {
      color: var(--color-primary);
      width: 16px;
    }
  }
}

.doctor-content {
  padding: 3rem 0;
}

.content-section {
  margin-bottom: 3rem;
  
  h2 {
    color: var(--text-primary);
    font-weight: 600;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid var(--color-primary);
    padding-bottom: 0.5rem;
    display: inline-block;
  }
}

.about-content {
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

.specializations-list,
.languages-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.language-tag {
  background: var(--color-primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.qualifications-content,
.awards-list,
.memberships-list,
.social-links {
  .qualification-item,
  .award-item,
  .membership-item,
  .social-link {
    background: var(--background-light);
    padding: 1rem 1.5rem;
    border-radius: 8px;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    
    i {
      color: var(--color-primary);
      font-size: 1.1rem;
      width: 20px;
    }
  }
  
  .social-link {
    text-decoration: none;
    color: var(--text-primary);
    transition: all 0.3s ease;
    
    &:hover {
      background: var(--color-primary);
      color: white;
      
      i {
        color: white;
      }
    }
  }
}

.consultation-modes {
  margin-bottom: 1.5rem;
  
  h4 {
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
    background: var(--background-light);
    color: var(--text-primary);
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    font-weight: 500;
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 0.4rem;
    
    i {
      font-size: 0.7rem;
    }
    
    &.mode-online {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }
    
    &.mode-phone {
      background: #10b981;
      color: white;
      border-color: #10b981;
    }
    
    &.mode-in-person {
      background: var(--color-primary);
      color: white;
      border-color: var(--color-primary);
    }
  }
}

.working-hours-section {
  margin-bottom: 1.5rem;
  
  h4 {
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
    
    &:last-child {
      border-bottom: none;
    }
    
    .day {
      font-weight: 500;
      color: var(--text-primary);
    }
    
    .time {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
  }
  
  .more-hours {
    text-align: center;
    color: var(--text-secondary);
    font-size: 0.8rem;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--border-color);
  }
}

.reviews-list {
  .review-item {
    background: var(--background-light);
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    
    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      
      .reviewer-info {
        .review-rating {
          .star {
            color: #ddd;
            font-size: 0.9rem;
            
            &.filled {
              color: #ffd700;
            }
          }
        }
      }
      
      .review-date {
        color: var(--text-secondary);
        font-size: 0.9rem;
      }
    }
    
    .review-text {
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
    }
  }
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
  
  h3 {
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    text-align: center;
  }
}

.consultation-fee {
  text-align: center;
  margin-bottom: 2rem;
  
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
}

.availability-section,
.time-slots-section {
  margin-bottom: 1.5rem;
  
  h4 {
    font-size: 1rem;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
  }
}

.days-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.day-badge {
  background: var(--color-secondary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.time-slots {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.time-slot {
  background: var(--background-light);
  padding: 0.5rem;
  border-radius: 6px;
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-book {
  margin: 2rem 0 1rem;
  padding: 0.75rem;
  font-weight: 600;
}

.quick-contact {
  text-align: center;
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
}

@media (max-width: 992px) {
  .doctor-hero {
    padding: 2rem 0;
    text-align: center;
  }
  
  .doctor-info {
    margin-top: 2rem;
    
    .doctor-name {
      font-size: 2rem;
    }
  }
  
  .doctor-meta {
    justify-content: center;
  }
  
  .booking-widget {
    margin-top: 2rem;
    position: static !important;
  }
}

@media (max-width: 768px) {
  .doctor-avatar-large img {
    width: 150px;
    height: 150px;
  }
  
  .doctor-info .doctor-name {
    font-size: 1.75rem;
  }
  
  .doctor-content {
    padding: 2rem 0;
  }
  
  .time-slots {
    grid-template-columns: 1fr;
  }
}
</style>
