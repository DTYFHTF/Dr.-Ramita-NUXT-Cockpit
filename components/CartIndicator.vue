<template>
  <NuxtLink to="/cartpage" class="nav-shared-link cart-indicator position-relative d-flex flex-column align-items-center" title="Cart">
    <span class="icon-badge-wrapper position-relative d-inline-block">
      <LucideIcon icon="mdi:cart" class="fs-4" />
      <span v-if="totalItems > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
        {{ totalItems }}
      </span>
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { useCart } from '@/composables/useCart';
const { totalItems } = useCart();
</script>

<style lang="scss">
.icon-badge-wrapper {
  min-width: 24px;
  min-height: 24px;
}
</style>