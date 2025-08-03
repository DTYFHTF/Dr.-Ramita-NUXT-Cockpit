import { ref, computed, watch } from 'vue';

// Define interfaces for the Laravel API integration
interface ProductTag {
  id: number;
  name: string;
  slug: string;
}

interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

interface ExtendedProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  sale_price?: string | null;
  display_price: string;
  image: string;
  gallery?: string[];
  description?: string;
  short_description?: string;
  in_stock: boolean;
  stock_quantity?: number;
  sku?: string;
  category_id?: number;
  category?: ProductCategory;
  tags?: ProductTag[];
  average_rating?: number;
  review_count?: number;
  created_at?: string;
  updated_at?: string;
}

interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  products: ExtendedProduct[];
  children?: CategoryResponse[];
}

interface ProductsResponse {
  data: ExtendedProduct[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Define reactive states
const products = ref<ExtendedProduct[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const pagination = ref<{
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
} | null>(null);

// Search query
const searchQuery = ref('');

// Sample data for development fallback
const getSampleProducts = (categoryFilter?: string): ExtendedProduct[] => {
  const sampleProducts: ExtendedProduct[] = [
    {
      id: 1,
      name: "Organic Turmeric Capsules",
      slug: "organic-turmeric-capsules",
      price: "29.99",
      sale_price: "24.99",
      display_price: "24.99",
      image: "/api/placeholder/300/300",
      gallery: ["/api/placeholder/300/300"],
      description: "Premium organic turmeric supplement with 95% curcumin content",
      short_description: "Anti-inflammatory turmeric supplement",
      in_stock: true,
      stock_quantity: 50,
      sku: "TUR-001",
      category_id: 1,
      category: {
        id: 1,
        name: "Herbs & Supplements",
        slug: "herbs-supplements"
      },
      tags: [
        { id: 1, name: "organic", slug: "organic" },
        { id: 2, name: "anti-inflammatory", slug: "anti-inflammatory" }
      ],
      average_rating: 4.5,
      review_count: 28,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      name: "Ashwagandha Root Extract",
      slug: "ashwagandha-root-extract",
      price: "34.99",
      sale_price: null,
      display_price: "34.99",
      image: "/api/placeholder/300/300",
      gallery: ["/api/placeholder/300/300"],
      description: "Pure Ashwagandha root extract for stress relief and vitality",
      short_description: "Adaptogenic herb for stress management",
      in_stock: true,
      stock_quantity: 30,
      sku: "ASH-001",
      category_id: 1,
      category: {
        id: 1,
        name: "Herbs & Supplements",
        slug: "herbs-supplements"
      },
      tags: [
        { id: 3, name: "adaptogen", slug: "adaptogen" },
        { id: 4, name: "stress-relief", slug: "stress-relief" }
      ],
      average_rating: 4.3,
      review_count: 15,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 3,
      name: "Herbal Tea Blend",
      slug: "herbal-tea-blend",
      price: "19.99",
      sale_price: "16.99",
      display_price: "16.99",
      image: "/api/placeholder/300/300",
      gallery: ["/api/placeholder/300/300"],
      description: "Calming herbal tea blend with chamomile and lavender",
      short_description: "Relaxing herbal tea for evening",
      in_stock: true,
      stock_quantity: 75,
      sku: "TEA-001",
      category_id: 2,
      category: {
        id: 2,
        name: "Teas & Beverages",
        slug: "teas-beverages"
      },
      tags: [
        { id: 5, name: "relaxing", slug: "relaxing" },
        { id: 6, name: "herbal", slug: "herbal" }
      ],
      average_rating: 4.7,
      review_count: 42,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    }
  ];

  if (categoryFilter) {
    return sampleProducts.filter(product => 
      product.category?.slug === categoryFilter
    );
  }

  return sampleProducts;
};

export const useProductFilters = () => {
  const route = useRoute();
  const router = useRouter();

  // Fetch products function - simplified for slug-based Laravel API
  const fetchProducts = async (
    page: number = 1,
    perPage: number = 15,
    sort: string = '',
    category: string = '',
    priceMin: number | null = null,
    priceMax: number | null = null,
    inStock: boolean = true,
    onSale: boolean = false,
    rating: number | null = null
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const config = useRuntimeConfig();
      const apiBase = config.public.apiBase; // Laravel API base URL
      let data: ProductsResponse;

      // If a specific category is selected, use the Laravel category endpoint with slug
      if (category) {
        try {
          // Call the Laravel category endpoint using slug directly
          const categoryData = await $fetch(`${apiBase}/categories/${category}`, {
            headers: {
              'Accept': 'application/json'
            },
            timeout: 10000,
            retry: 1
          }) as CategoryResponse;

          // Get all products from the category
          let allProducts = categoryData.products || [];
          
          // Apply client-side filtering
          if (priceMin !== null) {
            allProducts = allProducts.filter(product => {
              const price = parseFloat(product.display_price);
              return price >= priceMin;
            });
          }
          
          if (priceMax !== null) {
            allProducts = allProducts.filter(product => {
              const price = parseFloat(product.display_price);
              return price <= priceMax;
            });
          }
          
          if (inStock) {
            allProducts = allProducts.filter(product => product.in_stock);
          }
          
          if (onSale) {
            allProducts = allProducts.filter(product => product.sale_price && product.sale_price !== "0");
          }
          
          if (rating !== null) {
            allProducts = allProducts.filter(product => (product.average_rating || 0) >= rating);
          }

          // Apply sorting
          if (sort) {
            switch (sort) {
              case 'price_asc':
                allProducts.sort((a, b) => parseFloat(a.display_price) - parseFloat(b.display_price));
                break;
              case 'price_desc':
                allProducts.sort((a, b) => parseFloat(b.display_price) - parseFloat(a.display_price));
                break;
              case 'rating':
                allProducts.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
                break;
              case 'newest':
                allProducts.sort((a, b) => b.id - a.id);
                break;
              case 'popular':
                allProducts.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
                break;
            }
          }

          // Apply client-side pagination
          const startIndex = (page - 1) * perPage;
          const endIndex = startIndex + perPage;
          const paginatedProducts = allProducts.slice(startIndex, endIndex);
          const totalProducts = allProducts.length;
          const lastPage = Math.ceil(totalProducts / perPage);

          // Create paginated response structure
          data = {
            data: paginatedProducts,
            current_page: page,
            last_page: lastPage,
            per_page: perPage,
            total: totalProducts
          };
        } catch (categoryError) {
          console.warn('Category endpoint failed, falling back to products endpoint:', categoryError);
          // Fallback to products endpoint with category filter
          data = await $fetch(`${apiBase}/products`, {
            query: {
              page,
              per_page: perPage,
              sort,
              category,
              price_min: priceMin,
              price_max: priceMax,
              in_stock: inStock,
              on_sale: onSale,
              rating,
              search: searchQuery.value || ''
            },
            headers: {
              'Accept': 'application/json'
            }
          }) as ProductsResponse;
        }
      } else {
        // Use the Laravel products endpoint for all products or search
        data = await $fetch(`${apiBase}/products`, {
          query: {
            page,
            per_page: perPage,
            sort,
            price_min: priceMin,
            price_max: priceMax,
            in_stock: inStock,
            on_sale: onSale,
            rating,
            search: searchQuery.value || ''
          },
          headers: {
            'Accept': 'application/json'
          }
        }) as ProductsResponse;
      }

      products.value = data.data || [];
      
      if (data.current_page !== undefined) {
        pagination.value = {
          current_page: data.current_page || page,
          last_page: data.last_page || 1,
          per_page: data.per_page || perPage,
          total: data.total || 0
        };
      }
      
    } catch (err) {
      console.error('Laravel API Error:', err);
      error.value = err instanceof Error ? err.message : 'Failed to fetch products';
      
      // Fallback to sample data for development
      if (process.dev) {
        console.warn('Using fallback sample data due to Laravel API unavailability');
        products.value = getSampleProducts(category);
        pagination.value = {
          current_page: page,
          last_page: 1,
          per_page: perPage,
          total: products.value.length
        };
      } else {
        products.value = [];
        pagination.value = null;
      }
    } finally {
      loading.value = false;
    }
  };

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

  // Categories for filter sidebar
  const categories = ref([
    {
      id: 1,
      name: 'Herbs & Supplements',
      slug: 'herbs-supplements',
      children: [
        { id: 11, name: 'Single Herbs', slug: 'single-herbs', parent_id: 1 },
        { id: 12, name: 'Herbal Blends', slug: 'herbal-blends', parent_id: 1 },
        { id: 13, name: 'Vitamins', slug: 'vitamins', parent_id: 1 }
      ]
    },
    {
      id: 2,
      name: 'Teas & Beverages',
      slug: 'teas-beverages',
      children: [
        { id: 21, name: 'Herbal Teas', slug: 'herbal-teas', parent_id: 2 },
        { id: 22, name: 'Green Teas', slug: 'green-teas', parent_id: 2 },
        { id: 23, name: 'Wellness Drinks', slug: 'wellness-drinks', parent_id: 2 }
      ]
    },
    {
      id: 3,
      name: 'Beauty & Skincare',
      slug: 'beauty-skincare',
      children: [
        { id: 31, name: 'Face Care', slug: 'face-care', parent_id: 3 },
        { id: 32, name: 'Body Care', slug: 'body-care', parent_id: 3 },
        { id: 33, name: 'Hair Care', slug: 'hair-care', parent_id: 3 }
      ]
    },
    {
      id: 4,
      name: 'Essential Oils',
      slug: 'essential-oils',
      children: [
        { id: 41, name: 'Pure Oils', slug: 'pure-oils', parent_id: 4 },
        { id: 42, name: 'Oil Blends', slug: 'oil-blends', parent_id: 4 },
        { id: 43, name: 'Diffuser Blends', slug: 'diffuser-blends', parent_id: 4 }
      ]
    }
  ]);

  // Update URL when filters change
  const updateUrl = () => {
    const query: Record<string, string> = {};
    
    if (sort.value) query.sort = sort.value;
    if (category.value) query.category = category.value;
    if (priceMin.value !== null) query.price_min = priceMin.value.toString();
    if (priceMax.value !== null) query.price_max = priceMax.value.toString();
    if (page.value > 1) query.page = page.value.toString();
    if (!inStock.value) query.inStock = 'false';
    if (onSale.value) query.onSale = 'true';
    if (rating.value !== null) query.rating = rating.value.toString();
    
    router.push({ query });
  };

  // Computed values
  const filteredProducts = computed(() => products.value);
  const hasFilters = computed(() => {
    return sort.value || category.value || priceMin.value !== null || 
           priceMax.value !== null || !inStock.value || onSale.value || 
           rating.value !== null;
  });

  // Methods
  const clearFilters = () => {
    sort.value = '';
    category.value = '';
    priceMin.value = null;
    priceMax.value = null;
    inStock.value = true;
    onSale.value = false;
    rating.value = null;
    page.value = 1;
    updateUrl();
  };

  const setCategory = (categorySlug: string) => {
    category.value = categorySlug;
    page.value = 1; // Reset to first page when changing category
    updateUrl();
  };

  const setSort = (sortValue: string) => {
    sort.value = sortValue;
    page.value = 1; // Reset to first page when changing sort
    updateUrl();
  };

  const setPriceRange = (min: number | null, max: number | null) => {
    priceMin.value = min;
    priceMax.value = max;
    page.value = 1; // Reset to first page when changing price range
    updateUrl();
  };

  const setPage = (pageNumber: number) => {
    page.value = pageNumber;
    updateUrl();
  };

  const setInStock = (value: boolean) => {
    inStock.value = value;
    page.value = 1; // Reset to first page when changing stock filter
    updateUrl();
  };

  const setOnSale = (value: boolean) => {
    onSale.value = value;
    page.value = 1; // Reset to first page when changing sale filter
    updateUrl();
  };

  const setRating = (ratingValue: number | null) => {
    rating.value = ratingValue;
    page.value = 1; // Reset to first page when changing rating filter
    updateUrl();
  };

  const setSearch = (searchValue: string) => {
    searchQuery.value = searchValue;
    page.value = 1; // Reset to first page when searching
  };

  // Watchers for reactive updates
  watch([sort, category, priceMin, priceMax, inStock, onSale, rating, page], () => {
    fetchProducts(
      page.value,
      15, // perPage
      sort.value,
      category.value,
      priceMin.value,
      priceMax.value,
      inStock.value,
      onSale.value,
      rating.value
    );
  }, { immediate: true });

  watch(searchQuery, (newValue) => {
    if (newValue) {
      fetchProducts(
        1, // Reset to first page for search
        15,
        sort.value,
        category.value,
        priceMin.value,
        priceMax.value,
        inStock.value,
        onSale.value,
        rating.value
      );
    }
  });

  return {
    // State
    products,
    loading,
    error,
    pagination,
    searchQuery,
    categories,
    
    // Reactive filters
    sort,
    category,
    priceMin,
    priceMax,
    page,
    inStock,
    onSale,
    rating,
    showMoreCategories,
    
    // Computed
    filteredProducts,
    hasFilters,
    
    // Methods
    fetchProducts,
    clearFilters,
    setCategory,
    setSort,
    setPriceRange,
    setPage,
    setInStock,
    setOnSale,
    setRating,
    setSearch,
    updateUrl
  };
};