<template>
  <teleport to="body">
    <div class="quick-view-modal" v-show="product" @mousedown.self="onBackdropClick">
      <div class="quick-view-content-wrapper" :class="{ 'modal-animate': true }">
        <button
          class="close-btn ms-3"
          @click="$emit('close')"
          aria-label="Close"
        >
          &times;
        </button>
        <ProductQuickViewContent
          :product="product"
          :show-view-details="true"
          @add-to-cart="$emit('add-to-cart', $event)"
        />
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import ProductQuickViewContent from './ProductQuickViewContent.vue';
import type { Product } from '@/types';

const props = defineProps<{ product: Product }>();
const emit = defineEmits(['close', 'add-to-cart']);

function onBackdropClick(e: MouseEvent) {
  // Only close if click is on backdrop, not modal content
  emit('close');
}

function onEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close');
}

onMounted(() => {
  window.addEventListener('keydown', onEscape);
});
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onEscape);
});
</script>

<style scoped lang="scss">
.quick-view-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.quick-view-content-wrapper {
  position: relative;
  animation: modalIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes modalIn {
  from { transform: translateY(40px) scale(0.98); opacity: 0; }
  to { transform: none; opacity: 1; }
}
.close-btn {
  position: absolute;
  top: 18px;
  right: 24px;
  font-size: 2rem;
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  z-index: 10;
  line-height: 1;
  transition: color 0.2s;
}
.close-btn:hover {
  color: #c00;
}
</style>
