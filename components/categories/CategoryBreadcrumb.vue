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
            v-if="index < categories.length - 1"
            :to="`/category/${category.slug}`"
            class="breadcrumb-link"
          >
            {{ category.name }}
          </NuxtLink>
          <span v-else class="current-category">
            {{ category.name }}
          </span>
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

  .breadcrumb {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0;
    margin: 0;
    background: transparent;

    .breadcrumb-item {
      font-size: 0.9rem;      
      &.active {
        .current-category {
          color: var(--text-secondary);
          font-weight: 500;
        }
      }
    }

    .breadcrumb-link {
      color: var(--color-primary);
      text-decoration: none;
      transition: all 0.2s ease;
      display: flex; 
      align-items: center;

      &:hover {
        color: var(--primary-dark);
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

// Dark theme support
[data-theme="dark"] {
  .breadcrumb-link {
    color: var(--color-primary);
    
    &:hover {
      color: var(--primary-dark);
    }
  }
  .breadcrumb-separator {
    color: var(--text-muted, #aaa);
  }
}
</style>
