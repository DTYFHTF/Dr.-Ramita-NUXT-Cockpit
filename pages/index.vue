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
import { useApi } from "@/composables/useApi";
import { useBookingStore } from "~/stores/booking";
import ReusableCardSection from '@/components/IndexSection.vue'
import HomeRemedyCard from '@/components/HomeRemedyCard.vue'
import RecipeCard from '@/components/RecipeCard.vue'
import YogaMeditationCard from '@/components/YogaMeditationCard.vue'
import CourseCard from '@/components/CourseCard.vue'
import MegaMenu from "@/components/MegaMenu.vue";



const store = useBookingStore();

const { data: courses } = useApi("items/courses");
const { data: yoganmeditation } = useApi("items/yoganmeditation");
const { data: recipe } = useApi("items/recipies");
const { data: homeRemediesData } = useApi("items/homeRemedies");

const recipesWithImages = computed(() => recipe.value?.map(addImageUrl) || []);
const coursesWithImages = computed(() => courses.value?.map(addImageUrl) || []);
const yoganmeditationWithImages = computed(() => yoganmeditation.value?.map(addImageUrl) || []);
const homeRemediesWithImages = computed(() => homeRemediesData.value?.map(addImageUrl) || []);


const limitedCourses = computed(() => coursesWithImages.value.slice(0, 3));
const limitedYoganmeditation = computed(() => yoganmeditationWithImages.value.slice(0, 3));
const limitedRecipies = computed(() => recipesWithImages.value.slice(0, 3));
const limitedHomeRemedy = computed(() => homeRemediesWithImages.value.slice(0, 3));


const addImageUrl = (item) => ({
  ...item,
  image: item.image?._id
    ? `http://localhost:9000/assets/link/${item.image._id}`
    : "/placeholder-remedy.jpg",
});

const goToCoursesPage = () => navigateTo("/course");
const goToYoganMeditationPage = () => navigateTo("/yoganmeditation");
const goToRecipesPage = () => navigateTo("/recipe");
const goToHomeRemediesPage = () => navigateTo("/homeremedy");

</script>

