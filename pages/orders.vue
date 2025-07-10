<template>
  <div class="container py-5">
    <h1 class="mb-4 text-center">Order History</h1>
    <div v-if="loading" class="text-center my-5">
      <span class="spinner-border text-primary"></span>
    </div>
    <div v-else-if="error" class="alert alert-danger text-center">{{ error }}</div>
    <div v-else-if="orders.length === 0" class="alert alert-info text-center">No orders found.</div>
    <div v-else>
      <div class="table-responsive rounded-4 shadow-sm p-3" style="background-color: var(--background-white);">
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
                <button class="btn btn-sm btn-smooth-outline p-2 " @click="selectOrder(order)">
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="selectedOrder" class="modal fade show d-block" tabindex="-1" style="background:rgba(var(--modal-overlay-rgb), 0.2);">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Order #{{ selectedOrder.id }} Details</h5>
              <button type="button" class="btn-close" @click="selectedOrder = null"></button>
            </div>
            <div class="modal-body">
              <div class="mb-2 fw-bold">Status: <span class="">{{ selectedOrder.status }}</span></div>
              <div class="mb-2">Order Date: {{ selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : '' }}</div>
              <div class="mb-2">Shipping: ₹{{ selectedOrder.shipping_cost }}</div>
              <div class="mb-2">Estimated Delivery: {{ selectedOrder.estimated_delivery }}</div>
              <div class="mb-2">Total: ₹{{ selectedOrder.total }}</div>
              <div class="mb-3">
                <h6>Shipping Details</h6>
                <div>{{ selectedOrder.shipping.name }}</div>
                <div>{{ selectedOrder.shipping.address }}</div>
                <div>{{ selectedOrder.shipping.city }}, {{ selectedOrder.shipping.state }} {{ selectedOrder.shipping.zip }}</div>
                <div>{{ selectedOrder.shipping.country }}</div>
                <div>Phone: {{ selectedOrder.shipping.phone }}</div>
                <div>Email: {{ selectedOrder.shipping.email }}</div>
              </div>
              <h6>Items</h6>
              <ul class="list-group mb-3">
                <li v-for="item in selectedOrder.cart" :key="`${item.product_id}:${item.variation_id}`" class="list-group-item d-flex justify-content-between align-items-center">
                  <span>
                    {{ item.name }}<span v-if="item.variation_name"> - {{ item.variation_name }}</span>
                    <span class="text-muted small ms-2">x{{ item.quantity }}</span>
                  </span>
                  <span>₹{{ item.price * item.quantity }}</span>
                </li>
              </ul>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="selectedOrder = null">Close</button>
            </div>
          </div>
        </div>
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
const selectedOrder = ref<Order|null>(null);

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

const selectOrder = (order: Order) => {
  selectedOrder.value = order;
};

onMounted(fetchOrders);
</script>

<style scoped>
.table {
  background: white;
}
.modal {
  z-index: 2000;
}
</style>
