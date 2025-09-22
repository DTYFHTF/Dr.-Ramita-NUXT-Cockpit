<template>
  <div class="mega-menu-container">
    <div class="mega-menu-content">
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
      <div class="category-tree-megamenu">
        <HierarchicalCategoryTree
          :categories="hierarchicalCategories"
          :activeCategory="activeCategory"
          @category-select="handleCategorySelect"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useProducts } from '@/composables/useProducts';
import { useProductFilters } from '@/composables/useProductFilters';
import HierarchicalCategoryTree from '@/components/categories/HierarchicalCategoryTree.vue';
import { NuxtLink } from '#components';
import { useImageUrl } from '@/composables/useImageUrl.js';

const { fetchProducts, products } = useProducts();
const { categoriesWithCounts, fetchFilterOptions } = useProductFilters();
const { getImageUrl } = useImageUrl();

const activeProducts = ref([]);
const activeCategory = ref(null);

// Build hierarchical structure from flat categories with correct counts
const hierarchicalCategories = computed(() => {
  if (!categoriesWithCounts.value.length) return [];
  const categoryMap = new Map();
  const rootCategories = [];
  categoriesWithCounts.value.forEach(cat => {
    const categoryWithChildren = {
      ...cat,
      id: String(cat.id),
      parent_id: cat.parent_id ? String(cat.parent_id) : null,
      children: [],
      products_count: cat.products_count || 0
    };
    categoryMap.set(String(cat.id), categoryWithChildren);
  });
  categoriesWithCounts.value.forEach(cat => {
    const categoryId = String(cat.id);
    const parentId = cat.parent_id ? String(cat.parent_id) : null;
    const categoryItem = categoryMap.get(categoryId);
    if (parentId && categoryMap.has(parentId)) {
      const parent = categoryMap.get(parentId);
      parent.children.push(categoryItem);
    } else {
      rootCategories.push(categoryItem);
    }
  });
  return rootCategories;
});


// Helper: recursively find first category with products_count > 0
function findFirstCategoryWithProducts(categories) {
  for (const cat of categories) {
    if (cat.products_count > 0) return cat;
    if (cat.children && cat.children.length > 0) {
      const found = findFirstCategoryWithProducts(cat.children);
      if (found) return found;
    }
  }
  return null;
}


// Recursively try categories with products_count > 0 until products are found
async function selectFirstCategoryWithProducts(categories) {
  for (const cat of categories) {
    if (cat.products_count > 0) {
      await fetchProducts(1, 30, '', cat.id);
      if (products.value && products.value.length > 0) {
        activeCategory.value = cat.id;
        activeProducts.value = products.value;
        return true;
      }
    }
    if (cat.children && cat.children.length > 0) {
      const found = await selectFirstCategoryWithProducts(cat.children);
      if (found) return true;
    }
  }
  return false;
}

onMounted(async () => {
  await fetchFilterOptions();
  await selectFirstCategoryWithProducts(hierarchicalCategories.value);
});

function handleCategorySelect(category) {
  if (category && category.id) {
    activeCategory.value = category.id;
    fetchProducts(1, 30, '', category.id).then(() => {
      activeProducts.value = products.value;
    });
  }
}

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


.category-tree-megamenu {
  width: 260px;
  background: var(--background-white);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  max-height: 368px;
  padding: 12px 0;
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
  color: var(--color-primary);
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

