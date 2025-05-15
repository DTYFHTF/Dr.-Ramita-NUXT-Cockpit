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

    // Replace <p> tags with a space
    const strippedContent = processedContent.replace(/<p>|<\/p>/g, ' ');

    processedContentComponent.value = defineComponent({
      components: { GlossaryTerm },
      render() {
        const nodes = strippedContent.split(/(<GlossaryTerm.*?>.*?<\/GlossaryTerm>|<br\s*\/?>)/g).map((segment) => {
          const match = segment.match(/<GlossaryTerm term=\"(.*?)\">(.*?)<\/GlossaryTerm>/);
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
