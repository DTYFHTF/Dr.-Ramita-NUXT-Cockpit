/**
 * Composable for handling image URLs
 * Converts HTTP to HTTPS and handles relative URLs
 */
export const useImageUrl = () => {
  const config = useRuntimeConfig();
  
  /**
   * Get properly formatted image URL
   * @param imageUrl - The image URL from API
   * @param fallback - Fallback image path (default: /placeholder.jpg)
   * @returns Properly formatted HTTPS URL
   */
  const getImageUrl = (imageUrl: string | null | undefined, fallback: string = '/placeholder.jpg'): string => {
    if (!imageUrl) return fallback;
    
    // If it's already a full URL
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      // Force HTTPS for security and mixed content policy
      return imageUrl.replace('http://', 'https://');
    }
    
    // If it's a relative URL, prepend storage URL
    // Laravel stores file paths relative to the storage disk (e.g., "homepage-sections/banners/foo.png")
    // which are served at /storage/ on the API domain
    const baseUrl = (config.public.baseUrl as string || 'https://ayurveda-marketplace.test').replace(/\/$/, '');
    const storageUrl = `${baseUrl}/storage`;
    const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    
    return `${storageUrl}${cleanPath}`.replace('http://', 'https://');
  };
  
  /**
   * Handle image loading errors
   * @param event - Error event from img tag
   * @param fallback - Fallback image path
   */
  const handleImageError = (event: Event, fallback: string = '/placeholder.jpg') => {
    const img = event.target as HTMLImageElement;
    if (img.src !== fallback) {
      img.src = fallback;
    }
  };
  
  /**
   * Transform array of image URLs
   * @param images - Array of image URLs
   * @returns Array of properly formatted URLs
   */
  const transformImageUrls = (images: (string | null | undefined)[]): string[] => {
    return images.map(img => getImageUrl(img));
  };
  
  return {
    getImageUrl,
    handleImageError,
    transformImageUrls
  };
};
