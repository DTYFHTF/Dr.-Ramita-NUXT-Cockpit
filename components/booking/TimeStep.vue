<template>
  <div class="time-step">
    <div class="step-header mb-5">
      <h2>Choose your consultation time</h2>
      <div v-if="selectedDoctor" class="selected-doctor-info">
        <p class="selected-doctor">with {{ selectedDoctor.name }}</p>
      </div>
      <p class="step-subtitle">Pick a convenient time slot</p>
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
        <div class="slot-time">{{ formatTime(slot.start) }}</div>
        <div class="slot-period">{{ getPeriod(slot.start) }}</div>
      </div>
    </div>

    <div class="step-navigation mt-5">
      <button class="btn btn-outline-secondary btn-smooth-outline" @click="$emit('prev')">
        Back
      </button>
      <button class="btn btn-primary btn-smooth-primary" @click="$emit('next')" :disabled="!selectedTime">
        Continue
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { parseISO, format } from 'date-fns'
import { useBookingStore } from '~/stores/booking'
import { useDoctorStore } from '~/stores/doctorStore'
import { storeToRefs } from 'pinia'

const store = useBookingStore()
const bookingStore = useBookingStore()
const doctorStore = useDoctorStore()
const { doctors } = storeToRefs(doctorStore)

const selectedDoctor = computed(() => {
  if (!bookingStore.formData.doctorId) return null
  return doctorStore.getDoctorById(bookingStore.formData.doctorId)
})

// Time slot logic
const availableTimeSlots = computed(() => {
  if (!bookingStore.formData.doctorId || !store.formData.date) return []
  
  const selectedDoctor = doctorStore.getDoctorById(bookingStore.formData.doctorId)
  if (!selectedDoctor) return []
  
  const selectedDay = format(parseISO(store.formData.date), 'EEE')
  const workingHours = selectedDoctor.working_hours.find(wh => wh.day === selectedDay)
  
  return workingHours ? generateTimeSlots(workingHours.start, workingHours.end) : []
})

const generateTimeSlots = (start, end) => {
  const slots = []
  let current = parseISO(`2024-01-01T${start}`)
  const endTime = parseISO(`2024-01-01T${end}`)

  while (current < endTime) {
    const next = new Date(current.getTime() + 45 * 60000)
    slots.push({
      start: format(current, 'HH:mm'),
      end: format(next, 'HH:mm')
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

const isTimeSelected = (slot) => store.formData.time?.start === slot.start
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
    }
  }
  
  .step-subtitle {
    color: var(--text-secondary);
  }
}

.time-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.time-slot {
  padding: .25rem;
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
    
    .slot-time, .slot-period {
      color: var(--text-white, #fff);
    }
  }
}

.slot-time {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-primary);
}

.slot-period {
  font-size: 0.9rem;
  color: var(--text-secondary);
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