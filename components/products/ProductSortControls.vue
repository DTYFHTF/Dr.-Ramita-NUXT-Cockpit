<template>
  <div class="sort-controls">
    <div class="sort-label">Sort by:</div>
    <div class="sort-buttons">
      <button class="sort-btn" :class="{ active: sort.includes('display_price') }"
        @click="$emit('toggle-sort', 'display_price')">
        <LucideIcon icon="mdi:currency-inr" class="me-1" />
        Price {{ sortArrow('display_price') }}
      </button>
      <button class="sort-btn" :class="{ active: sort.includes('rating') }" @click="$emit('toggle-sort', 'rating')">
        <LucideIcon icon="mdi:star" class="me-1" />
        Rating {{ sortArrow('rating') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import LucideIcon from '@/components/LucideIcon.vue';
const props = defineProps<{
  sort: string;
}>();
const emit = defineEmits<{
  (e: 'toggle-sort', type: string): void;
}>();
function sortArrow(type: string) {
  if (props.sort === `${type}_asc`) return '↑';
  if (props.sort === `${type}_desc`) return '↓';
  return '↕';
}
</script>

<style scoped>
.sort-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 1;
  min-width: 0;
}

.sort-label {
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 0.875rem;
  white-space: nowrap;
}

.sort-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.sort-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: var(--background-light);
  border: 2px solid var(--border-color);
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.sort-btn:hover {
  border-color: var(--color-success);
  color: var(--text-primary);
}

.sort-btn.active {
  background: var(--color-success);
  border-color: var(--color-success);
  color: var(--text-white);
}

/* Intermediate screens: reduce padding and font size */
@media (min-width: 769px) and (max-width: 1200px) {
  .sort-controls {
    gap: 0.5rem;
  }
  
  .sort-label {
    font-size: 0.8rem;
  }
  
  .sort-btn {
    padding: 0.4rem 0.75rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .sort-controls {
    width: 100%;
    justify-content: space-between;
  }
  .sort-buttons {
    flex-direction: column;
    width: 100%;
  }
  .sort-btn {
    justify-content: center;
  }
}
</style>
