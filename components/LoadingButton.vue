<template>
  <button
    :type="type"
    :disabled="loading || disabled"
    :class="buttonClass"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
    <slot v-if="!loading"></slot>
    <span v-else>{{ loadingText }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'success' | 'danger' | 'outline' | 'secondary';
  loadingText?: string;
  fullWidth?: boolean;
}>();

defineEmits<{
  click: [event: MouseEvent]
}>();

const buttonClass = computed(() => {
  const classes = ['btn'];
  
  // Add variant class
  switch (props.variant) {
    case 'success':
      classes.push('btn-smooth-success');
      break;
    case 'danger':
      classes.push('btn-danger');
      break;
    case 'outline':
      classes.push('btn-smooth-outline');
      break;
    case 'secondary':
      classes.push('btn-secondary');
      break;
    default:
      classes.push('btn-smooth-primary');
  }
  
  // Add full width class
  if (props.fullWidth) {
    classes.push('w-100');
  }
  
  return classes.join(' ');
});
</script>

<style scoped lang="scss">
.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.2em;
}
</style>
