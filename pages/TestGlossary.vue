<!-- ~/components/TestGlossary.vue -->
<template>
  <div class="glossary-test">
    <h1>Glossary Term Auto-Linking Test</h1>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else-if="loading" class="loading">Loading...</div>
    
    <div v-else>
      <component :is="processedContentComponent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineComponent, h, shallowRef } from 'vue';
import { autoLinkContent } from '@/composables/autoLinkParser';
import GlossaryTerm from '@/components/GlossaryTerm.vue';

const rawContent = ref(`
  Yoga is a group of physical, mental, and spiritual practices. 
  One of the most popular poses is Downward Dog, also known as Adho Mukha Svanasana. Nadi Shodhana
`);

const processedContentComponent = shallowRef<ReturnType<typeof defineComponent> | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const processedContent = await autoLinkContent(rawContent.value);

    // Replace <p> tags with a space
    const strippedContent = processedContent.replace(/<p>|<\/p>/g, ' ');

    processedContentComponent.value = defineComponent({
      components: { GlossaryTerm },
      render() {
        const nodes = strippedContent.split(/(<GlossaryTerm.*?>.*?<\/GlossaryTerm>)/g).map((segment) => {
          const match = segment.match(/<GlossaryTerm termSlug=\"(.*?)\">(.*?)<\/GlossaryTerm>/);
          if (match) {
            const [_, slug, text] = match;
            return h(GlossaryTerm, { termSlug: slug }, () => text);
          }
          return segment;
        });
        return h('div', nodes);
      },
    });
  } catch (err) {
    error.value = `Failed to load glossary: ${(err as Error).message}`;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.glossary-test {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}

.loading {
  text-align: center;
  padding: 2rem;
}
</style>