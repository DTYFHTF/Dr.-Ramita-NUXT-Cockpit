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
            <CourseCard v-bind="course" />
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
            <YogaMeditationCard v-bind="ynm" />
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

    <!-- Booking Process -->
    <!-- <section class="booking-process">
      <div class="container">
        <h1 class="booking-header">Booking Process</h1>
        <BookingStepper v-show="store.currentStep === 1" />
        <BookingDateStep v-show="store.currentStep === 2" />
        <BookingTimeStep v-show="store.currentStep === 3" />
        <BookingSummaryStep v-show="store.currentStep === 4" />
        <BookingDetailsStep v-show="store.currentStep === 5" />
        <BookingSuccessStep v-show="store.currentStep === 6" />
      </div>
    </section> -->
    <BookingWizard />

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useApi } from '@/composables/useApi'
import { useBookingStore } from '~/stores/booking'

const store = useBookingStore()

const { data: courses } = useApi("items/courses")
const { data: yoganmeditation } = useApi("items/yoganmeditation")
const { data: recipe } = useApi("items/recipies")

const recipesWithImages = computed(() => 
  recipe.value?.map(addImageUrl) || []
)

const coursesWithImages = computed(() => 
  courses.value?.map(addImageUrl) || []
)

const limitedCourses = computed(() => coursesWithImages.value.slice(0, 3))
const yoganmeditationLimited = computed(() => yoganmeditation.value?.slice(0, 3) || [])

const addImageUrl = (item) => ({
  ...item,
  image: item.image?._id 
    ? `http://localhost:9000/assets/link/${item.image._id}`
    : ''
})

const goToCoursesPage = () => navigateTo('/course')
const goToYoganMeditationPage = () => navigateTo('/yoganmeditation')
const goToRecipesPage = () => navigateTo('/recipes')
</script>

<style scoped>
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
}
</style>