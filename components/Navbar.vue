<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-2">
    <div class="container">
      <div class="row w-100 align-items-center flex-nowrap gx-0">
        <!-- Brand/Doctor's Name -->
        <div class="col-4 col-md-3">
          <NuxtLink to="/" class="navbar-brand">
            <img
              src="/favicon.ico"
              alt="Ayurvedic Icon"
              class="me-2"
              style="width: 24px; height: 24px"
            />
            <span class="brand-text">Dr. Ramita Maharjan</span>
          </NuxtLink>
        </div>
        <!-- Navigation Items -->
        <div class="col-4 col-md-6">
          <div
            class="collapse navbar-collapse justify-content-center"
            id="navbarNav"
          >
            <ul class="navbar-nav mb-2 mb-lg-0 justify-content-center w-100">
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
                >
                  Yoga & Meditation
                </SmoothLink>
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
                >
                  Home Remedies
                </SmoothLink>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Herbal Treatment</a>
              </li>
            </ul>
          </div>
        </div>
        <!-- User Section -->
        <div
          class="col-4 col-md-3 d-flex justify-content-center align-items-center"
        >
          <div
            class="dropdown"
            @mouseenter="isDropdownOpen = true"
            @mouseleave="isDropdownOpen = false"
          >
            <button
              v-if="user"
              class="btn btn-link dropdown-item d-flex flex-column align-items-center p-0"
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
              class="btn btn-link dropdown-item d-flex flex-column align-items-center p-0"
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
                  <button class="dropdown-item d-flex align-items-center" >
                    <LucideIcon icon="mdi:user" class="me-2" />
                    Profile
                  </button>
                </li>
                <li v-if="user">
                  <button class="dropdown-item d-flex align-items-center" >
                    <LucideIcon icon="mdi:history" class="me-2" />
                    Order History
                  </button>
                </li>
                <li v-if="user">
                  <button class="dropdown-item d-flex align-items-center" >
                    <LucideIcon icon="mdi:heart" class="me-2" />
                    Wishlist
                  </button>
                </li>
                <DropDownItems />
                <li v-if="user">
                  <LogoutButton
                    class="dropdown-item btn-smooth-primary text-center fw-semibold mt-3"
                  />
                </li>
              </ul>
            </transition>
          </div>
          <div
            class="megamenu-container ms-3 position-relative d-inline-block"
            @mouseenter="isMegaMenuOpen = true"
            @mouseleave="isMegaMenuOpen = false"
          >
            <div class="btn btn-link dropdown-item d-flex flex-column align-items-center p-0 nav-link cursor-pointer">
              <LucideIcon icon="mdi:shop" class="fs-4" />
              <span>Shop</span>
            </div>
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
  padding: 0.6rem 0.8rem;
  position: relative;
}



.nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: var(--text-deep-green);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after {
  width: 70%;
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

.cursor-pointer {
  cursor: pointer;
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
