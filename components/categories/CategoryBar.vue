<template>
  <nav class="category-bar d-flex align-items-center py-2 border-bottom">
    <div class="container d-flex align-items-center p-0" style="max-width: 1200px;">
      <button class="btn btn-link d-flex align-items-center gap-2 shop-by-btn" @click="showSidebar = !showSidebar">
        <LucideIcon :icon="showSidebar ? 'mdi:close' : 'mdi:menu'" class="fs-4 text-success" />
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
import CategorySidebar from '@/components/categories/CategorySidebar.vue';
import { useProductFilters } from '@/composables/useProductFilters';

const showSidebar = ref(false);
const { categoriesWithCounts, fetchFilterOptions, filterOptionsLoading, filterOptionsError } = useProductFilters();

// Build hierarchical structure from flat categories with correct counts
const hierarchicalCategories = computed(() => {
  if (!categoriesWithCounts.value.length) return [];
  
  // Build hierarchical structure from flat array (counts already correct from backend)
  const categoryMap = new Map();
  const rootCategories = [];

  // First pass: create map of all categories
  categoriesWithCounts.value.forEach(cat => {
    const categoryWithChildren = {
      ...cat,
      id: String(cat.id),
      parent_id: cat.parent_id ? String(cat.parent_id) : null,
      children: [],
      products_count: cat.products_count || 0 // Use backend calculated hierarchical counts
    };
    categoryMap.set(String(cat.id), categoryWithChildren);
  });

  // Second pass: build tree structure
  categoriesWithCounts.value.forEach(cat => {
    const categoryId = String(cat.id);
    const parentId = cat.parent_id ? String(cat.parent_id) : null;
    const categoryItem = categoryMap.get(categoryId);
    
    if (parentId && categoryMap.has(parentId)) {
      const parent = categoryMap.get(parentId);
      parent.children.push(categoryItem);
    } else {
      rootCategories.push(categoryItem);
    }
  });

  return rootCategories;
});

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
  await fetchFilterOptions();
});
</script>

<style scoped>
/* Category Bar Styles */
.category-bar {
  position: sticky;
  top: var(--navbar-height, 60px); /* Fallback to 60px if CSS variable not set */
  z-index: 1025; /* Below Navbar (1030) but above content */
  overflow-x: auto;
  white-space: nowrap;
  background: var(--background-white);
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(var(--shadow-rgb), 0.05);
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
 