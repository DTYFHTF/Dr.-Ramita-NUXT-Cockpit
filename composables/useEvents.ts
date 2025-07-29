// composables/useEvents.ts
import { useApiLaravel } from './useApi'

interface Event {
  id: number
  title: string
  description: string
  short_description?: string
  date: string
  time: string
  location: string
  price: number
  capacity: number
  registered_count: number
  image: string
  slug: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  category: string
  tags: string[]
}

export function useEvents() {
  // Get all events with optional pagination and filters
  const getEvents = (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = queryString ? `events?${queryString}` : 'events'
    return useApiLaravel(endpoint)
  }

  // Get single event by slug or ID
  const getEventBySlug = async (slugOrId: string) => {
    try {
      const config = useRuntimeConfig()
      const baseUrl = config.public.apiBase
      
      const response = await $fetch(`${baseUrl}/events/${slugOrId}`, {
        headers: {
          'Accept': 'application/json'
        }
      }) as any
      
      return response?.data || response
    } catch (error) {
      console.error('Error fetching event:', error)
      throw error
    }
  }

  // Get featured/upcoming events
  const getFeaturedEvents = (limit = 6) => {
    return useApiLaravel(`events/featured?limit=${limit}`)
  }

  // Register for an event
  const registerForEvent = async (eventId: number, registrationData: {
    name: string
    email: string
    phone: string
  }) => {
    const config = useRuntimeConfig()
    const baseUrl = config.public.apiBase

    return await $fetch(`${baseUrl}/event-registrations`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: {
        event_id: eventId,
        ...registrationData
      }
    })
  }

  // Get user's event registrations
  const getUserRegistrations = (userId: number) => {
    return useApiLaravel(`users/${userId}/event-registrations`)
  }

  // Cancel event registration
  const cancelRegistration = async (registrationId: number) => {
    const config = useRuntimeConfig()
    const baseUrl = config.public.apiBase

    return await $fetch(`${baseUrl}/event-registrations/${registrationId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
  }

  return {
    getEvents,
    getEventBySlug,
    getFeaturedEvents,
    registerForEvent,
    getUserRegistrations,
    cancelRegistration
  }
}

// Utility functions for events
export function useEventUtils() {
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatEventTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const date = new Date()
    date.setHours(parseInt(hours), parseInt(minutes))
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getEventStatus = (event: Event) => {
    const now = new Date()
    const eventDate = new Date(event.date)
    
    if (event.status === 'cancelled') return 'cancelled'
    if (eventDate < now) return 'completed'
    if (eventDate.toDateString() === now.toDateString()) return 'ongoing'
    return 'upcoming'
  }

  const isEventFull = (event: Event) => {
    return event.registered_count >= event.capacity
  }

  const canRegisterForEvent = (event: Event) => {
    return event.status === 'upcoming' && !isEventFull(event)
  }

  const getEventStatusBadgeClass = (status: string) => {
    const classes: { [key: string]: string } = {
      upcoming: 'bg-success',
      ongoing: 'bg-warning text-dark',
      completed: 'bg-secondary',
      cancelled: 'bg-danger'
    }
    return classes[status] || 'bg-secondary'
  }

  const getAgendaTypeBadge = (type: string) => {
    const classes: { [key: string]: string } = {
      session: 'bg-primary',
      break: 'bg-warning text-dark',
      networking: 'bg-info',
      workshop: 'bg-success'
    }
    return classes[type] || 'bg-secondary'
  }

  const shareEvent = (event: Event) => {
    const url = `${window.location.origin}/event/${event.slug}`
    
    if (navigator.share) {
      return navigator.share({
        title: event.title,
        text: event.short_description || event.description,
        url: url
      })
    } else {
      // Fallback: copy to clipboard
      return navigator.clipboard.writeText(url).then(() => {
        // You can show a toast notification here
        console.log('Event link copied to clipboard!')
        return true
      }).catch(() => {
        console.error('Failed to copy to clipboard')
        return false
      })
    }
  }

  return {
    formatEventDate,
    formatEventTime,
    getEventStatus,
    isEventFull,
    canRegisterForEvent,
    getEventStatusBadgeClass,
    getAgendaTypeBadge,
    shareEvent
  }
}
