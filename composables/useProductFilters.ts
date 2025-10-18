import { computed, ref, watch, onMounted, nextTick, type Ref } from 'vue';
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
  priceStats: PriceStats;
  categories: any[];
}

interface Filter {
  label: string;
  remove: () => void;
}

export function useProductFilters(searchQuery?: Ref<string>, currentCategoryId?: Ref<string | null>) {
  const router = useRouter();
  const route = useRoute();

  const { products, loading, error, fetchProducts, pagination } = useProducts();

  // Reactive state - removed category since it's handled by routing
  const sort = ref((route?.query?.sort?.toString()) || '');
  const priceMin = ref<number | null>(route?.query?.price_min ? Number(route.query.price_min) : null);
  const priceMax = ref<number | null>(route?.query?.price_max ? Number(route.query.price_max) : null);
  const page = ref(Number(route?.query?.page) || 1);
  const inStock = ref(route?.query?.inStock?.toString() === 'false' ? false : true);
  const onSale = ref(route?.query?.onSale?.toString() === 'true');
  const rating = ref(route?.query?.rating ? Number(route.query.rating) : null);
  
  // Collection support for featured/bestselling
  const collection = ref(route?.query?.collection?.toString() || '');
  
  // Promotion support - IMPORTANT: Initialize from route query immediately
  const promotion = ref(route?.query?.promotion?.toString() || '');

  // Filter options from backend
  const filterOptions = ref<FilterOptions | null>(null);
  const filterOptionsLoading = ref(false);
  const filterOptionsError = ref<string | null>(null);

  // Computed properties
  const priceRanges = computed<OptimizedPriceRange[]>(() => 
    filterOptions.value?.priceRanges || []
  );

  const priceStats = computed(() => filterOptions.value?.priceStats);

  const categoriesWithCounts = computed(() => 
    filterOptions.value?.categories || []
  );

  // Collection-based page titles
  const pageTitle = computed(() => {
    if (promotion.value) return `${promotion.value} - Promotion Products`;
    if (collection.value === 'featured') return 'Top Featured Products';
    if (collection.value === 'bestselling') return 'Best Selling Products';
    if (collection.value === 'onsale') return 'On Sale Products';
    return 'All Products';
  });

  const activeFilters = computed(() => {
    // Add safety checks for undefined refs
    if (!priceMin.value && !priceMax.value && !onSale.value && !rating.value && inStock.value === true) {
      return [];
    }

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

    // Rating filter
    if (rating.value !== null) {
      filters.push({
        label: `Rating: ${rating.value}+ stars`,
        remove: () => { rating.value = null; }
      });
    }

    // Stock filter
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
      // Pass current non-price contextual filters for accurate counts
      if (inStock.value !== undefined) params.append('inStock', String(inStock.value));
      if (onSale.value) params.append('onSale', 'true');
      // Pass price range filters for context-aware category counts
      if (priceMin.value !== null) params.append('priceMin', String(priceMin.value));
      if (priceMax.value !== null) params.append('priceMax', String(priceMax.value));
      
      // Category context: prioritize currentCategoryId prop, then route.query.category
      // This ensures category pages pass their context correctly
      const categoryId = currentCategoryId?.value || (route.query.category as string) || '';
      if (categoryId) params.append('category', categoryId);

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
    // Add safety check for router
    if (!router) return;

    // Only update route if we're on a product or category page
    const currentPath = route.path;
    const isProductPage = currentPath.startsWith('/products') || currentPath.startsWith('/category');
    if (!isProductPage) {
      // Don't pollute query params on non-product pages
      return;
    }

    // Preserve promotion parameter from either the current route or the local ref.
    const promotionFromRoute = route?.query?.promotion ? String(route.query.promotion) : '';
    const mergedPromotion = promotionFromRoute || (promotion.value ? String(promotion.value) : '');

    // When navigating with a promotion parameter, clear category filters to show ALL products in the promotion
    const query: Record<string, string> = {};
    
    if (mergedPromotion) {
      // Promotion mode: only preserve promotion and page, clear other filters
      query.promotion = mergedPromotion;
      query.page = page.value.toString();
    } else {
      // Normal mode: preserve all filters
      const currentQuery = { ...route.query } as Record<string, any>;
      Object.assign(query, Object.fromEntries(Object.entries(currentQuery).map(([k, v]) => [k, String(v)])));
      
      if (sort.value) query.sort = sort.value; else delete query.sort;
      if (priceMin.value !== null) query.price_min = priceMin.value.toString(); else delete query.price_min;
      if (priceMax.value !== null) query.price_max = priceMax.value.toString(); else delete query.price_max;
      query.page = page.value.toString();
      query.inStock = String(inStock.value);
      
      if (onSale.value) {
        query.onSale = 'true';
        query.on_sale = 'true';
      } else {
        delete query.onSale;
        delete query.on_sale;
      }
      if (searchQuery && searchQuery.value) query.search = searchQuery.value; else delete query.search;
      if (rating.value !== null) query.rating = rating.value.toString(); else delete query.rating;
      if (collection.value) query.collection = collection.value; else delete query.collection;
    }

    // Use replace to update only the query on the current route path
    router.replace({ query });
    
    // Get category from route params if on category page
    const categorySlug = (route?.params?.slug as string) || '';
    
    fetchProducts(
      page.value,
      15,
      sort.value,
      categorySlug, // Use route param for category
      priceMin.value,
      priceMax.value,
      inStock.value,
      onSale.value,
      searchQuery ? searchQuery.value : undefined,
      rating.value === null ? undefined : rating.value,
      collection.value || undefined, // Pass collection parameter
      promotion.value || undefined // Pass promotion parameter
    );
  };

  // Watchers
  watch(
    [sort, priceMin, priceMax, page, inStock, onSale, rating, collection, promotion, searchQuery ?? ref('')],
    ([_sort, _priceMin, _priceMax, _page, _inStock, _onSale, _rating, _collection, _promotion, _search], oldValues) => {
      if (searchQuery && _search !== oldValues?.[9]) {
        page.value = 1;
      }
      updateRouteAndFetch();
    }
  );

  // Watch route.query.promotion and sync to local ref
  watch(
    () => route?.query?.promotion,
    (newPromotion) => {
      const promotionStr = newPromotion ? String(newPromotion) : '';
      if (promotionStr !== promotion.value) {
        promotion.value = promotionStr;
        console.log('[useProductFilters] Synced promotion from route:', promotionStr);
      }
    },
    { immediate: true }
  );

  watch(
    [searchQuery ?? ref('')],
    async () => {
      await fetchFilterOptions();
    }
  );

  // Watch price filters to refresh category counts when they change
  watch(
    [priceMin, priceMax, inStock, onSale],
    async () => {
      await fetchFilterOptions();
    }
  );

  const toggleSort = (type: string) => {
    sort.value = sort.value === `${type}_asc` ? `${type}_desc` : `${type}_asc`;
    page.value = 1;
  };

  const handlePriceRangeChange = async (range: OptimizedPriceRange) => {
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
    // Refresh filter options to get updated category counts
    await fetchFilterOptions();
  };

  const handleRatingChange = (ratingValue: number | null) => {
    rating.value = ratingValue;
    page.value = 1;
  };

  const handleStockChange = (stockValue: boolean) => {
    inStock.value = stockValue;
    page.value = 1;
  };

  const clearAllFilters = () => {
    sort.value = '';
    priceMin.value = null;
    priceMax.value = null;
    inStock.value = true;
    onSale.value = false;
    rating.value = null;
    promotion.value = '';
    page.value = 1;
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
    // Add delay to ensure route is fully initialized
    await nextTick();
    await fetchFilterOptions();
    updateRouteAndFetch();
  });

  return {
    // State
    products,
    loading,
    error,
    pagination,
    sort,
    priceMin,
    priceMax,
    page,
    inStock,
    onSale,
    rating,
    collection,
    promotion,

    // Legacy compatibility - add empty/default values for removed category features
    categories: computed(() => []),
    category: ref(''),
    showMoreCategories: ref(false),
    visibleCategories: computed(() => []),
    remainingCategories: computed(() => 0),
    hierarchicalCategories: computed(() => []),

    // Categories with product counts from product-filters endpoint
    categoriesWithCounts,

    // Filter options
    filterOptions,
    filterOptionsLoading,
    filterOptionsError,
    priceRanges,
    priceStats,

    // Computed
    activeFilters,
    pageTitle,

    // Methods
    toggleSort,
    handlePriceRangeChange,
    handleRatingChange,
    handleStockChange,
    clearAllFilters,
    fetchFilterOptions,
    isPriceRangeActive,
    
    // Legacy compatibility methods
    toggleShowMoreCategories: () => {},
    selectCategory: () => {}
  };
}
