<template>
  <button
    @click="toggleTheme"
    class="nav-shared-link theme-toggle-btn"
    :title="theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
    aria-label="Toggle theme"
  >
    <LucideIcon 
      :icon="theme === 'light' ? 'mdi:weather-night' : 'mdi:weather-sunny'" 
      :size="20"
    />
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import LucideIcon from './LucideIcon.vue'

const { theme, toggleTheme } = useTheme()
</script>

<style lang="scss">

.theme-toggle-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  // Remove color/font so nav-shared-link can apply
  
  &:hover {
    background: var(--background-light);
    border-color: var(--color-primary);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
}
</style>
