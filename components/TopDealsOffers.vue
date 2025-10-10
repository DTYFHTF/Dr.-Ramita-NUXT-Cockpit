<template>
  <section class="top-deals-offers py-5">
    <div class="container">
      <div class="section-header d-flex justify-content-between align-items-center mb-4">
        <h2 class="section-title mb-0">Top Deals & Offers</h2>
      </div>
      
      <!-- Small Deals Grid (First Row - 4 columns) -->
      <div class="row g-4 mb-4" v-if="smallDeals.length > 0">
        <div class="col-lg-3 col-md-6 col-sm-6" v-for="deal in smallDeals" :key="deal.id">
          <template v-if="deal.url">
            <NuxtLink :to="deal.url" class="deal-card-link text-decoration-none">
              <div class="deal-card">
                <!-- Deal Image -->
                <div class="deal-image-wrapper">
                  <img 
                    v-if="deal.image && !deal.image.includes('placeholder')" 
                    :src="deal.image" 
                    :alt="deal.title || deal.name || 'Deal'" 
                    class="deal-image"
                    loading="lazy"
                    @error="handleImageError"
                  >
                  <div v-else class="deal-image-placeholder">
                    <div class="placeholder-content">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M3 13L8 8L13 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="17" cy="9" r="1" fill="currentColor"/>
                      </svg>
                      <p class="mt-2">Image</p>
                    </div>
                  </div>
                </div>
                
                <!-- Title Below Image -->
                <div class="deal-title">
                  <h6>{{ deal.title || deal.name || 'Deal' }}</h6>
                </div>
              </div>
            </NuxtLink>
          </template>
          <template v-else>
            <div class="deal-card-link text-decoration-none">
              <div class="deal-card">
                <!-- Deal Image -->
                <div class="deal-image-wrapper">
                  <img 
                    v-if="deal.image && !deal.image.includes('placeholder')" 
                    :src="deal.image" 
                    :alt="deal.title || deal.name || 'Deal'" 
                    class="deal-image"
                    loading="lazy"
                    @error="handleImageError"
                  >
                  <div v-else class="deal-image-placeholder">
                    <div class="placeholder-content">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M3 13L8 8L13 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="17" cy="9" r="1" fill="currentColor"/>
                      </svg>
                      <p class="mt-2">Image</p>
                    </div>
                  </div>
                </div>
                
                <!-- Title Below Image -->
                <div class="deal-title">
                  <h6>{{ deal.title || deal.name || 'Deal' }}</h6>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Large Banner Deals (Second Row - 2 columns) -->
      <div class="row g-4" v-if="largeDeals.length > 0">
        <div class="col-lg-6 col-md-6" v-for="deal in largeDeals" :key="deal.id">
          <template v-if="deal.url">
            <NuxtLink :to="deal.url" class="deal-card-link text-decoration-none">
              <div class="deal-card banner-card" :style="getBannerStyle(deal)">
                <!-- Simple banner with just background image -->
              </div>
            </NuxtLink>
          </template>
          <template v-else>
            <div class="deal-card-link text-decoration-none">
              <div class="deal-card banner-card" :style="getBannerStyle(deal)">
                <!-- Simple banner with just background image -->
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  deals: {
    type: Array,
    default: () => []
  },
  maxSmallDeals: {
    type: Number,
    default: 4
  },
  maxLargeDeals: {
    type: Number,
    default: 2
  }
});

// Split deals into small (top row) and large (bottom banners)
const smallDeals = computed(() => {
  return props.deals.filter(d => d.size === 'small' || d.kind === 'deal').slice(0, props.maxSmallDeals);
});

const largeDeals = computed(() => {
  return props.deals.filter(d => d.size === 'large' || d.kind === 'banner').slice(0, props.maxLargeDeals);
});

// Get background style for banner cards
const getBannerStyle = (deal) => {
  if (deal.image && !deal.image.includes('placeholder')) {
    return {
      backgroundImage: `url(${deal.image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }
  return {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  };
};

// Handle image loading errors
const handleImageError = (event) => {
  event.target.style.display = 'none';
};
</script>

<style scoped lang="scss">
.top-deals-offers {
  background-color: var(--background-light, #f8f9fa);
  color: var(--text-primary, #2c3e50);
  padding: 3rem 0;
}

.section-header {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary, #2c3e50);
  margin: 0;
  letter-spacing: -0.5px;
}

.deal-card-link {
  display: block;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

.deal-card {
  position: relative;
  background: var(--background-white, #ffffff);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    
    .deal-image {
      transform: scale(1.08);
    }
  }
}

.deal-title {
  padding: 1rem;
  text-align: center;
  
  h6 {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary, #2c3e50);
    margin: 0;
    line-height: 1.4;
  }
}

.deal-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 75%; // 4:3 aspect ratio
  overflow: hidden;
  background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
}

.deal-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.deal-image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  
  .placeholder-content {
    text-align: center;
    color: #6b7280;
    
    svg {
      opacity: 0.5;
    }
    
    p {
      font-size: 0.875rem;
      font-weight: 500;
      margin: 0;
      padding: 0 1rem;
    }
  }
}

// Banner Card Styles (Large promotional banners)
.banner-card {
  min-height: 280px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 16px;
    transition: background 0.3s ease;
  }
  
  &:hover::before {
    background: rgba(0, 0, 0, 0.2);
  }
}

// Responsive adjustments
@media (max-width: 991px) {
  .section-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 767px) {
  .top-deals-offers {
    padding: 2rem 0;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .deal-image-wrapper {
    padding-top: 85%; // Slightly taller on mobile
  }
  
  .deal-title {
    padding: 0.75rem;
    
    h6 {
      font-size: 0.85rem;
    }
  }
  
  .banner-card {
    min-height: 220px;
  }
}

@media (max-width: 575px) {
  .deal-card {
    &:hover {
      transform: translateY(-4px);
    }
  }
  
  .banner-card {
    min-height: 200px;
  }
  
  .deal-title {
    padding: 0.5rem;
    
    h6 {
      font-size: 0.8rem;
    }
  }
}
</style>

