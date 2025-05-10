<template>
  <div :class="['card', customClass]">
    <div class="card-header">
      <span v-if="typeof badge === 'string'" :class="['badge', badge.toLowerCase() === 'free' ? 'free' : '']">{{ badge }}</span>
      <img :src="image" :alt="imageAlt" class="card-image" />
    </div>

    <div class="card-content">
      <h3 class="title">{{ title }}</h3>
      <p class="description">{{ description }}</p>

      

      <div class="button-container">
        <div v-if="$slots.meta" class="meta-info">
        <slot name="meta"></slot>
        </div>
        <slot name="button">
          <NuxtLink :to="link" class="btn btn-smooth-primary">
            Learn More
          </NuxtLink>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  description: String,
  image: {
    type: String,
    default: '/placeholder.jpg',
  },
  imageAlt: {
    type: String,
    default: 'Card image',
  },
  badge: String,
  link: String,
  customClass: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-header {
  position: relative;
}

.card-image {
  width: 100%;
  height: 200px; /* Set a fixed height for images */
  object-fit: cover; /* Ensure the image covers the area without distortion */
}

.badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: linear-gradient(145deg, rgba(255, 245, 230, 0.9) 0%, rgba(255, 250, 240, 0.9) 100%);
  color: #7a6a5c;
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
}

.badge.free {
  background: linear-gradient(145deg, rgba(144, 238, 144, 0.9) 0%, rgba(152, 251, 152, 0.9) 100%);
  color: #2d5a2d;
}

.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 1.25rem;
  margin-bottom: 8px;
}

.description {
  font-size: 1rem;
  margin-bottom: 16px;
}

.meta-info {
  margin-bottom: 16px;
}

.button-container {
  margin-top: auto;
}
</style>