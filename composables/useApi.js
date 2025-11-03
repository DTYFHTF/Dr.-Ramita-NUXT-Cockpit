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
    credentials: 'include', // Include cookies for session/CSRF
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

// Google Auth: Redirect to Google OAuth
export async function loginWithGoogle() {
  const config = useRuntimeConfig();

  try {
    // Call the API to get the Google authorization URL
    const url = `${config.public.apiBase}/auth/google/redirect`;

    const response = await $fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        // Bypass ngrok interstitial on free tunnels
        'ngrok-skip-browser-warning': 'true'
      }
    });

    // Redirect to Google's authorization page if backend returned the URL
    if (response?.url) {
      window.location.href = response.url;
    } else {
      // If backend returned HTML (ngrok warning or error), surface it in console
      console.error('loginWithGoogle: expected JSON with url but got:', response);
    }
  } catch (error) {
    console.error('loginWithGoogle failed:', error);
  }
}