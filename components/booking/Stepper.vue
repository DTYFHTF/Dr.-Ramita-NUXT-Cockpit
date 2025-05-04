<template>
  <div>
    <h1>Booking Process</h1>
    <component :is="currentComponent" v-show="store.currentStep >= 1 && store.currentStep <= 6" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBookingStore } from '~/stores/booking'
import DateStep from './DateStep.vue'
import TimeStep from './TimeStep.vue'
// Import other steps as needed

const store = useBookingStore()

const currentComponent = computed(() => {
  switch(store.currentStep) {
    case 1: return DateStep
    case 2: return TimeStep
    // Add other steps here
    default: return DateStep
  }
})
</script>