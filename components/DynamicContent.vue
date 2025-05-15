<template>
  <div v-if="error" class="alert alert-danger">{{ error }}</div>
  <div v-else-if="loading" class="loading">Loading...</div>
  <div v-else>
    <component :is="processedContentComponent" />
  </div>
</template>

<script setup>
import { ref, onMounted, defineComponent, h, shallowRef } from 'vue';
import { autoLinkContent } from '@/composables/autoLinkParser';
import GlossaryTerm from '@/components/GlossaryTerm.vue';

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
});

const processedContentComponent = shallowRef(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const processedContent = await autoLinkContent(props.content);

    // Preserve <GlossaryTerm> components and replace other tags with spaces
    const strippedContent = processedContent
      .replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tag) => {
        // Preserve GlossaryTerm components with all attributes
        if (tag.toLowerCase() === 'glossaryterm') return match;
        // Replace other tags with space to maintain word boundaries
        return ' ';
      })
      .replace(/\s+/g, ' ') // Collapse multiple spaces
      .trim();

    processedContentComponent.value = defineComponent({
      components: { GlossaryTerm },
      render() {
        const nodes = strippedContent.split(/(<GlossaryTerm.*?>.*?<\/GlossaryTerm>|<br\s*\/?>)/gs).map((segment) => {
          const match = segment.match(/<GlossaryTerm term=\"(.*?)\">([\s\S]*?)<\/GlossaryTerm>/);
          if (match) {
            const [_, slug, text] = match;
            return h(GlossaryTerm, { termSlug: slug }, () => text);
          }
          if (segment.match(/<br\s*\/?>/)) {
            return h('br'); // Handle <br> tags
          }
          return segment;
        });
        return h('div', nodes);
      },
    });
  } catch (err) {
    error.value = `Failed to process content: ${(err).message}`;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.loading {
  text-align: center;
  padding: 1rem;
}
</style>
