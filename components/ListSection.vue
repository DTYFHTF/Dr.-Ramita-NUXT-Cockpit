<!-- components/ReusableListSection.vue -->
<template>
  <section v-if="items.length" class="mb-7">
    <div class="section-header mb-6">
      <h2 class="section-title">{{ title }}</h2>
      <p v-if="subtitle" class="section-subtitle text-muted fs-5">
        {{ subtitle }}
      </p>
    </div>
    <ul class="list-unstyled">
      <li 
        v-for="(item, index) in items" 
        :key="index" 
        class="fs-5 lh-lg mb-2"
      >
        <template v-if="item.title">
          <h5 class="fw-bold">{{ index + 1 }}. {{ item.title }}</h5>
          <DynamicContent :content="item.description || ''" />
        </template>
        <template v-else>
          <DynamicContent :content="`${index + 1}. ${item.description || ''}`" />
        </template>
      </li>
    </ul>
  </section>
</template>

<script>
import { sanitizedDescription } from '@/composables/sanitizeUtils';
import DynamicContent from '@/components/DynamicContent.vue';

export default {
  props: {
    items: {
      type: Array,
      required: true,
      default: () => []
    },
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    }
  },
  methods: {
    sanitizedDescription
  },
  components: {
    DynamicContent
  }
};
</script>