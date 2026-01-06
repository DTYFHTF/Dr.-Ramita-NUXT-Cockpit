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
}

const props = defineProps<Props>();

const copied = ref(false);

// Status configuration
const statusConfig = {
  pending: {
    icon: 'mdi:clock-outline',
    color: '#f59e0b',
    label: 'Order Pending'
  },
  confirmed: {
    icon: 'mdi:check-circle',
    color: '#10b981',
    label: 'Order Confirmed'
  },
  processing: {
    icon: 'mdi:package-variant',
    color: '#3b82f6',
    label: 'Processing'
  },
  shipped: {
    icon: 'mdi:truck-delivery',
    color: '#8b5cf6',
    label: 'Shipped'
  },
  delivered: {
    icon: 'mdi:home-import-outline',
    color: '#10b981',
    label: 'Delivered'
  },
  cancelled: {
    icon: 'mdi:close-circle',
    color: '#ef4444',
    label: 'Cancelled'
  }
};

// Timeline steps configuration
const allSteps = [
  { status: 'pending', label: 'Order Placed', description: 'Your order has been received' },
  { status: 'confirmed', label: 'Confirmed', description: 'Payment confirmed, preparing your order' },
  { status: 'processing', label: 'Processing', description: 'Packing your items carefully' },
  { status: 'shipped', label: 'Shipped', description: 'Your order is on its way' },
  { status: 'delivered', label: 'Delivered', description: 'Order delivered successfully' }
];

const timelineSteps = computed(() => {
  // If cancelled, show different timeline
  if (props.currentStatus === 'cancelled') {
    return [
      { status: 'pending', label: 'Order Placed', completed: true, current: false, timestamp: props.createdAt },
      { status: 'cancelled', label: 'Cancelled', completed: true, current: true, timestamp: props.lastUpdated, description: 'Order has been cancelled' }
    ];
  }

  // Normal flow
  const currentIndex = allSteps.findIndex(s => s.status === props.currentStatus);
  
  return allSteps.map((step, index) => ({
    ...step,
    completed: index < currentIndex,
    current: index === currentIndex,
    timestamp: index === 0 ? props.createdAt : (index === currentIndex ? props.lastUpdated : undefined)
  }));
});

const getStatusIcon = (status: string): string => {
  return statusConfig[status as keyof typeof statusConfig]?.icon || 'mdi:information';
};

const getStatusColor = (status: string): string => {
  return statusConfig[status as keyof typeof statusConfig]?.color || '#6b7280';
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
  background: var(--background-white);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
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
  background: var(--background-light);
  border-radius: 10px;
  border: 2px solid var(--border-color);
  min-width: 250px;

  .tracking-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--background-white);
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
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%);
  border-radius: 10px;
  color: white;
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
      color: white;
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
      color: white;
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
      background: white;
      color: var(--color-primary);
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
      background: var(--background-light);
      border: 3px solid var(--border-color);
      transition: all 0.3s ease;
    }

    .step-line {
      width: 3px;
      flex: 1;
      background: var(--border-color);
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
      background: var(--color-primary);
      border-color: var(--color-primary);
      box-shadow: 0 0 0 4px rgba(var(--color-primary-rgb), 0.2);
      animation: pulse 2s ease-in-out infinite;
    }

    .step-content .step-title {
      color: var(--color-primary);
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
}

.step-pulse {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  animation: pulse-dot 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 4px rgba(var(--color-primary-rgb), 0.2);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(var(--color-primary-rgb), 0.1);
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
