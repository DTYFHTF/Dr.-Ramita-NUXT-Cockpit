<template>
  <template v-for="(node, index) in nodes" :key="index">
    <component :is="node" v-if="isVNode(node)" />
    <template v-else>{{ node }}</template>
  </template>
</template>

<script setup>
import { h, computed, resolveComponent, isVNode as vueIsVNode } from 'vue';

const props = defineProps({
  content: {
    type: [String, Number, null, undefined], // Allow various types that can be stringified
    default: '',
  },
});

const GTermComponent = resolveComponent('GlossaryTerm');

const isVNode = (value) => vueIsVNode(value);

const nodes = computed(() => {
  const currentContent = (props.content === null || props.content === undefined) ? '' : String(props.content);

  if (!currentContent) {
    return [];
  }

  const resultNodes = [];
  const regex = /<GlossaryTerm term="([^"]+?)">(.+?)<\/GlossaryTerm>/gs;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(currentContent)) !== null) {
    if (match.index > lastIndex) {
      resultNodes.push(currentContent.substring(lastIndex, match.index));
    }
    
    const termSlug = match[1];
    const innerText = match[2];
    
    resultNodes.push(h(GTermComponent, { termSlug: termSlug }, () => innerText));
    
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < currentContent.length) {
    resultNodes.push(currentContent.substring(lastIndex));
  }
  
  if (resultNodes.length === 0 && currentContent) {
    return [currentContent];
  }

  return resultNodes;
});
</script>
