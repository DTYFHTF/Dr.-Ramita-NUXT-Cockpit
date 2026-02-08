import commonjs from 'vite-plugin-commonjs';

// Ignore SSL certificate errors for .test domains in development
// NOTE: Disabling certificate verification is insecure. Avoid setting
// `NODE_TLS_REJECT_UNAUTHORIZED = '0'` in source. If you need to
// trust local test certificates, configure your environment or use
// a local CA instead of disabling verification globally.
// if (process.env.NODE_ENV === 'development') {
//   process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// }

export default defineNuxtConfig({ 
  // Add compatibility date to fix the warning
  compatibilityDate: '2025-08-12',
  
  // Enable SSR for better initial page load
  ssr: true,
  
  // Add experimental features to fix dynamic import issues
  experimental: {
    payloadExtraction: false,
    inlineSSRStyles: true, // Inline critical CSS to prevent FOUC
  },
  
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "@/assets/scss/main.scss", // Adding our global SCSS file
    "@/assets/css/vue-tel-input.css" // Phone input component styles (copied into assets)
  ],
  plugins: [
    { src: '~/plugins/prevent-fouc.client.ts', mode: 'client' },
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
            @use "sass:color" as color;
            @use "@/assets/scss/variables" as *;
          `
        }
      }
    },
    server: {
      allowedHosts: ["74b8-152-58-194-75.ngrok-free.app"],
      hmr: {
        overlay: true
      }
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
      style: [
        {
          children: 'body{opacity:0;transition:opacity 0.2s ease-in}body.nuxt-loaded{opacity:1}',
          type: 'text/css'
        }
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;600;700&display=swap' }
      ],
      script: [
        {
          src: 'https://checkout.razorpay.com/v1/checkout.js',
          defer: true
        }
      ]
    }
  },
  modules: [
    '@pinia/nuxt',
    '@nuxt/image',
  ],
  image: {
    quality: 80,
    format: ['webp', 'jpg', 'png'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },
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
      cockpitToken: process.env.NUXT_COCKPIT_TOKEN,
      razorpayKeyId: process.env.NUXT_RAZORPAY_KEY_ID,
    }
  },
  nitro: {
    // Disable SSL verification for local development with .test domains
    experimental: {
      nodeFetch: true
    },
    routeRules: {
      '/**': {
        headers: {
          'NODE_TLS_REJECT_UNAUTHORIZED': '0'
        }
      }
    }
  },
  hooks: {
    // Disable SSL certificate verification for .test domains in development
    'nitro:init': (nitro) => {
      if (process.env.NODE_ENV === 'development') {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
      }
    }
  }
});