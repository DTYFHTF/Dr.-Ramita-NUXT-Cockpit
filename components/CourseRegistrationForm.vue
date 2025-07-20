<template>
  <form @submit.prevent="submitForm" class="course-registration-form">
    <div class="form-group">
      <label for="name" class="form-label">Name<span class="required">*</span></label>
      <input 
        v-model="form.name" 
        id="name" 
        type="text" 
        class="form-input"
        placeholder="Enter your full name"
        required 
        maxlength="255" 
        :disabled="loading" 
      />
    </div>
    <div class="form-group">
      <label for="email" class="form-label">Email<span class="required">*</span></label>
      <input 
        v-model="form.email" 
        id="email" 
        type="email" 
        class="form-input"
        placeholder="Enter your email address"
        required 
        maxlength="255" 
        :disabled="loading" 
      />
    </div>
    <div class="form-group">
      <label for="phone" class="form-label">Phone</label>
      <input 
        v-model="form.phone" 
        id="phone" 
        type="text" 
        class="form-input"
        placeholder="Enter your phone number"
        maxlength="20" 
        :disabled="loading" 
      />
    </div>
    <div v-if="error" class="form-error">{{ error }}</div>
    <button type="submit" class="btn btn-smooth-success" :disabled="loading">
      {{ loading ? 'Enrolling...' : 'Enroll' }}
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useApiLaravel } from '@/composables/useApi.js'

const props = defineProps({
  courseSlug: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['enrollment-success'])

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
    const endpoint = `courses/${props.courseSlug}/enroll`;
    const response = await $fetch(`${baseUrl}/${endpoint}`, {
      method: 'POST',
      body: { ...form.value },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    if (response?.message) {
      form.value = { name: '', email: '', phone: '' };
      // Emit success event to parent component
      emit('enrollment-success', response.message);
    }
  } catch (e) {
    if (e?.data?.errors) {
      error.value = Object.values(e.data.errors).flat().join(' ');
    } else if (e?.data?.message) {
      error.value = e.data.message;
    } else {
      error.value = 'Enrollment failed.';
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="scss" scoped>
.course-registration-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-error {
  color: var(--color-error);
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  border-left: 4px solid var(--color-error);
}

.form-success {
  color: var(--color-success);
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.75rem;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 8px;
  border-left: 4px solid var(--color-success);
}
</style>
