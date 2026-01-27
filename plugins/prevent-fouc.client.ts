export default defineNuxtPlugin((nuxtApp) => {
  // Remove the initial opacity transition once Nuxt is fully loaded
  nuxtApp.hook('app:mounted', () => {
    // Add class to indicate Nuxt is loaded
    document.body.classList.add('nuxt-loaded');
    
    // Remove the inline style after transition completes
    setTimeout(() => {
      const inlineStyle = document.querySelector('head style[type="text/css"]');
      if (inlineStyle?.textContent?.includes('body.nuxt-loaded')) {
        // Keep the styles but remove opacity transition after first load
        const styleContent = inlineStyle.textContent.replace('body{opacity:0;transition:opacity 0.2s ease-in}', '');
        inlineStyle.textContent = styleContent;
      }
    }, 250);
  });
});
