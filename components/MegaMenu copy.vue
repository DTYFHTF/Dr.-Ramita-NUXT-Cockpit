<template>
  <div
    class="mega-menu shadow-lg bg-white border rounded-3 px-3 pb-3 position-absolute mega-menu-wide"
    @mouseenter="open = true"
    @mouseleave="open = false"
    v-show="open"
    :style="{ right: '0', left: 'auto', top: '100%' }"
  >
    <div class="mega-menu-content d-flex w-100" >
      
      <!-- Product Grid -->
      <div class="product-grid flex-grow-1 ps-4" style="min-width: 0;">
        <div v-if="activeProducts.length === 0" class="text-muted small py-4 px-2" >
          No products found for this category.
        </div>
        <div v-else class="d-flex flex-wrap g-3">
          <div
            v-for="product in activeProducts.slice(0, 8)"
            :key="product.id"
            class="megamenu-product-item d-flex flex-column align-items-center mb-3 " 
            style="width: 110px; "
          >
            <NuxtLink :to="`/products/${product.slug}`" class="text-decoration-none text-dark w-100 text-center">
              <img
                :src="product.image || '/fallback.jpg'"
                :alt="product.name"
                class="megamenu-product-img mb-2"
              />
              <div class="megamenu-product-name text-truncate small">{{ product.name }}</div>
            </NuxtLink>
          </div>
        </div>
      </div>
      <!-- Category List -->
      <div class="category-list border-start ps-0">
        <ul class="list-group list-group-flush">
          <li
            v-for="(cat, idx) in categories"
            :key="cat.id || cat.slug || idx"
            class="list-group-item list-group-item-action py-2 px-3 cursor-pointer"
            :class="{ active: idx === activeIndex }"
            @mouseenter="setActive(idx)"
          >
            <LucideIcon :icon="cat.icon || 'mdi:tag'" class="me-2" />
            {{ cat.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, toRefs } from 'vue';
import LucideIcon from '@/components/LucideIcon.vue';
import ProductCard from '@/components/ProductCard.vue';

const props = defineProps({
  categories: { type: Array, required: true },
  products: { type: Array, required: true },
  open: { type: Boolean, default: false },
});
const emit = defineEmits(['update:open']);

const { categories, products } = toRefs(props);
const activeIndex = ref(0);

const setActive = (idx) => {
  activeIndex.value = idx;
};

const activeCategory = computed(() => categories.value[activeIndex.value]);
const activeProducts = computed(() => {
  if (!activeCategory.value) return [];
  // Try to match by id, slug, or name for flexibility
  return products.value.filter(
    (p) =>
      p.category_id === activeCategory.value.id ||
      p.category === activeCategory.value.slug ||
      p.category === activeCategory.value.name ||
      p.category_id === String(activeCategory.value.id)
  );
});

watch(
  () => props.open,
  (val) => {
    if (!val) activeIndex.value = 0;
  }
);
</script>

<style scoped>
.mega-menu {
  min-height: 300px;
  z-index: 1050;
  left: 0;
  right: 0;
  top: 100%;
  animation: fadeIn 0.18s;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.list-group-item.active {
  background: var(--bs-primary-bg-subtle, #e6f0ea);
  color: var(--text-deep-green, #1a5c3d);
  font-weight: 600;
}
.cursor-pointer {
  cursor: pointer;
}
.mini-product-card {
  transition: transform 0.2s;
}
.mini-product-card:hover {
  transform: translateY(-2px);
}
.mega-menu-wide {
  width: 900px;
  max-width: 98vw;
  min-width: 700px;
  overflow-x: hidden;
  display: flex;
}
.category-list {
  min-width: 180px;
  max-width: 220px;
  overflow: hidden;
}
.flex-grow-1 {
  overflow-x: auto;
}
.mega-menu-content {
  display: flex;
  width: 100%;
  overflow: hidden;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 0.75rem;
  overflow-x: visible;
}
.megamenu-product-item img,
.megamenu-product-img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #eee;
  background: #f8f8f8;
}
.megamenu-product-item {
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.megamenu-product-name {
  margin-top: 0.25rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #333;
  text-align: center;
}
</style>
