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
                  @click="changeTab('profile')" 
                  :class="['sidebar-nav-item', { active: activeTab === 'profile' }]"
                >
                  <LucideIcon icon="mdi:account" class="me-2" />
                  My Account
                </button>
                <button 
                  @click="changeTab('courses')" 
                  :class="['sidebar-nav-item', { active: activeTab === 'courses' }]"
                >
                  <LucideIcon icon="mdi:school" class="me-2" />
                  My Courses
                </button>
                <button 
                  @click="changeTab('events')" 
                  :class="['sidebar-nav-item', { active: activeTab === 'events' }]"
                >
                  <LucideIcon icon="mdi:calendar-star" class="me-2" />
                  My Events
                </button>
                <button 
                  @click="changeTab('consultations')" 
                  :class="['sidebar-nav-item', { active: activeTab === 'consultations' }]"
                >
                  <LucideIcon icon="mdi:calendar-check" class="me-2" />
                  My Consultations
                </button>
                <button 
                  @click="changeTab('orders')" 
                  :class="['sidebar-nav-item', { active: activeTab === 'orders' }]"
                >
                  <LucideIcon icon="mdi:package-variant" class="me-2" />
                  My Orders
                </button>
                <button 
                  @click="changeTab('wishlist')" 
                  :class="['sidebar-nav-item', { active: activeTab === 'wishlist' }]"
                >
                  <LucideIcon icon="mdi:heart" class="me-2" />
                  My Wishlist
                </button>
                <button 
                  @click="changeTab('activity')" 
                  :class="['sidebar-nav-item', { active: activeTab === 'activity' }]"
                >
                  <LucideIcon icon="mdi:timeline-clock" class="me-2" />
                  Activity
                </button>
                <button 
                  @click="changeTab('password')" 
                  :class="['sidebar-nav-item', { active: activeTab === 'password' }]"
                >
                  <LucideIcon icon="mdi:cog" class="me-2" />
                  Settings
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
            <!-- My Courses Tab -->
            <div v-if="activeTab === 'courses'" class="content-card">
              <MyCoursesSection />
            </div>
            <!-- My Events Tab -->
            <div v-if="activeTab === 'events'" class="content-card">
              <MyEventsSection />
            </div>
            <!-- Settings Tab -->
            <div v-if="activeTab === 'password'" class="content-card">
              <h3 class="content-title mb-4">Settings</h3>
              
              <!-- Change Password Section -->
              <div class="settings-section mb-5">
                <div class="d-flex align-items-center mb-3">
                  <LucideIcon icon="mdi:lock" class="me-2 fs-5 text-primary" />
                  <h5 class="mb-0">Change Password</h5>
                </div>
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
                        <small class="text-muted">Minimum 8 characters</small>
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

              <hr class="my-4">

              <!-- Theme Section -->
              <div class="settings-section mb-5">
                <div class="d-flex align-items-center mb-3">
                  <LucideIcon icon="mdi:palette" class="me-2 fs-5 text-primary" />
                  <h5 class="mb-0">Theme Preference</h5>
                </div>
                <div class="row">
                  <div class="col-md-8">
                    <p class="text-muted mb-3">Choose your preferred color theme for the website</p>
                    <div class="theme-options d-flex gap-3">
                      <div 
                        @click="selectedTheme = 'sunrise'" 
                        :class="['theme-card', { active: selectedTheme === 'sunrise' }]"
                        role="button"
                      >
                        <div class="theme-preview sunrise-preview">
                          <LucideIcon icon="mdi:weather-sunset-up" class="theme-icon" />
                        </div>
                        <div class="theme-name">Sunrise</div>
                        <div class="theme-description small text-muted">Warm & bright</div>
                      </div>
                      <div 
                        @click="selectedTheme = 'midnight'" 
                        :class="['theme-card', { active: selectedTheme === 'midnight' }]"
                        role="button"
                      >
                        <div class="theme-preview midnight-preview">
                          <LucideIcon icon="mdi:weather-night" class="theme-icon" />
                        </div>
                        <div class="theme-name">Midnight</div>
                        <div class="theme-description small text-muted">Cool & dark</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <hr class="my-4">

              <!-- Notifications Section -->
              <div class="settings-section mb-5">
                <div class="d-flex align-items-center mb-3">
                  <LucideIcon icon="mdi:bell" class="me-2 fs-5 text-primary" />
                  <h5 class="mb-0">Notification Preferences</h5>
                </div>
                <div class="row">
                  <div class="col-md-8">
                    <p class="text-muted mb-3">Manage how you receive notifications</p>
                    
                    <div class="notification-option d-flex justify-content-between align-items-center mb-3 p-3 border rounded">
                      <div>
                        <div class="fw-semibold">Email Notifications</div>
                        <small class="text-muted">Receive updates about orders, courses, and events</small>
                      </div>
                      <div class="form-check form-switch">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          id="emailNotif" 
                          v-model="notificationPrefs.email_notifications"
                          @change="saveNotificationPrefs"
                        >
                      </div>
                    </div>

                    <div class="notification-option d-flex justify-content-between align-items-center mb-3 p-3 border rounded">
                      <div>
                        <div class="fw-semibold">Order Updates</div>
                        <small class="text-muted">Get notified when your order status changes</small>
                      </div>
                      <div class="form-check form-switch">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          id="orderNotif" 
                          v-model="notificationPrefs.order_update_emails"
                          @change="saveNotificationPrefs"
                        >
                      </div>
                    </div>

                    <div class="notification-option d-flex justify-content-between align-items-center mb-3 p-3 border rounded">
                      <div>
                        <div class="fw-semibold">Marketing & Promotions</div>
                        <small class="text-muted">Receive special offers and promotional emails</small>
                      </div>
                      <div class="form-check form-switch">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          id="promoNotif" 
                          v-model="notificationPrefs.marketing_emails"
                          @change="saveNotificationPrefs"
                        >
                      </div>
                    </div>

                    <div class="notification-option d-flex justify-content-between align-items-center mb-3 p-3 border rounded">
                      <div>
                        <div class="fw-semibold">Course & Event Reminders</div>
                        <small class="text-muted">Get reminders before your registered courses and events</small>
                      </div>
                      <div class="form-check form-switch">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          id="courseNotif" 
                          v-model="notificationPrefs.course_event_reminders"
                          @change="saveNotificationPrefs"
                        >
                      </div>
                    </div>

                    <div v-if="notifMsg" class="alert alert-success mt-3">{{ notifMsg }}</div>
                  </div>
                </div>
              </div>

              <hr class="my-4">

              <!-- Location Settings -->
              <div class="settings-section mb-5">
                <div class="d-flex align-items-center mb-3">
                  <LucideIcon icon="mdi:map-marker" class="me-2 fs-5 text-primary" />
                  <h5 class="mb-0">Location & Delivery</h5>
                </div>
                <div class="row">
                  <div class="col-md-10">
                    <p class="text-muted mb-3">Set your default shipping address for faster checkout</p>
                    
                    <!-- Default Shipping Address -->
                    <div class="location-card mb-3 p-3 border rounded">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="mb-0 fw-semibold">Default Shipping Address</h6>
                        <button 
                          @click="showAddressForm = !showAddressForm" 
                          class="btn btn-sm btn-outline-primary"
                        >
                          <LucideIcon :icon="showAddressForm ? 'mdi:close' : 'mdi:pencil'" class="me-1" />
                          {{ showAddressForm ? 'Cancel' : 'Edit' }}
                        </button>
                      </div>
                      
                      <!-- Display saved address -->
                      <div v-if="!showAddressForm && locationPrefs.hasAddress" class="mt-3">
                        <div class="address-display">
                          <p class="mb-1"><strong>{{ locationPrefs.address.name }}</strong></p>
                          <p class="mb-1">{{ locationPrefs.address.street }}</p>
                          <p class="mb-1">{{ locationPrefs.address.city }}, {{ locationPrefs.address.state }} {{ locationPrefs.address.pincode }}</p>
                          <p class="mb-1"><strong>Phone:</strong> {{ locationPrefs.address.phone }}</p>
                        </div>
                      </div>

                      <!-- Address form -->
                      <div v-if="showAddressForm" class="mt-3">
                        <form @submit.prevent="saveAddress">
                          <div class="row">
                            <div class="col-md-6 mb-3">
                              <label class="form-label">Full Name<span class="text-danger">*</span></label>
                              <input 
                                type="text" 
                                v-model="addressForm.name" 
                                class="form-input"
                                required
                              >
                            </div>
                            <div class="col-md-6 mb-3">
                              <label class="form-label">Phone Number<span class="text-danger">*</span></label>
                              <input 
                                type="tel" 
                                v-model="addressForm.phone" 
                                class="form-input"
                                required
                              >
                            </div>
                          </div>
                          
                          <div class="mb-3">
                            <label class="form-label">Street Address<span class="text-danger">*</span></label>
                            <textarea 
                              v-model="addressForm.street" 
                              class="form-input"
                              rows="2"
                              required
                            ></textarea>
                          </div>
                          
                          <div class="row">
                            <div class="col-md-6 mb-3">
                              <label class="form-label">City<span class="text-danger">*</span></label>
                              <input 
                                type="text" 
                                v-model="addressForm.city" 
                                class="form-input"
                                required
                              >
                            </div>
                            <div class="col-md-6 mb-3">
                              <label class="form-label">State<span class="text-danger">*</span></label>
                              <input 
                                type="text" 
                                v-model="addressForm.state" 
                                class="form-input"
                                required
                              >
                            </div>
                          </div>
                          
                          <div class="row">
                            <div class="col-md-6 mb-3">
                              <label class="form-label">PIN Code<span class="text-danger">*</span></label>
                              <input 
                                type="text" 
                                v-model="addressForm.pincode" 
                                class="form-input"
                                pattern="[0-9]{6}"
                                title="Please enter a valid 6-digit PIN code"
                                required
                              >
                            </div>
                            <div class="col-md-6 mb-3">
                              <label class="form-label">Landmark (Optional)</label>
                              <input 
                                type="text" 
                                v-model="addressForm.landmark" 
                                class="form-input"
                              >
                            </div>
                          </div>
                          
                          <button type="submit" class="btn btn-smooth-success">
                            Save Address
                          </button>
                        </form>
                      </div>
                    </div>

                    <div v-if="locationMsg" class="alert alert-success mt-3">{{ locationMsg }}</div>
                  </div>
                </div>
              </div>

              <hr class="my-4">

              <!-- Additional Settings -->
              <div class="settings-section mb-3">
                <div class="d-flex align-items-center mb-3">
                  <LucideIcon icon="mdi:cog" class="me-2 fs-5 text-primary" />
                  <h5 class="mb-0">Other Settings</h5>
                </div>
                <div class="row">
                  <div class="col-md-8">
                    <!-- Price History - Hidden for now -->
                    <!-- <div class="notification-option d-flex justify-content-between align-items-center mb-3 p-3 border rounded">
                      <div>
                        <div class="fw-semibold">Show Price History</div>
                        <small class="text-muted">Display price trends for products you view</small>
                      </div>
                      <div class="form-check form-switch">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          id="priceHistory" 
                          v-model="otherSettings.priceHistory"
                          @change="saveOtherSettings"
                        >
                      </div>
                    </div> -->

                    <div class="notification-option d-flex justify-content-between align-items-center mb-3 p-3 border rounded">
                      <div>
                        <div class="fw-semibold">Save Cart Automatically</div>
                        <small class="text-muted">Your cart will be saved when you log out</small>
                      </div>
                      <div class="form-check form-switch">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          id="autoSaveCart" 
                          v-model="otherSettings.autoSaveCart"
                          @change="saveOtherSettings"
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- My Orders Tab -->
            <div v-if="activeTab === 'orders'" class="content-card">
              <h3 class="content-title mb-4">My Orders</h3>
              <OrdersSection />
            </div>
            <!-- My Consultations Tab -->
            <div v-if="activeTab === 'consultations'" class="content-card">
              <h3 class="content-title mb-4">My Consultations</h3>
              <ConsultationsSection />
            </div>
            <!-- My Wishlist Tab -->
            <div v-if="activeTab === 'wishlist'" class="content-card">
              <h3 class="content-title mb-4">My Wishlist</h3>
              <WishlistSection />
            </div>
            <!-- Activity Tab -->
            <div v-if="activeTab === 'activity'" class="content-card">
              <ActivitySection />
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
import ConsultationsSection from '@/components/dashboard/ConsultationsSection.vue'
import WishlistSection from '@/components/dashboard/WishlistSection.vue'
import ActivitySection from '@/components/dashboard/ActivitySection.vue'
import MyCoursesSection from '@/components/MyCoursesSection.vue'
import MyEventsSection from '@/components/MyEventsSection.vue'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useBookingStore } from '@/stores/booking'
import { useAuthApi } from '@/composables/useApi'
import { useTheme } from '@/composables/useTheme'
import { storeToRefs } from 'pinia'
import { ref, onMounted, watch, computed } from 'vue'

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
const activeTab = ref(route.query.tab || 'profile')

// Function to change tab and update URL
const changeTab = (tab: string) => {
  activeTab.value = tab
  router.push({ query: { tab } })
}

// Watch for tab query changes (e.g., when navigating from dropdown)
watch(() => route.query.tab, (newTab) => {
  if (newTab) {
    activeTab.value = newTab as string
  }
})
const dashboardLoadError = ref('')

onMounted(async () => {
  try {
    // Theme is now handled by useTheme composable
    
    // Load notification preferences from API
    try {
      const prefs = await authApi.get('user/email-preferences')
      if (prefs) {
        notificationPrefs.value = {
          email_notifications: prefs.email_notifications ?? true,
          order_update_emails: prefs.order_update_emails ?? true,
          marketing_emails: prefs.marketing_emails ?? false,
          course_event_reminders: prefs.course_event_reminders ?? true
        }
      }
    } catch (e) {
      console.error('Failed to load email preferences:', e)
    }
    
    // Load other settings from localStorage
    const savedOtherSettings = localStorage.getItem('otherSettings')
    if (savedOtherSettings) {
      try {
        otherSettings.value = JSON.parse(savedOtherSettings)
      } catch (e) {
        console.error('Failed to parse other settings:', e)
      }
    }
    
    // Load location preferences from localStorage
    const savedLocationPrefs = localStorage.getItem('locationPrefs')
    if (savedLocationPrefs) {
      try {
        locationPrefs.value = JSON.parse(savedLocationPrefs)
        // Populate address form with saved data
        if (locationPrefs.value.hasAddress) {
          addressForm.value = { ...locationPrefs.value.address }
        }
      } catch (e) {
        console.error('Failed to parse location preferences:', e)
      }
    }
    
    // Wait for hydration to complete, but set a timeout (e.g. 5 seconds)
    const hydrationTimeout = 5000
    let hydratedResolved = false
    if (!hydrated.value) {
      await Promise.race([
        new Promise(resolve => {
          const unwatch = watch(hydrated, (newVal) => {
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
    if (!user.value) {
      dashboardLoadError.value = 'User data not found after hydration. Please log in again.'
      console.error('[Dashboard] User missing after hydration!')
    } else {
      // Fetch wishlist to populate activity section
      await wishlistStore.fetchWishlist()
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

// Theme settings - use the same composable as navbar
const { theme, setTheme } = useTheme()

// Map 'light'/'dark' to 'sunrise'/'midnight' for UI display
const selectedTheme = computed({
  get: () => theme.value === 'dark' ? 'midnight' : 'sunrise',
  set: (value: string) => {
    setTheme(value === 'midnight' ? 'dark' : 'light')
  }
})

// Notification preferences
const notificationPrefs = ref({
  email_notifications: true,
  order_update_emails: true,
  marketing_emails: false,
  course_event_reminders: true
})
const notifMsg = ref('')

// Other settings
const otherSettings = ref({
  priceHistory: true,
  autoSaveCart: true
})

// Location settings
const showAddressForm = ref(false)
const locationMsg = ref('')
const locationPrefs = ref({
  hasAddress: false,
  preferredDeliverySlot: 'morning',
  address: {
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  }
})

const addressForm = ref({
  name: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  pincode: '',
  landmark: ''
})

const deliverySlots = [
  { value: 'morning', label: 'Morning', time: '9 AM - 12 PM', icon: 'mdi:weather-sunset-up' },
  { value: 'afternoon', label: 'Afternoon', time: '12 PM - 4 PM', icon: 'mdi:weather-sunny' },
  { value: 'evening', label: 'Evening', time: '4 PM - 8 PM', icon: 'mdi:weather-sunset-down' },
  { value: 'anytime', label: 'Anytime', time: 'Flexible', icon: 'mdi:clock-outline' }
]

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

// Save notification preferences
const saveNotificationPrefs = async () => {
  try {
    const response = await authApi.put('user/email-preferences', notificationPrefs.value)
    notifMsg.value = 'Notification preferences saved!'
    setTimeout(() => {
      notifMsg.value = ''
    }, 3000)
  } catch (error) {
    console.error('Failed to save notification preferences:', error)
    notifMsg.value = 'Failed to save preferences'
    setTimeout(() => {
      notifMsg.value = ''
    }, 3000)
  }
}

// Save other settings
const saveOtherSettings = () => {
  localStorage.setItem('otherSettings', JSON.stringify(otherSettings.value))
}

// Save address
const saveAddress = () => {
  locationPrefs.value.address = { ...addressForm.value }
  locationPrefs.value.hasAddress = true
  localStorage.setItem('locationPrefs', JSON.stringify(locationPrefs.value))
  locationMsg.value = 'Address saved successfully!'
  showAddressForm.value = false
  
  setTimeout(() => {
    locationMsg.value = ''
  }, 3000)
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

// Settings styles
.settings-section {
  .theme-options {
    display: flex;
    gap: 1rem;
  }

  .theme-card {
    flex: 1;
    max-width: 200px;
    padding: 1.5rem;
    border: 2px solid var(--border-color);
    border-radius: 12px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &.active {
      border-color: var(--color-primary);
      background: linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.05), rgba(var(--color-primary-rgb), 0.1));
    }

    .theme-preview {
      width: 80px;
      height: 80px;
      margin: 0 auto 1rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &.sunrise-preview {
        background: linear-gradient(135deg, #FFD93D 0%, #FF6B35 100%);
      }
      
      &.midnight-preview {
        background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
      }

      .theme-icon {
        font-size: 2rem;
        color: white;
      }
    }

    .theme-name {
      font-weight: 600;
      font-size: 1.1rem;
      margin-bottom: 0.25rem;
    }
  }

  .notification-option {
    transition: all 0.2s ease;

    &:hover {
background-color: rgba(0,0,0,0.2);    }

    .form-check-input {
      width: 3rem;
      height: 1.5rem;
      cursor: pointer;

      &:checked {
        background-color: var(--color-primary);
        border-color: var(--color-primary);
      }
    }
  }

  .location-card {
    transition: all 0.2s ease;

    
    
    h6 {
      color: var(--text-primary);
    }
    
    .btn-outline-primary {
      background: transparent;
      border: 2px solid var(--color-primary);
      color: var(--color-primary);
      font-weight: 600;
      transition: all 0.3s ease;
      
      &:hover {
        background: var(--color-primary);
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.3);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
  }

  .address-display {
    padding: 0.5rem;
    border-radius: 8px;
    
    p {
      margin: 0;
      line-height: 1.6;
      color: var(--text-primary);
    }
  }

  .delivery-slots {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .delivery-slot-card {
    padding: 1.5rem 1rem;
    border: 2px solid var(--border-color);
    border-radius: 12px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: var(--background-white);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &.active {
      border-color: var(--color-primary);
      background: linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.05), rgba(var(--color-primary-rgb), 0.1));
    }

    .slot-icon {
      font-size: 2rem;
      color: var(--color-primary);
      margin-bottom: 0.5rem;
    }

    .slot-label {
      font-weight: 600;
      font-size: 1rem;
      margin-bottom: 0.25rem;
    }

    .slot-time {
      font-size: 0.85rem;
    }
  }
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

  .theme-options {
    flex-direction: column;
    
    .theme-card {
      max-width: 100% !important;
    }
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
