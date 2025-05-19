<template>
  <div class="container py-4">
    <div class="row">
      <!-- Sidebar -->
      <aside class="col-12 col-md-3 mb-4 mb-md-0">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <h5 class="card-title mb-3">Filter & Sort</h5>
            <div class="mb-3">
              <label class="form-label mb-1">Sort by:</label>
              <select
                v-model="sort"
                class="form-select form-select-sm"
                @change="onSortChange"
              >
                <option value="">Default</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Rating: High to Low</option>
                <option value="rating_asc">Rating: Low to High</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label mb-1">Category:</label>
              <select
                v-model="category"
                class="form-select form-select-sm"
                @change="onCategoryChange"
              >
                <option value="">All</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label mb-1">Price:</label>
              <input
                type="range"
                class="form-range"
                min="minPrice"
                :max="maxPrice"
                v-model.number="priceMax"
                @input="onPriceChange"
              />
              <span class="ms-2">Up to ₹{{ priceMax }}</span>
            </div>
          </div>
        </div>
      </aside>
      <!-- Main content -->
      <div class="col-12 col-md-9">
        <h1 class="mb-4">Products</h1>
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else-if="error" class="alert alert-danger text-center">
          {{ error }}
        </div>
        <div
          v-else-if="products.length === 0"
          class="alert alert-info text-center"
        >
          No products found.
        </div>
        <div class="row g-4">
          <div
            v-for="product in paginatedProducts"
            :key="product.id"
            class="col-12 col-sm-6 col-lg-4"
          >
            <div class="card h-100 product-card border-0 shadow-sm">
              <NuxtLink
                :to="`/products/${product.slug}`"
                class="text-decoration-none text-dark d-flex flex-column h-100"
              >
                <img
                  :src="imageUrl(product.image)"
                  :alt="product.name"
                  class="card-img-top object-fit-cover"
                  style="height: 180px; background: #f8f8f8"
                />
                <div class="card-body d-flex flex-column align-items-start p-3">
                  <h3 class="card-title fs-6 fw-semibold mb-2">
                    {{ product.name }}
                  </h3>
                  <div class="mb-2 d-flex align-items-center gap-2">
                    <span
                      v-if="
                        product.sale_price && product.sale_price < product.price
                      "
                    >
                      <span class="text-decoration-line-through text-muted"
                        >${{ product.price }}</span
                      >
                      <span class="ms-1 text-danger fw-bold"
                        >${{ product.sale_price }}</span
                      >
                    </span>
                    <span v-else class="product-price fw-bold text-success"
                      >${{ product.price }}</span
                    >
                  </div>
                  <div class="mb-2">
                    <span
                      v-html="
                        starRating(product.avg_rating || product.rating || 0)
                      "
                    ></span>
                    <span class="ms-1 text-muted"
                      >({{
                        (product.avg_rating || product.rating || 0).toFixed(1)
                      }})</span
                    >
                  </div>
                  <span
                    class="badge mb-2"
                    :class="
                      product.in_stock ?? product.stock > 0
                        ? 'bg-success'
                        : 'bg-danger'
                    "
                  >
                    {{
                      product.in_stock ?? product.stock > 0
                        ? "In stock"
                        : "Out of stock"
                    }}
                  </span>
                  <button
                    class="btn btn-outline-success w-100 mt-auto"
                    :disabled="!(product.in_stock ?? product.stock > 0)"
                  >
                    Add to Cart
                  </button>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
        <nav v-if="totalPages > 1" class="mt-4 d-flex justify-content-center">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: page === 1 }">
              <button
                class="page-link"
                @click="goToPage(page - 1)"
                :disabled="page === 1"
              >
                Previous
              </button>
            </li>
            <li
              v-for="p in totalPages"
              :key="p"
              class="page-item"
              :class="{ active: p === page }"
            >
              <button class="page-link" @click="goToPage(p)">{{ p }}</button>
            </li>
            <li class="page-item" :class="{ disabled: page === totalPages }">
              <button
                class="page-link"
                @click="goToPage(page + 1)"
                :disabled="page === totalPages"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProducts } from "@/composables/useProducts";
import { onMounted, ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const { products, loading, error, fetchProducts, categories, fetchCategories } = useProducts();
const route = useRoute();
const router = useRouter();

const sort = ref(route.query.sort || "");
const category = ref(route.query.category || "");
const priceMax = ref(Number(route.query.priceMax) || 10000);
const page = ref(Number(route.query.page) || 1);
const perPage = 9;

const minPrice = 0;
const maxPrice = 10000;

onMounted(() => {
  fetchProducts();
  fetchCategories();
});

watch([sort, category, priceMax, page], () => {
  router.replace({
    query: {
      ...route.query,
      sort: sort.value || undefined,
      category: category.value || undefined,
      priceMax: priceMax.value || undefined,
      page: page.value || undefined,
    },
  });
});

const filteredProducts = computed(() => {
  let filtered = products.value;
  if (category.value)
    filtered = filtered.filter(
      (p) => String(p.category_id) === String(category.value)
    );
  filtered = filtered.filter(
    (p) => Number(p.sale_price || p.price) <= priceMax.value
  );
  return filtered;
});

const sortedProducts = computed(() => {
  let arr = [...filteredProducts.value];
  if (sort.value === "price_asc")
    arr.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
  if (sort.value === "price_desc")
    arr.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
  if (sort.value === "rating_desc")
    arr.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
  if (sort.value === "rating_asc")
    arr.sort((a, b) => (a.avg_rating || 0) - (b.avg_rating || 0));
  return arr;
});

const totalPages = computed(() =>
  Math.ceil(sortedProducts.value.length / perPage)
);
const paginatedProducts = computed(() =>
  sortedProducts.value.slice((page.value - 1) * perPage, page.value * perPage)
);

function goToPage(p: number) {
  if (p < 1 || p > totalPages.value) return;
  page.value = p;
}

function onSortChange() {
  page.value = 1;
}
function onCategoryChange() {
  page.value = 1;
}
function onPriceChange() {
  page.value = 1;
}

function imageUrl(img: string) {
  if (!img) return "/fallback.jpg";
  if (img.startsWith("http")) return img;
  return `http://ayurveda-marketplace.test/storage/${img}`;
}

function starRating(rating: number) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    '<span class="text-warning">' +
    "★".repeat(full) +
    (half ? "½" : "") +
    '<span class="text-muted">' +
    "★".repeat(empty) +
    "</span>" +
    "</span>"
  );
}
</script>

<style scoped>
.product-card {
  transition: box-shadow 0.2s, transform 0.2s;
}
.product-card:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.13);
  transform: translateY(-4px) scale(1.02);
  z-index: 2;
}
</style>
