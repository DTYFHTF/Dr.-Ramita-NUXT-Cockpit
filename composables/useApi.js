// composables/useApi.js

import { useRuntimeConfig } from '#imports'
import { useFetch } from '#app'


export function useApiLaravel(endpoint) {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBase // e.g., http://localhost:8000/api

  const headers = {
    Accept: 'application/json'
    // Add Authorization if needed
  }

  const { data, error, pending } = useFetch(`${baseUrl}/${endpoint}`, {
    headers,
    onResponseError({ response }) {
      console.error('API Error:', response.status, response._data)
    }
  })

  return {
    data,
    error,
    loading: pending
  }
}

export function postBookingLaravel(data) {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase; // e.g., http://localhost:8000/api
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    // Add Authorization if your Laravel API requires it
  };

  return useFetch(`${baseUrl}/consultations`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data), // Ensure JSON body for Laravel
    onResponseError({ response }) {
      console.error('API Error:', response.status, response._data);
    }
  });
}

// Authenticated API composable for dashboard and protected routes
export function useAuthApi() {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBase

  const getAuthHeaders = (token) => ({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  })

  const get = async (endpoint, token) => {
    return await $fetch(`${baseUrl}/${endpoint}`, {
      method: 'GET',
      headers: getAuthHeaders(token)
    })
  }

  const post = async (endpoint, token, body = {}) => {
    return await $fetch(`${baseUrl}/${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(body)
    })
  }

  const put = async (endpoint, token, body = {}) => {
    return await $fetch(`${baseUrl}/${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(body)
    })
  }

  const del = async (endpoint, token) => {
    return await $fetch(`${baseUrl}/${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    })
  }

  return {
    get,
    post,
    put,
    delete: del
  }
}

// Google Auth: Redirect to backend for Google login
export function loginWithGoogle() {
  const config = useRuntimeConfig();
  // Adjust this URL to match your Laravel backend's Google auth route
  const googleAuthUrl = `${config.public.apiBase}/auth/google/redirect`;
  window.location.href = googleAuthUrl;
}