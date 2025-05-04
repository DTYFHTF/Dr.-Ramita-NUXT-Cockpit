// composables/useApi.js
export function useApi(endpoint) {
  const config = useRuntimeConfig()
  const baseUrl = `${config.public.cockpitUrl}/api/content`
  const headers = {
    Authorization: config.cockpitToken,
  }

  const { data, error, pending } = useFetch(`${baseUrl}/${endpoint}`, { 
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