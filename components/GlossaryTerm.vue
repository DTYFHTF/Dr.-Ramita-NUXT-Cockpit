<template>
  <span
    class="glossary-term"
    :class="{ 'is-hovered': isHovered }"
    @mouseover="onMouseOver"
    @mouseleave="onMouseLeave"
    @click="onClick"
    ref="glossaryTermRef"
  >
    <slot></slot>
  </span>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { useGlossaryStore } from '@/stores/glossary'; // Assuming the glossary store is located here

const props = defineProps({
  termSlug: {
    type: String,
    required: true,
  },
});

const isHovered = ref(false);
const glossaryTermRef = ref(null);
const router = useRouter(); // Ensure useRouter is called within setup
const glossaryStore = useGlossaryStore();

const tooltipContent = computed(() => {
  const term = glossaryStore.getTermBySlug(props.termSlug);
  if (term) {
    const relatedTerms = term.relatedTerms.length > 0 ? `<br><br><strong>Related:</strong> ${term.relatedTerms.join(', ')}` : '';
    return `${term.excerpt}${relatedTerms}`;
  }
  return 'Read more about this term.';
});

onMounted(() => {
  if (glossaryTermRef.value) {
    tippy(glossaryTermRef.value, {
      content: tooltipContent.value,
      allowHTML: true, // Enable HTML content in the tooltip
      placement: 'top',
      trigger: 'mouseenter',
    });
  }
});

function onMouseOver() {
  isHovered.value = true;
}

function onMouseLeave() {
  isHovered.value = false;
}

function onClick() {
  if (router) {
    router.push(`/glossary/${props.termSlug}`); // Use the router instance to navigate
  } else {
    console.error('Router instance is not available');
  }
}
</script>

<style scoped lang="scss">
.glossary-term {
  cursor: pointer;
  color: var(--text-primary);
  text-decoration: underline;
}

.glossary-term.is-hovered {
  text-decoration: none;
}
</style>
