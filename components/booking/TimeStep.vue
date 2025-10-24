<template>
  <div class="time-step">
    <div class="step-header mb-5">
      <h2>Choose your consultation time</h2>
      <div v-if="selectedDoctor" class="selected-doctor-info">
        <p class="selected-doctor">with {{ selectedDoctor.name }}</p>
        <div class="timezone-info">
          <span class="timezone-badge your-timezone">
            <LucideIcon icon="mdi:clock-outline" />
            Your Time: {{ formattedUserTimezone }}
          </span>
          <span class="timezone-badge doctor-timezone">
            <LucideIcon icon="mdi:map-marker-outline" />
            Doctor's Time: {{ formattedDoctorTimezone }}
          </span>
        </div>
      </div>
      <p class="step-subtitle">Pick a convenient time slot (shown in your local time)</p>
    </div>

    <div v-if="doctorStore.loading" class="loading-overlay">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="doctorStore.error" class="alert alert-danger">
      {{ doctorStore.error }}
    </div>

    <div v-else class="time-grid">
      <div
        v-for="(slot, index) in availableTimeSlots"
        :key="index"
        class="time-slot"
        :class="{ selected: isTimeSelected(slot) }"
        @click="selectTime(slot)"
      >
        <div class="slot-time">{{ formatTime(slot.userTime.start) }}</div>
        <div class="slot-period">{{ getPeriod(slot.userTime.start) }}</div>
        <div class="doctor-time">{{ formatTime(slot.doctorTime.start) }} {{ getPeriod(slot.doctorTime.start) }} (Dr.)</div>
      </div>
    </div>

    <div class="step-navigation mt-5">
      <button class="btn btn-smooth-outline" @click="$emit('prev')">
        Back
      </button>
      <button class="btn btn-smooth-success" @click="$emit('next')" :disabled="!selectedTime">
        Continue
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { parseISO, format } from 'date-fns'
import { toZonedTime, fromZonedTime, formatInTimeZone } from 'date-fns-tz'
import { useBookingStore } from '~/stores/booking'
import { useDoctorStore } from '~/stores/doctorStore'
import { storeToRefs } from 'pinia'

const store = useBookingStore()
const bookingStore = useBookingStore()
const doctorStore = useDoctorStore()
const { doctors } = storeToRefs(doctorStore)
const { formatTimezoneName, getUserTimezone } = useTimezone()

const userTimezone = ref(getUserTimezone())

const selectedDoctor = computed(() => {
  if (!bookingStore.formData.doctorId) return null
  return doctorStore.getDoctorById(bookingStore.formData.doctorId)
})

const doctorTimezone = computed(() => {
  return selectedDoctor.value?.timezone || 'Asia/Kolkata'
})

const formattedUserTimezone = computed(() => formatTimezoneName(userTimezone.value))
const formattedDoctorTimezone = computed(() => formatTimezoneName(doctorTimezone.value))

// Time slot logic with timezone conversion
const availableTimeSlots = computed(() => {
  if (!bookingStore.formData.doctorId || !store.formData.date) return []
  
  const doctor = doctorStore.getDoctorById(bookingStore.formData.doctorId)
  if (!doctor) return []
  
  const selectedDay = format(parseISO(store.formData.date), 'EEE')
  const workingHours = doctor.working_hours.find(wh => wh.day === selectedDay)
  
  if (!workingHours) return []
  
  return generateTimeSlotsWithTimezone(
    workingHours.start, 
    workingHours.end, 
    doctorTimezone.value,
    userTimezone.value,
    store.formData.date
  )
})

const generateTimeSlotsWithTimezone = (start, end, doctorTz, userTz, date) => {
  const slots = []
  
  // Create datetime in doctor's timezone
  const doctorStartTime = fromZonedTime(`${date}T${start}`, doctorTz)
  const doctorEndTime = fromZonedTime(`${date}T${end}`, doctorTz)
  
  let current = doctorStartTime

  while (current < doctorEndTime) {
    const next = new Date(current.getTime() + 45 * 60000) // 45 minute slots
    
    // Convert to both timezones for display
    const userStart = toZonedTime(current, userTz)
    const userEnd = toZonedTime(next, userTz)
    const doctorStart = toZonedTime(current, doctorTz)
    const doctorEnd = toZonedTime(next, doctorTz)
    
    slots.push({
      userTime: {
        start: format(userStart, 'HH:mm'),
        end: format(userEnd, 'HH:mm')
      },
      doctorTime: {
        start: format(doctorStart, 'HH:mm'),
        end: format(doctorEnd, 'HH:mm')
      },
      utc: {
        start: current.toISOString(),
        end: next.toISOString()
      }
    })
    
    current = next
  }

  return slots
}

const formatTime = (time) => {
  const [hours, minutes] = time.split(':')
  return `${parseInt(hours) % 12 || 12}:${minutes}`
}

const getPeriod = (time) => {
  return parseInt(time.split(':')[0]) >= 12 ? 'PM' : 'AM'
}

const isTimeSelected = (slot) => {
  if (!store.formData.time) return false
  return store.formData.time.userTime?.start === slot.userTime.start
}

const selectedTime = computed(() => store.formData.time)

const selectTime = (slot) => {
  store.formData.time = slot
}
</script>

<style lang="scss" scoped>
.time-step {
  max-width: 800px;
  margin: 0 auto;
  color: var(--text-primary);
}

.step-header {
  color: var(--text-primary);
  
  h2 {
    color: var(--text-primary);
  }
  
  .selected-doctor-info {
    margin-bottom: 0.5rem;
    
    .selected-doctor {
      color: var(--color-primary);
      font-weight: 500;
      font-size: 1.1rem;
      margin-bottom: 0.75rem;
    }
    
    .timezone-info {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 0.5rem;
      
      .timezone-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.4rem 0.8rem;
        border-radius: 6px;
        font-size: 0.85rem;
        font-weight: 500;
        
        &.your-timezone {
          background: rgba(var(--color-primary-rgb, 42,77,58), 0.1);
          color: var(--color-primary);
          border: 1px solid rgba(var(--color-primary-rgb, 42,77,58), 0.2);
        }
        
        &.doctor-timezone {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
      }
    }
  }
  
  .step-subtitle {
    color: var(--text-secondary);
  }
}

.time-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.time-slot {
  padding: 1rem 0.5rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--background-white);

  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
  }

  &.selected {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: var(--text-white, #fff);
    
    .slot-time, .slot-period, .doctor-time {
      color: var(--text-white, #fff);
    }
  }
}

.slot-time {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.slot-period {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.doctor-time {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
  font-style: italic;
  opacity: 0.8;
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

.alert {
  background: var(--background-white);
  border-color: var(--border-color);
  color: var(--text-primary);
}

.loading-overlay {
  text-align: center;
  padding: 2rem;
  
  .spinner-border {
    color: var(--color-primary);
  }
}
</style>