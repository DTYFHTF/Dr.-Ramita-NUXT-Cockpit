<template>
  <div class="banner-mid-grid">
    <div v-for="(banner, idx) in banners" :key="idx" class="banner-mid-item">
      <a v-if="banner.link" :href="banner.link" target="_blank" rel="noopener">
        <div class="banner-mid-img-wrapper">
          <img :src="banner.image" :alt="banner.title || 'Banner'" />
        </div>
      </a>
      <div v-else class="banner-mid-img-wrapper">
        <img :src="banner.image" :alt="banner.title || 'Banner'" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  banners: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.banner-mid-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 2rem 0;
}
.banner-mid-item {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.banner-mid-img-wrapper {
  width: 100%;
  aspect-ratio: 2.7/1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}
.banner-mid-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: inherit;
  display: block;
}
@media (max-width: 900px) {
  .banner-mid-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
