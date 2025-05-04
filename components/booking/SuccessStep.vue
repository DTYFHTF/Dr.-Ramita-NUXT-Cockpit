<template>
  <div class="success-step">
    <div class="confirmation-header text-center">
      <div class="checkmark-circle">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      </div>
      <h2 class="step-title">Booking Confirmed!</h2>
      <p class="step-subtitle">Your consultation is scheduled</p>
    </div>

    <div class="confirmation-details">
      <div class="detail-item">
        <span class="detail-label">Date:</span>
        <span class="detail-value">{{ formattedDate }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Time:</span>
        <span class="detail-value">{{ formattedTime }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">With:</span>
        <span class="detail-value">{{ doctorName }}</span>
      </div>
    </div>

    <div class="confirmation-actions">
      <button class="btn btn-primary" @click="resetBooking">
        Book Another Session
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { parseISO, format } from 'date-fns'
import { useBookingStore } from '~/stores/booking'
import { useApi } from '~/composables/useApi'

const store = useBookingStore()

const formattedDate = computed(() =>
  format(parseISO(store.formData.date), 'EEE, d MMM yyyy')
)

const formattedTime = computed(() => {
  const time = store.formData.time
  return time ? `${formatTime(time.start)} - ${formatTime(time.end)}` : ''
})

const { data: doctorData } = useApi('items/doctor')
const doctorName = computed(() =>
  doctorData.value?.length ? doctorData.value[0].name : 'Dr. Ramita Maharjan'
)

const formatTime = (time) => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours, 10)
  return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`
}

const resetBooking = () => {
  store.resetForm()
  store.currentStep = 1
}
</script>

<style scoped>
.success-step {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.checkmark-circle {
  width: 80px;
  height: 80px;
  background: var(--success-color);
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 40px;
    height: 40px;
    color: white;
  }
}

.confirmation-details {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
}

.detail-label {
  color: var(--text-muted);
  font-weight: 500;
}

.detail-value {
  color: var(--text-dark);
  font-weight: 600;
}

.confirmation-actions {
  margin-top: 2rem;
}

.step-title {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.step-subtitle {
  color: var(--text-muted);
  margin-bottom: 2rem;
}
</style>