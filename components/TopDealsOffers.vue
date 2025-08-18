<template>
  <section class="top-deals-offers py-5">
    <div class="container">
      <h2 class="section-title mb-4">Top Deals & Offers</h2>
      <div class="row">
        <div class="col-lg-3 col-md-6 col-sm-6 mb-4" v-for="deal in deals" :key="deal.id">
          <!-- Category promotion card -->
          <div v-if="deal.kind === 'category'" class="deal-card category-card text-center">
            <div class="deal-image">
              <img :src="deal.image" :alt="deal.title || deal.title || 'Category'" class="img-fluid" loading="lazy">
            </div>
            <div class="deal-content">
              <h5 class="deal-title">{{ deal.title }}</h5>
              <p class="deal-description">{{ deal.description }}</p>
              <NuxtLink :to="deal.url" class="btn btn-success btn-sm w-100 mt-2">Shop Category</NuxtLink>
            </div>
          </div>

          <!-- Product promotion card -->
          <div v-else class="deal-card">
            <div class="deal-badge" v-if="deal.price_breakdown && deal.price_breakdown.discount_percentage">
              <span>{{ deal.price_breakdown.discount_percentage }}% OFF</span>
            </div>
            <div class="deal-image">
              <img :src="deal.image" :alt="deal.title || 'Deal image'" class="img-fluid" loading="lazy">
            </div>
            <div class="deal-content">
              <h5 class="deal-title">{{ deal.title }}</h5>
              <div class="deal-price">
                <span class="original-price" v-if="deal.price_breakdown && deal.price_breakdown.original_price">₹{{ deal.price_breakdown.original_price }}</span>
                <span class="discounted-price">₹{{ deal.price_breakdown ? deal.price_breakdown.final_price : deal.price }}</span>
              </div>
              <NuxtLink :to="deal.url" class="btn btn-success btn-sm w-100 mt-2">Shop Now</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  deals: {
    type: Array,
    default: () => []
  }
});
</script>

<style scoped>
.top-deals-offers {
  background-color: var(--background-light);
  color: var(--text-primary);
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.deal-card {
  position: relative;
  background: var(--background-white);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: transform 0.3s ease;
  height: 100%;
  border: 1px solid var(--border-color);
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0.25rem;
}

.deal-card:hover {
  transform: translateY(-5px);
}

.deal-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 2;
}

.deal-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.deal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.deal-card:hover .deal-image img {
  transform: scale(1.05);
}

.deal-content {
  padding: 1.5rem;
}

.deal-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.deal-description {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.4;
}

.deal-price {
  margin-bottom: 1rem;
}

.original-price {
  font-size: 0.9rem;
  color: var(--text-muted);
  text-decoration: line-through;
  margin-right: 0.5rem;
}

.discounted-price {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-success);
}

.btn-success {
  background-color: var(--color-success);
  border-color: var(--color-success);
  font-weight: 500;
  padding: 0.6rem 1rem;
  border-radius: 8px;
}

.btn-success:hover {
  background-color: var(--primary-dark);
  border-color: var(--primary-dark);
}

@media (max-width: 768px) {
  .deal-image {
    height: 160px;
  }
  
  .deal-content {
    padding: 1rem;
  }
  
  .deal-title {
    font-size: 1.1rem;
  }
}
</style>
