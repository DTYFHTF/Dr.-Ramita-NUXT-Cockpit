<template>
  <nav class="category-bar d-flex align-items-center gap-3 py-2 px-3 bg-light border-bottom">
    <button class="btn btn-link d-flex align-items-center gap-2 shop-by-btn" @click="showSidebar = true">
      <LucideIcon icon="mdi:view-grid" class="fs-5 text-success" />
      <span class="fw-semibold text-success">Shop by Categories</span>
    </button>
    <NuxtLink
      v-for="category in categories"
      :key="category.id"
      :to="`/category/${category.slug}`"
      class="category-link text-decoration-none px-3 py-1 rounded-pill"
    >
      <LucideIcon :icon="category.icon || 'mdi:tag'" class="me-2" />
      {{ category.name }}
    </NuxtLink>
    <CategorySidebar :show="showSidebar" :categories="hierarchicalCategories" @close="showSidebar = false" />
  </nav>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import LucideIcon from '@/components/LucideIcon.vue';
import CategorySidebar from '@/components/CategorySidebar.vue';
import { useHierarchicalCategories } from '@/composables/useHierarchicalCategories';

const showSidebar = ref(false);
const { hierarchicalCategories, fetchCategories, loading, error } = useHierarchicalCategories();

// Flat categories for the bar (top-level only)
const categories = computed(() => {
  if (!hierarchicalCategories.value.length) return [];
  return hierarchicalCategories.value.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    icon: cat.icon
  }));
});

onMounted(async () => {
  await fetchCategories();
});
</script>

<style scoped>
.category-bar {
  overflow-x: auto;
  white-space: nowrap;
}
.category-link {
  color: var(--text-primary);
  background: var(--background-light);
  transition: background 0.2s, color 0.2s;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
}
.category-link:hover {
  background: var(--color-primary);
  color: #fff;
}

.shop-by-btn {
  background: none;
  border: none;
  outline: none;
  font-size: 1.1rem;
  padding: 0 0.5rem 0 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.shop-by-btn:focus {
  box-shadow: none;
}
</style>
