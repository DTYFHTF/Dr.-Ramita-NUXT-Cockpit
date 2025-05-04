export default defineNuxtConfig({
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
  ],
  build: {
    transpile: ["bootstrap"],
  },
  app: {
    head: {
      link: [
        { rel: 'icon', href: '/favicon.ico' },
      ],
    },
  },
  compatibilityDate: "2025-04-27",
  modules: [
    '@pinia/nuxt' // Must be in modules array
  ],
  pinia: {
    autoImports: [
      'defineStore', // Required
      'acceptHMRUpdate', // Optional
      'storeToRefs' // Required for destructuring
    ]
  },
  runtimeConfig: {
    public: {
      cockpitUrl: process.env.NUXT_COCKPIT_URL,
    },
    cockpitToken: process.env.NUXT_COCKPIT_TOKEN
  }
});