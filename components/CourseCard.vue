<template>
  <div class="course-card">
    <div class="card-header">
      <span class="price-badge" :class="price === 0 ? 'free' : 'paid'">
        {{ price === 0 ? 'Free' : `$${price}` }}
      </span>
      <img 
        :src="image || '/placeholder-course.jpg'" 
        :alt="title"
        class="course-image"
      />
    </div>
    
    <div class="card-content">
      <div class="text-content">
        <h3 class="title line-clamp-3">{{ title }}</h3> 
        <p class="description line-clamp-2">{{ description }}</p> 
        
        <div class="meta-info">
          <div class="meta-item">
            <LucideIcon icon="mdi:book-open" class="icon" />
            <span>{{ duration }}</span>
          </div>
          <div class="meta-item">
            <LucideIcon icon="mdi:calendar" class="icon" />
            <span>{{ lessons }} lessons</span>
          </div>
        </div>
      </div>

      <div class="button-container">
        <NuxtLink 
          :to="`/course/${id}`"
          class="enroll-btn"
        >
          Learn More
          <LucideIcon icon="mdi:arrow-right-circle" class="btn-icon" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import LucideIcon from '@/components/LucideIcon.vue';

defineProps({
  id: String,
  title: String,
  description: String,
  duration: String,
  lessons: Number,
  price: Number,
  image: String,
});
</script>

<style scoped>
.course-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.12);
}

.card-header {
  position: relative;
  height: 200px;
  background: #f0f4f8;
  flex: 0 0 200px;
}

.price-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 14px;
  font-size: 0.85rem;
  border-radius: 20px;
  font-weight: 600;
  z-index: 2;
  backdrop-filter: blur(4px);
}

.price-badge.free {
  background: linear-gradient(145deg, rgba(144, 238, 144, 0.9) 0%, rgba(152, 251, 152, 0.9) 100%);
  color: #2d5a2d;
}

.price-badge.paid {
  background: linear-gradient(145deg, rgba(255, 245, 230, 0.9) 0%, rgba(255, 250, 240, 0.9) 100%);
  color: #7a6a5c;
}

.course-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
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
  color: #4a3f35;
  font-size: 1.3rem; 
  margin-bottom: 10px; 
  font-weight: 600;
  line-height: 1.4; 
  min-height: 4em;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.description {
  color: #7a6a5c;
  line-height: 1.5;
  margin-bottom: 15px; /* Reduced from 20px */
  min-height: 3em; /* Adjusted for 2 lines */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta-info {
  display: flex;
  gap: 20px; /* Reduced from 25px */
  margin-bottom: 15px; /* Reduced from 25px */
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9c8e7e;
  font-size: 0.95rem;
}

.icon {
  width: 18px;
  height: 18px;
  color: #c5b5a7;
}

.button-container {
  margin-top: auto;
  padding-top: 15px; /* Reduced from 20px */
}

.enroll-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  background: #f8f9fa;
  color: #7a6a5c;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid #eee4d8;
  font-weight: 500;
  padding: 12px 14px; /* Reduced vertical padding */
  font-size: 0.95rem;
}

.enroll-btn:hover {
  background: #f1f3f5;
  color: #6b5d4f;
  transform: translateY(-2px);
}

.btn-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.enroll-btn:hover .btn-icon {
  transform: translateX(3px);
}.icon {
  width: 16px;
  height: 16px;
}
</style>