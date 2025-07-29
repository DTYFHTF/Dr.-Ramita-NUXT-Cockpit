// composables/useSimilarPosts.js
import { useApiLaravel } from './useApi.js'
import { ref, watchEffect } from 'vue'

export default function useSimilarPosts(apiEndpoint, options = {}) {
  const {
    count = 4,
    fallbackImage = '/fallback.jpg',
    basePath = '/homeremedy',
    imageField = 'image', // Laravel API uses 'image'
    excludeId = null // Optionally exclude a post by id
  } = options;

  const posts = ref([]);
  const error = ref(null);
  const loading = ref(false);

  const { data, error: fetchError, loading: fetchLoading } = useApiLaravel(apiEndpoint);

  watchEffect(() => {
    loading.value = fetchLoading.value;
    error.value = fetchError.value;

    if (data.value && data.value.data) {
      try {
        let processedPosts = data.value.data.map(post => {
          const config = useRuntimeConfig();
          const image = post[imageField];
          const imageUrl = image
            ? (image.startsWith('http') ? image : `${config.public.baseUrl}/storage/${image}`)
            : fallbackImage;
          return {
            ...post,
            imageUrl,
            link: `${basePath}/${post.slug}`
          };
        });
        if (excludeId) {
          processedPosts = processedPosts.filter(post => post.id !== excludeId);
        }
        posts.value = processedPosts.slice(0, count);
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