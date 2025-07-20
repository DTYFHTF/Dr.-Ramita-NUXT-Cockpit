import { defineStore } from 'pinia'
import type { Doctor } from '@/types/index';


export const useDoctorStore = defineStore('doctor', {
  state: () => ({
    doctors: [] as Doctor[],
    selectedDoctor: null as Doctor | null,
    currentDoctor: null as Doctor | null,
    loading: false,
    error: null as string | null
  }),
  
  getters: {
    getSelectedDoctor: (state) => state.selectedDoctor,
    getCurrentDoctor: (state) => state.currentDoctor,
    getDoctorById: (state) => (id: number) => 
      state.doctors.find(doctor => doctor.id === id),
    getDoctorBySlug: (state) => (slug: string) => 
      state.doctors.find(doctor => doctor.slug === slug || doctor.id.toString() === slug)
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
              // ...existing code...
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

    async fetchDoctorBySlug(slug: string): Promise<Doctor | null> {
      this.loading = true
      this.error = null
      try {
        // First check if doctor is already in the store
        const existingDoctor = this.getDoctorBySlug(slug)
        if (existingDoctor) {
          this.currentDoctor = existingDoctor
          return existingDoctor
        }

        const config = useRuntimeConfig()
        const response = await $fetch<any>(
          `${config.public.apiBase}/doctors/${slug}`,
          {
            headers: {
              Accept: 'application/json'
              // ...existing code...
            }
          }
        )

        let doctor: Doctor
        if (response && response.data) {
          doctor = response.data
        } else if (response && response.id) {
          doctor = response
        } else {
          throw new Error('Doctor not found')
        }

        this.currentDoctor = doctor
        
        // Update or add to doctors array
        const index = this.doctors.findIndex(d => d.id === doctor.id)
        if (index >= 0) {
          this.doctors[index] = doctor
        } else {
          this.doctors.push(doctor)
        }

        return doctor
      } catch (err: any) {
        this.error = err.message || 'Failed to load doctor'
        console.error('Doctor fetch error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },
    
    selectDoctor(doctor: Doctor) {
      this.selectedDoctor = doctor
    },
    
    clearSelection() {
      this.selectedDoctor = null
    },

    clearCurrentDoctor() {
      this.currentDoctor = null
    }
  }
})