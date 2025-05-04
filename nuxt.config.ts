// nuxt.config.ts
export default defineNuxtConfig({
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    // "@/assets/scss/main.scss" // Add this if you have main SCSS file
  ],
  plugins: [
    { src: '~/plugins/bootstrap.client.ts', mode: 'client' }
  ],
  
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/scss/variables" as *;
          `
        }
      }
    }
  },
  build: {
    transpile: ["bootstrap"],
  },
  app: {
    head: {
      link: [
        { rel: 'icon', href: '/favicon.ico' },
      ],
    }
  },
  modules: [
    '@pinia/nuxt'
  ],
  pinia: {
    autoImports: [
      'defineStore',
      'acceptHMRUpdate',
      'storeToRefs'
    ]
  },
  runtimeConfig: {
    public: {
      cockpitUrl: process.env.NUXT_COCKPIT_URL,
    },
    cockpitToken: process.env.NUXT_COCKPIT_TOKEN
  }
});