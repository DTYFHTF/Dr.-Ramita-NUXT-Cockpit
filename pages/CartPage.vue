<template>
  <div class="container py-4">
    <h1 class="mb-4">Your Cart</h1>
    
    <div v-if="cart.length === 0" class="alert alert-info">
      Your cart is empty. Start shopping!
    </div>

    <div v-else>
      <div class="row g-4">
        <div class="col-12 col-lg-8">
          <div class="card">
            <div class="card-body">
              <div v-for="item in cart" :key="item.id" class="cart-item d-flex gap-3 mb-4 pb-4 border-bottom">
                <img :src="item.image" alt="" class="rounded" style="width: 100px; height: 100px; object-fit: cover;">
                <div class="flex-grow-1">
                  <h5 class="mb-2">{{ item.name }}</h5>
                  <p class="text-muted mb-2">₹{{ item.price }} each</p>
                  <div class="d-flex align-items-center gap-3">
                    <div class="input-group" style="max-width: 120px;">
                      <button 
                        class="btn btn-outline-secondary" 
                        @click="updateQuantity(item.slug, item.quantity - 1)"
                        :disabled="item.quantity <= 1"
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        class="form-control text-center" 
                        v-model.number="item.quantity"
                        min="1"
                        @change="updateQuantity(item.slug, item.quantity)"
                      >
                      <button 
                        class="btn btn-outline-secondary" 
                        @click="updateQuantity(item.slug, item.quantity + 1)"
                        :disabled="item.quantity >= item.stock"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      class="btn btn-link text-danger"
                      @click="removeFromCart(item.slug)"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div class="text-end">
                  <div class="h5">₹{{ (item.price * item.quantity).toFixed(2) }}</div>
                  <small class="text-muted">Stock: {{ item.stock }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title mb-4">Order Summary</h5>
              <dl class="row">
                <dt class="col-6">Total Items:</dt>
                <dd class="col-6 text-end">{{ totalItems }}</dd>
                
                <dt class="col-6">Total Price:</dt>
                <dd class="col-6 text-end h5 text-primary">₹{{ totalPrice.toFixed(2) }}</dd>
              </dl>
              <router-link to="/checkout" class="btn btn-primary w-100">
                Proceed to Checkout
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCart } from '@/composables/useCart';

const {
  cart,
  totalItems,
  totalPrice,
  updateQuantity,
  removeFromCart
} = useCart();
</script>