import commonjs from 'vite-plugin-commonjs';

export default defineNuxtConfig({ 
  // Add compatibility date to fix the warning
  compatibilityDate: '2025-08-12',
  
  // Add experimental features to fix dynamic import issues
  experimental: {
    payloadExtraction: false,
  },
  
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "@/assets/scss/main.scss" // Adding our global SCSS file
  ],
  plugins: [
    { src: '~/plugins/bootstrap.client.ts', mode: 'client' },
    { src: '~/plugins/autoLinkDirective.client.ts', mode: 'client' }, // Registering the autoLinkDirective plugin
    { src: '~/plugins/error-handler.client.ts', mode: 'client' } // Handle dynamic import errors
  ],

  vite: {
    plugins: [commonjs()],
    resolve: {
      alias: {
        'unist-util-visit': require.resolve('unist-util-visit'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/scss/variables" as *;
          `
        }
      }
    },
    server: {
      allowedHosts: ["74b8-152-58-194-75.ngrok-free.app"],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', '@vue/runtime-core', '@vue/runtime-dom'],
            'nuxt-vendor': ['#app', '#imports']
          }
        }
      }
    },
  },
  build: {
    transpile: ["bootstrap"],
  },
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;600;700&display=swap' }
      ],
    }
  },
  modules: [
    '@pinia/nuxt',
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
      apiBase: process.env.NUXT_LARAVEL_API_URL,
      baseUrl: process.env.NUXT_LARAVEL_BASE_URL,
      cockpitToken: process.env.NUXT_COCKPIT_TOKEN
    }
  }
});