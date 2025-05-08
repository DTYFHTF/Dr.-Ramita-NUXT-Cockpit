<template>
  <div class="yoga-card" role="article" aria-labelledby="yoga-title" tabindex="0">
    <div class="card-header">
      <span class="category-tag">{{ tags?.[0] ?? 'Uncategorized' }}</span>

      <img 
        :src="coverImage || '/placeholder-yoga.jpg'" 
        alt="Yoga Cover Image" 
        class="yoga-image" 
      />
    </div>

    <div class="card-content">
      <h3 id="yoga-title" class="title">{{ title }}</h3>
      <p class="description">{{ shortDescription }}</p>

      <ul class="benefits-list" aria-label="Benefits">
        <li v-for="(point, index) in points" :key="index" class="benefit-item">
          <LucideIcon icon="mdi:check-circle" class="benefit-icon" aria-hidden="true" />
          <span>{{ point }}</span>
        </li>
      </ul>

      <div class="button-container">
        <NuxtLink 
          :to="`/yoganmeditation/${slug}`" 
          class="btn-smooth-primary"
        >
          Begin your practice
          <LucideIcon icon="mdi:arrow-right-circle" color="white" class="btn-icon" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import LucideIcon from '@/components/LucideIcon.vue';

defineProps({
  title: String,
  shortDescription: String,
  coverImage: String,
  slug: String,
  tags: Array,
});
</script>

<style scoped>
.yoga-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.yoga-card:hover,
.yoga-card:focus {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.12);
  outline: none;
}

.card-header {
  position: relative;
  height: 200px;
  background: #f5f0eb;
}

.yoga-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.4s ease;
}

.card-header:hover .yoga-image {
  transform: scale(1.03);
}

.card-content {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

.title {
  color: #4a3f35;
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

.description {
  color: #7a6a5c;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  text-align: center;
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  color: #7a6a5c;
  border-bottom: 1px solid #eee4d8;
}

.benefit-item:last-child {
  border-bottom: none;
}

.benefit-icon {
  width: 1.2rem;
  height: 1.2rem;
  color: #198754;
  flex-shrink: 0;
}

.button-container {
  text-align: center;
  margin-top: 1.5rem;
}

.btn-icon {
  width: 1.2rem;
  height: 1.2rem;
}
</style>