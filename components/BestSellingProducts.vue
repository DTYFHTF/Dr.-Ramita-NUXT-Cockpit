<template>
  <section class="best-selling-products py-5">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="section-title">Best Selling Products</h2>
        <a href="/products?sort=best-selling" class="view-all-link">View All <i class="bi bi-arrow-right"></i></a>
      </div>
      
      <div class="row" v-if="!loading">
        <div class="col-lg-3 col-md-6 col-sm-6 mb-4" v-for="product in products" :key="product.id">
          <ProductCard :product="product" />
        </div>
      </div>
      
      <div v-else class="row">
        <div class="col-lg-3 col-md-6 col-sm-6 mb-4" v-for="n in 4" :key="n">
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
  </section>
</template>

<script setup>
import ProductCard from '@/components/ProductCard.vue';

const props = defineProps({
  products: {
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
</style>
