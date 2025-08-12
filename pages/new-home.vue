
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
    <ProductSlider 
      title="Top Featured"
      :products="topFeaturedProducts" 
      :loading="productsLoading"
      section-class="featured"
      title-class="featured"
      view-all-url="/products"
    />

    <!-- Best Selling Products -->
    <ProductSlider 
      title="Best Selling Products"
      :products="bestSellingProducts" 
      :loading="productsLoading"
      view-all-url="/products?sort=best-selling"
    />

    <!-- Most Searched -->
    <MostSearched :tags="mostSearchedTags" />

    <!-- Daily & Seasonal Products -->
    <DailySeasonalProducts :categories="dailySeasonalCategories" />

    <!-- Top Deals & Offers -->
    <TopDealsOffers :deals="topDeals" />

    <!-- Promotional Banners -->
    <PromotionalBanners :banners="promotionalBanners" />

    <!-- Social Media Follow -->
    <SocialMediaFollow :socialLinks="socialMediaLinks" />
  </div>
</template>

<script setup>
import BannerCarousel from '@/components/BannerCarousel.vue';
import FeaturedCategories from '@/components/categories/FeaturedCategories.vue';
import BannerMidGrid from '@/components/BannerMidGrid.vue';
import ProductSlider from '@/components/ProductSlider.vue';
import MostSearched from '@/components/MostSearched.vue';
import DailySeasonalProducts from '@/components/DailySeasonalProducts.vue';
import TopDealsOffers from '@/components/TopDealsOffers.vue';
import PromotionalBanners from '@/components/PromotionalBanners.vue';
import SocialMediaFollow from '@/components/SocialMediaFollow.vue';
import { useApiLaravel } from '@/composables/useApi.js';
import { useImageUrl } from '@/composables/useImageUrl.js';
import { useProducts } from '@/composables/useProducts.ts';

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
  let img = item.image || '';
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

const mostSearchedTags = computed(() => {
  const section = (homepageData.value?.sections || []).find(s => s.type === 'most_searched');
  if (section && Array.isArray(section.data?.tags)) {
    return section.data.tags;
  }
  // Default tags
  return [
    { id: 1, name: 'Ghee', color: '#ffc107' },
    { id: 2, name: 'Giloy', color: '#28a745' },
    { id: 3, name: 'Arjun', color: '#17a2b8' },
    { id: 4, name: 'Eye Care', color: '#fd7e14' },
    { id: 5, name: 'Amla', color: '#6f42c1' },
    { id: 6, name: 'Honey', color: '#e83e8c' },
    { id: 7, name: 'Cooking Oil', color: '#20c997' },
    { id: 8, name: 'Ashwagandha', color: '#dc3545' }
  ];
});

const dailySeasonalCategories = computed(() => {
  const section = (homepageData.value?.sections || []).find(s => s.type === 'daily_seasonal');
  if (section && Array.isArray(section.data?.categories)) {
    return section.data.categories.map(category => addImageUrl(category, '/placeholder-category.jpg'));
  }
  // Default categories
  return [
    {
      id: 1,
      title: 'Supplements',
      subtitle: 'For daily nutrition',
      image: '/images/supplements.jpg',
      url: '/category/supplements'
    },
    {
      id: 2,
      title: 'Personal Care',
      subtitle: 'Natural wellness',
      image: '/images/personal-care.jpg',
      url: '/category/personal-care'
    },
    {
      id: 3,
      title: 'Nutraceuticals',
      subtitle: 'Health boosters',
      image: '/images/nutraceuticals.jpg',
      url: '/category/nutraceuticals'
    }
  ];
});

const topDeals = computed(() => {
  const section = (homepageData.value?.sections || []).find(s => s.type === 'top_deals');
  if (section && Array.isArray(section.data?.deals)) {
    return section.data.deals.map(deal => addImageUrl(deal, '/placeholder-product.jpg'));
  }
  // Default deals
  return [
    {
      id: 1,
      title: 'Herbal Tea Collection',
      description: 'Premium quality herbal teas',
      price: 299,
      originalPrice: 399,
      discount: 25,
      image: '/images/herbal-tea.jpg',
      url: '/products/herbal-tea-collection'
    },
    {
      id: 2,
      title: 'Ayurvedic Supplements',
      description: 'Natural health boosters',
      price: 599,
      originalPrice: 799,
      discount: 25,
      image: '/images/supplements.jpg',
      url: '/products/ayurvedic-supplements'
    },
    {
      id: 3,
      title: 'Organic Honey',
      description: 'Pure and natural honey',
      price: 449,
      originalPrice: 599,
      discount: 25,
      image: '/images/honey.jpg',
      url: '/products/organic-honey'
    },
    {
      id: 4,
      title: 'Skincare Essentials',
      description: 'Natural skincare products',
      price: 799,
      originalPrice: 999,
      discount: 20,
      image: '/images/skincare.jpg',
      url: '/products/skincare-essentials'
    }
  ];
});

const promotionalBanners = computed(() => {
  const section = (homepageData.value?.sections || []).find(s => s.type === 'promotional_banners');
  if (section && Array.isArray(section.data?.banners)) {
    return section.data.banners.map(banner => addImageUrl(banner, '/placeholder-banner.jpg'));
  }
  // Default promotional banners
  return [
    {
      id: 1,
      title: 'Devotional Pooja Essentials',
      subtitle: 'Sacred items for your daily prayers',
      image: '/images/pooja-essentials.jpg',
      url: '/category/pooja-essentials',
      buttonText: 'Explore',
      overlay: true
    },
    {
      id: 2,
      title: 'Namkeen & Snacks',
      subtitle: 'Healthy and tasty snacks',
      image: '/images/namkeen-snacks.jpg',
      url: '/category/namkeen-snacks',
      buttonText: 'Shop Now',
      overlay: true
    }
  ];
});

const socialMediaLinks = computed(() => {
  const section = (homepageData.value?.sections || []).find(s => s.type === 'social_media');
  if (section && Array.isArray(section.data?.links)) {
    return section.data.links;
  }
  // Default social media links
  return [
    {
      name: 'Instagram',
      url: 'https://instagram.com/patanjaliayurved',
      icon: 'bi bi-instagram',
      class: 'instagram'
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com/patanjaliayurved',
      icon: 'bi bi-facebook',
      class: 'facebook'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/patanjaliayurved',
      icon: 'bi bi-twitter',
      class: 'twitter'
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/patanjaliayurved',
      icon: 'bi bi-youtube',
      class: 'youtube'
    }
  ];
});
</script>

<style scoped>
/* Add page-specific styles here if needed */
</style>
