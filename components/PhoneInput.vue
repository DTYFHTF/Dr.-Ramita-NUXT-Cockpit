<template>
  <div class="phone-input-wrapper">
    <vue-tel-input
      v-model="displayValue"
      mode="international"
      :default-country="defaultCountry"
      :preferred-countries="preferredCountries"
      :dropdown-options="{
        showSearchBox: true,
        showDialCodeInSelection: true,
        showDialCodeInList: true,
        showFlags: true,
      }"
      :input-options="{
        placeholder: placeholder,
        required: required,
        ...inputOptions,
      }"
      @country-changed="handleCountryChange"
      :class="['phone-input', customClass]"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { parsePhone } from '@/utils/phone'

interface Props {
  modelValue?: string
  countryCode?: string
  placeholder?: string
  required?: boolean
  defaultCountry?: string
  preferredCountries?: string[]
  inputOptions?: Record<string, any>
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  countryCode: '',
  placeholder: 'Enter phone number',
  required: false,
  defaultCountry: 'IN',
  preferredCountries: () => ['IN', 'US', 'NP', 'GB', 'AE'],
  inputOptions: () => ({}),
  customClass: '',
})

const emit = defineEmits<{
  'update:modelValue': (value: string) => void
  'update:countryCode': (code: string) => void
  'country-changed': (country: any) => void
}>()

// The visible value is the national number only.
const displayValue = ref('')

// Keep displayValue in sync with external modelValue. If an international
// value is provided, parse and extract the national number and country code.
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      displayValue.value = ''
      return
    }

    const looksLikeIntl = newVal.trim().startsWith('+') || /\D/.test(newVal)

    if (looksLikeIntl) {
      const parsed = parsePhone(newVal, props.defaultCountry as any)
      if (parsed) {
        displayValue.value = parsed.nationalNumber || ''
        if (parsed.countryCode) emit('update:countryCode', parsed.countryCode)
        return
      }
    }

    displayValue.value = newVal
  },
  { immediate: true }
)

// When user edits the visible input, emit the national number and (when
// possible) the detected country code. If the user types an international
// value, we parse and normalize it back to national digits for display.
watch(displayValue, (val) => {
  if (!val) {
    emit('update:modelValue', '')
    return
  }

  const looksLikeIntl = val.trim().startsWith('+') || /\D/.test(val)

  if (looksLikeIntl) {
    const parsed = parsePhone(val, props.defaultCountry as any)
    if (parsed && parsed.nationalNumber) {
      if (displayValue.value !== parsed.nationalNumber) displayValue.value = parsed.nationalNumber
      emit('update:modelValue', parsed.nationalNumber)
      if (parsed.countryCode) emit('update:countryCode', parsed.countryCode)
      return
    }
  }

  emit('update:modelValue', val)
})

function handleCountryChange(country: any) {
  const dialCode = country?.dialCode ? `+${country.dialCode}` : ''
  emit('update:countryCode', dialCode)
  emit('country-changed', country)
}
</script>

<style scoped lang="scss">
.phone-input-wrapper {
  width: 100%;
}

:deep(.phone-input) {
  border: 1px solid var(--border-default);
  border-radius: 8px;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.1);
  }

  .vti__input {
    padding: 0.75rem;
    font-size: 1rem;
    background-color: var(--surface-primary);
    color: var(--text-primary);
    border: none;

    &::placeholder {
      color: var(--text-secondary);
      opacity: 0.7;
    }

    &:focus {
      outline: none;
    }
  }

  /* Dropdown toggle */
  .vti__dropdown {
    background-color: var(--surface-primary);
    border: none;
    border-right: 1px solid var(--border-default);
    padding: 0 0.5rem;

    &:hover {
      background-color: var(--surface-subtle);
    }

    &-list {
      background-color: var(--surface-primary);
      color: var(--text-primary);
      border: 1px solid var(--border-default);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border-radius: 8px;
      max-height: 300px;
      overflow-y: auto;
    }

    &-item {
      color: var(--text-primary);
      padding: 10px 12px;
      cursor: pointer;
      transition: background-color 0.15s ease;

      &:hover,
      &.highlighted {
        background-color: var(--surface-footer);
      }

      strong {
        color: var(--text-primary);
        font-weight: 600;
      }

      .vti__flag {
        margin-right: 10px;
      }
    }

    &-arrow {
      color: var(--text-secondary);
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
      font-size: 0.95rem;
    }

    .vti__flag {
      margin-right: 4px;
    }
  }

  /* Search box in dropdown */
  .vti__search_box {
    background-color: var(--surface-primary);
    color: var(--text-primary);
    border: 1px solid var(--border-default);
    padding: 8px 12px;
    margin: 8px;
    border-radius: 6px;

    &:focus {
      border-color: var(--accent-primary);
      outline: none;
    }

    &::placeholder {
      color: var(--text-secondary);
    }
  }
}
</style>
