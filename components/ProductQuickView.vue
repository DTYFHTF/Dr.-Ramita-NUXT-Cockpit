<template>
  <ProductQuickViewModal
    v-if="product"
    :product="product"
    @close="$emit('close')"
    @add-to-cart="$emit('add-to-cart', $event)"
  />
</template>

<script setup lang="ts">
import ProductQuickViewModal from './ProductQuickViewModal.vue';
import type { Product } from '@/types';

const props = defineProps<{ product: Product }>();
const emit = defineEmits(['close', 'add-to-cart']);
</script>
