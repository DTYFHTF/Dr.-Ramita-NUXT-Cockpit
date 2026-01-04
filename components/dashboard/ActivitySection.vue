<template>
  <div class="activity-container">
    <h3 class="content-title mb-4">Recent Activity</h3>
    
    <!-- Recent Orders -->
    <div class="activity-section mb-4">
      <div class="activity-header d-flex align-items-center mb-3">
        <LucideIcon icon="mdi:package-variant" class="me-2 text-primary" />
        <h5 class="mb-0">Recent Orders</h5>
      </div>
      <div v-if="orders && orders.length > 0" class="activity-list">
        <div v-for="order in orders.slice(0, 5)" :key="order.id" class="activity-item">
          <div class="activity-icon">
            <LucideIcon icon="mdi:receipt" class="text-success" />
          </div>
          <div class="activity-content">
            <div class="activity-title">Order #{{ order.id }}</div>
            <div class="activity-meta">
              <span class="badge" :class="getOrderStatusClass(order.status)">{{ order.status }}</span>
              <span class="text-muted ms-2">{{ formatDate(order.created_at) }}</span>
            </div>
            <div class="activity-detail text-muted">₹{{ order.total?.toFixed(2) }}</div>
          </div>
          <NuxtLink to="/dashboard?tab=orders" class="btn btn-sm btn-outline">
            View
          </NuxtLink>
        </div>
      </div>
      <div v-else class="text-muted text-center py-3">
        No orders yet
      </div>
    </div>

    <!-- Recently Viewed Products -->
    <div class="activity-section mb-4">
      <div class="activity-header d-flex align-items-center mb-3">
        <LucideIcon icon="mdi:eye" class="me-2 text-primary" />
        <h5 class="mb-0">Recently Viewed Products</h5>
        <NuxtLink v-if="recentlyViewed.length > 0" to="/products" class="btn btn-sm btn-outline ms-auto">
          View All
        </NuxtLink>
      </div>
      <div v-if="recentlyViewed.length > 0" class="row g-3">
        <div v-for="product in recentlyViewed" :key="product.id" class="col-md-4 col-sm-6">
          <NuxtLink :to="`/products/${product.slug}`" class="recent-product-card">
            <img :src="getImageUrl(product.image)" :alt="product.name" class="recent-product-img" />
            <div class="recent-product-info">
              <div class="recent-product-name">{{ product.name }}</div>
              <div class="recent-product-price text-success fw-bold">₹{{ product.price }}</div>
              <div class="recent-product-time text-muted small">{{ product.viewedAt }}</div>
            </div>
          </NuxtLink>
        </div>
      </div>
      <div v-else class="text-muted text-center py-3">
        No products viewed recently
      </div>
    </div>

    <!-- Wishlist Activity -->
    <div class="activity-section mb-4">
      <div class="activity-header d-flex align-items-center mb-3">
        <LucideIcon icon="mdi:heart" class="me-2 text-primary" />
        <h5 class="mb-0">Wishlist Activity</h5>
      </div>
      <div v-if="wishlist && wishlist.length > 0" class="activity-list">
        <div v-for="item in wishlist.slice(0, 5)" :key="item.id" class="activity-item">
          <div class="activity-icon">
            <LucideIcon icon="mdi:heart" class="text-danger" />
          </div>
          <div class="activity-content">
            <div class="activity-title">{{ item.product?.name || 'Product' }}</div>
            <div class="activity-meta text-muted">In your wishlist</div>
            <div v-if="item.product?.price" class="activity-detail text-success fw-bold">₹{{ item.product.display_price || item.product.price }}</div>
          </div>
          <NuxtLink to="/dashboard?tab=wishlist" class="btn btn-sm btn-outline">
            View All
          </NuxtLink>
        </div>
      </div>
      <div v-else class="text-muted text-center py-3">
        No items in wishlist
      </div>
    </div>

    <!-- Recent Course/Event Registrations -->
    <div class="activity-section">
      <div class="activity-header d-flex align-items-center mb-3">
        <LucideIcon icon="mdi:calendar-check" class="me-2 text-primary" />
        <h5 class="mb-0">Recent Registrations</h5>
      </div>
      <div v-if="registrations && registrations.length > 0" class="activity-list">
        <div v-for="reg in registrations" :key="reg.id" class="activity-item">
          <div class="activity-icon">
            <LucideIcon :icon="reg.type === 'course' ? 'mdi:school' : 'mdi:calendar-star'" class="text-info" />
          </div>
          <div class="activity-content">
            <div class="activity-title">{{ reg.title || reg.name }}</div>
            <div class="activity-meta">
              <span class="badge bg-info text-white">{{ reg.type || 'course' }}</span>
              <span class="text-muted ms-2">{{ formatDate(reg.registered_at || reg.created_at) }}</span>
            </div>
          </div>
          <NuxtLink :to="`/dashboard?tab=${reg.type}s`" class="btn btn-sm btn-outline">
            View
          </NuxtLink>
        </div>
      </div>
      <div v-else class="text-muted text-center py-3">
        No recent registrations
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

// Wishlist from store
const wishlist = computed(() => wishlistStore.wishlist || [])

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
// Activity section styles
.activity-section {
  background: var(--background-white);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);

  .activity-header {
    h5 {
      color: var(--text-primary);
      font-weight: 600;
    }
  }

  // Empty state styling
  .text-center {
    color: var(--text-secondary);
  }
}

.activity-container {
  .content-title {
    color: var(--text-primary);
  }
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--background-white);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transform: translateX(4px);
  }

  .activity-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--background-light);
    border-radius: 50%;
    flex-shrink: 0;
  }

  .activity-content {
    flex: 1;

    .activity-title {
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }

    .activity-meta {
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
    }

    .activity-detail {
      font-size: 0.9rem;
      margin-top: 0.25rem;
      color: var(--text-secondary);
    }
  }
}

.recent-product-card {
  display: block;
  background: var(--background-white);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  .recent-product-img {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }

  .recent-product-info {
    padding: 1rem;

    .recent-product-name {
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .recent-product-price {
      font-size: 1.1rem;
      margin-bottom: 0.25rem;
      color: var(--color-primary);
      font-weight: 600;
    }

    .recent-product-time {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }
  }
}
</style>
