<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
    <div class="container">
      <!-- Brand/Doctor's Name -->
      <a class="navbar-brand text-success" href="/">
        <img
          src="/favicon.ico"
          alt="Ayurvedic Icon"
          class="me-2"
          style="width: 24px; height: 24px"
        />
        Dr. Ramita Maharjan
      </a>

      <!-- Mobile Toggle -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation Items -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <SmoothLink
              to="courses"
              fallbackRoute="/course"
              class="nav-link text-dark"
            >
              Courses
            </SmoothLink>
          </li>
          <li class="nav-item">
            <SmoothLink
              to="ynm"
              fallbackRoute="/yoganmeditation"
              class="nav-link text-dark"
            >
              Yoga & Meditation
            </SmoothLink>
          </li>
          <li class="nav-item">
            <a class="nav-link text-dark" href="#">Recipes</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-dark" href="#">Home Remedies</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-dark" href="#">Herbal Treatment</a>
          </li>
        </ul>

        <!-- Right-aligned CTA Button -->
        <div class="d-lg-flex">
          <button class="btn btn-success rounded-pill px-4">
            Book Consultation
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import SmoothLink from '~/components/SmoothLink.vue'
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1030;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  font-size: 1.25rem;
  letter-spacing: 0.5px;
}

.nav-link {
  font-weight: 400;
  margin: 0 0.5rem;
  transition: all 0.3s ease;
}

.nav-link:hover {
  transform: translateY(-2px);
  color: var(--text-deep-green) !important;
}

.btn-success {
  background-color: var(--text-deep-green);
  border: none;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.btn-success::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(-100%);
  transition: transform 0.4s ease;
  z-index: -1;
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(42, 77, 63, 0.3);
}

.btn-success:hover::before {
  transform: translateX(0);
}

.btn-success:active {
  transform: translateY(-1px);
  box-shadow: 0 2px 10px rgba(42, 77, 63, 0.2);
}

@media (max-width: 991.98px) {
  .navbar-collapse {
    margin-top: 1rem;
  }
  
  .btn-success {
    width: 100%;
    margin-top: 1rem;
  }
}
</style>