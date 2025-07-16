<template>
  <div class="date-step">
    <div class="step-header mb-5">
      <h2>Schedule your consultation</h2>
      <div v-if="selectedDoctor" class="selected-doctor-info">
        <p class="selected-doctor">with {{ selectedDoctor.name }}</p>
      </div>
      <div class="calendar-month-nav">
        <button class="month-nav-btn" @click="changeMonth(-1)" aria-label="Previous Month">&#8592;</button>
        <p class="current-month">{{ currentMonth }}</p>
        <button class="month-nav-btn" @click="changeMonth(1)" aria-label="Next Month">&#8594;</button>
      </div>
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

const selectedDoctor = computed(() => {
  if (!bookingStore.formData.doctorId) return null
  return doctorStore.getDoctorById(bookingStore.formData.doctorId)
})

const currentDate = ref(new Date()) // Use current date dynamically
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
  const today = new Date();
  const todayDate = format(today, 'yyyy-MM-dd');
  days.forEach(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    dates.push({
      date: dateStr,
      day: format(date, 'd'),
      weekday: format(date, 'EEE'),
      isPast: dateStr < todayDate // Mark if this date is in the past
    })
  })

  return dates
})

const isDateAvailable = (date) => {
  if (!date.date || !bookingStore.formData.doctorId) return false
  
  const selectedDoctor = doctorStore.getDoctorById(bookingStore.formData.doctorId)
  if (!selectedDoctor) return false
  
  // Only allow available days that are today or in the future
  return !date.isPast && selectedDoctor.available_days.includes(date.weekday)
}

const isDateSelected = (date) => {
  if (!bookingStore.formData.date || !date.date) return false;
  return bookingStore.formData.date === date.date;
}

const selectDate = (date) => {
  if (isDateAvailable(date)) {
    bookingStore.formData.date = date.date;
  }
}

// Add month navigation
const changeMonth = (direction) => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + direction)
  currentDate.value = newDate
}

onMounted(() => {
  if (!doctors.value.length) {
    doctorStore.fetchDoctors();
  }
  
  setTimeout(() => {
    const today = new Date();
    const todayDate = format(today, 'yyyy-MM-dd');
    const availableDateObj = visibleDates.value.find(d => {
      if (!d.date) return false;
      return d.date >= todayDate && isDateAvailable(d);
    });
    if (availableDateObj) {
      bookingStore.formData.date = availableDateObj.date;
    } else {
      bookingStore.formData.date = '';
    }
  }, 0);
})
</script>

<style scoped>
.date-step {
  max-width: 700px;
  margin: 0 auto;
  color: var(--text-primary);
}

.step-header {
  text-align: center;
  margin-bottom: 2rem;
  
  .selected-doctor-info {
    margin-bottom: 1rem;
    
    .selected-doctor {
      color: var(--color-primary);
      font-weight: 500;
      font-size: 1.1rem;
    }
  }
}

.step-title {
  font-size: 1.75rem;
  color: var(--calendar-text);
  margin-bottom: 0.5rem;
}

.calendar-container {
  background: var(--background-white);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: var(--card-shadow);
}

.calendar-grid {
  width: 100%;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.day-header {
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-secondary);
  padding: 0.5rem;
}

.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.calendar-day {
  position: relative;
  min-height: 60px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--background-white);
  
  &:hover:not(.disabled) {
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(var(--color-primary-rgb, 42,77,58), 0.1);
  }
}

.day-number {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.availability-indicator {
  position: relative;
  width: 16px;
  height: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.availability-bar {
  width: 70%;
  height: 100%;
  background-color: var(--color-secondary);
  border-radius: 2px;
  opacity: 0.8;
}

.selected-check {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--text-white, #fff);
  background-color: var(--color-primary);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--card-shadow);
  animation: popIn 0.2s ease;
}

.selected-check svg path {
  fill: var(--text-white);
}

.calendar-day.selected {
  background-color: var(--color-primary);
  color: var(--text-white);
  border-color: var(--color-primary);
  
  .availability-bar {
    display: none;
  }
  
  .day-number {
    color: var(--text-primary);
    font-weight: 600;
  }
}
/* Current month dates */
.calendar-day.current-month:not(.disabled) {
  background-color: rgba(var(--background-light-rgb), 0.5); /* Light green background */
}

.disabled {
  background-color: var(--background-light);
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
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--text-white, #fff);
}

.btn-green:hover, 
.btn-green:focus, 
.btn-green:active {
  background-color: var(--primary-dark, var(--color-primary));
  border-color: var(--primary-dark, var(--color-primary));
  filter: brightness(1.1);
  color: var(--text-white, #fff);
}

.btn-green:disabled {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  opacity: 0.65;
  color: var(--text-white, #fff);
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
  background: linear-gradient(90deg, transparent, rgba(var(--shimmer-rgb), 0.2), transparent);
  transform: translateX(-100%);
}

.btn-smooth-green:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.3);
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
  color: var(--text-primary);
}
.calendar-month-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.month-nav-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 0.5rem;
  transition: color 0.2s;
}

.month-nav-btn:hover {
  color: var(--color-primary);
}

.current-month {
  color: var(--calendar-text-secondary);
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
}
</style>