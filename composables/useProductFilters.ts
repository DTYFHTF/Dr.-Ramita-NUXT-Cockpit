import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProducts } from './useProducts';
import type { PriceRange, Category, Product, Pagination } from '@/types';

export function useProductFilters() {
  const router = useRouter();
  const route = useRoute();
  const { products, loading, error, fetchProducts, categories, fetchCategories, pagination } = useProducts();

  // Reactive state
  const sort = ref(route.query.sort?.toString() || '');
  const category = ref(route.query.category?.toString() || '');
  const priceMin = ref<number | null>(route.query.priceMin ? Number(route.query.priceMin) : null);
const priceMax = ref<number | null>(route.query.priceMax ? Number(route.query.priceMax) : null);
  const page = ref(Number(route.query.page) || 1);
  const inStock = ref(route.query.inStock?.toString() === 'true' || true);
  const showMoreCategories = ref(false);
  const onSale = ref(route.query.onSale?.toString() === 'true');

  // Price ranges configuration
  const priceRanges: PriceRange[] = [
    { label: "On Sale", min: null, max: null, onSale: true },
    { label: "₹0 - ₹500", min: 0, max: 500, onSale: false },
    { label: "₹500 - ₹1000", min: 500, max: 1000, onSale: false },
    { label: "₹1000 - ₹2000", min: 1000, max: 2000, onSale: false },
    { label: "₹2000 - ₹10000", min: 2000, max: 10000, onSale: false },
    { label: "₹10000+", min: 10000, max: null, onSale: false },
  ];

  // Computed properties
  const visibleCategories = computed<Category[]>(() => 
    showMoreCategories.value ? categories.value : categories.value.slice(0, 5)
  );

  const remainingCategories = computed(() => 
    Math.max(0, categories.value.length - 5)
  );

  const activeFilters = computed(() => {
  const filters = [];
  
  // Price filter
  if (priceMin.value !== null || priceMax.value !== null) {
    let label = "";
    if (onSale.value) {
      label = "On Sale";
    } else if (priceMin.value !== null && priceMax.value !== null) {
      label = `₹${priceMin.value} - ₹${priceMax.value}`;
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
      const cat = categories.value.find(c => c.id === category.value);
      if (cat) {
        filters.push({
          label: cat.name,
          remove: () => category.value = ''
        });
      }
    }

    if (inStock.value !== true) {
      filters.push({
        label: "Out of Stock",
        remove: () => inStock.value = true
      });
    }

    return filters;
  });

  // Methods
  const updateRouteAndFetch = () => {
    const query: Record<string, string> = {};

    if (sort.value) query.sort = sort.value;
    if (category.value) query.category = category.value;
    if (priceMin.value !== null) query.priceMin = priceMin.value.toString();
    if (priceMax.value !== null) query.priceMax = priceMax.value.toString();
    if (page.value > 1) query.page = page.value.toString();
    if (!inStock.value) query.inStock = 'false';
    if (onSale.value) query.onSale = 'true';

    router.replace({ query });
    fetchProducts(
      page.value,
      10,
      sort.value,
      category.value,
      priceMin.value,
      priceMax.value,
      inStock.value,
      onSale.value
    );
  };

  // Watchers
  watch(
    [sort, category, priceMin, priceMax, page, inStock, onSale],
    updateRouteAndFetch
  );

  const toggleSort = (type: 'price' | 'rating') => {
    sort.value = sort.value === `${type}_asc` ? `${type}_desc` : `${type}_asc`;
    page.value = 1;
  };

  const handlePriceRangeChange = (range: PriceRange) => {
    priceMin.value = range.min ?? 0;
    priceMax.value = range.max ?? 100000;
    onSale.value = range.onSale;
    page.value = 1;
  };

  const clearAllFilters = () => {
    sort.value = '';
    category.value = '';
    priceMin.value = 0;
    priceMax.value = 100000;
    inStock.value = true;
    onSale.value = false;
    page.value = 1;
  };

  // Initial fetch
  
onMounted(async () => {
  await fetchCategories();
  updateRouteAndFetch(); // Initial fetch
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

    // Computed
    visibleCategories,
    remainingCategories,
    activeFilters,
    priceRanges,

    // Methods
    toggleSort,
    toggleShowMoreCategories: () => showMoreCategories.value = !showMoreCategories.value,
    selectCategory: (id: string) => {
      category.value = id;
      page.value = 1;
    },
    handlePriceRangeChange,
    clearAllFilters
  };
}
