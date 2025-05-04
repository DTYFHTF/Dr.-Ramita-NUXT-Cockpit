<template>
  <div class="recipe-card">
    <div class="card-header">
      <span class="category-tag">{{ category }}</span>
      <img 
        :src="image || '/placeholder-recipe.jpg'" 
        :alt="title"
        class="recipe-image"
      />
    </div>
    
    <div class="card-content">
      <div class="text-content">
        <h3 class="title">{{ title }}</h3>
        <p class="description">{{ description }}</p>
        
        <div class="meta-info">
          <div class="meta-item">
            <ClockIcon class="icon" />
            <span>{{ preparationTime }}</span>
          </div>
          <div class="meta-item">
            <UserGroupIcon class="icon" />
            <span>{{ servings }} servings</span>
          </div>
        </div>
      </div>

      <NuxtLink 
        :to="`/recipes/${slug}`"
        class="view-recipe-btn"
      >
        Explore Recipe
        <ArrowRightIcon class="btn-icon" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
defineProps({
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

<style scoped>
.recipe-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: transform 0.3s ease;
}

.recipe-card:hover {
  transform: translateY(-4px);
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
  background: rgba(255,255,255,0.9);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #7a6a5c;
  z-index: 2;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.card-content {
  padding: 20px;
}

.title {
  color: #4a3f35;
  font-size: 1.4rem;
  margin-bottom: 12px;
  font-weight: 500;
}

.description {
  color: #7a6a5c;
  line-height: 1.5;
  margin-bottom: 20px;
  min-height: 60px;
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
  background: #fff3e0;
  color: #7a6a5c;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid #eee4d8;
}

.view-recipe-btn:hover {
  background: #f5e6d1;
  color: #6b5d4f;
  transform: translateY(-2px);
}

.btn-icon {
  width: 16px;
  height: 16px;
}
.recipe-image {
  transition: transform 0.4s ease;
}

.card-header:hover .recipe-image {
  transform: scale(1.03);
}
.category-tag {
  background: linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(245,240,235,0.9) 100%);
  backdrop-filter: blur(2px);
}
</style>