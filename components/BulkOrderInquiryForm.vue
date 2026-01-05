<template>
  <div class="bulk-order-form">
    <!-- Step Indicator -->
    <div class="step-indicator mb-4">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="step-item"
        :class="{
          active: currentStep === index,
          completed: currentStep > index,
        }"
      >
        <div class="step-circle">
          <LucideIcon v-if="currentStep > index" icon="mdi:check" size="20" />
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div class="step-label">{{ step }}</div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit">
      <!-- Step 1: Contact Information -->
      <div v-show="currentStep === 0" class="form-section">
        <h3 class="section-title">
          <LucideIcon icon="mdi:account" class="me-2" />
          Contact Information
        </h3>
        <div class="row g-3">
          <div class="col-md-6">
            <label for="name" class="form-label"
              >Full Name <span class="text-danger">*</span></label
            >
            <input
              id="name"
              v-model="form.name"
              type="text"
              class="form-input"
              placeholder="Enter your full name"
              required
            />
            <span v-if="validationErrors?.name" class="text-danger small">{{
              validationErrors.name[0]
            }}</span>
          </div>

          <div class="col-md-6">
            <label for="email" class="form-label"
              >Email <span class="text-danger">*</span></label
            >
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="form-input"
              placeholder="your.email@example.com"
              required
            />
            <span v-if="validationErrors?.email" class="text-danger small">{{
              validationErrors.email[0]
            }}</span>
          </div>

          <div class="col-md-6">
            <label for="phone" class="form-label"
              >Phone Number <span class="text-danger">*</span></label
            >
            <vue-tel-input
              v-model="form.phone"
              mode="international"
              :preferred-countries="['IN', 'US', 'GB', 'AE']"
              :dropdown-options="{
                showSearchBox: true,
                showDialCodeInSelection: true,
                showDialCodeInList: true,
              }"
              :input-options="{
                placeholder: 'Enter phone number',
                required: true,
              }"
              @country-changed="handleCountryChange"
              class="vue-tel-input-custom"
            />
            <span v-if="validationErrors?.phone" class="text-danger small">{{
              validationErrors.phone[0]
            }}</span>
          </div>

          <div class="col-md-6">
            <label for="company_name" class="form-label">Company Name</label>
            <input
              id="company_name"
              v-model="form.company_name"
              type="text"
              class="form-input"
              placeholder="Your company name (optional)"
            />
          </div>

          <div class="col-md-12">
            <label for="tax_number" class="form-label"
              >GST/VAT/Tax Number</label
            >
            <input
              id="tax_number"
              v-model="form.tax_number"
              type="text"
              class="form-input"
              placeholder="GST/VAT/Tax Number (if applicable)"
            />
            <small class="text-muted"
              >Provide your business tax identification number if
              applicable</small
            >
          </div>
        </div>

        <div class="step-navigation mt-4">
          <button
            type="button"
            @click="nextStep"
            class="btn btn-smooth-success px-4"
          >
            Next <LucideIcon icon="mdi:arrow-right" class="ms-2" />
          </button>
        </div>
      </div>

      <!-- Step 2: Product Selection -->
      <div v-show="currentStep === 1" class="form-section">
        <h3 class="section-title">
          <LucideIcon icon="mdi:package-variant" class="me-2" />
          Select Products
        </h3>

        <!-- Product Search Input -->
        <div class="mb-3">
          <input
            v-model="productSearchQuery"
            type="text"
            class="form-input product-search-input"
            placeholder="Search & Add Products (type product name...)"
            @input="handleProductSearch"
          />
          <small class="d-block text-muted mt-2"
            >Minimum {{ MIN_QUANTITY }} units per product</small
          >

          <!-- Search Results Dropdown -->
          <div v-if="searchLoading" class="search-results-list mt-2">
            <div class="text-center py-3">
              <div
                class="spinner-border spinner-border-sm text-primary"
                role="status"
              >
                <span class="visually-hidden">Loading...</span>
              </div>
              <span class="ms-2 text-muted small">Searching...</span>
            </div>
          </div>

          <div
            v-else-if="productSearchResults.length > 0"
            class="search-results-list mt-2"
          >
            <div
              v-for="product in productSearchResults"
              :key="product.id"
              class="search-result-product"
              @click="addProductFromSearch(product)"
            >
              <img
                v-if="product.image"
                :src="getImageUrl(product.image)"
                :alt="product.name"
                class="product-thumb"
                @error="(e) => handleImageError(e)"
              />
              <div class="product-info-search">
                <h6 class="product-name-search">{{ product.name }}</h6>
                <p
                  v-if="product.category_name"
                  class="product-category small text-muted mb-0"
                >
                  {{ product.category_name }}
                </p>
              </div>
              <button type="button" class="btn btn-sm btn-outline-success">
                <LucideIcon icon="mdi:plus" size="16" /> Add
              </button>
            </div>
          </div>

          <div
            v-else-if="productSearchQuery.length >= 2"
            class="search-results-list mt-2"
          >
            <div class="text-center py-3 text-muted small">
              <LucideIcon icon="mdi:magnify-close" size="32" class="mb-1" />
              <p>No products found matching "{{ productSearchQuery }}"</p>
            </div>
          </div>
        </div>

        <!-- Selected Products List -->
        <div v-if="form.products.length > 0" class="selected-products">
          <h5 class="mb-3">Selected Products ({{ form.products.length }})</h5>
          <div
            v-for="(product, index) in form.products"
            :key="index"
            class="selected-product-card mb-3"
          >
            <div class="product-info">
              <div class="product-details">
                <h6 class="product-name">
                  {{ product.product_name || "Unnamed Product" }}
                </h6>
                <span v-if="product.product_id" class="product-id-badge"
                  >ID: {{ product.product_id }}</span
                >
              </div>
              <div class="product-quantity">
                <label class="form-label small mb-1">Quantity *</label>
                <input
                  v-model.number="product.quantity"
                  type="number"
                  :min="MIN_QUANTITY"
                  class="form-input form-input-sm"
                  :placeholder="`Min ${MIN_QUANTITY}`"
                  required
                />
              </div>
              <button
                type="button"
                @click="removeProduct(index)"
                class="btn-remove"
                title="Remove product"
              >
                <LucideIcon icon="mdi:close" size="20" />
              </button>
            </div>
            <span
              v-if="validationErrors?.[`products.${index}.quantity`]"
              class="text-danger small"
            >
              {{ validationErrors[`products.${index}.quantity`][0] }}
            </span>
          </div>
        </div>

        <div v-else class="empty-products text-center py-5">
          <LucideIcon
            icon="mdi:package-variant-closed"
            size="48"
            class="text-muted mb-3"
          />
          <p class="text-muted">
            No products selected yet. Start typing in the search box above to
            add products.
          </p>
        </div>

        <div class="step-navigation mt-4">
          <button
            type="button"
            @click="prevStep"
            class="btn btn-outline-secondary px-4 me-2"
          >
            <LucideIcon icon="mdi:arrow-left" class="me-2" /> Back
          </button>
          <button
            type="button"
            @click="nextStep"
            :disabled="form.products.length === 0"
            class="btn btn-smooth-success px-4"
          >
            Next <LucideIcon icon="mdi:arrow-right" class="ms-2" />
          </button>
        </div>
      </div>

      <!-- Step 3: Shipping Address -->
      <div v-show="currentStep === 2" class="form-section">
        <h3 class="section-title">
          <LucideIcon icon="mdi:truck-delivery" class="me-2" />
          Shipping Address
        </h3>
        <div class="row g-3">
          <div class="col-md-12">
            <label for="shipping_address" class="form-label"
              >Address Line <span class="text-danger">*</span></label
            >
            <textarea
              id="shipping_address"
              v-model="form.shipping_address"
              class="form-input"
              rows="2"
              placeholder="Street address, building number, floor, etc."
              required
            ></textarea>
            <span
              v-if="validationErrors?.shipping_address"
              class="text-danger small"
            >
              {{ validationErrors.shipping_address[0] }}
            </span>
          </div>

          <div class="col-md-6">
            <label for="shipping_area" class="form-label">Area</label>
            <input
              id="shipping_area"
              v-model="form.shipping_area"
              type="text"
              class="form-input"
              placeholder="Locality/Area"
            />
          </div>

          <div class="col-md-6">
            <label for="shipping_landmark" class="form-label">Landmark</label>
            <input
              id="shipping_landmark"
              v-model="form.shipping_landmark"
              type="text"
              class="form-input"
              placeholder="Nearby landmark (optional)"
            />
          </div>

          <div class="col-md-6">
            <label for="shipping_city" class="form-label"
              >City <span class="text-danger">*</span></label
            >
            <input
              id="shipping_city"
              v-model="form.shipping_city"
              type="text"
              class="form-input"
              placeholder="City"
              required
            />
            <span
              v-if="validationErrors?.shipping_city"
              class="text-danger small"
            >
              {{ validationErrors.shipping_city[0] }}
            </span>
          </div>

          <div class="col-md-6">
            <label for="shipping_state" class="form-label"
              >State/Province <span class="text-danger">*</span></label
            >
            <input
              id="shipping_state"
              v-model="form.shipping_state"
              type="text"
              class="form-input"
              placeholder="State or Province"
              required
            />
            <span
              v-if="validationErrors?.shipping_state"
              class="text-danger small"
            >
              {{ validationErrors.shipping_state[0] }}
            </span>
          </div>

          <div class="col-md-6">
            <label for="shipping_pincode" class="form-label"
              >Pincode/Postal Code <span class="text-danger">*</span></label
            >
            <input
              id="shipping_pincode"
              v-model="form.shipping_pincode"
              type="text"
              class="form-input"
              placeholder="Pincode or postal code"
              required
            />
            <span
              v-if="validationErrors?.shipping_pincode"
              class="text-danger small"
            >
              {{ validationErrors.shipping_pincode[0] }}
            </span>
          </div>

          <div class="col-md-6">
            <label for="shipping_country" class="form-label"
              >Country <span class="text-danger">*</span></label
            >
            <input
              id="shipping_country"
              v-model="form.shipping_country"
              type="text"
              class="form-input"
              placeholder="Country"
              required
            />
            <span
              v-if="validationErrors?.shipping_country"
              class="text-danger small"
            >
              {{ validationErrors.shipping_country[0] }}
            </span>
          </div>
        </div>

        <div class="step-navigation mt-4">
          <button
            type="button"
            @click="prevStep"
            class="btn btn-outline-secondary px-4 me-2"
          >
            <LucideIcon icon="mdi:arrow-left" class="me-2" /> Back
          </button>
          <button
            type="button"
            @click="nextStep"
            class="btn btn-smooth-success px-4"
          >
            Next <LucideIcon icon="mdi:arrow-right" class="ms-2" />
          </button>
        </div>
      </div>

      <!-- Step 4: Additional Details -->
      <div v-show="currentStep === 3" class="form-section">
        <h3 class="section-title">
          <LucideIcon icon="mdi:information" class="me-2" />
          Additional Details
        </h3>
        <div class="row g-3">
          <div class="col-md-6">
            <label for="expected_delivery_date" class="form-label"
              >Expected Delivery Date</label
            >
            <input
              id="expected_delivery_date"
              v-model="form.expected_delivery_date"
              type="date"
              class="form-input"
              :min="minDate"
            />
          </div>

          <div class="col-md-6">
            <label for="budget_range" class="form-label"
              >Budget Range (INR)</label
            >
            <select
              id="budget_range"
              v-model="form.budget_range"
              class="form-input"
            >
              <option value="">Select budget range (optional)</option>
              <option value="< ₹1,00,000">Less than ₹1,00,000</option>
              <option value="₹1,00,000 - ₹5,00,000">
                ₹1,00,000 - ₹5,00,000
              </option>
              <option value="₹5,00,000 - ₹10,00,000">
                ₹5,00,000 - ₹10,00,000
              </option>
              <option value="₹10,00,000 - ₹50,00,000">
                ₹10,00,000 - ₹50,00,000
              </option>
              <option value="> ₹50,00,000">More than ₹50,00,000</option>
            </select>
          </div>

          <div class="col-md-12">
            <label for="message" class="form-label">Message/Requirements</label>
            <textarea
              id="message"
              v-model="form.message"
              class="form-input"
              rows="3"
              placeholder="Tell us about your requirements, preferences, or any specific needs..."
            ></textarea>
          </div>

          <div class="col-md-12">
            <label for="special_instructions" class="form-label"
              >Special Instructions</label
            >
            <textarea
              id="special_instructions"
              v-model="form.special_instructions"
              class="form-input"
              rows="2"
              placeholder="Any special packaging, labeling, or delivery instructions?"
            ></textarea>
          </div>
        </div>

        <!-- Error Messages -->
        <div v-if="error" class="alert alert-danger mt-3">
          {{ error }}
        </div>

        <div class="step-navigation mt-4">
          <button
            type="button"
            @click="prevStep"
            class="btn btn-outline-secondary px-4 me-2"
          >
            <LucideIcon icon="mdi:arrow-left" class="me-2" /> Back
          </button>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="btn btn-smooth-success btn-lg px-5"
          >
            <span v-if="loading">
              <span
                class="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              Submitting...
            </span>
            <span v-else>
              <LucideIcon icon="mdi:send" class="me-2" />
              Submit Bulk Order Inquiry
            </span>
          </button>
        </div>

        <p class="text-center text-muted mt-3 small">
          Our team will review your inquiry and contact you within 24-48 hours
        </p>
      </div>
    </form>

    <!-- Success Modal -->
    <SuccessModal
      :show="showSuccessModal"
      type="inquiry"
      :message="successMessage"
      @close="handleSuccessClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import {
  useBulkOrderInquiry,
  type BulkOrderProduct,
} from "@/composables/useBulkOrderInquiry";
import { useProducts } from "@/composables/useProducts";
import { useAlert } from "@/composables/useAlert";
import LucideIcon from "@/components/LucideIcon.vue";
import SuccessModal from "@/components/SuccessModal.vue";
import { VueTelInput } from "vue-tel-input";
import "vue-tel-input/vue-tel-input.css";

const MIN_QUANTITY = 10;

const userStore = useUserStore();
const { submitInquiry, loading, error } = useBulkOrderInquiry();
const { searchProductsByName } = useProducts();
const { getImageUrl, handleImageError } = useImageUrl();
const { warning } = useAlert();

// Multi-step form
const steps = ["Contact Info", "Products", "Shipping", "Details"];
const currentStep = ref(0);

// Product search
const productSearchQuery = ref("");
const productSearchResults = ref<any[]>([]);
const searchLoading = ref(false);
let searchDebounce: ReturnType<typeof setTimeout> | null = null;

// Form state
const form = ref({
  name: "",
  email: "",
  phone: "",
  phone_country_code: "",
  company_name: "",
  tax_number: "",
  shipping_address: "",
  shipping_area: "",
  shipping_landmark: "",
  shipping_city: "",
  shipping_state: "",
  shipping_pincode: "",
  shipping_country: "India",
  products: [] as BulkOrderProduct[],
  message: "",
  special_instructions: "",
  expected_delivery_date: "",
  budget_range: "",
});

const validationErrors = ref<any>(null);
const showSuccessModal = ref(false);
const successMessage = ref("");

// Min date for delivery (tomorrow)
const minDate = computed(() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
});

// Form validation
const isFormValid = computed(() => {
  return (
    form.value.name &&
    form.value.email &&
    form.value.phone &&
    form.value.shipping_address &&
    form.value.shipping_city &&
    form.value.shipping_state &&
    form.value.shipping_pincode &&
    form.value.shipping_country &&
    form.value.products.length > 0 &&
    form.value.products.every(
      (p) => p.product_id && p.product_name && p.quantity >= MIN_QUANTITY,
    )
  );
});

// Pre-fill user data
onMounted(() => {
  if (userStore.user) {
    form.value.name =
      `${userStore.user.first_name || ""} ${userStore.user.last_name || ""}`.trim();
    form.value.email = userStore.user.email || "";
    form.value.phone = userStore.user.phone || "";
  }
});

// Handle country change from phone input
function handleCountryChange(country: any) {
  if (country?.dialCode) {
    form.value.phone_country_code = `+${country.dialCode}`;
  }
  // Optionally pre-fill country in shipping if empty
  if (!form.value.shipping_country || form.value.shipping_country === "India") {
    form.value.shipping_country = country?.name || "India";
  }
}

// Step navigation
function nextStep() {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// Product search with modal
function handleProductSearch() {
  console.log("Search triggered:", productSearchQuery.value);

  if (searchDebounce) clearTimeout(searchDebounce);

  if (productSearchQuery.value.length < 2) {
    productSearchResults.value = [];
    searchLoading.value = false;
    return;
  }

  searchLoading.value = true;
  searchDebounce = setTimeout(async () => {
    console.log("Executing search for:", productSearchQuery.value);
    try {
      const results = await searchProductsByName(productSearchQuery.value);
      console.log("Search results:", results);
      productSearchResults.value = results.slice(0, 20);
    } catch (err) {
      console.error("Product search error:", err);
      productSearchResults.value = [];
    } finally {
      searchLoading.value = false;
    }
  }, 300);
}

function addProductFromSearch(product: any) {
  // Check if product already exists
  const exists = form.value.products.some((p) => p.product_id === product.id);
  if (exists) {
    warning("This product is already added to your list");
    return;
  }

  form.value.products.push({
    product_id: product.id,
    product_name: product.name,
    quantity: MIN_QUANTITY,
  });

  // Reset search
  productSearchQuery.value = "";
  productSearchResults.value = [];
}

// Product management
function addProduct() {
  form.value.products.push({
    product_id: null,
    product_name: "",
    quantity: MIN_QUANTITY,
  });
}

function removeProduct(index: number) {
  form.value.products.splice(index, 1);
}

// Product search (legacy - kept for compatibility but not used in new UI)
async function searchProducts(query: string, index: number) {
  if (!query || query.length < 2) {
    return;
  }

  try {
    const results = await searchProductsByName(query);
    // Results handled in modal now
  } catch (err) {
    console.error("Product search error:", err);
  }
}

function selectProduct(product: any, index: number) {
  form.value.products[index].product_id = product.id;
  form.value.products[index].product_name = product.name;
}

// Form submission
async function handleSubmit() {
  validationErrors.value = null;

  if (!userStore.token) {
    error.value = "Please login to submit bulk order inquiry";
    return;
  }

  const result = await submitInquiry(form.value, userStore.token);

  if (result.success) {
    successMessage.value =
      result.message || "Your bulk order inquiry has been received!";
    showSuccessModal.value = true;
    // Reset form
    resetForm();
  } else {
    validationErrors.value = result.errors;
  }
}

function resetForm() {
  form.value = {
    name: userStore.user
      ? `${userStore.user.first_name || ""} ${userStore.user.last_name || ""}`.trim()
      : "",
    email: userStore.user?.email || "",
    phone: userStore.user?.phone || "",
    phone_country_code: "",
    company_name: "",
    tax_number: "",
    shipping_address: "",
    shipping_area: "",
    shipping_landmark: "",
    shipping_city: "",
    shipping_state: "",
    shipping_pincode: "",
    shipping_country: "India",
    products: [],
    message: "",
    special_instructions: "",
    expected_delivery_date: "",
    budget_range: "",
  };
  currentStep.value = 0;
}

function handleSuccessClose() {
  showSuccessModal.value = false;
  // Optionally redirect to dashboard or inquiries page
  navigateTo("/dashboard?tab=bulk-orders");
}
</script>

<style scoped lang="scss">
.bulk-order-form {
  max-width: 900px;
  margin: 0 auto;
}

/* Step Indicator */
.step-indicator {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--background-white);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    top: 20px;
    left: 60%;
    right: -40%;
    height: 2px;
    background: var(--border-color);
    z-index: 0;
  }

  &.completed::after {
    background: var(--color-success);
  }
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--background-light);
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;

  .active & {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: white;
  }

  .completed & {
    background: var(--color-success);
    border-color: var(--color-success);
    color: white;
  }
}

.step-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-align: center;

  .active &,
  .completed & {
    color: var(--text-primary);
    font-weight: 600;
  }
}

/* Form Section */
.form-section {
  background: var(--background-white);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

.form-label {
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  display: block;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  background-color: var(--background-white);
  color: var(--text-primary);

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
  }

  &.form-input-sm {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
}

/* Ensure the product search input always shows a visible border */
.product-search-input {
  border: 2px solid var(--color-primary) !important;
  
  &:focus {
    border: 2px solid var(--color-primary) !important;
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.15) !important;
  }
}

/* Step Navigation */
.step-navigation {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* Selected Products */
.selected-products {
  h5 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
  }
}

.selected-product-card {
  background: var(--background-light);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-primary);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
}

.product-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.product-details {
  flex: 1;
}

.product-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.product-id-badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background: var(--color-primary);
  color: white;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.product-quantity {
  width: 120px;
}

.btn-remove {
  background: transparent;
  border: none;
  color: var(--color-danger);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(var(--color-danger-rgb), 0.1);
  }
}

.empty-products {
  background: var(--background-light);
  border-radius: 8px;
}

/* Product Search Results */
.search-results-list {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--background-white);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-result-product {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: var(--background-light);
  }
}

.product-thumb {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
}

.product-info-search {
  flex: 1;
}

.product-name-search {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

/* Vue Tel Input Dark Mode Fix */
:deep(.vue-tel-input) {
  border: 1px solid var(--border-color);
  border-radius: 8px;

  &:focus-within {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
  }

  .vti__input {
    padding: 0.75rem;
    font-size: 1rem;
    background-color: var(--background-white);
    color: var(--text-primary);
  }

  /* Fix dropdown visibility in dark mode */
  .vti__dropdown {
    background-color: var(--background-white);
    border: 1px solid var(--border-color);

    &-list {
      background-color: var(--background-white);
      color: var(--text-primary);
    }

    &-item {
      color: var(--text-primary);
      padding: 8px 12px;

      &:hover,
      &.highlighted {
        background-color: var(--background-light);
      }

      strong {
        color: var(--text-primary);
      }

      .vti__flag {
        margin-right: 8px;
      }
    }
  }

  /* Country code in selection */
  .vti__selection {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .vti__country-code {
      font-weight: 600;
      color: var(--text-primary);
    }
  }

  /* Search box in dropdown */
  .vti__search_box {
    background-color: var(--background-white);
    color: var(--text-primary);
    border: 1px solid var(--border-color);

    &:focus {
      border-color: var(--color-primary);
    }
  }
}

.spinner-border {
  width: 1rem;
  height: 1rem;
  border-width: 0.15rem;
}

/* Responsive */
@media (max-width: 768px) {
  .step-indicator {
    padding: 0.75rem;
  }

  .step-label {
    font-size: 0.75rem;
  }

  .step-circle {
    width: 32px;
    height: 32px;
    font-size: 0.875rem;
  }

  .form-section {
    padding: 1.5rem;
  }

  .product-info {
    flex-direction: column;
    align-items: stretch;
  }

  .product-quantity {
    width: 100%;
  }
}
</style>
