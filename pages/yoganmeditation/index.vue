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
            v-bind="ynm"
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

const yogaandmeditation = computed(() => yoganmeditation.value?.map(addImageUrl) || []);

const addImageUrl = (item) => ({
  ...item,
  image: item.image?._id
    ? `http://localhost:9000/assets/link/${item.image._id}`
    : "/placeholder-remedy.jpg",
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