/**
 * Centralized API Error Handling Composable
 * 
 * Provides consistent error handling across the application with:
 * - User-friendly error messages
 * - Error logging/monitoring hooks
 * - Automatic retry logic
 * - Error categorization
 */

interface ApiError {
  message: string
  statusCode?: number
  code?: string
  data?: any
}

interface ErrorHandlerOptions {
  showToast?: boolean
  logError?: boolean
  retryable?: boolean
}

export const useApiError = () => {
  const handleError = (error: any, options: ErrorHandlerOptions = {}): ApiError => {
    const {
      showToast = true,
      logError = true,
      retryable = false
    } = options

    // Parse error into consistent format
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      statusCode: error?.statusCode || error?.status || 500,
      code: error?.code || 'UNKNOWN_ERROR',
      data: error?.data
    }

    // Extract user-friendly message
    if (error?.data?.message) {
      apiError.message = error.data.message
    } else if (error?.message) {
      apiError.message = error.message
    }

    // Handle specific status codes
    switch (apiError.statusCode) {
      case 401:
        apiError.message = 'Please log in to continue'
        apiError.code = 'UNAUTHORIZED'
        break
      case 403:
        apiError.message = 'You do not have permission to perform this action'
        apiError.code = 'FORBIDDEN'
        break
      case 404:
        apiError.message = 'The requested resource was not found'
        apiError.code = 'NOT_FOUND'
        break
      case 422:
        // Validation errors - keep backend message
        apiError.code = 'VALIDATION_ERROR'
        break
      case 429:
        apiError.message = 'Too many requests. Please try again later'
        apiError.code = 'RATE_LIMITED'
        break
      case 500:
        apiError.message = 'Server error. Please try again later'
        apiError.code = 'SERVER_ERROR'
        break
      case 503:
        apiError.message = 'Service temporarily unavailable'
        apiError.code = 'SERVICE_UNAVAILABLE'
        break
    }

    // Log error (can be extended to send to monitoring service like Sentry)
    if (logError && process.client) {
      console.error('[API Error]', {
        code: apiError.code,
        status: apiError.statusCode,
        message: apiError.message,
        url: error?.url,
        data: apiError.data,
        timestamp: new Date().toISOString()
      })

      // TODO: Send to monitoring service (Sentry, LogRocket, etc.)
      // if (window.$sentry) {
      //   window.$sentry.captureException(error, {
      //     contexts: { apiError }
      //   })
      // }
    }

    // Show toast notification (if toast system is available)
    if (showToast && process.client) {
      // TODO: Integrate with your toast notification system
      // For now, can use console.warn
      console.warn('[User Notification]', apiError.message)
    }

    return apiError
  }

  const isRetryable = (error: any): boolean => {
    const retryableStatusCodes = [408, 429, 500, 502, 503, 504]
    const statusCode = error?.statusCode || error?.status
    return retryableStatusCodes.includes(statusCode)
  }

  const isAuthError = (error: any): boolean => {
    const statusCode = error?.statusCode || error?.status
    return statusCode === 401 || statusCode === 403
  }

  const isValidationError = (error: any): boolean => {
    const statusCode = error?.statusCode || error?.status
    return statusCode === 422
  }

  const getValidationErrors = (error: any): Record<string, string[]> => {
    return error?.data?.errors || {}
  }

  return {
    handleError,
    isRetryable,
    isAuthError,
    isValidationError,
    getValidationErrors
  }
}
