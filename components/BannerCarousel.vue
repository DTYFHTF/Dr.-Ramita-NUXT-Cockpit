      <!-- Indicators -->
      <div v-if="banners.length > 1" class="carousel-indicators">
        <button 
          v-for="(banner, index) in banners" 
          :key="index"
          type="button" 
          data-bs-target="#bannerCarousel" 
          :data-bs-slide-to="index" 
          :class="{ active: index === 0 }"
          :aria-current="index === 0 ? 'true' : 'false'"
          :aria-label="`Slide ${index + 1}`"
        ></button>
      </div>
<template>
  <div class="banner-carousel-wrapper">
    <!-- Loading State -->
    <div v-if="loading" class="banner-loading">
      <div class="d-flex justify-content-center align-items-center" style="height: 400px;">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading banners...</span>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="banner-error">
      <div class="alert alert-warning text-center" style="height: 400px; display: flex; align-items: center; justify-content: center;">
        <div>
          <i class="bi bi-exclamation-triangle fs-1 mb-3"></i>
          <p class="mb-0">Unable to load banners</p>
        </div>
      </div>
    </div>

    <!-- Bootstrap Carousel -->
    <div v-else-if="banners && banners.length" id="bannerCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel">
      <!-- Indicators -->
      <div v-if="banners.length > 1" class="carousel-indicators">
        <button 
          v-for="(banner, index) in banners" 
          :key="index"
          type="button" 
          data-bs-target="#bannerCarousel" 
          :data-bs-slide-to="index" 
          :class="{ active: index === 0 }"
          :aria-current="index === 0 ? 'true' : 'false'"
          :aria-label="`Slide ${index + 1}`"
        ></button>
      </div>

      <!-- Carousel Inner -->
      <div class="carousel-inner">
        <div 
          v-for="(banner, index) in banners" 
          :key="index"
          :class="['carousel-item', { active: index === 0 }]"
        >
          <div class="banner-slide">
            <!-- Background Image -->
            <img 
              :src="banner.image" 
              class="d-block w-100 banner-image" 
              :alt="banner.title || `Banner ${index + 1}`"
              loading="lazy"
            />
            
            <!-- Content Overlay -->
            <div v-if="banner.link" class="carousel-caption d-flex h-100">
              <div class="banner-content align-self-center">
                <div class="container">
                  <div class="row">
                    <div class="col-lg-6 col-md-8">
                      <div data-aos="fade-up" data-aos-delay="400">
                        <NuxtLink 
                          :to="banner.link" 
                          class="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-lg banner-cta"
                        >
                          <i class="bi bi-arrow-right me-2"></i>
                          Shop Now
                        </NuxtLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <button v-if="banners.length > 1" class="carousel-control-prev" type="button" data-bs-target="#bannerCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button v-if="banners.length > 1" class="carousel-control-next" type="button" data-bs-target="#bannerCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <!-- No Banners State -->
    <div v-else class="banner-placeholder">
      <div class="alert alert-info text-center" style="height: 400px; display: flex; align-items: center; justify-content: center;">
        <div>
          <i class="bi bi-image fs-1 mb-3"></i>
          <p class="mb-0">No banners available</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

const props = defineProps({
  banners: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: [String, Object],
    default: null
  }
});

onMounted(() => {
  // Initialize Bootstrap carousel with custom options
  if (typeof window !== 'undefined' && window.bootstrap) {
    const carouselElement = document.getElementById('bannerCarousel');
    if (carouselElement) {
      new window.bootstrap.Carousel(carouselElement, {
        interval: 5000, // 5 seconds
        wrap: true,
        pause: 'hover'
      });
    }
  }
});
</script>

<style scoped>
.banner-carousel-wrapper {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  position: relative;
}

.carousel {
  height: auto;
  position: relative;
}

@media (min-width: 768px) {
  .carousel {
  }
}

@media (min-width: 1200px) {
  .carousel {
  }
}

.banner-slide {
  position: relative;
  height: auto;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  object-position: center;
}

.carousel-caption {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg, 
    rgba(0, 0, 0, 0.6) 0%, 
    rgba(0, 0, 0, 0.3) 50%, 
    rgba(0, 0, 0, 0.1) 100%
  );
  display: flex;
  align-items: center;
  text-align: left;
  padding: 0;
}

.banner-content {
  width: 100%;
}

.banner-title {
  color: var(--text-white);
  text-shadow: 2px 2px 4px rgba(var(--shadow-rgb), 0.5);
  line-height: 1.2;
}

.banner-subtitle {
  color: var(--text-white);
  text-shadow: 1px 1px 2px rgba(var(--shadow-rgb), 0.5);
  font-size: 1.25rem;
}

.banner-cta {
  background: linear-gradient(135deg, var(--color-success) 0%, var(--primary-dark) 100%);
  border: none;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.banner-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(var(--shadow-rgb), 0.3) !important;
}

/* Custom carousel controls */
.carousel-control-prev,
.carousel-control-next {
  width: 5%;
  background: linear-gradient(
    to right, 
    rgba(0, 0, 0, 0.3) 0%, 
    transparent 100%
  );
}

.carousel-control-next {
  background: linear-gradient(
    to left, 
    rgba(0, 0, 0, 0.3) 0%, 
    transparent 100%
  );
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  width: 2.5rem;
  height: 2.5rem;
  background-size: 100%;
  filter: drop-shadow(2px 2px 4px rgba(var(--shadow-rgb), 0.5));
}

/* Custom indicators */
.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  margin: 0;
  z-index: 15;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}


.carousel-indicators [data-bs-target] {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid var(--color-primary);
  transition: all 0.3s ease;
  margin: 0;
  text-indent: 0;
}

.carousel-indicators [data-bs-target].active {
  background-color: var(--color-primary);
  border-color: var(--background-white);
  transform: scale(1.2);
}

/* Loading and error states */
.banner-loading,
.banner-error,
.banner-placeholder {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .carousel {
    height: 400px;
  }
  
  .banner-title {
    font-size: 2rem !important;
  }
  
  .banner-subtitle {
    font-size: 1rem;
  }
  
  .banner-cta {
    padding: 0.75rem 2rem !important;
    font-size: 0.9rem;
  }
  
  .carousel-caption {
    text-align: center;
  }
}

/* Smooth transitions */
.carousel-item {
  transition: transform 0.8s ease-in-out;
}

.carousel-fade .carousel-item {
  opacity: 0;
  transition-property: opacity;
  transform: none;
}

.carousel-fade .carousel-item.active,
.carousel-fade .carousel-item-next.carousel-item-start,
.carousel-fade .carousel-item-prev.carousel-item-end {
  z-index: 1;
  opacity: 1;
}

.carousel-fade .active.carousel-item-start,
.carousel-fade .active.carousel-item-end {
  z-index: 0;
  opacity: 0;
  transition: opacity 0s 0.8s;
}
</style>
