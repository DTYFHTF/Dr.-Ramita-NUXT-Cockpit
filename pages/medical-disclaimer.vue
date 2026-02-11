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
          <h1>Medical Disclaimer</h1>
          <p class="last-updated">Last Updated: January 7, 2026</p>

        <div class="important-notice">
          <p><strong>IMPORTANT: PLEASE READ CAREFULLY</strong></p>
          <p>The information provided on Rishipath is for educational and informational purposes only and is not intended as medical advice, diagnosis, or treatment. Always consult with a qualified healthcare professional before making any health-related decisions.</p>
        </div>

        <section>
          <h2>1. General Information</h2>
          <p>
            Rishipath provides information about Ayurvedic products, practices, remedies, treatments, yoga, meditation, nutrition, and wellness. This information is intended to educate and inform users about traditional Ayurvedic approaches to health and well-being.
          </p>
          <p>
            <strong>The content on this website is NOT intended to:</strong>
          </p>
          <ul>
            <li>Diagnose any disease, condition, or health problem</li>
            <li>Prescribe any medication or treatment</li>
            <li>Replace professional medical advice, diagnosis, or treatment</li>
            <li>Cure, treat, or prevent any disease or medical condition</li>
            <li>Be a substitute for consultation with qualified healthcare professionals</li>
          </ul>
        </section>

        <section>
          <h2>2. Not a Substitute for Medical Advice</h2>
          <p>
            The information, products, and services offered on Rishipath should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified healthcare provider with any questions you may have regarding a medical condition.
          </p>
          <p>
            <strong>Never disregard professional medical advice or delay seeking it because of something you have read on this website.</strong>
          </p>
        </section>

        <section>
          <h2>3. Product Information</h2>
          <h3>3.1 Ayurvedic Products</h3>
          <p>
            The Ayurvedic products sold on Rishipath are traditional wellness supplements and natural products intended to support general health and well-being. These products are not drugs and have not been evaluated by the Food and Drug Administration (FDA) or similar regulatory bodies in all countries.
          </p>
          <p>
            <strong>Our products are not intended to diagnose, treat, cure, or prevent any disease.</strong>
          </p>

          <h3>3.2 Individual Results May Vary</h3>
          <p>
            Results from using Ayurvedic products and following Ayurvedic practices may vary from person to person. What works for one individual may not work for another. Factors such as age, constitution (Prakriti), current health status, lifestyle, diet, and adherence to recommendations all influence outcomes.
          </p>

          <h3>3.3 Product Safety</h3>
          <p>
            While we strive to provide safe, authentic, and high-quality Ayurvedic products, we recommend:
          </p>
          <ul>
            <li>Reading all product labels and descriptions carefully</li>
            <li>Checking for known allergens and contraindications</li>
            <li>Consulting your healthcare provider before using any new product, especially if you:
              <ul>
                <li>Are pregnant or nursing</li>
                <li>Have any medical conditions</li>
                <li>Are taking prescription medications</li>
                <li>Are under 18 years of age</li>
                <li>Are scheduled for surgery</li>
              </ul>
            </li>
            <li>Discontinuing use and consulting a healthcare professional if you experience any adverse reactions</li>
          </ul>
        </section>

        <section>
          <h2>4. Consultation Services</h2>
          <h3>4.1 Ayurvedic Consultations</h3>
          <p>
            Consultations provided through Rishipath are with Ayurvedic practitioners who offer guidance based on traditional Ayurvedic principles. These consultations are for wellness and lifestyle guidance and should not be considered medical consultations.
          </p>
          <p>
            <strong>Ayurvedic practitioners on our platform:</strong>
          </p>
          <ul>
            <li>Provide recommendations based on Ayurvedic assessment and principles</li>
            <li>Offer lifestyle and dietary suggestions for wellness</li>
            <li>Suggest Ayurvedic herbs and treatments for balance and well-being</li>
          </ul>

          <h3>4.2 Not a Doctor-Patient Relationship</h3>
          <p>
            The consultation services provided on Rishipath do not create a doctor-patient relationship. Our practitioners provide wellness guidance based on Ayurvedic tradition, not medical diagnosis or treatment.
          </p>
          <p>
            <strong>If you have a medical condition or medical emergency, consult with a licensed physician immediately.</strong>
          </p>
        </section>

        <section>
          <h2>5. Educational Content</h2>
          <p>
            Educational content on Rishipath, including articles, blog posts, home remedies, recipes, yoga practices, and meditation techniques, is provided for informational and educational purposes only.
          </p>
          <p>
            <strong>This content:</strong>
          </p>
          <ul>
            <li>Is based on traditional Ayurvedic texts and practices</li>
            <li>May not be scientifically validated or approved by modern medical standards</li>
            <li>Should not replace professional medical advice</li>
            <li>May not be suitable for everyone</li>
            <li>Should be used at your own discretion and risk</li>
          </ul>
        </section>

        <section>
          <h2>6. Courses and Events</h2>
          <p>
            Courses, workshops, and events offered through Rishipath are educational programs designed to teach about Ayurveda, yoga, meditation, and wellness practices. They are not medical training programs and should not be used as a basis for self-diagnosis or self-treatment.
          </p>
          <p>
            Participants in our courses and events should:
          </p>
          <ul>
            <li>Consult healthcare professionals before implementing new practices</li>
            <li>Practice within their own physical and mental limitations</li>
            <li>Inform instructors of any health conditions or concerns</li>
            <li>Stop any practice that causes discomfort or pain</li>
          </ul>
        </section>

        <section>
          <h2>7. Accuracy of Information</h2>
          <p>
            While we make every effort to ensure that the information on Rishipath is accurate, complete, and current, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information.
          </p>
          <p>
            <strong>We do not guarantee that:</strong>
          </p>
          <ul>
            <li>The information is free from errors or omissions</li>
            <li>The information is up-to-date with the latest research or findings</li>
            <li>The information is applicable to your specific situation</li>
            <li>Following the information will produce specific results</li>
          </ul>
        </section>

        <section>
          <h2>8. Medical Emergencies</h2>
          <p>
            <strong>IF YOU ARE EXPERIENCING A MEDICAL EMERGENCY, CALL YOUR LOCAL EMERGENCY NUMBER (such as 911 in the United States, 112 in India) OR GO TO THE NEAREST EMERGENCY ROOM IMMEDIATELY.</strong>
          </p>
          <p>
            Do not use Rishipath or contact our practitioners for medical emergencies. Our services are not designed to address acute medical situations.
          </p>
        </section>

        <section>
          <h2>9. Interactions with Medications</h2>
          <p>
            Ayurvedic herbs and supplements can interact with prescription medications, over-the-counter drugs, and other supplements. Some herbs may:
          </p>
          <ul>
            <li>Increase or decrease the effectiveness of medications</li>
            <li>Cause adverse reactions when combined with certain drugs</li>
            <li>Affect blood sugar levels, blood pressure, or blood clotting</li>
            <li>Interfere with anesthesia or surgery</li>
          </ul>
          <p>
            <strong>Always inform your healthcare provider and pharmacist about all herbs, supplements, and Ayurvedic products you are using.</strong>
          </p>
        </section>

        <section>
          <h2>10. Pregnancy and Nursing</h2>
          <p>
            If you are pregnant, planning to become pregnant, or nursing, consult with your healthcare provider before:
          </p>
          <ul>
            <li>Using any Ayurvedic products or herbs</li>
            <li>Starting any new diet or wellness program</li>
            <li>Practicing yoga or meditation techniques</li>
            <li>Making significant lifestyle changes</li>
          </ul>
          <p>
            Some herbs and practices that are generally safe may not be appropriate during pregnancy or while nursing.
          </p>
        </section>

        <section>
          <h2>11. Children and Minors</h2>
          <p>
            Our products and services are generally intended for adults. If you are considering using Ayurvedic products or practices for children under 18, please consult with a qualified pediatrician or healthcare provider first.
          </p>
          <p>
            Children may have different sensitivities and requirements than adults, and products/dosages suitable for adults may not be appropriate for children.
          </p>
        </section>

        <section>
          <h2>12. Allergies and Sensitivities</h2>
          <p>
            Ayurvedic products contain natural ingredients, including herbs, minerals, and other botanical substances. If you have known allergies or sensitivities to any ingredients:
          </p>
          <ul>
            <li>Carefully read all product labels and ingredient lists</li>
            <li>Consult your healthcare provider before use</li>
            <li>Start with small amounts to test for reactions</li>
            <li>Discontinue use immediately if you experience any adverse reactions</li>
          </ul>
          <p>
            <strong>Natural does not mean risk-free or suitable for everyone.</strong>
          </p>
        </section>

        <section>
          <h2>13. Third-Party Content and Links</h2>
          <p>
            Rishipath may contain links to third-party websites or reference third-party information. We do not endorse or take responsibility for the content, accuracy, or medical claims made by third parties. Always verify information with qualified healthcare professionals.
          </p>
        </section>

        <section>
          <h2>14. User Testimonials and Reviews</h2>
          <p>
            Testimonials and reviews on Rishipath represent individual experiences and opinions. They are not:
          </p>
          <ul>
            <li>Verified medical claims</li>
            <li>Guarantees of results</li>
            <li>Professional medical opinions</li>
            <li>Approved by regulatory authorities</li>
          </ul>
          <p>
            Your results may differ. Individual experiences do not constitute scientific evidence or medical advice.
          </p>
        </section>

        <section>
          <h2>15. Quality and Authenticity</h2>
          <p>
            While we strive to source authentic, high-quality Ayurvedic products from reputable suppliers, we cannot guarantee:
          </p>
          <ul>
            <li>That products will meet all regulatory standards in all jurisdictions</li>
            <li>That products are completely free from contaminants (though we work with suppliers who follow good manufacturing practices)</li>
            <li>That traditional preparation methods match exactly those described in classical texts</li>
          </ul>
          <p>
            We recommend purchasing from licensed practitioners when possible and reporting any quality concerns to us immediately.
          </p>
        </section>

        <section>
          <h2>16. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Rishipath, its owners, employees, practitioners, and affiliates shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from:
          </p>
          <ul>
            <li>Use of products or services purchased through our platform</li>
            <li>Reliance on information provided on our website</li>
            <li>Consultations with practitioners on our platform</li>
            <li>Participation in courses, events, or programs</li>
            <li>Implementation of home remedies, recipes, or practices</li>
            <li>Any health outcomes, whether positive or negative</li>
          </ul>
        </section>

        <section>
          <h2>17. Assumption of Risk</h2>
          <p>
            By using Rishipath and purchasing products or services, you acknowledge and accept that:
          </p>
          <ul>
            <li>You are responsible for your own health decisions</li>
            <li>You understand the limitations of Ayurvedic approaches</li>
            <li>You will consult healthcare professionals as appropriate</li>
            <li>You assume all risks associated with using products and services</li>
            <li>You will follow product instructions and safety guidelines</li>
          </ul>
        </section>

        <section>
          <h2>18. Regulatory Status</h2>
          <p>
            Ayurvedic products and practices have varying regulatory status in different countries. In some jurisdictions, Ayurvedic products may be classified as dietary supplements, traditional medicines, or may not be regulated at all.
          </p>
          <p>
            <strong>It is your responsibility to ensure that purchasing and using products is legal in your jurisdiction.</strong>
          </p>
        </section>

        <section>
          <h2>19. Updates to This Disclaimer</h2>
          <p>
            We may update this Medical Disclaimer from time to time to reflect changes in our practices, products, or legal requirements. Please review this page periodically. Your continued use of Rishipath after any changes constitutes acceptance of the updated disclaimer.
          </p>
        </section>

        <section>
          <h2>20. Contact Information</h2>
          <p>
            If you have questions about this Medical Disclaimer or concerns about products or services, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> {{ brand.email }}<br>
            <strong>Website:</strong> www.rishipath.com
          </p>
          <p>
            <strong>However, please note that we cannot provide medical advice through email or our contact forms. For medical questions or concerns, please consult with a qualified healthcare professional.</strong>
          </p>
        </section>

        <div class="acknowledgement">
          <p><strong>By using Rishipath and purchasing products or services, you acknowledge that you have read, understood, and agree to this Medical Disclaimer.</strong></p>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHero from '@/components/PageHero.vue';

const { page: cmsPage, pending, formatDate } = await useCMSPage('medical-disclaimer');
const brand = useBrand();

usePageSeo({
  title: 'Medical Disclaimer',
  description: `Medical Disclaimer for ${brand.fullName} - Important information about Ayurvedic products and services.`,
  path: '/medical-disclaimer',
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

  .important-notice {
    background: var(--status-error-bg);
    border-left: 4px solid var(--status-error);
    padding: 1.5rem;
    margin-bottom: 2rem;
    border-radius: 4px;

    p {
      margin-bottom: 0.75rem;
      color: var(--status-error-text);
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
    background: var(--status-success-bg);
    border-left: 4px solid var(--status-success);
    padding: 1.5rem;
    margin-top: 2rem;
    border-radius: 4px;

    p {
      margin: 0;
      color: var(--status-success-text);
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
      color: var(--accent-primary);
      font-size: 1.5rem;
      margin-bottom: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-subtle);
    }

    h3 {
      color: var(--accent-hover);
      font-size: 1.2rem;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      font-weight: 600;
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

        ul {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
      }

      strong {
        color: var(--accent-primary);
        font-weight: 600;
      }
    }

    ol {
      margin-left: 1.5rem;
      line-height: 1.8;

      li {
        margin-bottom: 0.5rem;
        color: var(--text-primary);
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

    section h3 {
      font-size: 1.1rem;
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
