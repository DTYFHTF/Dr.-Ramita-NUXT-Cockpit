/**
 * Brand Configuration Composable
 * Centralized brand configuration for easy multi-brand support
 */
export function useBrand() {
  const config = useRuntimeConfig();

  return {
    // Brand Identity
    name: config.public.brandName || 'Rishipath',
    fullName: config.public.brandFullName || 'Rishipath',
    companyName: config.public.brandCompanyName || 'Rishipath International Foundation',
    tagline: config.public.brandTagline || 'Tapa | Svadhyaya | Dhyan',
    
    // Contact Information
    email: config.public.brandEmail || 'contact@rishipath.org',
    supportEmail: config.public.brandSupportEmail || 'support@rishipath.org',
    ordersEmail: config.public.brandOrdersEmail || 'orders@rishipath.org',
    salesEmail: config.public.brandSalesEmail || 'sales@rishipath.org',
    
    phone: config.public.brandPhone || '+91 81974 62744',
    phoneDisplay: config.public.brandPhoneDisplay || '+91 81974 62744',
    
    // Business Address
    address: {
      street: config.public.brandAddressStreet || 'RISHIPATH ASHRAM 1/162, Rishiteertham, Thammapuram',
      city: config.public.brandAddressCity || 'Bengaluru',
      state: config.public.brandAddressState || 'Karnataka',
      country: config.public.brandAddressCountry || 'India',
      zip: config.public.brandAddressZip || 'TN-635118',
    },
    
    // Social Media (used by useSocialMedia composable)
    social: {
      facebook: config.public.brandFacebookUrl || '',
      instagram: config.public.brandInstagramUrl || '',
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
    copyrightName: config.public.brandCopyrightName || 'Rishipath International Foundation',
    copyrightText: config.public.brandCopyrightText || `© ${new Date().getFullYear()} Rishipath International Foundation. All rights reserved.`,
    
    // SEO
    metaDescription: config.public.brandMetaDescription || 'Authentic Ayurvedic products and wellness solutions',
    metaKeywords: config.public.brandMetaKeywords || 'ayurveda, wellness, natural health, herbal products',
  };
}
