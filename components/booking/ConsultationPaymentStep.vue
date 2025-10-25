<template>
  <div class="consultation-payment-step">
    <div class="step-header mb-4">
      <h2>Complete Payment</h2>
      <p class="step-subtitle">Secure your consultation booking</p>
    </div>

    <PaymentStep
      payable-type="App\Models\Consultation"
      :payable-id="consultationId"
      :amount-cents="consultationFee"
      title="Consultation Fee"
      :description="`Payment for consultation with ${doctorName}`"
      :customer-name="bookingStore.formData.name"
      :customer-email="bookingStore.formData.email"
      :customer-phone="bookingStore.formData.phone"
      payment-description="Ayurveda Consultation Booking"
      :ttl-minutes="15"
      :show-back-button="true"
      @success="handlePaymentSuccess"
      @error="handlePaymentError"
      @cancel="handlePaymentCancel"
      @back="goBack"
    >
      <template #details>
        <div class="consultation-details">
          <div class="detail-item">
            <LucideIcon icon="mdi:calendar" :size="20" />
            <span>{{ formattedDate }}</span>
          </div>
          <div class="detail-item">
            <LucideIcon icon="mdi:clock-outline" :size="20" />
            <span>{{ formattedTime }}</span>
          </div>
          <div class="detail-item">
            <LucideIcon icon="mdi:stethoscope" :size="20" />
            <span>{{ doctorName }}</span>
          </div>
        </div>
      </template>
    </PaymentStep>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { parseISO, format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { useBookingStore } from '~/stores/booking'
import { useDoctorStore } from '~/stores/doctorStore'
import { useUserStore } from '~/stores/user'
import PaymentStep from '~/components/PaymentStep.vue'

const bookingStore = useBookingStore()
const doctorStore = useDoctorStore()
const userStore = useUserStore()
const { getUserTimezone } = useTimezone()

const userTimezone = ref(getUserTimezone())

// Get consultation ID from store
const consultationId = computed(() => bookingStore.consultationId)

// Get doctor details
const selectedDoctor = computed(() => {
  return doctorStore.getDoctorById(bookingStore.formData.doctorId)
})

const doctorName = computed(() => {
  return selectedDoctor.value?.name || 'Dr. Ramita Maharjan'
})

// Consultation fee from doctor (already in rupees as decimal in DB)
// PaymentStep expects amount in paise, so we need to convert
const consultationFee = computed(() => {
  const feeInRupees = selectedDoctor.value?.consultation_fee || 499
  // Convert rupees to paise (multiply by 100)
  // Database stores as decimal: 1000.00 rupees = 100000 paise
  return Math.round(feeInRupees * 100)
})

// Format date and time
const formattedDate = computed(() => {
  if (!bookingStore.formData.time?.utc?.start) return 'Not selected'
  
  try {
    const utcDate = new Date(bookingStore.formData.time.utc.start)
    const patientDate = toZonedTime(utcDate, userTimezone.value)
    return format(patientDate, 'EEE, d MMM yyyy')
  } catch (error) {
    console.error('Error formatting date:', error)
    return format(parseISO(bookingStore.formData.date), 'EEE, d MMM yyyy')
  }
})

const formattedTime = computed(() => {
  if (!bookingStore.formData.time?.userTime) return 'Not selected'
  const { start, end } = bookingStore.formData.time.userTime
  return `${formatTime(start)} - ${formatTime(end)}`
})

const formatTime = (time) => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours, 10)
  return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`
}

// Handle payment success
const handlePaymentSuccess = (result) => {
  console.log('Payment successful:', result)
  
  // Store payment ID
  if (result.payment_id) {
    bookingStore.setPaymentId(result.payment_id)
  }
  
  // Move to success step
  bookingStore.nextStep()
}

// Handle payment error
const handlePaymentError = (error) => {
  console.error('Payment failed:', error)
  // Error is already shown by PaymentStep component
  // You can add additional error handling here if needed
}

// Handle payment cancel
const handlePaymentCancel = () => {
  console.log('Payment cancelled by user')
  // User can retry payment or go back
}

// Go back to summary
const goBack = () => {
  bookingStore.prevStep()
}
</script>

<style lang="scss" scoped>
.consultation-payment-step {
  max-width: 600px;
  margin: 0 auto;
  color: var(--text-primary);
}

.step-header {
  text-align: center;
  margin-bottom: 2rem;
  
  h2 {
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }
  
  .step-subtitle {
    color: var(--text-secondary);
  }
}

.consultation-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(var(--color-primary-rgb, 42,77,58), 0.05);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-primary);
  font-size: 1rem; // Control base font size for icons
  
  :deep(.icon-wrapper) {
    font-size: 20px; // Set icon size explicitly
    flex-shrink: 0;
  }
  
  :deep(svg) {
    color: var(--color-primary);
  }
  
  span {
    font-weight: 500;
    font-size: 1rem; // Keep text at normal size
  }
}
</style>
