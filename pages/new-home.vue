
<template>
  <div>
    <!-- Main Banner Carousel -->
    <BannerCarousel 
      v-if="banners.length > 0"
      :banners="banners" 
      :loading="homepageLoading" 
      :error="homepageError" 
    />

    <div class="container">
      <!-- Featured Categories -->
      <FeaturedCategories 
        v-if="featuredCategories.length > 0"
        :categories="featuredCategories" 
        :loading="homepageLoading" 
      />

      <!-- Mid Banners -->
      <BannerMidGrid 
        v-if="bannersMid.length > 0"
        :banners="bannersMid" 
      />
    </div>

    <!-- Top Featured Products -->
    <GenericSlider 
      title="Top Featured"
      :items="topFeaturedProducts" 
      :loading="productsLoading"
      :card-component="ProductCard"
      card-props-key="product"
      section-class="featured"
      title-class="featured"
      view-all-url="/products?collection=featured"
    />

    <!-- Best Selling Products -->
    <GenericSlider 
      title="Best Selling Products"
      :items="bestSellingProducts" 
      :loading="productsLoading"
      :card-component="ProductCard"
      card-props-key="product"
      view-all-url="/products?collection=bestselling"
    />

    <!-- Most Searched -->
    <MostSearched 
      :section-data="mostSearchedSection"
    />

    <!-- Daily & Seasonal Products -->
    <GenericSlider 
      title="Daily & Seasonal Products"
      :items="dailySeasonalProducts"
      :loading="homepageLoading"
      :card-component="CategoryCard"
      card-props-key="category"
      view-all-url="/categories"
    />

    <!-- Top Deals & Offers -->
    <TopDealsOffers :deals="topDeals" />

  <!-- Promotional Banners removed -->
  </div>
</template>

<script setup>
import BannerCarousel from '@/components/BannerCarousel.vue';
import FeaturedCategories from '@/components/categories/FeaturedCategories.vue';
import BannerMidGrid from '@/components/BannerMidGrid.vue';
import GenericSlider from '@/components/GenericSlider.vue';
import CategoryCard from '@/components/CategoryCard.vue';
import MostSearched from '@/components/MostSearched.vue';
import TopDealsOffers from '@/components/TopDealsOffers.vue';
import ProductCard from '@/components/ProductCard.vue';
import { useApiLaravel } from '@/composables/useApi.js';
import { useImageUrl } from '@/composables/useImageUrl.js';
import { useProducts } from '@/composables/useProducts.ts';
import { computed, ref, onMounted } from 'vue';

const { data: homepageData, error: homepageError, loading: homepageLoading } = useApiLaravel('homepage');
const { getImageUrl } = useImageUrl();

// Fetch products data
const { 
  products: productsData, 
  loading: productsLoading,
  fetchProducts,
  fetchBestSellingProducts,
  fetchFeaturedProducts
} = useProducts();

// State for best selling products
const bestSellingProductsData = ref([]);
const featuredProductsData = ref([]);

// Fetch featured and best selling products
onMounted(async () => {
  try {
    await fetchProducts(1, 12); // Fetch more products for sliders
    // Fetch best selling products
    bestSellingProductsData.value = await fetchBestSellingProducts(12);
    // Fetch featured products
    featuredProductsData.value = await fetchFeaturedProducts(12);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
});

const addImageUrl = (item, fallback = '/placeholder-banner.jpg') => {
  // Prefer explicit promotion_image when provided by backend
  const img = item.promotion_image ?? item.image ?? '';
  if (typeof img === 'string' && img.startsWith('http')) {
    return { ...item, image: img };
  }
  return { ...item, image: getImageUrl(img, fallback) };
};

// Existing computed properties
const banners = computed(() => {
  const section = (homepageData.value?.sections || []).find(s => s.type === 'banner_main');
  if (!section || !Array.isArray(section.data?.banners)) return [];
  return section.data.banners.map(b => addImageUrl(b, '/placeholder-banner.jpg'));
});

const featuredCategories = computed(() => {
  const section = (homepageData.value?.sections || []).find(s => s.type === 'auto_featured_categories');
  if (!section || !Array.isArray(section.data?.categories)) return [];
  return section.data.categories.map(category => addImageUrl(category, '/placeholder-category.jpg'));
});

const bannersMid = computed(() => {
  const section = (homepageData.value?.sections || []).find(s => s.type === 'banner_mid');
  if (!section || !Array.isArray(section.data?.banners)) return [];
  return section.data.banners.map(b => addImageUrl(b, '/placeholder-banner.jpg'));
});

// New computed properties for additional sections
const topFeaturedProducts = computed(() => {
  const section = (homepageData.value?.sections || []).find(s => s.type === 'featured_products' || s.type === 'auto_featured_products');
  if (section && Array.isArray(section.data?.products)) {
    return section.data.products.map(product => addImageUrl(product, '/placeholder-product.jpg'));
  }
  // Use data from our featured products API endpoint
  return featuredProductsData.value || [];
});

const bestSellingProducts = computed(() => {
  const section = (homepageData.value?.sections || []).find(s => s.type === 'best_selling_products');
  if (section && Array.isArray(section.data?.products)) {
    return section.data.products.map(product => addImageUrl(product, '/placeholder-product.jpg'));
  }
  // Use data from our API endpoint
  return bestSellingProductsData.value || [];
});


const mostSearchedSection = computed(() => {
  return (homepageData.value?.sections || []).find(s => s.type === 'most_searched');
});

const dailySeasonalProducts = computed(() => {
  const section = (homepageData.value?.sections || []).find(s => s.type === 'daily_seasonal');
  if (section && Array.isArray(section.data?.categories)) {
    return section.data.categories.map(category => addImageUrl(category, '/placeholder-category.jpg'));
  }
  console.log('No daily seasonal data found, returning empty array');
  return [];
});

// Normalize incoming deal objects (API or CMS section) to a common shape
function normalizeDeal(deal) {
  // If API returns a product-like object with price_breakdown
  const pb = deal.price_breakdown || deal.priceBreakdown || null;
  const originalPrice = pb?.original_price ?? deal.originalPrice ?? deal.regular_price ?? deal.price_original ?? null;
  const finalPrice = pb?.final_price ?? deal.price ?? deal.discounted_price ?? deal.price_final ?? null;
  const computedDiscount = (originalPrice && finalPrice)
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : deal.discount ?? deal.discount_percentage ?? null;

    return {
      id: deal.id ?? deal.product_id ?? deal.sku ?? Math.random(),
      title: deal.title ?? deal.name ?? (deal.product?.name) ?? '',
      description: deal.description ?? deal.short_description ?? deal.product?.short_description ?? '',
      // prefer explicit promotion_image set by backend
      image: deal.promotion_image ?? deal.image ?? deal.product?.image ?? deal.thumbnail ?? '',
      url: deal.url ?? (deal.product ? `/products/${deal.product?.slug || deal.product?.id}` : (deal.path ?? '#')),
      price: finalPrice,
      originalPrice: originalPrice,
      discount: computedDiscount
    };
}

const topDeals = computed(() => {
  // Use homepage section data instead of separate API call
  const section = (homepageData.value?.sections || []).find(s => s.type === 'top_deals');
  if (section && Array.isArray(section.data?.deals)) {
    return section.data.deals.map(d => {
      // If the backend marked this as a category promotion, keep its shape and only ensure image URL
      if (d.kind === 'category') {
        return addImageUrl(d, '/placeholder-banner.jpg');
      }
      // Otherwise treat it as a product deal
      return addImageUrl(normalizeDeal(d), '/placeholder-product.jpg');
    });
  }
  return [];
});

// promotional and social sections removed from homepage
</script>

<style scoped lang="scss">
</style>
