<template>
  <nav class="category-breadcrumb" aria-label="Category navigation">
    <ol class="breadcrumb mb-0">
       <li class="breadcrumb-item">
        <NuxtLink to="/products" class="breadcrumb-link">
          Products
        </NuxtLink>
      </li>
      <template v-for="(category, index) in categories" :key="category.id">
        <span class="breadcrumb-separator">›</span>
        <li class="breadcrumb-item" :class="{ active: index === categories.length - 1 }">
          <NuxtLink
            :to="`/category/${category.slug}`"
            class="breadcrumb-link"
            :aria-current="index === categories.length - 1 ? 'page' : undefined"
          >
            {{ category.name }}
          </NuxtLink>
        </li>
      </template>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import type { Category } from '@/types'

defineProps<{
  categories: Category[]
}>()
</script>

<style scoped lang="scss">

.category-breadcrumb {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;

  /* Hide scrollbar but keep functionality */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--border-default);
    border-radius: 2px;
  }

  .breadcrumb {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0;
    margin: 0;
    background: transparent;
    flex-wrap: nowrap;
    white-space: nowrap;

    .breadcrumb-item {
      font-size: 0.9rem;
      whitespace: nowrap;
      
      &.active {
        .current-category {
          color: var(--text-secondary);
          font-weight: 500;
        }
      }
    }

    .breadcrumb-link {
      color: var(--accent-primary);
      text-decoration: none;
      transition: all 0.2s ease;
      display: flex; 
      align-items: center;
      white-space: nowrap;

      &:hover {
        color: var(--accent-hover);
        text-decoration: underline;
      }
    }

    .breadcrumb-separator {
      color: var(--text-muted);
      margin: 0 0.5rem;
      display: inline-block;
      font-size: 1.1em;
      vertical-align: middle;
    }
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .category-breadcrumb {
    .breadcrumb {
      .breadcrumb-item {
        font-size: 0.8rem;
      }
      
      .breadcrumb-separator {
        margin: 0 0.35rem;
        font-size: 1em;
      }
    }
  }
}

// Dark theme support
[data-theme="dark"] {
  .breadcrumb-link {
    color: var(--accent-primary);
    
    &:hover {
      color: var(--accent-hover);
    }
  }
  .breadcrumb-separator {
    color: var(--text-muted);
  }
}
</style>
