<template>
  <div>
    <ProductSearch
      v-if="showSearchBar"
      :query="query"
      :allProducts="allProducts"
      :placeholder="rotatingPlaceholder"
      class="navbar-product-search"
      @search="handleSearch"
    />
    <template v-else>
      <ul class="navbar-nav mb-2 mb-lg-0 mx-auto">
        <li class="nav-item">
          <SmoothLink to="courses" fallbackRoute="/courses" class="nav-shared-link">Courses</SmoothLink>
        </li>
        <li class="nav-item">
          <NuxtLink to="/doctors" class="nav-shared-link">Doctors</NuxtLink>
        </li>
        <li class="nav-item dropdown blog-dropdown"
            @mouseenter="handleBlogDropdownEnter"
            @mouseleave="handleBlogDropdownLeave">
          <a class="nav-shared-link dropdown-toggle d-flex align-items-center gap-2" href="#" id="blogDropdown" role="button"
            :aria-expanded="showBlogDropdown ? 'true' : 'false'">
            Blogs
          </a>
          <ul class="dropdown-menu custom-dropdown-menu"
              :class="{ show: showBlogDropdown }"
              aria-labelledby="blogDropdown"
              @mouseenter="cancelBlogDropdownClose"
              @mouseleave="handleBlogDropdownLeave">
            <DropDownItems :items="blogDropdownItems" />
          </ul>
        </li>
        <li class="nav-item">
          <NuxtLink to="/events" class="nav-shared-link">Events</NuxtLink>
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import ProductSearch from '@/components/products/ProductSearch.vue';
import DropDownItems from '@/components/DropDownItems.vue';
import SmoothLink from '@/components/SmoothLink.vue';
import { useRoute, useRouter } from 'vue-router';


import { onMounted, onUnmounted } from 'vue';
import { useProducts } from '@/composables/useProducts';

const query = ref('');
const allProducts = ref([]);
const featuredNames = ref([]);
const rotatingPlaceholder = ref('Search');

let placeholderIndex = 0;
let charIndex = 0;
let typingInterval = null;
let isDeleting = false;
let pauseTimeout = null;


async function loadFeaturedNames() {
  const { fetchFeaturedProducts } = useProducts();
  const featured = await fetchFeaturedProducts(10);
  featuredNames.value = featured.map(p => p.name).filter(Boolean);
  if (featuredNames.value.length > 0) {
    startTypingEffect();
  }
}

function startTypingEffect() {
  if (typingInterval) clearInterval(typingInterval);
  if (pauseTimeout) clearTimeout(pauseTimeout);
  placeholderIndex = 0;
  charIndex = 0;
  isDeleting = false;
  typeNextChar();
}

function typeNextChar() {
  const names = featuredNames.value;
  if (!names.length) return;
  const currentName = names[placeholderIndex];
  const base = 'Search ';
  if (!isDeleting) {
    // Typing
    charIndex++;
    rotatingPlaceholder.value = base + currentName.slice(0, charIndex);
    if (charIndex === currentName.length) {
      // Pause at full name
      pauseTimeout = setTimeout(() => {
        isDeleting = true;
        typeNextChar();
      }, 1200);
      return;
    }
  } else {
    // Deleting
    charIndex--;
    rotatingPlaceholder.value = base + currentName.slice(0, charIndex);
    if (charIndex === 0) {
      // Move to next name
      isDeleting = false;
      placeholderIndex = (placeholderIndex + 1) % names.length;
      pauseTimeout = setTimeout(() => {
        typeNextChar();
      }, 400);
      return;
    }
  }
  typingInterval = setTimeout(typeNextChar, isDeleting ? 30 : 60);
}


onMounted(async () => {
  await loadFeaturedNames();
});
onUnmounted(() => {
  if (typingInterval) clearInterval(typingInterval);
  if (pauseTimeout) clearTimeout(pauseTimeout);
});

const blogDropdownItems = [
  { type: 'link', routeName: 'ynm', fallbackRoute: '/blog/yoganmeditation', icon: 'mdi:meditation', label: 'Yoga & Meditation' },
  { type: 'link', routeName: 'recipes', fallbackRoute: '/blog/recipe', icon: 'mdi:chef-hat', label: 'Recipes' },
  { type: 'link', routeName: 'home-remedies', fallbackRoute: '/blog/homeremedy', icon: 'mdi:leaf', label: 'Home Remedies' }
];

const showBlogDropdown = ref(false);
let blogDropdownTimeout = null;

function handleBlogDropdownEnter() {
  if (blogDropdownTimeout) clearTimeout(blogDropdownTimeout);
  showBlogDropdown.value = true;
}
function handleBlogDropdownLeave() {
  blogDropdownTimeout = setTimeout(() => {
    showBlogDropdown.value = false;
  }, 120);
}
function cancelBlogDropdownClose() {
  if (blogDropdownTimeout) clearTimeout(blogDropdownTimeout);
}

const route = useRoute();
const router = useRouter();

// Define which routes should show the search bar
const searchBarRoutes = [
  '/', '/products', '/shop', '/product/[slug]', '/category', '/category/[...slug]', '/cartpage', '/checkout', '/dashboard'
];
const showSearchBar = computed(() => {
  // Always show search bar on product detail and category pages
  if ((route.path.startsWith('/products/') && route.path !== '/products') ||
      route.path.startsWith('/category')) return true;
  return searchBarRoutes.includes(route.path);
});

// Handle search submission
function handleSearch(searchQuery) {
  if (searchQuery && searchQuery.trim()) {
    router.push({
      path: '/products',
      query: { search: searchQuery.trim() }
    });
  }
}
</script>
