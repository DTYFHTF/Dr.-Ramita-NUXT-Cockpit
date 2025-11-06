<template>
  <div class="my-events-section">
    <h2 class="section-title">My Events</h2>
    
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading events...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="!events || events.length === 0" class="empty-state">
      <div class="empty-icon">
        <LucideIcon name="mdi:calendar" :size="64" />
      </div>
      <h3>No Registered Events Yet</h3>
      <p>Discover and join upcoming Ayurveda events</p>
      <NuxtLink to="/events" class="btn btn-smooth-success btn-lg">
        <LucideIcon name="mdi:clipboard-text-search-outline" :size="20" class="me-2" />
        Browse Events
      </NuxtLink>
    </div>

    <!-- Events Grid -->
    <div v-else class="events-grid">
      <div v-for="event in events" :key="event.id" class="event-wrapper">
        <EventCard
          :title="event.title"
          :description="event.short_description || event.description"
          :image="event.image"
          :date="event.date"
          :time="event.time"
          :location="event.location"
          :location-type="event.location_type"
          :price="event.price"
          :slug="event.slug"
          :capacity="event.capacity"
          :registered-count="event.registered_count"
          :status="event.status"
          :category="event.category"
        >
          <template #meta>
            <div class="registration-badge">
              <LucideIcon name="CheckCircle2" :size="16" class="me-1" />
              Registered {{ formatDate(event.registered_at) }}
            </div>
          </template>
          <template #button>
            <NuxtLink :to="`/events/${event.slug}`" class="btn btn-success w-100">
              View Details
            </NuxtLink>
          </template>
        </EventCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useImageUrl } from '@/composables/useImageUrl';

interface Event {
  id: number;
  slug: string;
  title: string;
  description: string;
  short_description?: string;
  image: string;
  image_url?: string;
  date: string;
  time: string;
  location: string;
  location_type: string;
  price: number;
  capacity: number;
  registered_count: number;
  status: string;
  category: string;
  registered_at: string;
  registration_status: string;
}

const userStore = useUserStore();
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;
const { getImageUrl } = useImageUrl();
const events = ref<Event[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchEvents = async () => {
  try {
    loading.value = true;
    error.value = null;

    const result = await $fetch<{ success: boolean; data: Event[] }>(`${apiBase}/user/events`, {
      headers: { 
        Authorization: `Bearer ${userStore.token}`,
        Accept: 'application/json'
      }
    });

    if (result?.success) {
      // Resolve image URLs using helper so relative/storage paths are converted to full URLs
      events.value = result.data.map((ev) => ({
        ...ev,
        image: getImageUrl(ev.image || ev.image_url, '/placeholder-event.jpg'),
      }));
    }
  } catch (err: any) {
    error.value = err?.data?.message || err?.message || 'Unable to load your events';
    console.error('Error fetching events:', err);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'recently';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'recently';
    
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'recently';
  }
};

onMounted(() => {
  fetchEvents();
});
</script>

<style scoped lang="scss">
.my-events-section {
  .section-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    
    .empty-icon {
      color: var(--text-muted);
      margin-bottom: 1.5rem;
    }

    h3 {
      font-size: 1.5rem;
      font-weight: 600;
color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    p {
      color: var(--text-secondary);
      font-size: 1.125rem;
      margin-bottom: 2rem;
    }
  }

  .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  .event-wrapper {
    position: relative;
  }

  .registration-badge {
    display: inline-flex;
    align-items: center;
    background: var(--color-secondary);
    color: white;
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
  }
}
</style>
