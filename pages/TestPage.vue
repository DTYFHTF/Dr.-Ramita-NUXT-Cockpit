<template>
  <div>
  <MegaMenu :categories="categories" :products="products" :open="true" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const categories = ref([])
const products = ref([])
const isMegaMenuOpen = ref(false)
</script>