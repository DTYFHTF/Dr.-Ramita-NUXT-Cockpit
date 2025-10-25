<template>
  <div class="payment-step">
    <!-- Header -->
    <div class="payment-header">
      <h3 class="text-2xl font-bold text-gray-800 mb-2">{{ title }}</h3>
      <p v-if="description" class="text-gray-600 mb-6">{{ description }}</p>
    </div>

    <!-- Payment Summary -->
    <div class="payment-summary bg-gray-50 rounded-lg p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <span class="text-gray-700 font-medium">Amount to Pay:</span>
        <span class="text-2xl font-bold text-green-600">{{ formattedAmount }}</span>
      </div>

      <!-- Additional details slot -->
      <slot name="details"></slot>

      <!-- TTL Timer -->
      <div v-if="expiresAt && !isPaid" class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <div class="flex items-center gap-2 text-sm text-yellow-800">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
          </svg>
          <span>Time remaining: {{ timeRemaining }}</span>
        </div>
      </div>
    </div>

    <!-- Payment Status -->
    <div v-if="paymentStatus === 'processing'" class="mb-6">
      <div class="flex items-center justify-center gap-3 p-4 bg-blue-50 rounded-lg">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span class="text-blue-700 font-medium">Processing payment...</span>
      </div>
    </div>

    <div v-if="paymentStatus === 'success'" class="mb-6">
      <div class="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
        <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <span class="text-green-700 font-medium">Payment successful!</span>
      </div>
    </div>

    <div v-if="paymentStatus === 'failed'" class="mb-6">
      <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-center gap-3 mb-2">
          <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <span class="text-red-700 font-medium">Payment failed</span>
        </div>
        <p v-if="errorMessage" class="text-sm text-red-600 ml-9">{{ errorMessage }}</p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="payment-actions flex gap-4">
      <button
        v-if="!isPaid && paymentStatus !== 'processing'"
        @click="initiatePayment"
        :disabled="isProcessing || isPaid"
        class="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <svg v-if="!isProcessing" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
        <div v-else class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        <span>{{ isProcessing ? 'Processing...' : 'Pay Now' }}</span>
      </button>

      <button
        v-if="showBackButton && !isPaid"
        @click="$emit('back')"
        :disabled="isProcessing"
        class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        Back
      </button>
    </div>

    <!-- Secure Payment Notice -->
    <div class="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
      </svg>
      <span>Secured by Razorpay | All transactions are encrypted</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePayment, type PaymentResult } from '~/composables/usePayment'

interface Props {
  payableType: string
  payableId: number
  amountCents: number
  title?: string
  description?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  paymentDescription?: string
  metadata?: Record<string, any>
  ttlMinutes?: number
  showBackButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Complete Payment',
  description: 'Please complete the payment to confirm your booking',
  ttlMinutes: 15,
  showBackButton: true,
})

const emit = defineEmits<{
  success: [paymentId: number]
  error: [error: string]
  cancel: []
  back: []
}>()

const paymentStatus = ref<'idle' | 'processing' | 'success' | 'failed'>('idle')
const errorMessage = ref<string | null>(null)
const expiresAt = ref<Date | null>(null)
const timeRemaining = ref<string>('')
let intervalId: NodeJS.Timeout | null = null

const { isProcessing, processPayment } = usePayment({
  onSuccess: (result: PaymentResult) => {
    paymentStatus.value = 'success'
    if (result.payment_id) {
      emit('success', result.payment_id)
    }
  },
  onError: (error: Error | string) => {
    paymentStatus.value = 'failed'
    errorMessage.value = typeof error === 'string' ? error : error.message
    emit('error', errorMessage.value || 'Payment failed')
  },
  onCancel: () => {
    paymentStatus.value = 'idle'
    emit('cancel')
  },
})

const formattedAmount = computed(() => {
  const amount = props.amountCents / 100
  return `₹${amount.toFixed(2)}`
})

const isPaid = computed(() => paymentStatus.value === 'success')

const initiatePayment = async () => {
  paymentStatus.value = 'processing'
  errorMessage.value = null

  await processPayment(
    props.payableType,
    props.payableId,
    props.amountCents,
    {
      customerName: props.customerName,
      customerEmail: props.customerEmail,
      customerPhone: props.customerPhone,
      description: props.paymentDescription,
      metadata: props.metadata,
      ttlMinutes: props.ttlMinutes,
    }
  )
}

const updateTimeRemaining = () => {
  if (!expiresAt.value) return

  const now = new Date()
  const diff = expiresAt.value.getTime() - now.getTime()

  if (diff <= 0) {
    timeRemaining.value = 'Expired'
    if (intervalId) {
      clearInterval(intervalId)
    }
    return
  }

  const minutes = Math.floor(diff / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  timeRemaining.value = `${minutes}:${seconds.toString().padStart(2, '0')}`
}

onMounted(() => {
  // Set expiration time
  expiresAt.value = new Date(Date.now() + props.ttlMinutes * 60000)
  
  // Start countdown timer
  updateTimeRemaining()
  intervalId = setInterval(updateTimeRemaining, 1000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<style scoped>
.payment-step {
  @apply max-w-2xl mx-auto;
}
</style>
