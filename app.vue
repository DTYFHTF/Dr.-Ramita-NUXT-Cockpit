<template>
  <div id="app">
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
const { initTheme } = useTheme();
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
  --text-deep-green: #3f5947;
  
  /* Font stack with Noto Sans for proper Rupee symbol (₹) support */
  --font-primary: 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  --font-secondary: 'Noto Sans', Arial, 'Helvetica Neue', sans-serif;
  
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
