import { ref } from 'vue';

interface Promotion {
  id: number;
  name: string;
  slug: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  scope: 'global' | 'product' | 'category';
  start_at?: string;
  end_at?: string;
  products?: Array<{ id: number; name: string; slug: string }>;
  categories?: Array<{ id: number; name: string; slug: string }>;
}

export function usePromotion() {
  const config = useRuntimeConfig();
  const API_BASE = config.public.apiBase;
  
  const promotion = ref<Promotion | null>(null);
  const promotions = ref<Promotion[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Fetch all active promotions
   */
  async function fetchPromotions() {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await $fetch(`${API_BASE}/promotions`, {
        headers: { Accept: 'application/json' },
      }) as Promotion[];
      
      promotions.value = response;
      return response;
    } catch (e: any) {
      error.value = e?.data?.message || e?.message || 'Failed to fetch promotions';
      promotions.value = [];
      return [];
    } finally {
      loading.value = false;
    }
  }

  /**
   * Fetch a single promotion by slug
   */
  async function fetchPromotion(slug: string) {
    loading.value = true;
    error.value = null;
    promotion.value = null;
    
    try {
      const response = await $fetch(`${API_BASE}/promotions/${slug}`, {
        headers: { Accept: 'application/json' },
      }) as Promotion;
      
      promotion.value = response;
      return response;
    } catch (e: any) {
      if (e?.status === 404) {
        error.value = 'Promotion not found';
      } else {
        error.value = e?.data?.message || e?.message || 'Failed to fetch promotion';
      }
      promotion.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  }

  return {
    promotion,
    promotions,
    loading,
    error,
    fetchPromotion,
    fetchPromotions,
  };
}
