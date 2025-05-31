import { ref } from "vue";

export function useProducts() {
  // useRuntimeConfig must be called inside this function
  const config = useRuntimeConfig();
  const API_BASE = config.public.apiBase;

  const products = ref<any[]>([]);
  const product = ref<any>(null);
  const loading = ref(false);
  const error = ref("");
  const categories = ref<any[]>([]);
  const pagination = ref<any>(null);

  async function fetchProducts(
    page = 1,
    perPage = 15,
    sort = "",
    category = "",
    priceMin: number | null = null,
    priceMax: number | null = null,
    inStock = true,
    onSale = false,
    searchQuery?: string, // <-- add searchQuery param
    rating?: number // <-- add rating param
  ) {
    loading.value = true;
    error.value = "";
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("per_page", String(perPage));
      if (sort) {
        if (sort === "price_asc") params.append("sort_by", "price");
        if (sort === "price_desc") {
          params.append("sort_by", "price");
          params.append("sort_order", "desc");
        }
        if (sort === "rating_asc") params.append("sort_by", "average_rating");
        if (sort === "rating_desc") {
          params.append("sort_by", "average_rating");
          params.append("sort_order", "desc");
        }
      }
      if (category) params.append("category", String(category));
      if (priceMin !== null && priceMin > 0)
        params.append("price_min", String(priceMin));
      if (priceMax !== null) params.append("price_max", String(priceMax));
      params.append("in_stock", String(inStock));
      if (onSale) params.append("on_sale", "true");
      if (searchQuery) params.append("search", searchQuery); // <-- add search param
      if (rating !== undefined && rating !== null) params.append("rating", String(rating));

      const response = (await $fetch(
        `${API_BASE}/products?${params.toString()}`,
        {
          headers: { Accept: "application/json" },
        }
      )) as any;
      products.value = Array.isArray(response) ? response : response.data;
      pagination.value = response.meta || null;
    } catch (e: any) {
      error.value =
        e?.data?.message || e?.message || "Failed to fetch products.";
    } finally {
      loading.value = false;
    }
  }

  async function fetchCategories() {
    try {
      const response = (await $fetch(`${API_BASE}/categories`, {
        headers: { Accept: "application/json" },
      })) as any;
      categories.value = Array.isArray(response) ? response : response.data;
    } catch (e: any) {
      categories.value = [];
    }
  } 

  async function fetchProduct(slug: string) {
    loading.value = true;
    error.value = "";
    product.value = null;
    try {
      const response = await $fetch(`${API_BASE}/products/${slug}`, {
        headers: { Accept: "application/json" },
      }) as any;
      // If the API response is wrapped in { data: ... }, unwrap it
      product.value = response.data ? response.data : response;
    } catch (e: any) {
      if (e?.status === 404) {
        error.value = "Product not found.";
      } else {
        error.value =
          e?.data?.message || e?.message || "Failed to fetch product.";
      }
      product.value = null;
    } finally {
      loading.value = false;
    }
  }

  return {
    products,
    product,
    loading,
    error,
    fetchProducts,
    fetchProduct,
    categories,
    fetchCategories,
    pagination,
  };
}