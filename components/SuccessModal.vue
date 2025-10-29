<template>
  <BaseModal :show="show" @close="handleClose">
    <div class="success-modal text-center py-4">
      <!-- Animated Success Icon -->
      <div class="success-icon-wrapper mb-4">
        <div class="success-checkmark">
          <LucideIcon icon="mdi:check-circle" class="check-icon" />
        </div>
      </div>

      <!-- Dynamic Title based on type -->
      <h3 class="success-title mb-3">
        {{ title }}
      </h3>

      <!-- Creative subtitle based on type -->
      <p class="success-subtitle mb-4" v-if="subtitle">
        {{ subtitle }}
      </p>

      <!-- Additional message from backend -->
      <p class="success-message text-muted mb-4" v-if="message">
        {{ message }}
      </p>

      <!-- Action Button -->
      <button 
        class="btn btn-smooth-primary px-5 d-block mx-auto" 
        @click="handleClose"
      >
        {{ actionText }}
      </button>
    </div>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from './BaseModal.vue'
import LucideIcon from './LucideIcon.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'enrollment', // 'enrollment' or 'registration'
    validator: (value) => ['enrollment', 'registration'].includes(value)
  },
  message: {
    type: String,
    default: ''
  },
  actionText: {
    type: String,
    default: 'Got it!'
  }
})

const emit = defineEmits(['close'])

// Creative titles and subtitles based on type
const title = computed(() => {
  return props.type === 'enrollment' 
    ? '🎉 You\'re All Set!'
    : '🎊 Registration Confirmed!'
})

const subtitle = computed(() => {
  return props.type === 'enrollment'
    ? 'Your learning journey begins now. Check your email for course details!'
    : 'We\'re excited to see you at the event. Check your email for event details!'
})

const handleClose = () => {
  emit('close')
}
</script>

<style scoped lang="scss">
.success-modal {
  padding: 2rem 1rem;
}

.success-icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.success-checkmark {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-success) 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
  animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.check-icon {
  color: white;
  font-size: 2.5rem;
  animation: checkIn 0.6s ease 0.2s both;
}

.success-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  animation: fadeInUp 0.5s ease 0.3s both;
}

.success-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  animation: fadeInUp 0.5s ease 0.4s both;
}

.success-message {
  font-size: 0.95rem;
  color: var(--text-muted);
  font-style: italic;
  animation: fadeInUp 0.5s ease 0.5s both;
}

// Animations
@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes checkIn {
  0% {
    transform: scale(0) rotate(-45deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0);
    opacity: 1;
  }
}

@keyframes fadeInUp {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

// Responsive
@media (max-width: 576px) {
  .success-title {
    font-size: 1.5rem;
  }

  .success-subtitle {
    font-size: 1rem;
  }

  .success-checkmark {
    width: 60px;
    height: 60px;
  }

  .check-icon {
    font-size: 2rem;
  }
}
</style>
