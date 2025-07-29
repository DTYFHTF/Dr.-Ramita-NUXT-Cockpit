<template>
  <form @submit.prevent="onSubmit" class="auth-form">
    <slot />
    <div v-if="error" class="form-error">{{ error }}</div>
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
      <label for="password" class="form-label">Password<span class="required">*</span></label>
      <input 
        v-model="password" 
        id="password" 
        type="password" 
        class="form-input"
        placeholder="Enter your password"
        required 
        minlength="8" 
      />
    </div>
    <slot name="extra-fields" />
    <button type="submit" class="btn btn-smooth-success" :disabled="loading">{{ submitLabel }}</button>
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
