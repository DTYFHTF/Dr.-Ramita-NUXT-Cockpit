<template>
  <div class="icon-wrapper" :style="wrapperStyles">
    <Icon :icon="icon" :width="size" :height="size" :class="className" :style="iconStyles" />
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { computed } from 'vue';

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
  color: {
    type: String,
    default: '',
  },
  wrapperColor: {
    type: String,
    default: '',
  }
});

const iconStyles = computed(() => {
  return props.color ? { color: props.color } : {};
});

const wrapperStyles = computed(() => {
  return props.wrapperColor ? { backgroundColor: props.wrapperColor } : {};
});
</script>

<style scoped>
div {
  display: inline-flex;
  /* background-color is now controlled by wrapperStyles */
  border-radius: 4px;
  line-height: 1; /* Match the line height of text */
}

svg {
  display: inline-block;
  vertical-align: middle; /* Align icon with text */
  /* Default color is applied here, but can be overridden by the color prop */
  color: rgb(104 135 108 / var(--tw-text-opacity, 1));
  height: 1em; /* Match the height of the font */
  width: 1em; /* Maintain aspect ratio */
}
</style>