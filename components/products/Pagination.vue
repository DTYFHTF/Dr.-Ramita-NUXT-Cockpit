<template>
  <nav v-if="lastPage > 1" class="mt-4">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <button class="page-link" @click="handlePageChange(currentPage - 1)">
          &laquo; Previous
        </button>
      </li>
      
      <li
        v-for="page in visiblePages"
        :key="page"
        class="page-item"
        :class="{ active: page === currentPage }"
      >
        <button class="page-link" @click="handlePageChange(page)">
          {{ page }}
        </button>
      </li>

      <li class="page-item" :class="{ disabled: currentPage === lastPage }">
        <button class="page-link" @click="handlePageChange(currentPage + 1)">
          Next &raquo;
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  currentPage: number;
  lastPage: number;
}>();

const emit = defineEmits<{
  (e: 'page-change', page: number): void;
}>();

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(props.lastPage, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= props.lastPage) {
    emit('page-change', page);
  }
};
</script>

<style scoped>
.page-link {
  min-width: 45px;
  text-align: center;
  transition: all 0.2s ease;
}

.page-item.active .page-link {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}
</style>