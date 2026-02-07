<template>
  <div class="form-group">
    <label v-if="label" :for="inputId" class="form-label">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>
    
    <textarea
      v-if="type === 'textarea'"
      :id="inputId"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :rows="rows || 3"
      :class="['form-control', { 'is-invalid': error }]"
    ></textarea>
    
    <input
      v-else
      :id="inputId"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :min="min"
      :max="max"
      :class="['form-control', { 'is-invalid': error }]"
    />
    
    <small v-if="helperText" class="form-text text-muted">{{ helperText }}</small>
    <span v-if="error" class="text-danger small">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string | number;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  rows?: number;
  min?: string | number;
  max?: string | number;
  id?: string;
}>();

defineEmits<{
  'update:modelValue': [value: string]
}>();

const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`);
</script>

<style scoped lang="scss">
.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text-primary);
  background-color: var(--surface-primary);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 0.2rem rgba(var(--accent-rgb), 0.25);
  }

  &::placeholder {
    color: var(--text-muted);
    opacity: 0.8;
  }

  &.is-invalid {
    border-color: var(--color-error);
    
    &:focus {
      box-shadow: 0 0 0 0.2rem rgba(239, 68, 68, 0.25);
    }
  }

  &:disabled {
    background-color: var(--text-footer);
    cursor: not-allowed;
    opacity: 0.6;
  }
}

textarea.form-control {
  resize: vertical;
}

.form-text {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
}

.text-danger {
  color: var(--color-error);
  display: block;
  margin-top: 0.25rem;
}
</style>
