<template>
  <div class="order-confirmation">
    <!-- Success Header - Inspired by SuccessStep component -->
    <div class="confirmation-header text-center">
      <div class="checkmark-circle">
        <LucideIcon icon="mdi:check" color="white" size="40" />
      </div>
      <h2 class="confirmation-title">Order Placed Successfully!</h2>
      <p class="confirmation-subtitle">Thank you for your purchase. We'll process your order soon.</p>
    </div>

    <!-- Order Details Card -->
    <div class="order-details-card">
      <div class="order-header">
        <div class="order-info-grid">
          <div class="info-item">
            <span class="label">Order ID</span>
            <span class="value">#{{ orderData.id }}</span>
          </div>
          <div class="info-item">
            <span class="label">Status</span>
            <span class="status-badge" :class="`status-${orderData.status}`">
              {{ formatStatus(orderData.status) }}
            </span>
          </div>
          <div class="info-item">
            <span class="label">Order Date</span>
            <span class="value">{{ formatDate(orderData.created_at) }}</span>
          </div>
          <div class="info-item">
            <span class="label">Payment Method</span>
            <span class="value">{{ formatPaymentMethod(orderData.payment_method) }}</span>
          </div>
        </div>
      </div>

      <!-- Order Items -->
      <div class="order-items-section">
        <h4 class="section-title">
          <LucideIcon icon="mdi:package-variant" class="section-icon" />
          Items Ordered ({{ orderData.cart?.length || 0 }})
        </h4>
        <div class="items-grid">
          <div v-for="item in orderData.cart" :key="`${item.product_id}:${item.variation_id}`" class="order-item">
            <div class="item-image">
              <img :src="getItemImage(item)" :alt="item.name" class="product-image" />
            </div>
            <div class="item-details">
              <h5 class="item-name">{{ item.name }}</h5>
              <p v-if="item.variation_name" class="item-variation">{{ item.variation_name }}</p>
              <div class="item-meta">
                <span class="item-quantity">Qty: {{ item.quantity }}</span>
                <span class="item-price">₹{{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="order-summary-section">
        <h4 class="section-title">
          <LucideIcon icon="mdi:calculator" class="section-icon" />
          Order Summary
        </h4>
        <div class="summary-details">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>₹{{ calculateSubtotal().toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>Shipping</span>
            <span>₹{{ orderData.shipping_cost?.toFixed(2) || '0.00' }}</span>
          </div>
          <div class="summary-row total-row">
            <span>Total</span>
            <span>₹{{ orderData.total?.toFixed(2) || '0.00' }}</span>
          </div>
        </div>
      </div>

      <!-- Delivery Information -->
      <div class="delivery-section">
        <h4 class="section-title">
          <LucideIcon icon="mdi:truck" class="section-icon" />
          Delivery Information
        </h4>
        <div v-if="orderData.shipping" class="delivery-details">
          <div class="delivery-address">
            <p class="recipient-name">{{ orderData.shipping.name }}</p>
            <p class="address-line">{{ orderData.shipping.address }}</p>
            <p class="address-line">{{ orderData.shipping.area }}</p>
            <p class="address-line">{{ orderData.shipping.city }}, {{ orderData.shipping.state }} - {{ orderData.shipping.pincode }}</p>
            <p class="address-line">{{ orderData.shipping.country }}</p>
            <p class="contact-info">
              <LucideIcon icon="mdi:phone" class="contact-icon" />
              {{ orderData.shipping.phone }}
            </p>
            <p v-if="orderData.shipping.landmark" class="address-line">
              <LucideIcon icon="mdi:map-marker" class="contact-icon" />
              Near {{ orderData.shipping.landmark }}
            </p>
          </div>
          <div class="delivery-estimate">
            <div class="estimate-item">
              <LucideIcon icon="mdi:clock-outline" class="estimate-icon" />
              <div class="estimate-info">
                <span class="estimate-label">Estimated Delivery</span>
                <span class="estimate-value">3-7 business days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Special Instructions -->
      <div v-if="orderData.special_instructions" class="instructions-section">
        <h4 class="section-title">
          <LucideIcon icon="mdi:note-text" class="section-icon" />
          Special Instructions
        </h4>
        <div class="instructions-content">
          {{ orderData.special_instructions }}
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="confirmation-actions">
  <NuxtLink to="/dashboard#orders" class="btn btn-outline">
        <LucideIcon icon="mdi:view-dashboard" class="me-2" />
        View Orders
      </NuxtLink>
      <NuxtLink to="/products" class="btn btn-smooth-success">
        <LucideIcon icon="mdi:shopping" class="me-2" />
        Continue Shopping
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import LucideIcon from './LucideIcon.vue';
import type { Order } from '@/types';
import { useImageUrl } from '@/composables/useImageUrl';

interface Props {
  orderData: Order;
}

const props = defineProps<Props>();

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

const formatPaymentMethod = (method: string): string => {
  const methodMap: Record<string, string> = {
    'cod': 'Cash on Delivery',
    'card': 'Credit/Debit Card',
    'upi': 'UPI Payment',
    'paypal': 'PayPal'
  };
  return methodMap[method] || method.toUpperCase();
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const calculateSubtotal = (): number => {
  if (!props.orderData.cart) return 0;
  return props.orderData.cart.reduce((sum: number, item: any) => {
    return sum + (item.price * item.quantity);
  }, 0);
};

const { getImageUrl } = useImageUrl();

const getItemImage = (item: any): string => {
  return getImageUrl(item?.image, '/placeholder-product.jpg');
};
</script>

<style scoped lang="scss">
.order-confirmation {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: var(--text-primary);
}

/* Success Header - Based on SuccessStep component */
.confirmation-header {
  margin-bottom: 3rem;
}

.checkmark-circle {
  width: 80px;
  height: 80px;
  background: var(--color-success);
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
}

.confirmation-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.confirmation-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
}

/* Order Details Card */
.order-details-card {
  background: var(--background-white);
  border-radius: 16px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
  margin-bottom: 2rem;
}

.order-header {
  background: linear-gradient(135deg, var(--color-success) 0%, #059669 100%);
  color: var(--text-white);
  padding: 2rem;
}

.order-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  .label {
    font-size: 0.875rem;
    opacity: 0.9;
    font-weight: 500;
  }
  
  .value {
    font-size: 1.125rem;
    font-weight: 600;
  }
}

.status-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  
  &.status-pending {
  background: rgba(107, 114, 128, 0.12); /* Muted gray */
  color: #374151; /* slate-700 */
  border: 1px solid rgba(107, 114, 128, 0.16);
  }
  
  &.status-confirmed {
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
    border: 1px solid rgba(34, 197, 94, 0.3);
  }
}

/* Section Styling */
.order-items-section,
.order-summary-section,
.delivery-section,
.instructions-section {
  padding: 2rem;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.section-icon {
  color: var(--color-success);
}

/* Order Items */
.items-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--background-light);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(var(--shadow-light-rgb), 0.1);
  }
}

.item-image {
  flex-shrink: 0;
  
  .product-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid var(--border-color);
  }
}

.item-details {
  flex: 1;
  
  .item-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }
  
  .item-variation {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-bottom: 0.75rem;
  }
  
  .item-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .item-quantity {
      font-size: 0.875rem;
      color: var(--text-secondary);
      background: var(--background-white);
      padding: 0.25rem 0.75rem;
      border-radius: 16px;
      border: 1px solid var(--border-color);
    }
    
    .item-price {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--color-success);
    }
  }
}

/* Order Summary */
.summary-details {
  background: var(--background-light);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid var(--border-color);
  }
  
  &.total-row {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-success);
    border-top: 2px solid var(--color-success);
    padding-top: 1rem;
    margin-top: 0.5rem;
  }
}

/* Delivery Section */
.delivery-details {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  background: var(--background-light);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
}

.delivery-address {
  .recipient-name {
    font-weight: 600;
    font-size: 1.125rem;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }
  
  .address-line {
    color: var(--text-secondary);
    margin-bottom: 0.25rem;
    line-height: 1.5;
  }
  
  .contact-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-success);
    font-weight: 500;
    margin-top: 1rem;
  }
  
  .contact-icon {
    color: var(--color-success);
  }
}

.delivery-estimate {
  .estimate-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: var(--background-white);
    border-radius: 8px;
    border: 1px solid var(--border-color);
  }
  
  .estimate-icon {
    color: var(--color-success);
    flex-shrink: 0;
  }
  
  .estimate-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    
    .estimate-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    
    .estimate-value {
      font-weight: 600;
      color: var(--text-primary);
    }
  }
}

/* Instructions */
.instructions-content {
  background: var(--background-light);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  font-style: italic;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Action Buttons */
.confirmation-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .order-confirmation {
    padding: 1rem;
  }
  
  .confirmation-title {
    font-size: 1.75rem;
  }
  
  .order-info-grid {
    grid-template-columns: 1fr;
  }
  
  .delivery-details {
    grid-template-columns: 1fr;
  }
  
  .order-item {
    flex-direction: column;
    text-align: center;
  }
  
  .item-meta {
    justify-content: center;
    gap: 1rem;
  }
  
  .confirmation-actions {
    flex-direction: column;
  }
}

/* Print Styles */
@media print {
  .order-confirmation {
    padding: 1rem;
    font-size: 12px;
  }
  
  .confirmation-actions {
    display: none;
  }
  
  .checkmark-circle {
    background: #10b981 !important;
    print-color-adjust: exact;
  }
  
  .order-details-card {
    box-shadow: none;
    border: 1px solid #ccc;
  }
  
  .order-header {
    background: #10b981 !important;
    print-color-adjust: exact;
  }
  
  .section-icon {
    color: #10b981 !important;
    print-color-adjust: exact;
  }
  
  .order-item {
    break-inside: avoid;
  }
}
</style>
