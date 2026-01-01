<template>
  <ProductQuickViewModal
    v-if="product"
    :product="product"
    @close="$emit('close')"
    @add-to-cart="$emit('add-to-cart', $event)"
  />
</template>

<script setup lang="ts">
import { watch } from 'vue';
import ProductQuickViewModal from './ProductQuickViewModal.vue';
import type { Product } from '@/types';

const props = defineProps<{ product: Product }>();
const emit = defineEmits(['close', 'add-to-cart']);

console.log('[ProductQuickView] Component mounted with product:', props.product ? { id: props.product.id, name: props.product.name } : null);

watch(() => props.product, (newProduct) => {
  console.log('[ProductQuickView] Product prop changed:', newProduct ? { id: newProduct.id, name: newProduct.name, has_variations: newProduct.has_variations, variations_count: newProduct.variations?.length } : null);
}, { immediate: true });
</script>
