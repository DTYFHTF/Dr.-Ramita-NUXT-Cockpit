<template>
  <div class="phone-demo-page">
    <div class="demo-container">
      <h1 class="demo-title">Phone Input Component Demo</h1>
      <p class="demo-subtitle">Test phone input with country flags in light and dark themes</p>

      <div class="demo-section">
        <h2 class="section-title">Basic Phone Input</h2>
        <div class="input-wrapper">
          <label class="input-label">Phone Number (Required)</label>
          <PhoneInput
            v-model="form1.phone"
            v-model:country-code="form1.countryCode"
            placeholder="Enter your phone number"
            :required="true"
          />
          <div v-if="form1.phone" class="input-feedback">
            <div class="feedback-item">
              <strong>Phone:</strong> {{ form1.phone }}
            </div>
            <div class="feedback-item">
              <strong>Country Code:</strong> {{ form1.countryCode }}
            </div>
            <div class="feedback-item">
              <strong>Combined:</strong> {{ form1.countryCode }}{{ form1.phone }}
            </div>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <h2 class="section-title">Optional Phone Input</h2>
        <div class="input-wrapper">
          <label class="input-label">Phone Number (Optional)</label>
          <PhoneInput
            v-model="form2.phone"
            v-model:country-code="form2.countryCode"
            placeholder="Enter your phone number"
            :required="false"
          />
        </div>
      </div>

      <div class="demo-section">
        <h2 class="section-title">With Custom Preferred Countries</h2>
        <div class="input-wrapper">
          <label class="input-label">Contact Number</label>
          <PhoneInput
            v-model="form3.phone"
            v-model:country-code="form3.countryCode"
            placeholder="Enter contact number"
            :preferred-countries="['US', 'GB', 'CA', 'AU']"
          />
        </div>
      </div>

      <div class="demo-section">
        <h2 class="section-title">Form Submission Example</h2>
        <form @submit.prevent="handleSubmit" class="demo-form">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input
              v-model="formData.name"
              type="text"
              class="form-input"
              placeholder="Enter your name"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input
              v-model="formData.email"
              type="email"
              class="form-input"
              placeholder="your@email.com"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <PhoneInput
              v-model="formData.phone"
              v-model:country-code="formData.countryCode"
              placeholder="Enter your phone number"
              :required="true"
            />
          </div>

          <button type="submit" class="btn btn-smooth-success">
            Submit Form
          </button>

          <div v-if="submittedData" class="submission-result">
            <h3>Submitted Data:</h3>
            <pre>{{ JSON.stringify(submittedData, null, 2) }}</pre>
          </div>
        </form>
      </div>

      <div class="demo-section">
        <h2 class="section-title">Theme Toggle</h2>
        <p class="section-description">Switch between light and dark themes to test phone input styling</p>
        <button @click="toggleTheme" class="btn btn-outline">
          <LucideIcon :name="theme === 'dark' ? 'Sun' : 'Moon'" :size="18" />
          Switch to {{ theme === 'dark' ? 'Light' : 'Dark' }} Theme
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '@/composables/useTheme'

definePageMeta({
  layout: 'default',
})

const { theme, toggleTheme } = useTheme()

const form1 = ref({
  phone: '',
  countryCode: '',
})

const form2 = ref({
  phone: '',
  countryCode: '',
})

const form3 = ref({
  phone: '',
  countryCode: '',
})

const formData = ref({
  name: '',
  email: '',
  phone: '',
  countryCode: '',
})

const submittedData = ref(null)

const handleSubmit = () => {
  submittedData.value = {
    name: formData.value.name,
    email: formData.value.email,
    phone: formData.value.phone,
    phone_country_code: formData.value.countryCode,
    phone_full: `${formData.value.countryCode}${formData.value.phone}`,
    timestamp: new Date().toISOString(),
  }
}
</script>

<style scoped lang="scss">
.phone-demo-page {
  min-height: 100vh;
  background-color: var(--surface-base);
  padding: 3rem 1rem;
}

.demo-container {
  max-width: 800px;
  margin: 0 auto;
}

.demo-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 1rem;
}

.demo-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 3rem;
}

.demo-section {
  background-color: var(--surface-primary);
  border: 1px solid var(--border-default);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.section-description {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.input-wrapper {
  margin-bottom: 1.5rem;
}

.input-label {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.input-feedback {
  margin-top: 1rem;
  padding: 1rem;
  background-color: var(--surface-subtle);
  border: 1px solid var(--border-default);
  border-radius: 8px;
}

.feedback-item {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }

  strong {
    color: var(--text-primary);
  }
}

.demo-form {
  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-label {
    display: block;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }

  .form-input {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid var(--border-default);
    border-radius: 8px;
    background-color: var(--surface-primary);
    color: var(--text-primary);
    transition: all 0.2s ease;

    &::placeholder {
      color: var(--text-secondary);
      opacity: 0.7;
    }

    &:focus {
      outline: none;
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.1);
    }
  }

  .btn {
    margin-top: 1rem;
  }
}

.submission-result {
  margin-top: 2rem;
  padding: 1rem;
  background-color: var(--surface-subtle);
  border: 1px solid var(--border-default);
  border-radius: 8px;

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }

  pre {
    background-color: var(--surface-base);
    padding: 1rem;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 0.875rem;
    color: var(--text-secondary);
    border: 1px solid var(--border-default);
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  &.btn-smooth-success {
    background-color: var(--success);
    color: white;

    &:hover {
      background-color: var(--success-emphasis);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.3);
    }
  }

  &.btn-outline {
    background-color: transparent;
    border: 2px solid var(--border-emphasis);
    color: var(--text-primary);

    &:hover {
      background-color: var(--surface-subtle);
      border-color: var(--accent-primary);
    }
  }
}

@media (max-width: 768px) {
  .demo-title {
    font-size: 2rem;
  }

  .demo-section {
    padding: 1.5rem;
  }

  .phone-demo-page {
    padding: 2rem 1rem;
  }
}
</style>
