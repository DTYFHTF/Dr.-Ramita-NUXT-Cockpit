<template>
  <Card
    :title="title"
    :description="short_description || description || 'No description available'"
    :image="image || '/placeholder-event.jpg'"
    :imageAlt="title"
    :badge="getEventBadge()"
    :link="slug ? `/event/${slug}` : null"
    customClass="event-card"
  >
    <template #meta>
      <div class="meta-item">
        <LucideIcon icon="mdi:currency-dollar" class="icon" />
        <span>{{ price ? `$${price}` : 'Free' }}</span>
      </div>
      <div class="meta-item">
        <LucideIcon icon="mdi:clock-outline" class="icon" />
        <span>{{ time || 'TBA' }}</span>
      </div>
           
    </template>
    <template #button>
      <NuxtLink
        v-if="slug || id"
        :to="`/event/${slug || id}`"
        class="btn-smooth-primary mt-auto w-100"
      >
        View Event
        <LucideIcon icon="mdi:arrow-right" color="white" class="btn-icon" />
      </NuxtLink>
      <div v-else class="btn-smooth disabled mt-auto w-100">
        Event Link Unavailable
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from "./Card.vue";
import LucideIcon from "@/components/LucideIcon.vue";

const props = defineProps({
  id: [String, Number],
  title: String,
  description: String,
  short_description: String,
  image: String,
  date: String,
  time: String,
  location: String,
  category: String,
  status: String,
  price: [String, Number],
  capacity: [String, Number],
  registered_count: [String, Number],
  slug: [String, Number]
});

// Get appropriate badge text based on event status and category
const getEventBadge = () => {
  if (props.status === 'completed') return 'Completed';
  if (props.status === 'cancelled') return 'Cancelled';
  if (props.status === 'ongoing') return 'Live Now';
  if (props.capacity && props.registered_count >= props.capacity) return 'Full';
  return props.category || 'Event';
};

// Format date for display
const formatDate = (date) => {
  if (!date) return 'TBA';
  
  try {
    const eventDate = new Date(date);
    return eventDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    return date;
  }
};
</script>

<style scoped>


.meta-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.meta-item .icon {
  width: 16px;
  height: 16px;
}
</style>