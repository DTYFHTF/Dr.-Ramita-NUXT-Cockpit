<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-container">
        <div class="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li>            
              <SmoothLink to="courses" fallbackRoute="/courses">Courses</SmoothLink>
            </li>
            <li>
              <SmoothLink to="ynm" fallbackRoute="/blog/yoganmeditation">Yoga & Meditation</SmoothLink>
            </li>
            <li>
              <NuxtLink to="/glossary">Glossary</NuxtLink>
            </li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Contact Info</h4>
          <p>Email: drramita@rishipath.org</p>
          <p>Phone: +1 234 567 890</p>
        </div>
        <div class="footer-column">
          <h4>Newsletter</h4>
          <p>Subscribe to our newsletter for updates.</p>
          <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
            <input
              v-model="newsletterEmail"
              type="email"
              class="form-input newsletter-input"
              placeholder="Enter your email"
              required
              :disabled="loading"
            />
            <button type="submit" class="btn btn-smooth-success newsletter-btn" :disabled="loading">
              {{ loading ? 'Subscribing...' : 'Subscribe' }}
            </button>
            <div v-if="newsletterMessage" class="mt-2">{{ newsletterMessage }}</div>
          </form>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2025 © Dr. Ramita Maharjan. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
import SmoothLink from '~/components/SmoothLink.vue'
import { useNewsletter } from '@/composables/useNewsletter'

const {
  newsletterEmail,
  newsletterMessage,
  loading,
  subscribeNewsletter,
} = useNewsletter()
</script>

<style scoped lang="scss">
.footer {
  background-color: $color-primary; 
  color: $text-light;
  padding: 2rem 0;
  position: relative;
  margin-top: auto;
}

.container {
  padding-left: 1rem;
  padding-right: 1rem;
}

.footer-container {
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-column {
  flex: 1;
  min-width: 200px;
}

.footer-column h4 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.footer-column ul {
  list-style: none;
  padding: 0;
}

.footer-column ul li {
  margin-bottom: 0.5rem;
}

.footer-column ul li a {
  color: $text-light;
  text-decoration: none;
}

.footer-column ul li a:hover {
  text-decoration: underline;
}

.newsletter-input {
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.newsletter-btn {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  width: 100%;
}

.footer-bottom {
  text-align: center;
  margin-top: 2rem;
  font-size: 0.875rem;
}
</style>