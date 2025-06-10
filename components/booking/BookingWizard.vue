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
import DateStep from './DateStep.vue'
import TimeStep from './TimeStep.vue'
import DetailsStep from './DetailsStep.vue'
import SummaryStep from './SummaryStep.vue'
import SuccessStep from './SuccessStep.vue'

const store = useBookingStore()

const steps = [
  { number: 1, label: 'Select Date' },
  { number: 2, label: 'Choose Time' },
  { number: 3, label: 'Your Details' },
  { number: 4, label: 'Confirmation' }
]

const stepComponents = [DateStep, TimeStep, DetailsStep, SummaryStep, SuccessStep]

const currentStepComponent = computed(() => {
  return stepComponents[store.currentStep - 1] || DateStep
})
</script>

<style scoped lang="scss">
.booking-wizard {
  padding: 2rem 1rem;
  background: rgba($background-light,0.1);
}

.wizard-container {
  max-width: 800px;
  margin: 0 auto;
}

.progress-indicator {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.step-indicator {
  text-align: center;
  position: relative;
}

.step-indicator:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 20px;
  left: 50%;
  right: -50%;
  height: 2px;
  background: $background-light;
  z-index: 0;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: $background-light;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
  font-weight: 600;
  color: #64748b;
  position: relative;
  z-index: 1;
}

.step-indicator.active .step-number {
  background-color: #2c7a7b;
  color: white;
}

.step-indicator.completed .step-number {
  background-color: #48bb78;
  color: white;
}

.step-label {
  font-size: 0.875rem;
  color: #64748b;
}

.step-content {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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