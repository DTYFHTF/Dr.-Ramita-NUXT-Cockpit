<template>
  <div class="contact-page">
    <div class="hero-section">
      <div class="container">
        <h1>Contact Us</h1>
        <p class="tagline">We're here to help with your wellness journey</p>
      </div>
    </div>

    <div class="container">
      <div class="contact-layout">
        <!-- Contact Form -->
        <div class="contact-form-section">
          <h2>Send Us a Message</h2>
          <p class="form-intro">Have a question, feedback, or need assistance? Fill out the form below and we'll get back to you within 24-48 hours.</p>
          
          <form @submit.prevent="handleSubmit" class="contact-form">
            <FormInput
              v-model="formData.name"
              label="Full Name"
              type="text"
              placeholder="Your name"
              :required="true"
            />

            <FormInput
              v-model="formData.email"
              label="Email Address"
              type="email"
              placeholder="your.email@example.com"
              :required="true"
            />

            <div class="form-group">
              <label for="phone" class="form-label">Phone Number</label>
              <PhoneInput
                v-model="formData.phone"
                v-model:country-code="formData.phoneCountryCode"
                placeholder="Enter your phone number"
                :required="false"
              />
            </div>

            <div class="form-group">
              <label for="subject">Subject <span class="required">*</span></label>
              <select id="subject" v-model="formData.subject" required>
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="product">Product Question</option>
                <option value="order">Order Status/Issue</option>
                <option value="consultation">Consultation Inquiry</option>
                <option value="course">Course/Event Question</option>
                <option value="technical">Technical Support</option>
                <option value="partnership">Partnership/Collaboration</option>
                <option value="feedback">Feedback/Suggestion</option>
                <option value="other">Other</option>
              </select>
            </div>

            <FormInput
              v-model="formData.orderNumber"
              label="Order Number (if applicable)"
              type="text"
              placeholder="e.g., ORD-12345"
            />

            <FormInput
              v-model="formData.message"
              label="Message"
              type="textarea"
              :rows="6"
              placeholder="Please provide details about your inquiry..."
              :required="true"
            />

            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input 
                  v-model="formData.subscribe" 
                  type="checkbox"
                >
                <span>Subscribe to our newsletter for wellness tips and exclusive offers</span>
              </label>
            </div>

            <LoadingButton
              type="submit"
              variant="success"
              :loading="isSubmitting"
              loading-text="Sending..."
              full-width
            >
              Send Message
            </LoadingButton>

            <ErrorAlert
              v-if="submitMessage && submitStatus === 'error'"
              :message="submitMessage"
              type="error"
              :dismissible="true"
              @dismiss="submitMessage = ''"
            />

            <ErrorAlert
              v-if="submitMessage && submitStatus === 'success'"
              :message="submitMessage"
              type="success"
              :dismissible="true"
              @dismiss="submitMessage = ''"
            />
          </form>
        </div>

        <!-- Contact Information -->
        <div class="contact-info-section">
          <div class="info-card">
            <h3>Get In Touch</h3>
            <div class="info-item">
              <div class="icon">📧</div>
              <div class="details">
                <strong>Email</strong>
                <a :href="`mailto:${brand.email}`">{{ brand.email }}</a>
              </div>
            </div>
            <div class="info-item">
              <div class="icon">🌐</div>
              <div class="details">
                <strong>Website</strong>
                <a href="https://www.rishipath.com" target="_blank">www.rishipath.com</a>
              </div>
            </div>
          </div>

          <div class="info-card">
            <h3>Business Hours</h3>
            <p>Our support team is available:</p>
            <div class="hours">
              <div><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM IST</div>
              <div><strong>Saturday:</strong> 10:00 AM - 4:00 PM IST</div>
              <div><strong>Sunday:</strong> Closed</div>
            </div>
            <p class="note">We typically respond to all inquiries within 24-48 hours during business days.</p>
          </div>

          <div class="info-card">
            <h3>Quick Links</h3>
            <ul class="quick-links">
              <li><NuxtLink to="/faq">Frequently Asked Questions</NuxtLink></li>
              <li><NuxtLink to="/shipping-policy">Shipping Information</NuxtLink></li>
              <li><NuxtLink to="/return-policy">Returns & Refunds</NuxtLink></li>
              <li><NuxtLink to="/terms-of-service">Terms of Service</NuxtLink></li>
              <li><NuxtLink to="/privacy-policy">Privacy Policy</NuxtLink></li>
              <li><NuxtLink to="/medical-disclaimer">Medical Disclaimer</NuxtLink></li>
            </ul>
          </div>

          <div class="info-card social-card">
            <h3>Follow Us</h3>
            <p>Stay connected for wellness tips, updates, and community inspiration:</p>
            <div class="social-links">
              <a 
                v-for="social in socialLinks" 
                :key="social.name"
                :href="social.url" 
                :class="['social-link', social.name.toLowerCase()]" 
                :aria-label="social.ariaLabel"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LucideIcon :icon="social.icon" :size="24" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="additional-info">
        <h2>Additional Information</h2>
        
        <div class="info-grid">
          <div class="info-box">
            <h3>For Product Inquiries</h3>
            <p>If you have questions about a specific product, please check the product page first—most questions are answered in the description, ingredients, and usage sections. You can also read customer reviews for real experiences.</p>
          </div>

          <div class="info-box">
            <h3>For Order Issues</h3>
            <p>If you have an issue with your order (wrong item, damaged product, delay), please include your order number in your message. You can find this in your order confirmation email or account dashboard.</p>
          </div>

          <div class="info-box">
            <h3>For Consultation Questions</h3>
            <p>For questions about booking consultations, practitioner qualifications, or what to expect, visit our <NuxtLink to="/booking">Booking page</NuxtLink> or check our <NuxtLink to="/faq">FAQ</NuxtLink>.</p>
          </div>

          <div class="info-box">
            <h3>For Medical Concerns</h3>
            <p><strong>Important:</strong> We cannot provide medical advice via email or contact forms. If you have a medical emergency, please contact your local emergency services or healthcare provider immediately. For health-related product questions, consult with a qualified healthcare professional or book a consultation with one of our practitioners.</p>
          </div>

          <div class="info-box">
            <h3>For Partnership Inquiries</h3>
            <p>Interested in partnering with Rishipath as a practitioner, educator, supplier, or affiliate? We'd love to hear from you! Select "Partnership/Collaboration" as your subject and provide details about your proposal.</p>
          </div>

          <div class="info-box">
            <h3>For Media & Press</h3>
            <p>For media inquiries, press releases, or interview requests, please contact us with "Media Inquiry" in the subject line. Include details about your publication and the nature of your request.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import FormInput from '@/components/FormInput.vue';
import LoadingButton from '@/components/LoadingButton.vue';
import ErrorAlert from '@/components/ErrorAlert.vue';

const brand = useBrand();
const { socialLinks } = useSocialMedia();
const config = useRuntimeConfig();

definePageMeta({
  layout: 'default',
})

usePageSeo({
  title: 'Contact Us',
  description: `Contact ${brand.fullName} for inquiries about Ayurvedic products, consultations, orders, or general questions.`,
  keywords: 'contact us, support, customer service, inquiries, ayurveda help',
  path: '/contact',
})

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  phoneCountryCode: '',
  subject: '',
  orderNumber: '',
  message: '',
  subscribe: false
});

const isSubmitting = ref(false);
const submitMessage = ref('');
const submitStatus = ref('');

const handleSubmit = async () => {
  isSubmitting.value = true;
  submitMessage.value = '';
  submitStatus.value = '';

  try {
    // Call Laravel API directly
    const response = await $fetch(`${config.public.apiBase}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        phone_country_code: formData.phoneCountryCode || null,
        subject: formData.subject,
        order_number: formData.orderNumber || null,
        message: formData.message,
        subscribe: formData.subscribe,
      },
    });

    if (response.success) {
      submitMessage.value = response.message || 'Thank you for contacting us! We\'ll get back to you within 24-48 hours.';
      submitStatus.value = 'success';

      // Reset form
      Object.keys(formData).forEach(key => {
        if (typeof formData[key] === 'boolean') {
          formData[key] = false;
        } else {
          formData[key] = '';
        }
      });
    }
  } catch (error) {
    console.error('Contact form error:', error);
    const errorMessage = error.data?.message || error.message || 'An error occurred';
    submitMessage.value = `Sorry, there was an error sending your message. ${errorMessage}. Please try again or email us directly at ${brand.email}`;
    submitStatus.value = 'error';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped lang="scss">
.contact-page {
  background: var(--surface-muted);
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, var(--brand-forest) 0%, var(--brand-forest-dark) 100%);
  color: var(--text-inverse);
  padding: 4rem 0 3rem;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.1);
    pointer-events: none;
  }

  .container {
    position: relative;
    z-index: 1;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
    font-weight: 700;
    color: var(--text-inverse);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }

  .tagline {
    font-size: 1.2rem;
    color: var(--text-inverse);
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem 4rem;
}

.contact-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;
  margin-bottom: 3rem;
}

.contact-form-section {
  background: var(--surface-primary);
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: var(--shadow-md);

  h2 {
    color: var(--accent-primary);
    font-size: 1.8rem;
    margin-bottom: 0.75rem;
  }

  .form-intro {
    color: var(--text-muted);
    margin-bottom: 2rem;
    line-height: 1.6;
  }
}

.contact-form {
  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: var(--text-primary);

      .required {
        color: var(--status-error);
      }
    }

    input,
    select,
    textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--border-default);
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s ease;
      font-family: inherit;
      background: var(--surface-primary);
      color: var(--text-primary);

      &:focus {
        outline: none;
        border-color: var(--action-primary);
        box-shadow: 0 0 0 3px var(--action-primary-alpha);
      }
    }

    textarea {
      resize: vertical;
    }

    &.checkbox-group {
      .checkbox-label {
        display: flex;
        align-items: flex-start;
        cursor: pointer;
        font-weight: normal;

        input[type="checkbox"] {
          width: auto;
          margin-right: 0.75rem;
          margin-top: 0.25rem;
          cursor: pointer;
        }

        span {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }
      }
    }
  }

  .btn-submit {
    width: 100%;
    padding: 1rem;
    background: var(--action-primary);
    color: var(--action-primary-text);
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: var(--action-primary-hover);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .submit-message {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 8px;
    font-weight: 500;

    &.success {
      background: var(--status-success-bg);
      color: var(--status-success);
      border: 1px solid var(--status-success);
    }

    &.error {
      background: var(--status-error-bg);
      color: var(--status-error);
      border: 1px solid var(--status-error);
    }
  }
}

.contact-info-section {
  .info-card {
    background: var(--surface-primary);
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    margin-bottom: 1.5rem;

    h3 {
      color: var(--accent-primary);
      font-size: 1.3rem;
      margin-bottom: 1rem;
      font-weight: 600;
    }

    p {
      color: var(--text-primary);
      line-height: 1.6;
      margin-bottom: 1rem;

      &.note {
        font-size: 0.9rem;
        color: var(--text-muted);
        font-style: italic;
        margin-top: 1rem;
      }
    }

    .info-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 1.5rem;

      &:last-child {
        margin-bottom: 0;
      }

      .icon {
        font-size: 1.5rem;
        margin-right: 1rem;
        flex-shrink: 0;
      }

      .details {
        strong {
          display: block;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
          font-size: 0.9rem;
        }

        a {
          color: var(--accent-primary);
          text-decoration: none;
          font-weight: 500;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    .hours {
      background: var(--surface-muted);
      padding: 1rem;
      border-radius: 8px;
      margin: 1rem 0;

      div {
        padding: 0.5rem 0;
        color: var(--text-primary);

        strong {
          color: var(--accent-primary);
        }
      }
    }

    .quick-links {
      list-style: none;
      padding: 0;

      li {
        margin-bottom: 0.75rem;

        a {
          color: var(--accent-primary);
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;

          &:hover {
            transform: translateX(5px);
            text-decoration: underline;
          }
        }
      }
    }

    &.social-card {
      .social-links {
        display: flex;
        gap: 0.75rem;
        margin-top: 1rem;
        flex-wrap: wrap;

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          text-decoration: none;
          transition: all 0.3s ease;
          color: var(--text-inverse);

          &.facebook {
            background: var(--social-facebook);

            &:hover {
              background: var(--social-facebook-hover);
              transform: translateY(-3px);
              box-shadow: 0 4px 12px rgba(24, 119, 242, 0.4);
            }
          }

          &.instagram {
            background: linear-gradient(45deg, var(--social-instagram-1), var(--social-instagram-2), var(--social-instagram-3), var(--social-instagram-4), var(--social-instagram-5));

            &:hover {
              transform: translateY(-3px);
              box-shadow: 0 4px 12px rgba(225, 48, 108, 0.4);
            }
          }

          &.youtube {
            background: var(--social-youtube);

            &:hover {
              background: var(--social-youtube-hover);
              transform: translateY(-3px);
              box-shadow: 0 4px 12px rgba(255, 0, 0, 0.4);
            }
          }

          &.twitter {
            background: var(--social-twitter);

            &:hover {
              background: var(--social-twitter-hover);
              transform: translateY(-3px);
              box-shadow: 0 4px 12px rgba(29, 161, 242, 0.4);
            }
          }

          &.linkedin {
            background: var(--social-linkedin);

            &:hover {
              background: var(--social-linkedin-hover);
              transform: translateY(-3px);
              box-shadow: 0 4px 12px rgba(10, 102, 194, 0.4);
            }
          }

          &.whatsapp {
            background: var(--social-whatsapp);

            &:hover {
              background: var(--social-whatsapp-hover);
              transform: translateY(-3px);
              box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
            }
          }
        }
      }
    }
  }
}

.additional-info {
  background: var(--surface-primary);
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  h2 {
    color: var(--accent-primary);
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid rgba(var(--accent-primary-rgb), 0.2);
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;

    .info-box {
      padding: 1.5rem;
      background: var(--surface-muted);
      border-radius: 8px;
      border-left: 4px solid var(--accent-primary);

      h3 {
        color: var(--accent-primary);
        font-size: 1.1rem;
        margin-bottom: 0.75rem;
        font-weight: 600;
      }

      p {
        color: var(--text-primary);
        line-height: 1.6;
        font-size: 0.95rem;
        margin: 0;

        a {
          color: var(--accent-primary);
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }

        strong {
          font-weight: 600;
          color: var(--accent-primary-hover);
        }
      }
    }
  }
}

@media (max-width: 1024px) {
  .contact-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .contact-info-section {
    .info-card.social-card .social-links {
      flex-wrap: wrap;
    }
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 3rem 0 2rem;

    h1 {
      font-size: 2rem;
    }

    .tagline {
      font-size: 1rem;
    }
  }

  .contact-form-section,
  .additional-info {
    padding: 1.5rem;

    h2 {
      font-size: 1.5rem;
    }
  }

  .additional-info .info-grid {
    grid-template-columns: 1fr;
  }

  .contact-info-section .info-card.social-card .social-links {
    flex-direction: column;

    .social-link {
      width: 100%;
      text-align: center;
    }
  }
}
</style>
