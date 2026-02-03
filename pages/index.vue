
<template>
  <div>
    <!-- Loading state for entire page -->
    <div v-if="homepageLoading && !homepageData" class="loading-container">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3">Loading homepage content...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="homepageError" class="alert alert-danger container my-5">
      <h4>Failed to load homepage</h4>
      <p>{{ homepageError }}</p>
      <button class="btn btn-primary" @click="refreshPage">Retry</button>
    </div>

    <!-- Content -->
    <div v-else>
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
      v-if="topFeaturedProducts.length > 0"
      title="Top Featured"
      :items="topFeaturedProducts" 
      :loading="productsLoading"
      :card-component="ProductCard"
      card-props-key="product"
      section-class="featured"
      title-class="featured"
      view-all-url="/products?collection=featured"
    />
<!-- Daily & Seasonal Products -->
    <SeasonalProducts
      v-if="seasonalPromotions.length > 0"
      :title="dailySeasonalTitle"
      :promotions="seasonalPromotions"
      :loading="homepageLoading"
      :view-all-url="dailySeasonalViewAllUrl"
    />
    <!-- Most Searched -->
    <MostSearched 
      v-if="mostSearchedSection"
      :section-data="mostSearchedSection"
    />

    
    <!-- Best Selling Products -->
    <GenericSlider 
      v-if="bestSellingProducts.length > 0"
      title="Best Selling Products"
      :items="bestSellingProducts" 
      :loading="productsLoading"
      :card-component="ProductCard"
      card-props-key="product"
      view-all-url="/products?collection=bestselling"
    />


    <!-- Top Deals & Offers -->
    
    <TopDealsOffers 
      v-if="topDeals.length > 0"
      :deals="topDeals" 
    />

    </div><!-- End of content div -->
  <!-- Promotional Banners removed -->
  </div>
</template>

<script setup>
import BannerCarousel from '@/components/BannerCarousel.vue';
import FeaturedCategories from '@/components/categories/FeaturedCategories.vue';
import BannerMidGrid from '@/components/BannerMidGrid.vue';
import GenericSlider from '@/components/GenericSlider.vue';
import SeasonalProducts from '@/components/SeasonalProducts.vue';
import MostSearched from '@/components/MostSearched.vue';
import TopDealsOffers from '@/components/TopDealsOffers.vue';
import ProductCard from '@/components/ProductCard.vue';
import { useApiLaravel } from '@/composables/useApi.js';
import { useImageUrl } from '@/composables/useImageUrl.js';
import { useProducts } from '@/composables/useProducts.ts';
import { computed, ref, onMounted } from 'vue';

const { data: homepageData, error: homepageError, loading: homepageLoading } = useApiLaravel('homepage');
const { getImageUrl } = useImageUrl();

const { 
  loading: productsLoading
} = useProducts();

const refreshPage = () => {
  window.location.reload();
}

onMounted(async () => {
  // Products are now managed through homepage sections only
  // No need for separate API calls
});

const addImageUrl = (item, fallback = '/placeholder-banner.jpg') => {
  const img = item.promotion_image ?? item.image ?? '';
  if (typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://'))) {
    return { ...item, image: img };
  }
  return { ...item, image: getImageUrl(img, fallback) };
};

const banners = computed(() => {
  const section = (homepageData.value?.sections || []).find(s => s.type === 'banner_main');
  if (!section || !Array.isArray(section.data?.banners)) return [];
  return section.data.banners.map(b => addImageUrl(b, '/placeholder-banner.jpg'));
});

const featuredCategories = computed(() => {
  const section = (homepageData.value?.sections || []).find(s => s.type === 'auto_featured_categories');
  if (!section || !Array.isArray(section.data?.categories)) return [];
  return section.data.categories.map(category => addImageUrl(category, '/rishipath-logo.png'));
});

const bannersMid = computed(() => {
  const section = (homepageData.value?.sections || []).find(s => s.type === 'banner_mid');
  if (!section || !Array.isArray(section.data?.banners)) return [];
  return section.data.banners.map(b => addImageUrl(b, '/placeholder-banner.jpg'));
});

const topFeaturedProducts = computed(() => {
  const section = (homepageData.value?.sections || []).find(s => s.type === 'featured_products' || s.type === 'auto_featured_products');
  if (section && Array.isArray(section.data?.products) && section.data.products.length > 0) {
    return section.data.products.map(product => addImageUrl(product, '/placeholder-product.jpg'));
  }
  return [];
});

const bestSellingProducts = computed(() => {
  const section = (homepageData.value?.sections || []).find(s => s.type === 'best_selling_products');
  
  if (section && Array.isArray(section.data?.products) && section.data.products.length > 0) {
    return section.data.products.map(product => addImageUrl(product, '/placeholder-product.jpg'));
  }
  return [];
});

const mostSearchedSection = computed(() => {
  return (homepageData.value?.sections || []).find(s => s.type === 'most_searched');
});

const dailySeasonalSection = computed(() => {
  return (homepageData.value?.sections || []).find(s => s.type === 'daily_seasonal');
});

const dailySeasonalTitle = computed(() => {
  return dailySeasonalSection.value?.data?.title || 'Daily & Seasonal Products';
});

// Extract promotions with their products for SeasonalProducts component
const seasonalPromotions = computed(() => {
  if (!dailySeasonalSection.value) return [];
  
  if (Array.isArray(dailySeasonalSection.value.data?.deals) && dailySeasonalSection.value.data.deals.length) {
    return dailySeasonalSection.value.data.deals.map(promo => {
      return {
        id: promo.id || promo.promotion_slug,
        title: promo.title,
        description: promo.description || '',
        season: promo.season || '',
        image: addImageUrl(promo, '/placeholder-banner.jpg').image,
        url: promo.url || '/promotions',
        products: promo.products || [], // Backend already provides products array
        promotion_slug: promo.promotion_slug,
        promotion_scope: promo.promotion_scope
      };
    });
  }
  
  return [];
});

const dailySeasonalViewAllUrl = computed(() => {
  const section = dailySeasonalSection.value;
  if (!section || !section.data) return null;

  const deals = Array.isArray(section.data.deals) ? section.data.deals : [];
  const promotionSlugs = deals.map(d => d.promotion_slug).filter(Boolean);

  if (promotionSlugs.length === 0) return null;

  const promotionsParam = promotionSlugs.join(',');
  const collectionName = encodeURIComponent(section.data.title || 'Seasonal Products');
  
  return `/products?promotions=${promotionsParam}&collection=${collectionName}&source=seasonal`;
});

const topDeals = computed(() => {
  const section = (homepageData.value?.sections || []).find(s => s.type === 'top_deals');
  
  if (section && Array.isArray(section.data?.deals)) {
    return section.data.deals.map(d => addImageUrl(d, '/placeholder-banner.jpg'));
  }
  return [];
});
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 2rem;
}

.loading-container p {
  color: var(--text-secondary);
  font-size: 1.1rem;
}
</style>

<style scoped lang="scss">
</style>
