<template>
  <div class="yoga-card">
    <div class="card-header">
      <div class="icon-container">
        <LucideIcon :icon="icon" class="yoga-icon" />
      </div>
    </div>
    
    <div class="card-content">
      <h3 class="title">{{ title }}</h3>
      <p class="description">{{ shortDescription }}</p>
      
      <ul class="benefits-list">
        <li v-for="(point, index) in points" :key="index" class="benefit-item">
          <LucideIcon icon="mdi:check-circle" class="benefit-icon" />
          {{ point }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import LucideIcon from '@/components/LucideIcon.vue';

defineProps({
  title: String,
  shortDescription: String,
  points: Array,
  icon: String,
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
}

.yoga-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.12);
}

.card-header {
  background: #f0f4f8;
  padding: 2rem;
  text-align: center;
}

.icon-container {
  display: inline-flex;
  background: #fff;
  border-radius: 50%;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.yoga-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: #4a3f35;
}

.card-content {
  padding: 1.5rem;
}

.title {
  color: #4a3f35;
  font-size: 1.3rem;
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
</style>