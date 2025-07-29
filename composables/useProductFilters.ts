

import { computed, ref, watch, onMounted, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProducts } from './useProducts';
import type { Product, Pagination } from '@/types';

// Extended types for the optimized backend response
interface OptimizedPriceRange {
  label: string;
  min: number | null;
  max: number | null;
  onSale: boolean;
  count: number;
}

interface PriceStats {
  min_price: number;
  max_price: number;
  avg_price: number;
  total_products: number;
  on_sale_count: number;
}

interface FilterOptions {
  priceRanges: OptimizedPriceRange[];
  categories: any[];
  priceStats: PriceStats;
}

interface Filter {
  label: string;
  remove: () => void;
}

export function useProductFilters(searchQuery?: Ref<string>) {
  const router = useRouter();
  const route = useRoute();

  const { products, loading, error, fetchProducts, pagination } = useProducts();

  // Reactive state
  const sort = ref(route.query.sort?.toString() || '');
  const category = ref(route.query.category?.toString() || '');
  const priceMin = ref<number | null>(route.query.price_min ? Number(route.query.price_min) : null);
  const priceMax = ref<number | null>(route.query.price_max ? Number(route.query.price_max) : null);
  const page = ref(Number(route.query.page) || 1);
  const inStock = ref(route.query.inStock?.toString() === 'false' ? false : true);
  const showMoreCategories = ref(false);
  const onSale = ref(route.query.onSale?.toString() === 'true');
  const rating = ref(route.query.rating ? Number(route.query.rating) : null);

  // Filter options from backend
  const filterOptions = ref<FilterOptions | null>(null);
  const filterOptionsLoading = ref(false);
  const filterOptionsError = ref<string | null>(null);

  // Computed properties
  const priceRanges = computed<OptimizedPriceRange[]>(() => 
    filterOptions.value?.priceRanges || []
  );

  const categories = computed<any[]>(() => 
    filterOptions.value?.categories || []
  );

  const visibleCategories = computed<any[]>(() => 
    showMoreCategories.value ? categories.value : categories.value.slice(0, 5)
  );

  const remainingCategories = computed(() => 
    Math.max(0, categories.value.length - 5)
  );

  const priceStats = computed(() => filterOptions.value?.priceStats);

  const activeFilters = computed(() => {
    const filters: Filter[] = [];
    // Price filter
    if (priceMin.value !== null || priceMax.value !== null || onSale.value) {
      let label = "";
      if (onSale.value) {
        const onSaleRange = priceRanges.value.find(r => r.onSale);
        label = onSaleRange ? onSaleRange.label : "On Sale";
      } else if (priceMin.value !== null && priceMax.value !== null) {
        const matchingRange = priceRanges.value.find(r => 
          r.min === priceMin.value && r.max === priceMax.value
        );
        label = matchingRange ? matchingRange.label : `₹${priceMin.value} - ₹${priceMax.value}`;
      } else if (priceMin.value !== null) {
        label = `₹${priceMin.value}+`;
      } else if (priceMax.value !== null) {
        label = `Up to ₹${priceMax.value}`;
      }
      filters.push({
        label,
        remove: () => {
          priceMin.value = null;
          priceMax.value = null;
          onSale.value = false;
        }
      });
    }

    if (category.value) {
      const cat = categories.value.find((c: any) => c.id === category.value);
      if (cat) {
        filters.push({
          label: `${cat.name} (${cat.products_count || 0})`,
          remove: () => { category.value = ''; }
        });
      }
    }

    if (inStock.value !== true) {
      filters.push({
        label: "Out of Stock",
        remove: () => { inStock.value = true; }
      });
    }

    return filters;
  });

  // Methods
  const fetchFilterOptions = async () => {
    filterOptionsLoading.value = true;
    filterOptionsError.value = null;
    try {
      const config = useRuntimeConfig();
      const API_BASE_URL = config.public.apiBase;
      const params = new URLSearchParams();
      if (searchQuery?.value) params.append('search', searchQuery.value);
      if (category.value) params.append('category', category.value);
      const response = await fetch(`${API_BASE_URL}/product-filters?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      filterOptions.value = data;
    } catch (err) {
      filterOptionsError.value = err instanceof Error ? err.message : 'Failed to fetch filter options';
      console.error('Error fetching filter options:', err);
    } finally {
      filterOptionsLoading.value = false;
    }
  };

  const updateRouteAndFetch = () => {
    const query: Record<string, string> = {};
    if (sort.value) query.sort = sort.value;
    if (category.value) query.category = category.value;
    if (priceMin.value !== null) query.priceMin = priceMin.value.toString();
    if (priceMax.value !== null) query.priceMax = priceMax.value.toString();
    query.page = page.value.toString();
    query.inStock = String(inStock.value);
    if (onSale.value) query.onSale = 'true';
    if (searchQuery && searchQuery.value) query.search = searchQuery.value;
    if (rating.value !== null) query.rating = rating.value.toString();
    router.replace({ query });
    fetchProducts(
      page.value,
      15,
      sort.value,
      category.value,
      priceMin.value,
      priceMax.value,
      inStock.value,
      onSale.value,
      searchQuery ? searchQuery.value : undefined,
      rating.value === null ? undefined : rating.value
    );
  };

  // Watchers
  watch(
    [sort, category, priceMin, priceMax, page, inStock, onSale, searchQuery ?? ref('')],
    ([_sort, _category, _priceMin, _priceMax, _page, _inStock, _onSale, _search], oldValues) => {
      if (searchQuery && _search !== oldValues?.[7]) {
        page.value = 1;
      }
      updateRouteAndFetch();
    }
  );

  watch(
    [searchQuery ?? ref(''), category],
    async () => {
      await fetchFilterOptions();
    }
  );

  const toggleSort = (type: 'display_price' | 'rating') => {
    sort.value = sort.value === `${type}_asc` ? `${type}_desc` : `${type}_asc`;
    page.value = 1;
  };

  const handlePriceRangeChange = (range: OptimizedPriceRange) => {
    if (range.onSale) {
      priceMin.value = null;
      priceMax.value = null;
      onSale.value = true;
    } else {
      priceMin.value = range.min;
      priceMax.value = range.max;
      onSale.value = false;
    }
    page.value = 1;
  };

  const clearAllFilters = () => {
    sort.value = '';
    category.value = '';
    priceMin.value = null;
    priceMax.value = null;
    inStock.value = true;
    onSale.value = false;
    page.value = 1;
    if (rating.value !== null) {
      rating.value = null;
    }
  };

  // Check if a price range is currently active
  const isPriceRangeActive = (range: OptimizedPriceRange) => {
    if (range.onSale) {
      return onSale.value;
    }
    return range.min === priceMin.value && range.max === priceMax.value;
  };

  // Initial fetch
  onMounted(async () => {
    await fetchFilterOptions();
    updateRouteAndFetch();
  });

  return {
    // State
    products,
    loading,
    error,
    categories,
    pagination,
    sort,
    category,
    priceMin,
    priceMax,
    page,
    inStock,
    onSale,
    showMoreCategories,
    rating,

    // Filter options
    filterOptions,
    filterOptionsLoading,
    filterOptionsError,
    priceRanges,
    priceStats,

    // Computed
    visibleCategories,
    remainingCategories,
    activeFilters,

    // Methods
    toggleSort,
    toggleShowMoreCategories: () => showMoreCategories.value = !showMoreCategories.value,
    selectCategory: (id: string) => {
      category.value = id;
      page.value = 1;
    },
    handlePriceRangeChange,
    clearAllFilters,
    fetchFilterOptions,
    isPriceRangeActive
  };
}
