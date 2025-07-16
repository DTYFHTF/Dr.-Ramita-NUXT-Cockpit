<template>
  <div class="booking-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <!-- Page Header -->
          <div class="booking-header text-center mb-5">
            <h1 class="page-title">Book Your Consultation</h1>
            <p class="page-subtitle">
              Schedule a consultation with our expert Ayurvedic practitioners
            </p>
          </div>

          <!-- Booking Wizard -->
          <BookingWizard />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useBookingStore } from '@/stores/booking';
import { useDoctorStore } from '@/stores/doctorStore';

// Meta tags
useHead({
  title: 'Book Consultation - Schedule Your Ayurvedic Consultation',
  meta: [
    {
      name: 'description',
      content: 'Book a consultation with our certified Ayurvedic doctors. Easy online booking with flexible scheduling options.'
    }
  ]
});

const route = useRoute();
const bookingStore = useBookingStore();
const doctorStore = useDoctorStore();

// Check if doctor ID is passed via query params (from doctor profile page)
onMounted(async () => {
  const doctorId = route.query.doctor;
  
  if (doctorId) {
    // If doctor ID is provided, pre-select the doctor
    const doctor = doctorStore.getDoctorById(parseInt(doctorId as string));
    if (doctor) {
      bookingStore.formData.doctorId = doctor.id;
      doctorStore.selectDoctor(doctor);
      
      // Skip doctor selection step if doctor is already selected
      if (bookingStore.currentStep === 1) {
        bookingStore.nextStep();
      }
    } else {
      // If doctor not found in store, try to fetch all doctors first
      if (doctorStore.doctors.length === 0) {
        await doctorStore.fetchDoctors();
        const fetchedDoctor = doctorStore.getDoctorById(parseInt(doctorId as string));
        if (fetchedDoctor) {
          bookingStore.formData.doctorId = fetchedDoctor.id;
          doctorStore.selectDoctor(fetchedDoctor);
          if (bookingStore.currentStep === 1) {
            bookingStore.nextStep();
          }
        }
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.booking-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--background-light) 0%, white 50%, var(--background-light) 100%);
  padding: 2rem 0;
}

.booking-header {
  margin-bottom: 3rem;
  
  .page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 1rem;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .page-subtitle {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin: 0;
  }
}

@media (max-width: 768px) {
  .booking-page {
    padding: 1rem 0;
  }
  
  .booking-header {
    margin-bottom: 2rem;
    
    .page-title {
      font-size: 2rem;
    }
    
    .page-subtitle {
      font-size: 1rem;
    }
  }
}
</style>
