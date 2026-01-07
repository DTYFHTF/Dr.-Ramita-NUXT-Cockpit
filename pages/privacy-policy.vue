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
          <h1>Privacy Policy</h1>
          <p class="last-updated">Last Updated: January 7, 2026</p>

        <div class="important-notice">
          <p><strong>YOUR PRIVACY IS IMPORTANT TO US</strong></p>
          <p>This Privacy Policy describes how Rishipath ("we," "us," or "our") collects, uses, discloses, and protects your personal information when you use our website www.rishipath.com and related services. By using our Platform, you consent to the data practices described in this policy.</p>
        </div>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to Rishipath. We respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you about how we collect, use, store, and protect your personal information when you visit our website, purchase products, enroll in courses, book consultations, or use any of our services.
          </p>
          <p>
            This Privacy Policy applies to all information collected through our Platform (website, mobile applications, and any other digital services we offer) and any related services, sales, marketing, or events.
          </p>
          <p>
            <strong>Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access or use our Platform.</strong>
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          
          <h3>2.1 Personal Information You Provide to Us</h3>
          <p>We collect information that you voluntarily provide to us when you:</p>
          <ul>
            <li>Register for an account</li>
            <li>Make a purchase</li>
            <li>Enroll in a course or event</li>
            <li>Book a consultation</li>
            <li>Subscribe to our newsletter</li>
            <li>Contact customer support</li>
            <li>Participate in surveys or promotions</li>
            <li>Post reviews or comments</li>
          </ul>

          <p><strong>The personal information we collect may include:</strong></p>
          <ul>
            <li><strong>Identity Data:</strong> First name, last name, username, date of birth, gender</li>
            <li><strong>Contact Data:</strong> Email address, telephone number, billing address, shipping address</li>
            <li><strong>Account Data:</strong> Username, password, and other security information</li>
            <li><strong>Transaction Data:</strong> Details about purchases, payments, order history, and payment card information (processed securely through payment gateways)</li>
            <li><strong>Health Information:</strong> Information provided during consultation bookings or health assessments (with your explicit consent)</li>
            <li><strong>Profile Data:</strong> Your interests, preferences, feedback, and survey responses</li>
            <li><strong>Marketing Data:</strong> Your preferences in receiving marketing communications and your communication preferences</li>
          </ul>

          <h3>2.2 Information Collected Automatically</h3>
          <p>When you access our Platform, we automatically collect certain information about your device and usage:</p>
          <ul>
            <li><strong>Technical Data:</strong> IP address, browser type and version, operating system, device type, time zone setting</li>
            <li><strong>Usage Data:</strong> Information about how you use our website, products, and services (pages visited, time spent, links clicked)</li>
            <li><strong>Location Data:</strong> We may collect information about your location (with your permission)</li>
            <li><strong>Cookies and Similar Technologies:</strong> We use cookies, web beacons, and similar tracking technologies to collect information (see Section 7 for details)</li>
          </ul>

          <h3>2.3 Information from Third Parties</h3>
          <p>We may receive information about you from third parties, including:</p>
          <ul>
            <li>Payment processors (Razorpay and other payment gateways)</li>
            <li>Social media platforms (if you choose to connect your account)</li>
            <li>Analytics providers</li>
            <li>Advertising networks</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use your personal information for the following purposes:</p>

          <h3>3.1 To Provide and Manage Our Services</h3>
          <ul>
            <li>Process and fulfill your orders</li>
            <li>Manage your account and registration</li>
            <li>Facilitate consultations with practitioners</li>
            <li>Provide access to courses and events</li>
            <li>Process payments and prevent fraud</li>
            <li>Communicate with you about your orders, account, or services</li>
          </ul>

          <h3>3.2 To Improve Our Services</h3>
          <ul>
            <li>Understand how customers use our Platform</li>
            <li>Develop new products, services, and features</li>
            <li>Conduct research and analysis</li>
            <li>Monitor and analyze usage trends</li>
          </ul>

          <h3>3.3 For Marketing and Communication</h3>
          <ul>
            <li>Send you promotional communications about new products, special offers, and events (with your consent)</li>
            <li>Conduct surveys and gather feedback</li>
            <li>Send you newsletters and educational content about Ayurveda</li>
            <li>Display personalized advertisements</li>
          </ul>

          <h3>3.4 For Legal and Security Purposes</h3>
          <ul>
            <li>Comply with legal obligations and regulations</li>
            <li>Protect against fraud, abuse, and security threats</li>
            <li>Enforce our Terms and Conditions</li>
            <li>Resolve disputes and troubleshoot problems</li>
            <li>Respond to legal requests from authorities</li>
          </ul>
        </section>

        <section>
          <h2>4. Legal Basis for Processing (GDPR Compliance)</h2>
          <p>If you are from the European Economic Area (EEA), our legal basis for collecting and using your personal information depends on the data and context:</p>
          <ul>
            <li><strong>Contract Performance:</strong> Processing is necessary to fulfill our contract with you (e.g., processing orders)</li>
            <li><strong>Consent:</strong> You have given us explicit consent for specific purposes (e.g., marketing communications)</li>
            <li><strong>Legitimate Interests:</strong> Processing is necessary for our legitimate business interests (e.g., improving services, fraud prevention)</li>
            <li><strong>Legal Obligation:</strong> Processing is necessary to comply with legal requirements</li>
          </ul>
        </section>

        <section>
          <h2>5. How We Share Your Information</h2>
          <p>We do not sell your personal information. We may share your information with:</p>

          <h3>5.1 Service Providers</h3>
          <p>We share information with third-party service providers who perform services on our behalf:</p>
          <ul>
            <li>Payment processors (Razorpay, etc.)</li>
            <li>Shipping and logistics companies</li>
            <li>Cloud hosting providers</li>
            <li>Email service providers</li>
            <li>Analytics providers</li>
            <li>Marketing and advertising partners</li>
          </ul>

          <h3>5.2 Healthcare Practitioners</h3>
          <p>If you book a consultation, we share relevant information with the assigned practitioner to provide you with appropriate care and advice.</p>

          <h3>5.3 Legal Requirements</h3>
          <p>We may disclose your information if required by law or if we believe such action is necessary to:</p>
          <ul>
            <li>Comply with legal obligations or court orders</li>
            <li>Protect our rights, property, or safety</li>
            <li>Investigate fraud or security issues</li>
            <li>Respond to government requests</li>
          </ul>

          <h3>5.4 Business Transfers</h3>
          <p>If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</p>
        </section>

        <section>
          <h2>6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction. These measures include:
          </p>
          <ul>
            <li>Encryption of sensitive data (SSL/TLS encryption)</li>
            <li>Secure payment processing through PCI-DSS compliant gateways</li>
            <li>Regular security assessments and updates</li>
            <li>Access controls and authentication mechanisms</li>
            <li>Employee training on data protection</li>
            <li>Regular backups and disaster recovery procedures</li>
          </ul>
          <p>
            However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee absolute security.
          </p>
          <p>
            <strong>You are responsible for maintaining the confidentiality of your account credentials.</strong> If you suspect unauthorized access to your account, please contact us immediately.
          </p>
        </section>

        <section>
          <h2>7. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies, web beacons, and similar tracking technologies to enhance your experience on our Platform.
          </p>

          <h3>7.1 What Are Cookies?</h3>
          <p>
            Cookies are small text files stored on your device that help us recognize you, remember your preferences, and improve our services.
          </p>

          <h3>7.2 Types of Cookies We Use</h3>
          <ul>
            <li><strong>Essential Cookies:</strong> Necessary for the Platform to function (e.g., shopping cart, authentication)</li>
            <li><strong>Performance Cookies:</strong> Help us understand how visitors use our site (e.g., Google Analytics)</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
            <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
          </ul>

          <h3>7.3 Managing Cookies</h3>
          <p>
            You can control and manage cookies through your browser settings. However, disabling cookies may affect the functionality of our Platform. Most browsers allow you to:
          </p>
          <ul>
            <li>View and delete cookies</li>
            <li>Block third-party cookies</li>
            <li>Block cookies from specific sites</li>
            <li>Block all cookies</li>
          </ul>
        </section>

        <section>
          <h2>8. Data Retention</h2>
          <p>
            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
          </p>
          <ul>
            <li><strong>Account Information:</strong> Retained until you request deletion or close your account</li>
            <li><strong>Transaction Data:</strong> Retained for 7 years for tax and accounting purposes</li>
            <li><strong>Marketing Data:</strong> Retained until you unsubscribe or withdraw consent</li>
            <li><strong>Technical Data:</strong> Typically retained for 12-24 months</li>
          </ul>
          <p>
            After the retention period expires, we will securely delete or anonymize your personal information.
          </p>
        </section>

        <section>
          <h2>9. Your Rights and Choices</h2>
          <p>You have the following rights regarding your personal information:</p>

          <h3>9.1 Right to Access</h3>
          <p>You can request a copy of the personal information we hold about you.</p>

          <h3>9.2 Right to Rectification</h3>
          <p>You can request that we correct any inaccurate or incomplete information.</p>

          <h3>9.3 Right to Erasure (Right to be Forgotten)</h3>
          <p>You can request that we delete your personal information, subject to certain legal exceptions.</p>

          <h3>9.4 Right to Restrict Processing</h3>
          <p>You can request that we limit how we use your information.</p>

          <h3>9.5 Right to Data Portability</h3>
          <p>You can request a copy of your data in a structured, machine-readable format.</p>

          <h3>9.6 Right to Object</h3>
          <p>You can object to certain types of processing, including direct marketing.</p>

          <h3>9.7 Right to Withdraw Consent</h3>
          <p>If we rely on your consent to process your information, you can withdraw consent at any time.</p>

          <h3>9.8 How to Exercise Your Rights</h3>
          <p>To exercise any of these rights, please:</p>
          <ul>
            <li>Log in to your account and update your settings</li>
            <li>Contact us at <strong>{{ brand.email }}</strong></li>
            <li>Use the unsubscribe link in marketing emails</li>
          </ul>
          <p>We will respond to your request within 30 days.</p>
        </section>

        <section>
          <h2>10. Marketing Communications</h2>
          <p>
            With your consent, we may send you promotional emails, newsletters, and updates about our products, services, and events.
          </p>
          <p><strong>You can opt-out at any time by:</strong></p>
          <ul>
            <li>Clicking the "unsubscribe" link in any marketing email</li>
            <li>Updating your email preferences in your account settings</li>
            <li>Contacting us at {{ brand.email }}</li>
          </ul>
          <p>
            Note: Even if you opt-out of marketing communications, we will still send you transactional emails related to your account and orders (e.g., order confirmations, shipping notifications).
          </p>
        </section>

        <section>
          <h2>11. Third-Party Links and Services</h2>
          <p>
            Our Platform may contain links to third-party websites, applications, or services (e.g., social media, payment gateways). We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any information.
          </p>
        </section>

        <section>
          <h2>12. Children's Privacy</h2>
          <p>
            Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately, and we will delete such information.
          </p>
        </section>

        <section>
          <h2>13. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. We ensure that appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
          </p>
        </section>

        <section>
          <h2>14. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by:
          </p>
          <ul>
            <li>Posting the updated policy on our Platform</li>
            <li>Updating the "Last Updated" date at the top of this policy</li>
            <li>Sending you an email notification (for significant changes)</li>
          </ul>
          <p>
            Your continued use of our Platform after the changes become effective constitutes your acceptance of the revised Privacy Policy.
          </p>
        </section>

        <section>
          <h2>15. California Privacy Rights (CCPA)</h2>
          <p>
            If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
          </p>
          <ul>
            <li>Right to know what personal information we collect, use, and disclose</li>
            <li>Right to request deletion of your personal information</li>
            <li>Right to opt-out of the sale of personal information (we do not sell personal information)</li>
            <li>Right to non-discrimination for exercising your rights</li>
          </ul>
          <p>To exercise these rights, contact us at {{ brand.email }}.</p>
        </section>

        <section>
          <h2>16. Contact Information</h2>
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
          </p>
          <p>
            <strong>Rishipath</strong><br>
            <strong>Email:</strong> {{ brand.email }}<br>
            <strong>Website:</strong> www.rishipath.com
          </p>
          <p>
            We are committed to resolving any privacy concerns you may have and will respond to your inquiry within 30 days.
          </p>
        </section>

        <section>
          <h2>17. Consent</h2>
          <p>
            By using our Platform, you consent to the collection, use, and sharing of your personal information as described in this Privacy Policy. If you do not agree with this Privacy Policy, please do not use our services.
          </p>
        </section>

        <div class="acknowledgement">
          <p><strong>By using Rishipath, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.</strong></p>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHero from '@/components/PageHero.vue';

const { page: cmsPage, pending, formatDate } = await useCMSPage('privacy-policy');
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

  .important-notice {
    background: #d1ecf1;
    border-left: 4px solid #17a2b8;
    padding: 1.5rem;
    margin-bottom: 2rem;
    border-radius: 4px;

    p {
      margin-bottom: 0.75rem;
      color: #0c5460;
      line-height: 1.6;

      &:last-child {
        margin-bottom: 0;
      }
    }

    strong {
      font-weight: 600;
    }
  }

  .acknowledgement {
    background: #d4edda;
    border-left: 4px solid #28a745;
    padding: 1.5rem;
    margin-top: 2rem;
    border-radius: 4px;

    p {
      margin: 0;
      color: #155724;
      font-size: 1.05rem;
      line-height: 1.6;
    }

    strong {
      font-weight: 600;
    }
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

    h3 {
      color: darken($color-primary, 10%);
      font-size: 1.2rem;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      font-weight: 600;
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

.cms-content {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  :deep(h1), :deep(h2), :deep(h3) {
    color: var(--text-primary);
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  :deep(h2) {
    color: $color-primary;
    font-size: 1.5rem;
  }

  :deep(p) {
    line-height: 1.8;
    color: var(--text-dark);
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
