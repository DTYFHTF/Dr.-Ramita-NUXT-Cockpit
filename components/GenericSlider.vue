<template>
  <section class="generic-slider-section py-5" :class="sectionClass">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="section-title" :class="titleClass">{{ title }}</h2>
        <a v-if="viewAllUrl" :href="viewAllUrl" class="view-all-link">{{ viewAllText }} <i class="bi bi-arrow-right"></i></a>
      </div>
      
      <div class="slider-container position-relative">
        <!-- Navigation Arrows -->
        <button 
          class="slider-arrow slider-arrow-left" 
          @click="scrollLeft"
          :disabled="isAtStart && !loading"
          v-show="!loading && items.length > 3"
        >
          <LucideIcon icon="mdi:chevron-left" />
        </button>
        
        <button 
          class="slider-arrow slider-arrow-right" 
          @click="scrollRight"
          :disabled="isAtEnd && !loading"
          v-show="!loading && items.length > 3"
        >
          <LucideIcon icon="mdi:chevron-right" />
        </button>
        
        <!-- Items Slider -->
        <div 
          ref="sliderContainer" 
          class="items-slider"
          @scroll="updateArrowStates"
        >
          <div class="slider-track">
            <div 
              v-if="!loading" 
              class="item-slide" 
              v-for="item in items" 
              :key="item.id"
            >
              <!-- Dynamic Component -->
              <component 
                :is="cardComponent" 
                v-bind="getCardProps(item)"
              />
            </div>
            
            <!-- Loading Skeletons -->
            <div 
              v-else 
              class="item-slide" 
              v-for="n in skeletonCount" 
              :key="n"
            >
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
    </div>
  </section>
</template>

<script setup>
import LucideIcon from '@/components/LucideIcon.vue';
import { ref, onMounted, nextTick, watch } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
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
    default: ''
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
    default: 2
  },
  cardComponent: {
    type: [String, Object],
    required: true
  },
  cardPropsKey: {
    type: String,
    default: 'item' // Default prop name to pass to the card component
  }
});

const sliderContainer = ref(null);
const isAtStart = ref(true);
const isAtEnd = ref(false);

// Helper function to get the props for the card component
const getCardProps = (item) => {
  return {
    [props.cardPropsKey]: item
  };
};

const scrollLeft = () => {
  if (sliderContainer.value) {
    const slideWidth = sliderContainer.value.querySelector('.item-slide')?.offsetWidth || 300;
    sliderContainer.value.scrollBy({
      left: -slideWidth * props.scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(updateArrowStates, 300);
  }
};

const scrollRight = () => {
  if (sliderContainer.value) {
    const slideWidth = sliderContainer.value.querySelector('.item-slide')?.offsetWidth || 300;
    sliderContainer.value.scrollBy({
      left: slideWidth * props.scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(updateArrowStates, 300);
  }
};

const updateArrowStates = () => {
  if (!sliderContainer.value) return;
  
  const { scrollLeft, scrollWidth, clientWidth } = sliderContainer.value;
  isAtStart.value = scrollLeft <= 10;
  isAtEnd.value = scrollLeft + clientWidth >= scrollWidth - 10;
};

const initializeSlider = () => {
  if (props.items.length > 0) {
    isAtStart.value = true;
    isAtEnd.value = false;
  } else {
    isAtStart.value = true;
    isAtEnd.value = true;
  }
  
  nextTick(() => {
    updateArrowStates();
  });
};

watch(() => props.items, () => {
  initializeSlider();
}, { immediate: true });

watch(() => props.loading, (newLoading) => {
  if (!newLoading) {
    initializeSlider();
  }
});

onMounted(async () => {
  await nextTick();
  initializeSlider();
  
  const handleResize = () => {
    updateArrowStates();
  };
  window.addEventListener('resize', handleResize);
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
});
</script>

<style scoped>
.generic-slider-section {
  background-color: var(--background-white);
  color: var(--text-primary);
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.view-all-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
}

.view-all-link:hover {
  color: var(--primary-dark);
}

.slider-container {
  position: relative;
  padding: 0 60px;
}

@media (max-width: 768px) {
  .slider-container {
    padding: 0 50px;
  }
}

@media (max-width: 576px) {
  .slider-container {
    padding: 0 45px;
  }
}

.items-slider {
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.items-slider::-webkit-scrollbar {
  display: none;
}

.slider-track {
  display: flex;
  gap: 1.5rem;
  padding: 0.5rem 0;
}

.item-slide {
  flex: 0 0 280px;
  max-width: 280px;
}

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

.skeleton-card {
  border: 1px solid var(--border-color);
  background-color: var(--background-white);
  box-shadow: var(--card-shadow);
}

.skeleton {
  background: linear-gradient(90deg, var(--background-light) 25%, var(--border-color) 50%, var(--background-light) 75%);
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

@media (max-width: 768px) {
  .item-slide {
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
  .item-slide {
    flex: 0 0 220px;
    max-width: 220px;
  }
  
  .slider-track {
    gap: 1rem;
  }
}
</style>
