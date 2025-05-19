import { ref } from "vue";

const API_BASE = "http://ayurveda-marketplace.test";

export function useProducts() {
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
    priceMax = 100000,
    inStock = true // Default to in-stock products
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
        if (sort === "rating_asc") params.append("sort_by", "rating");
        if (sort === "rating_desc") {
          params.append("sort_by", "rating");
          params.append("sort_order", "desc");
        }
      }
      if (category) params.append("category", String(category));

      // Add in_stock filter
      params.append("in_stock", String(inStock));

      const response = (await $fetch(
        `${API_BASE}/api/products?${params.toString()}`,
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
      const response = (await $fetch(`${API_BASE}/api/categories`, {
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
      product.value = await $fetch(`${API_BASE}/api/products/${slug}`, {
        headers: { Accept: "application/json" },
      });
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
