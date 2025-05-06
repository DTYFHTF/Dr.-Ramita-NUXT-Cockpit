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
</script>

<style>
:root {
  --background-very-light-gray: #f4f5f4;
  --background-white: #ffffff;
  --background-muted-green-gray: #c5d5c8;
  --text-deep-green: #3f5947;
  --text-medium-gray: #6e6e6e;
  --text-dark-gray: #2e2e2e;
  --text-muted-teal-gray: #8a9b94;
  --accent-soft-green: #d6e1d8;
  --background-green:#F9FBF8;
  
  --font-primary: 'Cormorant Garamond', serif;
  --font-secondary: 'sans-serif';
  font-family: var(--font-primary), var(--font-secondary);

  
  --primary-text: #4a3f35;
  --secondary-text: #7a6a5c;
  --accent-beige: #f5f0eb;
  --button-hover: #f5e6d1;
  --spacing-unit: 8px;

  --primary-color: #2c7a7b;
  --success-color: #38a169;
  --background-light: #f7fafc;
  --text-dark: #2d3748;
  --text-muted: #718096;
  --border-color: #e2e8f0;
  --primary-light: #e6fffa;
  --primary-color-rgb: 44, 122, 123;
}
html{
  scroll-behavior: smooth;
}
.title { margin-bottom: calc(var(--spacing-unit) * 1.25); }
.description { margin-bottom: calc(var(--spacing-unit) * 2); }
</style>
