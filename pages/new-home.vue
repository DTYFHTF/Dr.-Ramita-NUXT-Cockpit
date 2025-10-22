
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
      :title="dailySeasonalTitle"
      :items="dailySeasonalItems"
      :loading="homepageLoading"
      :card-component="dailySeasonalCardComponent"
      :card-props-key="dailySeasonalCardPropsKey"
      :view-all-url="dailySeasonalViewAllUrl"
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

const { 
  loading: productsLoading,
  fetchProducts,
  fetchBestSellingProducts,
  fetchFeaturedProducts
} = useProducts();

const bestSellingProductsData = ref([]);
const featuredProductsData = ref([]);

onMounted(async () => {
  try {
    await fetchProducts(1, 12);
    bestSellingProductsData.value = await fetchBestSellingProducts(12);
    featuredProductsData.value = await fetchFeaturedProducts(12);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
});

const addImageUrl = (item, fallback = '/placeholder-banner.jpg') => {
  const img = item.promotion_image ?? item.image ?? '';
  if (typeof img === 'string' && img.startsWith('http')) {
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
  return section.data.categories.map(category => addImageUrl(category, '/placeholder-category.jpg'));
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
  return featuredProductsData.value || [];
});

const bestSellingProducts = computed(() => {
  const section = (homepageData.value?.sections || []).find(s => s.type === 'best_selling_products');
  
  if (section && Array.isArray(section.data?.products) && section.data.products.length > 0) {
    return section.data.products.map(product => addImageUrl(product, '/placeholder-product.jpg'));
  }
  return bestSellingProductsData.value || [];
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

const dailySeasonalItems = computed(() => {
  if (!dailySeasonalSection.value) return [];
  
  if (Array.isArray(dailySeasonalSection.value.data?.deals) && dailySeasonalSection.value.data.deals.length) {
    return dailySeasonalSection.value.data.deals.map(promo => {
      const card = addImageUrl(promo, '/placeholder-banner.jpg');
      return {
        ...card,
        subtitle: card.description || '',
        link: card.url || '/promotions'
      };
    });
  }
  
  return [];
});

const dailySeasonalCardComponent = computed(() => CategoryCard);

const dailySeasonalCardPropsKey = computed(() => 'category');

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
    return section.data.deals.map(d => ({
      ...d,
      image: d.image || '/placeholder-banner.jpg'
    }));
  }
  return [];
});
</script>

<style scoped lang="scss">
</style>
