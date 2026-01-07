<template>
  <div v-if="message" :class="alertClass" role="alert">
    <div class="d-flex align-items-start">
      <div class="alert-icon me-3">
        <LucideIcon :icon="alertIcon" :size="20" />
      </div>
      <div class="flex-grow-1">
        <h6 v-if="title" class="alert-heading mb-1">{{ title }}</h6>
        <p class="mb-0">{{ message }}</p>
      </div>
      <button
        v-if="dismissible"
        type="button"
        class="btn-close"
        @click="$emit('dismiss')"
        aria-label="Close"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import LucideIcon from './LucideIcon.vue';

const props = defineProps<{
  message?: string;
  title?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  dismissible?: boolean;
}>();

defineEmits<{
  dismiss: []
}>();

const alertClass = computed(() => {
  const classes = ['alert'];
  
  switch (props.type) {
    case 'success':
      classes.push('alert-success');
      break;
    case 'error':
      classes.push('alert-danger');
      break;
    case 'warning':
      classes.push('alert-warning');
      break;
    default:
      classes.push('alert-info');
  }
  
  if (props.dismissible) {
    classes.push('alert-dismissible');
  }
  
  return classes.join(' ');
});

const alertIcon = computed(() => {
  switch (props.type) {
    case 'success':
      return 'mdi:check-circle';
    case 'error':
      return 'mdi:alert-circle';
    case 'warning':
      return 'mdi:alert';
    default:
      return 'mdi:information';
  }
});
</script>

<style scoped lang="scss">
.alert {
  position: relative;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;

  &-success {
    color: #0f5132;
    background-color: #d1e7dd;
    border-color: #badbcc;
  }

  &-danger {
    color: #842029;
    background-color: #f8d7da;
    border-color: #f5c2c7;
  }

  &-warning {
    color: #664d03;
    background-color: #fff3cd;
    border-color: #ffecb5;
  }

  &-info {
    color: #055160;
    background-color: #cff4fc;
    border-color: #b6effb;
  }

  &-heading {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
  }

  &-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }
}

.btn-close {
  background: transparent;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
  font-size: 1.5rem;
  line-height: 1;
  color: inherit;

  &:hover {
    opacity: 1;
  }

  &::before {
    content: '×';
  }
}

.flex-grow-1 {
  flex: 1;
}

.d-flex {
  display: flex;
}

.align-items-start {
  align-items: flex-start;
}

.me-3 {
  margin-right: 1rem;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-1 {
  margin-bottom: 0.25rem;
}
</style>
