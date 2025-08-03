<template>
  <nav class="navbar navbar-expand-lg navbar-light shadow-sm py-2">
    <div class="container">
      <!-- Brand/Logo -->
      <NuxtLink to="/" class="navbar-brand d-flex align-items-center">
        <img
          src="/rishipath-logo.png"
          alt="Rishipath Logo"
          class="me-2"
          style="width:20rem; height: 36px; object-fit: contain;"
        />
        <!-- Remove brand text or comment out if you want only the logo -->
        <!-- <span class="brand-text">Dr. Ramita Maharjan</span> -->
      </NuxtLink>
      <!-- Hamburger Toggle -->
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
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mb-2 mb-lg-0 mx-auto">
          <li class="nav-item">
            <SmoothLink to="courses" fallbackRoute="/course" class="nav-link"
              >Courses</SmoothLink
            >
          </li>
          <li class="nav-item">
            <NuxtLink to="/doctors" class="nav-link">Doctors</NuxtLink>
          </li>
          <li class="nav-item dropdown blog-dropdown"
              @mouseenter="handleBlogDropdownEnter"
              @mouseleave="handleBlogDropdownLeave">
            <a class="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" id="blogDropdown" role="button"
              :aria-expanded="showBlogDropdown ? 'true' : 'false'">
              Blogs
            </a>
            <ul class="dropdown-menu custom-blog-dropdown"
                :class="{ show: showBlogDropdown }"
                aria-labelledby="blogDropdown"
                @mouseenter="cancelBlogDropdownClose"
                @mouseleave="handleBlogDropdownLeave">
              <li>
                <SmoothLink to="ynm" fallbackRoute="/yoganmeditation" class="dropdown-item d-flex align-items-center gap-2">
                  <LucideIcon icon="mdi:meditation" class="me-2" /> Yoga & Meditation
                </SmoothLink>
              </li>
              <li>
                <SmoothLink to="recipes" fallbackRoute="/recipe" class="dropdown-item d-flex align-items-center gap-2">
                  <LucideIcon icon="mdi:chef-hat" class="me-2" /> Recipes
                </SmoothLink>
              </li>
              <li>
                <SmoothLink to="home-remedies" fallbackRoute="/homeremedy" class="dropdown-item d-flex align-items-center gap-2">
                  <LucideIcon icon="mdi:leaf" class="me-2" /> Home Remedies
                </SmoothLink>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/event">Events</a>
          </li>
          <li class="nav-item">
            <NuxtLink to="/categories-demo" class="nav-link text-primary fw-bold">
              <LucideIcon icon="mdi:file-tree" class="me-1" />
              Category Demo
            </NuxtLink>
          </li>
        </ul>
        <!-- User Section -->
        <div
          class="d-flex align-items-center ms-auto flex-shrink-0 flex-lg-row justify-content-center gap-3 mt-3 mt-lg-0"
        >
          <template v-if="!hydrated">
            <span class="nav-link"></span>
          </template>
          <template v-else>
            <UserSection class="nav-link" />
            <NuxtLink
              v-if="!user"
              to="/login"
              class="btn btn-link nav-link d-flex flex-column align-items-center p-0"
              id="userDropdown"
              tabindex="0"
            >
              <LucideIcon icon="mdi:login" class="fs-4" />
              <span>Sign In</span>
            </NuxtLink>
            <div
              class="nav-item position-relative"
              @mouseenter="handleMouseEnter"
              @mouseleave="handleMouseLeave"
            >
              <NuxtLink
                to="/products"
                class="btn btn-link nav-link d-flex flex-column align-items-center p-0 cursor-pointer"
              >
                <LucideIcon icon="mdi:shop" class="fs-4" />
                <span>Shop</span>
              </NuxtLink>
              <MegaMenu 
                v-if="showMegaMenu" 
                class="mega-menu-wrapper"
                @mouseenter="cancelClose"
                @mouseleave="handleMouseLeave"
              />
            </div>
            <div v-if="user">
              <CartIndicator class="nav-link"/>
            </div>
            <div >
              <ThemeToggle class="nav-link"/>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import SmoothLink from "~/components/SmoothLink.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import MegaMenu from "./MegaMenu.vue";
import UserSection from '@/components/UserSection.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';
import { ref } from "vue";
import LucideIcon from '@/components/LucideIcon.vue';

const userStore = useUserStore();
const { user, hydrated } = storeToRefs(userStore);

let closeTimeout = null;
const showMegaMenu = ref(false);

const handleMouseLeave = () => {
  closeTimeout = setTimeout(() => {
    showMegaMenu.value = false;
  }, 200); // Small delay to allow cursor to move to menu
};
const cancelClose = () => {
  clearTimeout(closeTimeout);
};
const handleMouseEnter = () => {
  clearTimeout(closeTimeout); // Ensure any pending close is cancelled
  showMegaMenu.value = true;
};

// Blog dropdown
const showBlogDropdown = ref(false);
let blogDropdownTimeout = null;

const handleBlogDropdownEnter = () => {
  clearTimeout(blogDropdownTimeout);
  showBlogDropdown.value = true;
};
const handleBlogDropdownLeave = () => {
  blogDropdownTimeout = setTimeout(() => {
    showBlogDropdown.value = false;
  }, 180);
};
const cancelBlogDropdownClose = () => {
  clearTimeout(blogDropdownTimeout);
};
</script>

<style scoped lang="scss">
.navbar {
  position: sticky;
  top: 0;
  z-index: 1030;
  background-color: var(--background-white);
  box-shadow: 0 2px 4px rgba(var(--shadow-rgb), 0.1);
}

.nav-link {
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--text-primary);
  padding: 0.1rem 0;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
}

.nav-link:hover {
  transform: translateY(-2px);
  color: var(--color-primary);
}

.mega-menu-wrapper {
  position: absolute;
  top: 100%;
  right: 0;
  left: auto;
  min-width: 320px;
  max-width: 90vw;
  width: 600px;
  z-index: 1050;
  background: var(--background-white);
  box-shadow: 0 4px 24px rgba(var(--shadow-rgb), 0.12);
  border-radius: 0 0 12px 12px;
  padding: 1.5rem 2rem;
  margin-top: 0.5rem;
  overflow: auto;
}

.nav-item {
  position: relative;
}

.blog-dropdown .dropdown-menu.custom-blog-dropdown {
  min-width: 250px;
  background: var(--background-white);
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(var(--shadow-rgb), 0.13);
  padding: 1rem 0.5rem;
  border: none;
  margin-top: 0.5rem;
  transition: opacity 0.2s ease, transform 0.2s ease;
  color: var(--text-primary);
}

.blog-dropdown .dropdown-menu.custom-blog-dropdown.show {
  display: block;
  opacity: 1;
  pointer-events: auto;
}

.blog-dropdown .dropdown-menu.custom-blog-dropdown {
  display: none;
  opacity: 0;
  pointer-events: none;
}

.blog-dropdown .dropdown-item {
  font-size: 1rem;
  padding: 0.75rem 1.25rem;
  border-radius: 6px;
  transition: background 0.15s;
  color: var(--text-primary);
  text-decoration: none;
}

.blog-dropdown .dropdown-item:hover {
  background: var(--background-light);
  color: var(--text-primary);
}

.blog-dropdown .dropdown-item:focus {
  background: var(--background-light);
  color: var(--text-primary);
  outline: none;
}


</style>
