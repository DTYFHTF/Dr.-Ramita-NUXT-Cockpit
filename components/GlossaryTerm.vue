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

const props = defineProps({
  termSlug: {
    type: String,
    required: true,
  },
});

const isHovered = ref(false);
const glossaryTermRef = ref(null);
const router = useRouter(); // Ensure useRouter is called within setup

const tooltipContent = computed(() => {
  return `Read more about this term.`;
});

onMounted(() => {
  if (glossaryTermRef.value) {
    tippy(glossaryTermRef.value, {
      content: tooltipContent.value,
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

<style scoped>
.glossary-term {
  cursor: pointer;
  color: var(--primary-color);
  text-decoration: underline;
}

.glossary-term.is-hovered {
  text-decoration: none;
}
</style>
