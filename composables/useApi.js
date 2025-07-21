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

// Google Auth: Redirect to backend for Google login
export function loginWithGoogle() {
  const config = useRuntimeConfig();
  // Adjust this URL to match your Laravel backend's Google auth route
  const googleAuthUrl = `${config.public.apiBase}/auth/google/redirect`;
  window.location.href = googleAuthUrl;
}