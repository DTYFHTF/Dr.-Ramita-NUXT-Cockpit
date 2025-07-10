<template>
  <div :class="['card', customClass]">
    <div class="card-header">
      <span v-if="typeof badge === 'string'" :class="['badge', badge.toLowerCase() === 'free' ? 'free' : '']">{{ badge }}</span>
      <img :src="image" :alt="imageAlt" class="card-image" />
    </div>

    <div class="card-content">
      <h3 class="title">{{ title }}</h3>
      <p class="description"><DynamicContent :content="description || ''" /></p>

      

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

<style scoped lang="scss">
.card {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--background-white);
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
  top: 10px;
  left: 10px;
  background: var(--badge-color);
  color: var(--color-primary);
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
}

.badge.free {
  background: var(--badge-free-color);
  color: var(--color-primary);
}

.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 1.25rem;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.description {
  font-size: 1rem;
  margin-bottom: 16px;
  color: var(--text-secondary);
}

.meta-info {
  margin-bottom: 16px;
}

.button-container {
  margin-top: auto;
}
</style>