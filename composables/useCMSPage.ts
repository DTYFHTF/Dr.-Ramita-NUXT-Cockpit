import type { CMSPageResponse, CMSPage } from '@/types/cms';

/**
 * Composable to fetch and use CMS page content
 * Returns page data or null if not found
 */
export const useCMSPage = async (slug: string) => {
  const config = useRuntimeConfig();
  
  const { data: response, pending, error } = await useFetch<CMSPageResponse>(
    `${config.public.apiBase}/pages/${slug}`,
    {
      // Silently handle errors (will fall back to static content)
      onResponseError() {
        // No action needed - component will handle null data
      }
    }
  );

  // Extract page data from API response structure
  const pageData = computed<CMSPage | null>(() => response.value?.data || null);

  // Helper to format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return {
    page: pageData,
    pending,
    error,
    formatDate
  };
};
