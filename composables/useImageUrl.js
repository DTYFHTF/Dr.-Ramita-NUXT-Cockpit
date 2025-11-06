// composables/useImageUrl.js
import { useRuntimeConfig } from '#imports'

export function useImageUrl() {
  const config = useRuntimeConfig();

  function getImageUrl(img, fallback = '/fallback.jpg', storagePrefix = '/storage/') {
    if (!img) return fallback;

    // Check if it's already a full URL (http or https)
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    if (img.startsWith('/')) return img;
    return `${config.public.baseUrl}${storagePrefix}${img}`;
  }

  return { getImageUrl };
}
