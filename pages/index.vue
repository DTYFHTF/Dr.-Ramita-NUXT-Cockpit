<template>
  <div>
    
    <HeroSection />

    <!-- Courses Section --> 
    <IndexSection
    section-id="courses"
    bg-class="bg-herbal-light"
    title="Our Courses"
    subtitle="Learn ancient wisdom and modern wellness practices"
    :items="limitedCourses"
    :card-component="CourseCard"
    :view-more-handler="goToCoursesPage"
  />

    <!-- Yoga & Meditation Section -->
    <IndexSection
    section-id="ynm"
    bg-class="bg-sandal-light"
    title="Yoga and Meditation"
    subtitle="Transform your mind and body through ancient practices"
    :items="limitedYoganmeditation"
    :card-component="YogaMeditationCard"
    :view-more-handler="goToYoganMeditationPage"
  />

    <!-- Recipes Section -->
    <IndexSection
    section-id="recipes"
    bg-class="bg-herbal-light"
    title="Our Recipes"
    subtitle="Discover ancient recipes and modern wellness practices"
    :items="limitedRecipies"
    :card-component="RecipeCard"
    :view-more-handler="goToRecipesPage"
  />

    <!-- Home Remedies Section -->
    <IndexSection
    section-id="home-remedies"
    bg-class="bg-sandal-light"
    title="Home Remedies"
    subtitle="Explore natural remedies for holistic health"
    :items="limitedHomeRemedy"
    :card-component="HomeRemedyCard"
    :view-more-handler="goToHomeRemediesPage"
  />

  <BookingWizard />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useApiLaravel } from '@/composables/useApi.js'
import { useBookingStore } from "~/stores/booking";
import HomeRemedyCard from '@/components/HomeRemedyCard.vue'
import RecipeCard from '@/components/RecipeCard.vue'
import YogaMeditationCard from '@/components/YogaMeditationCard.vue'
import CourseCard from '@/components/CourseCard.vue'
import { useImageUrl } from '@/composables/useImageUrl.js'



const store = useBookingStore();

const { data: coursesData, error: coursesError, loading: coursesLoading } = useApiLaravel('courses');
const { data: yoganmeditationData, error: yoganmeditationError, loading: yoganmeditationLoading } = useApiLaravel('yoga-meditations');
const { data: recipesData, error: recipesError, loading: recipesLoading } = useApiLaravel('recipes');
const { data: homeRemediesData, error: homeRemediesError, loading: homeRemediesLoading } = useApiLaravel('home-remedies');


const { getImageUrl } = useImageUrl();

const addImageUrl = (item, fallback = '/placeholder-remedy.jpg') => ({
  ...item,
  image: getImageUrl(item.image, fallback),
});

const coursesWithImages = computed(() => coursesData.value?.data?.map(i => addImageUrl(i, '/placeholder-course.jpg')) || []);
const yoganmeditationWithImages = computed(() => yoganmeditationData.value?.data?.map(i => addImageUrl(i, '/placeholder-yoga.jpg')) || []);
const recipesWithImages = computed(() => recipesData.value?.data?.map(i => addImageUrl(i, '/placeholder-recipe.jpg')) || []);
const homeRemediesWithImages = computed(() => homeRemediesData.value?.data?.map(i => addImageUrl(i, '/placeholder-remedy.jpg')) || []);


const limitedCourses = computed(() => coursesWithImages.value.slice(0, 3));
const limitedYoganmeditation = computed(() => yoganmeditationWithImages.value.slice(0, 3));
const limitedRecipies = computed(() => recipesWithImages.value.slice(0, 3));
const limitedHomeRemedy = computed(() => homeRemediesWithImages.value.slice(0, 3));


const goToCoursesPage = () => navigateTo("/course");
const goToYoganMeditationPage = () => navigateTo("blog/yoganmeditation");
const goToRecipesPage = () => navigateTo("blog/recipe");
const goToHomeRemediesPage = () => navigateTo("blog/homeremedy");

</script>

