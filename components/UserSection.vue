<template>
  <div class="dropdown me-0 me-lg-2" @mouseenter="isDropdownOpen = true" @mouseleave="isDropdownOpen = false">
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
      <span>Hi, {{ user.first_name }}</span>
    </button>
    <transition name="fade">
      <ul
        v-show="isDropdownOpen && user"
        class="dropdown-menu dropdown-menu-end shadow-sm show me-3"
        :class="{ 'd-block': isDropdownOpen }"
        aria-labelledby="userDropdown"
        @mouseenter="isDropdownOpen = true"
        @mouseleave="isDropdownOpen = false"
      >
        <li>
          <NuxtLink to="/dashboard" class="dropdown-item d-flex align-items-center gap-2">
            <LucideIcon icon="mdi:user" class="me-2" />
            Profile
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/" class="dropdown-item d-flex align-items-center gap-2">
            <LucideIcon icon="mdi:history" class="me-2" />
            Order History
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/" class="dropdown-item d-flex align-items-center gap-2">
            <LucideIcon icon="mdi:heart" class="me-2" />
            Wishlist
          </NuxtLink>
        </li>
        <DropDownItems />
        <li>
          <div class="d-flex justify-content-center">
            <LogoutButton class="btn-smooth-primary text-center fw-semibold mt-3 px-4" />
          </div>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import LogoutButton from '@/components/LogoutButton.vue';
import DropDownItems from '@/components/DropDownItems.vue';
import LucideIcon from '@/components/LucideIcon.vue';
import { NuxtLink } from '#components';
import { useRouter } from 'vue-router';

const { user } = storeToRefs(useUserStore());
const isDropdownOpen = ref(false);
const router = useRouter();

onMounted(async () => {
  // Always fetch latest user info when dropdown is opened
  if (user.value && user.value.id) {
    try {
      const API_BASE = 'http://ayurveda-marketplace.test';
      const token = localStorage.getItem('auth_token');
      if (token) {
        const fetchedUser = await $fetch(`${API_BASE}/api/user`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        user.value = fetchedUser;
      }
    } catch (e) {
      // Optionally handle error
    }
  }
});
</script>

<style scoped>
.dropdown-menu {
  margin-top: 0.5rem;
  padding: 0.5rem;
}
</style>
