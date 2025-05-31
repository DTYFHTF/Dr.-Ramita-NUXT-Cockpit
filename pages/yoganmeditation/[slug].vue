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
            
            <h1 class="yoga-title display-4 fw-bold mb-4">{{ yoga.title }}</h1>
            
            <p class="yoga-slogan lead fs-3 text-muted mb-5">
              {{yoga.subTitle}}
            </p>
            <div class="yoga-meta d-flex gap-4">
              <div class="meta-item d-flex align-items-center fs-5">
                <LucideIcon
                  icon="mdi:clock-outline"
                  class="me-2 text-deep-green fs-4"
                />
                <span class="text-muted">{{ yoga.duration }}</span>
              <div class=" px-5 tags"><LucideIcon icon="mdi:tag-outline" class="me-2" />{{ tag }}
              <span class="tag">{{
                yoga.tags ?? "Uncategorized"
              }}</span></div>
            
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
                class="img-fluid rounded-4 shadow-lg"
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
        <section v-if="yoga.shortDescription" class="short-description mb-7 text-start">
          <div class="lead fs-4 text-muted max-w-700 mx-auto lh-lg">
            <DynamicContent :content="yoga.shortDescription" />
          </div>
        </section>

        <!-- Enhanced Yoga Poses -->
        <section class="yoga-poses mb-7 text-start">
          <div class="section-header mb-6">
            <h2 class="section-title">Guided Practice Steps</h2>
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
                      class="step-number bg-soft-green text-deep-green d-inline-flex align-items-center justify-content-center"
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
        <section class="yoga-benefits bg-soft-green rounded-4 text-start">
          <div class="container">
            <div class="section-header mb-6">
              <h2 class="section-title">Transformative Benefits</h2>
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
                <h2 class="section-title">Mindful Completion</h2>
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

        <!-- Processed Content -->
        <section v-if="processedContent" class="processed-content mb-7 text-start">
          <div class="max-w-700 mx-auto lh-lg">
            <div v-html="processedContent"></div>
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
import { ref, watchEffect, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useApi } from "@/composables/useApi";
import vueScrollTo from 'vue-scrollto';
import { stripHtmlTags } from '@/composables/sanitizeUtils'; 
import { autoLinkContent } from '@/composables/autoLinkParser';

const route = useRoute();
const yoga = ref(null);
const error = ref(null);

const {
  data,
  error: apiError,
  loading,
  refetch,
} = useApi(`items/yoganmeditation?filter={"slug":"${route.params.slug}"}`);

const retryFetch = async () => {
  error.value = null;
  await refetch();
};

watchEffect(() => {
  try {
    if (data.value?.[0]) {
      yoga.value = mapYogaData(data.value[0]);
    } else if (data.value === null) {
      error.value = new Error("Content not found");
    }
    error.value = apiError.value;
  } catch (e) {
    error.value = e;
  }
});

function mapYogaData(data) {
  return {
    ...data,
    subTitle: data.subTitle || "",
    shortDescription: data.shortDescription || "",
    duration: data.duration || "N/A",
    tags: data.tags || "N/A",
    benefits: data.benefits || "",
    conclusion: data.conclusion || "",
    coverImageUrl: data.image && data.image._id
      ? `http://localhost:9000/assets/link/${data.image._id}`
      : "/placeholder-yoga.jpg",
    poses: (data.poses || []).map((pose) => {
      if (!pose.poseImage || !pose.poseImage._id) {
        console.warn("Missing pose image for pose:", pose);
      }
      return {
        ...pose,
        title: pose.poseName || "",
        instructions: pose.instructions || "",
        poseImageUrl: pose.poseImage && pose.poseImage._id
          ? `http://localhost:9000/assets/link/${pose.poseImage._id}`
          : null,
      };
    }),
  };
}

const latestPosts = ref([]);

const apiUrl = "items/yoganmeditation"; // Removed query parameters temporarily

const {
  data: latestPostsData,
  error: latestPostsError,
  loading: latestPostsLoading,
} = useApi(apiUrl);

watchEffect(() => {
  if (latestPostsData.value) {
    const allPosts = latestPostsData.value.map((post) => {
      if (!post.image || !post.image._id) {
        console.warn("Missing image for post:", post);
      }
      return {
        ...post,
        coverImageUrl: post.image && post.image._id
          ? `http://localhost:9000/assets/link/${post.image._id}`
          : "/placeholder-yoga.jpg",
      };
    });

    // Randomly select 4 posts
    latestPosts.value = allPosts.sort(() => 0.5 - Math.random()).slice(0, 4);
  } else if (latestPostsError.value) {
    console.error("Error fetching latest posts:", latestPostsError.value.response || latestPostsError.value);
  }
});

const scrollToSimilarReads = () => {
  vueScrollTo.scrollTo('#similar-reads', 500, { offset: -200 });
};

// Watch for changes in the `yoga` data and reapply the directive
watchEffect(() => {
  if (yoga.value) {
    const sloganElement = document.querySelector('.yoga-slogan');
    if (sloganElement) {
      const originalContent = sloganElement.innerHTML;
      autoLinkContent(originalContent).then((linkedContent) => {
        sloganElement.innerHTML = linkedContent;
      });
    }
  }
});
</script>
<style scoped lang="scss">

.yoga-header {
  background-color: $accent-soft-green;
  margin-top: 2rem; // Add spacing above the header

  @media (max-width: 768px) {
    margin-top: 1rem; // Adjust spacing for smaller screens
  }
}

.container {
  margin-bottom: 2rem; // Ensure consistent spacing between sections
}

.cover-image img {
  width: 100%;
  height: 475px; // Default height for larger screens
  object-fit: cover;
  border-radius: 1rem;

  @media (max-width: 768px) {
    height: 300px; // Adjust height for smaller screens
  }
}

.section-header {
  margin-bottom: 1.5rem; // Adjust spacing for section headers
}

.similar-reads {
  margin-top: 2rem; // Add spacing above the Similar Reads section
}

.section-header {
  .section-title {
    font-size: 2.5rem;
    &::after {
      width: 80px;
      height: 4px;
    }
  }
}

.section-header.text-center {
  text-align: left !important;
}

.pose-step {
  transition: all 0.3s ease;
  border: 1px solid rgba($border-color, 0.3);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
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
  // max-width: 700px;
  margin: 0 auto;
}

.btn-smooth-primary {
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
  }
}

.fs-5 {
  font-size: 1.25rem;
}
.fs-6 {
  font-size: 1.1rem;
}
.py-7 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}
.mb-7 {
  margin-bottom: 2rem;
}
.rounded-4 {
  border-radius: 1.5rem;
}

.similar-reads {
  position: sticky;
  top: 2rem;
  max-width: 300px;
  margin-left: auto;
}

.similar-read-item img {
  border-radius: 0.5rem;
}

.similar-read-item h4 {
  font-size: 1rem;
}

.similar-read-item p {
  font-size: 0.875rem;
}
</style>
