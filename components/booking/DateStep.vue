<template>
  <div class="date-step">
    <div class="step-header mb-4">
      <h2 class="step-title">Select Consultation Date</h2>
      <p class="current-month">{{ currentMonth }}</p>
    </div>

    <div v-if="doctorStore.loading" class="loading-state text-center">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="doctorStore.error" class="alert alert-danger">
      {{ doctorStore.error }}
    </div>

    <div v-else class="calendar-container">
      <div class="calendar-grid">
        <div class="calendar-header">
          <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" 
               :key="day" 
               class="day-header">
            {{ day }}
          </div>
        </div>

        <div class="calendar-body">
          <div v-for="(date, index) in visibleDates" 
               :key="index"
               class="calendar-day"
               :class="{
                 'available': isDateAvailable(date),
                 'selected': isDateSelected(date),
                 'disabled': !isDateAvailable(date)
               }"
               @click="selectDate(date)">
            <div class="day-number">{{ date.day }}</div>
            <div v-if="isDateAvailable(date)" class="availability-dot"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="navigation-actions">
      <button class="btn btn-outline-secondary" @click="$emit('prev')">Back</button>
      <button class="btn btn-primary" 
              @click="$emit('next')" 
              :disabled="!bookingStore.formData.date">
        Continue
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns'
import { useBookingStore } from '~/stores/booking'
import { useDoctorStore } from '~/stores/doctorStore'
import { storeToRefs } from 'pinia'

const bookingStore = useBookingStore()
const doctorStore = useDoctorStore()
const { doctors } = storeToRefs(doctorStore)

onMounted(() => {
  doctorStore.fetchDoctors()
})

const currentDate = ref(new Date(2025, 4, 1)) // May 2025
const currentMonth = computed(() => format(currentDate.value, 'MMMM yyyy'))

const visibleDates = computed(() => {
  const start = startOfMonth(currentDate.value)
  const end = endOfMonth(currentDate.value)
  const days = eachDayOfInterval({ start, end })
  
  const firstDayIndex = getDay(start)
  const dates = []
  
  // Add empty placeholder days
  for (let i = 0; i < firstDayIndex; i++) {
    dates.push({ isEmpty: true })
  }

  // Add actual dates
  days.forEach(date => {
    dates.push({
      date: date.toISOString(),
      day: format(date, 'd'),
      weekday: format(date, 'EEE') // Match API's "Mon" format
    })
  })

  return dates
})

const isDateAvailable = (date) => {
  if (!date.date || !doctors.value.length) return false
  return doctors.value[0].available_days.includes(date.weekday)
}

const isDateSelected = (date) => {
  return bookingStore.formData.date === date.date
}

const selectDate = (date) => {
  if (isDateAvailable(date)) {
    bookingStore.formData.date = date.date
  }
}
</script>

<style scoped>
/* Keep your existing styles, remove debug styles */
.calendar-day.disabled {
  background-color: #f8fafc;
  cursor: not-allowed;
  opacity: 0.5;
}

.availability-dot {
  width: 6px;
  height: 6px;
  background-color: #48bb78;
  border-radius: 50%;
  margin-top: 4px;
}

/* Other existing styles remain unchanged */
.date-step {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.step-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.step-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
}

.current-month {
  color: #4a5568;
  margin-top: 0.5rem;
}

.calendar-container {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.calendar-grid {
  display: grid;
  gap: 2px;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 0.5rem;
}

.day-header {
  text-align: center;
  font-size: 0.875rem;
  color: #4a5568;
  padding: 0.5rem;
}

.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.calendar-day {
  /* aspect-ratio: 1; */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 40px;
  position: relative;
}

.calendar-day.available {
  background-color: #f0fff4;
  border: 1px solid #c6f6d5;
}

.calendar-day.selected {
  background-color: #2c7a7b;
  color: white;
}

.debug-info {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.6rem;
  color: #e53e3e;
  text-align: center;
  line-height: 1.2;
}

.navigation-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  padding: 0 1rem;
}

.loading-state {
  padding: 2rem;
}

</style>

