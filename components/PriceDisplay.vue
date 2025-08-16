<template>
  <div class="price-display">
    <div class="price-main d-flex align-items-center gap-2">
      <!-- Current price -->
      <span class="current-price fw-bold">
        <template v-if="hasVariations">From </template>₹{{ currentPrice }}
      </span>
      
      <!-- Original price (strikethrough) if on sale -->
      <span 
        v-if="isOnSale" 
        class="original-price text-muted text-decoration-line-through"
      >
        ₹{{ originalPrice }}
      </span>
      
      <!-- Discount percentage badge -->
      <span 
        v-if="discountPercentage" 
        class="discount-badge badge bg-success"
      >
        {{ discountPercentage }}% OFF
      </span>
    </div>
    
    <!-- Savings amount -->
    <div v-if="savingsAmount > 0" class="savings-info mt-1 text-success small">
      <LucideIcon icon="mdi:tag" size="14" class="me-1" />
      You save ₹{{ savingsAmount }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import LucideIcon from './LucideIcon.vue';

const props = defineProps<{
  currentPrice: string | number;
  originalPrice?: string | number;
  discountPercentage?: number;
  hasVariations?: boolean;
  showSavings?: boolean;
}>();

const currentPriceNum = computed(() => Number(props.currentPrice));
const originalPriceNum = computed(() => Number(props.originalPrice || props.currentPrice));

const isOnSale = computed(() => {
  return props.originalPrice && originalPriceNum.value > currentPriceNum.value;
});

const savingsAmount = computed(() => {
  if (!isOnSale.value) return 0;
  return Math.round((originalPriceNum.value - currentPriceNum.value) * 100) / 100;
});
</script>

<style scoped lang="scss">
.price-display {
  .current-price {
    color: var(--color-success);
    font-size: 1.1em;
  }
  
  .original-price {
    font-size: 0.9em;
  }
  
  .discount-badge {
    font-size: 0.7rem;
    padding: 2px 6px;
  }
  
  .savings-info {
    font-weight: 500;
  }
}
</style>
