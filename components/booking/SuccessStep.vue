<template>
  <div class="success-step">
    <div class="confirmation-header text-center">
      <div class="checkmark-circle">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      </div>
      <h2>Booking Confirmed!</h2>
      <p class="step-subtitle">Your consultation is scheduled</p>
    </div>

    <div class="confirmation-details">
      <div class="detail-item">
        <span class="detail-label">Date:</span>
        <span class="detail-value">{{ formattedDate }}</span>
      </div>
      <div class="detail-item timezone-section">
        <span class="detail-label">Your Time ({{ formattedUserTimezone }}):</span>
        <span class="detail-value">{{ formattedUserTime }}</span>
      </div>
      <div class="detail-item timezone-section">
        <span class="detail-label">Doctor's Time ({{ formattedDoctorTimezone }}):</span>
        <span class="detail-value">{{ formattedDoctorTime }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">With:</span>
        <span class="detail-value">{{ doctorName }}</span>
      </div>
    </div>

    <div class="confirmation-actions">
      <button class="btn btn-smooth-success" @click="resetBooking">
        Book Another Consultation
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { parseISO, format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { useBookingStore } from '~/stores/booking'
import { useDoctorStore } from '~/stores/doctorStore'
import { useApiLaravel } from '~/composables/useApi'

const store = useBookingStore()
const doctorStore = useDoctorStore()
const { formatTimezoneName, getUserTimezone } = useTimezone()

const userTimezone = ref(getUserTimezone())

// Calculate the actual date in patient's timezone from UTC
const formattedDate = computed(() => {
  if (!store.formData.time?.utc?.start) {
    return format(parseISO(store.formData.date), 'EEE, d MMM yyyy')
  }
  
  try {
    const utcDate = new Date(store.formData.time.utc.start)
    const patientDate = toZonedTime(utcDate, userTimezone.value)
    return format(patientDate, 'EEE, d MMM yyyy')
  } catch (error) {
    console.error('Error formatting patient date:', error)
    return format(parseISO(store.formData.date), 'EEE, d MMM yyyy')
  }
})

const formattedUserTime = computed(() => {
  const time = store.formData.time
  if (!time?.userTime) return ''
  return `${formatTime(time.userTime.start)} - ${formatTime(time.userTime.end)}`
})

const formattedDoctorTime = computed(() => {
  const time = store.formData.time
  if (!time?.doctorTime) return ''
  return `${formatTime(time.doctorTime.start)} - ${formatTime(time.doctorTime.end)}`
})

const { data: doctorData } = useApiLaravel('doctors')
const selectedDoctor = computed(() => {
  if (!store.formData.doctorId) return null
  return doctorStore.getDoctorById(store.formData.doctorId)
})

const doctorName = computed(() => {
  if (selectedDoctor.value) return selectedDoctor.value.name
  return doctorData.value?.length ? doctorData.value[0].name : 'Dr. Ramita Maharjan'
})

const doctorTimezone = computed(() => {
  return selectedDoctor.value?.timezone || 'Asia/Kolkata'
})

const formattedUserTimezone = computed(() => formatTimezoneName(userTimezone.value))
const formattedDoctorTimezone = computed(() => formatTimezoneName(doctorTimezone.value))

const formatTime = (time) => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours, 10)
  return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`
}

const resetBooking = () => {
  store.resetForm();
  store.currentStep = 1;
};
</script>

<style lang="scss" scoped>
.success-step {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  color: var(--text-primary);
}

.confirmation-header {
  h2 {
    color: var(--text-primary);
  }
  
  .step-subtitle {
    color: var(--text-secondary);
  }
}

.checkmark-circle {
  width: 80px;
  height: 80px;
  background: var(--color-success, #10b981);
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 40px;
    height: 40px;
    color: var(--text-white, #fff);
  }
}

.confirmation-details {
  background: var(--background-white);
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: var(--card-shadow);
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
  color: var(--text-secondary);
  font-weight: 500;
}

.detail-value {
  color: var(--text-primary);
  font-weight: 600;
}

.confirmation-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
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