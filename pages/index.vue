<template>
  <div>
    <HeroSection />

    <!-- Courses Section -->
    <section class="bg-herbal-light" id="courses">
      <div class="container">
        <h2 class="font-serif text-xl font-bold">Our Courses</h2>
        <p class="sub-heading">
          Learn ancient wisdom and modern wellness practices
        </p>
        <div class="row">
          <div
            v-for="course in limitedCourses"
            :key="course._id"
            class="col-md-4 mb-4"
          >
            <CourseCard
              :slug="course.slug"
              :title="course.title"
              :description="course.description"
              :duration="course.duration"
              :link="course.link"
              :image="course.image"
              :price="course.price"
            />
          </div>
        </div>
        <div class="text-center mt-4">
          <button class="btn btn-primary" @click="goToCoursesPage">
            View More
          </button>
        </div>
      </div>
    </section>

    <!-- Yoga & Meditation Section -->
    <section class="bg-sandal-light" id="ynm">
      <div class="container">
        <h2 class="font-serif text-xl font-bold">Yoga and Meditation</h2>
        <p class="sub-heading">
          Transform your mind and body through ancient practices
        </p>
        <div class="row">
          <div
            v-for="ynm in yoganmeditationLimited"
            :key="ynm._id"
            class="col-md-4 mb-4"
          >
            <YogaMeditationCard
            :id="ynm._id"
              :title="ynm.title"
              :shortDescription="ynm.shortDescription"
              :coverImage="ynm.coverImageUrl"
              :slug="ynm.slug"
              :tags="ynm.tags"
              :duration="ynm.duration"
            />
          </div>
        </div>
        <div class="text-center mt-4">
          <button class="btn btn-primary" @click="goToYoganMeditationPage">
            View More
          </button>
        </div>
      </div>
    </section>

    <!-- Recipes Section -->
    <section class="bg-herbal-light" id="recipes">
      <div class="container">
        <h2 class="font-serif text-xl font-bold">Our Recipes</h2>
        <p class="sub-heading">
          Discover ancient recipes and modern wellness practices
        </p>
        <div class="row">
          <div
            v-for="recipe in recipesWithImages"
            :key="recipe._id"
            class="col-md-4 mb-4"
          >
            <RecipeCard v-bind="recipe" />
          </div>
        </div>
        <div class="text-center mt-4">
          <button class="btn btn-primary" @click="goToRecipesPage">
            View More
          </button>
        </div>
      </div>
    </section>

    <!-- Home Remedies Section -->
    <section class="bg-herbal-light" id="home-remedies">
      <div class="container">
        <h2 class="font-serif text-xl font-bold">Home Remedies</h2>
        <p class="sub-heading">
          Explore natural remedies for holistic health
        </p>
        <div class="row">
          <div
            v-for="remedy in homeRemedies"
            :key="remedy._id"
            class="col-md-4 mb-4"
          >
            <HomeRemedyCard v-bind="remedy" />
          </div>
        </div>
        <div class="text-center mt-4">
          <button class="btn btn-primary" @click="goToHomeRemediesPage">
            View More
          </button>
        </div>
      </div>
    </section>

    <BookingWizard />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useApi } from "@/composables/useApi";
import { useBookingStore } from "~/stores/booking";
import HomeRemedyCard from '@/components/HomeRemedyCard.vue';

const store = useBookingStore();

const { data: courses } = useApi("items/courses");
const { data: yoganmeditation } = useApi("items/yoganmeditation");
const { data: recipe } = useApi("items/recipies");
const { data: homeRemediesData } = useApi("items/homeRemedies");

const recipesWithImages = computed(() => recipe.value?.map(addImageUrl) || []);

const coursesWithImages = computed(() => courses.value?.map(addImageUrl) || []);

const homeRemedies = computed(() => {
  console.log('Home Remedies Data:', homeRemediesData.value);
  return homeRemediesData.value?.map(addImageUrl) || [];
});

const limitedCourses = computed(() => coursesWithImages.value.slice(0, 3));
const yoganmeditationLimited = computed(() => {
  return (yoganmeditation.value?.slice(0, 3) || []).map(item => ({
    ...item,
    coverImageUrl: item.coverImage?._id
      ? `http://localhost:9000/assets/link/${item.coverImage._id}`
      : '/placeholder-yoga.jpg',
  }));
});


const addImageUrl = (item) => ({
  ...item,
  image: item.image?._id
    ? `http://localhost:9000/assets/link/${item.image._id}`
    : "/placeholder-remedy.jpg",
});

const goToCoursesPage = () => navigateTo("/course");
const goToYoganMeditationPage = () => navigateTo("/yoganmeditation");
const goToRecipesPage = () => navigateTo("/recipe");
const goToHomeRemediesPage = () => navigateTo("/homeremedies");
</script>

<style lang="scss" scoped>
.booking-process {
  padding: 4rem 0;
  background-color: var(--background-white);
}

.booking-header {
  text-align: center;
  margin-bottom: 2rem;
  font-family: var(--font-primary);
  color: var(--text-dark-green);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

section {
  padding: 5rem 0; /* Increased padding for better spacing between content */
  margin-bottom: 2rem; /* Added margin between sections */
}

h2.font-serif {
  font-size: 2.5rem; /* Larger heading size */
  margin-bottom: 1.5rem; /* More space below heading */
  text-align: center;
}

.sub-heading {
  font-size: 1.2rem;
  color: var(--text-muted-teal-gray);
  margin-bottom: 3rem;
  text-align: center;
}

.bg-herbal-light {
  background-color: var(--background-white);
}

.bg-sandal-light {
  background-color: var(--background-green);
}

.btn {
  margin: 0 0 2rem 0;
  background-color: $button-bg;
  border: none; /* Added border style */
  border-radius: 5px; /* Added border radius */
}
.btn:hover {
  transform: translateY(-2px);
}

.btn-primary {
  background-color: $button-bg;
  border: none;
  border-radius: 5px;
  padding: 0.6rem 1.5rem;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(-100%);
    transition: transform 0.4s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    &::before {
      transform: translateX(0);
    }
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  }
}
</style>
