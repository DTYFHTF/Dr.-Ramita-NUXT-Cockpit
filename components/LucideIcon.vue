<template>
  <div class="icon-wrapper">
    <Icon :icon="icon" :width="size" :height="size" :class="className" />
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  size: {
    type: [String, Number],
    default: 24,
  },
  className: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
div {
  display: inline-flex;
  /* background-color: rgb(240 244 241 / var(--tw-bg-opacity, .75)); */
  color:var(--background-white);
  border-radius: 4px;
  line-height: 1; /* Match the line height of text */
}

svg {
  display: inline-block;
  vertical-align: middle; /* Align icon with text */
  color: rgb(104 135 108 / var(--tw-text-opacity, 1));
  height: 1em; /* Match the height of the font */
  width: 1em; /* Maintain aspect ratio */
}
</style>