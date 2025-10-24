<template>
  <div class="summary-step">
    <div class="step-header mb-5">
      <h2>Review Your Booking</h2>
      <p class="step-subtitle">Confirm your consultation details</p>
    </div>

    <div class="booking-summary-card">
      <div class="summary-item">
        <span class="summary-label">Date:</span>
        <span class="summary-value">{{ patientFormattedDate }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Your Time:</span>
        <span class="summary-value">{{ formattedUserTime }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Doctor's Time:</span>
        <span class="summary-value">{{ formattedDoctorTime }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">With:</span>
        <span class="summary-value">{{ doctorName }}</span>
      </div>
      
      <div class="timezone-note">
        <LucideIcon icon="mdi:information-outline" />
        <span>Times are shown in both your timezone ({{ formattedUserTimezone }}) and doctor's timezone ({{ formattedDoctorTimezone }})</span>
      </div>
    </div>

    <div class="step-navigation mt-5">
      <button class="btn btn-smooth-outline" @click="$emit('prev')">
        Back
      </button>
      <button class="btn btn-smooth-success" @click="confirmBooking">
        Confirm Booking
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { parseISO, format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { useBookingStore } from '~/stores/booking'
import { postBookingLaravel } from '~/composables/useApi'
import { useApiLaravel } from '~/composables/useApi'
import { useUserStore } from '~/stores/user'
import { useDoctorStore } from '~/stores/doctorStore'

const store = useBookingStore()
const userStore = useUserStore()
const doctorStore = useDoctorStore()
const { formatTimezoneName, getUserTimezone } = useTimezone()

const userTimezone = ref(getUserTimezone())

// Calculate the actual date in patient's timezone from UTC
const patientFormattedDate = computed(() => {
  if (!store.formData.time?.utc?.start) return 'Not selected'
  
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
  if (!store.formData.time?.userTime) return 'Not selected'
  return `${formatTime(store.formData.time.userTime.start)} - ${formatTime(store.formData.time.userTime.end)}`
})

const formattedDoctorTime = computed(() => {
  if (!store.formData.time?.doctorTime) return 'Not selected'
  return `${formatTime(store.formData.time.doctorTime.start)} - ${formatTime(store.formData.time.doctorTime.end)}`
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

const doctor_id = store.formData.doctorId || doctorStore.doctors[0]?.id || doctorData.value?.[0]?.id;

const postBookingInfo = () => {
  const bookingData = {
    user_id: userStore.user?.id,
    doctor_id: doctor_id,
    date: store.formData.date,
    duration: {
      start: store.formData.time?.userTime?.start,
      end: store.formData.time?.userTime?.end
    },
    patient_name: store.formData.name,
    patient_email: store.formData.email,
    patient_phone: store.formData.phone,
    patient_timezone: userTimezone.value,
    doctor_timezone: doctorTimezone.value,
    scheduled_at_utc: store.formData.time?.utc?.start, // Store UTC time
    notes: store.formData.notes,
    status: 'pending',
  };

  postBookingLaravel(bookingData)
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
  color: var(--text-primary);
}

.step-header {
  text-align: center;
  margin-bottom: 2rem;
  
  h2 {
    color: var(--text-primary);
  }
  
  .step-subtitle {
    color: var(--text-secondary);
  }
}

.booking-summary-card {
  background: var(--background-white);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--card-shadow);
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
  color: var(--text-secondary);
  font-weight: 500;
}

.summary-value {
  color: var(--text-primary);
  font-weight: 600;
}

.timezone-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(var(--color-primary-rgb, 42,77,58), 0.05);
  border-radius: 8px;
  border-left: 3px solid var(--color-primary);
  font-size: 0.9rem;
  color: var(--text-secondary);
  
  svg {
    flex-shrink: 0;
    color: var(--color-primary);
  }
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
  gap: 1rem;
}
</style>