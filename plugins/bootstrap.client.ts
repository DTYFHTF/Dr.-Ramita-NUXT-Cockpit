import 'bootstrap/dist/js/bootstrap.bundle.min.js'

export default defineNuxtPlugin(() => {
  // Optional: Initialize Bootstrap components here if needed
  return {
    provide: {
      bootstrap: () => {} // Optional: Expose bootstrap methods if needed
    }
  }
})