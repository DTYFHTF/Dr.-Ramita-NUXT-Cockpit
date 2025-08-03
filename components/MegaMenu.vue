<template>
  <div class="mega-menu-container">

    <div class="mega-menu-content">
      <!-- Product Grid -->
      <div class="product-grid">
        <div v-if="activeProducts.length === 0" class="empty-state">
          Select a category to view products
        </div>
        <div v-else class="product-scroller">
          <NuxtLink
            v-for="product in activeProducts.slice(0, 10)"
            :key="product.id"
            :to="`/products/${product.slug}`"
            class="product-card"
          >
            <img
              :src="firstAvailableImage(product)"
              :alt="product.name"
              class="product-image"
            />
            <div class="product-title">{{ product.name }}</div>
          </NuxtLink>
        </div>
      </div>
      <!-- Category List -->
      <div class="category-list">
        <ul>
          <li
            v-for="(cat, idx) in displayCategories"
            :key="cat.id || cat.slug || idx"
            @mouseenter="filterByCategory(cat.id)"
            :class="{ 'active-category': activeCategory === cat.id }"
          >
            <LucideIcon :icon="cat.icon || 'mdi:tag'" class="me-2" />
            <span class="category-name">{{ cat.name }}</span>
            <span v-if="cat.children && cat.children.length > 0" class="subcategory-count">
              {{ cat.children.length }}
            </span>
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useProducts } from '@/composables/useProducts';
import { useHierarchicalCategories } from '@/composables/useHierarchicalCategories';
import LucideIcon from '@/components/LucideIcon.vue';
import { NuxtLink } from '#components';
import { useImageUrl } from '@/composables/useImageUrl.js'

const { fetchProducts, products } = useProducts();
const { hierarchicalCategories, fetchCategories } = useHierarchicalCategories();
const { getImageUrl } = useImageUrl();

const activeProducts = ref([]);
const activeCategory = ref(null);

// Display only level 1 categories in mega menu
const displayCategories = computed(() => {
  return hierarchicalCategories.value.filter(cat => cat.level === 1);
});

onMounted(async () => {
  await fetchCategories();
  if (displayCategories.value && displayCategories.value.length > 0) {
    activeCategory.value = displayCategories.value[0].id;
    filterByCategory(activeCategory.value);
  }
});

watch(
  () => displayCategories.value,
  (newCategories) => {
    if (newCategories && newCategories.length > 0 && !activeCategory.value) {
      activeCategory.value = newCategories[0].id;
      filterByCategory(activeCategory.value);
    }
  }
);

function filterByCategory(categoryId) {
  activeCategory.value = categoryId;
  fetchProducts(1, 30, '', categoryId).then(() => {
    activeProducts.value = products.value;
  });
}

// Helper for image fallback
function firstAvailableImage(product) {
  const imgs = [product.image, product.image_2, product.image_3].filter(Boolean);
  return getImageUrl(imgs[0]);
}
</script>


<style scoped>
.mega-menu-container {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 1000px !important;
  max-width: 1000px !important;
  min-width: 900px;
  background: var(--background-white);
  border-radius: 8px;
  box-shadow: 0 12px 24px rgba(var(--shadow-rgb), 0.1);
  max-height: 400px;
  display: flex;
  overflow: hidden;
  z-index: 1000;
  opacity: 1;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.mega-menu-content {
  display: flex;
  width: 100%;
  min-height: 300px;
}

.category-list {
  width: 200px;
  background: var(--background-white);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  max-height: 368px; /* Adjust as needed to fit inside the menu */
  padding: 12px 0;
}

.category-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-list li {
  padding: 10px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  color: var(--text-primary);
  border-radius: 6px;
  margin: 2px 8px;
}

.category-list li:hover {
  background: var(--background-light);
  color: var(--text-primary);
}

.category-list li.active-category {
  background: var(--background-light);
  font-weight: 500;
  color: var(--text-primary);
}

.category-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.subcategory-count {
  background: var(--color-primary);
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  margin-left: auto;
}

.product-grid {
  flex: 1;
  padding: 16px;
  /* Remove overflow-y: auto; so product grid does not scroll */
}

.product-scroller {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  padding: 4px;
}

.product-card {
  text-decoration: none;
  color: var(--text-primary);
  transition: transform 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  color: var(--text-primary);
}

.product-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 8px;
}

.product-title {
  font-size: 0.8rem;
  line-height: 1.3;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: var(--text-primary);
}

.empty-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 0.9rem;
}
</style>

