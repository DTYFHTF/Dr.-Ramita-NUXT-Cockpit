<template>
  <div id="app" :data-theme="currentTheme">
    <Navbar />
    <CategoryBar />
    <ErrorBoundary
      :show-details="isDev"
      :on-error="handleError"
    >
      <main class="main-content">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </main>
    </ErrorBoundary>
    <Footer />
    <AlertContainer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import CategoryBar from '@/components/categories/CategoryBar.vue';
import Footer from '@/components/Footer.vue';
import ErrorBoundary from '@/components/ErrorBoundary.vue';
import AlertContainer from '@/components/AlertContainer.vue';
import { useTheme } from '@/composables/useTheme';

// Initialize theme system
const { currentTheme, initTheme } = useTheme();
initTheme();

// Development mode check
const isDev = import.meta.dev;

// Error handler for production logging
const handleError = (error) => {
  if (!isDev) {
    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    console.error('[Production Error]', error);
  }
};
</script>

<style>
:root {
  --text-deep-green: var(--accent-primary);
  
  /* Font stack with Noto Sans for proper Rupee symbol (₹) support */
  --font-primary: 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  --font-secondary: 'Noto Sans', Arial, 'Helvetica Neue', sans-serif;
  
  font-family: var(--font-primary), var(--font-secondary);
  
  --spacing-unit: 8px;
}
html{
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  font-family: var(--font-primary);
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  min-height: 0;
}

.title { margin-bottom: calc(var(--spacing-unit) * 1.25); }
.description { margin-bottom: calc(var(--spacing-unit) * 2); }
</style>
