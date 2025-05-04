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
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation Items -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mx-auto">
          <!-- Individual Navigation Items -->
          <li class="nav-item">
            <SmoothLink
              to="courses"
              fallbackRoute="/course"
              class="nav-link text-dark"
              >Courses</SmoothLink
            >

            <!-- <a class="nav-link text-dark" href="#courses">Courses</a> -->
          </li>
          <li class="nav-item">
            <SmoothLink
              to="ynm"
              fallbackRoute="/yoganmeditation"
              class="nav-link text-dark"
              >Yoga & Meditation</SmoothLink
            >
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
        <button class="btn btn-success rounded-pill px-4">
          Book Consultation
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import SmoothLink from '~/components/SmoothLink.vue'
</script>

<style scoped>
.navbar-brand {
  font-size: 1.25rem;
  letter-spacing: 0.5px;
  font-weight: normal;
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
.navbar {
  position: sticky;
  top: 0;
  background-color: rgba(42, 77, 63, 1);
  color: #fff;
  padding: 1rem 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
}
.btn-success {
  background-color: var(--text-deep-green);
  border: none;
  margin: 0;
}
.btn:hover {
  transform: translateY(-2px);
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
}

.dropdown-menu {
  min-width: 200px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>
