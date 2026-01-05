/**
 * Brand Configuration Composable
 * Centralized brand configuration for easy multi-brand support
 */
export function useBrand() {
  const config = useRuntimeConfig();

  return {
    // Brand Identity
    name: config.public.brandName || 'Rishipath',
    fullName: config.public.brandFullName || 'Dr. Ramita - Rishipath',
    companyName: config.public.brandCompanyName || 'Dr. Ramita Ayurveda Pvt. Ltd.',
    tagline: config.public.brandTagline || 'Authentic Ayurvedic Wellness',
    
    // Contact Information
    email: config.public.brandEmail || 'drramita@rishipath.org',
    supportEmail: config.public.brandSupportEmail || 'support@rishipath.org',
    ordersEmail: config.public.brandOrdersEmail || 'orders@rishipath.org',
    salesEmail: config.public.brandSalesEmail || 'sales@rishipath.org',
    
    phone: config.public.brandPhone || '+91 98765 43210',
    phoneDisplay: config.public.brandPhoneDisplay || '+91 987-654-3210',
    
    // Business Address
    address: {
      street: config.public.brandAddressStreet || '',
      city: config.public.brandAddressCity || 'Kathmandu',
      state: config.public.brandAddressState || 'Bagmati',
      country: config.public.brandAddressCountry || 'Nepal',
      zip: config.public.brandAddressZip || '44600',
    },
    
    // Social Media
    social: {
      facebook: config.public.brandFacebookUrl || '',
      instagram: config.public.brandInstagramUrl || '',
      twitter: config.public.brandTwitterUrl || '',
      youtube: config.public.brandYoutubeUrl || '',
      linkedin: config.public.brandLinkedinUrl || '',
    },
    
    // Branding Assets
    logo: config.public.brandLogo || '/rishipath-logo.png',
    logoAlt: config.public.brandLogoAlt || 'Rishipath Logo',
    favicon: config.public.brandFavicon || '/favicon.ico',
    
    // Theme Colors
    colors: {
      primary: config.public.brandColorPrimary || '#047857',
      secondary: config.public.brandColorSecondary || '#0891b2',
      accent: config.public.brandColorAccent || '#f59e0b',
    },
    
    // Legal & Copyright
    copyrightName: config.public.brandCopyrightName || 'Dr. Ramita Maharjan',
    copyrightText: config.public.brandCopyrightText || `© ${new Date().getFullYear()} Dr. Ramita Maharjan. All rights reserved.`,
    
    // SEO
    metaDescription: config.public.brandMetaDescription || 'Authentic Ayurvedic products and wellness solutions',
    metaKeywords: config.public.brandMetaKeywords || 'ayurveda, wellness, natural health, herbal products',
  };
}
