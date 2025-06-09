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

<style scoped lang="scss">
div {
  display: inline-flex;
  border-radius: 4px;
  line-height: 1; 
}

svg {
  display: inline-block;
  vertical-align: middle; 
  color: rgba($color-primary,0.8);
  height: 1em; 
  width: 1em; 
}
</style>