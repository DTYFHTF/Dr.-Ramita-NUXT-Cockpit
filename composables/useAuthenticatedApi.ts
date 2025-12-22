/**
 * Enhanced API Composable with Token Refresh
 * 
 * Provides automatic token refresh on 401 errors
 * and better authentication flow
 */

export function useAuthenticatedApi() {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBase
  const userStore = useUserStore()
  const { handleError, isAuthError } = useApiError()

  let isRefreshing = false
  let refreshSubscribers: Array<(token: string) => void> = []

  /**
   * Add request to queue waiting for token refresh
   */
  const subscribeTokenRefresh = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback)
  }

  /**
   * Notify all waiting requests that token has been refreshed
   */
  const onTokenRefreshed = (token: string) => {
    refreshSubscribers.forEach(callback => callback(token))
    refreshSubscribers = []
  }

  /**
   * Attempt to refresh the authentication token
   */
  const refreshToken = async (): Promise<string | null> => {
    try {
      // Assuming you have a refresh token endpoint
      // Adjust based on your Laravel authentication setup
      const response = await $fetch<any>(`${baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userStore.token}`
        },
        credentials: 'include'
      })

      if (response?.token) {
        userStore.setToken(response.token)
        return response.token
      }

      return null
    } catch (error) {
      console.error('Token refresh failed:', error)
      // If refresh fails, logout user
      userStore.logout()
      if (import.meta.client) {
        navigateTo('/login')
      }
      return null
    }
  }

  /**
   * Make authenticated API request with automatic retry on 401
   */
  const makeRequest = async <T = any>(
    endpoint: string,
    options: RequestInit & { retry?: boolean } = {}
  ): Promise<T> => {
    const { retry = true, ...fetchOptions } = options

    // Add auth token to headers
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }

    // Merge existing headers if any
    if (fetchOptions.headers) {
      Object.assign(headers, fetchOptions.headers)
    }

    if (userStore.token) {
      headers['Authorization'] = `Bearer ${userStore.token}`
    }

    try {
      const response = await $fetch<T>(`${baseUrl}/${endpoint}`, {
        ...fetchOptions,
        headers,
        credentials: 'include'
      })

      return response
    } catch (error: any) {
      // Handle 401 Unauthorized errors
      if (isAuthError(error) && retry && userStore.token) {
        if (!isRefreshing) {
          isRefreshing = true

          try {
            const newToken = await refreshToken()
            isRefreshing = false

            if (newToken) {
              onTokenRefreshed(newToken)
              
              // Retry the original request with new token
              return makeRequest<T>(endpoint, { ...options, retry: false })
            }
          } catch (refreshError) {
            isRefreshing = false
            throw refreshError
          }
        } else {
          // Wait for token refresh to complete
          return new Promise((resolve, reject) => {
            subscribeTokenRefresh((token: string) => {
              // Retry with new token
              makeRequest<T>(endpoint, { ...options, retry: false })
                .then(resolve)
                .catch(reject)
            })
          })
        }
      }

      // Handle other errors
      handleError(error)
      throw error
    }
  }

  /**
   * Convenience methods for different HTTP verbs
   */
  const get = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    return makeRequest<T>(endpoint, { ...options, method: 'GET' })
  }

  const post = async <T = any>(endpoint: string, body?: any, options: RequestInit = {}): Promise<T> => {
    return makeRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined
    })
  }

  const put = async <T = any>(endpoint: string, body?: any, options: RequestInit = {}): Promise<T> => {
    return makeRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined
    })
  }

  const del = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    return makeRequest<T>(endpoint, { ...options, method: 'DELETE' })
  }

  const patch = async <T = any>(endpoint: string, body?: any, options: RequestInit = {}): Promise<T> => {
    return makeRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined
    })
  }

  return {
    get,
    post,
    put,
    delete: del,
    patch,
    makeRequest
  }
}
