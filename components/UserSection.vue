<template>
  <div class="dropdown me-0 me-lg-2" @mouseenter="isDropdownOpen = true" @mouseleave="isDropdownOpen = false">
    <button
      v-if="user"
      class="btn btn-link nav-link d-flex flex-column align-items-center p-0"
      type="button"
      id="userDropdown"
      aria-expanded="false"
      tabindex="0"
      title="Profile"
      @click="isDropdownOpen = !isDropdownOpen"
    >
      <div class="d-flex align-items-center">
        <UserAvatar :src="user.profile_image" size="sm" />
        <LucideIcon icon="mdi:arrow-down-drop" class="fs-4 ms-n1" style="margin-left: -4px;" />
      </div>
    </button>
    <transition name="fade">
      <ul
        v-show="isDropdownOpen && user"
        class="dropdown-menu custom-dropdown-menu show"
        aria-labelledby="userDropdown" 
        @mouseenter="isDropdownOpen = true"
        @mouseleave="isDropdownOpen = false"
        style="right:0; left:auto; top:100%; position:absolute;"
      >
        <DropDownItems :items="[
          { type: 'link', to: '/dashboard', icon: 'mdi:user', label: 'Dashboard' },
          { type: 'link', to: '/orders', icon: 'mdi:history', label: 'Order History' },
          { type: 'link', to: '/wishlist', icon: 'mdi:heart', label: 'Wishlist' },
          { type: 'divider' },
          { type: 'link', to: '/', icon: 'mdi:home', label: 'Home' },
          { type: 'link', to: '/settings', icon: 'mdi:settings', label: 'Settings' },
          { type: 'action', href: '#', icon: 'mdi:smartphone', label: 'Download App' },
          { type: 'divider' }
        ]" />
        <li>
          <div class="d-flex justify-content-center">
            <LogoutButton class="btn-smooth-primary text-center fw-semibold px-4 py-2" />
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
import UserAvatar from '@/components/UserAvatar.vue';
import { NuxtLink } from '#components';
import { useRouter } from 'vue-router';

const { user } = storeToRefs(useUserStore());
const isDropdownOpen = ref(false);
const router = useRouter();

onMounted(async () => {
  // Always fetch latest user info when dropdown is opened
  if (user.value && user.value.id) {
    try {
      const config = useRuntimeConfig();
      const API_BASE = config.public.apiBase;
      const token = localStorage.getItem('auth_token');
      if (token) {
        const fetchedUser = await $fetch(`${API_BASE}/user`, {
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
<style lang="css" scoped>
</style>
