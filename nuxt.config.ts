import commonjs from 'vite-plugin-commonjs';

export default defineNuxtConfig({
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "@/assets/scss/main.scss" // Adding our global SCSS file
  ],
  plugins: [
    { src: '~/plugins/bootstrap.client.ts', mode: 'client' }
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