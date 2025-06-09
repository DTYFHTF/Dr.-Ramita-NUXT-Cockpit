<template>
  <NuxtLink to="/cartpage" class="cart-indicator position-relative d-flex flex-column align-items-center">
    <span class="icon-badge-wrapper position-relative d-inline-block">
      <LucideIcon icon="mdi:cart" class="fs-4" />
      <span v-if="totalItems > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
        {{ totalItems }}
      </span>
    </span>
    <span>Cart</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { useCart } from '@/composables/useCart';
const { totalItems } = useCart();
</script>

<style scoped lang="scss">
.cart-indicator {
  font-size: 1.05rem;
  font-weight: 500;
  color: $color-primary;
  text-decoration: none;
}
.icon-badge-wrapper {
  min-width: 24px;
  min-height: 24px;
}
</style>