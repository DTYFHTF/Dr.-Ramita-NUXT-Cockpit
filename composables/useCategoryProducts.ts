import { ref, computed } from 'vue';
import type { Product, Category } from '@/types';

interface CategoryWithProducts {
  id: string | number;
  name: string;
  slug: string;
  products_count: number;
  products: Product[];
  children?: CategoryWithProducts[];
  parent_id?: string | number | null;
  level?: number;
  icon?: string;
}

interface ProductFilters {
  search?: string;
  priceMin?: number;
  priceMax?: number;
  onSale?: boolean;
  inStock?: boolean;
  rating?: number;
  sort?: string;
  page?: number;
  perPage?: number;
}

export function useCategoryProducts() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const categoryData = ref<CategoryWithProducts | null>(null);
  const filteredProducts = ref<Product[]>([]);

  // Fetch category with its products
  const fetchCategoryProducts = async (categoryId: string, filters: ProductFilters = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const config = useRuntimeConfig();
      const API_BASE_URL = config.public.apiBase;
      
      // Fetch category data including products
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      categoryData.value = data;
      
      // Apply filters to the products
      applyFilters(data.products || [], filters);
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch category products';
      categoryData.value = null;
      filteredProducts.value = [];
    } finally {
      loading.value = false;
    }
  };

  // Apply client-side filters to products
  const applyFilters = (products: Product[], filters: ProductFilters) => {
    let filtered = [...products];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Price range filter
    if (filters.priceMin !== undefined) {
      filtered = filtered.filter(product => Number(product.display_price ?? product.price) >= filters.priceMin!);
    }
    if (filters.priceMax !== undefined) {
      filtered = filtered.filter(product => Number(product.display_price ?? product.price) <= filters.priceMax!);
    }

    // On sale filter - use backend-provided display_sale_price or price_breakdown
    if (filters.onSale) {
      filtered = filtered.filter(product => {
        if (product.price_breakdown?.discount_amount && product.price_breakdown.discount_amount > 0) return true;
        const ds = (product as any).display_sale_price;
        if (ds && Number(ds) < Number(product.display_price ?? product.price)) return true;
        return false;
      });
    }

    // Stock filter
    if (filters.inStock === false) {
      filtered = filtered.filter(product => product.stock === 0);
    } else if (filters.inStock === true) {
      filtered = filtered.filter(product => product.stock > 0);
    }

    // Rating filter
    if (filters.rating) {
      filtered = filtered.filter(product => 
        product.average_rating !== undefined && product.average_rating >= filters.rating!
      );
    }

    // Sort products
    if (filters.sort) {
      const [field, direction] = filters.sort.split('_');
      const multiplier = direction === 'desc' ? -1 : 1;

      filtered.sort((a, b) => {
        if (field === 'display_price') {
          return (Number(a.display_price ?? a.price) - Number(b.display_price ?? b.price)) * multiplier;
        } else if (field === 'rating') {
          const aRating = a.average_rating || 0;
          const bRating = b.average_rating || 0;
          return (aRating - bRating) * multiplier;
        } else if (field === 'name') {
          return a.name.localeCompare(b.name) * multiplier;
        }
        return 0;
      });
    }

    // Apply pagination
    if (filters.page && filters.perPage) {
      const startIndex = (filters.page - 1) * filters.perPage;
      const endIndex = startIndex + filters.perPage;
      filtered = filtered.slice(startIndex, endIndex);
    }

    filteredProducts.value = filtered;
  };

  // Computed properties
  const totalProducts = computed(() => categoryData.value?.products?.length || 0);
  const hasProducts = computed(() => filteredProducts.value.length > 0);
  const category = computed(() => categoryData.value);

  // Calculate pagination info
  const getPaginationInfo = (filters: ProductFilters) => {
    const total = categoryData.value?.products?.length || 0;
    const perPage = filters.perPage || 15;
    const currentPage = filters.page || 1;
    
    return {
      total,
      perPage,
      currentPage,
      totalPages: Math.ceil(total / perPage),
      hasNextPage: currentPage * perPage < total,
      hasPrevPage: currentPage > 1
    };
  };

  return {
    // State
    loading,
    error,
    categoryData,
    filteredProducts,
    
    // Computed
    totalProducts,
    hasProducts,
    category,
    
    // Methods
    fetchCategoryProducts,
    applyFilters,
    getPaginationInfo
  };
}
