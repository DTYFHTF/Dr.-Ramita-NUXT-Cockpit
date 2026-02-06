<template>
  <section class="seasonal-products-section py-5">
    <div class="container">
      <!-- Section Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="section-title">{{ title }}</h2>
        <a v-if="viewAllUrl" :href="viewAllUrl" class="view-all-link"
          >View All <i class="bi bi-arrow-right"></i
        ></a>
      </div>

      <!-- Season Tabs -->
      <div class="season-tabs-wrapper mb-4">
        <div class="season-tabs" ref="tabsContainer">
          <button
            v-for="(promotion, index) in promotions"
            :key="promotion.id"
            class="season-tab mx-2"
            :class="{ active: activeTab === index }"
            @click="setActiveTab(index)"
          >
            <span class="season-icon" v-if="getSeasonIcon(promotion)">{{
              getSeasonIcon(promotion)
            }}</span>
            <span class="season-name">{{ promotion.title }}</span>
          </button>
        </div>
      </div>

      <!-- Active Tab Content -->
      <div v-if="activePromotion" class="tab-content-wrapper">
        <!-- Loading State -->
        <div v-if="loading" class="slider-container">
          <div class="items-slider">
            <div class="slider-track">
              <div class="item-slide" v-for="n in 4" :key="n">
                <div class="card skeleton-card">
                  <div class="skeleton skeleton-image"></div>
                  <div class="card-body">
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text short"></div>
                    <div class="skeleton skeleton-price"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Products Slider (Lazy Loaded) -->
        <div
          v-else-if="activeProducts.length > 0"
          class="products-slider-wrapper"
        >
          <GenericSlider
            :title="''"
            :items="activeProducts"
            :loading="false"
            :card-component="ProductCard"
            card-props-key="product"
            :view-all-url="activePromotion.url"
            :section-class="`seasonal-slider seasonal-${activeTab}`"
            view-all-text="Shop All"
            @loadMore="loadMoreProducts"
          />
          <!-- Subtle loading indicator at the end -->
          <div v-if="isLoadingMore" class="loading-more-indicator">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading more products...</span>
            </div>
            <span class="loading-text">Loading more...</span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state text-center py-5">
          <p class="text-muted">No products available for this season.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import GenericSlider from "@/components/GenericSlider.vue";
import ProductCard from "@/components/ProductCard.vue";
import { useProducts } from "@/composables/useProducts";

const props = defineProps({
  title: {
    type: String,
    default: "Daily & Seasonal Products",
  },
  promotions: {
    type: Array,
    required: true,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  viewAllUrl: {
    type: String,
    default: null,
  },
});

// Active tab index
const activeTab = ref(0);
const tabsContainer = ref(null);

// Products state management per tab
const loadedProductsMap = ref({});
const loadingMoreMap = ref({});
const hasMoreMap = ref({});

const {
  products: fetchedProducts,
  loading: productsLoading,
  fetchProducts,
} = useProducts();

// Initialize products map when promotions change
watch(
  () => props.promotions,
  (newPromotions) => {
    newPromotions.forEach((promo, index) => {
      if (!loadedProductsMap.value[index]) {
        // Initialize with the 6 products from homepage
        loadedProductsMap.value[index] = promo.products || [];
        // Assume there might be more products (we'll find out when we try to load)
        hasMoreMap.value[index] = (promo.products || []).length >= 6;
      }
    });
  },
  { immediate: true, deep: true },
);

// Get the active promotion
const activePromotion = computed(() => {
  return props.promotions[activeTab.value] || null;
});

// Get products for the active promotion (from loaded map)
const activeProducts = computed(() => {
  return loadedProductsMap.value[activeTab.value] || [];
});

// Check if currently loading more for active tab
const isLoadingMore = computed(() => {
  return loadingMoreMap.value[activeTab.value] || false;
});

// Set active tab
const setActiveTab = (index) => {
  activeTab.value = index;
};

// Load more products for current tab
const loadMoreProducts = async () => {
  const tabIndex = activeTab.value;
  const promo = activePromotion.value;

  if (!promo || !promo.promotion_slug) return;
  if (loadingMoreMap.value[tabIndex] || !hasMoreMap.value[tabIndex]) return;

  loadingMoreMap.value[tabIndex] = true;

  try {
    // Fetch products filtered by promotion slug
    // Use limit=20 to get more than the initial 6
    await fetchProducts({
      promotion: promo.promotion_slug,
      limit: 20,
      offset: 0, // We'll get all and then filter out duplicates
    });

    if (fetchedProducts.value && fetchedProducts.value.length > 0) {
      // Get current product IDs to avoid duplicates
      const currentIds = new Set(
        loadedProductsMap.value[tabIndex].map((p) => p.id),
      );

      // Filter out products we already have
      const newProducts = fetchedProducts.value.filter(
        (p) => !currentIds.has(p.id),
      );

      if (newProducts.length > 0) {
        // Append new products
        loadedProductsMap.value[tabIndex] = [
          ...loadedProductsMap.value[tabIndex],
          ...newProducts,
        ];
      }

      // If we got fewer products than requested, no more to load
      if (fetchedProducts.value.length < 20) {
        hasMoreMap.value[tabIndex] = false;
      }
    } else {
      hasMoreMap.value[tabIndex] = false;
    }
  } catch (error) {
    console.error("Error loading more products:", error);
    hasMoreMap.value[tabIndex] = false;
  } finally {
    loadingMoreMap.value[tabIndex] = false;
  }
};

// Get season icon/emoji based on promotion name or season
const getSeasonIcon = (promotion) => {
  const name = (promotion.title || "").toLowerCase();
  const desc = (promotion.description || "").toLowerCase();
  const season = (promotion.season || "").toLowerCase();
  const text = `${name} ${desc} ${season}`;

  // Ayurvedic seasons (6 Ritus)
  if (text.includes("grishma") || text.includes("summer")) return "☀️";
  if (text.includes("varsha") || text.includes("monsoon")) return "🌧️";
  if (text.includes("sharad") || text.includes("autumn")) return "🍂";
  if (text.includes("hemanta") || text.includes("pre-winter")) return "🍁";
  if (text.includes("shishira") || text.includes("winter")) return "❄️";
  if (text.includes("vasanta") || text.includes("spring")) return "🌸";

  // Generic seasonal keywords
  if (text.includes("cooling") || text.includes("heat")) return "🌞";
  if (text.includes("immunity") || text.includes("wellness")) return "💪";
  if (text.includes("detox") || text.includes("cleanse")) return "🌿";
  if (text.includes("daily") || text.includes("everyday")) return "⭐";

  return ""; // No icon
};

// Auto-select first tab on mount
watch(
  () => props.promotions,
  (newPromos) => {
    if (
      newPromos &&
      newPromos.length > 0 &&
      activeTab.value >= newPromos.length
    ) {
      activeTab.value = 0;
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.seasonal-products-section {
  background-color: var(--surface-base);
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.view-all-link {
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.view-all-link:hover {
  color: var(--accent-primary-hover);
}

.view-all-link i {
  font-size: 1.2rem;
}

/* Season Tabs */
.season-tabs-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.season-tabs-wrapper::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.season-tabs {
  display: flex;
  gap: 1rem;
  padding-bottom: 0.5rem;
  min-width: min-content;
}

.season-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--surface-muted);
  border: 2px solid var(--border-default);
  border-radius: 50px;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.season-tab:hover {
  background-color: var(--surface-primary);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.season-tab.active {
  /* Match hover styling so active tab appears lifted and highlighted */
  background-color: var(--surface-primary);
  border-color: var(--accent-primary);

  color: var(--accent-primary);
  box-shadow: var(--shadow-md);
}

.season-tab.active:hover {
  transform: translateY(-2px);
}

.season-icon {
  font-size: 1.25rem;
  line-height: 1;
}

.season-name {
  font-size: 0.95rem;
}

/* Tab Content */
.tab-content-wrapper {
  margin-top: 2rem;
}

.products-slider-wrapper {
  position: relative;
}

.loading-more-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem 0;
  margin-top: 1rem;
}

.loading-more-indicator .spinner-border {
  width: 1.5rem;
  height: 1.5rem;
  border-width: 2px;
}

.loading-text {
  color: var(--text-secondary);
  font-size: 0.95rem;
  font-weight: 500;
}

/* Empty State */
.empty-state {
  padding: 3rem 1rem;
}

.empty-state p {
  font-size: 1.1rem;
  margin: 0;
}

/* Loading Skeletons */
.slider-container {
  position: relative;
}

.items-slider {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: var(--border-default) transparent;
}

.slider-track {
  display: flex;
  gap: 1.5rem;
  padding: 0.5rem 0;
}

.item-slide {
  flex: 0 0 auto;
  width: 280px;
}

.skeleton-card {
  height: 380px;
  border-radius: 12px;
  overflow: hidden;
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--surface-muted) 0%,
    var(--border-default) 50%,
    var(--surface-muted) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

.skeleton-image {
  height: 220px;
  width: 100%;
}

.skeleton-text {
  height: 16px;
  margin: 0.5rem 0;
  width: 100%;
}

.skeleton-text.short {
  width: 60%;
}

.skeleton-price {
  height: 20px;
  width: 40%;
  margin-top: 0.75rem;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .section-title {
    font-size: 1.5rem;
  }

  .season-tabs {
    gap: 0.75rem;
  }

  .season-tab {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }

  .season-icon {
    font-size: 1.1rem;
  }

  .season-name {
    font-size: 0.85rem;
  }

  .item-slide {
    width: 240px;
  }

  .view-all-link {
    font-size: 0.9rem;
  }
}

@media (max-width: 576px) {
  .section-title {
    font-size: 1.25rem;
  }

  .season-tab {
    padding: 0.5rem 1rem;
  }

  .item-slide {
    width: 200px;
  }
}
</style>
