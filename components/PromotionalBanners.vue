<template>
  <section class="promotional-banners py-4">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 col-md-6 mb-4" v-for="banner in banners" :key="banner.id">
          <div class="promo-banner" @click="navigateToUrl(banner.url)">
            <img :src="banner.image" :alt="banner.title" class="img-fluid">
            <div class="banner-overlay" v-if="banner.overlay">
              <div class="banner-content">
                <h3 class="banner-title">{{ banner.title }}</h3>
                <p class="banner-subtitle" v-if="banner.subtitle">{{ banner.subtitle }}</p>
                <button class="btn btn-primary" v-if="banner.buttonText">
                  {{ banner.buttonText }}
                </button>
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
  banners: {
    type: Array,
    default: () => [
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
    ]
  }
});

const navigateToUrl = (url) => {
  if (url) {
    navigateTo(url);
  }
};
</script>

<style scoped>
.promo-banner {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.promo-banner:hover {
  transform: translateY(-5px);
}

.promo-banner img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.promo-banner:hover img {
  transform: scale(1.05);
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-content {
  text-align: center;
  color: white;
  padding: 2rem;
}

.banner-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.banner-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

.btn-primary {
  background-color: #28a745;
  border-color: #28a745;
  padding: 0.6rem 2rem;
  border-radius: 25px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary:hover {
  background-color: #1e7e34;
  border-color: #1e7e34;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .promo-banner img {
    height: 250px;
  }
  
  .banner-title {
    font-size: 1.4rem;
  }
  
  .banner-subtitle {
    font-size: 1rem;
  }
  
  .banner-content {
    padding: 1.5rem;
  }
}
</style>
