<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-2">
    <div class="container">
      <!-- Brand/Doctor's Name -->
      <NuxtLink to="/" class="navbar-brand d-flex align-items-center">
        <img
          src="/favicon.ico"
          alt="Ayurvedic Icon"
          class="me-2"
          style="width: 24px; height: 24px"
        />
        <span class="brand-text">Dr. Ramita Maharjan</span>
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
            <SmoothLink
              to="courses"
              fallbackRoute="/course"
              class="nav-link"
              >Courses</SmoothLink
            >
          </li>
          <li class="nav-item">
            <SmoothLink
              to="ynm"
              fallbackRoute="/yoganmeditation"
              class="nav-link"
              >Yoga & Meditation</SmoothLink
            >
          </li>
          <li class="nav-item">
            <SmoothLink
              to="recipes"
              fallbackRoute="/recipe"
              class="nav-link"
              >Recipes</SmoothLink
            >
          </li>
          <li class="nav-item">
            <SmoothLink
              to="home-remedies"
              fallbackRoute="/homeremedy"
              class="nav-link"
              >Home Remedies</SmoothLink
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Herbal Treatment</a>
          </li>
        </ul>
        <!-- User Section -->
        <div class="d-flex flex-column flex-lg-row align-items-center gap-3 w-100 justify-content-center mt-3 mt-lg-0">
          <div
            class="dropdown me-0 me-lg-2"
            @mouseenter="isDropdownOpen = true"
            @mouseleave="isDropdownOpen = false"
          >
            <button
              v-if="user"
              class="btn btn-link nav-link d-flex flex-column align-items-center p-0"
              type="button"
              id="userDropdown"
              aria-expanded="false"
              tabindex="0"
              @click="isDropdownOpen = !isDropdownOpen"
            >
              <LucideIcon :icon="'mdi:account-circle'" class="fs-4" />
              <span>Hi, {{ user.name }}</span>
            </button>
            <NuxtLink
              v-else
              to="/login"
              class="btn btn-link nav-link d-flex flex-column align-items-center p-0"
              id="userDropdown"
              tabindex="0"
            >
              <LucideIcon icon="mdi:login" class="fs-4" />
              <span>Sign In</span>
            </NuxtLink>
            <transition name="fade">
              <ul
                v-show="isDropdownOpen"
                class="dropdown-menu dropdown-menu-end shadow-sm show me-3"
                :class="{ 'd-block': isDropdownOpen }"
                aria-labelledby="userDropdown"
                @mouseover="isDropdownOpen = true"
                @mouseleave="closeDropdown"
              >
                <template v-if="!user">
                  <li class="py-2 text-center px-4">
                    <NuxtLink to="/register" class="btn btn-smooth-primary btn-sm w-100"
                      >Join Now</NuxtLink
                    >
                  </li>
                  <li class="small text-muted text-center mb-2">
                    New to the site?
                  </li>
                </template>
                
                <li v-if="user">
                  <NuxtLink to="/profile" class="dropdown-item d-flex align-items-center gap-2">
                    <LucideIcon icon="mdi:user" class="me-2" />
                    Profile
                  </NuxtLink>
                </li>
                <li v-if="user">
                  <NuxtLink to="/" class="dropdown-item d-flex align-items-center gap-2">
                    <LucideIcon icon="mdi:history" class="me-2" />
                    Order History
                  </NuxtLink>
                </li>
                <li v-if="user">
                  <NuxtLink to="/" class="dropdown-item d-flex align-items-center gap-2">
                    <LucideIcon icon="mdi:heart" class="me-2" />
                    Wishlist
                  </NuxtLink>
                </li>
                <DropDownItems />
                <li v-if="user">
                  <div class="d-flex justify-content-center">
                    <LogoutButton
                      class=" btn-smooth-primary text-center fw-semibold mt-3 px-4"
                    />
                  </div>
                </li>
              </ul>
            </transition>
          </div>
          <div
            class="megamenu-container position-relative d-inline-block"
            @mouseenter="isMegaMenuOpen = true"
            @mouseleave="isMegaMenuOpen = false"
          >
            <NuxtLink
              to="/products"
              class="btn btn-link nav-link d-flex flex-column align-items-center p-0 cursor-pointer d-lg-none"
            >
              <LucideIcon icon="mdi:shop" class="fs-4" />
              <span>Shop</span>
            </NuxtLink>
            <div
              class="btn btn-link nav-link d-flex flex-column align-items-center p-0 cursor-pointer d-none d-lg-flex"
              @mouseenter="isMegaMenuOpen = true"
              @mouseleave="isMegaMenuOpen = false"
            >
              <LucideIcon icon="mdi:shop" class="fs-4" />
              <span>Shop</span>
              <transition name="fade">
                <div
                  v-if="isMegaMenuOpen"
                  class="megamenu-popover position-absolute"
                  style="z-index: 2000; min-width: 400px;"
                >
                  <MegaMenu :categories="categories" :products="products" :open="true" />
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import SmoothLink from "~/components/SmoothLink.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import LogoutButton from "@/components/LogoutButton.vue";
import DropDownItems from "@/components/DropDownItems.vue";
import { ref, onMounted } from "vue";
import MegaMenu from "@/components/MegaMenu.vue";
import { useProducts } from '@/composables/useProducts';

const { user } = storeToRefs(useUserStore());
const isDropdownOpen = ref(false);
const isMegaMenuOpen = ref(false);
const { categories, products, fetchProducts, fetchCategories } = useProducts();

onMounted(() => {
  fetchProducts();
  fetchCategories();
});

function closeDropdown() {
  setTimeout(() => {
    isDropdownOpen.value = false;
  }, 120);
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1030;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.brand-text {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-deep-green);
}

.nav-link {
  font-size: 1.05rem;
  font-weight: 500;
  color: #333;
  padding: 0.6rem 1.5rem;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
}

.nav-link:hover {
  transform: translateY(-2px);
  color: var(--text-deep-green);
}

.dropdown-menu {
  margin-top: 0.5rem;
  padding: 0.5rem;
}

.megamenu-container {
  position: relative;
}

.megamenu-popover {
  right: 0 !important;
  left: auto !important;
  top: 100%;
  min-width: 400px;
  padding: 0.25rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
