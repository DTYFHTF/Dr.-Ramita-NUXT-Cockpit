<template>
  <div class="legal-page">
    <div class="container">
      <div class="legal-content">
        <h1>Terms of Service</h1>
        <p class="last-updated">Last Updated: January 2025</p>

        <section>
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing and using {{ brand.fullName }}, you accept and agree to be bound by the terms and provision
            of this agreement. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section>
          <h2>2. Use of Services</h2>
          <p>Our services are intended for:</p>
          <ul>
            <li>Purchase of Ayurvedic products</li>
            <li>Enrollment in wellness courses and events</li>
            <li>Access to educational content and resources</li>
            <li>Consultation bookings with practitioners</li>
          </ul>
          <p>
            You agree to use our services only for lawful purposes and in accordance with these Terms.
          </p>
        </section>

        <section>
          <h2>3. Account Registration</h2>
          <p>
            To access certain features, you may be required to create an account. You are responsible for:
          </p>
          <ul>
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized use</li>
            <li>Ensuring your account information is accurate and up-to-date</li>
          </ul>
        </section>

        <section>
          <h2>4. Product Information</h2>
          <p>
            We strive to provide accurate product descriptions and pricing. However, we do not warrant that product
            descriptions, pricing, or other content is accurate, complete, reliable, current, or error-free.
          </p>
        </section>

        <section>
          <h2>5. Orders and Payment</h2>
          <ul>
            <li>All orders are subject to acceptance and availability</li>
            <li>We reserve the right to refuse or cancel any order</li>
            <li>Payment must be received before order processing</li>
            <li>Prices are subject to change without notice</li>
          </ul>
        </section>

        <section>
          <h2>6. Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, images, and software, is the property of
            {{ brand.fullName }} and is protected by copyright and other intellectual property laws.
          </p>
        </section>

        <section>
          <h2>7. Disclaimer of Warranties</h2>
          <p>
            Our services and products are provided "as is" without warranty of any kind. We do not guarantee that our
            services will be uninterrupted, secure, or error-free.
          </p>
        </section>

        <section>
          <h2>8. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, {{ brand.fullName }} shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages resulting from your use of our services.
          </p>
        </section>

        <section>
          <h2>9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting
            to the website. Your continued use of our services constitutes acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2>10. Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact us at:
            <br />
            Email: {{ brand.email }}
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
const brand = useBrand();

definePageMeta({
  layout: 'default',
})

useHead({
  title: `Terms of Service - ${brand.fullName}`,
  meta: [
    { name: 'description', content: `Terms of Service for ${brand.fullName}` }
  ]
})
</script>

<style scoped lang="scss">
.legal-page {
  min-height: 100vh;
  padding: 4rem 0;
  background: $background-light;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
}

.legal-content {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h1 {
    color: $color-primary;
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
      color: $color-primary;
      font-size: 1.5rem;
      margin-bottom: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba($color-primary, 0.1);
    }

    p {
      line-height: 1.8;
      color: var(--text-dark);
      margin-bottom: 1rem;
    }

    ul {
      margin-left: 1.5rem;
      line-height: 1.8;
      
      li {
        margin-bottom: 0.5rem;
      color: var(--text-dark);
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
</style>
