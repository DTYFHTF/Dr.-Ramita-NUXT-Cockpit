<template>
  <div v-if="show" class="toast-message" role="status" :aria-live="ariaLive">
    <span>{{ message }}</span>
    <NuxtLink v-if="linkHref && linkText" :to="linkHref" class="ms-2 text-white text-decoration-underline d-inline-flex align-items-center">
      <LucideIcon icon="mdi:cart" class="me-1" size="16" />
      {{ linkText }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import LucideIcon from './LucideIcon.vue';

const props = defineProps<{
  show?: boolean;
  message?: string;
  linkHref?: string;
  linkText?: string;
  ariaLive?: 'polite' | 'off' | 'assertive';
}>();
</script>

<style scoped lang="scss">
.toast-message {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: var(--color-success);
  color: var(--text-white);
  padding: 12px 24px;
  border-radius: 8px;
  z-index: 1050;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-weight: 500;
  display: inline-flex;
  align-items: center;
}
.toast-message a {
  color: var(--text-white) !important;
  text-decoration: underline !important;
}
</style>
