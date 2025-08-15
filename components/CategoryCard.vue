<template>
  <div class="card category-card border shadow-sm">
    <NuxtLink
      :to="target"
      class="text-decoration-none category-link d-flex flex-column"
    >
      <div class="image-container">
        <img
          :src="category.image"
          :alt="category.title"
          class="card-img-top category-image"
        />
        <div class="category-overlay">
          <div class="overlay-content">
            <h4 class="category-title">{{ category.title }}</h4>
            <p class="category-subtitle">{{ category.subtitle || category.description }}</p>
            <span class="btn btn-smooth-success">Explore More</span>
          </div>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  category: {
    type: Object,
    required: true
  }
});

// Compute a safe target URL for the category
const target = computed(() => {
  const c = props.category || {};
  // Prefer admin-provided link; treat it as slug when not absolute
  if (c.link) {
    const l = String(c.link).trim();
    if (!l) return '/category';
    // Absolute URL (http:// or https://)
    if (/^https?:\/\//.test(l)) return l;
    // Protocol-relative (//host/path)
    if (/^\/\//.test(l)) return l;
    // Leading slash -> assume already a path
    if (l.startsWith('/')) return l;
    // Otherwise treat it as a slug provided by admin
    return `/category/${l}`;
  }

  // Fallback to slug field if present
  if (c.slug) return `/category/${c.slug}`;

  // Fallback
  return '/category';
});
</script>

<style scoped>
.category-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  border-radius: 12px;
  min-height: 200px; /* use min-height so layout can adapt */
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.category-link {
  color: inherit;
  height: 100%;
}

.image-container {
  position: relative;
  /* enforce a consistent aspect ratio so images line up */
  aspect-ratio: 1.3/1;
  width: 100%;
  height: auto;
  overflow: hidden;
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  display: block;
}

.category-card:hover .category-image {
  transform: scale(1.05);
}

.category-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.category-card:hover .category-overlay {
  opacity: 1;
}

.overlay-content {
  text-align: center;
  color: white;
  padding: 1.5rem;
}

.category-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.category-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0 0 1rem 0;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

@media (max-width: 768px) {
  .category-card {
    min-height: 160px; /* reduced for mobile */
  }
  
  .category-title {
    font-size: 1.2rem;
  }
  
  .category-subtitle {
    font-size: 0.9rem;
  }
  
  .explore-btn {
    padding: 0.4rem 1rem;
    font-size: 0.8rem;
  }
}
</style>
