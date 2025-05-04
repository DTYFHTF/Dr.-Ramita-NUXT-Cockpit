<template>
  <div class="remedy-card border rounded p-4 shadow">
    <h2 class="text-xl font-bold mb-2">{{ title }}</h2>
    <ul class="list-disc pl-5">
      <li v-for="(item, index) in remediesList" :key="index">{{ item }}</li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  remediesList: Array
});
</script>