<template>
  <section class="daily-seasonal-products py-5">
    <div class="container">
      <h2 class="section-title mb-4">Daily & Seasonal Products</h2>
      <div class="row">
        <div class="col-lg-4 col-md-6 mb-4" v-for="category in categories" :key="category.id">
          <div class="category-card">
            <div class="category-image">
              <img :src="category.image" :alt="category.title" class="img-fluid">
              <div class="category-overlay">
                <h4 class="category-title">{{ category.title }}</h4>
                <p class="category-subtitle">{{ category.subtitle }}</p>
                <NuxtLink :to="category.url" class="btn btn-primary btn-sm">
                  Explore <i class="bi bi-arrow-right"></i>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  categories: {
    type: Array,
    default: () => [
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

.category-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  height: 250px;
}

.category-card:hover {
  transform: translateY(-5px);
}

.category-image {
  position: relative;
  width: 100%;
  height: 100%;
}

.category-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  padding: 2rem;
}

.category-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.category-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

.btn-primary {
  background-color: #28a745;
  border-color: #28a745;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  font-weight: 500;
}

.btn-primary:hover {
  background-color: #1e7e34;
  border-color: #1e7e34;
}

@media (max-width: 768px) {
  .category-card {
    height: 200px;
  }
  
  .category-title {
    font-size: 1.2rem;
  }
  
  .category-subtitle {
    font-size: 0.9rem;
  }
}
</style>
