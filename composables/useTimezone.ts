export const useTimezone = () => {
  // Normalize timezone names for better display
  const formatTimezoneName = (timezone: string): string => {
    // Normalize Calcutta to Kolkata
    const normalized = timezone.replace('Asia/Calcutta', 'Asia/Kolkata')
    
    // Map of timezone identifiers to friendly names
    const timezoneMap: Record<string, string> = {
      'America/New_York': 'US Eastern',
      'America/Chicago': 'US Central',
      'America/Denver': 'US Mountain',
      'America/Los_Angeles': 'US Pacific',
      'Europe/London': 'UK',
      'Europe/Paris': 'Central Europe',
      'Asia/Dubai': 'Dubai',
      'Asia/Kolkata': 'India',
      'Asia/Kathmandu': 'Nepal',
      'Asia/Singapore': 'Singapore',
      'Asia/Tokyo': 'Japan',
      'Australia/Sydney': 'Australia',
      'Pacific/Auckland': 'New Zealand',
    }
    
    return timezoneMap[normalized] || normalized
  }

  // Get user's current timezone
  const getUserTimezone = (): string => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  return {
    formatTimezoneName,
    getUserTimezone
  }
}
