<template>
  <div class="cms-page">
    <div v-if="pending" class="container py-5 text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="error || !pageData" class="container py-5">
      <ErrorAlert
        title="Page Not Found"
        message="The page you're looking for doesn't exist or has been removed."
        type="error"
      />
      <div class="text-center mt-4">
        <NuxtLink to="/" class="btn btn-smooth-primary">Go to Homepage</NuxtLink>
      </div>
    </div>

    <div v-else-if="pageData">
      <PageHero
        :title="pageData.title"
        :subtitle="pageData.subtitle || ''"
        variant="gradient"
      />

      <div class="container py-5">
        <div class="cms-content" v-html="pageData.content"></div>

        <div v-if="pageData.last_updated" class="text-muted text-center mt-5 small">
          Last Updated: {{ formatDate(pageData.last_updated) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CMSPageResponse } from '@/types/cms';
import PageHero from '@/components/PageHero.vue';
import ErrorAlert from '@/components/ErrorAlert.vue';

const route = useRoute();
const config = useRuntimeConfig();
const slug = computed(() => route.params.slug as string);

// Fetch page from CMS
const { data: response, pending, error } = await useFetch<CMSPageResponse>(`${config.public.apiBase}/pages/${slug.value}`);

// Extract page data from response
const pageData = computed(() => response.value?.data);

// Set meta tags
useHead({
  title: computed(() => pageData.value?.meta_title || pageData.value?.title || 'Page'),
  meta: [
    { name: 'description', content: computed(() => pageData.value?.meta_description || '') },
    { name: 'keywords', content: computed(() => pageData.value?.meta_keywords?.join(', ') || '') }
  ]
});

// Format date helper
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<style scoped lang="scss">
.cms-content {
  max-width: 900px;
  margin: 0 auto;
  background: var(--background-white);
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  :deep(h1), :deep(h2), :deep(h3) {
    color: var(--text-primary);
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  :deep(h1) {
    font-size: 2rem;
    border-bottom: 2px solid var(--color-primary);
    padding-bottom: 0.5rem;
  }

  :deep(h2) {
    font-size: 1.5rem;
    color: var(--color-primary);
  }

  :deep(h3) {
    font-size: 1.25rem;
  }

  :deep(p) {
    margin-bottom: 1rem;
    line-height: 1.8;
    color: var(--text-primary);
  }

  :deep(ul), :deep(ol) {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
  }

  :deep(li) {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }

  :deep(a) {
    color: var(--color-primary);
    text-decoration: underline;

    &:hover {
      color: var(--color-secondary);
    }
  }

  :deep(strong) {
    font-weight: 600;
    color: var(--text-primary);
  }

  :deep(blockquote) {
    border-left: 4px solid var(--color-primary);
    padding-left: 1.5rem;
    margin: 1.5rem 0;
    font-style: italic;
    color: var(--text-muted);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.3em;
}
</style>
