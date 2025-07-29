<template>
  <section class="booking-wizard" id="book-consultation">
    <div class="wizard-container">
      <h1 class="text-center mb-4">Book Your Consultation</h1>
      
      <div class="progress-indicator">
        <div 
          v-for="step in steps"
          :key="step.number"
          class="step-indicator"
          :class="{ 
            'active': store.currentStep >= step.number,
            'completed': store.currentStep > step.number
          }"
        >
          <div class="step-number">{{ step.number }}</div>
          <div class="step-label">{{ step.label }}</div>
        </div>
      </div>

      <div class="step-content">
        <component 
          :is="currentStepComponent"
          @next="store.nextStep()"
          @prev="store.prevStep()"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useBookingStore } from '~/stores/booking'
import DoctorSelectionStep from './DoctorSelectionStep.vue'
import DateStep from './DateStep.vue'
import TimeStep from './TimeStep.vue'
import DetailsStep from './DetailsStep.vue'
import SummaryStep from './SummaryStep.vue'
import SuccessStep from './SuccessStep.vue'

const store = useBookingStore()

const steps = [
  { number: 1, label: 'Choose Doctor' },
  { number: 2, label: 'Select Date' },
  { number: 3, label: 'Choose Time' },
  { number: 4, label: 'Your Details' },
  { number: 5, label: 'Confirmation' }
]

const stepComponents = [DoctorSelectionStep, DateStep, TimeStep, DetailsStep, SummaryStep, SuccessStep]

const currentStepComponent = computed(() => {
  return stepComponents[store.currentStep - 1] || DateStep
})
</script>

<style scoped lang="scss">
.booking-wizard {
  padding: 2rem 1rem;
  background: var(--background-light);
  color: var(--text-primary);
}

.wizard-container {
  max-width: 800px;
  margin: 0 auto;
  
  h1 {
    color: var(--text-primary);
  }
}

.progress-indicator {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 1rem;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.step-indicator {
  text-align: center;
  position: relative;
  flex: 1;
  min-width: 120px;
  max-width: 140px;
}

.step-indicator:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 20px;
  left: 50%;
  right: -50%;
  height: 2px;
  background: var(--border-color);
  z-index: 0;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--background-white);
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
  font-weight: 600;
  color: var(--text-secondary);
  position: relative;
  z-index: 1;
}

.step-indicator.active .step-number {
  background-color: var(--color-primary);
  color: var(--text-white, #fff);
  border-color: var(--color-primary);
}

.step-indicator.completed .step-number {
  background-color: var(--color-secondary);
  color: var(--text-white, #fff);
  border-color: var(--color-secondary);
}

.step-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.step-content {
  background: var(--background-white);
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: var(--card-shadow);
  min-height: 400px;
}

@media (max-width: 768px) {
  .progress-indicator {
    grid-template-columns: 1fr;
  }
  
  .step-indicator:not(:last-child)::after {
    display: none;
  }
}
</style>