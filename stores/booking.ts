import { defineStore } from 'pinia'

export const useBookingStore = defineStore('booking', {
  state: () => ({
    currentStep: 1,
    consultationId: null as number | null,
    paymentId: null as number | null,
    formData: {
      doctorId: null as number | null,
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
      this.currentStep = Math.min(this.currentStep + 1, 7) // Updated to 7 steps
    },
    prevStep() {
      this.currentStep = Math.max(this.currentStep - 1, 1)
    },
    setConsultationId(id: number) {
      this.consultationId = id
    },
    setPaymentId(id: number) {
      this.paymentId = id
    },
    resetForm() {
      this.formData = {
        doctorId: null,
        date: '',
        time: null,
        name: '',
        email: '',
        phone: '',
        notes: ''
      }
      this.consultationId = null
      this.paymentId = null
      this.currentStep = 1
    },
    setStep(step: number) {
      this.currentStep = Math.max(1, Math.min(step, 7)) // Updated to 7 steps
    }
  }
})