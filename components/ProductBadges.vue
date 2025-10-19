<template>
  <div v-if="showBadges" class="product-badges-inline" :style="wrapperStyle">
    <span 
      v-if="product.is_featured" 
      class="badge-icon featured" 
      title="Featured Product"
      role="img"
      aria-label="Featured Product"
    >
      <LucideIcon icon="mdi:crown" :size="size" />
    </span>
    <span 
      v-if="isBestSelling" 
      class="badge-icon bestseller" 
      title="Best Seller"
      role="img"
      aria-label="Best Selling Product"
    >
      <LucideIcon icon="mdi:fire" :size="size" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import LucideIcon from './LucideIcon.vue';
import type { Product } from '@/types';

interface Props {
  product: Product;
  size?: string | number;
  gap?: string;
  bgScale?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 20,
  gap: '4px'
  , bgScale: 1.25
});

// Expose CSS variables for use in styles (ensure correct units)
const wrapperStyle = computed(() => {
  const sizeVal = typeof props.size === 'number' ? `${props.size}px` : props.size;
  const scaleVal = typeof props.bgScale === 'number' ? String(props.bgScale) : props.bgScale;
  return {
    ['--badge-icon-size']: sizeVal,
    ['--badge-gap']: props.gap,
    ['--badge-scale']: scaleVal,
  } as Record<string, string>;
});

// Check if product is best selling (has sales data)
const isBestSelling = computed(() => {
  const totalSold = (props.product as any).total_sold;
  return totalSold !== undefined && totalSold > 0;
});

// Show badges if product is featured or best selling
const showBadges = computed(() => {
  return props.product.is_featured || isBestSelling.value;
});
</script>

<style scoped lang="scss">
/* Product badges inline (beside product name) */
.product-badges-inline {
  display: flex;
  flex-direction: row;
  gap: var(--badge-gap);
  margin-left: 8px;
  flex-shrink: 0;
}

.badge-icon {
  /* Make the circular background slightly larger than the icon */
  width: calc(var(--badge-icon-size) * var(--badge-scale));
  height: calc(var(--badge-icon-size) * var(--badge-scale));
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: scale(1.15);
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  }
  
  &.featured {
    color: var(--color-warning);
  }
  
  &.bestseller {
    color: var(--color-error);
  }
}
</style>
