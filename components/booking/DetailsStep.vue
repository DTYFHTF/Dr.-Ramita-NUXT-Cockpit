<template>
  <div class="details-step">
    <div class="step-header mb-5">
      <h2 class="step-title">Your Information</h2>
      <p class="step-subtitle">Please provide your contact details</p>
    </div>

    <form @submit.prevent="handleSubmit" class="booking-form">
      <div class="form-group">
        <label>Full Name</label>
        <input
          v-model="form.name"
          type="text"
          required
          placeholder="Enter your full name"
        />
      </div>

      <div class="form-group">
        <label>Email Address</label>
        <input
          v-model="form.email"
          type="email"
          required
          placeholder="your.email@example.com"
        />
      </div>

      <div class="form-group">
        <label>Phone Number</label>
        <input
          v-model="form.phone"
          type="tel"
          required
          placeholder="+91 12345 67890"
        />
      </div>

      <div class="form-group">
        <label>Additional Notes (optional)</label>
        <textarea
          v-model="form.notes"
          rows="3"
          placeholder="Any special requirements or notes..."
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-outline-secondary btn-smooth-outline" @click="$emit('prev')">
          Back
        </button>
        <button type="submit" class="btn btn-primary btn-smooth-primary">
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
}

.booking-form {
  background: white;
  border-radius: 12px;
  /* padding: 1rem; */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-dark);
    font-weight: 500;
  }

  input,
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.1);
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