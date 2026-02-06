<template>
  <div class="activity-container">
    <h3 class="content-title mb-4">Recent Activity</h3>
    
    <div class="row g-3">
      <!-- Recent Orders Card -->
      <div class="col-lg-6">
        <div class="activity-card">
          <div class="activity-card-header">
            <LucideIcon icon="mdi:package-variant" class="me-2 text-primary" />
            <h6 class="mb-0">Recent Orders</h6>
          </div>
          <div class="activity-card-body">
            <div v-if="orders && orders.length > 0" class="activity-list">
              <div v-for="order in orders.slice(0, 3)" :key="order.id" class="activity-item-compact">
                <div class="activity-item-icon">
                  <LucideIcon icon="mdi:receipt" class="text-success" size="18" />
                </div>
                <div class="activity-item-content">
                  <div class="activity-item-title">Order #{{ order.id }}</div>
                  <div class="activity-item-meta">
                    <span class="badge badge-sm" :class="getOrderStatusClass(order.status)">{{ order.status }}</span>
                    <span class="text-muted ms-2 small">{{ formatDate(order.created_at) }}</span>
                  </div>
                </div>
                <div class="activity-item-value">₹{{ order.total?.toFixed(2) }}</div>
              </div>
            </div>
            <div v-else class="text-muted text-center py-2 small">
              No orders yet
            </div>
            <NuxtLink v-if="orders.length > 0" to="/dashboard?tab=orders" class="activity-view-all">
              View All Orders →
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Wishlist Activity Card -->
      <div class="col-lg-6">
        <div class="activity-card">
          <div class="activity-card-header">
            <LucideIcon icon="mdi:heart" class="me-2 text-danger" />
            <h6 class="mb-0">Wishlist Activity</h6>
          </div>
          <div class="activity-card-body">
            <div v-if="wishlist && wishlist.length > 0" class="activity-list">
              <div v-for="item in wishlist.slice(0, 3)" :key="item.id" class="activity-item-compact">
                <div class="activity-item-icon">
                  <LucideIcon icon="mdi:heart" class="text-danger" size="18" />
                </div>
                <div class="activity-item-content">
                  <div class="activity-item-title">{{ item.product?.name || 'Product' }}</div>
                  <div class="activity-item-meta text-muted small">In your wishlist</div>
                </div>
                <div v-if="item.product?.price" class="activity-item-value text-success">₹{{ item.product.display_price || item.product.price }}</div>
              </div>
            </div>
            <div v-else class="text-muted text-center py-2 small">
              No items in wishlist
            </div>
            <NuxtLink v-if="wishlist.length > 0" to="/dashboard?tab=wishlist" class="activity-view-all">
              View All Items →
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Recent Registrations Card -->
      <div class="col-lg-6">
        <div class="activity-card">
          <div class="activity-card-header">
            <LucideIcon icon="mdi:calendar-check" class="me-2 text-info" />
            <h6 class="mb-0">Recent Registrations</h6>
          </div>
          <div class="activity-card-body">
            <div v-if="registrations && registrations.length > 0" class="activity-list">
              <div v-for="reg in registrations.slice(0, 3)" :key="reg.id" class="activity-item-compact">
                <div class="activity-item-icon">
                  <LucideIcon :icon="reg.type === 'course' ? 'mdi:school' : 'mdi:calendar-star'" class="text-info" size="18" />
                </div>
                <div class="activity-item-content">
                  <div class="activity-item-title">{{ reg.title || reg.name }}</div>
                  <div class="activity-item-meta">
                    <span class="badge badge-sm bg-info text-white">{{ reg.type || 'course' }}</span>
                    <span class="text-muted ms-2 small">{{ formatDate(reg.registered_at || reg.created_at) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-muted text-center py-2 small">
              No recent registrations
            </div>
            <NuxtLink v-if="registrations.length > 0" to="/dashboard?tab=courses" class="activity-view-all">
              View All →
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Recently Viewed Products Card -->
      <div class="col-lg-6">
        <div class="activity-card">
          <div class="activity-card-header">
            <LucideIcon icon="mdi:eye" class="me-2 text-primary" />
            <h6 class="mb-0">Recently Viewed</h6>
          </div>
          <div class="activity-card-body">
            <div v-if="recentlyViewed.length > 0" class="recent-products-grid">
              <NuxtLink 
                v-for="product in recentlyViewed.slice(0, 4)" 
                :key="product.id" 
                :to="`/products/${product.slug}`" 
                class="recent-product-mini"
              >
                <img :src="getImageUrl(product.image)" :alt="product.name" class="recent-product-mini-img" />
                <div class="recent-product-mini-info">
                  <div class="recent-product-mini-name">{{ product.name }}</div>
                  <div class="recent-product-mini-price">₹{{ product.price }}</div>
                </div>
              </NuxtLink>
            </div>
            <div v-else class="text-muted text-center py-2 small">
              No products viewed recently
            </div>
            <NuxtLink v-if="recentlyViewed.length > 0" to="/products" class="activity-view-all">
              Browse All Products →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useWishlistStore } from '@/stores/wishlist'
import { useRecentlyViewed } from '@/composables/useRecentlyViewed'
import { useAuthenticatedApi } from '@/composables/useAuthenticatedApi'
import LucideIcon from '@/components/LucideIcon.vue'

const userStore = useUserStore()
const wishlistStore = useWishlistStore()
const { getRecentlyViewed } = useRecentlyViewed()
const { get } = useAuthenticatedApi()

// Reactive data
const orders = ref<any[]>([])
const recentlyViewed = ref<any[]>([])
const registrations = ref<any[]>([])

// Wishlist from store (using storeToRefs for reactivity)
const { wishlist: wishlistItems } = storeToRefs(wishlistStore)
const wishlist = computed(() => wishlistItems.value || [])

const config = useRuntimeConfig()
const baseUrl = config.public.baseUrl

// Fetch orders
const fetchOrders = async () => {
  try {
    const response = await get('orders')
    console.log('Orders response:', response)
    if (response && Array.isArray(response)) {
      orders.value = response
    } else if (response?.data && Array.isArray(response.data)) {
      orders.value = response.data
    } else if (response?.orders && Array.isArray(response.orders)) {
      orders.value = response.orders
    }
    console.log('Orders loaded:', orders.value.length)
  } catch (error) {
    console.error('Failed to fetch orders:', error)
  }
}

// Fetch registrations
const fetchRegistrations = async () => {
  try {
    const [coursesRes, eventsRes] = await Promise.all([
      get('user/courses').catch((e) => { console.log('Courses error:', e); return null; }),
      get('user/events').catch((e) => { console.log('Events error:', e); return null; })
    ])
    
    console.log('Courses response:', coursesRes)
    console.log('Events response:', eventsRes)
    
    const allRegistrations = []
    
    // Handle courses
    if (coursesRes) {
      const coursesList = Array.isArray(coursesRes) ? coursesRes : 
                          (coursesRes?.data && Array.isArray(coursesRes.data)) ? coursesRes.data :
                          (coursesRes?.courses && Array.isArray(coursesRes.courses)) ? coursesRes.courses : []
      allRegistrations.push(...coursesList.map((c: any) => ({ ...c, type: 'course' })))
    }
    
    // Handle events
    if (eventsRes) {
      const eventsList = Array.isArray(eventsRes) ? eventsRes :
                        (eventsRes?.data && Array.isArray(eventsRes.data)) ? eventsRes.data :
                        (eventsRes?.events && Array.isArray(eventsRes.events)) ? eventsRes.events : []
      allRegistrations.push(...eventsList.map((e: any) => ({ ...e, type: 'event' })))
    }
    
    // Sort by date
    registrations.value = allRegistrations.sort((a, b) => {
      const dateA = new Date(a.registered_at || a.created_at || 0)
      const dateB = new Date(b.registered_at || b.created_at || 0)
      return dateB.getTime() - dateA.getTime()
    }).slice(0, 5)
    
    console.log('Registrations loaded:', registrations.value.length)
  } catch (error) {
    console.error('Failed to fetch registrations:', error)
  }
}

// Load data on mount
onMounted(async () => {
  const viewed = getRecentlyViewed()
  console.log('Recently viewed:', viewed.length)
  recentlyViewed.value = viewed.slice(0, 6)
  console.log('Wishlist items:', wishlist.value.length)
  
  await Promise.all([
    fetchOrders(),
    fetchRegistrations()
  ])
})

// Clear recently viewed
const clearRecentlyViewed = () => {
  recentlyViewed.value = []
  if (import.meta.client) {
    localStorage.removeItem('recentlyViewed')
  }
}

// Helper to get full image URL
const getImageUrl = (imagePath: string | null | undefined) => {
  if (!imagePath) return '/placeholder.jpg'
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  const base = baseUrl?.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  return `${base}/storage/${imagePath}`
}

// Format date helper
const formatDate = (date: string | Date) => {
  if (!date) return 'Recently'
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return d.toLocaleDateString()
}

// Get order status badge class
const getOrderStatusClass = (status: string) => {
  const statusMap: Record<string, string> = {
    'pending': 'bg-warning text-dark',
    'processing': 'bg-info text-white',
    'shipped': 'bg-primary text-white',
    'delivered': 'bg-success text-white',
    'cancelled': 'bg-danger text-white'
  }
  return statusMap[status?.toLowerCase()] || 'bg-secondary text-white'
}
</script>

<style scoped lang="scss">
.activity-container {
  .content-title {
    color: var(--text-primary);
  }
}

// Compact card design
.activity-card {
  background: var(--surface-primary);
  border-radius: 12px;
  border: 1px solid var(--border-default);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: var(--color-primary-light);
  }

  .activity-card-header {
    display: flex;
    align-items: center;
    padding: 1rem 1.25rem;
    background: var(--surface-muted);
    border-bottom: 1px solid var(--border-default);

    h6 {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.95rem;
    }
  }

  .activity-card-body {
    padding: 1rem;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}

// Compact activity list items
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.activity-item-compact {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--surface-muted);
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--background-hover);
    transform: translateX(2px);
  }

  .activity-item-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface-primary);
    border-radius: 6px;
    flex-shrink: 0;
  }

  .activity-item-content {
    flex: 1;
    min-width: 0; // Enable text truncation

    .activity-item-title {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .activity-item-meta {
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);

      .badge-sm {
        padding: 0.15rem 0.5rem;
        font-size: 0.7rem;
      }
    }
  }

  .activity-item-value {
    font-weight: 600;
    color: var(--accent-primary);
    font-size: 0.9rem;
    flex-shrink: 0;
  }
}

// View all link
.activity-view-all {
  display: block;
  text-align: center;
  padding: 0.5rem;
  color: var(--accent-primary);
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s ease;
  margin-top: auto;

  &:hover {
    background: var(--surface-muted);
    color: var(--color-primary-dark);
  }
}

// Recently viewed products mini grid
.recent-products-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.recent-product-mini {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--surface-muted);
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;

  &:hover {
    background: var(--background-hover);
    transform: scale(1.02);
  }

  .recent-product-mini-img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 6px;
    flex-shrink: 0;
  }

  .recent-product-mini-info {
    flex: 1;
    min-width: 0;

    .recent-product-mini-name {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.85rem;
      margin-bottom: 0.25rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.2;
    }

    .recent-product-mini-price {
      font-size: 0.85rem;
      color: var(--accent-primary);
      font-weight: 600;
    }
  }
}

// Badge styles
.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

// Order status badge colors
.bg-warning {
  background-color: #ffc107 !important;
}

.bg-info {
  background-color: #17a2b8 !important;
}

.bg-primary {
  background-color: var(--accent-primary) !important;
}

.bg-success {
  background-color: #28a745 !important;
}

.bg-danger {
  background-color: #dc3545 !important;
}

.bg-secondary {
  background-color: #6c757d !important;
}

.text-dark {
  color: #212529 !important;
}

.text-white {
  color: #ffffff !important;
}

// Responsive adjustments
@media (max-width: 991px) {
  .activity-card {
    margin-bottom: 1rem;
  }

  .recent-products-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 575px) {
  .activity-item-compact {
    .activity-item-content {
      .activity-item-title {
        font-size: 0.85rem;
      }

      .activity-item-meta {
        flex-wrap: wrap;
      }
    }

    .activity-item-value {
      font-size: 0.85rem;
    }
  }
}
</style>
