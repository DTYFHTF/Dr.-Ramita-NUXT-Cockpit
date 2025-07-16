<template>
  <div class="doctor-selection-step">
    <div class="step-header mb-5">
      <h2>Choose Your Doctor</h2>
      <p class="step-subtitle">Select a doctor for your consultation</p>
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

    <div v-else class="doctors-grid">
      <div
        v-for="doctor in doctors"
        :key="doctor.id"
        class="doctor-card"
        :class="{ selected: isSelected(doctor) }"
        @click="selectDoctor(doctor)"
      >
        <div class="doctor-image">
          <img 
            :src="doctor.image || '/default-doctor.svg'" 
            :alt="doctor.name"
            @error="handleImageError"
          />
        </div>
        
        <div class="doctor-info">
          <h3 class="doctor-name">{{ doctor.name }}</h3>
          
          <p v-if="doctor.specialization" class="doctor-specialization">
            {{ doctor.specialization }}
          </p>
          
          <p v-if="doctor.experience" class="doctor-experience">
            {{ doctor.experience }} years experience
          </p>
          
          <div v-if="doctor.rating" class="doctor-rating">
            <div class="stars">
              <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= Math.floor(doctor.rating) }">
                ★
              </span>
            </div>
            <span class="rating-text">{{ doctor.rating }}/5</span>
          </div>
          
          <p v-if="doctor.description" class="doctor-description">
            {{ doctor.description }}
          </p>
          
          <div class="doctor-availability">
            <p class="availability-label">Available Days:</p>
            <div class="availability-days">
              <span 
                v-for="day in doctor.available_days" 
                :key="day"
                class="day-badge"
              >
                {{ day }}
              </span>
            </div>
          </div>
          
          <div v-if="doctor.consultation_fee" class="consultation-fee">
            <span class="fee-label">Consultation Fee:</span>
            <span class="fee-amount">${{ doctor.consultation_fee }}</span>
          </div>
        </div>
        
        <div v-if="isSelected(doctor)" class="selected-indicator">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
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

<script setup>
import { onMounted } from 'vue'
import { useBookingStore } from '~/stores/booking'
import { useDoctorStore } from '~/stores/doctorStore'
import { storeToRefs } from 'pinia'

const emit = defineEmits(['next'])

const bookingStore = useBookingStore()
const doctorStore = useDoctorStore()
const { doctors } = storeToRefs(doctorStore)

const isSelected = (doctor) => {
  return bookingStore.formData.doctorId === doctor.id
}

const selectDoctor = (doctor) => {
  bookingStore.formData.doctorId = doctor.id
  doctorStore.selectDoctor(doctor)
  
  // Clear date and time when doctor changes
  bookingStore.formData.date = ''
  bookingStore.formData.time = null
}

const handleContinue = () => {
  if (bookingStore.formData.doctorId) {
    emit('next')
  }
}

const handleImageError = (event) => {
  event.target.src = '/default-doctor.svg'
}

onMounted(() => {
  if (!doctors.value.length) {
    doctorStore.fetchDoctors()
  }
})
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

.doctors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.doctor-card {
  background: var(--background-white);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(var(--color-primary-rgb, 42,77,58), 0.15);
  }
  
  &.selected {
    border-color: var(--color-primary);
    background: rgba(var(--color-primary-rgb, 42,77,58), 0.05);
    
    .selected-indicator {
      display: block;
    }
  }
}

.doctor-image {
  text-align: center;
  margin-bottom: 1rem;
  
  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--border-color);
  }
}

.doctor-info {
  text-align: center;
}

.doctor-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.doctor-specialization {
  color: var(--color-primary);
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.doctor-experience {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.doctor-rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  
  .stars {
    display: flex;
    gap: 2px;
  }
  
  .star {
    color: #ddd;
    font-size: 1rem;
    
    &.filled {
      color: #ffd700;
    }
  }
  
  .rating-text {
    font-size: 0.85rem;
    color: var(--text-secondary);
  }
}

.doctor-description {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 1rem;
}

.doctor-availability {
  margin-bottom: 1rem;
  
  .availability-label {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
  }
  
  .availability-days {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    justify-content: center;
  }
  
  .day-badge {
    background: var(--color-secondary);
    color: white;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-weight: 500;
  }
}

.consultation-fee {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  
  .fee-label {
    font-size: 0.9rem;
    color: var(--text-secondary);
  }
  
  .fee-amount {
    font-weight: 600;
    color: var(--color-primary);
    font-size: 1.1rem;
  }
}

.selected-indicator {
  display: none;
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
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
  .doctors-grid {
    grid-template-columns: 1fr;
  }
  
  .doctor-card {
    padding: 1rem;
  }
}
</style>
