
<template>
  <section 
    :class="bgClass" 
    :id="sectionId"
  >
    <div class="container">
      <h1 class="text-center">{{ title }}</h1>
      <p v-if="subtitle" class="sub-heading">{{ subtitle }}</p>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-grow text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">{{ loadingText }}</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-5">
        <div class="alert alert-danger mx-auto" style="max-width: 500px">
          <strong>Error:</strong> {{ error.message || errorText }}
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!items.length" class="text-center text-muted py-5">
        <p>{{ emptyText }}</p>
      </div>      <!-- Content -->
      <div v-if="!loading && !error && items.length" class="row">
        <div
          v-for="(item, index) in items"
          :key="item._id || index"
          class="col-md-4 mb-4"
        >
          <component 
            :is="cardComponent" 
            v-bind="item"
          />
        </div>
      </div>

      <!-- View More Button -->
      <div v-if="showViewMore && !loading && !error && items.length" class="text-center mt-4">
        <button 
          class="btn-smooth-primary" 
          @click="handleViewMore"
        >
          {{ buttonText }}
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    // Existing props
    sectionId: {
      type: String,
      default: 'home-remedies'
    },
    bgClass: {
      type: String,
      default: 'bg-sandal-light'
    },
    title: {
      type: String,
      required: true
    },
    subtitle: String,
    items: {
      type: Array,
      required: true
    },
    cardComponent: {
      type: [Object, String],
      required: true
    },
    buttonText: {
      type: String,
      default: 'View More'
    },
    showViewMore: {
      type: Boolean,
      default: true
    },
    viewMoreHandler: Function,
    
    // New props
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: [Object, Error],
      default: null
    },
    loadingText: {
      type: String,
      default: 'Loading content...'
    },
    errorText: {
      type: String,
      default: 'Failed to load content'
    },
    emptyText: {
      type: String,
      default: 'No items available at the moment.'
    }
  },
  methods: {
    handleViewMore() {
      if (this.viewMoreHandler) {
        this.viewMoreHandler()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

section {
  padding: 5rem 0;
  margin-bottom: 2rem; 
}

.sub-heading {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 3rem;
  text-align: center;
}

.bg-sandal-light {
  margin: 0px;
}

.bg-herbal-light {
  margin: 0px; 
}

.btn-smooth-primary {
  display: inline-block;
  margin: 0 auto;
  text-align: center;
}
.spinner-grow {
  width: 3rem;
  height: 3rem;
}

.alert-danger {
  background-color: $background-light;
  border-color: $border-color;
  color: $text-error;
  padding: 1rem;
  border-radius: 0.25rem;
}

.text-muted {
  color: $text-secondary;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

</style>