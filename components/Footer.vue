<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-container">
        <div class="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li>            
              <SmoothLink to="courses" fallbackRoute="/course">Courses</SmoothLink>
            </li>
            <li>
              <SmoothLink to="ynm" fallbackRoute="/yoganmeditation">Yoga & Meditation</SmoothLink>
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
          <input type="email" placeholder="Enter your email" />
          <button class="btn-smooth-accent">Subscribe</button>
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
</script>

<style scoped>
.footer {
  background-color: #2A4D3F;
  color: #fff;
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
  color: #fff;
  text-decoration: none;
}

.footer-column ul li a:hover {
  text-decoration: underline;
}

.footer-column input {
  padding: 0.5rem;
  margin-top: 0.5rem;
  width: 100%;
  border: none;
  border-radius: 5px;
}

.footer-column button {
  background-color: #B6452C;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  margin-top: 0.5rem;
  cursor: pointer;
}

.footer-column button:hover {
  transform: translateY(-2px);
}

.footer-bottom {
  text-align: center;
  margin-top: 2rem;
  font-size: 0.875rem;
}

/* Smooth accent button styling for footer */
.btn-smooth-accent {
  position: relative;
  background-color: #E85A3B; /* Brighter orange-red for better contrast */
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease, transform 0.2s ease;
}

.btn-smooth-accent:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(232, 90, 59, 0.4);
}

.btn-smooth-accent::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: translateX(-100%);
}

.btn-smooth-accent:hover::before {
  transform: translateX(100%);
  transition: transform 0.9s ease;
}
</style>