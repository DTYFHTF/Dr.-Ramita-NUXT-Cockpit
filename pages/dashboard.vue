<template>
  <div class="dashboard-wrapper" v-if="user">
    <div class="container py-4">
      <div class="row">
        <!-- Welcome Section -->
        <div class="col-12 mb-4">
          <div class="welcome-card">
            <div class="d-flex align-items-center">
              <div class="user-avatar">
                <LucideIcon icon="mdi:account" />
              </div>
              <div class="ms-3">
                <h2 class="welcome-title">Welcome back, {{ user.first_name }}!</h2>
                <p class="welcome-subtitle">{{ getGreeting() }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="col-12 mb-4">
          <div class="section-card">
            <h3 class="section-title">Quick Actions</h3>
            <div class="row g-3">
              <div class="col-6 col-md-4 col-lg-3">
                <NuxtLink to="/products" class="action-card">
                  <div class="action-icon">
                    <LucideIcon icon="mdi:shopping" />
                  </div>
                  <span class="action-text">Browse Products</span>
                </NuxtLink>
              </div>
              <div class="col-6 col-md-4 col-lg-3">
                <button @click="openBookingWizard" class="action-card">
                  <div class="action-icon">
                    <LucideIcon icon="mdi:calendar-plus" />
                  </div>
                  <span class="action-text">Book Consultation</span>
                </button>
              </div>
              <div class="col-6 col-md-4 col-lg-3">
                <NuxtLink to="/CartPage" class="action-card">
                  <div class="action-icon">
                    <LucideIcon icon="mdi:cart" />
                    <span v-if="cartStore.totalItems > 0" class="cart-badge">{{ cartStore.totalItems }}</span>
                  </div>
                  <span class="action-text">My Cart</span>
                </NuxtLink>
              </div>
              <div class="col-6 col-md-4 col-lg-3">
                <NuxtLink to="/orders" class="action-card">
                  <div class="action-icon">
                    <LucideIcon icon="mdi:package-variant" />
                  </div>
                  <span class="action-text">Orders</span>
                </NuxtLink>
              </div>
              <div class="col-6 col-md-4 col-lg-3">
                <NuxtLink to="/wishlist" class="action-card">
                  <div class="action-icon">
                    <LucideIcon icon="mdi:heart" />
                    <span v-if="wishlistStore.totalItems > 0" class="cart-badge">{{ wishlistStore.totalItems }}</span>
                  </div>
                  <span class="action-text">Wishlist</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Status & Recent Orders Row -->
        <div class="col-12 col-lg-8 mb-4">
          <div class="section-card">
            <h3 class="section-title">Recent Orders</h3>
            <div v-if="ordersLoading" class="text-center py-3">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="recentOrders.length === 0" class="empty-state">
              <LucideIcon icon="mdi:package-variant-closed" />
              <p>No recent orders found</p>
              <NuxtLink to="/products" class="btn btn-primary btn-sm">Start Shopping</NuxtLink>
            </div>
            <div v-else>
              <div class="order-item" v-for="order in recentOrders" :key="order.id">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <div class="order-id">Order #{{ order.id }}</div>
                    <div class="order-date">{{ formatDate(order.created_at) }}</div>
                  </div>
                  <div class="text-end">
                    <div class="order-status">{{ order.status }}</div>
                    <div class="order-total">Rs. {{ order.total }}</div>
                  </div>
                </div>
              </div>
              <div class="mt-3 text-center">
                <NuxtLink to="/orders" class="btn btn-outline-primary btn-sm">View All Orders</NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Status -->
        <div class="col-12 col-lg-4 mb-4">
          <div class="section-card">
            <h3 class="section-title">Account Status</h3>
            <div class="account-status">
              <div class="status-item">
                <div class="status-label">Email Verification</div>
                <div v-if="user.email_verified_at" class="status-value verified">
                  <LucideIcon icon="mdi:check-circle" /> Verified
                </div>
                <div v-else class="status-value unverified">
                  <LucideIcon icon="mdi:alert-circle" /> Not Verified
                  <button class="btn btn-link p-0 ms-2" @click="sendVerification" :disabled="sending">
                    <span v-if="sending">Sending...</span>
                    <span v-else>Send Email</span>
                  </button>
                </div>
              </div>
              <div class="status-item">
                <div class="status-label">Profile</div>
                <div class="status-value">
                  <LucideIcon icon="mdi:account" /> {{ getProfileCompleteness() }}% Complete
                </div>
              </div>
              <div class="status-item">
                <div class="status-label">Cart Items</div>
                <div class="status-value">
                  <LucideIcon icon="mdi:cart" /> {{ cartStore.totalItems }} items
                </div>
              </div>
              <div class="status-item">
                <div class="status-label">Wishlist Items</div>
                <div class="status-value">
                  <LucideIcon icon="mdi:heart" /> {{ wishlistStore.totalItems }} items
                </div>
              </div>
            </div>
            <div v-if="sentMsg" class="alert alert-success mt-3">{{ sentMsg }}</div>
            <div v-if="sendError" class="alert alert-danger mt-3">{{ sendError }}</div>
          </div>
        </div>

        <!-- Navigation Cards -->
        <div class="col-12">
          <div class="section-card">
            <h3 class="section-title">Explore</h3>
            <div class="row g-3">
              <div class="col-6 col-md-3">
                <NuxtLink to="/course" class="nav-card">
                  <div class="nav-icon">
                    <LucideIcon color="white" icon="mdi:school" />
                  </div>
                  <div class="nav-content">
                    <div class="nav-title">Courses</div>
                    <div class="nav-subtitle">Learn Ayurveda</div>
                  </div>
                </NuxtLink>
              </div>
              <div class="col-6 col-md-3">
                <NuxtLink to="/recipe" class="nav-card">
                  <div class="nav-icon">
                    <LucideIcon color="white" icon="mdi:leaf" />
                  </div>
                  <div class="nav-content">
                    <div class="nav-title">Recipes</div>
                    <div class="nav-subtitle">Healthy meals</div>
                  </div>
                </NuxtLink>
              </div>
              <div class="col-6 col-md-3">
                <NuxtLink to="/homeremedy" class="nav-card">
                  <div class="nav-icon">
                    <LucideIcon color="white" icon="mdi:heart" />
                  </div>
                  <div class="nav-content">
                    <div class="nav-title">Remedies</div>
                    <div class="nav-subtitle">Natural healing</div>
                  </div>
                </NuxtLink>
              </div>
              <div class="col-6 col-md-3">
                <NuxtLink to="/yoganmeditation" class="nav-card">
                  <div class="nav-icon">
                    <LucideIcon color="white" icon="mdi:meditation" />
                  </div>
                  <div class="nav-content">
                    <div class="nav-title">Yoga</div>
                    <div class="nav-subtitle">Mind & body</div>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="dashboard-wrapper">
    <div class="container-fluid py-4">
      <div class="text-center">
        <h1>Dashboard</h1>
        <p>You are not logged in.</p>
        <NuxtLink to="/login" class="btn btn-primary">Login</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LucideIcon from '@/components/LucideIcon.vue'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useBookingStore } from '@/stores/booking'
import { storeToRefs } from 'pinia'
import { ref, computed, onMounted } from 'vue'

const userStore = useUserStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const bookingStore = useBookingStore()
const { user } = storeToRefs(userStore)

const sending = ref(false)
const sentMsg = ref('')
const sendError = ref('')
const API_BASE = useRuntimeConfig().public.apiBase

// Orders data
const recentOrders = ref<any[]>([])
const ordersLoading = ref(false)

// Fetch recent orders
const fetchRecentOrders = async () => {
  if (!user.value || !userStore.token) return
  
  ordersLoading.value = true
  try {
    const response = await $fetch(`${API_BASE}/orders`, {
      method: 'GET',
      headers: { 
        Accept: 'application/json', 
        Authorization: `Bearer ${userStore.token}` 
      }
    }) as any
    
    // Get the orders from the response
    const allOrders = response.orders || response.data || response || []
    
    // Take only the first 3 orders for dashboard display
    recentOrders.value = allOrders.slice(0, 3)
  } catch (e) {
    console.error('Failed to fetch recent orders:', e)
    recentOrders.value = []
  } finally {
    ordersLoading.value = false
  }
}

// Utility functions
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning!'
  if (hour < 17) return 'Good afternoon!'
  return 'Good evening!'
}

const getProfileCompleteness = () => {
  if (!user.value) return 0
  
  let completeness = 0
  const fields = ['first_name', 'last_name', 'email', 'phone', 'email_verified_at']
  
  fields.forEach(field => {
    if ((user.value as any)[field]) completeness += 20
  })
  
  return completeness
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
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
    const token = localStorage.getItem('auth_token')
    await $fetch(`${API_BASE}/api/email/verification-notification`, {
      method: 'POST',
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
    })
    sentMsg.value = 'Verification email sent! Please check your inbox.'
  } catch (e) {
    sendError.value = 'Failed to send verification email.'
  } finally {
    sending.value = false
  }
}

onMounted(() => {
  fetchRecentOrders()
})
</script>

<style scoped lang="scss">
@import '@/assets/scss/variables.scss';

.dashboard-wrapper {
  background-color: var(--background-light);
  min-height: 100vh;
}

.welcome-card {
  background: var(--background-white);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--card-shadow);
  border: 1px solid var(--border-color);
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-white);
  font-size: 1.5rem;
}

.welcome-title {
  margin: 0;
  color: $text-primary;
  font-size: 1.5rem;
  font-weight: 600;
}

.welcome-subtitle {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.section-card {
  background: var(--background-white);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--card-shadow);
  border: 1px solid var(--border-color);
  height: 100%;
}

.section-title {
  color: $text-primary;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.action-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--background-white);
  border: 1px solid var(--color-secondary);
  border-radius: 8px;
  padding: 1.5rem 1rem;
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.3s ease;
  height: 100px;
  position: relative;

  &:hover {
    border-color: $color-primary;
    background: $background-light;
    transform: translateY(-2px);
    box-shadow: $btn-hover-shadow;
    color: $text-primary;
    text-decoration: none;
  }
}

.action-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--color-primary);
  position: relative;
}

.action-text {
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--color-primary);
  color: var(--text-white);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.order-item {
  padding: 1rem;
  border: 1px solid $border-color;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  background: $background-light;
}

.order-id {
  font-weight: 600;
  color: $text-primary;
  font-size: 0.9rem;
}

.order-date {
  color: $text-secondary;
  font-size: 0.8rem;
}

.order-status {
  color: $color-primary;
  font-size: 0.85rem;
  font-weight: 500;
}

.order-total {
  font-weight: 600;
  color: $text-primary;
  font-size: 0.9rem;
}

.account-status {
  .status-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid $border-color;

    &:last-child {
      border-bottom: none;
    }
  }

  .status-label {
    font-weight: 500;
    color: $text-secondary;
    font-size: 0.9rem;
  }

  .status-value {
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &.verified {
      color: $color-secondary;
    }

    &.unverified {
      color: $text-error;
    }
  }
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: $text-secondary;

  i {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: $color-secondary;
  }

  p {
    margin-bottom: 1rem;
  }
}

.nav-card {
  display: flex;
  align-items: center;
  background: var(--background-white);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--color-primary);
    background: var(--background-light);
    transform: translateY(-1px);
    box-shadow: $btn-hover-shadow;
    color: $text-primary;
    text-decoration: none;
  }
}

.nav-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-white);
  font-size: 1.2rem;
  margin-right: 1rem;
  flex-shrink: 0;
}

.nav-content {
  .nav-title {
    font-weight: 600;
    color: $text-primary;
    font-size: 0.9rem;
    margin-bottom: 0.2rem;
  }

  .nav-subtitle {
    color: $text-secondary;
    font-size: 0.8rem;
  }
}

.btn-primary {
  background-color: var(--button-bg);
  border-color: var(--button-bg);

  &:hover {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
  }
}

.btn-outline-primary {
  color: var(--button-bg);
  border-color: var(--button-bg);

  &:hover {
    background-color: var(--button-bg);
    border-color: var(--button-bg);
  }
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
@media (max-width: 768px) {
  .welcome-card {
    padding: 1.5rem;
  }

  .section-card {
    padding: 1rem;
  }

  .action-card {
    height: 80px;
    padding: 1rem 0.5rem;
  }

  .action-icon {
    font-size: 1.2rem;
  }

  .action-text {
    font-size: 0.8rem;
  }

  .user-avatar {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }

  .welcome-title {
    font-size: 1.3rem;
  }
}
</style>
