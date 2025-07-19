<template>
  <div class="doctor-selection-step">
    <div class="step-header mb-5">
      <h2>Choose Your Wellness Expert</h2>
      <p class="step-subtitle">Select an expert for your consultation</p>
    </div>

    <div v-if="doctorStore.loading" class="loading-state text-center py-4">
      <div class="spinner-border text-primary"></div>
      <p class="text-muted mt-2">Loading doctors...</p>
    </div>

    <div v-else-if="doctorStore.error" class="alert alert-danger mx-3">
      {{ doctorStore.error }}
      <button class="btn btn-outline-danger btn-sm mt-2" @click="doctorStore.fetchDoctors()">
        Try Again
      </button>
    </div>

    <div v-else-if="doctors.length === 0" class="alert alert-info text-center">
      No doctors available at the moment. Please try again later.
    </div>

    <!-- Doctor List -->
    <div v-else class="doctors-list">
      <div
        v-for="doctor in doctors"
        :key="doctor.id"
        class="doctor-list-item"
        :class="{ selected: isSelected(doctor) }"
        @click="selectDoctor(doctor)"
      >
        <div class="doctor-avatar">
          <img 
            :src="getDoctorImage(doctor)" 
            :alt="doctor.name"
            @error="handleImageError"
          />
        </div>
        
        <div class="doctor-details">
          <div class="doctor-main-info">
            <h3 class="doctor-name">{{ doctor.name }}</h3>
            <p v-if="doctor.specialization" class="doctor-specialization">
              {{ doctor.specialization }}
            </p>
          </div>
          
          <div class="doctor-meta">
            <div v-if="doctor.experience_years" class="experience">
              <span class="label">Experience:</span>
              <span class="value">{{ doctor.experience_years }} years</span>
            </div>
            
            <div v-if="doctor.rating" class="rating">
              <div class="stars">
                <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= Math.floor(doctor.rating) }">
                  ★
                </span>
              </div>
              <span class="rating-value">{{ doctor.rating }}/5</span>
            </div>
          </div>
          
          <div class="doctor-availability">
            <span class="availability-label">Available:</span>
            <div class="days-compact">
              <span 
                v-for="day in doctor.available_days" 
                :key="day"
                class="day-compact"
              >
                {{ day }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="doctor-price">
          <div v-if="doctor.consultation_fee" class="fee">
            <span class="currency">$</span>
            <span class="amount">{{ doctor.consultation_fee }}</span>
          </div>
          <span class="fee-label">/Consultation</span>
        </div>
        
        <div class="selection-area">
          <div v-if="isSelected(doctor)" class="selected-check">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <div v-else class="select-circle"></div>
        </div>
      </div>
    </div>

    <div class="navigation-actions mt-5">
      <button 
        class="btn btn-primary btn-smooth-primary" 
        @click="handleContinue" 
        :disabled="!bookingStore.formData.doctorId"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useBookingStore } from '@/stores/booking';
import { useDoctorStore } from '@/stores/doctorStore';
import type { Doctor } from '@/types/index';

const emit = defineEmits(['next']);

const bookingStore = useBookingStore();
const doctorStore = useDoctorStore();

// Computed
const doctors = computed(() => doctorStore.doctors);

// Methods
const isSelected = (doctor: Doctor) => {
  return bookingStore.formData.doctorId === doctor.id;
};

const selectDoctor = (doctor: Doctor) => {
  bookingStore.formData.doctorId = doctor.id;
  doctorStore.selectDoctor(doctor);
  
  // Clear date and time when doctor changes
  bookingStore.formData.date = '';
  bookingStore.formData.time = null;
};

const getDoctorImage = (doctor: Doctor) => {
  if (doctor.photo) {
    // If photo is a full URL, use it directly
    if (doctor.photo.startsWith('http')) {
      return doctor.photo;
    }
    // If it's a relative path, construct the full URL
    const config = useRuntimeConfig();
    return `${config.public.apiBase}/storage/${doctor.photo}`;
  }
  return '/default-doctor.svg';
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/default-doctor.svg';
};

const handleContinue = () => {
  if (bookingStore.formData.doctorId) {
    emit('next');
  }
};

// Lifecycle
onMounted(async () => {
  if (doctorStore.doctors.length === 0) {
    await doctorStore.fetchDoctors();
  }
});
</script>

<style lang="scss" scoped>
.doctor-selection-step {
  max-width: 1000px;
  margin: 0 auto;
  color: var(--text-primary);
}

.step-header {
  text-align: center;
  margin-bottom: 2rem;
  
  h2 {
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }
  
  .step-subtitle {
    color: var(--text-secondary);
  }
}

.loading-state {
  .spinner-border {
    width: 3rem;
    height: 3rem;
  }
}

.doctors-list {
  max-width: 800px;
  margin: 0 auto 2rem;
}

.doctor-list-item {
  display: flex;
  align-items: center;
  background: var(--background-white);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(var(--color-primary-rgb, 42,77,58), 0.1);
  }
  
  &.selected {
    border-color: var(--color-primary);
    background: rgba(var(--color-primary-rgb, 42,77,58), 0.05);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
}

.doctor-avatar {
  flex-shrink: 0;
  margin-right: 1.5rem;
  
  img {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--border-color);
  }
}

.doctor-details {
  flex: 1;
  min-width: 0;
}

.doctor-main-info {
  margin-bottom: 0.75rem;
}

.doctor-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.doctor-specialization {
  color: var(--color-primary);
  font-weight: 500;
  font-size: 0.9rem;
  margin: 0;
}

.doctor-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.experience {
  display: flex;
  gap: 0.5rem;
  font-size: 0.85rem;
  
  .label {
    color: var(--text-secondary);
  }
  
  .value {
    color: var(--text-primary);
    font-weight: 500;
  }
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .stars {
    display: flex;
    gap: 1px;
  }
  
  .star {
    color: #ddd;
    font-size: 0.85rem;
    
    &.filled {
      color: #ffd700;
    }
  }
  
  .rating-value {
    font-size: 0.8rem;
    color: var(--text-secondary);
  }
}

.doctor-availability {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.availability-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin: 0;
}

.days-compact {
  display: flex;
  gap: 0.25rem;
}

.day-compact {
  background: var(--color-secondary);
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-weight: 500;
}

.doctor-price {
  flex-shrink: 0;
  text-align: center;
  margin: 0 1rem;
}

.fee {
  display: flex;
  align-items: baseline;
  justify-content: center;
  
  .currency {
    font-size: 0.9rem;
    color: var(--text-secondary);
  }
  
  .amount {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--color-primary);
  }
}

.fee-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
  display: block;
}

.selection-area {
  flex-shrink: 0;
  margin-left: 1rem;
}

.selected-check {
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.select-circle {
  border: 2px solid var(--border-color);
  border-radius: 50%;
  width: 28px;
  height: 28px;
  transition: border-color 0.2s ease;
}

.doctor-list-item:hover .select-circle {
  border-color: var(--color-primary);
}

@media (max-width: 768px) {
  .doctor-list-item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .doctor-avatar {
    margin-right: 0;
  }
  
  .doctor-meta {
    justify-content: center;
  }
  
  .doctor-availability {
    justify-content: center;
  }
  
  .doctor-price {
    margin: 0;
  }
  
  .selection-area {
    margin-left: 0;
  }
}

.navigation-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .doctor-list-item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .doctor-avatar {
    margin-right: 0;
  }
  
  .doctor-meta {
    justify-content: center;
  }
  
  .doctor-availability {
    justify-content: center;
  }
  
  .doctor-price {
    margin: 0;
  }
  
  .selection-area {
    margin-left: 0;
  }
}
</style>
