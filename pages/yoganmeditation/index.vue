<template>
    <section>
        <h1 class="text-center my-4">Yoga and Meditation</h1>
        <div class="row ">
          <div
            class="col-md-4 mb-4 "
            v-for="ynm in yogaandmeditation"
            :key="ynm.id"
          >
            <YogaMeditationCard
            :id="ynm._id"
              :title="ynm.title"
              :shortDescription="ynm.shortDescription"
              :coverImage="ynm.coverImage"
              :slug="ynm.slug"
              :tags="ynm.tags"
            />
          </div>
        </div>
        <div class="text-center mt-4">
        </div>
      </section>
</template>

<script setup>
import { useApi } from '@/composables/useApi';
import YogaMeditationCard from "~/components/YogaMeditationCard.vue";
import { computed } from 'vue';

const { data: yoganmeditation } = useApi("items/yoganmeditation");

// Use computed to maintain reactivity
const yogaandmeditation = computed(() => {
  return (yoganmeditation.value || []).map(item => ({
    ...item,
    coverImage: item.coverImage?._id
      ? `http://localhost:9000/assets/link/${item.coverImage._id}`
      : '/placeholder-yoga.jpg',
  }));
});

console.log("yoganmeditation", yoganmeditation.value);
</script>

<style scoped>
section{
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
h2{
    padding: 3vh 0 3vh 0;
}
.yoga-meditation-card {
  margin-bottom: 1.5rem; /* Add vertical spacing between cards */
}
</style>