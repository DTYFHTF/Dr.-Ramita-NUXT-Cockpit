<template>
  <div class="container py-5">
    <div class="content-card">
      <h1 class="content-title mb-4">My Orders</h1>
      <OrdersSection />
    </div>
  </div>
</template>

<script setup lang="ts">
import OrdersSection from '@/components/dashboard/OrdersSection.vue'

// Add authentication middleware
definePageMeta({
  middleware: 'auth'
})
</script>

<style scoped>
.content-card {
  background: var(--background-white);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--card-shadow);
  border: 1px solid var(--border-color);
}

.content-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
}
</style>
