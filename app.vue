<template>
  <div>
    <Navbar />
    <!-- Existing content -->
    <NuxtPage />
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import { useTheme } from '@/composables/useTheme';

// Initialize theme system
const { initTheme } = useTheme();
initTheme();
</script>

<style>
:root {
  --text-deep-green: #3f5947;
  --accent-soft-green: #d6e1d8;
  
  
  font-family: var(--font-primary), var(--font-secondary);

  
  --spacing-unit: 8px;

  --success-color: var(--color-success);
  --text-dark: var(--text-primary);
  --text-muted: var(--text-muted);
  --border-color: var(--border-color);
  --primary-light: #e6fffa;
}
html{
  scroll-behavior: smooth;
}

.title { margin-bottom: calc(var(--spacing-unit) * 1.25); }
.description { margin-bottom: calc(var(--spacing-unit) * 2); }
</style>
