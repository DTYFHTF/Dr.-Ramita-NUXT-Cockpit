<template>
  <Card
    :title="title"
    :description="description || 'No description available'"
    :image="image || '/placeholder-recipe.jpg'"
    :imageAlt="title"
    :badge="category || 'Uncategorized'"
    :link="slug ? `blog/recipe/${slug}` : null"
    customClass="recipe-card"
  >
    <template #meta>
      <div class="meta-item">
        <LucideIcon icon="mdi:clock-outline" class="icon" />
        <span>{{ preparation_time || "N/A" }}</span>
      </div>
      <div class="meta-item">
        <LucideIcon icon="mdi:account-group-outline" class="icon" />
        <span>{{ servings || 0 }} servings</span>
      </div>
    </template>
    <template #button>
      <NuxtLink
        v-if="slug"
        :to="`blog/recipe/${slug}`"
        class="btn-smooth-success mt-auto w-100"
      >
        Explore Recipe
        <LucideIcon icon="mdi:arrow-right" color="white" class="btn-icon" />
      </NuxtLink>
      <div v-else class="btn-smooth disabled mt-auto w-100">
        Recipe Link Unavailable
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from "./Card.vue";
import LucideIcon from "@/components/LucideIcon.vue";

const props = defineProps({
  id: String,
  title: String,
  slug: String,
  image: String,
  category: String,
  preparation_time: String,
  servings: Number,
});
</script>

<style scoped>
.recipe-card {
  margin-bottom: 1.5rem; /* Example spacing */
}
</style>
