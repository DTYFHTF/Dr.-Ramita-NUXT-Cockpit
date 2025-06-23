<template>
  <div class="yoga-detail">
    <!-- Enhanced Loading State -->
    <div v-if="loading && !yoga" class="loading-state text-center py-9">
      <div
        class="spinner-grow text-primary"
        style="width: 3rem; height: 3rem"
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-4 text-muted fs-5">Preparing your mindful journey...</p>
    </div>

    <!-- Enhanced Error State -->
    <div v-else-if="error && !yoga" class="error-state text-center py-9">
      <div
        class="alert alert-danger mx-auto p-4 shadow-sm"
        style="max-width: 500px"
      >
        <LucideIcon icon="mdi:meditation" class="me-2 fs-4" />
        <strong class="fs-5">Mindful Moment Needed:</strong>
        <p class="mt-2 mb-0">
          {{ error.message || "We need to center ourselves to try again" }}
        </p>
      </div>
      <button class="btn btn-smooth-primary mt-4 px-5 py-3" @click="retryFetch">
        <LucideIcon icon="mdi:refresh" class="me-2" />Re-center
      </button>
    </div>

    <!-- Yoga Content -->
    <article v-if="yoga" class="yoga-container">
      <!-- Enhanced Header Section -->
      <header class="yoga-header  mb-7">
        <div class="container">
          <div class="header-content max-w-800 mx-auto py-6">
            
            <h1 class="fw-bold mb-4">{{ yoga.title }}</h1>
            
            <p class="yoga-slogan lead fs-3 text-muted mb-4">
              {{yoga.sub_title}}
            </p>
            <div class="yoga-meta d-flex gap-4">
              <div class="meta-item d-flex align-items-center fs-5">
                <LucideIcon
                  icon="mdi:clock-outline"
                  class="me-2 fs-4"
                />
                <span class="text-muted">{{ yoga.duration }}</span>
              <div class=" px-5 tags">
                <LucideIcon icon="mdi:tag-outline" class="me-2" />
              <span class="tag">
                <DynamicContent :content="Array.isArray(yoga.tags) ? yoga.tags.join(', ') : (yoga.tags ?? 'Uncategorized')" />
              </span></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Enhanced Cover Image -->
      <div v-if="yoga.image" class="cover-image mb-7">
        <div class="container px-xxl-12">
          <div class="row">
            <div class="col-lg-8">
              <img
                :src="yoga.coverImageUrl"
                :alt="yoga.title"
                class="img-fluid shadow-lg"
                loading="lazy"
                style="max-height: 600px; object-fit: cover" />
            </div>
            <div class="col-lg-4">
              <SimilarReads :posts="latestPosts" />
            </div>
          </div>
        </div>
      </div>
      

      <!-- Main Content -->
      <div class="container">
        <!-- Enhanced Short Description -->
        <section v-if="yoga.short_description" class="short-description mb-7 text-start">
          <div class="lead fs-4 text-muted max-w-700 mx-auto lh-lg mb-3">
            <DynamicContent :content="yoga.short_description" />
          </div>
        </section>

        <!-- Enhanced Yoga Poses -->
        <section class="yoga-poses mb-7 text-start">
          <div class="section-header mb-6">
            <h2>Guided Practice Steps</h2>
            <p class="section-subtitle text-muted fs-5">
              Move with intention and awareness
            </p>
          </div>

          <div class="row g-5">
            <div
              v-for="(pose, index) in yoga.poses"
              :key="index"
              class=""
            >
              <div
                class="pose-step card h-100 shadow-sm border-0 overflow-hidden hover-lift"
              >
                <div class="card-body p-5">
                  <div class="d-flex align-items-center mb-4" style="justify-content: flex-start;">
                    <div
                      class="step-number text-deep-green d-inline-flex align-items-center justify-content-center"
                    >
                      <span class="fs-4 fw-bold">{{ index + 1 }}</span>
                    </div>
                    <h3 class="pose-title h4 mb-0 fw-semibold ms-3">{{ pose.title }}</h3>
                  </div>
                  <img
                    v-if="pose.poseImageUrl"
                    :src="pose.poseImageUrl"
                    :alt="pose.title"
                    class="card-img-bottom d-block mx-auto"
                    loading="lazy"
                    style="max-height: 300px; width: auto; object-fit: contain; background: #fff;"
                  />
                  <div class="pose-instructions text-muted fs-5 lh-lg">
                    <DynamicContent :content="pose.instructions" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Enhanced Benefits Section -->
        <section class="yoga-benefits rounded-4 text-start">
          <div class="container">
            <div class="section-header mb-6">
              <h2>Transformative Benefits</h2>
              <p class="section-subtitle text-muted fs-5">Nourish your body and mind</p>
            </div>
            <ol class="benefits-list bg-white">
              <li v-for="(benefit, idx) in yoga.benefits" :key="idx" class="fs-5 lh-lg mb-2">
                <DynamicContent :content="benefit" />
              </li>
            </ol>
          </div>
        </section>

        <!-- Enhanced Conclusion -->
        <section class="yoga-conclusion mb-7 py-7 text-start">
          <div class="container">
            <div class="max-w-700 mx-auto">
              <div class="section-header mb-6">
                <h2>Mindful Completion</h2>
                <p class="section-subtitle text-muted fs-5">
                  Carry your practice forward
                </p>
              </div>
              <div
                class="conclusion-content text-muted fs-5 lh-lg"
              >
                <DynamicContent :content="yoga.conclusion" />
              </div>
              
              <button
                class="btn btn-smooth-primary mt-5 px-6 py-3 fs-5"
                @click="$scrollTo('#similar-reads', 500, { offset: -325 })"
              >
                <LucideIcon icon="mdi:leaf" class="me-2" color="white" />Begin Again
              </button>
            </div>
          </div>
        </section>

        
      </div>
    </article>
  </div>
</template>
<script setup>
import LucideIcon from "@/components/LucideIcon.vue";
import SimilarReads from "@/components/SimilarReads.vue";
import DynamicContent from '@/components/DynamicContent.vue';
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useApiLaravel } from '@/composables/useApi.js'
import { useImageUrl } from '@/composables/useImageUrl.js'
import useSimilarPosts from '@/composables/useSimilarPosts.js'

const route = useRoute();
const { getImageUrl } = useImageUrl();
const { data: yogaData, error, loading } = useApiLaravel(`yoga-meditations/${route.params.slug}`);
const yoga = computed(() => {
  if (!yogaData.value || !yogaData.value.data) return null;
  const data = yogaData.value.data;
  return {
    ...data,
    coverImageUrl: getImageUrl(data.image, '/placeholder-yoga.jpg'),
    poses: (data.poses || []).map((pose) => ({
      ...pose,
      poseImageUrl: getImageUrl(pose.poseImage, '/placeholder-yoga.jpg'),
      title: pose.title || pose.poseName || '',
      instructions: pose.instructions || '',
    })),
    tags: data.tags || 'Uncategorized',
    duration: data.duration || 'N/A',
  };
});

// Similar Reads
const { posts: latestPosts } = useSimilarPosts('yoga-meditations', {
  excludeId: yoga.value?.id,
  basePath: '/yoganmeditation',
  count: 4,
  imageField: 'image',
  fallbackImage: '/placeholder-yoga.jpg'
});

const retryFetch = async () => {
  error.value = null;
  await refetch();
};


</script>
<style scoped lang="scss">

.yoga-header {
  margin-top: 2rem; 

  @media (max-width: 768px) {
    margin-top: 1rem; 
  }
}

.container {
  margin-bottom: 2rem; 
}

.cover-image img {
  width: 100%;
  height: 475px; 
  object-fit: cover;
  border-radius: 1rem;

  @media (max-width: 768px) {
    height: 300px; 
  }
}


.pose-step {
  transition: all 0.3s ease;
  border: 1px solid rgba($border-color, 0.3);

  &:hover {
    transform: translateY(-8px);
    box-shadow: $card-shadow;
  }

  .step-number {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
    margin-right: 1rem;
    margin-left:0;
  }
}

.pose-step .card-img-bottom {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-width: 460px;
  height: 300px;
  object-fit: contain;
  background: #fff;
}

.benefits-content {
  :deep(ul) {
    li {
      padding-left: 2.5rem;
      &::before {
        font-size: 1.5rem;
      }
    }
  }
}

.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.max-w-700 {
  margin: 0 auto;
}

.btn-smooth-primary {
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
  }
}

</style>
