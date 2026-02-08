# Phone Input Component - Quick Reference

## Basic Usage

```vue
<template>
  <PhoneInput
    v-model="form.phone"
    v-model:country-code="form.phone_country_code"
    placeholder="Enter your phone number"
    :required="true"
  />
</template>

<script setup>
const form = ref({
  phone: '',
  phone_country_code: ''
})
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | String | `''` | Phone number value (v-model) |
| `countryCode` | String | `''` | Country calling code (v-model:country-code) |
| `placeholder` | String | `'Enter phone number'` | Input placeholder text |
| `required` | Boolean | `false` | Whether field is required |
| `preferredCountries` | Array | `['IN','US','GB','AE']` | Countries shown at top of dropdown |
| `inputOptions` | Object | `{}` | Additional vue-tel-input options |
| `customClass` | String | `''` | Custom CSS class |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when phone number changes |
| `update:countryCode` | `string` | Emitted when country code changes (e.g., "+91") |
| `country-changed` | `object` | Emitted when country is selected (full country data) |

## Examples

### Required Field
```vue
<PhoneInput
  v-model="form.phone"
  v-model:country-code="form.phone_country_code"
  :required="true"
/>
```

### Optional Field
```vue
<PhoneInput
  v-model="form.phone"
  v-model:country-code="form.phone_country_code"
  :required="false"
/>
```

### Custom Preferred Countries
```vue
<PhoneInput
  v-model="form.phone"
  v-model:country-code="form.phone_country_code"
  :preferred-countries="['US', 'GB', 'CA', 'AU']"
/>
```

### With Country Change Handler
```vue
<template>
  <PhoneInput
    v-model="form.phone"
    v-model:country-code="form.phone_country_code"
    @country-changed="handleCountryChange"
  />
</template>

<script setup>
function handleCountryChange(country) {
  console.log('Country:', country.name)
  console.log('Dial Code:', country.dialCode)
  console.log('ISO:', country.iso2)
}
</script>
```

## API Payload Structure

### Simple Approach
```javascript
// Send to API
const payload = {
  phone: form.phone,
  phone_country_code: form.phone_country_code
}
```

### With E.164 Format
```javascript
import { combinePhoneNumber } from '@/utils/phone'

const payload = {
  phone: form.phone,
  phone_country_code: form.phone_country_code,
  phone_e164: combinePhoneNumber(form.phone_country_code, form.phone)
}
// Example: { phone: "9876543210", phone_country_code: "+91", phone_e164: "+919876543210" }
```

### Using Composable
```javascript
import { usePhoneInput } from '@/composables/usePhoneInput'

const { phone, phoneCountryCode, getPhoneData } = usePhoneInput()

// Later in form submission
const payload = {
  name: form.name,
  email: form.email,
  ...getPhoneData() // Adds phone, phone_country_code, phone_e164
}
```

## Utility Functions

### Validate Phone Number
```javascript
import { validatePhone } from '@/utils/phone'

const isValid = validatePhone('+919876543210', 'IN')
// Returns: true or false
```

### Format to E.164
```javascript
import { formatToE164 } from '@/utils/phone'

const formatted = formatToE164('9876543210', 'IN')
// Returns: "+919876543210"
```

### Parse Phone Number
```javascript
import { parsePhone } from '@/utils/phone'

const result = parsePhone('+919876543210')
// Returns: {
//   countryCode: "+91",
//   nationalNumber: "9876543210",
//   e164: "+919876543210",
//   isValid: true,
//   country: "IN"
// }
```

### Combine Country Code and Phone
```javascript
import { combinePhoneNumber } from '@/utils/phone'

const full = combinePhoneNumber('+91', '9876543210')
// Returns: "+919876543210"
```

## Styling Notes

The component uses semantic tokens for theming:
- Automatically adapts to light/dark theme
- No manual styling needed
- All semantic tokens from `assets/scss/main.scss`

### Custom Styling (if needed)
```vue
<PhoneInput custom-class="my-phone-input" />

<style scoped>
:deep(.my-phone-input) {
  border-radius: 12px; /* Custom border radius */
}
</style>
```

## Common Patterns

### Pre-fill from User Data
```vue
<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const form = ref({
  phone: '',
  phone_country_code: ''
})

onMounted(() => {
  if (userStore.user?.phone) {
    form.value.phone = userStore.user.phone
  }
  if (userStore.user?.phone_country_code) {
    form.value.phone_country_code = userStore.user.phone_country_code
  }
})
</script>
```

### Form Validation
```vue
<script setup>
import { validatePhone, combinePhoneNumber } from '@/utils/phone'

const form = ref({ phone: '', phone_country_code: '' })
const phoneError = ref('')

function validatePhoneField() {
  const fullNumber = combinePhoneNumber(form.value.phone_country_code, form.value.phone)
  
  if (!validatePhone(fullNumber)) {
    phoneError.value = 'Please enter a valid phone number'
    return false
  }
  
  phoneError.value = ''
  return true
}

function submitForm() {
  if (!validatePhoneField()) return
  
  // Proceed with submission
}
</script>
```

## Troubleshooting

### Phone Input Not Showing
- Check if `vue-tel-input` package is installed: `npm list vue-tel-input`
- Ensure component is properly imported (auto-imported in Nuxt)

### Country Flags Not Displaying
- The `vue-tel-input` package includes flag assets
- Flags are shown automatically via CSS sprites
- No additional configuration needed

### Dark Mode Issues
- Component uses semantic tokens, ensure they're defined in `assets/scss/main.scss`
- Check theme is being applied via `data-theme` attribute on `<html>`

### Validation Not Working
- Ensure `libphonenumber-js` is installed: `npm list libphonenumber-js`
- Import from `@/utils/phone` for validation functions

## Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for all screen sizes

## Accessibility

- Proper label association (use `<label>` with `for` attribute)
- Keyboard navigation in dropdown
- Screen reader friendly
- Focus indicators visible

---

For more details, see [PHONE_INPUT_IMPLEMENTATION.md](./PHONE_INPUT_IMPLEMENTATION.md)
