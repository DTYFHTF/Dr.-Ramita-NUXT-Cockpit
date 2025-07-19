<template>
  <div class="details-step">
    <div class="step-header mb-5">
      <h2>Your Information</h2>
      <p class="step-subtitle">Please provide your contact details</p>
    </div>

    <form @submit.prevent="handleSubmit" class="booking-form">
      <div class="form-group">
        <label class="form-label">Full Name<span class="required">*</span></label>
        <input
          v-model="form.name"
          type="text"
          class="form-input"
          required
          placeholder="Enter your full name"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Email Address<span class="required">*</span></label>
        <input
          v-model="form.email"
          type="email"
          class="form-input"
          required
          placeholder="your.email@example.com"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Phone Number<span class="required">*</span></label>
        <input
          v-model="form.phone"
          type="tel"
          class="form-input"
          required
          placeholder="+91 12345 67890"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Share any information that might help us serve you better.</label>
        <textarea
          v-model="form.notes"
          class="form-textarea"
          rows="3"
          placeholder="Any special requirements or notes..."
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-outline" @click="$emit('prev')">
          Back
        </button>
        <button type="submit" class="btn btn-primary">
          Continue
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useBookingStore } from '~/stores/booking'

const store = useBookingStore()

const form = reactive({
  name: store.formData.name,
  email: store.formData.email,
  phone: store.formData.phone,
  notes: store.formData.notes
})

watch(form, (newVal) => {
  store.formData = { ...store.formData, ...newVal }
})

const handleSubmit = () => {
  store.nextStep()
}
</script>

<style lang="scss" scoped>
.details-step {
  max-width: 600px;
  margin: 0 auto;
  color: var(--text-primary);
}

.step-header {
  text-align: center;
  margin-bottom: 2rem;
  
  h2 {
    color: var(--text-primary);
  }
  
  .step-subtitle {
    color: var(--text-secondary);
  }
}

.booking-form {
  background: var(--background-white);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--card-shadow);
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
    font-weight: 500;
  }

  .required {
    color: var(--text-error, #ef4444);
  }

  input,
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    transition: border-color 0.2s ease;
    background: var(--background-white);
    color: var(--text-primary);

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb, 42,77,58), 0.1);
    }

    &::placeholder {
      color: var(--text-secondary);
    }
  }

  textarea {
    resize: vertical;
  }
}

.navigation-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  gap: 1rem; /* Add gap between buttons */
}
</style>