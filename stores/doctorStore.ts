import { defineStore } from 'pinia'

interface Doctor {
  id: number
  name: string
  specialization?: string
  experience?: string
  description?: string
  image?: string
  available_days: string[]
  working_hours: Array<{
    day: string
    start: string
    end: string
  }>
  consultation_fee?: number
  rating?: number
}

export const useDoctorStore = defineStore('doctor', {
  state: () => ({
    doctors: [] as Doctor[],
    selectedDoctor: null as Doctor | null,
    loading: false,
    error: null as string | null
  }),
  
  getters: {
    getSelectedDoctor: (state) => state.selectedDoctor,
    getDoctorById: (state) => (id: number) => 
      state.doctors.find(doctor => doctor.id === id)
  },
  
  actions: {
    async fetchDoctors() {
      this.loading = true
      this.error = null
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<any>(
          `${config.public.apiBase}/doctors`,
          {
            headers: {
              Accept: 'application/json'
              // Add Authorization if needed
            }
          }
        )

        if (Array.isArray(response)) {
          this.doctors = response;
        } else if (response && Array.isArray(response.data)) {
          this.doctors = response.data;
        } else {
          throw new Error('Invalid doctor data format')
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to load doctor data'
        console.error('Doctor fetch error:', err)
      } finally {
        this.loading = false
      }
    },
    
    selectDoctor(doctor: Doctor) {
      this.selectedDoctor = doctor
    },
    
    clearSelection() {
      this.selectedDoctor = null
    }
  }
})