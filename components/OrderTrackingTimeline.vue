<template>
  <div class="tracking-timeline">
    <div class="timeline-header">
      <div class="tracking-info-card">
        <div class="tracking-icon">
          <LucideIcon :icon="getStatusIcon(currentStatus)" :color="getStatusColor(currentStatus)" size="24" />
        </div>
        <div class="tracking-details">
          <h5 class="tracking-status">{{ formatStatus(currentStatus) }}</h5>
          <p v-if="lastUpdated" class="tracking-date">Last updated: {{ formatDate(lastUpdated) }}</p>
        </div>
      </div>
      
      <!-- Tracking Number Card -->
      <div v-if="trackingNumber" class="tracking-number-card">
        <div class="tracking-number-header">
          <LucideIcon icon="mdi:package-variant-closed" class="me-2" size="18" />
          <span class="tracking-label">Tracking Number</span>
        </div>
        <div class="tracking-number-content">
          <code class="tracking-code">{{ trackingNumber }}</code>
          <button @click="copyTrackingNumber" class="btn-copy" :title="copied ? 'Copied!' : 'Copy'">
            <LucideIcon :icon="copied ? 'mdi:check' : 'mdi:content-copy'" size="16" />
          </button>
        </div>
        <div v-if="courier" class="courier-info">
          <span class="courier-label">Courier:</span>
          <span class="courier-name">{{ courier }}</span>
          <a v-if="trackingUrl" :href="trackingUrl" target="_blank" class="btn-track">
            Track on {{ courier }} →
          </a>
        </div>
        
        <!-- Delivery Dates -->
        <div v-if="shippedAt || estimatedDeliveryDate || actualDeliveryDate" class="delivery-dates">
          <div v-if="shippedAt" class="date-item">
            <LucideIcon icon="mdi:truck-fast" class="date-icon" size="16" />
            <span class="date-label">Shipped:</span>
            <span class="date-value">{{ formatDate(shippedAt) }}</span>
          </div>
          <div v-if="estimatedDeliveryDate" class="date-item">
            <LucideIcon icon="mdi:calendar-clock" class="date-icon" size="16" />
            <span class="date-label">Expected:</span>
            <span class="date-value">{{ formatDate(estimatedDeliveryDate) }}</span>
          </div>
          <div v-if="actualDeliveryDate" class="date-item delivered">
            <LucideIcon icon="mdi:check-circle" class="date-icon" size="16" />
            <span class="date-label">Delivered:</span>
            <span class="date-value">{{ formatDate(actualDeliveryDate) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Visual Timeline -->
    <div class="timeline-container">
      <div v-for="(step, index) in timelineSteps" :key="step.status" class="timeline-step" :class="{ 
        'step-completed': step.completed,
        'step-current': step.current,
        'step-pending': !step.completed && !step.current
      }">
        <div class="step-indicator">
          <div class="step-dot">
            <LucideIcon v-if="step.completed" icon="mdi:check" color="white" size="16" />
            <span v-else-if="step.current" class="step-pulse"></span>
          </div>
          <div v-if="index < timelineSteps.length - 1" class="step-line"></div>
        </div>
        <div class="step-content">
          <div class="step-title">{{ step.label }}</div>
          <div v-if="step.timestamp" class="step-timestamp">{{ formatDate(step.timestamp) }}</div>
          <div v-if="step.description" class="step-description">{{ step.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import LucideIcon from './LucideIcon.vue';

interface Props {
  currentStatus: string;
  trackingNumber?: string | null;
  courier?: string | null;
  createdAt?: string;
  lastUpdated?: string;
  estimatedDeliveryDate?: string | null;
  actualDeliveryDate?: string | null;
  shippedAt?: string | null;
}

const props = defineProps<Props>();

const copied = ref(false);

// Status configuration
const statusConfig = {
  pending: {
    icon: 'mdi:clock-outline',
    color: 'var(--status-warning)',
    label: 'Order Pending'
  },
  confirmed: {
    icon: 'mdi:check-circle',
    color: 'var(--status-success)',
    label: 'Order Confirmed'
  },
  processing: {
    icon: 'mdi:package-variant',
    color: 'var(--status-info)',
    label: 'Processing'
  },
  ready_to_ship: {
    icon: 'mdi:package-check',
    color: 'var(--status-processing)',
    label: 'Ready to Ship'
  },
  packed: {
    icon: 'mdi:package-variant-closed',
    color: 'var(--status-processing)',
    label: 'Packed'
  },
  dispatched: {
    icon: 'mdi:truck-delivery',
    color: 'var(--status-processing)',
    label: 'Dispatched'
  },
  shipped: {
    icon: 'mdi:truck-delivery',
    color: 'var(--status-processing)',
    label: 'Shipped'
  },
  in_transit: {
    icon: 'mdi:truck-fast',
    color: 'var(--status-processing)',
    label: 'In Transit'
  },
  out_for_delivery: {
    icon: 'mdi:truck-fast',
    color: 'var(--status-warning)',
    label: 'Out for Delivery'
  },
  delivered: {
    icon: 'mdi:home-import-outline',
    color: 'var(--status-success)',
    label: 'Delivered'
  },
  failed: {
    icon: 'mdi:alert-circle',
    color: 'var(--status-error)',
    label: 'Delivery Failed'
  },
  returned: {
    icon: 'mdi:package-variant-closed-remove',
    color: 'var(--status-error)',
    label: 'Returned'
  },
  cancelled: {
    icon: 'mdi:close-circle',
    color: 'var(--status-error)',
    label: 'Cancelled'
  }
};

// Timeline steps configuration
const allSteps = [
  { status: 'pending', label: 'Order Placed', description: 'Your order has been received' },
  { status: 'confirmed', label: 'Confirmed', description: 'Payment confirmed, preparing your order' },
  { status: 'processing', label: 'Processing', description: 'Preparing your items' },
  { status: 'ready_to_ship', label: 'Ready to Ship', description: 'Your order is ready for shipment' },
  { status: 'packed', label: 'Packed', description: 'Your order has been packed' },
  { status: 'dispatched', label: 'Dispatched', description: 'Your order has been dispatched' },
  { status: 'in_transit', label: 'In Transit', description: 'Your order is on the way' },
  { status: 'out_for_delivery', label: 'Out for Delivery', description: 'Your order is out for delivery' },
  { status: 'delivered', label: 'Delivered', description: 'Order delivered successfully' }
];

const timelineSteps = computed(() => {
  // Special handling for failed/cancelled/returned statuses
  if (props.currentStatus === 'cancelled') {
    return [
      { status: 'pending', label: 'Order Placed', completed: true, current: false, timestamp: props.createdAt },
      { status: 'cancelled', label: 'Cancelled', completed: true, current: true, timestamp: props.lastUpdated, description: 'Order has been cancelled' }
    ];
  }

  if (props.currentStatus === 'failed') {
    return [
      ...allSteps.slice(0, -1), // All steps except delivered
      { status: 'failed', label: 'Delivery Failed', completed: true, current: true, timestamp: props.lastUpdated, description: 'Delivery attempt failed' }
    ].map((step, index, array) => ({
      ...step,
      completed: index < array.length - 1 || step.status === 'failed',
      current: step.status === 'failed',
      timestamp: index === 0 ? props.createdAt : 
                 (step.status === 'failed' ? props.lastUpdated : 
                 (step.status === 'dispatched' && props.shippedAt ? props.shippedAt : undefined))
    }));
  }

  if (props.currentStatus === 'returned') {
    return [
      ...allSteps.slice(0, -1), // All steps except delivered
      { status: 'returned', label: 'Returned', completed: true, current: true, timestamp: props.lastUpdated, description: 'Order has been returned' }
    ].map((step, index, array) => ({
      ...step,
      completed: index < array.length - 1 || step.status === 'returned',
      current: step.status === 'returned',
      timestamp: index === 0 ? props.createdAt : 
                 (step.status === 'returned' ? props.lastUpdated : 
                 (step.status === 'dispatched' && props.shippedAt ? props.shippedAt : undefined))
    }));
  }

  // Normal flow
  const currentIndex = allSteps.findIndex(s => s.status === props.currentStatus);
  
  // If status not found in steps, default to pending (index 0)
  const safeCurrentIndex = currentIndex >= 0 ? currentIndex : 0;
  
  return allSteps.map((step, index) => ({
    ...step,
    // A step is completed if: it's before current step OR it IS the current step
    completed: index <= safeCurrentIndex,
    current: index === safeCurrentIndex,
    // Show timestamp for first step (order placed) and current step
    timestamp: index === 0 ? props.createdAt : 
               (index === safeCurrentIndex ? props.lastUpdated : 
               (step.status === 'dispatched' && props.shippedAt ? props.shippedAt :
               (step.status === 'delivered' && props.actualDeliveryDate ? props.actualDeliveryDate : undefined)))
  }));
});

const getStatusIcon = (status: string): string => {
  return statusConfig[status as keyof typeof statusConfig]?.icon || 'mdi:information';
};

const getStatusColor = (status: string): string => {
  return statusConfig[status as keyof typeof statusConfig]?.color || 'var(--text-muted)';
};

const formatStatus = (status: string): string => {
  return statusConfig[status as keyof typeof statusConfig]?.label || 
    status.charAt(0).toUpperCase() + status.slice(1);
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const trackingUrl = computed(() => {
  if (!props.trackingNumber || !props.courier) return null;
  
  const courierUrls: Record<string, string> = {
    'BlueDart': `https://www.bluedart.com/web/guest/trackdartresult?trackFor=0&trackNo=${props.trackingNumber}`,
    'DTDC': `https://www.dtdc.in/tracking.asp?tracking_no=${props.trackingNumber}`,
    'Delhivery': `https://www.delhivery.com/track/package/${props.trackingNumber}`,
    'FedEx': `https://www.fedex.com/fedextrack/?tracknumbers=${props.trackingNumber}`,
    'DHL': `https://www.dhl.com/in-en/home/tracking.html?tracking-id=${props.trackingNumber}`,
    'India Post': `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx?consignmentno=${props.trackingNumber}`,
    'Ecom Express': `https://ecomexpress.in/tracking/?awb_field=${props.trackingNumber}`,
    'Shadowfax': `https://www.shadowfax.in/track-order?order_id=${props.trackingNumber}`,
    'Xpressbees': `https://www.xpressbees.com/shipment/tracking?awb=${props.trackingNumber}`
  };
  
  return courierUrls[props.courier] || null;
});

const copyTrackingNumber = async () => {
  if (!props.trackingNumber) return;
  
  try {
    await navigator.clipboard.writeText(props.trackingNumber);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
</script>

<style scoped lang="scss">
.tracking-timeline {
  background: var(--surface-primary);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--border-default);
}

.timeline-header {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.tracking-info-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--surface-muted);
  border-radius: 10px;
  border: 2px solid var(--border-default);
  min-width: 250px;

  .tracking-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface-primary);
    border-radius: 10px;
    flex-shrink: 0;
  }

  .tracking-details {
    flex: 1;

    .tracking-status {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }

    .tracking-date {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin: 0;
    }
  }
}

.tracking-number-card {
  flex: 1;
  padding: 1rem;
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--accent-primary) 100%);
  border-radius: 10px;
  color: var(--text-inverse);
  min-width: 280px;

  .tracking-number-header {
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;

    .tracking-label {
      font-size: 0.85rem;
      font-weight: 600;
      opacity: 0.9;
    }
  }

  .tracking-number-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;

    .tracking-code {
      flex: 1;
      font-size: 1.1rem;
      font-weight: 700;
      font-family: 'Courier New', monospace;
      background: rgba(255, 255, 255, 0.2);
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      letter-spacing: 0.5px;
      color: var(--text-inverse);
    }

    .btn-copy {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      border-radius: 6px;
      color: var(--text-inverse);
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.05);
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }

  .courier-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    flex-wrap: wrap;

    .courier-label {
      opacity: 0.9;
    }

    .courier-name {
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
    }

    .btn-track {
      margin-left: auto;
      padding: 0.4rem 0.75rem;
      background: var(--surface-primary);
      color: var(--accent-primary);
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s ease;
      font-size: 0.85rem;

      &:hover {
        transform: translateX(4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }
  }
}

.timeline-container {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline-step {
  display: flex;
  gap: 1.5rem;
  position: relative;

  .step-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 0.25rem;

    .step-dot {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 2;
      background: var(--surface-muted);
      border: 3px solid var(--border-default);
      transition: all 0.3s ease;
    }

    .step-line {
      width: 3px;
      flex: 1;
      background: var(--border-default);
      min-height: 50px;
      transition: all 0.3s ease;
    }
  }

  .step-content {
    flex: 1;
    padding-bottom: 2rem;

    .step-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }

    .step-timestamp {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: 0.25rem;
    }

    .step-description {
      font-size: 0.9rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }
  }

  // Completed step styling
  &.step-completed {
    .step-indicator {
      .step-dot {
        background: var(--color-success);
        border-color: var(--color-success);
      }

      .step-line {
        background: var(--color-success);
      }
    }

    .step-content .step-title {
      color: var(--color-success);
    }
  }

  // Current step styling
  &.step-current {
    .step-indicator .step-dot {
      background: var(--accent-primary);
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.2);
      animation: pulse 2s ease-in-out infinite;
    }

    .step-content .step-title {
      color: var(--accent-primary);
      font-weight: 700;
    }
  }

  // Pending step styling
  &.step-pending {
    opacity: 0.5;

    .step-content .step-title {
      color: var(--text-secondary);
    }
  }
  
  .delivery-dates {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-default);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    
    .date-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      
      .date-icon {
        color: var(--text-secondary);
      }
      
      .date-label {
        color: var(--text-secondary);
        font-weight: 500;
      }
      
      .date-value {
        color: var(--text-primary);
        font-weight: 600;
      }
      
      &.delivered {
        .date-icon,
        .date-label {
          color: var(--color-success);
        }
        
        .date-value {
          color: var(--color-success);
          font-weight: 700;
        }
      }
    }
  }
}

.step-pulse {
  width: 12px;
  height: 12px;
  background: var(--surface-primary);
  border-radius: 50%;
  animation: pulse-dot 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.2);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(var(--accent-rgb), 0.1);
  }
}

@keyframes pulse-dot {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

// Responsive
@media (max-width: 576px) {
  .tracking-timeline {
    padding: 1rem;
  }

  .timeline-header {
    gap: 1rem;
  }

  .tracking-info-card,
  .tracking-number-card {
    min-width: auto;
  }

  .timeline-step {
    gap: 1rem;

    .step-indicator .step-dot {
      width: 32px;
      height: 32px;
    }

    .step-content {
      .step-title {
        font-size: 0.9rem;
      }

      .step-timestamp,
      .step-description {
        font-size: 0.8rem;
      }
    }
  }
}
</style>
