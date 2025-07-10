<template>
  <div class="glossary-term-page">
    <div class="breadcrumbs">
      <router-link to="/">Home</router-link> >
      <router-link to="/glossary">Glossary</router-link> >
      <span>{{ termData?.title || 'Glossary Term' }}</span>
    </div>

    <div class="content-wrapper">
      <div class="main-content">
        <h1>{{ termData?.title || 'Glossary Term' }}</h1>
        <p style="font-style: italic;" v-if="termData?.excerpt">
          <DynamicContent :content="termData.excerpt" />
        </p>

        <p v-if="termData?.description">
          <DynamicContent :content="termData.description" />
        </p>

        <div class="details-section">
          <h2>Additional Details</h2>
          <div class="accordion" id="detailsAccordion">
            <div class="accordion-item" v-for="(detail, index) in termData?.details" :key="index">
              <h3 class="accordion-header" :id="`heading-${index}`">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  :data-bs-target="`#collapse-${index}`"
                  aria-expanded="false"
                  :aria-controls="`collapse-${index}`"
                >
                  {{ detail.title || 'No Title' }}
                </button>
              </h3>
              <div
                :id="`collapse-${index}`"
                class="accordion-collapse collapse"
                :aria-labelledby="`heading-${index}`"
                data-bs-parent="#detailsAccordion"
              >
                <div class="accordion-body">
                  <DynamicContent :content="detail.description || 'No description available.'" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <router-link to="/glossary" class="btn-smooth-primary mt-3">Back to Glossary Index</router-link>

        <p v-if="!termData">Loading term details...</p>
      </div>

      <aside class="sidebar" v-if="termData">
        <div v-if="termData.relatedTerms?.length">
          <h2>Related Terms</h2>
          <ul>
            <li v-for="(relatedTerm, index) in termData.relatedTerms" :key="index">
              {{ relatedTerm }}
            </li>
          </ul>
        </div>

        <hr class="divider" v-if="termData.relatedTerms?.length && otherGlossaryTerms.length" />

        <div v-if="otherGlossaryTerms.length">
          <h2>Other Glossary Terms</h2>
          <ul>
            <li v-for="(term, index) in otherGlossaryTerms" :key="index">
              <router-link :to="`/glossary/${term.slug}`">{{ term.title }}</router-link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useGlossaryStore } from '@/stores/glossary';
import DynamicContent from '@/components/DynamicContent.vue';
import type { GlossaryTerm } from '@/types';

const route = useRoute();
const glossaryStore = useGlossaryStore();
const termData = ref<GlossaryTerm | null>(null);
const detailsExpanded = ref(false);
const expandedIndex = ref<number | null>(null);

const otherGlossaryTerms = computed(() => {
  if (!termData.value) return [];
  const filteredTerms = glossaryStore.terms.filter(term => term.slug !== termData.value?.slug);
  return filteredTerms.sort(() => 0.5 - Math.random()).slice(0, 15); // Randomize and limit to 15 items
});

const toggleDetails = () => {
  detailsExpanded.value = !detailsExpanded.value;
};

const toggleAccordion = (index: number) => {
  expandedIndex.value = expandedIndex.value === index ? null : index;
};

onMounted(async () => {
  const slug = route.params.slug as string;

  if (slug) {
    if (glossaryStore.terms.length === 0) {
      await glossaryStore.loadTerms(); // Ensure terms are loaded
    }

    const term = glossaryStore.getTermBySlug(slug);

    termData.value = term || null;
  }
});
</script>

<style scoped>
.glossary-term-page {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.breadcrumbs {
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.breadcrumbs a {
  color: var(--color-primary);
  text-decoration: none;
}

.breadcrumbs a:hover {
  text-decoration: underline;
}

.content-wrapper {
  display: flex;
  gap: 5rem; /* Increased gap between main content and sidebar */
  align-items: flex-start;
}

.main-content {
  flex: 3;
}

.details-section {
  margin-top: 2rem;
}

.sidebar {
  flex: 1;
  background-color: var(--card-background);
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  align-self: flex-start; /* Ensures the sidebar height matches content */
  width: 250px; /* Fixed width for sidebar */
}

.sidebar h2 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.divider {
  border: none;
  border-top: 2px solid var(--border-color);
  margin: 1rem 0;
}
</style>
