<template>
  <nav class="navbar navbar-expand-lg py-2">
    <div class="container">
      <div class="d-flex align-items-center w-100">
        <!-- Brand/Logo -->
        <NuxtLink to="/new-home" class="navbar-brand d-flex align-items-center flex-shrink-0">
          <img
            src="/rishipath-logo.png"
            alt="Rishipath Logo"
            class="me-2"
            style="width:12rem; height: 36px; object-fit: contain;"
          />
        </NuxtLink>
        <!-- Search Bar Section for Desktop -->
        <div class="nav-search-section d-none d-lg-block flex-grow-1 px-4">
          <NavbarContentSwitcher />
        </div>
        <!-- Hamburger Toggle -->
        <button
          class="navbar-toggler ms-auto"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
      <div class="collapse navbar-collapse" id="navbarNav">
        <!-- Search Bar Section for Mobile -->
        <div class="d-block d-lg-none mb-3">
          <NavbarContentSwitcher />
        </div>
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

            </NuxtLink>
            <div
              class="nav-item position-relative"
              @mouseenter="handleMouseEnter"
              @mouseleave="handleMouseLeave"
            >
              <a
                @click.prevent="navigateToShop"
                class="btn btn-link nav-shared-link d-flex flex-column align-items-center p-0 cursor-pointer"
                title="Shop"
                href="/products"
              >
                <LucideIcon icon="mdi:shop" class="fs-4" />
              </a>
              <MegaMenu 
                v-if="showMegaMenu && !isMobileView" 
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
import { useRouter } from "vue-router";
import MegaMenu from "./MegaMenu.vue";
import UserSection from '@/components/UserSection.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';
import NavbarContentSwitcher from '@/components/NavbarContentSwitcher.vue';
import { ref, computed } from "vue";
import LucideIcon from '@/components/LucideIcon.vue';

// Check for mobile view
const isMobileView = computed(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth <= 991;
  }
  return false;
});

// Update mobile state on resize
if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    if (isMobileView.value) {
      showMegaMenu.value = false;
    }
  });
}

const userStore = useUserStore();
const { user, hydrated } = storeToRefs(userStore);

const router = useRouter();

let closeTimeout = null;
const showMegaMenu = ref(false);

// Navigate to shop and clear all filters
const navigateToShop = () => {
  router.push('/products');
};

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
  if (!isMobileView.value) {
    showMegaMenu.value = true;
  }
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
.navbar-product-search {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  @media (max-width: 991px) {
    margin-bottom: 1rem;
  }
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 1030;
  background-color: var(--background-white);
  box-shadow: 0 2px 4px rgba(var(--shadow-rgb), 0.1);
}

// Dark mode hamburger fix
.navbar-toggler {
  .navbar-toggler-icon {
    [data-theme='dark'] & {
      filter: invert(1);
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255, 255, 255, 0.75)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
    }
  }
  &:focus {
    box-shadow: none;
  }
}

.nav-search-section {
  max-width: 500px;
  margin: 0 auto;

  .navbar-product-search {
    width: 100%;
  }
}

#navbarNav {
  @media (max-width: 991px) {
    padding: 1rem;
    
    .navbar-product-search {
      width: 100%;
    }
  }
}

.navbar-collapse {
  @media (max-width: 991px) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--background-white);
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(var(--shadow-rgb), 0.1);
  }
}

.navbar-toggler {
  @media (max-width: 420px) {
    margin-right: 1rem !important;
  }

  // Dark mode styles
  [data-theme='dark'] & {
    filter: invert(1);
  }

  &:focus {
    box-shadow: none;
  }
}

.navbar-brand {
  @media (max-width: 420px) {
    max-width: 75%;
    img {
      width: 100% !important;
    }
  }
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
