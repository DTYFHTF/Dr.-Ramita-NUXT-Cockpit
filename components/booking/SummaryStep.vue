<template>
  <div class="summary-step">
    <div class="step-header mb-5">
      <h2 class="step-title">Review Your Booking</h2>
      <p class="step-subtitle">Confirm your consultation details</p>
    </div>

    <div class="booking-summary-card">
      <div class="summary-item">
        <span class="summary-label">Date:</span>
        <span class="summary-value">{{ formattedDate }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Time:</span>
        <span class="summary-value">{{ formattedTime }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">With:</span>
        <span class="summary-value">{{ doctorName }}</span>
      </div>
    </div>

    <div class="step-navigation mt-5">
      <button class="btn btn-outline-secondary btn-smooth-outline" @click="$emit('prev')">
        Back
      </button>
      <button class="btn btn-success btn-smooth-success" @click="confirmBooking">
        Confirm Booking
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { parseISO, format } from 'date-fns'
import { useBookingStore } from '~/stores/booking'
import { postContentItem } from '~/composables/useApi'

const store = useBookingStore()

const formattedDate = computed(() =>
  store.formData.date
    ? format(parseISO(store.formData.date), 'EEE, d MMM yyyy')
    : 'Not selected'
)

const formattedTime = computed(() =>
  store.formData.time
    ? `${formatTime(store.formData.time.start)} - ${formatTime(store.formData.time.end)}`
    : 'Not selected'
)

const { data: doctorData } = useApi('items/doctor')
const doctorName = computed(() =>
  doctorData.value?.length ? doctorData.value[0].name : 'Dr. Ramita Maharjan'
)

const formatTime = (time) => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours, 10)
  return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`
}

const postBookingInfo = () => {
  const bookingData = {
    date: store.formData.date,
    duration: '45 mins', // Assuming time contains start and end
    patient_name: store.formData.name,
    patient_email: store.formData.email,
    patient_phone: store.formData.phone,
    notes: store.formData.notes,
    status: 'pending', // Default status
  };

  postContentItem('consultations', bookingData)
    .then(() => {
      console.log('Booking information posted successfully');
    })
    .catch((error) => {
      console.error('Error posting booking information:', error);
    });
};

const confirmBooking = () => {
  postBookingInfo();
  store.nextStep();
}
</script>

<style lang="scss" scoped>
.summary-step {
  max-width: 800px;
  margin: 0 auto;
}

.booking-summary-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
}

.summary-label {
  color: var(--text-muted);
  font-weight: 500;
}

.summary-value {
  color: var(--text-dark);
  font-weight: 600;
}

.navigation-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.step-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  gap: 1rem; /* Add gap between buttons */
}
</style>