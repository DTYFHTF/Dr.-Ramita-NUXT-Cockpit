<template>
  <client-only>
    <div class="dashboard-wrapper" v-if="hydrated">
      <div v-if="user" class="container-fluid py-4">
        <div class="row">
          <!-- Sidebar Navigation -->
          <div class="col-12 col-lg-3 d-flex justify-content-center">
            <div class="profile-sidebar">
              <!-- User Profile Header -->
              <div class="profile-header">
                <div class="d-flex align-items-center mb-3">
                  <UserAvatar :src="user.profile_image ?? undefined" size="md" class="me-3" />
                  <div>
                    <div class="profile-greeting">{{ getGreeting() }}</div>
                    <div class="profile-name">{{ user.first_name }} {{ user.last_name }}</div>
                  </div>
                </div>
              </div>
              <!-- Navigation Menu -->
              <div class="sidebar-nav">
                <button 
                  @click="activeTab = 'profile'" 
                  :class="['sidebar-nav-item', { active: activeTab === 'profile' }]"
                >
                  <LucideIcon icon="mdi:account" class="me-2" />
                  My Account
                </button>
                <button 
                  @click="activeTab = 'orders'" 
                  :class="['sidebar-nav-item', { active: activeTab === 'orders' }]"
                >
                  <LucideIcon icon="mdi:package-variant" class="me-2" />
                  My Orders
                </button>
                <button 
                  @click="activeTab = 'wishlist'" 
                  :class="['sidebar-nav-item', { active: activeTab === 'wishlist' }]"
                >
                  <LucideIcon icon="mdi:heart" class="me-2" />
                  My Wishlist
                </button>
                <button 
                  @click="activeTab = 'password'" 
                  :class="['sidebar-nav-item', { active: activeTab === 'password' }]"
                >
                  <LucideIcon icon="mdi:lock" class="me-2" />
                  Change Password
                </button>
              </div>
            </div>
          </div>
          <!-- Main Content Area -->
          <div class="col-12 col-lg-9">
            <!-- Profile Information Tab -->
            <div v-if="activeTab === 'profile'" class="content-card">
              <AccountSection />
            </div>
            <!-- Change Password Tab -->
            <div v-if="activeTab === 'password'" class="content-card">
              <h3 class="content-title mb-4">Change Password</h3>
              <div class="row">
                <div class="col-md-8">
                  <form @submit.prevent="changePassword">
                    <div class="form-group mb-3">
                      <label class="form-label">Current Password</label>
                      <input type="password" v-model="passwordForm.currentPassword" class="form-input" required>
                    </div>
                    <div class="form-group mb-3">
                      <label class="form-label">New Password</label>
                      <input type="password" v-model="passwordForm.newPassword" class="form-input" required minlength="8">
                    </div>
                    <div class="form-group mb-3">
                      <label class="form-label">Confirm New Password</label>
                      <input type="password" v-model="passwordForm.confirmPassword" class="form-input" required>
                    </div>
                    <button type="submit" class="btn btn-smooth-success" :disabled="passwordChanging">
                      <span v-if="passwordChanging">Changing...</span>
                      <span v-else>Update Password</span>
                    </button>
                  </form>
                  <div v-if="passwordMsg" class="alert alert-success mt-3">{{ passwordMsg }}</div>
                  <div v-if="passwordError" class="alert alert-danger mt-3">{{ passwordError }}</div>
                </div>
              </div>
            </div>
            <!-- My Orders Tab -->
            <div v-if="activeTab === 'orders'" class="content-card">
              <h3 class="content-title mb-4">My Orders</h3>
              <OrdersSection />
            </div>
            <!-- My Wishlist Tab -->
            <div v-if="activeTab === 'wishlist'" class="content-card">
              <h3 class="content-title mb-4">My Wishlist</h3>
              <WishlistSection />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="container-fluid py-4">
        <div class="text-center">
          <h1>Dashboard</h1>
          <p>You are not logged in.</p>
          <NuxtLink to="/login" class="btn btn-smooth-success">Login</NuxtLink>
        </div>
      </div>
    </div>
    <div v-else class="dashboard-wrapper">
      <div class="container-fluid py-4">
        <div class="text-center">
          <div v-if="!dashboardLoadError" class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p v-if="!dashboardLoadError" class="mt-2 text-muted">Initializing dashboard...</p>
          <div v-if="dashboardLoadError" class="alert alert-danger mt-3">{{ dashboardLoadError }}</div>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script setup lang="ts">
// Add authentication middleware
// definePageMeta({
//   middleware: 'auth'
// })

import LucideIcon from '@/components/LucideIcon.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import AccountSection from '@/components/dashboard/AccountSection.vue'
import OrdersSection from '@/components/dashboard/OrdersSection.vue'
import WishlistSection from '@/components/dashboard/WishlistSection.vue'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useBookingStore } from '@/stores/booking'
import { useAuthApi } from '@/composables/useApi'
import { storeToRefs } from 'pinia'
import { ref, onMounted, watch } from 'vue'

const userStore = useUserStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const bookingStore = useBookingStore()
const { user, hydrated } = storeToRefs(userStore)

// Initialize Auth API composable
const authApi = useAuthApi()

// Debug: Log user data on mount (remove in production)
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const activeTab = ref(route.query.tab === 'orders' || route.query.tab === 'wishlist' ? route.query.tab : 'profile')

// Watch for tab query changes (e.g., when navigating from dropdown)
watch(() => route.query.tab, (newTab) => {
  if (newTab === 'orders' || newTab === 'wishlist' || newTab === 'profile') {
    activeTab.value = newTab
  }
})
const dashboardLoadError = ref('')

onMounted(async () => {
  try {
    // Debug: Check localStorage directly
    console.log('[Dashboard] LocalStorage user:', localStorage.getItem('user'))
    console.log('[Dashboard] LocalStorage auth_token:', localStorage.getItem('auth_token'))
    console.log('[Dashboard] Store user.value:', user.value)
    console.log('[Dashboard] Store token.value:', userStore.token)
    
    // Wait for hydration to complete, but set a timeout (e.g. 5 seconds)
    const hydrationTimeout = 5000
    let hydratedResolved = false
    console.log('[Dashboard] onMounted: hydrated.value =', hydrated.value)
    if (!hydrated.value) {
      await Promise.race([
        new Promise(resolve => {
          const unwatch = watch(hydrated, (newVal) => {
            console.log('[Dashboard] hydrated watcher fired:', newVal)
            if (newVal) {
              hydratedResolved = true
              unwatch()
              resolve(true)
            }
          })
        }),
        new Promise((_, reject) => setTimeout(() => {
          if (!hydratedResolved) {
            console.error('[Dashboard] Hydration timeout after 5s! hydrated.value =', hydrated.value)
            reject(new Error('Hydration timeout'))
          }
        }, hydrationTimeout))
      ])
    }
    console.log('[Dashboard] After hydration: user.value =', user.value, 'token =', userStore.token)
    if (!user.value) {
      dashboardLoadError.value = 'User data not found after hydration. Please log in again.'
      console.error('[Dashboard] User missing after hydration!')
    } else {
      console.log('[Dashboard] User authenticated:', !!user.value)
      console.log('[Dashboard] User profile:', user.value)
    }
  } catch (e: any) {
    if (e?.message === 'Hydration timeout') {
      dashboardLoadError.value = 'Failed to load dashboard (hydration timeout). Please refresh or log in again.'
      console.error('[Dashboard] Hydration timeout error:', e)
    } else {
      dashboardLoadError.value = 'Failed to initialize dashboard.'
      console.error('[Dashboard] Failed to initialize dashboard:', e)
    }
  }
})

// Email verification
const sending = ref(false)
const sentMsg = ref('')
const sendError = ref('')

// Password change
const passwordChanging = ref(false)
const passwordMsg = ref('')
const passwordError = ref('')
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Utility functions
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning!'
  if (hour < 17) return 'Good afternoon!'
  return 'Good evening!'
}

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'New passwords do not match'
    return
  }

  passwordChanging.value = true
  passwordMsg.value = ''
  passwordError.value = ''

  try {
    await authApi.post('change-password', userStore.token, {
      current_password: passwordForm.value.currentPassword,
      new_password: passwordForm.value.newPassword,
      new_password_confirmation: passwordForm.value.confirmPassword
    })
    
    passwordMsg.value = 'Password changed successfully!'
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (e: any) {
    passwordError.value = e.data?.message || 'Failed to change password'
  } finally {
    passwordChanging.value = false
  }
}

const openBookingWizard = () => {
  // Navigate to home page where booking wizard is available
  navigateTo('/#booking')
}

async function sendVerification() {
  sending.value = true
  sentMsg.value = ''
  sendError.value = ''
  try {
    await authApi.post('email/verification-notification', userStore.token, {})
    sentMsg.value = 'Verification email sent! Please check your inbox.'
  } catch (e) {
    sendError.value = 'Failed to send verification email.'
  } finally {
    sending.value = false
  }
}
</script>

<style scoped lang="scss">
.dashboard-wrapper {
  background-color: var(--background-light);
  min-height: 100vh;
}

.profile-sidebar {
  background: var(--background-white);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--card-shadow);
  border: 1px solid var(--border-color);
  height: fit-content;
}

.profile-header {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.profile-greeting {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.profile-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1rem;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: var(--text-primary);
  background: transparent;
  border: none;
  transition: all 0.2s ease;
  cursor: pointer;
  width: 100%;
  text-align: left;
  
  &:hover {
    background: var(--background-light);
    color: var(--color-primary);
  }
  
  &.active {
    background: var(--color-primary);
    color: var(--text-white);
  }
}

.content-card {
  background: var(--background-white);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--card-shadow);
  border: 1px solid var(--border-color);
}

.content-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
}

.alert-success {
  background-color: var(--success-bg);
  border-color: var(--color-secondary);
  color: var(--color-secondary);
}

.alert-danger {
  background-color: var(--error-bg);
  border-color: var(--text-error);
  color: var(--text-error);
}

// Responsive adjustments
@media (max-width: 992px) {
  .profile-sidebar {
    margin-bottom: 2rem;
  }
  
  .sidebar-nav {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .sidebar-nav-item {
    flex: 1;
    min-width: 150px;
    text-align: center;
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .content-card {
    padding: 1rem;
  }
  
  .profile-info-grid {
    gap: 1rem;
  }
}
</style>
