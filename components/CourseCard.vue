<template>
  <Card
    :title="title"
    :description="description"
    :image="image || '/placeholder-course.jpg'"
    :imageAlt="title"
    :badge="price === 0 ? 'Free' : `₹ ${price}`"
    :link="`/course/${slug}`"
    customClass="course-card"
  >
    <template #meta>
      <div class="meta-item">
        <LucideIcon icon="mdi:book-open" class="icon" />
        <span>{{ duration }}</span>
      </div>
      <div class="meta-item" v-if="level">
        <LucideIcon icon="mdi:star" class="icon" />
        <span>{{ level }}</span>
      </div>
    </template>
    <template #button>
      <NuxtLink 
        :to="`/course/${slug}`"
        class="enroll-btn btn-smooth-primary"
      >
        Learn More
        <LucideIcon icon="mdi:arrow-right-circle" color="white" class="btn-icon" />
      </NuxtLink>
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
});
</script>

