import { ref, computed } from 'vue'

export interface Address {
  name: string
  phone: string
  street: string
  city: string
  state: string
  pincode: string
  landmark: string
}

export interface LocationPreferences {
  hasAddress: boolean
  preferredDeliverySlot: string
  address: Address
}

export const useUserSettings = () => {
  // Load location preferences from localStorage
  const getLocationPreferences = (): LocationPreferences | null => {
    if (import.meta.client) {
      const saved = localStorage.getItem('locationPrefs')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error('Failed to parse location preferences:', e)
        }
      }
    }
    return null
  }

  // Get default shipping address
  const getDefaultAddress = (): Address | null => {
    const prefs = getLocationPreferences()
    return prefs?.hasAddress ? prefs.address : null
  }

  // Get preferred delivery slot
  const getPreferredDeliverySlot = (): string => {
    const prefs = getLocationPreferences()
    return prefs?.preferredDeliverySlot || 'anytime'
  }

  // Get delivery slot label
  const getDeliverySlotLabel = (slot: string): string => {
    const slots: Record<string, string> = {
      morning: '9 AM - 12 PM',
      afternoon: '12 PM - 4 PM',
      evening: '4 PM - 8 PM',
      anytime: 'Flexible'
    }
    return slots[slot] || 'Flexible'
  }

  return {
    getLocationPreferences,
    getDefaultAddress,
    getPreferredDeliverySlot,
    getDeliverySlotLabel
  }
}
