<template>
  <section class="most-searched py-4">
    <div class="container">
      <h3 class="section-title mb-4">Most Searched</h3>
      <div class="tags-row">
        <div class="tag-item" v-for="(category, idx) in categories.slice(0, 8)" :key="category.id || category.title || category.name">
          <NuxtLink 
            :to="category.slug ? `/category/${encodeURIComponent(category.slug)}` : (category.url || `/category/${encodeURIComponent(category.title || category.name)}`)" 
            class="search-tag"
          >
            <div class="tag-circle" :style="{ backgroundColor: category.color || '#28a745' }">
              #{{ idx + 1 }}
            </div>
            <span class="tag-name">{{ category.title || category.name }}</span>
          </NuxtLink>
        </div>
      </div>
    </div> 
  </section>
</template>

<script setup>
const props = defineProps({
  // Accept section data from parent component (from API)
  sectionData: {
    type: Object,
    default: () => ({
      data: {
        categories: []
      }
    })
  },
  // Fallback for hardcoded data (backwards compatibility)
  tags: {
    type: Array,
    default: () => []
  }
});

// Use categories from API data, fallback to tags prop if no API data
const categories = computed(() => {
  if (props.sectionData?.data?.categories?.length > 0) {
    return props.sectionData.data.categories;
  }
  // Fallback to old tags format for backwards compatibility
  return props.tags;
});
</script>

<style scoped>
.most-searched {
  background-color: var(--background-white);
  color: var(--text-primary);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}




.tags-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.tag-item {
  flex: 1 1 0;
  min-width: 0;
}

.search-tag {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--text-primary);
  padding: 1rem 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-align: center;
}

.search-tag:hover {
  background-color: var(--background-light);
  transform: translateY(-2px);
  color: var(--text-primary);
  text-decoration: none;
}

.tag-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.tag-name {
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.2;
  color: var(--text-primary);
}

@media (max-width: 576px) {
  .tag-circle {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .tag-name {
    font-size: 0.8rem;
  }
}
</style>
