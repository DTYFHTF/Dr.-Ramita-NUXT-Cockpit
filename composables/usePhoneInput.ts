import { ref, watch } from 'vue'
import { combinePhoneNumber, formatToE164, validatePhone } from '@/utils/phone'

/**
 * Composable for managing phone input state with country code
 * @param initialPhone - Initial phone number value
 * @param initialCountryCode - Initial country code (e.g., "+91")
 */
export function usePhoneInput(initialPhone = '', initialCountryCode = '') {
  const phone = ref(initialPhone)
  const phoneCountryCode = ref(initialCountryCode)
  const phoneE164 = ref('')
  const isValidPhone = ref(false)

  // Update E.164 format whenever phone or country code changes
  watch([phone, phoneCountryCode], ([newPhone, newCode]) => {
    if (newPhone && newCode) {
      try {
        phoneE164.value = combinePhoneNumber(newCode, newPhone)
        // Validate the combined number
        isValidPhone.value = validatePhone(phoneE164.value)
      } catch (error) {
        phoneE164.value = newPhone
        isValidPhone.value = false
      }
    } else {
      phoneE164.value = ''
      isValidPhone.value = false
    }
  }, { immediate: true })

  /**
   * Get phone data for API submission
   * Includes both legacy phone field and new separated fields
   */
  const getPhoneData = () => {
    return {
      phone: phone.value || null,
      phone_country_code: phoneCountryCode.value || null,
      phone_e164: phoneE164.value || null,
    }
  }

  /**
   * Reset phone input state
   */
  const reset = () => {
    phone.value = ''
    phoneCountryCode.value = ''
    phoneE164.value = ''
    isValidPhone.value = false
  }

  /**
   * Set phone values
   */
  const setPhone = (newPhone: string, newCountryCode?: string) => {
    phone.value = newPhone
    if (newCountryCode) {
      phoneCountryCode.value = newCountryCode
    }
  }

  return {
    phone,
    phoneCountryCode,
    phoneE164,
    isValidPhone,
    getPhoneData,
    reset,
    setPhone,
  }
}
