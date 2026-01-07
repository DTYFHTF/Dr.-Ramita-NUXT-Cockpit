// composables/useSocialMedia.ts

export interface SocialLink {
  name: string;
  icon: string; // mdi: format icon
  url: string;
  color: string;
  ariaLabel: string;
}

export const useSocialMedia = () => {
  const socialLinks: SocialLink[] = [
    {
      name: 'Facebook',
      icon: 'mdi:facebook',
      url: 'https://facebook.com/rishipath',
      color: '#1877F2',
      ariaLabel: 'Follow us on Facebook',
    },
    {
      name: 'Instagram',
      icon: 'mdi:instagram',
      url: 'https://instagram.com/rishipath',
      color: '#E4405F',
      ariaLabel: 'Follow us on Instagram',
    },
    {
      name: 'Twitter',
      icon: 'mdi:twitter',
      url: 'https://twitter.com/rishipath',
      color: '#1DA1F2',
      ariaLabel: 'Follow us on Twitter',
    },
    {
      name: 'LinkedIn',
      icon: 'mdi:linkedin',
      url: 'https://linkedin.com/company/rishipath',
      color: '#0A66C2',
      ariaLabel: 'Connect with us on LinkedIn',
    },
    {
      name: 'YouTube',
      icon: 'mdi:youtube',
      url: 'https://youtube.com/@rishipath',
      color: '#FF0000',
      ariaLabel: 'Subscribe to our YouTube channel',
    },
    {
      name: 'WhatsApp',
      icon: 'mdi:whatsapp',
      url: 'https://wa.me/919876543210', // Update with actual WhatsApp number
      color: '#25D366',
      ariaLabel: 'Chat with us on WhatsApp',
    },
  ];

  return {
    socialLinks,
  };
};
