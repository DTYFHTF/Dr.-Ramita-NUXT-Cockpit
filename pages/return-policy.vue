<template>
  <div class="cms-page">
    <!-- Loading State -->
    <div v-if="pending" class="container py-5 text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- CMS Content (if available) -->
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

    <!-- Static Fallback Content -->
    <div v-else class="legal-page">
      <div class="container">
        <div class="legal-content">
          <h1>Return & Refund Policy</h1>
          <p class="last-updated">Last Updated: January 7, 2026</p>

        <section>
          <h2>1. Return Eligibility</h2>
          <p>
            We want you to be completely satisfied with your purchase. You may return most items within 7 days of
            delivery for a refund or exchange, provided they meet the following conditions:
          </p>
          <ul>
            <li>Item is unused and in original condition</li>
            <li>Original packaging is intact</li>
            <li>All tags and labels are attached</li>
            <li>You have the original receipt or proof of purchase</li>
          </ul>
        </section>

        <section>
          <h2>2. Non-Returnable Items</h2>
          <p>For health and safety reasons, the following items cannot be returned:</p>
          <ul>
            <li>Opened or used personal care products</li>
            <li>Consumable items (oils, powders, capsules) once opened</li>
            <li>Digital products (online courses, e-books)</li>
            <li>Gift cards</li>
            <li>Clearance or sale items marked as final sale</li>
          </ul>
        </section>

        <section>
          <h2>3. How to Initiate a Return</h2>
          <p>To start a return:</p>
          <ol>
            <li>Log in to your account and go to "My Orders"</li>
            <li>Select the order containing the item you wish to return</li>
            <li>Click "Request Return" and select the reason</li>
            <li>Wait for our team to approve your return request (usually within 24 hours)</li>
            <li>Pack the item securely in its original packaging</li>
            <li>Ship the item to the address provided in the return confirmation email</li>
          </ol>
        </section>

        <section>
          <h2>4. Return Shipping</h2>
          <ul>
            <li>Return shipping costs are the customer's responsibility unless the item is defective or incorrect</li>
            <li>We recommend using a trackable shipping service</li>
            <li>We are not responsible for items lost in return transit</li>
            <li>For defective or incorrect items, we will provide a prepaid return label</li>
          </ul>
        </section>

        <section>
          <h2>5. Refund Process</h2>
          <p>Once we receive and inspect your returned item:</p>
          <ul>
            <li>You will receive an email confirming receipt of your return</li>
            <li>Refunds are processed within 5-7 business days</li>
            <li>The refund will be credited to your original payment method</li>
            <li>Bank processing times may take an additional 3-5 business days</li>
            <li>Original shipping charges are non-refundable (unless we made an error)</li>
          </ul>
        </section>

        <section>
          <h2>6. Exchanges</h2>
          <p>
            If you need to exchange an item for a different size, color, or product:
          </p>
          <ul>
            <li>Follow the return process above and indicate you want an exchange</li>
            <li>Once we receive the returned item, we'll ship the replacement</li>
            <li>If there's a price difference, we'll either refund or charge the difference</li>
            <li>Exchanges are subject to product availability</li>
          </ul>
        </section>

        <section>
          <h2>7. Damaged or Defective Items</h2>
          <p>
            If you receive a damaged or defective item, please contact us within 48 hours of delivery:
          </p>
          <ul>
            <li>Take photos of the damaged item and packaging</li>
            <li>Email us at {{ brand.email }} with your order number and photos</li>
            <li>We'll arrange for a replacement or full refund</li>
            <li>We'll provide a prepaid return label if needed</li>
          </ul>
        </section>

        <section>
          <h2>8. Incorrect Items</h2>
          <p>
            If you receive the wrong item, please contact us immediately. We'll arrange for the correct item to be
            shipped at no additional cost and provide a return label for the incorrect item.
          </p>
        </section>

        <section>
          <h2>9. Courses and Events</h2>
          <ul>
            <li><strong>Online Courses:</strong> Refunds available within 7 days if less than 20% of content accessed</li>
            <li><strong>Event Registrations:</strong> Cancellations made 14+ days before the event receive full refund</li>
            <li><strong>Late Cancellations:</strong> 7-13 days before event: 50% refund; Less than 7 days: no refund</li>
          </ul>
        </section>

        <section>
          <h2>10. Contact Us</h2>
          <p>
            For questions about returns or refunds, please contact our customer service:
            <br />
            Email: {{ brand.email }}
            <br />
            Response time: Within 24 business hours
          </p>
        </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHero from '@/components/PageHero.vue';

const { page: cmsPage, pending, formatDate } = await useCMSPage('return-policy');
const brand = useBrand();

definePageMeta({
  layout: 'default',
})

useHead({
  title: `Return & Refund Policy - ${brand.fullName}`,
  meta: [
    { name: 'description', content: `Return and Refund Policy for ${brand.fullName}` }
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

    ul, ol {
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
