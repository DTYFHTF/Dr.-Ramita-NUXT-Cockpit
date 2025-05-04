import { defineStore } from 'pinia'

export const useBookingStore = defineStore('booking', {
  state: () => ({
    currentStep: 1,
    formData: {
      date: '',
      time: null as { start: string, end: string } | null,
      name: '',
      email: '',
      phone: '',
      notes: ''
    },
  }),
  actions: {
    nextStep() {
      this.currentStep = Math.min(this.currentStep + 1, 6)
    },
    prevStep() {
      this.currentStep = Math.max(this.currentStep - 1, 1)
    },
    resetForm() {
      this.formData = {
        date: '',
        time: null,
        name: '',
        email: '',
        phone: '',
        notes: ''
      }
      this.currentStep = 1
    },
    setStep(step: number) {
      this.currentStep = Math.max(1, Math.min(step, 6))
    }
  }
})