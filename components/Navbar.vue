<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-2">
    <div class="container">
      <!-- Brand/Doctor's Name -->
      <NuxtLink to="/" class="navbar-brand">
        <img
          src="/favicon.ico"
          alt="Ayurvedic Icon"
          class="me-2"
          style="width: 24px; height: 24px"
        />
        <span class="brand-text">Dr. Ramita Maharjan</span>
      </NuxtLink>

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
              class="nav-link"
            >
              Courses
            </SmoothLink>
          </li>
          <li class="nav-item">
            <SmoothLink
              to="ynm"
              fallbackRoute="/yoganmeditation"
              class="nav-link"
            >
              Yoga & Meditation
            </SmoothLink>
          </li>
          <li class="nav-item">
            <SmoothLink
              to="recipes"
              fallbackRoute="/recipe"
              class="nav-link"
            >
              Recipes
            </SmoothLink>
          </li>
          <li class="nav-item">
            <SmoothLink
              to="home-remedies"
              fallbackRoute="/homeremedy"
              class="nav-link"
            >
              Home Remedies
            </SmoothLink>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Herbal Treatment</a>
          </li>
        </ul>

        <!-- Right-aligned User Section -->
        <div class="d-lg-flex align-items-center gap-3">
          <template v-if="user">
            <span class="user-email">{{ user.email }}</span>
            <NuxtLink to="/profile">Profile</NuxtLink>
            <LogoutButton />
          </template>
          <template v-else>
            <NuxtLink to="/login" class="nav-link">
              Login
            </NuxtLink>
            <NuxtLink to="/register" class="btn btn-smooth-success rounded-pill px-4">
              Register
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import SmoothLink from '~/components/SmoothLink.vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import LogoutButton from '@/components/LogoutButton.vue'
import { watchEffect } from 'vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

watchEffect(() => {
  // If userStore.user changes, this will trigger a re-render
})
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1030;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
}

.brand-text {
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--text-deep-green);
}

.nav-item {
  position: relative;
  margin: 0 0.25rem;
}

.nav-link {
  font-size: 1.05rem;
  font-weight: 500;
  color: #333;
  padding: 0.6rem 0.8rem;
  transition: all 0.25s ease;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: var(--text-deep-green);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 70%;
}

.nav-link:hover,
.nav-link.active {
  color: var(--text-deep-green);
}

/* Right-aligned button styles */
.d-lg-flex .btn {
  font-size: 1rem;
  padding: 0.5rem 1.2rem;
}

.user-email {
  margin-right: 1rem;
  color: #2d8f6f;
  font-weight: bold;
}

@media (max-width: 991.98px) {
  .navbar-collapse {
    margin-top: 1rem;
    padding-bottom: 1rem;
  }
  
  .nav-link {
    padding: 0.6rem 0.5rem;
    border-bottom: 1px solid #f1f1f1;
  }
  
  .nav-link:hover::after,
  .nav-link.active::after {
    width: 30%;
  }
  
  .btn-smooth-success {
    width: 100%;
    margin-top: 1rem;
  }
}
</style>