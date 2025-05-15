<template>
  <div>
    <h1>Test Page</h1>
    <ul v-if="glossaryTerms.length">
      <li v-for="term in glossaryTerms" :key="term.slug">
        {{ term.title }} - Category: {{ term.category || 'No Category' }}
      </li>
    </ul>
    <p v-else>No glossary terms available. Check the console for errors.</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useGlossaryStore } from '@/stores/glossary';
import type { GlossaryTerm } from '@/stores/glossary';

const glossaryTerms = ref<GlossaryTerm[]>([]);
const glossaryStore = useGlossaryStore();

onMounted(async () => {
  try {
    if (!glossaryStore.terms.length) {
      await glossaryStore.loadTerms();
    }
    glossaryTerms.value = glossaryStore.terms;
  } catch (error) {
    console.error('Error loading glossary terms:', error);
  }
});
</script>