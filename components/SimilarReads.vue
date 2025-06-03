<template>
  <section id="similar-reads" class="similar-reads">
    <h3 class="section-title">{{ title }}</h3>
    <ul class="list-unstyled">
      <li 
        v-for="post in posts" 
        :key="post.id || post._id" 
        class="similar-read-item mb-4"
      >
        <a :href="`${basePath}/${post.slug}`" class="d-flex align-items-start text-decoration-none">
          <img
            :src="post.imageUrl || post.image || fallbackImage"
            :alt="post.title || 'Untitled Post'"
            class="img-thumbnail me-3"
            style="width: 80px; height: 80px; object-fit: cover;"
          />
          <div>
            <h4 class="fs-6 fw-bold text-dark mb-0">{{ post.title || 'Untitled Post' }}</h4>
          </div>
        </a>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  props: {
    posts: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: "Similar Reads"
    },
    basePath: {
      type: String,
      default: "/yoganmeditation"
    },
    fallbackImage: {
      type: String,
      default: "/placeholder.jpg"
    }
  },
  mounted() {
    console.log('Posts in SimilarReads:', this.posts); // Log posts array for debugging
    this.posts.forEach(post => {
      console.log('Post imageUrl:', post.imageUrl, 'image:', post.image); // Log both possible image fields
    });
  }
}
</script>

<style scoped>
.similar-reads {
  position: sticky;
  top: 2rem;
  max-width: 300px;
  margin-left: auto;
  margin-top: 2rem;
}

.section-title {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
}

.img-thumbnail {
  border-radius: 0.5rem;
}

.similar-read-item:hover {
  transform: translateX(5px);
  transition: transform 0.2s ease;
}
</style>