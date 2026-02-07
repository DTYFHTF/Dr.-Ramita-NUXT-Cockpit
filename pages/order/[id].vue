<template>
  <div class="order-confirmation-page">
    <div class="container py-5">
      <!-- Auth loading state -->
      <div v-if="authLoading" class="text-center auth-loading">
        <div class="spinner-border text-success" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      
      <div v-else-if="loading" class="text-center">
        <div class="spinner-border text-success" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3">Loading order details...</p>
      </div>
      
      <div v-else-if="error" class="text-center">
        <LucideIcon icon="mdi:alert-circle" size="3rem" color="var(--color-error)" class="mb-3" />
        <h3 class="text-danger">Order Not Found</h3>
        <p class="text-muted">{{ error }}</p>
        <NuxtLink to="/dashboard?tab=orders" class="btn btn-smooth-primary">
          <LucideIcon icon="mdi:view-dashboard" class="me-2" />
          View All Orders
        </NuxtLink>
      </div>
      
      <OrderConfirmation v-else-if="orderData" :orderData="orderData" :onRefresh="fetchOrderDetails" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import OrderConfirmation from '@/components/OrderConfirmation.vue';
import LucideIcon from '@/components/LucideIcon.vue';
import type { Order } from '@/types';

// Use auth middleware
definePageMeta({
  middleware: 'auth'
});

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
const authLoading = ref(!userStore.hydrated);

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

// Watch for hydration completion
watch(
  () => userStore.hydrated,
  (hydrated) => {
    if (hydrated) {
      authLoading.value = false;
      if (userStore.token) {
        fetchOrderDetails();
      }
    }
  },
  { immediate: true }
);

onMounted(() => {
  // If already hydrated on mount, fetch immediately
  if (userStore.hydrated && userStore.token) {
    fetchOrderDetails();
  }
});
</script>

<style scoped>
.order-confirmation-page {
  min-height: 80vh;
  background: var(--surface-muted);
}

.container {
  max-width: 1400px;
}

.auth-loading {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
