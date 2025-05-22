<template>
  <form @submit.prevent="onSubmit" class="auth-form">
    <div class="form-group">
      <label for="first_name">First Name</label>
      <input v-model="firstName" id="first_name" type="text" required />
    </div>
    <div class="form-group">
      <label for="last_name">Last Name</label>
      <input v-model="lastName" id="last_name" type="text" required />
    </div>
    <div class="form-group">
      <label for="email">Email</label>
      <input v-model="email" id="email" type="email" required />
    </div>
    <div class="form-group">
      <label for="phone">Phone</label>
      <input v-model="phone" id="phone" type="tel" required />
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input v-model="password" id="password" type="password" required minlength="8" />
    </div>
    <div class="form-group">
      <label for="password_confirmation">Confirm Password</label>
      <input v-model="passwordConfirmation" id="password_confirmation" type="password" required minlength="8" />
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <button type="submit" :disabled="loading">{{ submitLabel }}</button>
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

<style scoped>
.auth-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
}
input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  width: 100%;
  padding: 0.75rem;
  background: #2d8f6f;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}
button:disabled {
  background: #aaa;
}
.error {
  color: #c00;
  margin-bottom: 1rem;
  text-align: center;
}
</style>
