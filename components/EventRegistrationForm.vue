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
</template>

<script setup>
import { ref } from 'vue'
import { useApiLaravel } from '@/composables/useApi.js'

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

const emit = defineEmits(['registration-success'])

const form = ref({
  name: '',
  email: '',
  phone: ''
})
const loading = ref(false)
const error = ref('')

const submitForm = async () => {
  error.value = ''
  loading.value = true
  try {
    const config = useRuntimeConfig()
    const baseUrl = config.public.apiBase
    const endpoint = `events/${props.eventSlug}/register`;
    const response = await $fetch(`${baseUrl}/${endpoint}`, {
      method: 'POST',
      body: form.value,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    if (response?.message) {
      form.value = { name: '', email: '', phone: '' };
      // Emit success event to parent component
      emit('registration-success', response.message);
    }
  } catch (e) {
    // Laravel returns 422 for validation errors, which $fetch throws as an error
    if (e?.data?.message) {
      error.value = e.data.message;
    } else if (e?.data?.errors) {
      // Show first validation error if available
      const firstError = Object.values(e.data.errors)[0];
      error.value = Array.isArray(firstError) ? firstError[0] : firstError;
    } else {
      error.value = 'Registration failed.';
    }
  } finally {
    loading.value = false;
  }
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
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
  background: var(--background-white);
  color: var(--text-primary);
}
input:disabled {
  background: var(--background-light);
}
.required {
  color: var(--color-secondary);
  margin-left: 0.25rem;
}
.form-error {
  color: var(--text-error);
  font-size: 0.95rem;
}
.form-success {
  color: var(--color-primary);
  font-size: 0.95rem;
}
.book-now-btn {
  @include primary-button;
  width: 100%;
  border-radius: 6px;
  font-size: 1rem;
}
</style>
