<template>
  <section class="top-deals-offers py-5 bg-light">
    <div class="container">
      <h2 class="section-title mb-4">Top Deals & Offers</h2>
      <div class="row">
        <div class="col-lg-3 col-md-6 col-sm-6 mb-4" v-for="deal in deals" :key="deal.id">
          <div class="deal-card">
            <div class="deal-badge" v-if="deal.discount">
              <span>{{ deal.discount }}% OFF</span>
            </div>
            <div class="deal-image">
              <img :src="deal.image" :alt="deal.title" class="img-fluid">
            </div>
            <div class="deal-content">
              <h5 class="deal-title">{{ deal.title }}</h5>
              <p class="deal-description">{{ deal.description }}</p>
              <div class="deal-price">
                <span class="original-price" v-if="deal.originalPrice">₹{{ deal.originalPrice }}</span>
                <span class="discounted-price">₹{{ deal.price }}</span>
              </div>
              <NuxtLink :to="deal.url" class="btn btn-success btn-sm w-100 mt-2">
                Shop Now
              </NuxtLink>
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
    default: () => [
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
    ]
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

.deal-card {
  position: relative;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  height: 100%;
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
  color: #333;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.deal-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.deal-price {
  margin-bottom: 1rem;
}

.original-price {
  font-size: 0.9rem;
  color: #999;
  text-decoration: line-through;
  margin-right: 0.5rem;
}

.discounted-price {
  font-size: 1.2rem;
  font-weight: 600;
  color: #28a745;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
  font-weight: 500;
  padding: 0.6rem 1rem;
  border-radius: 8px;
}

.btn-success:hover {
  background-color: #1e7e34;
  border-color: #1e7e34;
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
