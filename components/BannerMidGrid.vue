<template>
  <div class="banner-mid-grid">
    <div v-for="(banner, idx) in banners" :key="idx" class="banner-mid-item">
      <NuxtLink
        v-if="banner.link && isInternalRoute(banner.link)"
        :to="getBannerLink(banner.link)"
        class="banner-mid-link"
      >
        <div class="banner-mid-img-wrapper">
          <img :src="banner.image" :alt="banner.title || 'Banner'" />
        </div>
      </NuxtLink>

      <a v-else-if="banner.link" :href="banner.link" class="banner-mid-link" rel="noopener" target="_blank">
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
const props = defineProps({
  banners: {
    type: Array,
    required: true
  }
});

// Helper to prepend /category/ if link is a slug (not absolute URL or already a path)
function getBannerLink(link) {
  if (!link) return '#';
  if (link.startsWith('https')) return link;
  if (link.startsWith('/')) return link;
  return `/category/${encodeURIComponent(link)}`;
}

function isInternalRoute(link) {
  if (!link) return false;
  // treat starting with / as internal route
  if (link.startsWith('/')) return true;
  // non-http links that are slugs -> internal
  if (!/^https?:\/\//i.test(link) && !/\.(jpg|jpeg|png|gif|svg|webp)(\?.*)?$/i.test(link)) return true;
  return false;
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
  background: var(--surface-primary);
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
  background: var(--surface-primary);
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
