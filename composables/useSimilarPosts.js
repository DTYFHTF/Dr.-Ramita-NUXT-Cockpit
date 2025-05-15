// composables/useSimilarPosts.js
import { ref, watchEffect } from 'vue'

export default function useSimilarPosts(apiUrl, options = {}) {
  const {
    count = 4,
    fallbackImage = '/fallback.jpg',
    basePath = '/yoganmeditation',
    imageField = 'coverImage' // Configurable image field
  } = options;

  const posts = ref([]);
  const error = ref(null);
  const loading = ref(false);

  const { data, error: fetchError, loading: fetchLoading } = useApi(apiUrl);

  watchEffect(() => {
    loading.value = fetchLoading.value;
    error.value = fetchError.value;

    if (data.value) {
      try {
        const processedPosts = data.value.map(post => {
          const image = post[imageField] || post.image;
          const coverImageUrl = image && image._id
            ? `http://localhost:9000/assets/link/${image._id}`
            : fallbackImage;
          return {
            ...post,
            coverImageUrl,
            link: `${basePath}/${post.slug}`
          };
        });

        // Shuffle and slice posts
        posts.value = processedPosts
          .sort(() => 0.5 - Math.random())
          .slice(0, count);
      } catch (e) {
        error.value = e;
      }
    }
  });

  return {
    posts,
    loading,
    error
  };
}