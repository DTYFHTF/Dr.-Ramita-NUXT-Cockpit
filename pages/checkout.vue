<template>
  <div class="checkout-page container py-5">
    <div v-if="!orderSuccess" class="checkout-header text-center mb-5">
      <h1 class="checkout-title">Checkout</h1>
      <p class="checkout-subtitle text-muted">Complete your order in just a few steps</p>
    </div>
    <div v-if="orderSuccess && orderData">
      <OrderConfirmation :orderData="orderData" />
    </div>
    <div v-else-if="cartLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading cart...</span>
      </div>
      <p class="mt-3 text-muted">Loading your cart...</p>
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
                <button 
                  v-if="hasSavedAddress" 
                  type="button" 
                  @click="loadSavedAddress" 
                  class="btn btn-outline-primary btn-sm ms-auto"
                >
                  <LucideIcon icon="mdi:map-marker-check" class="me-1" />
                  Use Saved Address
                </button>
              </div>
              
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Full Name <span class="required">*</span></label>
                  <input v-model="shipping.name" type="text" class="form-input" required placeholder="Enter your full name" />
                </div>
                <div class="form-group">
                  <label class="form-label">Phone Number <span class="required">*</span></label>
                  <PhoneInput
                    v-model="shipping.phone"
                    v-model:country-code="shipping.phone_country_code"
                    placeholder="+91 00000 00000"
                    :required="true"
                    :default-country="'IN'"
                  />
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
                  <label class="form-label">Area</label>
                  <input v-model="shipping.area" type="text" class="form-input" placeholder="Area, Street, Sector" />
                </div>
                <div class="form-group">
                  <label class="form-label">Landmark</label>
                  <input v-model="shipping.landmark" type="text" class="form-input" placeholder="Nearby landmark" />
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
                  <label class="form-label">Country</label>
                  <input v-model="shipping.country" type="text" class="form-input" placeholder="India" />
                </div>
              </div>
              
              <div class="form-group mt-4">
                <label class="form-label">Special Instructions</label>
                <textarea v-model="specialInstructions" class="form-textarea" rows="3" placeholder="Any special delivery instructions..."></textarea>
              </div>
            </div>

            <div class="form-section">
              <div class="section-header">
                <LucideIcon icon="mdi:file-document" class="section-icon" />
                <h3 class="section-title">GST Details (Optional)</h3>
              </div>
              
              <div class="form-group">
                <label class="form-label">
                  GSTIN (GST Identification Number)
                  <small class="text-muted ms-2">For B2B purchases</small>
                </label>
                <input 
                  v-model="gstin" 
                  type="text" 
                  class="form-input" 
                  placeholder="22AAAAA0000A1Z5" 
                  maxlength="15"
                  @input="validateGSTIN"
                />
                <small v-if="gstinError" class="text-danger d-block mt-1">{{ gstinError }}</small>
                <small v-else class="text-muted d-block mt-1">
                  Enter 15-character GSTIN for GST invoice. Leave blank for B2C purchase.
                </small>
              </div>
            </div>

            <div class="form-section">
              <div class="section-header">
                <LucideIcon icon="mdi:truck-delivery" class="section-icon" />
                <h3 class="section-title">Shipping Method</h3>
              </div>
              
              <div v-if="loadingShipping" class="shipping-loading">
                <span class="spinner"></span>
                Calculating shipping rates...
              </div>
              
              <div v-else-if="shippingError" class="shipping-error">
                <LucideIcon icon="mdi:alert-circle" class="me-2" />
                {{ shippingError }}
              </div>
              
              <div v-else-if="!shipping.state || !shipping.pincode" class="shipping-info">
                <LucideIcon icon="mdi:information" class="me-2" />
                Enter state and pincode to see shipping options
              </div>
              
              <div v-else-if="shippingMethods.length === 0" class="shipping-error">
                <LucideIcon icon="mdi:alert-circle" class="me-2" />
                No shipping methods available for your location. Please check your address or contact support.
              </div>
              
              <div v-else class="payment-options">
                <div v-for="method in shippingMethods" :key="method.id" class="payment-option">
                  <input 
                    class="payment-radio" 
                    type="radio" 
                    :id="`shipping_${method.id}`" 
                    :value="method.id" 
                    v-model="selectedShippingMethodId" 
                    required 
                  />
                  <label class="payment-label" :for="`shipping_${method.id}`">
                    <div class="payment-content">
                      <div>
                        <span class="payment-name">{{ method.name }}</span>
                        <span v-if="method.is_express" class="badge-express">Express</span>
                        <small class="d-block text-muted">{{ method.estimated_delivery }}</small>
                      </div>
                      <div class="text-end">
                        <span v-if="method.cost === 0" class="text-success fw-bold">FREE</span>
                        <span v-else class="fw-bold">₹{{ method.cost.toFixed(2) }}</span>
                      </div>
                    </div>
                  </label>
                </div>
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
                <span>Items Total</span>
                <span>₹{{ subtotalWithoutGST.toFixed(2) }}</span>
              </div>
              <div class="total-row">
                <span>GST</span>
                <span>₹{{ totalGST.toFixed(2) }}</span>
              </div>
              <div v-if="selectedShippingMethodId" class="total-row">
                <span>Shipping ({{ selectedShippingMethodName }})</span>
                <span v-if="shippingCost === 0" class="text-success fw-bold">FREE</span>
                <span v-else class="fw-bold">₹{{ shippingCost.toFixed(2) }}</span>
              </div>
              <div v-else-if="loadingShipping" class="total-row">
                <span>Shipping</span>
                <span>Calculating...</span>
              </div>
              <div v-if="selectedShippingMethodId" class="total-row text-muted small">
                <span>Estimated Delivery</span>
                <span>{{ estimatedDelivery }}</span>
              </div>
              <div class="total-row final-total">
                <span>Total Amount</span>
                <span>₹{{ (totalPrice + shippingCost).toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useCart } from '@/composables/useCart';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useUserSettings } from '@/composables/useUserSettings';
import { useAlert } from '@/composables/useAlert';
import type { Order, OrderItem, ShippingInfo, PaymentMethod } from '@/types';
import LucideIcon from '@/components/LucideIcon.vue';
import OrderConfirmation from '@/components/OrderConfirmation.vue';
import PhoneInput from '@/components/PhoneInput.vue';

// Require authentication for checkout
definePageMeta({
  middleware: 'auth'
});

const cartStore = useCart();
const { cart, totalPrice } = storeToRefs(cartStore);
const router = useRouter();
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;
const baseUrl = config.public.baseUrl;
const userStore = useUserStore();
const { initiatePayment, verifyPayment } = useRazorpay();
const { getDefaultAddress, getPreferredDeliverySlot, getDeliverySlotLabel } = useUserSettings();
const { sessionExpired } = useAlert();
const cartLoading = ref(true);

// Check if user has saved address
const hasSavedAddress = ref(false);

onMounted(async () => {
  try {
    cartLoading.value = true;
    // Ensure cart is loaded
    if (userStore.token) {
      await cartStore.fetchCart();
    }
    
    const savedAddress = getDefaultAddress();
    hasSavedAddress.value = !!savedAddress;
    
    // If state and pincode are already filled, fetch shipping rates immediately
    if (shipping.value.state && shipping.value.pincode) {
      fetchShippingRates();
    }
  } finally {
    cartLoading.value = false;
  }
});

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
  phone_country_code: '',
  pincode: '',
  address: '',
  area: '',
  landmark: '',
  city: '',
  state: '',
  country: ''
});
const specialInstructions = ref('');
const gstin = ref('');
const gstinError = ref('');

// GSTIN validation
const validateGSTIN = () => {
  const value = gstin.value.trim().toUpperCase();
  gstin.value = value;
  
  if (!value) {
    gstinError.value = '';
    return true;
  }
  
  // GSTIN format: 2 digits (state code) + 10 alphanumeric (PAN) + 1 digit (entity) + Z + 1 alphanumeric (checksum)
  const gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  
  if (value.length !== 15) {
    gstinError.value = 'GSTIN must be exactly 15 characters';
    return false;
  }
  
  if (!gstinPattern.test(value)) {
    gstinError.value = 'Invalid GSTIN format';
    return false;
  }
  
  gstinError.value = '';
  return true;
};

const paymentMethod = ref<PaymentMethod>('card');
const paymentMethods = [
  // { value: 'cod', label: 'Cash on Delivery' }, // Hidden for now
  { value: 'card', label: 'Card / UPI / Wallet (via Razorpay)' },
  // { value: 'upi', label: 'UPI (via Razorpay)' }, // Removed - already covered by card option
  { value: 'paypal', label: 'International Cards (Razorpay)' }
];

// Shipping method selection
const shippingMethods = ref<any[]>([]);
const selectedShippingMethodId = ref<number | null>(null);
const loadingShipping = ref(false);
const shippingError = ref('');

// Computed shipping cost and delivery time
const shippingCost = computed(() => {
  if (!selectedShippingMethodId.value) return 0;
  const method = shippingMethods.value.find(m => m.id === selectedShippingMethodId.value);
  return method?.cost || 0;
});

const estimatedDelivery = computed(() => {
  if (!selectedShippingMethodId.value) return 'Select shipping method';
  const method = shippingMethods.value.find(m => m.id === selectedShippingMethodId.value);
  return method?.estimated_delivery || '3-7 business days';
});

const selectedShippingMethodName = computed(() => {
  if (!selectedShippingMethodId.value) return 'Not selected';
  const method = shippingMethods.value.find(m => m.id === selectedShippingMethodId.value);
  return method?.method_name || method?.name || 'Not selected';
});

// Computed GST based on actual product GST rates
const totalGST = computed(() => {
  return cart.value.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const gstRate = item.gst_rate || 18.00;
    
    let gstAmount = 0;
    if (item.gst_inclusive) {
      // GST is included in price: GST = Price - (Price / (1 + rate/100))
      gstAmount = itemTotal - (itemTotal / (1 + gstRate / 100));
    } else {
      // GST is exclusive: GST = Price * (rate/100)
      gstAmount = itemTotal * (gstRate / 100);
    }
    
    return sum + gstAmount;
  }, 0);
});

// Subtotal without GST
const subtotalWithoutGST = computed(() => {
  return cart.value.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const gstRate = item.gst_rate || 18.00;
    
    if (item.gst_inclusive) {
      // Remove GST from price to get base price
      const basePrice = itemTotal / (1 + gstRate / 100);
      return sum + basePrice;
    }
    // If GST is exclusive, price is already without GST
    return sum + itemTotal;
  }, 0);
});

// Fetch shipping rates when address is complete
const fetchShippingRates = async () => {
  // Check if cart has items
  if (!cart.value || cart.value.length === 0) {
    shippingError.value = 'Please add items to your cart first';
    return;
  }
  
  if (!shipping.value.state || !shipping.value.pincode) {
    return;
  }
  
  loadingShipping.value = true;
  shippingError.value = '';
  
  const requestBody = {
    cart: cart.value.map((item) => ({
      product_id: item.product_id,
      variation_id: item.variation_id,
      quantity: item.quantity
    })),
    shipping_address: {
      state: shipping.value.state,
      pincode: shipping.value.pincode
    }
  };
  
  try {
    const response = await $fetch<any>(`${apiBase}/shipping/calculate`, {
      method: 'POST',
      body: requestBody,
      headers: { 
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (response.success) {
      // Map method_id from API response to id for the frontend
      shippingMethods.value = (response.methods || []).map((method: any) => ({
        ...method,
        id: method.method_id, // Map method_id to id
        name: method.method_name
      }));
      // Auto-select the first (cheapest) method
      if (shippingMethods.value.length > 0) {
        selectedShippingMethodId.value = shippingMethods.value[0].id;
      }
    } else {
      shippingError.value = response.message || 'Unable to calculate shipping';
    }
  } catch (e: any) {
    console.error('Shipping calculation error:', e);
    // Extract validation error message if available
    let errorMsg = 'Failed to calculate shipping rates';
    
    if (e.data?.errors) {
      // Format validation errors
      const errors = Object.values(e.data.errors).flat();
      errorMsg = errors.join(', ');
    } else if (e.data?.message) {
      errorMsg = e.data.message;
    } else if (e.message) {
      errorMsg = e.message;
    }
    
    shippingError.value = errorMsg;
  } finally {
    loadingShipping.value = false;
  }
};

// Watch for address changes to recalculate shipping (debounced)
let shippingDebounceTimer: any = null;
watch([() => shipping.value.state, () => shipping.value.pincode], () => {
  if (shipping.value.state && shipping.value.pincode) {
    // Clear existing timer
    if (shippingDebounceTimer) {
      clearTimeout(shippingDebounceTimer);
    }
    // Wait 500ms after user stops typing
    shippingDebounceTimer = setTimeout(() => {
      fetchShippingRates();
    }, 500);
  }
});

const orderSuccess = ref(false);
const orderData = ref<Order | null>(null);
const isSubmitting = ref(false);
const errorMessage = ref('');

const validateForm = () => {
  // Validate essential shipping fields only
  const requiredFields = ['name', 'phone', 'pincode', 'address', 'city', 'state'];
  for (const field of requiredFields) {
    if (!shipping.value[field as keyof ShippingInfo]) {
      errorMessage.value = `Please fill in ${field}`;
      return false;
    }
  }
  if (!paymentMethod.value) {
    errorMessage.value = 'Please select a payment method';
    return false;
  }
  if (!selectedShippingMethodId.value) {
    errorMessage.value = 'Please select a shipping method';
    return false;
  }
  return true;
};

// Load saved address from settings
const loadSavedAddress = () => {
  const savedAddress = getDefaultAddress();
  if (savedAddress) {
    shipping.value.name = savedAddress.name;
    shipping.value.phone = savedAddress.phone;
    shipping.value.address = savedAddress.street;
    shipping.value.city = savedAddress.city;
    shipping.value.state = savedAddress.state;
    shipping.value.pincode = savedAddress.pincode;
    shipping.value.landmark = savedAddress.landmark;
    shipping.value.country = 'India';
    
    // Clear any error messages
    errorMessage.value = '';
  }
};

const submitOrder = async () => {
  // Check if cart is empty
  if (!cart.value || cart.value.length === 0) {
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
  
  // Validate GSTIN if provided
  if (gstin.value && !validateGSTIN()) {
    errorMessage.value = 'Please enter a valid GSTIN or leave it blank.';
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
    shipping_method_id: selectedShippingMethodId.value,
    cart: cart.value.map((item) => ({
      product_id: item.product_id,
      variation_id: item.variation_id,
      quantity: item.quantity,
      name: item.name,
      variation_name: item.variation_name,
      price: item.price,
      image: item.image,
      gst_rate: item.gst_rate,
      gst_inclusive: item.gst_inclusive,
      hsn_code: item.hsn_code,
    })),
    special_instructions: specialInstructions.value,
    gstin: gstin.value.trim() || null // Include GSTIN if provided
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
      sessionExpired();
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
      } else if (e?.data?.error?.includes('Insufficient stock')) {
        // Special handling for stock errors
        errorMessage.value = e.data.error + ' Please review your cart and reduce quantities.';
      } else {
        errorMessage.value = e?.data?.error || e?.data?.message || 'Validation error. Please check your input.';
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

// SEO Meta Tags
usePageSeo({
  title: 'Checkout',
  description: 'Complete your purchase of authentic Ayurvedic products. Secure checkout with multiple payment options.',
  path: '/checkout',
  robots: 'noindex, nofollow',
});
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
  background: var(--surface-primary);
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
  background: var(--surface-muted);
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
  background: var(--surface-muted);
  border-radius: 12px;
  padding: 1.5rem;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-default);
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
  border: 1px solid var(--border-default);
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
  background: var(--surface-muted);
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
  border-top: 2px solid var(--border-default);
  padding-top: 1rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-success);
}

.shipping-info {
  margin-bottom: 2rem;
}

.address-details {
  background: var(--surface-muted);
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
  background: var(--accent-primary-hover);
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
  background: var(--surface-primary);
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
  border-bottom: 2px solid var(--surface-muted);
}

.section-header .btn-outline-primary {
  background: transparent;
  border: 2px solid var(--accent-primary);
  color: var(--accent-primary);
  padding: 0.375rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--accent-primary);
    color: var(--text-inverse);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
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
  border: 2px solid var(--border-default);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--surface-primary);
}

.payment-radio:checked + .payment-label {
  border-color: var(--status-success);
  background: var(--surface-muted);
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
  color: var(--accent-primary);
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
  border-top: 2px solid var(--surface-muted);
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
  background: var(--surface-primary);
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
  border-bottom: 2px solid var(--surface-muted);
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
  border-bottom: 1px solid var(--surface-muted);
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
  border: 1px solid var(--border-default);
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
  border-top: 2px solid var(--surface-muted);
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
  border-top: 2px solid var(--border-default);
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

/* Shipping section styles */
.shipping-loading,
.shipping-error,
.shipping-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.shipping-loading {
  background: var(--surface-muted);
  color: var(--text-muted);
}

.shipping-error {
  background: var(--badge-color);
  color: var(--text-error);
  border: 1px solid var(--color-error);
}

.shipping-info {
  background: var(--status-info-bg);
  color: var(--status-info);
}

.badge-express {
  display: inline-block;
  background: var(--status-warning-bg);
  color: var(--status-error);
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  margin-left: 0.5rem;
  font-weight: 600;
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
