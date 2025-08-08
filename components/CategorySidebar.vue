<template>
  <div v-if="show" class="category-sidebar-overlay" @click.self="closeSidebar">
    <aside class="category-sidebar shadow-lg">
      <div class="sidebar-header d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
        <span class="fw-bold text-success">
          <LucideIcon icon="mdi:menu" class="me-2" /> ALL CATEGORIES
        </span>
        <button class="btn btn-sm close-btn" @click="closeSidebar">
          <LucideIcon icon="mdi:close" />
        </button>
      </div>
      <HierarchicalCategoryTree :categories="categories" @category-select="handleCategorySelect" />
    </aside>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import LucideIcon from '@/components/LucideIcon.vue';
import HierarchicalCategoryTree from '@/components/categories/HierarchicalCategoryTree.vue';

const props = defineProps({
  show: Boolean,
  categories: Array
});

import { useRouter, useRoute } from 'vue-router';
import { watch } from 'vue';
const emit = defineEmits(['close']);
const router = useRouter();
const route = useRoute();

// Auto-close sidebar on route change (including browser navigation)
watch(
  () => route.fullPath,
  () => {
    if (props.show) emit('close');
  }
);

function closeSidebar() {
  emit('close');
}

function handleCategorySelect(category) {
  // Only navigate for leaf categories (no children)
  if (!category.children || !category.children.length) {
    if (category.slug) {
      router.push(`/category/${category.slug}`);
      emit('close');
    }
  }
}
</script>

<style scoped>
.category-sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(var(--modal-overlay-rgb), 0.25);
  z-index: 2000;
  display: flex;
}
.category-sidebar {
  width: 320px;
  max-width: 90vw;
  height: 100vh;
  overflow-y: auto;
  background: var(--background-white);
  border-right: 1px solid var(--border-color);
  animation: slideIn 0.2s;
  color: var(--text-primary);
}
@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
.sidebar-header {
  background: var(--background-light);
  border-bottom: 1px solid var(--border-color);
}
.close-btn {
  color: var(--text-primary) !important;
  background: transparent !important;
  border: none !important;
  transition: all 0.15s ease;
}
.close-btn:hover {
  background: transparent !important;
  color: var(--color-primary) !important;
}
.sidebar-category-item {
  cursor: pointer;
  transition: background 0.15s;
}
.sidebar-category-item:hover {
  background: var(--background-light);
}
.sidebar-subcategory-list {
  list-style: none;
  padding-left: 0.5rem;
}
</style>
