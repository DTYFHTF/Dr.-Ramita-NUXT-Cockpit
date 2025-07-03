<template>
  <div class="event-detail">
    <!-- Enhanced Loading State -->
    <div v-if="loading && !event" class="loading-state text-center py-9">
      <div
        class="spinner-grow text-primary"
        style="width: 3rem; height: 3rem"
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-4 text-muted fs-5">Loading event details...</p>
    </div>

    <!-- Enhanced Error State -->
    <div v-else-if="error && !event" class="error-state text-center py-9">
      <div
        class="alert alert-danger mx-auto p-4 shadow-sm"
        style="max-width: 500px"
      >
        <LucideIcon icon="mdi:alert-circle-outline" class="me-2 fs-4" />
        <strong class="fs-5">Error:</strong>
        <p class="mt-2 mb-0">
          {{ error.message || "Unable to fetch event details." }}
        </p>
      </div>
      <button class="btn btn-smooth-primary mt-4 px-5 py-3" @click="retryFetch">
        <LucideIcon icon="mdi:refresh" class="me-2" />Retry
      </button>
    </div>

    <!-- Event Content -->
    <article v-if="event" class="event-container">
      <!-- Enhanced Header Section -->
      <header class="event-header mb-7">
        <div class="container">
          <div class="header-content max-w-800 mx-auto py-6">
            <!-- Event Status and Category -->
            <div class="mb-3">
              <span class="badge bg-primary me-2 fs-6">{{ event.category || 'Event' }}</span>
              <span class="badge fs-6" :class="getStatusBadgeClass(event.status)">
                {{ event.status ? event.status.charAt(0).toUpperCase() + event.status.slice(1) : 'Upcoming' }}
              </span>
            </div>
            
            <h1 class="fw-bold mb-4">{{ event.title }}</h1>
            
            <p class="event-description lead fs-3 text-muted mb-4">
              <DynamicContent :content="event.short_description || event.description || ''" />
            </p>

            <!-- Event Meta Information -->
            <div class="event-meta d-flex flex-wrap gap-4 mb-4">
              <div class="meta-item d-flex align-items-center fs-5">
                <LucideIcon icon="mdi:calendar-outline" class="me-2 fs-4" />
                <span class="text-muted">{{ formatDate(event.date) }}</span>
              </div>
              <div class="meta-item d-flex align-items-center fs-5">
                <LucideIcon icon="mdi:clock-outline" class="me-2 fs-4" />
                <span class="text-muted">{{ event.time || 'TBA' }}</span>
              </div>
              <div class="meta-item d-flex align-items-center fs-5">
                <LucideIcon icon="mdi:map-marker-outline" class="me-2 fs-4" />
                <span class="text-muted">{{ event.location || 'Online' }}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Enhanced Cover Image -->
      <div v-if="event.image" class="cover-image mb-7">
        <div class="container px-xxl-12">
          <div class="row">
            <div class="col-lg-8">
              <img
                :src="event.coverImageUrl"
                :alt="event.title"
                class="img-fluid shadow-lg rounded-4"
                loading="lazy"
                style="max-height: 600px; object-fit: cover; width: 100%"
              />
            </div>
            <div class="col-lg-4">
              <!-- Event Registration Card -->
              <div class="card shadow-sm border-0 sticky-top" style="top: 2rem;">
                <div class="card-body p-4">
                  <h5 class="card-title fw-bold mb-3">Event Registration</h5>
                  
                  <!-- Registration Details -->
                  <div class="registration-details mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <span class="text-muted">Price:</span>
                      <span class="fw-bold text-primary fs-5">
                        {{ event.price ? `$${event.price}` : 'Free' }}
                      </span>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <span class="text-muted">Capacity:</span>
                      <span>{{ event.capacity || 'Unlimited' }}</span>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <span class="text-muted">Registered:</span>
                      <span class="fw-semibold">{{ event.registered_count || 0 }}</span>
                    </div>
                    
                    <!-- Registration Progress -->
                    <div v-if="event.capacity" class="mb-3">
                      <div class="progress" style="height: 8px;">
                        <div 
                          class="progress-bar bg-primary" 
                          :style="{ width: registrationProgress + '%' }"
                        ></div>
                      </div>
                      <small class="text-muted">{{ registrationProgress }}% filled</small>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="d-grid gap-2">
                    <button 
                      v-if="event.status === 'upcoming' && !isEventFull"
                      @click="registerForEventAction"
                      class="btn btn-primary btn-lg"
                      :disabled="registering"
                    >
                      <span v-if="registering" class="spinner-border spinner-border-sm me-2" role="status"></span>
                      Register Now
                    </button>
                    
                    <button v-else-if="isEventFull" class="btn btn-secondary btn-lg" disabled>
                      Event Full
                    </button>
                    
                    <button v-else-if="event.status === 'completed'" class="btn btn-outline-primary btn-lg" disabled>
                      Event Completed
                    </button>
                    
                    <button @click="shareEvent" class="btn btn-outline-secondary">
                      <i class="bi bi-share me-2"></i>
                      Share Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="container">
        <!-- Event Description -->
        <section v-if="event.description" class="event-description mb-7 text-start">
          <div class="section-header mb-6">
            <h2>About This Event</h2>
            <p class="section-subtitle text-muted fs-5">
              Everything you need to know
            </p>
          </div>
          
          <div class="lead fs-5 text-muted lh-lg">
            <DynamicContent :content="event.description" />
          </div>
        </section>

        <!-- Event Speakers Section -->
        <section v-if="event.speakers && event.speakers.length" class="speakers-section mb-7">
          <div class="section-header mb-6">
            <h2>Featured Speakers</h2>
            <p class="section-subtitle text-muted fs-5">
              Meet our expert presenters
            </p>
          </div>

          <div class="row g-4">
            <div 
              v-for="speaker in event.speakers" 
              :key="speaker.id"
              class="col-md-6 col-lg-4"
            >
              <div class="card speaker-card h-100 border-0 shadow-sm">
                <div class="card-body text-center p-4">
                  <img
                    :src="speaker.avatar || '/placeholder-speaker.jpg'"
                    :alt="speaker.name"
                    class="rounded-circle mb-3"
                    style="width: 80px; height: 80px; object-fit: cover"
                  />
                  <h5 class="card-title fw-bold">{{ speaker.name }}</h5>
                  <p class="text-muted mb-2">{{ speaker.title }}</p>
                  <p class="card-text small">{{ speaker.bio }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Event Agenda Section -->
        <section v-if="event.agenda && event.agenda.length" class="agenda-section mb-7">
          <div class="section-header mb-6">
            <h2>Event Agenda</h2>
            <p class="section-subtitle text-muted fs-5">
              Schedule and activities
            </p>
          </div>

          <div class="agenda-timeline">
            <div 
              v-for="(item, index) in event.agenda" 
              :key="index"
              class="agenda-item d-flex mb-4"
            >
              <div class="agenda-time flex-shrink-0 me-4">
                <div class="badge bg-light text-dark fw-semibold fs-6 px-3 py-2">
                  {{ item.time }}
                </div>
              </div>
              <div class="agenda-content flex-grow-1">
                <h5 class="fw-bold mb-2">{{ item.title }}</h5>
                <p class="text-muted mb-1">{{ item.description }}</p>
                <small v-if="item.speaker" class="text-primary">
                  Speaker: {{ item.speaker }}
                </small>
              </div>
            </div>
          </div>
        </section>

        <!-- Event Facilities/Features -->
        <section v-if="event.facilities && event.facilities.length" class="facilities-section mb-7">
          <div class="section-header mb-6">
            <h2>Event Features</h2>
            <p class="section-subtitle text-muted fs-5">
              What's included in this event
            </p>
          </div>

          <div class="row g-3">
            <div 
              v-for="facility in event.facilities" 
              :key="facility"
              class="col-md-6 col-lg-4"
            >
              <div class="d-flex align-items-center p-3 bg-light rounded">
                <i class="bi bi-check-circle-fill text-success me-3"></i>
                <span>{{ facility }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Location Details -->
        <section v-if="event.location && event.location !== 'Online'" class="location-section mb-7">
          <div class="section-header mb-6">
            <h2>Event Location</h2>
            <p class="section-subtitle text-muted fs-5">
              How to find us
            </p>
          </div>
          
          <div class="row">
            <div class="col-lg-6">
              <div class="location-details">
                <h5 class="fw-bold mb-3">{{ event.location }}</h5>
                <p v-if="event.address" class="mb-3">
                  <LucideIcon icon="mdi:map-marker" class="me-2" />
                  {{ event.address }}
                </p>
                <p v-if="event.venue_details" class="text-muted">
                  {{ event.venue_details }}
                </p>
              </div>
            </div>
            <div class="col-lg-6">
              <!-- Placeholder for map - can be replaced with actual map integration -->
              <div class="bg-light rounded p-4 text-center">
                <LucideIcon icon="mdi:map" class="fs-1 text-muted mb-2" />
                <p class="text-muted">Interactive map coming soon</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEvents } from '@/composables/useEvents'
import { useImageUrl } from '@/composables/useImageUrl'
import DynamicContent from '@/components/DynamicContent.vue'
import LucideIcon from '@/components/LucideIcon.vue'

const route = useRoute()
const slug = route.params.slug

const { getEventBySlug, registerForEvent } = useEvents()
const { getImageUrl } = useImageUrl()

const event = ref(null)
const loading = ref(true)
const error = ref(null)
const registering = ref(false)


// Computed properties
const registrationProgress = computed(() => {
  if (!event.value?.capacity || !event.value?.registered_count) return 0
  return Math.round((event.value.registered_count / event.value.capacity) * 100)
})

const isEventFull = computed(() => {
  return event.value?.capacity && event.value?.registered_count >= event.value?.capacity
})

// Fetch event data
const fetchEventData = async () => {
  try {
    loading.value = true
    error.value = null
    
    const eventData = await getEventBySlug(slug)
    if (eventData) {
      event.value = {
        ...eventData,
        coverImageUrl: getImageUrl(eventData.image, '/placeholder-event.jpg')
      }
    } else {
      error.value = { message: 'Event not found' }
    }
  } catch (err) {
    error.value = err
  } finally {
    loading.value = false
  }
}

// Actions
const registerForEventAction = async () => {
  if (!event.value) return
  
  try {
    registering.value = true
    await registerForEvent(event.value.id)
    // Update registered count
    event.value.registered_count = (event.value.registered_count || 0) + 1
    alert('Successfully registered for the event!')
  } catch (err) {
    alert('Failed to register for the event. Please try again.')
    console.error('Registration error:', err)
  } finally {
    registering.value = false
  }
}

const shareEvent = () => {
  if (navigator.share && event.value) {
    navigator.share({
      title: event.value.title,
      text: event.value.short_description || event.value.description,
      url: window.location.href
    }).catch(console.error)
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(window.location.href)
    alert('Event link copied to clipboard!')
  }
}

const retryFetch = () => {
  fetchEventData()
}

// Utility functions
const getStatusBadgeClass = (status) => {
  const statusClasses = {
    upcoming: 'bg-success',
    ongoing: 'bg-warning text-dark',
    completed: 'bg-secondary',
    cancelled: 'bg-danger'
  }
  return statusClasses[status] || 'bg-success'
}

const formatDate = (date) => {
  if (!date) return 'TBA'
  
  try {
    const eventDate = new Date(date)
    return eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    return date
  }
}

// Lifecycle
onMounted(() => {
  fetchEventData()
})

// SEO
useHead(() => ({
  title: event.value?.title || 'Event Details',
  meta: [
    {
      name: 'description',
      content: event.value?.short_description || event.value?.description || 'Event details and registration'
    }
  ]
}))
</script>

<style scoped>
.event-detail {
  min-height: 100vh;
}

.loading-state,
.error-state {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.event-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 0 0 2rem 2rem;
}

.cover-image img {
  border-radius: 1rem;
}

.speaker-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.speaker-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.agenda-timeline {
  position: relative;
}

.agenda-timeline::before {
  content: '';
  position: absolute;
  left: 70px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e9ecef;
}

.agenda-item {
  position: relative;
  padding-left: 1rem;
}

.agenda-time {
  position: relative;
  z-index: 1;
}

.section-header {
  text-align: center;
}

.section-header h2 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  font-style: italic;
}

.max-w-800 {
  max-width: 800px;
}

.max-w-700 {
  max-width: 700px;
}

@media (max-width: 768px) {
  .cover-image .row {
    flex-direction: column-reverse;
  }
  
  .agenda-timeline::before {
    left: 30px;
  }
  
  .meta-item {
    font-size: 0.9rem !important;
  }
}
</style>
