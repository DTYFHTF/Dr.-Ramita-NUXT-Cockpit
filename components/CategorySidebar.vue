<template>
  <div v-if="show" class="category-sidebar-overlay" @click.self="closeSidebar">
    <aside class="category-sidebar bg-white shadow-lg">
      <div class="sidebar-header d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
        <span class="fw-bold text-success">
          <LucideIcon icon="mdi:view-grid" class="me-2" /> ALL CATEGORIES
        </span>
        <button class="btn btn-sm btn-light" @click="closeSidebar">
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
  background: rgba(0,0,0,0.25);
  z-index: 2000;
  display: flex;
}
.category-sidebar {
  width: 320px;
  max-width: 90vw;
  height: 100vh;
  overflow-y: auto;
  background: #fff;
  border-right: 1px solid #eee;
  animation: slideIn 0.2s;
}
@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
.sidebar-header {
  background: #f6f6f6;
}
.sidebar-category-item {
  cursor: pointer;
  transition: background 0.15s;
}
.sidebar-category-item:hover {
  background: #f0f8f5;
}
.sidebar-subcategory-list {
  list-style: none;
  padding-left: 0.5rem;
}
</style>
