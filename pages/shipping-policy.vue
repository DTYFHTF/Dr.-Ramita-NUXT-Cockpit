<template>
  <div class="cms-page">
    <!-- Loading State -->
    <div v-if="pending" class="container py-5 text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error or CMS Content Not Available - Show Static Content -->
    <div v-else-if="!cmsPage" class="legal-page">
      <PageHero 
        title="Shipping Policy" 
        subtitle="Understand our shipping terms and delivery process"
      />
      
      <div class="container py-5">
        <div class="legal-content">
          <p class="last-updated">Last Updated: January 7, 2026</p>

          <section>
            <h2>1. Shipping Coverage</h2>
            <p>
              We currently ship to addresses within India. International shipping may be available for select products.
              Please contact us for international shipping inquiries.
            </p>
          </section>

          <section>
            <h2>2. Processing Time</h2>
            <p>
              Orders are typically processed within 1-3 business days (excluding weekends and holidays) after payment
              confirmation. You will receive a confirmation email with tracking information once your order has shipped.
            </p>
          </section>

          <section>
            <h2>3. Delivery Time</h2>
            <p>Standard delivery times by location:</p>
            <ul>
              <li><strong>Metro Cities:</strong> 3-5 business days</li>
              <li><strong>Other Cities:</strong> 5-7 business days</li>
              <li><strong>Remote Areas:</strong> 7-10 business days</li>
            </ul>
            <p>
              Please note that delivery times are estimates and may vary based on courier service and location.
            </p>
          </section>

          <section>
            <h2>4. Shipping Costs</h2>
            <ul>
              <li>Free shipping on orders above ₹999</li>
              <li>Standard shipping fee of ₹99 for orders below ₹999</li>
              <li>Express shipping available at additional cost</li>
              <li>Shipping costs are calculated at checkout</li>
            </ul>
          </section>

          <section>
            <h2>5. Order Tracking</h2>
            <p>
              Once your order ships, you will receive a tracking number via email. You can track your shipment using this
            number on our website or the courier's website. You can also track orders from your account dashboard.
          </p>
        </section>

        <section>
          <h2>6. Delivery Issues</h2>
          <p>If you experience any delivery issues:</p>
          <ul>
            <li>Package not received within expected timeframe</li>
            <li>Package damaged during transit</li>
            <li>Incorrect items received</li>
          </ul>
          <p>
            Please contact our customer service team within 48 hours of expected delivery at {{ brand.email }}
            with your order number and details of the issue.
          </p>
        </section>

        <section>
          <h2>7. Address Changes</h2>
          <p>
            If you need to change your shipping address, please contact us immediately. We can only modify addresses
            before the order has been shipped. Once shipped, we cannot guarantee address changes.
          </p>
        </section>

        <section>
          <h2>8. Bulk Orders</h2>
          <p>
            For bulk orders (10+ items), please contact us directly. We offer special shipping arrangements and rates
            for bulk purchases. Processing and delivery times may vary for bulk orders.
          </p>
        </section>

        <section>
          <h2>9. Perishable Products</h2>
          <p>
            Certain Ayurvedic products may have specific storage requirements. We take special care in packaging these
            items. Please ensure someone is available to receive the package to maintain product quality.
          </p>
        </section>

        <section>
          <h2>10. Contact for Shipping Queries</h2>
          <p>
            For any shipping-related questions or concerns, please contact us:
            <br />
            Email: {{ brand.email }}
            <br />
            We typically respond within 24 business hours.
          </p>
        </section>
      </div>
    </div>
    </div>

    <!-- CMS Content (if available and loaded) -->
    <div v-else-if="cmsPage" class="cms-loaded">
      <PageHero
        :title="cmsPage.title"
        :subtitle="cmsPage.subtitle || ''"
        variant="gradient"
      />

      <div class="container py-5">
        <div class="cms-content" v-html="cmsPage.content"></div>

        <div v-if="cmsPage.last_updated" class="text-muted text-center mt-5 small">
          Last Updated: {{ formatDate(cmsPage.last_updated) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CMSPageResponse } from '@/types/cms';
import PageHero from '@/components/PageHero.vue';

const brand = useBrand();
const config = useRuntimeConfig();

// Try to fetch CMS content
const { data: response, pending, error } = await useFetch<CMSPageResponse>(`${config.public.apiBase}/pages/shipping-policy`, {
  // If CMS page doesn't exist, we'll use static content
  onResponseError() {
    // Silently fail and use static content
  }
});

// Extract page data from response
const cmsPage = computed(() => response.value?.data);

// Format date helper
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

definePageMeta({
  layout: 'default',
})

useHead({
  title: `Shipping Policy - ${brand.fullName}`,
  meta: [
    { name: 'description', content: `Shipping Policy for ${brand.fullName}` }
  ]
})
</script>

<style scoped lang="scss">
.legal-page {
  min-height: 100vh;
  padding: 4rem 0;
  background: var(--surface-muted);
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
}

.legal-content {
  background: var(--surface-primary);
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h1 {
    color: var(--accent-primary);
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .last-updated {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin-bottom: 2rem;
    font-style: italic;
  }

  section {
    margin-bottom: 2.5rem;

    h2 {
      color: var(--accent-primary);
      font-size: 1.5rem;
      margin-bottom: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-subtle);
    }

    p {
      line-height: 1.8;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    ul {
      margin-left: 1.5rem;
      line-height: 1.8;
      
      li {
        margin-bottom: 0.5rem;
      color: var(--text-primary);
      }

      strong {
        color: var(--accent-primary);
      }
    }
  }
}

@media (max-width: 768px) {
  .legal-page {
    padding: 2rem 0;
  }

  .legal-content {
    padding: 1.5rem;

    h1 {
      font-size: 2rem;
    }

    section h2 {
      font-size: 1.25rem;
    }
  }
}

.cms-content {
  max-width: 900px;
  margin: 0 auto;
  background: var(--surface-primary);
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  :deep(h1), :deep(h2), :deep(h3) {
    color: var(--text-primary);
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  :deep(h2) {
    color: var(--accent-primary);
    font-size: 1.5rem;
  }

  :deep(p) {
    line-height: 1.8;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }

  :deep(ul), :deep(ol) {
    margin-left: 1.5rem;
    margin-bottom: 1.5rem;
    
    li {
      margin-bottom: 0.5rem;
      line-height: 1.6;
    }
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.3em;
}
</style>
