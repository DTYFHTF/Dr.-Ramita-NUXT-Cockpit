<template>
  <div v-if="error" class="error-boundary">
    <div class="error-container">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h2 class="error-title">{{ errorTitle }}</h2>
      <p class="error-message">{{ errorMessage }}</p>
      <div class="error-actions">
        <button @click="retry" class="btn-retry">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Try Again
        </button>
        <button v-if="showReportButton" @click="reportError" class="btn-report">
          Report Issue
        </button>
      </div>
      <details v-if="showDetails" class="error-details">
        <summary>Technical Details</summary>
        <pre>{{ errorDetails }}</pre>
      </details>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, computed } from 'vue'

interface Props {
  fallbackTitle?: string
  fallbackMessage?: string
  showDetails?: boolean
  showReportButton?: boolean
  onError?: (error: Error) => void
  onRetry?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  fallbackTitle: 'Something went wrong',
  fallbackMessage: 'We encountered an unexpected error. Please try again.',
  showDetails: false,
  showReportButton: false
})

const error = ref<Error | null>(null)
const errorInfo = ref<any>(null)

const errorTitle = computed(() => {
  if (error.value?.message?.includes('Failed to fetch')) {
    return 'Connection Error'
  }
  if (error.value?.message?.includes('timeout')) {
    return 'Request Timeout'
  }
  return props.fallbackTitle
})

const errorMessage = computed(() => {
  if (error.value?.message?.includes('Failed to fetch')) {
    return 'Unable to connect to the server. Please check your internet connection.'
  }
  if (error.value?.message?.includes('timeout')) {
    return 'The request took too long. Please try again.'
  }
  return props.fallbackMessage
})

const errorDetails = computed(() => {
  return {
    message: error.value?.message,
    stack: error.value?.stack,
    info: errorInfo.value,
    timestamp: new Date().toISOString()
  }
})

// Capture errors from child components
onErrorCaptured((err: Error, instance, info) => {
  error.value = err
  errorInfo.value = info

  // Log error to console in development
  if (import.meta.dev) {
    console.error('ErrorBoundary caught error:', err)
    console.error('Component info:', info)
    console.error('Instance:', instance)
  }

  // Call custom error handler if provided
  if (props.onError) {
    props.onError(err)
  }

  // Prevent error from propagating
  return false
})

const retry = () => {
  error.value = null
  errorInfo.value = null
  
  if (props.onRetry) {
    props.onRetry()
  }
}

const reportError = () => {
  // TODO: Integrate with error reporting service (Sentry, LogRocket, etc.)
  console.log('Reporting error:', errorDetails.value)
  
  // Example: Send to API endpoint
  // $fetch('/api/errors/report', {
  //   method: 'POST',
  //   body: errorDetails.value
  // })
}
</script>

<style scoped>
.error-boundary {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--surface-muted);
}

.error-container {
  max-width: 500px;
  text-align: center;
  background: white;
  padding: 3rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.error-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  color: #ef4444;
}

.error-icon svg {
  width: 100%;
  height: 100%;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.error-message {
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-retry,
.btn-report {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
}

.btn-retry {
  background: #3b82f6;
  color: white;
}

.btn-retry:hover {
  background: #2563eb;
}

.btn-retry svg {
  width: 20px;
  height: 20px;
}

.btn-report {
  background: #f3f4f6;
  color: #374151;
}

.btn-report:hover {
  background: #e5e7eb;
}

.error-details {
  margin-top: 2rem;
  text-align: left;
  background: #f9fafb;
  border-radius: 8px;
  padding: 1rem;
}

.error-details summary {
  cursor: pointer;
  font-weight: 600;
  color: #6b7280;
  user-select: none;
}

.error-details pre {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #374151;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
