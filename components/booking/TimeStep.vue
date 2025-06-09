<template>
  <div class="time-step">
    <div class="step-header mb-5">
      <h2>Schedule a personalized session with Dr. Ramita 

</h2>
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
const doctorStore = useDoctorStore()
const { doctors } = storeToRefs(doctorStore)

// Time slot logic
const availableTimeSlots = computed(() => {
  if (!doctors.value?.length || !store.formData.date) return []
  
  const selectedDay = format(parseISO(store.formData.date), 'EEE')
  const workingHours = doctors.value[0].working_hours.find(wh => wh.day === selectedDay)
  
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
  background: white;

  &:hover {
    border-color: $color-primary;
    transform: translateY(-2px);
  }

  &.selected {
    background: $color-primary;
    border-color: $color-primary;
    color: white;
    
    .slot-time, .slot-period {
      color: white;
    }
  }
}

.slot-time {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-dark);
}

.slot-period {
  font-size: 0.9rem;
  color: var(--text-muted);
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