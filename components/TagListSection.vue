<template>
  <section v-if="items && items.length" :class="sectionClass">
    <div class="section-header mb-6">
      <h3 class="section-title">{{ title }}</h3>
      <p v-if="subtitle" class="section-subtitle text-muted fs-5">{{ subtitle }}</p>
    </div>
    <ul class="list-unstyled">
      <li v-for="(item, index) in items" :key="index" class="fs-5 lh-lg mb-2">
        <DynamicContent :content="item" />
      </li>
    </ul>
  </section>
</template>

<script setup>
import DynamicContent from '@/components/DynamicContent.vue'

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  items: { type: Array, required: true },
  sectionClass: { type: String, default: '' }
})
</script>

<style scoped>
.section-header {
  margin-bottom: 1.5rem;
}
.section-title {
  font-size: 1.5rem;
  font-weight: bold;
}
.section-subtitle {
  font-size: 1rem;
  color: #888;
}
</style>
