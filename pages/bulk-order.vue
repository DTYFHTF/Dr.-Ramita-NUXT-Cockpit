<template>
  <div class="bulk-order-page">
    <div class="container py-5">
      <!-- Hero Section -->
      <div class="hero-section text-center mb-5">
        <h1 class="page-title">
          <LucideIcon icon="mdi:package-variant-closed" size="40" class="me-3" />
          Wholesale & Bulk Orders
        </h1>
        <p class="page-subtitle">
          Looking to purchase in bulk? Submit your requirements and our team will provide you with a customized quotation.
        </p>
        <div class="features-grid mt-4">
          <div class="feature-item">
            <LucideIcon icon="mdi:checkbox-marked-circle" class="feature-icon" />
            <span>Minimum 10 units per product</span>
          </div>
          <div class="feature-item">
            <LucideIcon icon="mdi:truck-fast" class="feature-icon" />
            <span>Worldwide shipping available</span>
          </div>
          <div class="feature-item">
            <LucideIcon icon="mdi:account-tie" class="feature-icon" />
            <span>Dedicated account manager</span>
          </div>
          <div class="feature-item">
            <LucideIcon icon="mdi:clock-time-four" class="feature-icon" />
            <span>24-48 hour response time</span>
          </div>
        </div>
      </div>

      <!-- Auth Check Alert -->
      <div v-if="!userStore.user || !userStore.token" class="alert alert-warning text-center mb-4">
        <LucideIcon icon="mdi:alert-circle" class="me-2" />
        You need to be logged in to submit a bulk order inquiry.
        <NuxtLink to="/login" class=" mt-3 btn  btn-smooth-primary ms-3">
          Login Now
        </NuxtLink>
      </div>

      <!-- Form Section -->
      <div v-else class="form-container">
        <BulkOrderInquiryForm />
      </div>

      <!-- Additional Information -->
      <div class="info-section mt-5">
        <div class="row g-4">
          <div class="col-md-4">
            <div class="info-card">
              <LucideIcon icon="mdi:shield-check" class="info-icon" />
              <h4>Quality Assured</h4>
              <p>All our products are certified and meet international quality standards.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="info-card">
              <LucideIcon icon="mdi:handshake" class="info-icon" />
              <h4>Flexible Terms</h4>
              <p>We offer flexible payment terms and competitive pricing for bulk orders.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="info-card">
              <LucideIcon icon="mdi:headset" class="info-icon" />
              <h4>Support 24/7</h4>
              <p>Our dedicated team is available round the clock to assist you.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="faq-section mt-5">
        <h3 class="text-center mb-4">Frequently Asked Questions</h3>
        <div class="accordion" id="bulkOrderFAQ">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq1"
              >
                What is the minimum order quantity?
              </button>
            </h2>
            <div id="faq1" class="accordion-collapse collapse show" data-bs-parent="#bulkOrderFAQ">
              <div class="accordion-body">
                The minimum order quantity is 10 units per product. However, we can discuss custom requirements based on your specific needs.
              </div>
            </div>
          </div>

          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq2"
              >
                Do you ship internationally?
              </button>
            </h2>
            <div id="faq2" class="accordion-collapse collapse" data-bs-parent="#bulkOrderFAQ">
              <div class="accordion-body">
                Yes, we ship worldwide. Shipping costs and delivery times will be calculated based on your location and order size.
              </div>
            </div>
          </div>

          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq3"
              >
                How long does it take to receive a quotation?
              </button>
            </h2>
            <div id="faq3" class="accordion-collapse collapse" data-bs-parent="#bulkOrderFAQ">
              <div class="accordion-body">
                Our team typically responds within 24-48 hours with a detailed quotation tailored to your requirements.
              </div>
            </div>
          </div>

          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq4"
              >
                Can I request product samples before placing a bulk order?
              </button>
            </h2>
            <div id="faq4" class="accordion-collapse collapse" data-bs-parent="#bulkOrderFAQ">
              <div class="accordion-body">
                Yes, we can arrange product samples for evaluation. Please mention this in your inquiry message, and we'll provide details on sample availability and costs.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import LucideIcon from '@/components/LucideIcon.vue'
import BulkOrderInquiryForm from '@/components/BulkOrderInquiryForm.vue'

const userStore = useUserStore()

// Page metadata
definePageMeta({
  layout: 'auth'
})

useHead({
  title: 'Wholesale & Bulk Orders - Dr. Ramita Ayurveda',
  meta: [
    {
      name: 'description',
      content: 'Request wholesale pricing and bulk order quotations for authentic Ayurvedic products. Minimum 10 units per product with worldwide shipping available.'
    },
    {
      name: 'keywords',
      content: 'wholesale ayurveda, bulk orders, ayurvedic products wholesale, bulk purchase, wholesale inquiry'
    }
  ]
})
</script>

<style scoped lang="scss">
.bulk-order-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--background-white) 0%, var(--background-light) 100%);
}


.container {
  max-width: 1200px;
}

.hero-section {
  padding: 2rem 0;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    font-size: 2rem;
    flex-direction: column;
    gap: 1rem;
  }
}

.page-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--background-white);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.feature-icon {
  color: var(--color-success);
  font-size: 1.5rem;
  flex-shrink: 0;
}

.form-container {
  background: var(--background-white);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.info-section {
  margin-top: 3rem;
}

.info-card {
  text-align: center;
  padding: 2rem;
  background: var(--background-white);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  height: 100%;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }

  h4 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 1rem 0 0.5rem;
  }

  p {
    color: var(--text-secondary);
    margin: 0;
  }
}

.info-icon {
  font-size: 3rem;
  color: var(--color-primary);
}

.faq-section {
  max-width: 800px;
  margin: 3rem auto;
  padding: 2rem;
  background: var(--background-white);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

  h3 {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--text-primary);
  }
}

.accordion-item {
  border: 1px solid var(--border-color);
  margin-bottom: 0.5rem;
  border-radius: 8px !important;
  overflow: hidden;
}

.accordion-button {
  background-color: var(--background-white);
  color: var(--text-primary);
  font-weight: 500;
  padding: 1.25rem;

  &:not(.collapsed) {
    background-color: var(--background-light);
    color: var(--color-primary);
  }

  &:focus {
    box-shadow: none;
    border-color: var(--border-color);
  }
}

.accordion-body {
  padding: 1.25rem;
  color: var(--text-secondary);
  background-color: var(--background-white);
}

@media (max-width: 768px) {
  .hero-section {
    padding: 1rem 0;
  }

  .form-container {
    padding: 1rem;
  }

  .faq-section {
    padding: 1rem;
  }
}
</style>
