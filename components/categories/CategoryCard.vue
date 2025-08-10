<template>
  <div
    class="category-card"
    :aria-label="`Browse ${category.name} category`"
    style="cursor: pointer;"
    @click="navigateToCategory"
  >
    <div class="category-image-container">
      <img 
        :src="category.image" 
        :alt="category.name"
        class="category-image"
        loading="lazy"
      />
    </div>
    <h3 class="category-name">{{ category.name }}</h3>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const props = defineProps({
  category: {
    type: Object,
    required: true,
  }
});
const { category } = props;
const router = useRouter();
const navigateToCategory = () => {
  if (category.link) {
    router.push(category.link);
  } else if (category.slug) {
    router.push(`/category/${category.slug}`);
  }
};
</script>

<style scoped>
.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  padding: 1rem;
  border-radius: 16px;
  background-color: var(--background-light);
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
  min-height: 200px;
  justify-content: center;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(var(--shadow-rgb), 0.12);
  text-decoration: none;
  background-color: var(--background-white);
}

.category-image-container {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1rem;
  background-color: var(--background-white);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(var(--shadow-rgb), 0.1);
  transition: transform 0.3s ease;
}

.category-card:hover .category-image-container {
  transform: scale(1.05);
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.category-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  margin: 0;
  line-height: 1.3;
  transition: color 0.3s ease;
}

.category-card:hover .category-name {
  color: var(--color-primary);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .category-card {
    padding: 0.75rem;
    min-height: 160px;
  }
  
  .category-image-container {
    width: 60px;
    height: 60px;
    margin-bottom: 0.75rem;
  }
  
  .category-name {
    font-size: 0.9rem;
  }
}
</style>
