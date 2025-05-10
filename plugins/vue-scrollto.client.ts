import VueScrollTo from 'vue-scrollto';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueScrollTo, {
    duration: 500,
    easing: 'ease',
    offset: -50, // Adjust offset to ensure the title is fully visible
  });
});