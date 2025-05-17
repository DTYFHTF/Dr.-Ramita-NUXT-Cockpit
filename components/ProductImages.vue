<template>
  <div class="product-images row g-0 align-items-start">
    <div class="col-2 d-flex flex-md-column flex-row gap-2 me-2 mb-0 mb-md-3 p-0 thumbs">
      <img v-if="image2" :src="imageUrl(image2)" :alt="name + ' thumbnail 2'" class="product-thumb mb-md-2 mb-0" />
      <img v-if="image3" :src="imageUrl(image3)" :alt="name + ' thumbnail 3'" class="product-thumb" />
    </div>
    <div class="col-9 p-0">
      <img :src="imageUrl(image)" :alt="name" class="product-detail-image flex-shrink-0" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  image: string
  image2?: string
  image3?: string
  name: string
}>()

function imageUrl(img?: string) {
  if (!img) return '/fallback.jpg'
  if (img.startsWith('http')) return img
  return `http://ayurveda-marketplace.test/storage/${img}`
}
</script>

<style scoped>
.product-images {
  width: 100%;
}
.product-detail-image {
  width: 100%;
  max-width: 350px;
  height: 320px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 2rem;
  background: #f8f8f8;
}
.product-thumb {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #eee;
  margin-bottom: 8px;
  background: #f8f8f8;
}
@media (max-width: 767px) {
  .product-detail-image {
    margin-bottom: 1rem;
    max-width: 100%;
    height: 220px;
  }
  .product-thumb {
    width: 50px;
    height: 50px;
  }
}
</style>
