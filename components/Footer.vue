<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-top">
        <!-- Company Info Column -->
        <div class="footer-column">
          <div class="footer-logo-section">
            <NuxtLink to="/" class="footer-brand">
              <img :src="brand.logo" :alt="brand.logoAlt" class="footer-logo" />
            </NuxtLink>
            <p class="footer-description">
              {{ footerSettings?.site_description || 'Your trusted source for authentic Ayurvedic products, wellness courses, and holistic health guidance.' }}
            </p>
          </div>
          
          <!-- Social Media -->
          <div class="social-links">
            <h4>Connect With Us</h4>
            <div class="social-icons">
              <a 
                v-for="social in socialLinks" 
                :key="social.name"
                :href="social.url" 
                target="_blank" 
                rel="noopener noreferrer"
                :aria-label="social.ariaLabel"
              >
                <LucideIcon :icon="social.icon" :size="20" />
              </a>
            </div>
          </div>
        </div>

        <!-- Shop Column -->
        <div class="footer-column">
          <h4>Shop</h4>
          <ul>
            <li><NuxtLink to="/products">All Products</NuxtLink></li>
            <li><NuxtLink to="/products?collection=featured">Featured Products</NuxtLink></li>
            <li><NuxtLink to="/products?collection=bestselling">Best Sellers</NuxtLink></li>
            <li><NuxtLink to="/category">Categories</NuxtLink></li>
            <li><NuxtLink to="/bulk-order">Bulk Orders</NuxtLink></li>
          </ul>
        </div>

        <!-- Learn & Wellness Column -->
        <div class="footer-column">
          <h4>Learn & Wellness</h4>
          <ul>
            <li><NuxtLink to="/courses">Courses</NuxtLink></li>
            <li><NuxtLink to="/events">Events</NuxtLink></li>
            <li><NuxtLink to="/blog/yoganmeditation">Yoga & Meditation</NuxtLink></li>
            <li><NuxtLink to="/blog/homeremedy">Home Remedies</NuxtLink></li>
            <li><NuxtLink to="/blog/recipe">Ayurvedic Recipes</NuxtLink></li>
            <li><NuxtLink to="/glossary">Ayurveda Glossary</NuxtLink></li>
          </ul>
        </div>

        <!-- Services Column -->
        <div class="footer-column">
          <h4>Services</h4>
          <ul>
            <li><NuxtLink to="/doctors">Find a Doctor</NuxtLink></li>
            <li><NuxtLink to="/booking">Book Consultation</NuxtLink></li>
            <li><NuxtLink to="/dashboard">My Account</NuxtLink></li>
            <li><NuxtLink to="/orders">Track Orders</NuxtLink></li>
            <li><NuxtLink to="/wishlist">Wishlist</NuxtLink></li>
          </ul>
        </div>

        <!-- Contact & Info Column -->
        <div class="footer-column">
          <h4>Contact & Info</h4>
          <ul class="contact-info">
            <li v-if="footerSettings?.email">
              <LucideIcon icon="mdi:email" :size="16" />
              <a :href="`mailto:${footerSettings.email}`">{{ footerSettings.email }}</a>
            </li>
            <li v-if="footerSettings?.phone">
              <LucideIcon icon="mdi:phone" :size="16" />
              <a :href="`tel:${footerSettings.phone}`">{{ footerSettings.phone }}</a>
            </li>
            <li v-if="footerSettings?.address">
              <LucideIcon icon="mdi:map-pin" :size="16" />
              <span>{{ footerSettings.address }}</span>
            </li>
          </ul>
          
          <div class="footer-links-group">
            <h5>Legal</h5>
            <ul>
              <li><NuxtLink to="/privacy-policy">Privacy Policy</NuxtLink></li>
              <li><NuxtLink to="/terms-of-service">Terms of Service</NuxtLink></li>
              <li><NuxtLink to="/medical-disclaimer">Medical Disclaimer</NuxtLink></li>
              <li><NuxtLink to="/shipping-policy">Shipping Policy</NuxtLink></li>
              <li><NuxtLink to="/return-policy">Return Policy</NuxtLink></li>
            </ul>
          </div>
          
          <div class="footer-links-group">
            <h5>Company</h5>
            <ul>
              <li><NuxtLink to="/about">About Us</NuxtLink></li>
              <li><NuxtLink to="/contact">Contact Us</NuxtLink></li>
              <li><NuxtLink to="/faq">FAQ</NuxtLink></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Newsletter Section -->
      <div v-if="footerSettings?.show_newsletter !== false" class="footer-newsletter">
        <div class="newsletter-content">
          <div class="newsletter-header">
            <LucideIcon icon="mdi:email" :size="24" />
            <div>
              <h3>Subscribe to Our Newsletter</h3>
              <p>Get updates on new products, wellness tips, and exclusive offers</p>
            </div>
          </div>
          <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
            <input
              v-model="newsletterEmail"
              type="email"
              placeholder="Enter your email address"
              required
              :disabled="loading"
              class="newsletter-input"
            />
            <button type="submit" class="btn btn-smooth-success newsletter-btn" :disabled="loading">
              {{ loading ? 'Subscribing...' : 'Subscribe' }}
            </button>
          </form>
          <div v-if="newsletterMessage" class="newsletter-message" :class="{ success: newsletterMessage.includes('success') }">
            {{ newsletterMessage }}
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <p class="copyright">
          {{ footerSettings?.copyright_text || brand.copyrightText }}
        </p>
        <div class="payment-methods">
          <span class="payment-label">We Accept:</span>
          <div class="payment-icons">
            <LucideIcon icon="mdi:credit-card" :size="24" />
            <span class="payment-text">Razorpay</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNewsletter } from '@/composables/useNewsletter'
import LucideIcon from '@/components/LucideIcon.vue'

const brand = useBrand()
const { socialLinks } = useSocialMedia()

const {
  newsletterEmail,
  newsletterMessage,
  loading,
  subscribeNewsletter,
} = useNewsletter()

const footerSettings = ref(null)

onMounted(async () => {
  try {
    const config = useRuntimeConfig()
    const response = await $fetch(`${config.public.apiBase}/footer-settings`)
    footerSettings.value = response
  } catch (error) {
    console.error('Failed to load footer settings:', error)
  }
})
</script>

<style scoped lang="scss">
.footer {
  background: linear-gradient(135deg, var(--brand-forest) 0%, var(--brand-forest-dark) 100%);
  color: var(--text-footer);
  padding-top: 4rem;
  margin-top: auto;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-top {
  display: grid;
  grid-template-columns: 2fr repeat(4, 1fr);
  gap: 3rem;
  margin-bottom: 3rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-column {
  h4, h5 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
    color: var(--text-footer);
    letter-spacing: 0.5px;
  }

  h5 {
    font-size: 1rem;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 0.75rem;

      a {
        color: rgba(240, 245, 242, 0.85);
        text-decoration: none;
        transition: all 0.2s ease;
        display: inline-block;

        &:hover {
          color: var(--text-footer);
          transform: translateX(4px);
        }
      }
    }
  }
}

.footer-logo-section {
  margin-bottom: 2rem;
}

.footer-brand {
  display: inline-block;
  margin-bottom: 1rem;
}

.footer-logo {
  height: 40px;
  width: auto;
}

.footer-description {
  color: rgba(240, 245, 242, 0.85);
  line-height: 1.6;
  margin-bottom: 0;
  font-size: 0.95rem;
}

.social-links {
  h4 {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
}

.social-icons {
  display: flex;
  gap: 1rem;
  
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    color: var(--text-footer);
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
  }
}

.contact-info {
  li {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    color: rgba(240, 245, 242, 0.85);

    a, span {
      color: rgba(240, 245, 242, 0.85);
      text-decoration: none;
      
      &:hover {
        color: var(--text-footer);
      }
    }
  }
}

.footer-newsletter {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2.5rem;
  margin-bottom: 3rem;
}

.newsletter-content {
  max-width: 800px;
  margin: 0 auto;
}

.newsletter-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    color: var(--text-footer);
  }

  p {
    margin: 0.25rem 0 0;
    color: rgba(240, 245, 242, 0.85);
    font-size: 0.95rem;
  }
}

.newsletter-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.newsletter-input {
  flex: 1;
  padding: 0.875rem 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-footer);
  font-size: 1rem;
  transition: all 0.2s ease;

  &::placeholder {
    color: rgba(240, 245, 242, 0.6);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.15);
  }
}

.newsletter-btn {
  padding: 0.875rem 2rem;
  white-space: nowrap;
}

.newsletter-message {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-footer);
  
  &.success {
    background: rgba(135, 197, 164, 0.2);
  }
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 0;
  font-size: 0.9rem;
  color: rgba(240, 245, 242, 0.75);
}

.copyright {
  margin: 0;
}

.payment-methods {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.payment-label {
  font-size: 0.875rem;
}

.payment-icons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.payment-text {
  font-weight: 500;
  font-size: 0.875rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .footer-top {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .footer {
    padding-top: 3rem;
  }

  .footer-top {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
  }

  .footer-newsletter {
    padding: 1.5rem;
  }

  .newsletter-header {
    flex-direction: column;
    align-items: flex-start;
    
    h3 {
      font-size: 1.25rem;
    }
  }

  .newsletter-form {
    flex-direction: column;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .footer-top {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .social-icons {
    flex-wrap: wrap;
  }
}
</style>