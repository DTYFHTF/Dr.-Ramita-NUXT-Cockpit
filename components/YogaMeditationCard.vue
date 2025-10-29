<template>
  <Card
    :title="title"
    :description="short_description"
    :image="image || '/placeholder-yoga.jpg'"
    :imageAlt="title"
    :badge="tags[0] || 'Uncategorized'"
    :link="`/blog/yoganmeditation/${slug}`"
    customClass="yoga-card"
  >
    <template #meta>
      <div class="meta-item">
        <LucideIcon icon="mdi:clock-outline" class="icon" />
        <span>{{ duration || 'N/A' }}</span>
      </div>
    </template>
    <template #button>
      <NuxtLink 
        v-if="slug"
        :to="`/blog/yoganmeditation/${slug}`"
        class="btn-smooth-success mt-auto w-100"
      >
        Being Practice
        <LucideIcon icon="mdi:arrow-right" color="white" class="btn-icon" />
      </NuxtLink>
      <div v-else class="btn-smooth disabled mt-auto w-100">
        Practice Link Unavailable
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from './Card.vue';
import LucideIcon from '@/components/LucideIcon.vue';

defineProps({
  title: String,
  short_description: String,
  image: String,
  slug: String,
  tags: String,
  duration: String,
});
</script>

