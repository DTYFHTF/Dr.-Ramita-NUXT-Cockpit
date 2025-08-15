<template>
  <nav class="navbar navbar-expand-lg py-2">
    <div class="container">
      <!-- Brand/Logo -->
      <NuxtLink to="/new-home" class="navbar-brand d-flex align-items-center">
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
            <SmoothLink to="courses" fallbackRoute="/course" class="nav-shared-link"
              >Courses</SmoothLink
            >
          </li>
          <li class="nav-item">
            <NuxtLink to="/doctors" class="nav-shared-link">Doctors</NuxtLink>
          </li>
          <li class="nav-item dropdown blog-dropdown"
              @mouseenter="handleBlogDropdownEnter"
              @mouseleave="handleBlogDropdownLeave">
            <a class="nav-shared-link dropdown-toggle d-flex align-items-center gap-2" href="#" id="blogDropdown" role="button"
              :aria-expanded="showBlogDropdown ? 'true' : 'false'">
              Blogs
            </a>
            <ul class="dropdown-menu custom-dropdown-menu"
                :class="{ show: showBlogDropdown }"
                aria-labelledby="blogDropdown"
                @mouseenter="cancelBlogDropdownClose"
                @mouseleave="handleBlogDropdownLeave">
              <DropDownItems :items="[
                { type: 'link', routeName: 'ynm', fallbackRoute: '/yoganmeditation', icon: 'mdi:meditation', label: 'Yoga & Meditation' },
                { type: 'link', routeName: 'recipes', fallbackRoute: '/recipe', icon: 'mdi:chef-hat', label: 'Recipes' },
                { type: 'link', routeName: 'home-remedies', fallbackRoute: '/homeremedy', icon: 'mdi:leaf', label: 'Home Remedies' }
              ]" />
            </ul>
          </li>
          <li class="nav-item">
            <NuxtLink to="/event" class="nav-shared-link">Events</NuxtLink>
          </li>
        </ul>
        <!-- User Section -->
        <div
          class="d-flex align-items-center ms-auto flex-shrink-0 flex-lg-row justify-content-center gap-1 mt-3 mt-lg-0"
        >
          <template v-if="!hydrated">
            <span class="nav-shared-link"></span>
          </template>
          <template v-else>
            <UserSection class="nav-shared-link" />
            <NuxtLink
              v-if="!user"
              to="/login"
              class="btn btn-link nav-shared-link d-flex flex-column align-items-center p-0"
              id="userDropdown"
              tabindex="0"
              title="Sign In"
            >
              <LucideIcon icon="mdi:login" class="fs-4" />
              <LucideIcon icon="mdi:arrow-down-drop" class="fs-4" />

            </NuxtLink>
            <div
              class="nav-item position-relative"
              @mouseenter="handleMouseEnter"
              @mouseleave="handleMouseLeave"
            >
              <NuxtLink
                to="/products"
                class="btn btn-link nav-shared-link d-flex flex-column align-items-center p-0 cursor-pointer"
                title="Shop"
              >
                <LucideIcon icon="mdi:shop" class="fs-4" />
              </NuxtLink>
              <MegaMenu 
                v-if="showMegaMenu" 
                class="mega-menu-wrapper"
                @mouseenter="cancelClose"
                @mouseleave="handleMouseLeave"
              />
            </div>
            <div v-if="user">
              <CartIndicator class="nav-shared-link"/>
            </div>
            <div >
              <ThemeToggle class="nav-shared-link"/>
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



</style>
