<template>
  <div class="date-step">
    <div class="step-header mb-5">
      <h2>Schedule a personalized session with Dr. Ramita</h2>
      <p class="current-month">{{ currentMonth }}</p>
    </div>

    <div v-if="doctorStore.loading" class="loading-state text-center py-4">
      <div class="spinner-border text-primary"></div>
      <p class="text-muted mt-2">Loading availability...</p>
    </div>

    <div v-else-if="doctorStore.error" class="alert alert-danger mx-3">
      {{ doctorStore.error }}
    </div>

    <div v-else class="calendar-container">
      <div class="calendar-grid">
        <div class="calendar-header">
          <div 
            v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" 
            :key="day" 
            class="day-header"
          >
            {{ day }}
          </div>
        </div>

        <div class="calendar-body">
          <div 
            v-for="(date, index) in visibleDates" 
            :key="index"
            class="calendar-day"
            :class="{
              'available': isDateAvailable(date),
              'selected': isDateSelected(date),
              'disabled': !isDateAvailable(date),
              'current-month': date.date
            }"
            @click="selectDate(date)"
            role="button"
            :aria-disabled="!isDateAvailable(date)"
          >
            <div class="day-number">{{ date.day }}</div>
            <div v-if="isDateAvailable(date)" class="availability-indicator">
              <div class="availability-bar"></div>
              <div v-if="isDateSelected(date)" class="selected-check">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="navigation-actions">
      <button class="btn btn-outline-secondary btn-smooth-outline" @click="$emit('prev')">
        Back
      </button>
      <button 
        class="btn btn-green btn-smooth-green" 
        @click="$emit('next')" 
        :disabled="!bookingStore.formData.date"
      >
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
      weekday: format(date, 'EEE')
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

onMounted(() => {
  doctorStore.fetchDoctors()
})
</script>

<style scoped>:root {
  --text-deep-green: #2a4d3a; /* Your deep green color */
  --calendar-primary: var(--text-deep-green);
  --calendar-text: var(--text-deep-green); /* Date number color */
  --calendar-text-secondary: #4a5568; /* Month and weekday color */
  --calendar-success: #48bb78; /* Availability indicator */
}

.date-step {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.step-header {
  text-align: center;
}

.step-title {
  font-size: 1.75rem;
  color: var(--calendar-text);
  margin-bottom: 0.5rem;
}

.current-month {
  color: var(--calendar-text-secondary);
  font-size: 1.1rem;
  font-weight: 500;
}

.calendar-container {
  background: var(--calendar-bg);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin: 0 1rem;
}

.calendar-grid {
  display: grid;
  gap: 4px;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 0.5rem;
}

.day-header {
  text-align: center;
  color: var(--calendar-text-secondary);
  font-weight: 500;
  padding: 0.75rem 0.5rem;
  font-size: 0.9rem;
}

.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.calendar-day {
  position: relative;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  color: var(--calendar-text);
  background-color: transparent;
  border: 2px solid transparent;

  &:hover:not(.disabled) {
    transform: scale(1.05);
    z-index: 1;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &.current-month:not(.disabled) {
    background-color: #f7fafc;
  }

  &.available:not(.selected):hover {
    border-color: var(--calendar-primary);
  }
}

.availability-indicator {
  position: absolute;
  bottom: 4px;
  left: 0;
  right: 0;
  height: 4px;
  display: flex;
  justify-content: center;
}

.availability-bar {
  width: 70%;
  height: 100%;
  background-color: var(--calendar-success);
  border-radius: 2px;
  opacity: 0.8;
}

.selected-check {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  background-color: var(--calendar-success);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  animation: popIn 0.2s ease;
}

.selected-check svg path {
  fill: var(--text-deep-green);
}

.calendar-day.selected {
  background-color: var(--calendar-success);
  color: white;
  border-color: var(--calendar-success-dark);
  
  .availability-bar {
    display: none;
  }
}
/* Current month dates */
.calendar-day.current-month:not(.disabled) {
  background-color: rgba(245, 250, 245, 0.5); /* Light green background */
}

.disabled {
  background-color: #f8fafc;
  cursor: not-allowed;
  opacity: 0.5;
}

@keyframes popIn {
  0% { transform: translate(-50%, -50%) scale(0); }
  90% { transform: translate(-50%, -50%) scale(1.1); }
  100% { transform: translate(-50%, -50%) scale(1); }
}

.navigation-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding: 0 1rem;
  gap: 1rem; /* Add gap between buttons */
}

/* Custom green button styling */
.btn-green {
  background-color: var(--text-deep-green);
  border-color: var(--text-deep-green);
  color: white;
}

.btn-green:hover, 
.btn-green:focus, 
.btn-green:active {
  background-color: var(--text-deep-green);
  border-color: var(--text-deep-green);
  filter: brightness(1.1);
  color: white;
}

.btn-green:disabled {
  background-color: var(--text-deep-green);
  border-color: var(--text-deep-green);
  opacity: 0.65;
  color: white;
}

.btn-smooth-green {
  position: relative;
  transition: all 0.3s ease, transform 0.2s ease;
  overflow: hidden;
}

.btn-smooth-green::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: translateX(-100%);
}

.btn-smooth-green:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(42, 77, 58, 0.3);
}

.btn-smooth-green:hover::before {
  transform: translateX(100%);
  transition: transform 0.9s ease;
}

.loading-state {
  padding: 2rem;
  text-align: center;
}
.day-number{
  color:#000;
}
</style>