// composables/useApi.js
import { useRuntimeConfig } from '#imports'
import { useFetch } from '#app'

export function useApi(endpoint) {
  const config = useRuntimeConfig()
  const baseUrl1 = `${config.public.cockpitUrl}/api/content`
  const headers = {
    Authorization: config.public.cockpitToken,
  }

  const { data, error, pending } = useFetch(`${baseUrl1}/${endpoint}`, { 
    headers,
    async onResponseError({ response }) {
      console.error('API Error:', response.status, response._data)
    }
  })

  return { 
    data,
    error,
    loading: pending
  }
}

export function postContentItem(collection, data) {
  const config = useRuntimeConfig();
  const baseUrl1 = `${config.public.cockpitUrl}/api/content/item/${collection}`;
  const headers = {
    Authorization: config.public.cockpitToken,
  };

  return useFetch(baseUrl1, {
    method: 'POST',
    headers,
    body: {
      data,
      token: config.public.cockpitToken,
    },
    async onResponseError({ response }) {
      console.error('API Error:', response.status, response._data);
    },
    });
}

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