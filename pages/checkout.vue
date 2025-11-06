<template>
  <div class="checkout-page container py-5">
    <div v-if="!orderSuccess" class="checkout-header text-center mb-5">
      <h1 class="checkout-title">Checkout</h1>
      <p class="checkout-subtitle text-muted">Complete your order in just a few steps</p>
    </div>
    <div v-if="orderSuccess && orderData">
      <OrderConfirmation :orderData="orderData" />
    </div>
    <div v-else>
      <div v-if="errorMessage" class="error-alert">
        <LucideIcon icon="mdi:alert-circle" class="me-2" />
        {{ errorMessage }}
      </div>
      
      <div class="checkout-content">
        <div class="checkout-form">
          <form @submit.prevent="submitOrder" novalidate class="form-container">
            <div class="form-section">
              <div class="section-header">
                <LucideIcon icon="mdi:truck" class="section-icon" />
                <h3 class="section-title">Delivery Information</h3>
              </div>
              
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Full Name <span class="required">*</span></label>
                  <input v-model="shipping.name" type="text" class="form-input" required placeholder="Enter your full name" />
                </div>
                <div class="form-group">
                  <label class="form-label">Mobile Number <span class="required">*</span></label>
                  <input v-model="shipping.phone" type="tel" class="form-input" required placeholder="+91 00000 00000" />
                </div>
                <div class="form-group">
                  <label class="form-label">Pin Code <span class="required">*</span></label>
                  <input v-model="shipping.pincode" type="text" class="form-input" required placeholder="000000" />
                </div>
                <div class="form-group">
                  <label class="form-label">Address <span class="required">*</span></label>
                  <input v-model="shipping.address" type="text" class="form-input" required placeholder="Flat, House no., Building" />
                </div>
                <div class="form-group">
                  <label class="form-label">Area <span class="required">*</span></label>
                  <input v-model="shipping.area" type="text" class="form-input" required placeholder="Area, Street, Sector" />
                </div>
                <div class="form-group">
                  <label class="form-label">Landmark <span class="required">*</span></label>
                  <input v-model="shipping.landmark" type="text" class="form-input" placeholder="Nearby landmark" required />
                </div>
                <div class="form-group">
                  <label class="form-label">City <span class="required">*</span></label>
                  <input v-model="shipping.city" type="text" class="form-input" required placeholder="Your city" />
                </div>
                <div class="form-group">
                  <label class="form-label">State <span class="required">*</span></label>
                  <input v-model="shipping.state" type="text" class="form-input" required placeholder="Your state" />
                </div>
                <div class="form-group full-width mb-4">
                  <label class="form-label">Country <span class="required">*</span></label>
                  <input v-model="shipping.country" type="text" class="form-input" required placeholder="India" />
                </div>
              </div>
              
              <div class="form-group mt-4">
                <label class="form-label">Special Instructions</label>
                <textarea v-model="specialInstructions" class="form-textarea" rows="3" placeholder="Any special delivery instructions..."></textarea>
              </div>
            </div>

            <div class="form-section">
              <div class="section-header">
                <LucideIcon icon="mdi:credit-card" class="section-icon" />
                <h3 class="section-title">Payment Method</h3>
              </div>
              
              <div class="payment-options">
                <div v-for="method in paymentMethods" :key="method.value" class="payment-option">
                  <input class="payment-radio" type="radio" :id="method.value" :value="method.value" v-model="paymentMethod" required />
                  <label class="payment-label" :for="method.value">
                    <div class="payment-content">
                      <span class="payment-name">{{ method.label }}</span>
                      <LucideIcon v-if="method.value === 'cod'" icon="mdi:cash" class="payment-icon" />
                      <LucideIcon v-else-if="method.value === 'card'" icon="mdi:credit-card" class="payment-icon" />
                      <LucideIcon v-else-if="method.value === 'upi'" icon="mdi:cellphone" class="payment-icon" />
                      <LucideIcon v-else icon="mdi:paypal" class="payment-icon" />
                    </div>
                  </label>
                </div>
              </div>
              
              <div v-if="paymentMethod !== 'cod'" class="payment-info">
                <LucideIcon icon="mdi:information" class="me-2" />
                Payment will be processed securely after order confirmation.
              </div>
            </div>

            <div class="form-actions">
              <router-link to="/cartpage" class="btn btn-outline">
                <LucideIcon icon="mdi:arrow-left" class="me-2" />
                Back to Cart
              </router-link>
              <button type="submit" class="btn btn-smooth-success" :disabled="isSubmitting">
                <span v-if="isSubmitting">
                  <span class="spinner"></span>
                  Placing Order...
                </span>
                <span v-else>
                  <LucideIcon icon="mdi:check" class="me-2" />
                  Place Order
                </span>
              </button>
            </div>
          </form>
        </div>

        <div class="order-summary">
          <div class="summary-card">
            <div class="summary-header">
              <LucideIcon icon="mdi:receipt" class="summary-icon" />
              <h3 class="summary-title">Order Summary</h3>
            </div>
            
            <div class="summary-items">
              <div v-for="item in cart" :key="`${item.product_id}:${item.variation_id}`" class="summary-item">
                <div class="summary-item-image">
                  <img :src="getImageUrl(item.image)" :alt="item.name" class="summary-img" />
                </div>
                <div class="item-info">
                  <span class="item-name">{{ item.name }}</span>
                  <span v-if="item.variation_name" class="item-variant">{{ item.variation_name }}</span>
                  <span class="item-qty">× {{ item.quantity }}</span>
                </div>
                <span class="item-total">₹{{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
            
            <div class="summary-totals">
              <div class="total-row">
                <span>Shipping</span>
                <span>₹{{ orderData?.shipping_cost || shippingCost }}</span>
              </div>
              <div class="total-row">
                <span>Delivery</span>
                <span>{{ estimatedDelivery }}</span>
              </div>
              <div class="total-row final-total">
                <span>Total</span>
                <span>₹{{ ((orderData?.total) ? orderData.total : (totalPrice + (orderData?.shipping_cost || shippingCost))).toFixed(2) }}</span>
              </div>
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
import OrderConfirmation from '@/components/OrderConfirmation.vue';

const cartStore = useCart();
const { cart, totalPrice } = cartStore;
const router = useRouter();
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;
const baseUrl = config.public.baseUrl;
const userStore = useUserStore();
const { initiatePayment, verifyPayment } = useRazorpay();

// Helper function to get full image URL
const getImageUrl = (imagePath: string | null | undefined) => {
  if (!imagePath) return '/placeholder-product.jpg';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Construct full URL from base URL (ensure no double slashes)
  const base = baseUrl?.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${base}/storage/${imagePath}`;
};

const shipping = ref<ShippingInfo>({
  name: '',
  phone: '',
  pincode: '',
  address: '',
  area: '',
  landmark: '',
  city: '',
  state: '',
  country: ''
});
const specialInstructions = ref('');
const paymentMethod = ref<PaymentMethod>('cod');
const paymentMethods = [
  { value: 'cod', label: 'Cash on Delivery' },
  { value: 'card', label: 'Card / UPI / Wallet (via Razorpay)' },
  { value: 'upi', label: 'UPI (via Razorpay)' },
  { value: 'paypal', label: 'International Cards (Razorpay)' }
];
const shippingCost = 85;
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
  // Check if cart is empty
  if (!cart || cart.length === 0) {
    errorMessage.value = 'Your cart is empty. Please add items before checkout.';
    setTimeout(() => {
      router.push('/products');
    }, 2000);
    return;
  }

  if (!validateForm()) {
    errorMessage.value = 'Please fill all required fields.';
    return;
  }
  
  // Check if user is authenticated
  if (!userStore.token) {
    errorMessage.value = 'You must be logged in to place an order. Redirecting to login...';
    setTimeout(() => {
      router.push('/login');
    }, 2000);
    return;
  }
  
  isSubmitting.value = true;
  errorMessage.value = '';
  
  const payload = {
    shipping: shipping.value,
    payment_method: paymentMethod.value === 'cod' ? 'cod' : 'razorpay',
    cart: cart.map((item) => ({
      product_id: item.product_id,
      variation_id: item.variation_id,
      quantity: item.quantity,
      name: item.name,
      variation_name: item.variation_name,
      price: item.price,
      image: item.image
    })),
    special_instructions: specialInstructions.value
  };

  try {
    // Call the new payment endpoint instead of old orders endpoint
    const response = await $fetch<any>(`${apiBase}/payments/create-order`, {
      method: 'POST',
      body: payload,
      headers: { 
        Authorization: `Bearer ${userStore.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include' // CRITICAL: Include cookies for session/CSRF
    });

    if (response.payment_method === 'cod') {
      // COD order - directly show success
      orderData.value = response.order;
      orderSuccess.value = true;
      cartStore.clearCart();
    } else if (response.payment_method === 'razorpay') {
      // Razorpay payment - open payment modal
      initiatePayment(
        response,
        async (razorpayResponse: any) => {
          // Payment successful - verify on backend
          isSubmitting.value = true;
          const verificationResult = await verifyPayment(
            response.payment_id, // Use payment_id instead of order_id
            razorpayResponse,
            userStore.token || ''
          );

          if (verificationResult.success) {
            orderData.value = verificationResult.order;
            orderSuccess.value = true;
            cartStore.clearCart();
            isSubmitting.value = false;
          } else {
            errorMessage.value = verificationResult.error || 'Payment verification failed';
            isSubmitting.value = false;
          }
        },
        (error: any) => {
          // Payment failed or cancelled
          console.log('Payment cancelled or failed:', error);
          errorMessage.value = error?.message || 'Payment was cancelled. Your cart has been preserved - you can try again.';
          isSubmitting.value = false;
        }
      );
    }
  } catch (e: any) {
    console.error('Payment error:', e);
    
    // Provide detailed error messages
    if (e?.status === 401 || e?.status === 419) {
      errorMessage.value = 'Authentication failed. Please log in again.';
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else if (e?.status === 422) {
      // Show validation errors if available
      if (e?.data?.errors) {
        const errors = e.data.errors;
        const errorMessages = Object.keys(errors).map(key => `${key}: ${errors[key].join(', ')}`);
        errorMessage.value = 'Validation errors:\n' + errorMessages.join('\n');
        console.error('Validation errors:', errors);
      } else {
        errorMessage.value = e?.data?.message || 'Validation error. Please check your input.';
      }
    } else if (e?.status === 500) {
      // Show detailed error in development
      const errorDetail = e?.data?.error || e?.data?.message || 'Unknown error';
      const debugInfo = e?.data?.debug ? `\n\nDebug: ${e.data.debug.file}:${e.data.debug.line}` : '';
      errorMessage.value = `Server error: ${errorDetail}${debugInfo}`;
      console.error('Server error details:', e?.data);
    } else {
      errorMessage.value = e?.data?.error || e?.data?.message || e?.message || 'Failed to place order. Please try again.';
    }
    isSubmitting.value = false;
  } finally {
    if (paymentMethod.value === 'cod') {
      isSubmitting.value = false;
    }
    // For Razorpay, isSubmitting is managed in callbacks
  }
};
</script>

<style scoped>
/* Main Layout */
.checkout-page {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.checkout-header {
  margin-bottom: 3rem;
}

.checkout-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.checkout-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

/* Success Page */
.success-card {
  background: var(--background-white);
  border-radius: 20px;
  box-shadow: var(--card-shadow);
  padding: 3rem;
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.success-icon {
  margin-bottom: 1.5rem;
}

.success-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-success);
  margin-bottom: 1rem;
}

.success-message {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
}

.order-details {
  text-align: left;
  margin-bottom: 2rem;
}

.order-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--background-light);
  border-radius: 12px;
}

.order-info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.order-info-item .label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.order-info-item .value {
  font-weight: 600;
  color: var(--text-primary);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.order-items {
  margin-bottom: 2rem;
}

.items-list {
  background: var(--background-light);
  border-radius: 12px;
  padding: 1.5rem;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
  gap: 1rem;
}

.item-row:last-child {
  border-bottom: none;
}

.item-image {
  flex-shrink: 0;
}

.product-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.item-name {
  font-weight: 600;
  color: var(--text-primary);
}

.item-variation {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.item-quantity {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.item-price {
  font-weight: 600;
  color: var(--color-success);
}

.order-summary-final {
  background: var(--background-light);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
}

.total-row {
  border-top: 2px solid var(--border-color);
  padding-top: 1rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-success);
}

.shipping-info {
  margin-bottom: 2rem;
}

.address-details {
  background: var(--background-light);
  border-radius: 12px;
  padding: 1.5rem;
}

.recipient-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.address-line {
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.phone-number {
  color: var(--color-success);
  font-weight: 500;
  margin-top: 0.5rem;
}

.continue-shopping-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-success);
  color: var(--text-white);
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
}

.continue-shopping-btn:hover {
  background: var(--primary-dark);
  color: var(--text-white);
  transform: translateY(-1px);
}

/* Form Layout */
.checkout-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;
  align-items: start;
}

@media (max-width: 1024px) {
  .checkout-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

/* Form Styles */
.form-container {
  background: var(--background-white);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: var(--card-shadow);
}

.form-section {
  margin-bottom: 2.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--background-light);
}

.section-icon {
  color: var(--color-success);
  width: 24px;
  height: 24px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

/* Form Layout */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

/* Payment Options */
.payment-options {
  display: grid;
  gap: 1rem;
}

.payment-option {
  position: relative;
}

.payment-radio {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.payment-label {
  display: block;
  padding: 1rem 1.25rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--background-white);
}

.payment-radio:checked + .payment-label {
  border-color: var(--color-success);
  background: var(--background-light);
}

.payment-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.payment-name {
  font-weight: 600;
  color: var(--text-primary);
}

.payment-icon {
  color: var(--text-secondary);
  width: 20px;
  height: 20px;
}

.payment-radio:checked + .payment-label .payment-icon {
  color: var(--color-success);
}

.payment-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--badge-color);
  border-radius: 12px;
  color: var(--color-primary);
  font-size: 0.875rem;
  margin-top: 1rem;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid var(--background-light);
}

/* Loading Spinner */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Order Summary */
.order-summary {
  position: sticky;
  top: 2rem;
}

.summary-card {
  background: var(--background-white);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: var(--card-shadow);
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--background-light);
}

.summary-icon {
  color: var(--color-success);
  width: 24px;
  height: 24px;
}

.summary-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.summary-items {
  margin-bottom: 1.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 0;
  border-bottom: 1px solid var(--background-light);
  gap: 0.75rem;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-item-image {
  flex-shrink: 0;
}

.summary-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid var(--border-color);
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.item-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.item-variant {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.item-qty {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.item-total {
  font-weight: 600;
  color: var(--color-success);
  font-size: 0.875rem;
}

.summary-totals {
  padding-top: 1rem;
  border-top: 2px solid var(--background-light);
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  color: var(--text-secondary);
}

.final-total {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-success);
  border-top: 2px solid var(--border-color);
  padding-top: 1rem;
  margin-top: 0.5rem;
}

/* Error Alert */
.error-alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--badge-color);
  color: var(--text-error);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  border: 1px solid var(--color-error);
}

/* Responsive Design */
@media (max-width: 768px) {
  .checkout-page {
    padding: 1rem;
  }
  
  .checkout-title {
    font-size: 2rem;
  }
  
  .form-container, .summary-card {
    padding: 1.5rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .order-info-grid {
    grid-template-columns: 1fr;
  }
  
  .product-img {
    width: 50px;
    height: 50px;
  }
  
  .summary-img {
    width: 40px;
    height: 40px;
  }
  
  .item-row {
    gap: 0.75rem;
  }
  
  .summary-item {
    gap: 0.5rem;
  }
}
</style>
