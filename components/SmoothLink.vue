<script setup>
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';

const props = defineProps({
  to: { type: String, required: true },
  fallbackRoute: { type: String, required: true },
  offset: { type: Number, default: 75 },
});

const route = useRoute();
const router = useRouter();
const isClient = ref(false);

// Ensure DOM access only runs on client
onMounted(() => {
  isClient.value = true;
});

function handleClick(e) {
  e.preventDefault();
  if (!isClient.value) return; // Prevent logic from firing during SSR

  if (route.path === '/') {
    scrollToId();
  } else {
    router.push('/').then(() => {
      setTimeout(scrollToId, 300);
    });
  }
}

function scrollToId() {
  const el = document.getElementById(props.to);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - props.offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}
</script>

<template>
  <a href="#" @click="handleClick" v-bind="$attrs">
    <slot />
  </a>
</template>
