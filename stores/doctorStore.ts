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
        
        // Temporary: Add mock data for testing
        this.doctors = [
          {
            id: 1,
            name: "Dr. Sarah Johnson",
            slug: "dr-sarah-johnson",
            specialization: "General Practice",
            experience_years: 10,
            bio: "Experienced Ayurvedic practitioner specializing in holistic health approaches.",
            languages: ["English", "Hindi"],
            location: "New York",
            consultation_fee: 150,
            available_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            working_hours: [
              { day: "Monday", start: "09:00", end: "17:00" }
            ],
            consultation_modes: ["online", "phone", "in_person"],
            is_active: true,
            rating: 4.8,
            reviews_count: 125
          },
          {
            id: 2,
            name: "Dr. Raj Patel",
            slug: "dr-raj-patel",
            specialization: "Herbal Medicine",
            experience_years: 15,
            bio: "Expert in traditional Ayurvedic herbal treatments and natural healing.",
            languages: ["English", "Gujarati", "Hindi"],
            location: "California",
            consultation_fee: 200,
            available_days: ["Monday", "Wednesday", "Friday"],
            working_hours: [
              { day: "Monday", start: "10:00", end: "16:00" }
            ],
            consultation_modes: ["online", "in_person"],
            is_active: true,
            rating: 4.9,
            reviews_count: 89
          }
        ];
        // console.log('Using mock data:', this.doctors);
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
              // Add Authorization if needed
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