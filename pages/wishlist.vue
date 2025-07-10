<template>
  <div class="wishlist-page">
    <div class="container py-4">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="page-title">My Wishlist</h1>
            <div class="wishlist-stats">
              <span class="badge bg-primary">{{ totalItems }} items</span>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading wishlist...</span>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="wishlist.length === 0" class="empty-wishlist text-center py-5">
            <div class="empty-icon mb-3">
              <LucideIcon icon="mdi:heart-outline" size="4rem" color="#6c757d" />
            </div>
            <h3 class="text-muted mb-3">Your wishlist is empty</h3>
            <p class="text-muted mb-4">
              Browse our products and add your favorites to your wishlist!
            </p>
            <NuxtLink to="/products" class="btn btn-primary btn-lg">
              <LucideIcon icon="mdi:shopping" class="me-2" />
              Start Shopping
            </NuxtLink>
          </div>

          <!-- Wishlist Items -->
          <div v-else>
            <div class="row">
              <!-- Action Bar -->
              <div class="col-12 mb-3">
                <div class="d-flex justify-content-between align-items-center wishlist-actions">
                  <span class="text-muted">{{ totalItems }} product{{ totalItems !== 1 ? 's' : '' }} in your wishlist</span>
                  <button 
                    @click="confirmClearWishlist" 
                    class="btn btn-outline-danger btn-sm"
                    v-if="totalItems > 0"
                  >
                    <LucideIcon icon="mdi:delete-outline" class="me-1" />
                    Clear All
                  </button>
                </div>
              </div>

              <!-- Wishlist Grid -->
              <div class="col-12">
                <div class="row g-4">
                  <div 
                    v-for="item in wishlist" 
                    :key="item.id" 
                    class="col-12 col-sm-6 col-lg-4 col-xl-3"
                  >
                    <ProductCard :product="item.product" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal for Clear All -->
    <div v-if="showClearConfirm" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Clear Wishlist</h5>
            <button type="button" class="btn-close" @click="showClearConfirm = false"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to remove all items from your wishlist? This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showClearConfirm = false">
              Cancel
            </button>
            <button type="button" class="btn btn-danger" @click="handleClearWishlist">
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <div v-if="showToast" class="toast-message">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useWishlist } from '@/composables/useWishlist'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import LucideIcon from '@/components/LucideIcon.vue'
import ProductCard from '@/components/ProductCard.vue'

// Meta
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: 'My Wishlist',
  meta: [
    { name: 'description', content: 'Your favorite products saved for later' }
  ]
})

// Stores and composables
const wishlistStore = useWishlist()
const userStore = useUserStore()

// Reactive state
const { wishlist, totalItems } = storeToRefs(wishlistStore)
const loading = ref(false)
const showClearConfirm = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

// Methods
const handleRemoveFromWishlist = async (productId: number) => {
  try {
    await wishlistStore.removeFromWishlist(productId)
    showToastMessage('Product removed from wishlist')
  } catch (error) {
    showToastMessage('Failed to remove product from wishlist', 'error')
  }
}

const confirmClearWishlist = () => {
  showClearConfirm.value = true
}

const handleClearWishlist = async () => {
  try {
    await wishlistStore.clearWishlist()
    showClearConfirm.value = false
    showToastMessage('Wishlist cleared successfully')
  } catch (error) {
    showToastMessage('Failed to clear wishlist', 'error')
  }
}

const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Lifecycle
onMounted(async () => {
  loading.value = true
  try {
    await wishlistStore.fetchWishlist()
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/scss/variables.scss';

.wishlist-page {
  background-color: $background-light;
  min-height: 100vh;
}

.page-title {
  color: $text-primary;
  font-weight: 600;
  margin: 0;
}

.wishlist-stats .badge {
  font-size: 0.875rem;
}

.empty-wishlist {
  padding: 4rem 2rem;
  
  .empty-icon {
    opacity: 0.5;
  }
}

.wishlist-actions {
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: $card-shadow;
  border: 1px solid $border-color;
}

.toast-message {
  position: fixed;
  top: 20px;
  right: 20px;
  background: $color-secondary;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  animation: slideInRight 0.3s ease;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.modal {
  z-index: 2000;
}

// Responsive design
@media (max-width: 768px) {
  .wishlist-actions {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .empty-wishlist {
    padding: 2rem 1rem;
  }
}
</style>
