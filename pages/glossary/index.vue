<template>
  <div id="glossary" class="glossary-index">
    <!-- Header Section -->
    <header class="glossary-header mb-5">
      <h1 class="text-center mb-4">Yoga & Wellness Glossary</h1>
      
      <!-- Search & Filters -->
      <div class="search-filter-container mb-4">
        <input 
          v-model="searchQuery"
          type="search" 
          class="form-control form-control-lg"
          placeholder="Search 1000+ terms..."
          @input="handleSearch"
        >
        
        <div class="d-flex justify-content-between mt-3">
          <div class="category-filters">
            <button
              v-for="category in uniqueCategories"
              :key="category"
              class="btn btn-sm btn-outline-primary me-2 mb-2"
              :class="{ active: activeCategory === category }"
              @click="toggleCategory(category)"
            >
              {{ category }}
            </button>
          </div>
          
          <div class="alphabet-nav">
            <a 
              v-for="letter in alphabet"
              :key="letter"
              href="#"
              class="text-decoration-none mx-1"
              :class="{ 'text-primary': activeLetter === letter }"
              @click.prevent="scrollToLetter(letter)"
            >
              {{ letter }}
            </a>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Grid -->
    <div class="glossary-grid">
      <template v-for="(group, letter) in filteredGroups" :key="letter">
        <h2 :id="`letter-${letter}`" class="alphabet-section-header">
          {{ letter }}
          <span class="badge bg-secondary ms-3">{{ group.length }}</span>     
        </h2>
        
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div 
            v-for="term in group"
            :key="term.slug"
            class="col"
          >
            <div class="glossary-card card h-100">
              <div class="card-body">
                <NuxtLink 
                  :to="`/glossary/${term.slug}`"
                  class="stretched-link text-decoration-none"
                  :aria-label="`Learn more about ${term.title}`"
                  @mouseenter="activePreview = term.slug"
                  @mouseleave="activePreview = null"
                  @focusin="activePreview = term.slug"
                  @focusout="activePreview = null"
                >
                  <h3 class="card-title h5 mb-3">
                    {{ term.title }}
                    
                  </h3>
                </NuxtLink>

                <!-- Hover/Collapse Content -->
                <div 
                  class="term-preview"
                  :class="{ 'show': activePreview === term.slug }"
                >
                  <div class="preview-content">
                    <p class="text-muted mb-2">
                      {{ truncate(term.excerpt, 120) }}
                    </p>
                    <div class="related-terms" v-if="term.relatedTerms?.length">
                      <span class="badge bg-light text-dark me-1">
                                              {{ term.relatedTerms.join(', ') }}

                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="badge-category" v-if="term.category">
                {{ term.category }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Empty State -->
    <div v-if="!filteredTerms.length" class="empty-state text-center py-5">
      <p class="lead text-muted">No terms found matching "{{ searchQuery }}"</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useGlossaryStore } from '@/stores/glossary';
import Fuse from 'fuse.js';

const glossaryStore = useGlossaryStore();
const searchQuery = ref('');
const activeCategory = ref<string | null>(null);
const activeLetter = ref<string | null>(null);
const activePreview = ref<string | null>(null);
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Fuse.js search setup
const fuse = new Fuse(glossaryStore.terms, {
  keys: ['title', 'aliases', 'category', 'excerpt'],
  threshold: 0.3,
  includeScore: true
});

// Computed properties
const filteredTerms = computed(() => {
  let results = searchQuery.value 
    ? fuse.search(searchQuery.value).map(r => r.item)
    : glossaryStore.terms;

  if (activeCategory.value) {
    results = results.filter(t => {
      if (Array.isArray(t.category)) {
        return t.category.includes(activeCategory.value!);
      }
      return t.category === activeCategory.value;
    });
  }

  return results;
});

const uniqueCategories = computed(() => {
  // Flatten all categories, deduplicate, and filter out falsy values
  const all = glossaryStore.terms.flatMap(t => Array.isArray(t.category) ? t.category : [t.category]);
  return [...new Set(all)].filter(Boolean);
});

const filteredGroups = computed(() => {
  const groups: { [key: string]: GlossaryTerm[] } = {};

  filteredTerms.value.forEach(term => {
    const letter = term.title[0].toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(term);
  });

  // Sort terms within each group alphabetically
  Object.keys(groups).forEach(letter => {
    groups[letter].sort((a, b) => a.title.localeCompare(b.title));
  });

  // Sort groups alphabetically by their keys
  return Object.keys(groups)
    .sort()
    .reduce((sortedGroups, key) => {
      sortedGroups[key] = groups[key];
      return sortedGroups;
    }, {} as { [key: string]: GlossaryTerm[] });
});

// Methods
const truncate = (text: string, length: number) => {
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

const toggleCategory = (category: string) => {
  activeCategory.value = activeCategory.value === category ? null : category;
};

const scrollToLetter = (letter: string) => {
  activeLetter.value = letter;
  const element = document.getElementById(`letter-${letter}`);
  if (element) {
    const offset = 325; // Increased offset to ensure better alignment
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
};

const handleSearch = () => {
  // Implement search logic here if needed
  // Currently, searchQuery is reactive and filteredTerms will update automatically
};

// Initial data load
onMounted(async () => {
  if (!glossaryStore.terms.length) {
    await glossaryStore.loadTerms();
  }
});
</script>

<style scoped lang="scss">
.glossary-index {
  max-width: 1400px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.glossary-header {
  position: sticky;
  top: 0;
  background: rgba($background-light, 0.9);
  z-index: 1000;
  padding: 2rem 0;
  backdrop-filter: blur(10px);
}

.search-filter-container {
  max-width: 800px;
  margin: 0 auto;
}

.alphabet-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.glossary-grid {
  display: grid;
  gap: 2rem;
}

.alphabet-section-header {
  margin: 2rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid $border-color;
}

.glossary-card {
  position: relative;
  padding-bottom: 3rem; /* Add space for related terms */
  transition: all 0.2s ease;
  border: 1px solid $border-color;
}

.glossary-card:hover {
  transform: translateY(-3px);
  box-shadow: $card-shadow;
}

.term-preview {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.term-preview.show {
  max-height: 200px; /* Adjust based on content */
}

.related-terms {
  position: absolute;
  bottom: 2rem;
  left: 0rem;
  right: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.preview-content {
  padding-top: 1rem;
  border-top: 1px solid rgba($border-color, 0.05);
}

.badge-category {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: $button-bg; 
  color: $text-light;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.empty-state {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
}


.alphabet-nav a {
  color: $text-primary; 
}

.alphabet-nav a.text-primary {
  color: $text-primary !important; 
}

@media (max-width: 768px) {
  .glossary-index {
    padding: 0 0.5rem;
  }
  
  .alphabet-nav {
    display: none;
  }
  
  .category-filters {
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>