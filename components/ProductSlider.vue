<template>
  <section class="product-slider-section py-5" :class="sectionClass">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="section-title" :class="titleClass">{{ title }}</h2>
        <a :href="viewAllUrl" class="view-all-link">{{ viewAllText }} <i class="bi bi-arrow-right"></i></a>
      </div>
      
      <div class="product-slider-container position-relative">
        <!-- Navigation Arrows -->
        <button 
          class="slider-arrow slider-arrow-left" 
          @click="scrollLeft"
          :disabled="isAtStart && !loading"
          v-show="!loading && products.length > 3"
        >
          <LucideIcon icon="mdi:chevron-left" />
        </button>
        
        <button 
          class="slider-arrow slider-arrow-right" 
          @click="scrollRight"
          :disabled="isAtEnd && !loading"
          v-show="!loading && products.length > 3"
        >
          <LucideIcon icon="mdi:chevron-right" />
        </button>
        
        <!-- Products Slider -->
        <div 
          ref="sliderContainer" 
          class="products-slider"
          @scroll="updateArrowStates"
        >
          <div class="slider-track">
            <div 
              v-if="!loading" 
              class="product-slide" 
              v-for="product in products" 
              :key="product.id"
            >
              <ProductCard :product="product" />
            </div>
            
            <!-- Loading Skeletons -->
            <div 
              v-else 
              class="product-slide" 
              v-for="n in skeletonCount" 
              :key="n"
            >
              <div class="card product-card-skeleton">
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
    </div>
  </section>
</template>

<script setup>
import ProductCard from '@/components/ProductCard.vue';
import LucideIcon from '@/components/LucideIcon.vue';
import { ref, onMounted, nextTick, watch } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  products: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  sectionClass: {
    type: String,
    default: ''
  },
  titleClass: {
    type: String,
    default: ''
  },
  viewAllUrl: {
    type: String,
    default: '/products'
  },
  viewAllText: {
    type: String,
    default: 'View All'
  },
  skeletonCount: {
    type: Number,
    default: 4
  },
  scrollAmount: {
    type: Number,
    default: 2 // Number of products to scroll at a time
  }
});

const sliderContainer = ref(null);
const isAtStart = ref(true);
const isAtEnd = ref(false);

const scrollLeft = () => {
  if (sliderContainer.value) {
    const slideWidth = sliderContainer.value.querySelector('.product-slide')?.offsetWidth || 300;
    sliderContainer.value.scrollBy({
      left: -slideWidth * props.scrollAmount,
      behavior: 'smooth'
    });
    // Update states after scroll
    setTimeout(updateArrowStates, 300);
  }
};

const scrollRight = () => {
  if (sliderContainer.value) {
    const slideWidth = sliderContainer.value.querySelector('.product-slide')?.offsetWidth || 300;
    sliderContainer.value.scrollBy({
      left: slideWidth * props.scrollAmount,
      behavior: 'smooth'
    });
    // Update states after scroll
    setTimeout(updateArrowStates, 300);
  }
};

const updateArrowStates = () => {
  if (!sliderContainer.value) return;
  
  const { scrollLeft, scrollWidth, clientWidth } = sliderContainer.value;
  isAtStart.value = scrollLeft <= 10;
  isAtEnd.value = scrollLeft + clientWidth >= scrollWidth - 10;
};

// Initialize with right state
const initializeSlider = () => {
  if (props.products.length > 0) {
    isAtStart.value = true;  // Always start at beginning
    isAtEnd.value = false;   // Right arrow enabled initially
  } else {
    isAtStart.value = true;
    isAtEnd.value = true;
  }
  
  nextTick(() => {
    updateArrowStates();
  });
};

// Watch for products changes to update arrow states
watch(() => props.products, () => {
  initializeSlider();
}, { immediate: true });

// Watch for loading changes
watch(() => props.loading, (newLoading) => {
  if (!newLoading) {
    initializeSlider();
  }
});

onMounted(async () => {
  await nextTick();
  initializeSlider();
  
  // Add resize listener to update arrow states
  const handleResize = () => {
    updateArrowStates();
  };
  window.addEventListener('resize', handleResize);
  
  // Cleanup on unmount
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
});
</script>

<style scoped>
.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.view-all-link {
  color: #28a745;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
}

.view-all-link:hover {
  color: #1e7e34;
}

/* Slider Styles */
.product-slider-container {
  position: relative;
  padding: 0 60px; /* Add padding to ensure arrows don't overlap content */
}

@media (max-width: 768px) {
  .product-slider-container {
    padding: 0 50px;
  }
}

@media (max-width: 576px) {
  .product-slider-container {
    padding: 0 45px;
  }
}

.products-slider {
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.products-slider::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.slider-track {
  display: flex;
  gap: 1.5rem;
  padding: 0.5rem 0;
}

.product-slide {
  flex: 0 0 280px; /* Fixed width for each slide */
  max-width: 280px;
}

/* Arrow Styles */
.slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: var(--background-white);
  border: 2px solid var(--color-primary);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  transition: all 0.3s ease;
  color: var(--color-primary);
  font-size: 1.3rem;
  box-shadow: var(--card-shadow);
  opacity: 0.95;
}

.slider-arrow:hover:not(:disabled) {
  background: var(--color-primary);
  color: var(--background-white);
  transform: translateY(-50%) scale(1.1);
  opacity: 1;
}

.slider-arrow:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-color: var(--border-color);
  color: var(--text-secondary);
  background: var(--background-light);
}

.slider-arrow-left {
  left: 10px;
}

.slider-arrow-right {
  right: 10px;
}

/* Skeleton Styles */
.product-card-skeleton {
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-image {
  height: 200px;
  width: 100%;
}

.skeleton-text {
  height: 16px;
  margin: 8px 0;
  border-radius: 4px;
}

.skeleton-text.short {
  width: 60%;
}

.skeleton-price {
  height: 20px;
  width: 40%;
  margin-top: 12px;
  border-radius: 4px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .product-slide {
    flex: 0 0 250px;
    max-width: 250px;
  }
  
  .slider-arrow {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }
  
  .slider-arrow-left {
    left: 5px;
  }
  
  .slider-arrow-right {
    right: 5px;
  }
}

@media (max-width: 576px) {
  .product-slide {
    flex: 0 0 220px;
    max-width: 220px;
  }
  
  .slider-track {
    gap: 1rem;
  }
}

/* Special styling for featured section */
.product-slider-section.featured {
  background-color: #e8f5e8;
}

.section-title.featured {
  color: #2c5530;
}
</style>
