<template>
  <form @submit.prevent="onSubmit" class="auth-form">
    <slot />
    <div v-if="error" class="error">{{ error }}</div>
    <div class="form-group">
      <label for="email">Email</label>
      <input v-model="email" id="email" type="email" required />
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input v-model="password" id="password" type="password" required minlength="8" />
    </div>
    <slot name="extra-fields" />
    <button type="submit" :disabled="loading">{{ submitLabel }}</button>
  </form>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  submitLabel: { type: String, default: 'Submit' },
  error: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  initialEmail: { type: String, default: '' },
  initialPassword: { type: String, default: '' }
})
const emit = defineEmits(['submit'])

const email = ref(props.initialEmail)
const password = ref(props.initialPassword)

function onSubmit() {
  emit('submit', { email: email.value, password: password.value })
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
