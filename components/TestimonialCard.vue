<template>
  <div class="testimonial-card border rounded p-4 shadow">
    <img :src="photo" alt="Client Photo" class="w-16 h-16 object-cover rounded-full mb-4" />
    <h3 class="text-lg font-bold">{{ name }}</h3>
    <p class="text-sm text-gray-600 mb-2">{{ review }}</p>
    <div class="text-yellow-500">
      <LucideIcon v-for="n in rating" :key="n" icon="mdi:star" />
    </div>
  </div>
</template>

<script setup>
import LucideIcon from '@/components/LucideIcon.vue';
const props = defineProps({
  name: String,
  photo: String,
  review: String,
  rating: Number
});
</script>