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

    <!-- Products Section -->
    <IndexSection
    section-id="products"
    bg-class="bg-herbal-light"
    title="Featured Products"
    subtitle="Discover authentic Ayurvedic products for your wellness journey"
    :items="limitedProducts"
    :card-component="ProductCard"
    :view-more-handler="goToProductsPage"
  />

    <!-- Events Section -->
    <IndexSection
    section-id="events"
    bg-class="bg-sandal-light"
    title="Upcoming Events"
    subtitle="Join us for workshops, seminars, and wellness gatherings"
    :items="limitedEvents"
    :card-component="EventCard"
    :view-more-handler="goToEventsPage"
  />

  <BookingWizard />
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useApiLaravel } from '@/composables/useApi.js'
import { useBookingStore } from "~/stores/booking";
import HomeRemedyCard from '@/components/HomeRemedyCard.vue'
import RecipeCard from '@/components/RecipeCard.vue'
import YogaMeditationCard from '@/components/YogaMeditationCard.vue'
import CourseCard from '@/components/CourseCard.vue'
import ProductCard from '@/components/ProductCard.vue'
import EventCard from '@/components/EventCard.vue'
import { useImageUrl } from '@/composables/useImageUrl.js'
import { useProducts } from '@/composables/useProducts.ts'



const store = useBookingStore();

// API data fetching
const { data: coursesData, error: coursesError, loading: coursesLoading } = useApiLaravel('courses');
const { data: yoganmeditationData, error: yoganmeditationError, loading: yoganmeditationLoading } = useApiLaravel('yoga-meditations');
const { data: recipesData, error: recipesError, loading: recipesLoading } = useApiLaravel('recipes');
const { data: homeRemediesData, error: homeRemediesError, loading: homeRemediesLoading } = useApiLaravel('home-remedies');

// Products and Events
const { products, fetchProducts } = useProducts();
const { data: eventsData, error: eventsError, loading: eventsLoading } = useApiLaravel('events');


const { getImageUrl } = useImageUrl();


const addImageUrl = (item, fallback = '/placeholder-remedy.jpg') => {
  // For events, ensure 'image' is always a valid URL
  let img = item.image || item.event_image || item.img || '';
  // If already a full URL, use as is
  if (typeof img === 'string' && img.startsWith('http')) {
    return { ...item, image: img };
  }
  // Otherwise, use getImageUrl to resolve relative paths or fallback
  return { ...item, image: getImageUrl(img, fallback) };
};

const coursesWithImages = computed(() => coursesData.value?.data?.map(i => addImageUrl(i, '/placeholder-course.jpg')) || []);
const yoganmeditationWithImages = computed(() => yoganmeditationData.value?.data?.map(i => addImageUrl(i, '/placeholder-yoga.jpg')) || []);
const recipesWithImages = computed(() => recipesData.value?.data?.map(i => addImageUrl(i, '/placeholder-recipe.jpg')) || []);
const homeRemediesWithImages = computed(() => homeRemediesData.value?.data?.map(i => addImageUrl(i, '/placeholder-remedy.jpg')) || []);
const productsWithImages = computed(() => {
  if (!products.value || !Array.isArray(products.value)) return [];
  return products.value.map(i => ({ product: addImageUrl(i, '/placeholder-product.jpg') }));
});
const eventsWithImages = computed(() => {
  if (!eventsData.value?.data || !Array.isArray(eventsData.value.data)) return [];
  return eventsData.value.data.map(i => addImageUrl(i, '/placeholder-event.jpg'));
});


const limitedCourses = computed(() => coursesWithImages.value.slice(0, 3));
const limitedYoganmeditation = computed(() => yoganmeditationWithImages.value.slice(0, 3));
const limitedRecipies = computed(() => recipesWithImages.value.slice(0, 3));
const limitedHomeRemedy = computed(() => homeRemediesWithImages.value.slice(0, 3));
const limitedProducts = computed(() => {
  const arr = [...productsWithImages.value];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, 3);
});
const limitedEvents = computed(() => eventsWithImages.value.slice(0, 3));


const goToCoursesPage = () => navigateTo("/course");
const goToYoganMeditationPage = () => navigateTo("blog/yoganmeditation");
const goToRecipesPage = () => navigateTo("blog/recipe");
const goToHomeRemediesPage = () => navigateTo("blog/homeremedy");
const goToProductsPage = () => navigateTo("/products");
const goToEventsPage = () => navigateTo("/event");

// Fetch products and events on component mount
onMounted(async () => {
  await fetchProducts(1, 6); // Fetch first 6 products
  // Events are automatically fetched by useApiLaravel
});

</script>

