<template>
  <div class="legal-page">
    <div class="container">
      <div class="legal-content">
        <h1>Privacy Policy</h1>
        <p class="last-updated">Last Updated: January 2025</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to {{ brand.fullName }}. We respect your privacy and are committed to protecting your personal data.
            This privacy policy will inform you about how we look after your personal data when you visit our website and
            tell you about your privacy rights.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>We may collect, use, store and transfer different kinds of personal data about you:</p>
          <ul>
            <li><strong>Identity Data:</strong> First name, last name, username</li>
            <li><strong>Contact Data:</strong> Email address, telephone numbers, billing address, delivery address</li>
            <li><strong>Transaction Data:</strong> Details about payments and products purchased</li>
            <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
            <li><strong>Usage Data:</strong> Information about how you use our website and services</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use your personal data for the following purposes:</p>
          <ul>
            <li>To process and deliver your orders</li>
            <li>To manage your account and provide customer support</li>
            <li>To send you marketing communications (with your consent)</li>
            <li>To improve our website and services</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Security</h2>
          <p>
            We have implemented appropriate security measures to prevent your personal data from being accidentally lost,
            used or accessed in an unauthorized way. We limit access to your personal data to those employees and partners
            who have a business need to know.
          </p>
        </section>

        <section>
          <h2>5. Your Rights</h2>
          <p>Under data protection laws, you have rights including:</p>
          <ul>
            <li>Right to access your personal data</li>
            <li>Right to rectification of inaccurate data</li>
            <li>Right to erasure of your data</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
          </ul>
        </section>

        <section>
          <h2>6. Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our website and store certain information.
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
        </section>

        <section>
          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
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
  title: `Privacy Policy - ${brand.fullName}`,
  meta: [
    { name: 'description', content: `Privacy Policy for ${brand.fullName}` }
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

      strong {
        color: $color-primary;
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
