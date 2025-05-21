<template>
  <router-link to="/cartpage" class="cart-indicator position-relative">
    <LucideIcon icon="mdi:cart" class="fs-4" />
    <span v-if="totalItems > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
      {{ totalItems }}
    </span>
  </router-link>
</template>

<script setup lang="ts">
import { useCart } from '@/composables/useCart';
const { totalItems } = useCart();
</script>

<style scoped>
.cart-indicator {
  color: inherit;
  text-decoration: none;
  
  &:hover {
    color: var(--bs-primary);
  }
}
</style>