<template>
  <div class="page-hero">
    <div class="container">
      <h1>{{ title }}</h1>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  subtitle?: string;
  variant?: 'default' | 'gradient' | 'light';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'gradient',
});
</script>

<style scoped lang="scss">
.page-hero {
  padding: 4rem 0 3rem;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.15);
    pointer-events: none;
  }

  .container {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
    font-weight: 700;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .subtitle {
    font-size: 1.2rem;
    color: white;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    margin: 0;
  }
}

// Default variant with gradient
.page-hero {
  background: linear-gradient(135deg, var(--brand-forest) 0%, #1e3624 100%);
  color: white;
}

@media (max-width: 768px) {
  .page-hero {
    padding: 3rem 0 2rem;

    h1 {
      font-size: 2rem;
    }

    .subtitle {
      font-size: 1rem;
    }
  }
}
</style>
