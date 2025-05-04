<template>
  <div class="calendar-day has-availability">
  5
  <div class="availability-indicator">
    <div class="availability-dot available"></div>
    <div class="availability-dot booked"></div>
  </div>
</div>
</template>

<style scoped>
.availability-indicator {
  --dot-size: 0.75rem;
  --available-color: theme('colors.green.500');
  --booked-color: theme('colors.gray.300');
  
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 0.5rem;
}

.availability-dot {
  width: var(--dot-size);
  height: var(--dot-size);
  border-radius: 50%;
  background-color: var(--available-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: 
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;
  position: absolute;
  bottom: calc(100% + 0.25rem);
  left: 50%;
  transform: translateX(-50%);
}

/* Optional: Different states */
.availability-dot.booked {
  background-color: var(--booked-color);
}

.availability-dot:hover {
  transform: translateX(-50%) scale(1.2);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  z-index: 1;
}

/* Calendar cell structure */
.calendar-day {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.calendar-day.has-availability::after {
  content: '';
  position: absolute;
  bottom: 0.25rem;
  width: var(--dot-size);
  height: var(--dot-size);
  background-color: var(--available-color);
  border-radius: 50%;
}

/* For multiple availability states */
.calendar-day.multiple-availability::after {
  display: flex;
  gap: 0.1rem;
  width: auto;
  height: auto;
  background-color: transparent;
}

.calendar-day.multiple-availability .availability-dot {
  position: static;
  transform: none;
  margin: 0 0.1rem;
}

/* Animation for available slots */
@keyframes pulse-available {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.availability-dot.available {
  animation: pulse-available 2s infinite;
}
</style>