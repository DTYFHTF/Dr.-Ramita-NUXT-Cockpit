import { parsePhoneNumber, isValidPhoneNumber, type CountryCode } from 'libphonenumber-js'

/**
 * Parse a phone number string and extract country code and national number
 * @param phoneNumber - Full phone number (e.g., "+911234567890" or "1234567890")
 * @param defaultCountry - Default country code if not in international format (e.g., "IN")
 * @returns Object with countryCode, nationalNumber, e164, and isValid
 */
export function parsePhone(phoneNumber: string, defaultCountry: CountryCode = 'IN') {
  if (!phoneNumber) {
    return {
      countryCode: '',
      nationalNumber: '',
      e164: '',
      isValid: false,
    }
  }

  try {
    const parsed = parsePhoneNumber(phoneNumber, defaultCountry)
    
    return {
      countryCode: `+${parsed.countryCallingCode}`,
      nationalNumber: parsed.nationalNumber,
      e164: parsed.format('E.164'),
      isValid: parsed.isValid(),
      country: parsed.country,
    }
  } catch (error) {
    // If parsing fails, return invalid
    return {
      countryCode: '',
      nationalNumber: phoneNumber,
      e164: '',
      isValid: false,
    }
  }
}

/**
 * Validate a phone number
 * @param phoneNumber - Phone number to validate
 * @param countryCode - ISO country code (e.g., "IN", "US")
 * @returns Boolean indicating if the phone number is valid
 */
export function validatePhone(phoneNumber: string, countryCode?: CountryCode): boolean {
  if (!phoneNumber) return false
  
  try {
    return isValidPhoneNumber(phoneNumber, countryCode)
  } catch (error) {
    return false
  }
}

/**
 * Format phone number to E.164 format (+[country code][number])
 * @param phoneNumber - Phone number to format
 * @param countryCode - ISO country code
 * @returns E.164 formatted phone number or original if invalid
 */
export function formatToE164(phoneNumber: string, countryCode: CountryCode = 'IN'): string {
  try {
    const parsed = parsePhoneNumber(phoneNumber, countryCode)
    return parsed.format('E.164')
  } catch (error) {
    return phoneNumber
  }
}

/**
 * Format phone number to international format (+[country code] [formatted number])
 * @param phoneNumber - Phone number to format
 * @param countryCode - ISO country code
 * @returns Internationaly formatted phone number
 */
export function formatInternational(phoneNumber: string, countryCode: CountryCode = 'IN'): string {
  try {
    const parsed = parsePhoneNumber(phoneNumber, countryCode)
    return parsed.formatInternational()
  } catch (error) {
    return phoneNumber
  }
}

/**
 * Extract country calling code from a phone number
 * @param phoneNumber - Phone number with country code
 * @returns Country calling code with + prefix (e.g., "+91")
 */
export function extractCountryCode(phoneNumber: string): string {
  try {
    const parsed = parsePhoneNumber(phoneNumber)
    return `+${parsed.countryCallingCode}`
  } catch (error) {
    return ''
  }
}

/**
 * Combine country code and phone number into E.164 format
 * @param countryCode - Country calling code (e.g., "+91")
 * @param phoneNumber - Phone number without country code
 * @returns E.164 formatted phone number
 */
export function combinePhoneNumber(countryCode: string, phoneNumber: string): string {
  if (!countryCode || !phoneNumber) return phoneNumber

  // Remove + from country code if present
  const cleanCode = countryCode.replace('+', '')
  // Remove any spaces or special characters from phone number
  const cleanPhone = phoneNumber.replace(/[\s-()]/g, '')
  
  return `+${cleanCode}${cleanPhone}`
}
