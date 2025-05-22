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
              :src="product.image || '/fallback.jpg'"
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
            v-for="(cat, idx) in categories"
            :key="cat.id || cat.slug || idx"
            @mouseenter="filterByCategory(cat.id)"
            :class="{ 'active-category': activeCategory === cat.id }"
          >
            <LucideIcon :icon="cat.icon || 'mdi:tag'" class="me-2" />
            <span class="category-name">{{ cat.name }}</span>
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue';
import { useProducts } from '@/composables/useProducts';
import LucideIcon from '@/components/LucideIcon.vue';
import { NuxtLink } from '#components';

const { categories, fetchCategories, fetchProducts, products } = useProducts();

const activeProducts = ref([]);
const activeCategory = ref(null);

onMounted(async () => {
  await fetchCategories();
  if (categories.value && categories.value.length > 0) {
    activeCategory.value = categories.value[0].id;
    filterByCategory(activeCategory.value);
  }
});

watch(
  () => categories.value,
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
</script>


<style scoped>
.mega-menu-container {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  max-width: 780px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
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
  width: 170px;
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
  overflow-y: auto;
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
}

.category-list li:hover {
  background: #e9ecef;
}

.category-list li.active-category {
  background: white;
  font-weight: 500;
}

.category-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-grid {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.product-scroller {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  padding: 4px;
}

.product-card {
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
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
}

.empty-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-size: 0.9rem;
}
</style>

