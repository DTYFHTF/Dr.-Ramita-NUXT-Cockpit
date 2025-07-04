<template>
  <form @submit.prevent="submitForm" class="event-registration-form">
    <div class="form-group">
      <label for="name">Name<span class="required">*</span></label>
      <input v-model="form.name" id="name" type="text" required maxlength="255" :disabled="loading" />
    </div>
    <div class="form-group">
      <label for="email">Email<span class="required">*</span></label>
      <input v-model="form.email" id="email" type="email" required maxlength="255" :disabled="loading" />
    </div>
    <div class="form-group">
      <label for="phone">Phone</label>
      <input v-model="form.phone" id="phone" type="text" maxlength="20" :disabled="loading" />
    </div>
    <div v-if="error" class="form-error">{{ error }}</div>
    <button type="submit" class="book-now-btn" :disabled="loading">
      {{ loading ? 'Registering...' : 'Register' }}
    </button>
  </form>
  <BaseModal :show="showModal" @close="closeModal">
    <div class="text-center py-3">
      <h3 class="mb-3">Registration Successful!</h3>
      <p>{{ success }}</p>
      <button class="btn btn-smooth-primary mt-3" @click="closeModal">Close</button>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import { useFetch } from '#app'
import BaseModal from './BaseModal.vue'

const props = defineProps({
  eventId: {
    type: [String, Number],
    required: false
  },
  eventSlug: {
    type: String,
    required: true
  }
})

const form = ref({
  name: '',
  email: '',
  phone: ''
})
const loading = ref(false)
const error = ref('')
const success = ref('')
const showModal = ref(false)

const submitForm = async () => {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    // Use slug for registration endpoint
    const { data, error: fetchError } = await useFetch(`api/events/${props.slug}/register`, {
      method: 'POST',
      body: form.value,
    })
    if (fetchError.value) {
      error.value = fetchError.value.data?.message || 'Registration failed.'
    } else if (data.value?.message) {
      success.value = data.value.message
      form.value = { name: '', email: '', phone: '' }
      showModal.value = true
    }
  } catch (e) {
    error.value = 'Registration failed.'
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showModal.value = false
}
</script>

<style lang="scss" scoped>
.event-registration-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
input[type="text"],
input[type="email"] {
  padding: 0.5rem 0.75rem;
  border: 1px solid $border-color;
  border-radius: 6px;
  font-size: 1rem;
  background: #fff;
  color: $text-primary;
}
input:disabled {
  background: $background-light;
}
.required {
  color: $color-secondary;
  margin-left: 0.25rem;
}
.form-error {
  color: $text-error;
  font-size: 0.95rem;
}
.form-success {
  color: $color-primary;
  font-size: 0.95rem;
}
.book-now-btn {
  @include primary-button;
  width: 100%;
  border-radius: 6px;
  font-size: 1rem;
}
</style>
