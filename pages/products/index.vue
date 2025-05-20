<template>
  <div class="container py-4">
    <div class="row">
      <!-- Sidebar for desktop and off-canvas for mobile -->
      <aside class="col-12 col-md-3 mb-4 mb-md-0 d-none d-md-block">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <h5 class="card-title mb-3 fw-bold">Filter & Sort</h5>
            <div class="mb-3">
              <div v-if="activeFilters.length" class="mb-3 d-flex align-items-center flex-wrap">
  <span
    v-for="(filter, idx) in activeFilters"
    :key="idx"
    class="btn border me-2 mb-2"
    style="font-size: 1rem; cursor: pointer;"
    @click="filter.remove"
  >
    {{ filter.label }} <span style="margin-left: 0.5em;">&times;</span>
  </span>
  <button class="btn btn-link ms-2 mb-2" @click="clearAllFilters">Clear All</button>
</div>
            </div>

            <div class="mb-3">
              <label class="form-label mb-1 fw-bold">Price:</label>
              <ul class="list-unstyled">
                <li v-for="range in priceRanges" :key="range.label">
                  <a
                    href="#"
                    @click.prevent="onPriceRangeChange(range)"
                    :class="{ active: priceMin === range.min && priceMax === range.max && onSale === range.onSale }"
                  >
                    {{ range.label }}
                  </a>
                </li>
              </ul>
            </div>
            <div class="mb-3">
              <label class="form-label mb-1 fw-bold">Category:</label>
              <ul class="list-unstyled">
                <li v-for="(cat, index) in visibleCategories" :key="cat.id">
                  <a href="#" @click.prevent="selectCategory(cat.id)" :class="{ active: category === cat.id }">
                    {{ cat.name }} ({{ cat.products_count || 0 }})
                  </a>
                </li>
              </ul>
              <button v-if="categories.length > 5" @click="toggleShowMore" class="btn btn-link">
                {{ showMore ? 'Show Less' : `Show ${categories.length - 5} More` }}
              </button>
            </div>
            <div class="mb-3">
              <label class="form-label mb-1 fw-bold">Stock Status:</label>
              <select v-model="inStock" class="form-select form-select-sm" @change="onStockChange">
                <option :value="true">In Stock</option>
                <option :value="false">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>
      </aside>

      <!-- Off-canvas for mobile -->
      <div class="d-md-none">
        <button class="btn btn-primary mb-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasFilters" aria-controls="offcanvasFilters">
          Filter & Sort
        </button>

        <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasFilters" aria-labelledby="offcanvasFiltersLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasFiltersLabel">Filter & Sort</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <div class="card shadow-sm border-0">
              <div class="card-body">
                <div class="mb-3">
                  <div v-if="activeFilters.length" class="mb-3 d-flex align-items-center flex-wrap">
  <span
    v-for="(filter, idx) in activeFilters"
    :key="idx"
    class="btn border me-2 mb-2"
    style="font-size: 1rem; cursor: pointer;"
    @click="filter.remove"
  >
    {{ filter.label }} <span style="margin-left: 0.5em;">&times;</span>
  </span>
  <button class="btn btn-link ms-2 mb-2" @click="clearAllFilters">Clear All</button>
</div>
                </div>

                <div class="mb-3">
                  <label class="form-label mb-1 fw-bold">Price:</label>
                  <ul class="list-unstyled">
                    <li v-for="range in priceRanges" :key="range.label">
                      <a
                        href="#"
                        @click.prevent="onPriceRangeChange(range)"
                        :class="{ active: priceMin === range.min && priceMax === range.max && onSale === range.onSale }"
                      >
                        {{ range.label }}
                      </a>
                    </li>
                  </ul>
                </div>
                <div class="mb-3">
                  <label class="form-label mb-1 fw-bold">Category:</label>
                  <ul class="list-unstyled">
                    <li v-for="(cat, index) in visibleCategories" :key="cat.id">
                      <a href="#" @click.prevent="selectCategory(cat.id)" :class="{ active: category === cat.id }">
                        {{ cat.name }} ({{ cat.products_count || 0 }})
                      </a>
                    </li>
                  </ul>
                  <button v-if="categories.length > 5" @click="toggleShowMore" class="btn btn-link">
                    {{ showMore ? 'Show Less' : `Show ${categories.length - 5} More` }}
                  </button>
                </div>
                <div class="mb-3">
                  <label class="form-label mb-1 fw-bold">Stock Status:</label>
                  <select v-model="inStock" class="form-select form-select-sm" @change="onStockChange">
                    <option :value="true">In Stock</option>
                    <option :value="false">Out of Stock</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main content -->
      <div class="col-12 col-md-9">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1>Products</h1>
          <div class="d-flex align-items-center">
            <div class="d-flex align-items-center">
              <span class="me-3" :class="{ active: sort === 'price_asc' || sort === 'price_desc' }" @click="togglePriceSort" style="cursor: pointer;">
                Price <span class="sort-arrow" v-if="sort === 'price_asc'">↓</span><span class="sort-arrow" v-else-if="sort === 'price_desc'">↑</span><span class="sort-arrow" v-else>↓</span>
              </span>
              <span :class="{ active: sort === 'rating_asc' || sort === 'rating_desc' }" @click="toggleRatingSort" style="cursor: pointer;">
                Rating <span class="sort-arrow" v-if="sort === 'rating_asc'">↓</span><span class="sort-arrow" v-else-if="sort === 'rating_desc'">↑</span><span class="sort-arrow" v-else>↓</span>
              </span>
            </div>
          </div>
        </div>
        <div v-if="loading" class="text-center py-5" :hidden="!loading">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else-if="error" class="alert alert-danger text-center">
          {{ error }}
        </div>
        <div v-else-if="products.length === 0" class="alert alert-info text-center">
          No products found.
        </div>
        <div class="row g-4">
          <div v-for="product in products" :key="product.id" class="col-12 col-sm-6 col-lg-4">
            <ProductCard :product="product" />
          </div>
        </div>
        <nav v-if="pagination && pagination.last_page > 1" class="mt-4 d-flex justify-content-center">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: page === 1 }">
              <button class="page-link" @click="goToPage(page - 1)" :disabled="page === 1">Previous</button>
            </li>
            <li v-for="p in pagination.last_page" :key="p" class="page-item" :class="{ active: p === page }">
              <button class="page-link" @click="goToPage(p)">{{ p }}</button>
            </li>
            <li class="page-item" :class="{ disabled: page === pagination.last_page }">
              <button class="page-link" @click="goToPage(page + 1)" :disabled="page === pagination.last_page">Next</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProducts } from "@/composables/useProducts";
import { onMounted, ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import ProductCard from "@/components/ProductCard.vue";

const { products, loading, error, fetchProducts, categories, fetchCategories, pagination } = useProducts();
const route = useRoute();
const router = useRouter();

const sort = ref(Array.isArray(route.query.sort) ? route.query.sort[0] || "" : route.query.sort || "");
const category = ref(Array.isArray(route.query.category) ? route.query.category[0] || "" : route.query.category || "");
const maxPrice = ref(100000);
const priceMin = ref(0);
const priceMax = ref<number>(Number(route.query.priceMax) || maxPrice.value);
const page = ref(Number(route.query.page) || 1);
const perPage = 30;
const inStock = ref<boolean>(true); // Default to true instead of null
const showMore = ref(false);
const onSale = ref(false);

const priceRanges = [
  { label: "₹0 - ₹500", min: 0, max: 500, onSale: false },
  { label: "₹500 - ₹1000", min: 500, max: 1000, onSale: false },
  { label: "₹1000 - ₹2000", min: 1000, max: 2000, onSale: false },
  { label: "₹2000 - ₹10000", min: 2000, max: 10000, onSale: false },
  { label: "₹10000+", min: 10000, max: null, onSale: false },
  { label: "On Sale", min: null, max: null, onSale: true }
];

const visibleCategories = computed(() => {
  return showMore.value ? categories.value : categories.value.slice(0, 5);
});

onMounted(() => {
  fetchProducts(page.value, perPage, sort.value, category.value, priceMin.value, priceMax.value, inStock.value, onSale.value);
  fetchCategories();
});

watch([sort, category, priceMin, priceMax, page, inStock, onSale], () => {
  router.replace({
    query: {
      ...route.query,
      sort: sort.value || undefined,
      category: category.value || undefined,
      priceMin: priceMin.value || undefined,
      priceMax: priceMax.value || undefined,
      page: page.value || undefined,
      inStock: inStock.value ? 'true' : 'false',
      onSale: onSale.value ? 'true' : undefined,
    },
  });
  fetchProducts(page.value, perPage, sort.value, category.value, priceMin.value, priceMax.value, inStock.value, onSale.value);
});

function goToPage(p: number) {
  if (!pagination.value || p < 1 || p > pagination.value.last_page) return;
  page.value = p;
}

function togglePriceSort() {
  sort.value = sort.value === 'price_asc' ? 'price_desc' : 'price_asc';
  page.value = 1;
}

function toggleRatingSort() {
  sort.value = sort.value === 'rating_asc' ? 'rating_desc' : 'rating_asc';
  page.value = 1;
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
function onStockChange() {
  page.value = 1;
}
function toggleShowMore() {
  showMore.value = !showMore.value;
}
function selectCategory(catId: string) {
  category.value = catId;
  page.value = 1; // Reset to the first page
}
function onPriceRangeChange(range: { min: number | null; max: number | null; onSale: boolean }) {
  priceMin.value = range.min !== null ? range.min : 0;
  priceMax.value = range.max !== null ? range.max : maxPrice.value; // Use maxPrice.value instead of null
  onSale.value = !!range.onSale;
  page.value = 1;
}

const activeFilters = computed(() => {
  const filters = [];
  // Price
  if (priceMin.value !== 0 || priceMax.value !== maxPrice.value) {
    let label = "";
    if (onSale.value) {
      label = "On Sale";
    } else if (priceMax.value === maxPrice.value) {
      label = `₹${priceMin.value}+`;
    } else {
      label = `₹${priceMin.value} - ₹${priceMax.value}`;
    }
    filters.push({
      label,
      remove: () => {
        priceMin.value = 0;
        priceMax.value = maxPrice.value; // Reset to maxPrice.value
        onSale.value = false;
      }
    });
  }
  // On Sale
  if (onSale.value) {
    filters.push({
      label: "On Sale",
      remove: () => { onSale.value = false; }
    });
  }
  // Category
  if (category.value) {
    const cat = categories.value.find(c => c.id == category.value);
    if (cat) {
      filters.push({
        label: cat.name,
        remove: () => { category.value = ""; }
      });
    }
  }
  // In Stock
  if (inStock.value) {
    filters.push({
      label: "In Stock",
      remove: () => { inStock.value = true; } // Reset to true
    });
  }
  return filters;
});

function clearAllFilters() {
  priceMin.value = 0;
  priceMax.value = maxPrice.value; // Reset to maxPrice instead of null
  category.value = "";
  inStock.value = true; // Reset to true instead of null
  onSale.value = false;
  page.value = 1;
}
</script>

<style scoped lang="scss">
.product-card {
  transition: box-shadow 0.2s, transform 0.2s;
}
.product-card:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.13);
  transform: translateY(-4px) scale(1.02);
  z-index: 2;
}
.row.g-4 {
  row-gap: 1rem; /* Increase vertical spacing between product cards */
}
.text-center.py-5 {
  transition: opacity 0.3s ease-in-out;
  opacity: 1;
}
.text-center.py-5[hidden] {
  opacity: 0;
  pointer-events: none;
}
.sort-arrow {
  font-size: 1.2rem; /* Increase the size of the arrows */
  margin-left: 0.2rem; /* Add some spacing between text and arrow */
}
.list-unstyled {
  padding: 0.5rem;
  margin: 0;
}
.list-unstyled li {
  margin-bottom: 0.5rem;
}
.list-unstyled a {
  text-decoration: none;
  color: $text-deep-green;
  font-size: 1rem;
  cursor: pointer;
  display: block;
  padding: 0.2rem 0;
}
.list-unstyled a.active {
  font-weight: 500;
  color: $text-deep-green;
  text-decoration: underline;
}
.list-unstyled a:hover {
  color: $accent-soft-green;
}
.btn-link {
  color: $text-deep-green;
  text-decoration: none;
  font-weight: 500;
  &:hover {
    color: darken($text-deep-green, 10%);
  }
}
</style>