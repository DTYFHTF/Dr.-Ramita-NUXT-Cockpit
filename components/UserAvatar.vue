<template>
  <img
    :src="imageUrl"
    :alt="altText"
    :class="['user-avatar', size]"
    @error="onError"
  />
</template>

<script setup lang="ts">

import { computed, ref } from 'vue'
import { useImageUrl } from '@/composables/useImageUrl.js'

const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: 'User Avatar' },
  size: { type: String, default: 'md' } // 'sm', 'md', 'lg'
})


const defaultAvatar = '/default-doctor.svg'
const errored = ref(false)
const { getImageUrl } = useImageUrl()

const imageUrl = computed(() => {
  if (errored.value) return defaultAvatar
  return getImageUrl(props.src, defaultAvatar)
})

const altText = computed(() => props.alt)

function onError() {
  errored.value = true
}
</script>

<style scoped>
.user-avatar {
  border-radius: 50%;
  object-fit: cover;
  background: #f3f3f3;
  display: inline-block;
}
.user-avatar.sm {
  width: 32px;
  height: 32px;
}
.user-avatar.md {
  width: 60px;
  height: 60px;
}
.user-avatar.lg {
  width: 96px;
  height: 96px;
}
</style>
