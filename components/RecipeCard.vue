<template>
  <div class="recipe-card">
    <div class="card-header">
      <span class="category-tag">{{ category || 'Uncategorized' }}</span>
      <img 
        :src="image || '/placeholder-recipe.jpg'" 
        :alt="title"
        class="recipe-image"
      />
    </div>
    
    <div class="card-content">
      <div class="text-content">
        <h3 class="title">{{ title }}</h3>
        <p class="description">{{ description || 'No description available' }}</p>
        
        <div class="meta-info">
          <div class="meta-item">
            <LucideIcon icon="mdi:clock-outline" class="icon" />
            <span>{{ preparationTime || 'N/A' }}</span>
          </div>
          <div class="meta-item">
            <LucideIcon icon="mdi:account-group-outline" class="icon" />
            <span>{{ servings || 0 }} servings</span>
          </div>
        </div>
      </div>

      <NuxtLink 
        v-if="slug"
        :to="`/recipe/${slug}`"
        class="view-recipe-btn btn-smooth-success"
      >
        Explore Recipe
        <LucideIcon icon="mdi:arrow-right" class="btn-icon" />
      </NuxtLink>
      <div v-else class="view-recipe-btn view-recipe-btn-disabled">
        Recipe Link Unavailable
      </div>
    </div>
  </div>
</template>

<script setup>
import LucideIcon from '@/components/LucideIcon.vue';

const props = defineProps({
  id: String,
  title: String,
  slug: String,
  image: String,
  category: String,
  description: String,
  preparationTime: String,
  servings: Number,
});
</script>

<style lang="scss" scoped>

.recipe-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: $card-shadow;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0,0,0,0.03);
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.12);
}

.card-header {
  position: relative;
  height: 200px;
  background: #f5f0eb;
}

.category-tag {
  position: absolute;
  top: 15px;
  left: 15px;
  background: linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(245,240,235,0.9) 100%);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #7a6a5c;
  z-index: 2;
  backdrop-filter: blur(2px);
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.4s ease;
}

.card-header:hover .recipe-image {
  transform: scale(1.03);
}

.card-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.text-content {
  flex: 1;
}

.title {
  color: $text-deep-green;
  font-size: 1.4rem;
  margin-bottom: 12px;
  font-weight: 500;
}

.description {
  color: #7a6a5c;
  line-height: 1.5;
  margin-bottom: 20px;
  min-height: 60px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta-info {
  display: flex;
  gap: 25px;
  margin-bottom: 25px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9c8e7e;
}

.icon {
  width: 18px;
  height: 18px;
  color: #c5b5a7;
}

.view-recipe-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background-color: $text-deep-green;
  color: $text-button;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  font-weight: 500;
  margin-top: auto;
}

.view-recipe-btn:hover {
  background-color: darken($text-deep-green, 5%);
  color: $text-button;
  transform: translateY(-2px);
  box-shadow: $btn-hover-shadow;
}

.view-recipe-btn-disabled {
  background: #f0f0f0;
  color: #999;
  cursor: not-allowed;
}

.btn-icon {
  width: 16px;
  height: 16px;
}
</style>