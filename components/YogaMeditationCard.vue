<template>
  <Card
    :title="title"
    :description="shortDescription"
    :image="image || '/placeholder-yoga.jpg'"
    :imageAlt="title"
    :badge="tags || 'Uncategorized'"
    :link="`/yoganmeditation/${slug}`"
    customClass="yoga-card"
  >
    <template #meta>
      <div class="meta-item">
        <LucideIcon icon="mdi:clock-outline" class="icon" />
        <span>{{ duration || 'N/A' }}</span>
      </div>
      <div class="meta-item">
        <LucideIcon icon="mdi:tag-outline" class="me-2" />
        <span>{{ tags || 'N/A' }}</span>
      </div>
    </template>
    <template #button>
      <NuxtLink 
        v-if="slug"
        :to="`/yoganmeditation/${slug}`"
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
  shortDescription: String,
  image: String,
  slug: String,
  tags: String,
  duration: String,
});
</script>

