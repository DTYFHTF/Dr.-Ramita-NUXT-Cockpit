<template>
  <section class="featured-categories-section">
    <div class="container">
      <!-- Section Header -->
  <!-- Section Header removed as per request -->

      <!-- Categories Grid -->
      <div v-if="categories && categories.length" class="categories-grid">
        <CategoryCard 
          v-for="category in categories.slice(0, 6)" 
          :key="category.id || category.name"
          :category="category"
        />
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading" class="empty-state text-center py-5">
        <i class="bi bi-grid-3x3-gap fs-1 text-muted mb-3"></i>
        <p class="text-muted">No categories available at the moment.</p>
      </div>

      <!-- Loading State -->
      <div v-else class="loading-state">
        <div class="categories-grid">
          <div 
            v-for="n in 6" 
            :key="n"
            class="category-skeleton"
          >
            <div class="skeleton-image"></div>
            <div class="skeleton-text"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import CategoryCard from '@/components/categories/CategoryCard.vue';

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.featured-categories-section {
  padding: 4rem 0;
  background-color: var(--background-white);
}

.section-header {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-family: var(--font-primary, 'Cormorant Garamond', serif);
}

.section-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin: 0;
  max-width: 600px;
  margin: 0 auto;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.empty-state {
  padding: 3rem 1rem;
}

/* Loading skeleton styles */
.category-skeleton {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-radius: 16px;
  background-color: var(--background-light);
  min-height: 200px;
  justify-content: center;
}

.skeleton-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(90deg, var(--background-light) 25%, var(--background-white) 50%, var(--background-light) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-bottom: 1rem;
}

.skeleton-text {
  width: 100px;
  height: 16px;
  border-radius: 8px;
  background: linear-gradient(90deg, var(--background-light) 25%, var(--background-white) 50%, var(--background-light) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .featured-categories-section {
    padding: 2rem 0;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
  
  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
  }
  
  .skeleton-image {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 480px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
