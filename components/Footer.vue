<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-column">
        <h4>Quick Links</h4>
        <ul>
          <li>            
            <SmoothLink to="courses" fallbackRoute="/course">Courses</SmoothLink>
          </li>
          <li>
            <SmoothLink to="ynm" fallbackRoute="/yoganmeditation"  >Yoga & Meditation</SmoothLink>
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
        <button>Subscribe</button>
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
</style>