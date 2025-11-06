<template>
  <Card
    :title="title"
    :description="description"
    :image="image || '/placeholder-course.jpg'"
    :imageAlt="title"
    :badge="price === 0 ? 'Free' : `₹ ${price}`"
    customClass="course-card"
  >
    <template #meta>
      <slot name="meta">
        <div class="meta-item">
          <LucideIcon icon="mdi:book-open" class="icon" />
          <span>{{ duration }}</span>
        </div>
        <div class="meta-item" v-if="level">
          <LucideIcon icon="mdi:star" class="icon" />
          <span>{{ level }}</span>
        </div>
      </slot>
    </template>
    <template #button>
      <slot name="button">
        <NuxtLink 
          :to="`/courses/${slug}`"
          class="enroll-btn btn-smooth-primary"
        >
          {{ buttonText }}
          <LucideIcon icon="mdi:arrow-right-circle" color="white" class="btn-icon" />
        </NuxtLink>
      </slot>
    </template>
  </Card>
</template>

<script setup>
import Card from './Card.vue';
import LucideIcon from '@/components/LucideIcon.vue';


const props = defineProps({
  slug: String,
  id: [String, Number],
  title: String,
  description: String,
  image: String,
  price: Number,
  duration: String,
  level: String,
  buttonText: {
    type: String,
    default: 'Learn More'
  }
});
</script>

