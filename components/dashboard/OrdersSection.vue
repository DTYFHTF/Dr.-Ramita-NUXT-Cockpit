<template>
    <div>
        <div v-if="loading" class="text-center my-5">
            <span class="spinner-border text-primary"></span>
        </div>
        <div v-else-if="error" class="alert alert-danger text-center">{{ error }}</div>
        <div v-else-if="orders.length === 0" class="alert alert-info text-center">No orders found.</div>
        <div v-else>
            <div class="table-responsive rounded-4 shadow-sm p-3 dashboard-panel dashboard-table">
                <table class="table align-middle">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Total</th>
                            <th>Items</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in orders" :key="order.id">
                            <td class="fw-semibold">{{ order.id }}</td>
                            <td>{{ order.created_at ? new Date(order.created_at).toLocaleString() : '' }}</td>
                            <td>{{ order.status }}</td>
                            <td>₹{{ order.total }}</td>
                            <td>{{ order.cart.length }}</td>
                            <td>
                                <NuxtLink :to="`/order/${order.id}`" class="btn btn-sm btn-smooth-outline p-2">
                                    <LucideIcon icon="mdi:eye" :size="16" class="me-1" />
                                    View Details
                                </NuxtLink>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import type { Order } from '@/types';

const userStore = useUserStore();
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;
const orders = ref<Order[]>([]);
const loading = ref(true);
const error = ref('');

const fetchOrders = async () => {
    loading.value = true;
    error.value = '';
    try {
        const result = await $fetch<{ orders: Order[] }>(`${apiBase}/orders`, {
            headers: { Authorization: `Bearer ${userStore.token}` }
        });
        orders.value = result.orders || [];
    } catch (e: any) {
        error.value = e?.data?.message || e?.message || 'Failed to fetch orders.';
    } finally {
        loading.value = false;
    }
};

onMounted(fetchOrders);
</script>

<style scoped lang="scss">
/* Keep only small component-specific overrides; shared table/panel styles are in `main.scss` */
.alert {
  border-radius: 8px;
  padding: 1rem;

  &.alert-danger {
    background: var(--error-bg);
    color: var(--text-error);
    border: 1px solid var(--text-error);
  }

  &.alert-info {
    background: rgba(var(--color-primary-rgb), 0.1);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
  }
}
.btn-smooth-outline{
  color: var(--color-primary);
} 
</style>
