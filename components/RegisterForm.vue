<template>
  <form @submit.prevent="onSubmit" class="auth-form">
    <div class="form-group">
      <label for="first_name" class="form-label">First Name<span class="required">*</span></label>
      <input 
        v-model="firstName" 
        id="first_name" 
        type="text" 
        class="form-input"
        placeholder="Enter your first name"
        required 
      />
    </div>
    <div class="form-group">
      <label for="last_name" class="form-label">Last Name<span class="required">*</span></label>
      <input 
        v-model="lastName" 
        id="last_name" 
        type="text" 
        class="form-input"
        placeholder="Enter your last name"
        required 
      />
    </div>
    <div class="form-group">
      <label for="email" class="form-label">Email<span class="required">*</span></label>
      <input 
        v-model="email" 
        id="email" 
        type="email" 
        class="form-input"
        placeholder="Enter your email address"
        required 
      />
    </div>
    <div class="form-group">
      <label for="phone" class="form-label">Phone<span class="required">*</span></label>
      <input 
        v-model="phone" 
        id="phone" 
        type="tel" 
        class="form-input"
        placeholder="Enter your phone number"
        required 
      />
    </div>
    <div class="form-group">
      <label for="password" class="form-label">Password<span class="required">*</span></label>
      <input 
        v-model="password" 
        id="password" 
        type="password" 
        class="form-input"
        placeholder="Enter your password (min 8 characters)"
        required 
        minlength="8" 
      />
    </div>
    <div class="form-group">
      <label for="password_confirmation" class="form-label">Confirm Password<span class="required">*</span></label>
      <input 
        v-model="passwordConfirmation" 
        id="password_confirmation" 
        type="password" 
        class="form-input"
        placeholder="Confirm your password"
        required 
        minlength="8" 
      />
    </div>
    <div v-if="error" class="form-error">{{ error }}</div>
    <button type="submit" class="btn btn-primary" :disabled="loading">{{ submitLabel }}</button>
  </form>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  submitLabel: { type: String, default: 'Register' },
  error: { type: String, default: '' },
  loading: { type: Boolean, default: false }
})
const emit = defineEmits(['submit'])

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const passwordConfirmation = ref('')

function onSubmit() {
  emit('submit', {
    first_name: firstName.value,
    last_name: lastName.value,
    email: email.value,
    phone: phone.value,
    password: password.value,
    password_confirmation: passwordConfirmation.value
  })
}
</script>

<style lang="scss" scoped>
.auth-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--background-white);
  border-radius: 12px;
  box-shadow: var(--card-shadow);
}

.btn {
  width: 100%;
  margin-top: 1rem;
}
</style>
