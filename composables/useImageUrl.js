// composables/useImageUrl.js
import { useRuntimeConfig } from '#imports'

export function useImageUrl() {
  const config = useRuntimeConfig();

  function getImageUrl(img, fallback = '/fallback.jpg', storagePrefix = '/storage/') {
    if (!img) return fallback;
    if (img.startsWith('http')) return img;
    if (img.startsWith('/')) return img;
    return `${config.public.baseUrl}${storagePrefix}${img}`;
  }

  return { getImageUrl };
}
