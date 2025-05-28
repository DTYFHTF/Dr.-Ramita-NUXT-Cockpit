<template>
  <span>
    <LucideIcon icon="mdi:star" v-if="filled" />
    <LucideIcon icon="mdi:star" :class="'opacity-50'" v-else />
  </span>
</template>
<script setup lang="ts">
import LucideIcon from '@/components/LucideIcon.vue';
const props = defineProps<{ filled: boolean }>();
</script>
