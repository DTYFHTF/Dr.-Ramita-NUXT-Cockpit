<template>
  <div class="event-detail">
    <!-- Enhanced Loading State -->
    <div v-if="loading && !event" class="loading-state text-center py-9">
      <div class="spinner-grow " style="width: 3rem; height: 3rem" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-4 text-muted fs-5">Loading event details...</p>
    </div>

    <!-- Enhanced Error State -->
    <div v-else-if="error && !event" class="error-state text-center py-9">
      <div class="alert alert-danger mx-auto p-4 shadow-sm" style="max-width: 500px">
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
      <!-- Event Header -->




      <!-- Main Content Layout -->
      <div class="container">
        <div class="row g-4">
          <!-- Left Column: Event Details -->
          <div class="col-lg-8">

            <div class="event-header pt-3">
              <div class="container">
                <div class="d-flex align-items-center justify-content-between">
                  <h1 class="event-title display-4 fw-bold mb-4 mb-lg-0">{{ event.title }}</h1>
                  <button class="btn btn-link p-0 ms-2" @click="shareEvent" title="Share Event">
                    <LucideIcon icon="mdi:share-variant" class="fs-3 text-muted" />
                  </button>
                </div>
                <p class="event-description lead mb-4 text-muted">
                  <DynamicContent :content="event.short_description || event.description || ''" />
                </p>
              </div>
            </div>
            <!-- Event Image -->
            <div v-if="event.image" class="event-image-section mb-2">
              <div class="container">
                <div class="image-container">
                  <img :src="event.coverImageUrl" :alt="event.title" class="event-image img-fluid" loading="lazy" />
                </div>
              </div>
            </div>
            <!-- Event Description -->
            <section v-if="event.description" class="content-section mb-5">
              <div class="section-card">
                <h2 class="section-title">
                  <LucideIcon icon="mdi:information" class="me-2 " />
                  About This Event
                </h2>
                <div class="content-body">
                  <DynamicContent :content="event.description" />
                </div>
              </div>
            </section>

            <!-- Enhanced Speakers Section -->
            <section v-if="event.speakers && event.speakers.length" class="content-section mb-5">
              <div class="section-card">
                <h2 class="section-title">
                  <LucideIcon icon="mdi:account-group" class="me-2 " />
                  Featured Speakers
                </h2>
                <p class="section-subtitle mb-4">Meet our expert presenters</p>

                <div class="speakers-grid">
                  <div v-for="speaker in event.speakers" :key="speaker.id" class="speaker-tile">
                    <div class="speaker-avatar">
                      <img
                        :src="getImageUrl(speaker.avatar, '/placeholder-speaker.jpg')"
                        :alt="speaker.name"
                        class="avatar-image"
                        loading="lazy"
                        @error="event => event.target.src = '/placeholder-speaker.jpg'"
                      />
                    </div>

                    <div class="speaker-info">
                      <h4 class="speaker-name">{{ speaker.name }}</h4>
                      <p class="speaker-title">{{ speaker.title }}</p>
                      <p class="speaker-bio">{{ speaker.bio }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Enhanced Agenda Section -->
            <section v-if="event.agenda && event.agenda.length" class="content-section mb-5">
              <div class="section-card">
                <h2 class="section-title">
                  <LucideIcon icon="mdi:clock-outline" class="me-2 " />
                  Event Agenda
                </h2>
                <p class="section-subtitle mb-4">Detailed schedule and timeline</p>

                <div class="agenda-list">
                  <div v-for="(item, index) in event.agenda" :key="index" class="agenda-item">
                    <div class="agenda-time">{{ item.time }}</div>
                    <div class="agenda-content">
                      <h5 class="agenda-title">{{ item.title }}</h5>
                      <p class="agenda-description">{{ item.description }}</p>
                      <div v-if="item.speaker" class="agenda-speaker">
                        Speaker: {{ item.speaker }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Enhanced Features Section -->
            <section v-if="event.facilities && event.facilities.length" class="content-section mb-5">
              <div class="section-card">
                <h2 class="section-title">
                  <LucideIcon icon="mdi:star" class="me-2 " />
                  What's Included
                </h2>
                <p class="section-subtitle mb-4">Everything you get with your registration</p>

                <div class="features-list">
                  <div v-for="facility in event.facilities" :key="facility" class="feature-chip">
                    <LucideIcon icon="mdi:check" class="check-icon" />
                    <span>{{ facility }}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- Right Column: Registration Panel -->
          <div class="col-lg-4">
            <div class="registration-panel sticky-top">
              <!-- Registration Card -->
              <div class="registration-card">
                <!-- Event Details -->
                <div class="event-details">
                  <div class="detail-item">
                    <LucideIcon icon="mdi:calendar" class="detail-icon" />
                    <span>{{ formatDate(event.date) }}</span>
                  </div>
                  <div class="add-calendar-section" style="padding: 0.5rem 0 0.5rem 2.2rem;">
                    <button class="btn btn-outline-secondary btn-sm" @click="addToCalendar">
                      <LucideIcon icon="mdi:calendar-plus" class="me-1" /> Add to Calendar
                    </button>
                  </div>

                  <div class="detail-item">
                    <LucideIcon icon="mdi:clock" class="detail-icon" />
                    <span>{{ event.time || '6:00 PM' }}</span>
                  </div>


                  <div class="detail-item">
                    <LucideIcon icon="mdi:account-group" class="detail-icon" />
                    <span>{{ event.age_limit + 'yrs +' || 'Age Limit - 18yrs +' }}</span>
                  </div>

                  <div class="detail-item">
                    <LucideIcon icon="mdi:translate" class="detail-icon" />
                    <span>{{ event.language || 'Hindi, English' }}</span>
                  </div>

                  <div class="detail-item">
                    <LucideIcon icon="mdi:tag" class="detail-icon" />
                    {{ (event.tags && event.tags.length) ? event.tags.join(', ') : 'Yoga' }}
                  </div>

                  <div class="detail-item">
                    <LucideIcon icon="mdi:map-marker" class="detail-icon" />
                    <span>
                      {{ event.location_type === 'physical' ? (event.location || 'Venue address TBA') : 'Online Zoom Conference' }}
                    </span>
                  </div>

                </div>

                <!-- Pricing and Booking -->
                <div class="booking-section">
                  <!-- Show registration status if already registered -->
                  <template v-if="userRegistration">
                    <div class="alert alert-success mb-3">
                      <LucideIcon icon="mdi:check-circle" class="me-2" />
                      You're registered for this event!
                    </div>
                    <button class="book-now-btn" @click="navigateTo('/dashboard?tab=events')">
                      View My Events
                    </button>
                  </template>

                  <!-- Show booking option if not registered -->
                  <template v-else>
                    <div class="price-section">
                      <span class="price">₹{{ event.price || '499' }}</span>
                      <span class="filling-fast">Filling Fast</span>
                    </div>

                    <template v-if="event.status === 'upcoming' && !isEventFull">
                      <button class="book-now-btn" @click="showRegistration = true">Book Now</button>
                    
                      <!-- Registration Form Modal -->
                      <BaseModal :show="showRegistration" @close="showRegistration = false">
                        <div class="modal-narrow">
                          <EventRegistrationForm 
                            :event-slug="event.slug" 
                            @registration-success="handleRegistrationSuccess"
                          />
                        </div>
                      </BaseModal>
                      
                      <!-- Success Modal -->
                      <SuccessModal
                        :show="registrationSuccess"
                        type="registration"
                        :message="successMessage"
                        action-text="Manage Your Events"
                        @close="handleSuccessModalClose"
                      />
                    </template>

                    <button v-else-if="isEventFull" class="book-now-btn disabled" disabled>
                      Event Full
                    </button>

                    <button v-else-if="event.status === 'completed'" class="book-now-btn disabled" disabled>
                      Event Completed
                    </button>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
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
import EventRegistrationForm from '@/components/EventRegistrationForm.vue'
import BaseModal from '@/components/BaseModal.vue'
import SuccessModal from '@/components/SuccessModal.vue'

const showRegistration = ref(false)
const registrationSuccess = ref(false)
const successMessage = ref('')

// Handle successful registration
const handleRegistrationSuccess = (response) => {
  showRegistration.value = false; // Close the registration modal
  registrationSuccess.value = true; // Show success modal
  successMessage.value = response?.message || 'Successfully registered!';
}

// Handle success modal close - redirect to dashboard
const handleSuccessModalClose = () => {
  registrationSuccess.value = false;
  navigateTo('/dashboard?tab=events');
}

const route = useRoute()
const slug = route.params.slug

const { getEventBySlug, registerForEvent } = useEvents()
const { getImageUrl } = useImageUrl()
const { useUserStore } = await import('@/stores/user')
const userStore = useUserStore()

const event = ref(null)
const loading = ref(true)
const error = ref(null)
const registering = ref(false)
const userRegistration = ref(null) // Track if user is already registered


// Computed properties
const registrationProgress = computed(() => {
  if (!event.value?.capacity || !event.value?.registered_count) return 0
  return Math.round((event.value.registered_count / event.value.capacity) * 100)
})

const isEventFull = computed(() => {
  return event.value?.capacity && event.value?.registered_count >= event.value?.capacity
})

const spotsRemaining = computed(() => {
  if (!event.value?.capacity) return null
  return Math.max(0, event.value.capacity - (event.value.registered_count || 0))
})

// Check if user is already registered for this event
const checkUserRegistration = async () => {
  if (!userStore.token || !event.value) return

  try {
    const config = useRuntimeConfig()
    const result = await $fetch(`${config.public.apiBase}/user/events`, {
      headers: {
        Authorization: `Bearer ${userStore.token}`,
        Accept: 'application/json'
      }
    })

    if (result?.success && result.data) {
      userRegistration.value = result.data.find(
        (reg) => reg.slug === event.value.slug
      )
      
      // Don't redirect - let user view event details even if already registered
    }
  } catch (err) {
    console.error('Error checking registration:', err)
  }
}

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
      
      // Check if user is already registered
      await checkUserRegistration()
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

const addToCalendar = () => {
  if (!event.value) return

  const startDate = new Date(event.value.date)
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000) // 2 hours duration

  const calendarEvent = {
    title: event.value.title,
    start: startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
    end: endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
    description: event.value.description,
    location: event.value.location
  }

  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarEvent.title)}&dates=${calendarEvent.start}/${calendarEvent.end}&details=${encodeURIComponent(calendarEvent.description)}&location=${encodeURIComponent(calendarEvent.location)}`

  window.open(calendarUrl, '_blank')
}

const retryFetch = () => {
  fetchEventData()
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



<style lang="scss" scoped>

/* === GENERAL LAYOUT === */
.event-detail {
  min-height: 100vh;
  background: var(--background-white, #f7f9fb);
}

.loading-state,
.error-state {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}


/* === EVENT HEADER === */

.event-header {
  border-bottom: 1px solid var(--border-color);
}

.event-title {
  color: var(--color-primary);
  font-size: 2.5rem;
  line-height: 1.2;
}

.event-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-secondary, #6b7280);
}

/* Removed unused .event-meta and .meta-item classes */

/* === EVENT IMAGE === */
.event-image-section {
  padding: 1rem 0;
}

.image-container {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(var(--shadow-light-rgb), 0.1);
}

.event-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

/* === CONTENT SECTIONS === */
.content-section {
  margin-bottom: 2rem;
}


.section-card {
  /* Flattened card: remove heavy fill and shadow for primary content */
  background: transparent;
  border-radius: 6px;
  padding: 0.5rem 0 0 0;
  box-shadow: none;
  border: none;
}


.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  color: var(--color-primary);
}

.section-subtitle {
  color: var(--text-muted);
  font-size: 1rem;
  margin-bottom: 1.5rem;
}


.content-body {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-secondary, #6b7280);
}

/* === SPEAKERS === */

.speakers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

/* Compact speaker tile for better scanability */
.speaker-tile {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.03);
}

.speaker-avatar {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.speaker-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary, #e6eef8);
  margin-bottom: 0.25rem;
}

.speaker-title {
  color: var(--text-secondary, #6b7280);
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.speaker-bio {
  color: var(--text-secondary, #6b7280);
  font-size: 0.9rem;
  line-height: 1.5;
}

/* === AGENDA === */
.agenda-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.agenda-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255,255,255,0.01);
  border-radius: 8px;
}

.agenda-time {
  flex-shrink: 0;
  font-weight: 600;
  color: var(--color-primary, #0d6efd);
  min-width: 80px;
}

.agenda-content {
  flex: 1;
}

.agenda-title {
  font-weight: 600;
  color: $color-primary;
  margin-bottom: 0.25rem;
}

.agenda-description {
  color: var(--text-secondary, #6b7280);
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.agenda-speaker {
  color: var(--text-secondary, #6b7280);
  font-size: 0.85rem;
}

/* Removed unused agenda-type and progress bar classes */

.features-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.feature-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.75rem;
  background: rgba(255,255,255,0.025);
  border-radius: 999px;
  font-size: 0.9rem;
}

.check-icon {
  color: var(--accent-soft-green, #10b981);
  font-size: 1rem;
}

/* === REGISTRATION PANEL === */
.registration-panel {
  top: 2rem;
}


.registration-card {
  background: var(--background-light);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  margin-top: 1.5rem;
}

/* === EVENT DETAILS === */

.event-details {
  padding: 1.5rem;
}


.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  font-size: 0.9rem;
  color: var(--text-secondary, #6b7280);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-icon {
  color: var(--text-secondary, #6b7280);
  font-size: 1rem;
  width: 20px;
  flex-shrink: 0;
}

.other-venues {
  padding-top: 0.75rem;
}


.venue-link {
  color: $color-secondary;
  text-decoration: none;
  font-size: 0.85rem;
}

.venue-link:hover {
  text-decoration: underline;
}

/* === BOOKING SECTION === */

.booking-section {
  padding: 1.5rem;
  border-top: 1px solid var(--border-color, #e5e7eb);
  background: var(--background-light, #f7f9fb);
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}


.price {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-primary, #0d6efd);
}


.filling-fast {
  color: var(--accent-soft-green, #10b981);
  font-size: 0.8rem;
  font-weight: 500;
}


.book-now-btn {
  width: 100%;
  @include primary-button;
  border-radius: 6px;
  font-size: 1rem;
}

.book-now-btn.disabled {
  background: var(--border-color, #e5e7eb);
  color: var(--text-secondary, #6b7280);
  cursor: not-allowed;
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .event-title {
    font-size: 2rem;
  }

  .event-image {
    height: 200px;
  }

  .section-card {
    padding: 1.5rem;
  }

  .speakers-grid {
    grid-template-columns: 1fr;
  }

  .features-list {
    grid-template-columns: 1fr;
  }

  .agenda-item {
    flex-direction: column;
    gap: 0.5rem;
  }

  .agenda-time {
    min-width: auto;
  }

  .event-meta {
    flex-direction: column;
  }
}

</style>

