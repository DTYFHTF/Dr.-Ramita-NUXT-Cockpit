export default defineNuxtPlugin(() => {
    const api = {
      get: (endpoint: string, options = {}) =>
        $fetch(`/api/${endpoint}`, {
          method: 'GET',
          ...options,
        }),
      post: (endpoint: string, body: any, options = {}) =>
        $fetch(`/api/${endpoint}`, {
          method: 'POST',
          body,
          ...options,
        }),
      // Add put/delete if needed
    }
  
    return {
      provide: {
        api,
      },
    }
  })
  