<template>
  <div class="checkout-page container py-5">
    <h1 class="mb-4 text-center">Checkout</h1>
    <div v-if="orderSuccess">
      <div class="alert alert-success text-center p-4 rounded-4 shadow-sm">
        <LucideIcon icon="mdi:check-circle" class="me-2 text-success" size="2em" />
        <h4 class="mb-2">Thank you for your order!</h4>
        <p>Your order has been placed successfully.</p>
        <div class="order-summary mt-4 mx-auto" style="max-width: 500px;">
          <h5 class="fw-semibold mb-3">Order Summary</h5>
          <div class="mb-2">Order ID: <span class="fw-semibold">{{ orderData?.id }}</span></div>
          <div class="mb-2">Status: <span class="badge bg-info">{{ orderData?.status }}</span></div>
          <div class="mb-2">Order Date: <span class="fw-semibold">{{ orderData?.created_at ? new Date(orderData.created_at).toLocaleString() : '' }}</span></div>
          <ul class="list-group mb-3">
            <li v-for="item in orderData?.cart" :key="`${item.product_id}:${item.variation_id}`" class="list-group-item d-flex justify-content-between align-items-center">
              <span>
                {{ item.name }}<span v-if="item.variation_name"> - {{ item.variation_name }}</span>
                <span class="text-muted small ms-2">x{{ item.quantity }}</span>
              </span>
              <span class="fw-semibold">₹{{ item.price * item.quantity }}</span>
            </li>
          </ul>
          <div class="mb-2">Shipping: <span class="fw-semibold">₹{{ orderData?.shipping_cost }}</span></div>
          <div class="mb-2">Estimated Delivery: <span class="fw-semibold">{{ orderData?.estimated_delivery }}</span></div>
          <div class="h5 mt-3">Total: <span class="fw-bold text-success">₹{{ orderData?.total }}</span></div>
          <div class="mt-4 p-3 bg-light rounded-3">
            <h6 class="fw-semibold mb-2">Shipping Details</h6>
            <div v-if="orderData?.shipping">
              <div>{{ orderData.shipping.name }}</div>
              <div>{{ orderData.shipping.address }}</div>
              <div>{{ orderData.shipping.city }}, {{ orderData.shipping.state }} {{ orderData.shipping.zip }}</div>
              <div>{{ orderData.shipping.country }}</div>
              <div>Phone: {{ orderData.shipping.phone }}</div>
              <div>Email: {{ orderData.shipping.email }}</div>
            </div>
          </div>
        </div>
        <router-link to="/" class="btn btn-primary mt-4 px-4 py-2">Continue Shopping</router-link>
      </div>
    </div>
    <div v-else>
      <div v-if="errorMessage" class="alert alert-danger text-center">{{ errorMessage }}</div>
      <div class="row g-5 align-items-start">
        <div class="col-lg-7">
          <form @submit.prevent="submitOrder" novalidate class="p-4 rounded-4 shadow-sm bg-white">
            <h4 class="mb-4 fw-semibold border-bottom pb-2">Shipping & Contact Information</h4>
            <div class="row mb-3">
              <div class="col-md-6 mb-3">
                <label class="form-label">Full Name</label>
                <input v-model="shipping.name" type="text" class="form-control form-control-lg" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Phone</label>
                <input v-model="shipping.phone" type="tel" class="form-control form-control-lg" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Email</label>
                <input v-model="shipping.email" type="email" class="form-control form-control-lg" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">City</label>
                <input v-model="shipping.city" type="text" class="form-control form-control-lg" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">State</label>
                <input v-model="shipping.state" type="text" class="form-control form-control-lg" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Zip Code</label>
                <input v-model="shipping.zip" type="text" class="form-control form-control-lg" required />
              </div>
              <div class="col-md-12 mb-3">
                <label class="form-label">Address</label>
                <input v-model="shipping.address" type="text" class="form-control form-control-lg" required />
              </div>
              <div class="col-md-12 mb-3">
                <label class="form-label">Country</label>
                <input v-model="shipping.country" type="text" class="form-control form-control-lg" required />
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Special Instructions (optional)</label>
              <textarea v-model="specialInstructions" class="form-control form-control-lg" rows="2" placeholder="Any notes for delivery?"></textarea>
            </div>
            <h4 class="mb-3 fw-semibold border-bottom pb-2">Payment Method</h4>
            <div class="mb-3">
              <div class="form-check form-check-lg mb-2" v-for="method in paymentMethods" :key="method.value">
                <input class="form-check-input" type="radio" :id="method.value" :value="method.value" v-model="paymentMethod" required />
                <label class="form-check-label" :for="method.value">
                  {{ method.label }}
                </label>
              </div>
            </div>
            <div v-if="paymentMethod !== 'cod'" class="alert alert-info mb-3">
              <strong>Note:</strong> Payment will be handled via a secure payment gateway after you review your order.
            </div>
            <div class="d-flex gap-3 mt-4 justify-content-end">
              <router-link to="/cartpage" class="btn btn-smooth-outline px-4 py-2">Back to Cart</router-link>
              <button type="submit" class="btn btn-smooth-success px-4 py-2" :disabled="isSubmitting">
                <span v-if="isSubmitting"><span class="spinner-border spinner-border-sm me-2"></span>Placing Order...</span>
                <span v-else>Review & Confirm</span>
              </button>
            </div>
          </form>
        </div>
        <div class="col-lg-5">
          <div class="card shadow-sm sticky-top" style="top: 2rem;">
            <div class="card-body">
              <h5 class="card-title mb-3 fw-semibold">Order Summary</h5>
              <ul class="list-group mb-3">
                <li v-for="item in cart" :key="`${item.product_id}:${item.variation_id}`" class="list-group-item d-flex justify-content-between align-items-center">
                  <span>
                    {{ item.name }}<span v-if="item.variation_name"> - {{ item.variation_name }}</span>
                    <span class="text-muted small ms-2">x{{ item.quantity }}</span>
                  </span>
                  <span class="fw-semibold">₹{{ item.price * item.quantity }}</span>
                </li>
              </ul>
              <div class="mb-2">Shipping: <span class="fw-semibold">₹{{ shippingCost }}</span></div>
              <div class="mb-2">Estimated Delivery: <span class="fw-semibold">{{ estimatedDelivery }}</span></div>
              <div class="h5 mt-3">Total: <span class="fw-bold text-success">₹{{ totalPrice + shippingCost }}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCart } from '@/composables/useCart';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import type { Order, OrderItem, ShippingInfo, PaymentMethod } from '@/types';
import LucideIcon from '@/components/LucideIcon.vue';

const cartStore = useCart();
const { cart, totalPrice } = cartStore;
const router = useRouter();
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;
const userStore = useUserStore();

const shipping = ref<ShippingInfo>({
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: ''
});
const specialInstructions = ref('');
const paymentMethod = ref<PaymentMethod>('cod');
const paymentMethods = [
  { value: 'cod', label: 'Cash on Delivery' },
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'upi', label: 'UPI' },
  { value: 'paypal', label: 'PayPal' }
];
const shippingCost = 50;
const estimatedDelivery = '3-7 business days';

const orderSuccess = ref(false);
const orderData = ref<Order | null>(null);
const isSubmitting = ref(false);
const errorMessage = ref('');

const validateForm = () => {
  // Basic validation for required fields
  for (const key in shipping.value) {
    if (!shipping.value[key as keyof ShippingInfo]) return false;
  }
  if (!paymentMethod.value) return false;
  return true;
};

const submitOrder = async () => {
  if (!validateForm()) {
    errorMessage.value = 'Please fill all required fields.';
    return;
  }
  isSubmitting.value = true;
  errorMessage.value = '';
  const payload = {
    shipping: shipping.value,
    payment_method: paymentMethod.value,
    cart: cart.map((item) => ({
      product_id: item.product_id,
      variation_id: item.variation_id,
      quantity: item.quantity
    })),
    shipping_cost: shippingCost,
    estimated_delivery: estimatedDelivery,
    special_instructions: specialInstructions.value
  };
  try {
    const response = await $fetch<{ order: Order }>(`${apiBase}/orders`, {
      method: 'POST',
      body: payload,
      headers: { Authorization: `Bearer ${userStore.token}` }
    });
    orderData.value = response.order;
    orderSuccess.value = true;
    cartStore.clearCart();
  } catch (e: any) {
    errorMessage.value = e?.data?.message || e?.message || 'Failed to place order.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.checkout-page {
  max-width: 1100px;
}
.order-summary ul {
  margin-bottom: 0;
}
.card, .alert {
  border-radius: 1rem;
}
.form-control-lg {
  min-height: 2.5rem;
  font-size: 1.1rem;
}
.form-check-lg .form-check-input {
  width: 1.3em;
  height: 1.3em;
}
.form-check-lg .form-check-label {
  font-size: 1.1rem;
  margin-left: 0.5em;
}
</style>
