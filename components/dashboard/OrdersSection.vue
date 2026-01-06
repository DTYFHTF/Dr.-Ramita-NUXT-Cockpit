<template>
    <div>
        <div v-if="loading" class="text-center my-5">
            <span class="spinner-border text-primary"></span>
        </div>
        <div v-else-if="error" class="alert alert-danger text-center">{{ error }}</div>
        <div v-else-if="orders.length === 0" class="empty-state text-center py-5">
            <div class="empty-icon mb-3">
                <LucideIcon icon="mdi:package-variant" size="4rem" color="var(--text-muted)" />
            </div>
            <h5 class="text-muted mb-3">You have no orders yet</h5>
            <p class="text-muted mb-4">Once you place an order it will appear here. Browse products to get started.</p>
            <NuxtLink to="/products" class="btn btn-smooth-success">
                <LucideIcon icon="mdi:shopping" class="me-2" />
                Start Shopping
            </NuxtLink>
        </div>
        <div v-else>
            <div class="orders-grid">
                <div v-for="order in orders" :key="order.id" class="order-card">
                    <div class="order-card-header">
                        <div class="order-id-section">
                            <span class="order-id-label">Order</span>
                            <span class="order-id-value">#{{ order.id }}</span>
                            <NuxtLink :to="`/order/${order.id}`" class="btn-view-order-inline" title="View Order Details">
                                <LucideIcon icon="mdi:eye" size="18" />
                            </NuxtLink>
                        </div>
                        <span class="order-status-badge" :class="`status-${order.status}`">
                            {{ formatStatus(order.status) }}
                        </span>
                    </div>
                    
                    <div class="order-card-body">
                        <div class="order-info-row">
                            <div class="info-item">
                                <LucideIcon icon="mdi:calendar" size="16" class="info-icon" />
                                <span class="info-value">{{ formatDate(order.created_at) }}</span>
                            </div>
                            <div class="info-item">
                                <LucideIcon icon="mdi:package-variant" size="16" class="info-icon" />
                                <span class="info-value">{{ getItemCount(order) }} item{{ getItemCount(order) !== 1 ? 's' : '' }}</span>
                            </div>
                        </div>
                        
                        <!-- Tracking Info (if available) -->
                        <div v-if="order.tracking_number" class="tracking-preview">
                            <div class="tracking-preview-header">
                                <LucideIcon icon="mdi:truck-delivery" size="16" class="tracking-icon" />
                                <span class="tracking-label">Tracking</span>
                            </div>
                            <div class="tracking-preview-content">
                                <code class="tracking-number">{{ order.tracking_number }}</code>
                                <span v-if="order.courier" class="courier-badge">{{ order.courier }}</span>
                            </div>
                        </div>
                        
                        <div class="order-total-row">
                            <span class="total-label">Total Amount</span>
                            <span class="total-value">₹{{ order.total?.toFixed(2) }}</span>
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

const getItemCount = (order: Order) => {
    return order.cart?.length || 0;
};

const formatStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
        'pending': 'Pending',
        'confirmed': 'Confirmed',
        'processing': 'Processing',
        'shipped': 'Shipped',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
    };
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
};

const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

onMounted(fetchOrders);
</script>

<style scoped lang="scss">
.alert {
  border-radius: 8px;
  padding: 1rem;

  &.alert-danger {
    background: var(--error-bg);
    color: var(--text-error);
    border: 1px solid var(--text-error);
  }
}

.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.order-card {
  background: var(--background-white);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    border-color: var(--color-primary-light);
  }

  .order-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem;
    background: var(--background-light);
    border-bottom: 1px solid var(--border-color);

    .order-id-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .order-id-label {
        font-size: 0.85rem;
        color: var(--text-secondary);
        font-weight: 500;
      }

      .order-id-value {
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--text-primary);
        font-family: monospace;
      }

      .btn-view-order-inline {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        margin-left: 0.25rem;
        background: var(--background-white);
        color: var(--text-secondary);
        border-radius: 6px;
        text-decoration: none;
        transition: all 0.2s ease;
        border: 1px solid var(--border-color);

        &:hover {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        &:active {
          transform: translateY(0);
        }
      }
    }

    .order-status-badge {
      padding: 0.4rem 0.85rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: capitalize;

      &.status-pending {
        background: rgba(245, 158, 11, 0.15);
        color: #d97706;
        border: 1px solid rgba(245, 158, 11, 0.3);
      }

      &.status-confirmed {
        background: rgba(16, 185, 129, 0.15);
        color: #059669;
        border: 1px solid rgba(16, 185, 129, 0.3);
      }

      &.status-processing {
        background: rgba(59, 130, 246, 0.15);
        color: #2563eb;
        border: 1px solid rgba(59, 130, 246, 0.3);
      }

      &.status-shipped {
        background: rgba(139, 92, 246, 0.15);
        color: #7c3aed;
        border: 1px solid rgba(139, 92, 246, 0.3);
      }

      &.status-delivered {
        background: rgba(16, 185, 129, 0.15);
        color: #059669;
        border: 1px solid rgba(16, 185, 129, 0.3);
      }

      &.status-cancelled {
        background: rgba(239, 68, 68, 0.15);
        color: #dc2626;
        border: 1px solid rgba(239, 68, 68, 0.3);
      }
    }
  }

  .order-card-body {
    padding: 1.25rem;

    .order-info-row {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1rem;

      .info-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        .info-icon {
          color: var(--text-secondary);
        }

        .info-value {
          font-size: 0.9rem;
          color: var(--text-primary);
          font-weight: 500;
        }
      }
    }

    .tracking-preview {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%);
      border: 1px solid rgba(139, 92, 246, 0.2);
      border-radius: 8px;
      padding: 0.85rem;
      margin-bottom: 1rem;

      .tracking-preview-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;

        .tracking-icon {
          color: #7c3aed;
        }

        .tracking-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #7c3aed;
        }
      }

      .tracking-preview-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;

        .tracking-number {
          font-size: 0.9rem;
          font-weight: 600;
          font-family: 'Courier New', monospace;
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.6);
          padding: 0.35rem 0.6rem;
          border-radius: 4px;
        }

        .courier-badge {
          font-size: 0.75rem;
          font-weight: 600;
          color: #7c3aed;
          background: rgba(139, 92, 246, 0.15);
          padding: 0.25rem 0.6rem;
          border-radius: 12px;
        }
      }
    }

    .order-total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);

      .total-label {
        font-size: 0.9rem;
        color: var(--text-secondary);
        font-weight: 500;
      }

      .total-value {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--color-primary);
      }
    }
  }

  .order-card-footer {
    padding: 1rem 1.25rem;
    background: var(--background-light);
    border-top: 1px solid var(--border-color);

    .btn-view-order {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 0.75rem;
      background: var(--color-primary);
      color: white;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.2s ease;

      &:hover {
        background: var(--color-primary-dark);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.3);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}
</style>
