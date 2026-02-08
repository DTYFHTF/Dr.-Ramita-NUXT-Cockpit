<template>
  <div class="dropdown cart-dropdown" @mouseenter="isDropdownOpen = true" @mouseleave="isDropdownOpen = false">
    <button
      class="btn btn-link nav-shared-link d-flex flex-column align-items-center p-0 position-relative"
      type="button"
      id="cartDropdown"
      aria-expanded="false"
      tabindex="0"
      title="Cart"
      @click="isDropdownOpen = !isDropdownOpen"
    >
      <span class="icon-badge-wrapper position-relative d-inline-block">
        <LucideIcon icon="mdi:cart" class="fs-4" />
        <span v-if="totalItems > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          {{ totalItems }}
        </span>
      </span>
    </button>
    
    <transition name="fade">
      <div
        v-show="isDropdownOpen"
        class="dropdown-menu cart-dropdown-menu show"
        aria-labelledby="cartDropdown" 
        @mouseenter="isDropdownOpen = true"
        @mouseleave="isDropdownOpen = false"
        style="right:0; left:auto; top:100%; position:absolute; min-width: 350px; max-width: 400px;"
      >
        <!-- Empty Cart State -->
        <div v-if="!cart || cart.length === 0" class="p-4 text-center">
          <LucideIcon icon="mdi:cart-outline" class="fs-1 text-muted mb-2" />
          <p class="text-muted mb-3">Your cart is empty</p>
          <NuxtLink to="/products" class="btn btn-smooth-primary btn-sm" @click="isDropdownOpen = false">
            Browse Products
          </NuxtLink>
        </div>

        <!-- Cart Items -->
        <div v-else class="cart-items-container">
          <!-- Cart Header -->
          <div class="cart-header px-3 py-2 border-bottom">
            <h6 class="mb-0 fw-semibold">Cart ({{ totalItems }})</h6>
          </div>

          <!-- Scrollable Items List -->
          <div class="cart-items-list" style="max-height: 300px; overflow-y: auto;">
            <div
              v-for="item in cart"
              :key="`${item.product_id}-${item.variation_id}`"
              class="cart-item d-flex gap-2 p-3 border-bottom"
            >
              <!-- Product Image -->
              <div class="cart-item-image flex-shrink-0">
                <img 
                  :src="getImageUrl(item.image)" 
                  :alt="item.name"
                  class="rounded"
                  style="width: 60px; height: 60px; object-fit: cover;"
                  @error="(e) => handleImageError(e)"
                />
              </div>

              <!-- Product Details -->
              <div class="cart-item-details flex-grow-1">
                <NuxtLink 
                  :to="`/products/${item.product_id}`" 
                  class="text-decoration-none text-dark" 
                  target="_blank"
                  @click="isDropdownOpen = false"
                >
                  <h6 class="mb-1 fs-6 hover-underline">{{ item.name }}</h6>
                </NuxtLink>
                <p v-if="item.variation_name" class="mb-1 small text-muted">
                  {{ item.variation_name }}
                </p>
                <div class="d-flex align-items-center gap-2 mb-1">
                  <span class="fw-semibold text-success">₹{{ item.price }}</span>
                  <span class="text-muted small">× {{ item.quantity }}</span>
                </div>
                
                <!-- Quantity Controls -->
                <div class="d-flex align-items-center gap-2">
                  <div class="btn-group btn-group-sm" role="group">
                    <button 
                      @click="decrementQuantity(item)" 
                      class="btn btn-outline-secondary"
                      :disabled="item.quantity <= 1"
                    >
                      <LucideIcon icon="mdi:minus" />
                    </button>
                    <span class="btn btn-outline-secondary disabled">{{ item.quantity }}</span>
                    <button 
                      @click="incrementQuantity(item)" 
                      class="btn btn-outline-secondary"
                      :disabled="item.quantity >= item.stock"
                    >
                      <LucideIcon icon="mdi:plus" />
                    </button>
                  </div>
                  <button 
                    @click="removeItem(item)" 
                    class="btn btn-link btn-sm text-danger p-0 ms-auto"
                    title="Remove"
                  >
                    <LucideIcon icon="mdi:trash-can-outline" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Cart Footer -->
          <div class="cart-footer p-3 border-top">
            <div class="d-flex justify-content-between mb-3">
              <span class="fw-semibold">Subtotal:</span>
              <span class="fw-bold fs-5 text-success">₹{{ totalPrice.toFixed(2) }}</span>
            </div>
            
            <div class="d-grid gap-2">
              <NuxtLink 
                to="/checkout" 
                class="btn btn-smooth-primary w-100"
                @click="isDropdownOpen = false"
              >
                <LucideIcon icon="mdi:cart-arrow-right" class="me-2" />
                Proceed to Checkout
              </NuxtLink>
              <NuxtLink 
                to="/cartpage" 
                class="btn btn-outline-secondary w-100"
                @click="isDropdownOpen = false"
              >
                View Full Cart
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from '@/stores/cart';
import { storeToRefs } from 'pinia';
import LucideIcon from '@/components/LucideIcon.vue';

const cartStore = useCartStore();
const { cart, totalItems, totalPrice } = storeToRefs(cartStore);
const isDropdownOpen = ref(false);
const { getImageUrl, handleImageError } = useImageUrl();

const incrementQuantity = async (item: any) => {
  try {
    await cartStore.updateQuantity(
      item.product_id, 
      item.variation_id, 
      item.quantity + 1
    );
  } catch (error) {
    console.error('Failed to update quantity:', error);
  }
};

const decrementQuantity = async (item: any) => {
  try {
    if (item.quantity > 1) {
      await cartStore.updateQuantity(
        item.product_id, 
        item.variation_id, 
        item.quantity - 1
      );
    }
  } catch (error) {
    console.error('Failed to update quantity:', error);
  }
};

const removeItem = async (item: any) => {
  try {
    await cartStore.removeFromCart(item.product_id, item.variation_id);
  } catch (error) {
    console.error('Failed to remove item:', error);
  }
};
</script>

<style lang="scss" scoped>
.cart-dropdown {
  position: relative;
  
  .icon-badge-wrapper {
    min-width: 24px;
    min-height: 24px;
  }
}

.cart-dropdown-menu {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  overflow: hidden;
  background: var(--surface-base);
  color: var(--text-primary);
  
  &.show {
    display: block;
  }
}

.cart-header {
  background: var(--surface-muted);
  
  h6 {
    color: var(--text-primary);
    font-weight: 600;
  }
}

.cart-items-list {
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--surface-subtle);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--border-emphasis);
    border-radius: 3px;
    
    &:hover {
      background: var(--border-strong);
    }
  }
}

.cart-item {
  transition: background-color 0.2s ease;
  background: var(--surface-base);
  
  &:hover {
    background: var(--surface-muted);
  }
  
  .cart-item-image img {
    border: 1px solid var(--border-default);
  }

  .hover-underline:hover {
    text-decoration: underline !important;
  }

  .btn-outline-secondary {
    color: var(--text-primary);
    border-color: var(--border-default);
    background: transparent;
  }

  .btn-outline-secondary:hover {
    background: var(--surface-subtle);
    color: var(--text-primary);
  }

  .btn-outline-secondary:disabled,
  .btn-outline-secondary.disabled {
    color: var(--text-secondary);
    opacity: 0.65;
  }
}

.cart-footer {
  background: var(--surface-base);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// Dark mode styles are now handled by semantic tokens
// No need for explicit [data-bs-theme="dark"] overrides

</style>
