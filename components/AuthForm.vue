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
    <button type="submit" class="btn-smooth-primary" :disabled="loading">{{ submitLabel }}</button>
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

<style scoped lang="scss">
.auth-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--background-white);
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(var(--color-primary-rgb), 0.08);
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}
input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--background-white);
  color: var(--text-primary);
}
button {
  width: 100%;
}
button:disabled {
  background: var(--color-muted);
}
.error {
  color: var(--color-error);
  margin-bottom: 1rem;
  text-align: center;
}
</style>
