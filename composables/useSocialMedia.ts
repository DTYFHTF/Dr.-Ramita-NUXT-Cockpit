// composables/useSocialMedia.ts

export interface SocialLink {
  name: string;
  icon: string; // mdi: format icon
  url: string;
  color: string;
  ariaLabel: string;
}

export const useSocialMedia = () => {
  const brand = useBrand();

  // Build social links array from brand config (reads from .env)
  const socialLinks: SocialLink[] = [];

  if (brand.social.facebook) {
    socialLinks.push({
      name: 'Facebook',
      icon: 'mdi:facebook',
      url: brand.social.facebook,
      color: '#1877F2',
      ariaLabel: 'Follow us on Facebook',
    });
  }

  if (brand.social.instagram) {
    socialLinks.push({
      name: 'Instagram',
      icon: 'mdi:instagram',
      url: brand.social.instagram,
      color: '#E4405F',
      ariaLabel: 'Follow us on Instagram',
    });
  }

  if (brand.social.youtube) {
    socialLinks.push({
      name: 'YouTube',
      icon: 'mdi:youtube',
      url: brand.social.youtube,
      color: '#FF0000',
      ariaLabel: 'Subscribe to our YouTube channel',
    });
  }

  if (brand.social.linkedin) {
    socialLinks.push({
      name: 'LinkedIn',
      icon: 'mdi:linkedin',
      url: brand.social.linkedin,
      color: '#0A66C2',
      ariaLabel: 'Connect with us on LinkedIn',
    });
  }

  // WhatsApp using brand phone (convert to WhatsApp link format)
  if (brand.phone) {
    const whatsappNumber = brand.phone.replace(/[^0-9]/g, ''); // Remove non-numeric chars
    socialLinks.push({
      name: 'WhatsApp',
      icon: 'mdi:whatsapp',
      url: `https://wa.me/${whatsappNumber}`,
      color: '#25D366',
      ariaLabel: 'Chat with us on WhatsApp',
    });
  }

  return {
    socialLinks,
  };
};
