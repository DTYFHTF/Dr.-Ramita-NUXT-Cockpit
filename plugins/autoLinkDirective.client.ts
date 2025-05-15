import { autoLinkContent } from '@/composables/autoLinkParser';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('auto-link', {
    async beforeMount(el) {
      if (el.innerHTML) {
        const originalContent = el.innerHTML;
        const linkedContent = await autoLinkContent(originalContent);
        el.innerHTML = linkedContent;
      }
    },
    async updated(el) {
      if (el.innerHTML) {
        const originalContent = el.innerHTML;
        const linkedContent = await autoLinkContent(originalContent);
        el.innerHTML = linkedContent;
      }
    },
  });
});
