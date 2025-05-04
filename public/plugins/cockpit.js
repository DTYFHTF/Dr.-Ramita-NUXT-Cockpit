// plugins/cockpit.js
export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    
    return {
      provide: {
        cockpit: {
          get: async (collection, query = {}) => {
            return $fetch(`${config.cockpitUrl}/api/collections/get/${collection}`, {
              params: {
                token: config.cockpitToken,
                ...query
              }
            })
          },
          save: async (collection, data) => {
            return $fetch(`${config.cockpitUrl}/api/collections/save/${collection}`, {
              method: 'POST',
              body: {
                data,
                token: config.cockpitToken
              }
            })
          }
        }
      }
    }
  })