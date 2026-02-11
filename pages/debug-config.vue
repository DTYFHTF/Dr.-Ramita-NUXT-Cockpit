<template>
  <div style="padding: 2rem; font-family: monospace;">
    <h1>Runtime Config Debug</h1>
    
    <h2>Brand Social URLs</h2>
    <pre>{{ JSON.stringify(brand.social, null, 2) }}</pre>
    
    <h2>Social Links Array</h2>
    <pre>{{ JSON.stringify(socialLinks, null, 2) }}</pre>
    
    <h2>Raw Config Public</h2>
    <pre>{{ JSON.stringify({
      brandFacebookUrl: config.public.brandFacebookUrl,
      brandInstagramUrl: config.public.brandInstagramUrl,
      brandYoutubeUrl: config.public.brandYoutubeUrl,
      brandLinkedinUrl: config.public.brandLinkedinUrl,
    }, null, 2) }}</pre>
  </div>
</template>

<script setup lang="ts">
const brand = useBrand();
const { socialLinks } = useSocialMedia();
const config = useRuntimeConfig();
</script>
