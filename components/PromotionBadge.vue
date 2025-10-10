<template>
  <span 
    class="promotion-badge" 
    :class="`promotion-${promotion.type}`"
    :title="getBadgeTooltip()"
  >
    <LucideIcon icon="mdi:tag" size="12" class="me-1" />
    <span class="promotion-text"> {{ formatDiscount }}
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import LucideIcon from './LucideIcon.vue';

interface Promotion {
  id?: number;
  name?: string;
  type?: 'percentage' | 'fixed' | string;
  value?: number;
  source?: string;
}

const props = defineProps<{
  promotion: Promotion;
  compact?: boolean;
}>();

const formatDiscount = computed(() => {
  if (!props.promotion.value || !props.promotion.type) return '';
  
  if (props.promotion.type === 'percentage') {
    return `${props.promotion.value}% OFF`;
  } else if (props.promotion.type === 'fixed') {
    return `₹${props.promotion.value} OFF`;
  }
  return `${props.promotion.value} OFF`;
});

const getBadgeTooltip = () => {
  let tooltip = props.promotion.name || 'Promotion';
  if (props.promotion.source) {
    tooltip += ` (${props.promotion.source})`;
  }
  return tooltip;
};
</script>

<style scoped lang="scss">
.promotion-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  white-space: nowrap;
  background: linear-gradient(135deg, var(--color-error) 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);
  
  &.promotion-percentage {
    background: linear-gradient(135deg, var(--color-error) 0%, #dc2626 100%);
  }
  
  &.promotion-fixed {
    background: linear-gradient(135deg, var(--color-warning) 0%, #f59e0b 100%);
  }

  .promotion-text {
    font-size: 0.7rem;
  }
}

@media (max-width: 768px) {
  .promotion-badge {
    font-size: 0.65rem;
    padding: 2px 6px;
    
    .promotion-text {
      font-size: 0.65rem;
    }
  }
}
</style>
