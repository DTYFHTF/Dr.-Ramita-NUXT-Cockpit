<template>
  <nav class="category-bar d-flex align-items-center py-2 bg-light border-bottom">
    <div class="container d-flex align-items-center p-0" style="max-width: 1200px;">
      <button class="btn btn-link d-flex align-items-center gap-2 shop-by-btn" @click="showSidebar = true">
        <LucideIcon icon="mdi:menu" class="fs-4 text-success" />
        <span class="fw-semibold text-success">Shop by Categories</span>
      </button>
      <div class="category-links ms-auto d-flex align-items-center flex-wrap">
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="`/category/${category.slug}`"
          class="nav-shared-link"
        >
          {{ category.name }}
        </NuxtLink>
      </div>
      <CategorySidebar :show="showSidebar" :categories="hierarchicalCategories" @close="showSidebar = false" />
    </div>
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
/* Category Bar Styles */
.category-bar {
  overflow-x: auto;
  white-space: nowrap;
  background: var(--background-white);
  border-bottom: 1px solid #e5e5e5;
}

.category-links {
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

/* Shop by Categories button */
.shop-by-btn {
  background: none;
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 0 0.5rem 0 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: var(--text-primary);
}
.shop-by-btn:focus {
  box-shadow: none;
}


</style>
 