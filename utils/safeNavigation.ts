/**
 * Safe navigation utility to handle dynamic import errors
 */
export const safeNavigateTo = async (url: string, options: any = {}) => {
  try {
    return await navigateTo(url, options);
  } catch (error: any) {
    // Check if it's a dynamic import error
    if (error.message?.includes('Failed to fetch dynamically imported module')) {
      console.warn('Dynamic import error during navigation, reloading page');
      // Force page reload as fallback
      window.location.href = url;
      return;
    }
    // Re-throw other errors
    throw error;
  }
};

/**
 * Enhanced router push with error handling
 */
export const safePush = async (url: string) => {
  const router = useRouter();
  try {
    return await router.push(url);
  } catch (error: any) {
    if (error.message?.includes('Failed to fetch dynamically imported module')) {
      console.warn('Dynamic import error during router push, using window.location');
      window.location.href = url;
      return;
    }
    throw error;
  }
};

/**
 * Safe link component that handles dynamic import errors
 */
export const SafeNuxtLink = defineComponent({
  props: {
    to: String,
    external: Boolean
  },
  setup(props, { slots }) {
    const handleClick = async (event: Event) => {
      if (props.external) return;
      
      event.preventDefault();
      await safeNavigateTo(props.to || '/');
    };

    return () => h(
      'a',
      {
        href: props.to,
        onClick: handleClick,
        style: { cursor: 'pointer' }
      },
      slots.default?.()
    );
  }
});
