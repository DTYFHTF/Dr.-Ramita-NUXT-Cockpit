<template>
  <section class="most-searched py-4">
    <div class="container">
      <h3 class="section-title mb-4">Most Searched</h3>
      <div class="tags-grid">
        <div class="row">
          <div class="col-lg-2 col-md-3 col-sm-4 col-6 mb-3" v-for="tag in tags" :key="tag.id || tag.name">
            <NuxtLink 
              :to="tag.url || `/search?q=${encodeURIComponent(tag.name)}`" 
              class="search-tag"
            >
              <div class="tag-icon" v-if="tag.icon">
                <i :class="tag.icon"></i>
              </div>
              <div class="tag-circle" :style="{ backgroundColor: tag.color || '#28a745' }">
                {{ tag.name.charAt(0).toUpperCase() }}
              </div>
              <span class="tag-name">{{ tag.name }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  tags: {
    type: Array,
    default: () => [
      { id: 1, name: 'Ghee', color: '#ffc107' },
      { id: 2, name: 'Giloy', color: '#28a745' },
      { id: 3, name: 'Arjun', color: '#17a2b8' },
      { id: 4, name: 'Eye Care', color: '#fd7e14' },
      { id: 5, name: 'Amla', color: '#6f42c1' },
      { id: 6, name: 'Honey', color: '#e83e8c' },
      { id: 7, name: 'Cooking Oil', color: '#20c997' },
      { id: 8, name: 'Ashwagandha', color: '#dc3545' }
    ]
  }
});
</script>

<style scoped>
.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.tags-grid {
  margin-top: 1rem;
}

.search-tag {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #333;
  padding: 1rem 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-align: center;
}

.search-tag:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
  color: #333;
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

.tag-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #28a745;
}

.tag-name {
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.2;
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
