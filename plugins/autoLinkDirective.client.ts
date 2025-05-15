import { autoLinkContent } from '@/composables/autoLinkParser';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('auto-link', {
    async beforeMount(el) {
      if (el.innerHTML) {
        console.log('Original content before parsing:', el.innerHTML); // Debugging log
        const originalContent = el.innerHTML;
        const linkedContent = await autoLinkContent(originalContent);
        console.log('Linked content after parsing:', linkedContent); // Debugging log
        el.innerHTML = linkedContent;
      }
    },
    async updated(el) {
      if (el.innerHTML) {
        console.log('Original content before parsing (updated):', el.innerHTML); // Debugging log
        const originalContent = el.innerHTML;
        const linkedContent = await autoLinkContent(originalContent);
        console.log('Linked content after parsing (updated):', linkedContent); // Debugging log
        el.innerHTML = linkedContent;
      }
    },
  });
});
