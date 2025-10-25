<template>
  <div class="payment-step">
    <!-- Payment Summary Card -->
    <div class="payment-card">
      <div class="card-header">
        <div class="header-icon">
          <LucideIcon icon="mdi:credit-card-outline" :size="32" />
        </div>
        <h3>{{ title }}</h3>
        <p v-if="description">{{ description }}</p>
      </div>

      <!-- Amount Display -->
      <div class="amount-section">
        <span class="amount-label">Total Amount</span>
        <span class="amount-value">{{ formattedAmount }}</span>
      </div>

      <!-- Additional details slot -->
      <div v-if="$slots.details" class="details-section">
        <slot name="details"></slot>
      </div>

      <!-- Timer -->
      <div v-if="expiresAt && !isPaid" class="timer-section">
        <LucideIcon icon="mdi:clock-outline" :size="18" />
        <span>Complete payment within {{ timeRemaining }}</span>
      </div>
    </div>

    <!-- Payment Status Messages -->
    <div v-if="paymentStatus === 'processing'" class="status-message processing">
      <div class="spinner"></div>
      <span>Processing your payment...</span>
    </div>

    <div v-if="paymentStatus === 'success'" class="status-message success">
      <LucideIcon icon="mdi:check-circle" :size="24" />
      <span>Payment completed successfully!</span>
    </div>

    <div v-if="paymentStatus === 'failed'" class="status-message error">
      <LucideIcon icon="mdi:alert-circle" :size="24" />
      <div class="error-content">
        <span class="error-title">Payment Failed</span>
        <p v-if="errorMessage">{{ errorMessage }}</p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="step-navigation">
      <button
        v-if="showBackButton && !isPaid"
        @click="$emit('back')"
        :disabled="isProcessing"
        class="btn btn-smooth-outline"
      >
        Back
      </button>

      <button
        v-if="!isPaid && paymentStatus !== 'processing'"
        @click="initiatePayment"
        :disabled="isProcessing || isPaid"
        class="btn btn-smooth-success"
      >
        <LucideIcon v-if="!isProcessing" icon="mdi:lock-check" :size="18" />
        <div v-else class="spinner-small"></div>
        <span>{{ isProcessing ? 'Processing...' : 'Proceed to Pay' }}</span>
      </button>
    </div>

    <!-- Security Notice -->
    <div class="security-notice">
      <LucideIcon icon="mdi:shield-check" :size="16" />
      <span>Secured by Razorpay • 256-bit SSL encryption</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePayment, type PaymentResult } from '@/composables/usePayment'

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

<style scoped lang="scss">
.payment-step {
  max-width: 600px;
  margin: 0 auto;
  color: var(--text-primary);
}

.payment-card {
  background: var(--background-white);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
  
  .header-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 1rem;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--text-secondary);
    font-size: 0.95rem;
  }
}

.amount-section {
  background: linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.05), rgba(var(--color-secondary-rgb), 0.05));
  border: 2px solid var(--color-primary);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  margin-bottom: 1.5rem;
  
  .amount-label {
    display: block;
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }
  
  .amount-value {
    display: block;
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-primary);
    font-family: $font-primary;
  }
}

.details-section {
  margin-bottom: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.timer-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 8px;
  color: #92400e;
  font-size: 0.875rem;
  font-weight: 500;
  
  :deep(svg) {
    color: #f59e0b;
  }
}

.status-message {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-weight: 500;
  
  &.processing {
    background: #dbeafe;
    border: 1px solid #60a5fa;
    color: #1e40af;
  }
  
  &.success {
    background: #d1fae5;
    border: 1px solid #34d399;
    color: #065f46;
    
    :deep(svg) {
      color: #10b981;
    }
  }
  
  &.error {
    background: #fee2e2;
    border: 1px solid #f87171;
    color: #991b1b;
    
    :deep(svg) {
      color: #dc2626;
      flex-shrink: 0;
    }
    
    .error-content {
      flex: 1;
      
      .error-title {
        display: block;
        font-weight: 600;
        margin-bottom: 0.25rem;
      }
      
      p {
        margin: 0;
        font-size: 0.875rem;
        color: #7f1d1d;
      }
    }
  }
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(30, 64, 175, 0.3);
  border-top-color: #1e40af;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner-small {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.step-navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.security-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  color: var(--text-secondary);
  font-size: 0.813rem;
  
  :deep(svg) {
    color: var(--color-primary);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .payment-card {
    padding: 1.5rem;
  }
  
  .amount-section {
    .amount-value {
      font-size: 2rem;
    }
  }
  
  .step-navigation {
    flex-direction: column;
    
    .btn {
      width: 100%;
    }
  }
}
</style>
