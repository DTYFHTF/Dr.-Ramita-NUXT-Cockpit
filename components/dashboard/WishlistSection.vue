 <template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading wishlist...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="wishlist.length === 0" class="empty-wishlist text-center py-5">
      <div class="empty-icon mb-3">
        <LucideIcon icon="mdi:heart-outline" size="4rem" color="var(--text-muted)" />
      </div>
      <h5 class="text-muted mb-3">Your wishlist is empty</h5>
      <p class="text-muted mb-4">
        Browse our products and add your favorites to your wishlist!
      </p>
      <NuxtLink to="/products" class="btn btn-smooth-success">
        <LucideIcon icon="mdi:shopping" class="me-2" />
        Start Shopping
      </NuxtLink>
    </div>

    <!-- Wishlist Items -->
    <div v-else>
      <!-- Action Bar -->
      <div class="d-flex justify-content-between align-items-center wishlist-actions mb-3">
        <span class="text-muted">{{ totalItems }} product{{ totalItems !== 1 ? 's' : '' }} in your wishlist</span>
        <button 
          @click="confirmClearWishlist" 
          class="btn btn-smooth-outline btn-sm"
          v-if="totalItems > 0"
        >
          <LucideIcon icon="mdi:delete-outline" class="me-1" />
          Clear All
        </button>
      </div>

      <!-- Products Grid -->
      <div class="row">
        <div v-for="item in wishlist" :key="item.id" class="col-lg-4 col-md-6 col-sm-12 mb-4">
          <ProductCard 
            :product="item.product"
          />
        </div>
      </div>
    </div>

    <!-- Clear All Confirmation Modal -->
    <div v-if="showClearConfirm" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
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
            <button type="button" class="btn btn-secondary" @click="showClearConfirm = false">Cancel</button>
            <button type="button" class="btn btn-danger" @click="handleClearWishlist">Clear All</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="showToast" class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
      <div class="toast show" role="alert">
        <div class="toast-body">
          {{ toastMessage }}
          <button type="button" class="btn-close float-end" @click="showToast = false"></button>
        </div>
      </div>
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

const showToastMessage = (message: string, type: string = 'success') => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Load wishlist on mount
onMounted(async () => {
  loading.value = true
  try {
    // Force refresh wishlist data to ensure updated product pricing
    await wishlistStore.refreshWishlist()
  } catch (error) {
    showToastMessage('Failed to load wishlist', 'error')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.wishlist-actions {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-light);
}

.empty-wishlist {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.modal {
  z-index: 2000;
}

.toast {
  min-width: 250px;
}
</style>
