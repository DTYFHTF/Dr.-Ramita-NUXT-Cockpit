<template>
  <nav class="category-breadcrumb" aria-label="Category navigation">
    <ol class="breadcrumb mb-0">
      <li class="breadcrumb-item">
        <NuxtLink to="/" class="breadcrumb-link">
          <LucideIcon icon="Home" size="16" class="me-1" />
          Home
        </NuxtLink>
      </li>
      
      <li class="breadcrumb-item">
        <NuxtLink to="/products" class="breadcrumb-link">
          Products
        </NuxtLink>
      </li>
      
      <li 
        v-for="(category, index) in categories" 
        :key="category.id"
        class="breadcrumb-item"
        :class="{ active: index === categories.length - 1 }"
      >
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
  .breadcrumb {
    padding: 0;
    margin: 0;
    background: transparent;
    
    .breadcrumb-item {
      font-size: 0.9rem;
      
      &:not(:last-child) {
        &::after {
          content: '/';
          color: var(--text-muted);
          margin: 0 0.5rem;
        }
      }
      
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
}
</style>
