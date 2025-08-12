export default defineNuxtPlugin(() => {
  // Handle dynamic import errors
  if (process.client) {
    // Catch unhandled promise rejections (like failed dynamic imports)
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason;
      
      // Check if it's a dynamic import error
      if (error && typeof error === 'object' && 
          (error.message?.includes('Failed to fetch dynamically imported module') ||
           error.message?.includes('Loading chunk') ||
           error.message?.includes('Loading CSS chunk'))) {
        
        console.warn('Dynamic import error caught, reloading page:', error.message);
        
        // Prevent the error from appearing in console
        event.preventDefault();
        
        // Force a page reload to clear the stale module cache
        window.location.reload();
      }
    });

    // Also handle errors during navigation
    const router = useRouter();
    
    router.beforeEach((to, from, next) => {
      // Clear any stale module cache before navigation
      if (window.performance && window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD) {
        // This is a back/forward navigation, which often causes the issue
        console.log('Back/forward navigation detected, clearing module cache');
      }
      next();
    });

    // Handle router errors
    router.onError((error) => {
      if (error.message?.includes('Failed to fetch dynamically imported module')) {
        console.warn('Router error for dynamic import, reloading:', error.message);
        window.location.reload();
      }
    });
  }
});
