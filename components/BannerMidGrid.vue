<template>
  <div class="banner-mid-grid">
    <div v-for="(banner, idx) in banners" :key="idx" class="banner-mid-item">
      <NuxtLink
        v-if="banner.link"
        :to="getBannerLink(banner.link)"
        class="banner-mid-link"
      >
        <div class="banner-mid-img-wrapper">
          <img :src="banner.image" :alt="banner.title || 'Banner'" />
        </div>
      </NuxtLink>
      <div v-else class="banner-mid-img-wrapper">
        <img :src="banner.image" :alt="banner.title || 'Banner'" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  banners: {
    type: Array,
    required: true
  }
});

// Helper to prepend /category/ if link is a slug (not absolute URL or already a path)
function getBannerLink(link) {
  if (!link) return '#';
  //Production
  if (link.startsWith('https') || link.startsWith('/')) return link;
  // If it's a slug (no slash, no https), prepend /category/
  return `/category/${encodeURIComponent(link)}`;
}
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
