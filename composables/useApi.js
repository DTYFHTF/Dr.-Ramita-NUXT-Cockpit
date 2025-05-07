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

export function postContentItem(collection, data) {
  const config = useRuntimeConfig();
  const baseUrl = `${config.public.cockpitUrl}/api/content/item/${collection}`;
  const headers = {
    Authorization: config.cockpitToken,
  };

  return useFetch(baseUrl, {
    method: 'POST',
    headers,
    body: {
      data,
      token: config.cockpitToken,
    },
    async onResponseError({ response }) {
      console.error('API Error:', response.status, response._data);
    },
  });
}