<template>
    <div>
      <button @click="testEndpoint" class="btn btn-primary">
        Test API Endpoint
      </button>
      <div v-if="result">
        <pre>{{ result }}</pre>
      </div>
    </div>
  </template>
  
  <script setup>
  const config = useRuntimeConfig()
  const result = ref(null)
  
  const testEndpoint = async () => {
    try {
      const url = `${config.public.cockpitUrl}/api/content/items/doctor`
      console.log('Testing URL:', url)
      
      const response = await fetch(url, {
        headers: {
          Authorization: config.cockpitToken
        }
      })
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      
      result.value = await response.json()
      console.log('Raw response:', result.value)
    } catch (error) {
      console.error('Endpoint test failed:', error)
      result.value = error.message
    }
  }
  </script>