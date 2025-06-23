import { defineStore } from 'pinia'

interface Doctor {
  name: string
  available_days: string[]
  working_hours: Array<{
    day: string
    start: string
    end: string
  }>
  // Add other fields if needed
}

export const useDoctorStore = defineStore('doctor', {
  state: () => ({
    doctors: [] as Doctor[],
    loading: false,
    error: null as string | null
  }),
  
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
    }
  }
})