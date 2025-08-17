<template>
  <div class="order-confirmation-page">
    <div class="container py-5">
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-success" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3">Loading order details...</p>
      </div>
      
      <div v-else-if="error" class="text-center">
        <LucideIcon icon="mdi:alert-circle" size="3rem" color="var(--color-error)" class="mb-3" />
        <h3 class="text-danger">Order Not Found</h3>
        <p class="text-muted">{{ error }}</p>
  <NuxtLink to="/dashboard#orders" class="btn btn-smooth-primary">
          <LucideIcon icon="mdi:view-dashboard" class="me-2" />
          View All Orders
        </NuxtLink>
      </div>
      
      <OrderConfirmation v-else-if="orderData" :orderData="orderData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import OrderConfirmation from '@/components/OrderConfirmation.vue';
import LucideIcon from '@/components/LucideIcon.vue';
import type { Order } from '@/types';

// Meta tags
useHead({
  title: 'Order Confirmation - Ayurveda Marketplace',
  meta: [
    { name: 'description', content: 'Order confirmation and details' }
  ]
});

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const config = useRuntimeConfig();

const orderData = ref<Order | null>(null);
const loading = ref(true);
const error = ref<string>('');

const fetchOrderDetails = async () => {
  const orderId = route.params.id;
  
  if (!orderId) {
    error.value = 'Order ID is required';
    loading.value = false;
    return;
  }

  if (!userStore.token) {
    error.value = 'Please log in to view order details';
    loading.value = false;
    return;
  }

  try {
    const response = await $fetch<{ orders: Order[] }>(`${config.public.apiBase}/orders`, {
      headers: { Authorization: `Bearer ${userStore.token}` }
    });

    // Find the specific order
    const order = response.orders?.find(o => o.id.toString() === orderId.toString());
    
    if (!order) {
      error.value = 'Order not found or you do not have permission to view it';
    } else {
      orderData.value = order;
    }
  } catch (err: any) {
    console.error('Error fetching order:', err);
    error.value = err?.data?.error || err?.message || 'Failed to load order details';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOrderDetails();
});

// Redirect to login if not authenticated
if (!userStore.token) {
  await navigateTo('/auth');
}
</script>

<style scoped>
.order-confirmation-page {
  min-height: 80vh;
  background: var(--background-light);
}

.container {
  max-width: 1000px;
}
</style>
