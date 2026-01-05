import { ref } from 'vue'

export function useNewsletter() {
  const newsletterEmail = ref('')
  const newsletterMessage = ref('')
  const loading = ref(false)

  async function subscribeNewsletter() {
    newsletterMessage.value = ''
    loading.value = true
    try {
      // @ts-ignore: Nuxt injects useRuntimeConfig globally
      const config = useRuntimeConfig()
      const apiBase = config.public.apiBase
      const res = await $fetch<{ message?: string }>(`${apiBase}/newsletter/subscribe`, {
        method: 'POST',
        body: { email: newsletterEmail.value },
        headers: { 'Content-Type': 'application/json' },
      })
      newsletterMessage.value = res?.message || 'Subscribed successfully!'
      newsletterEmail.value = ''
    } catch (err: any) {
      console.error('Newsletter subscription error:', err)
      // Extract error message from API response
      const errorMessage = err?.data?.message || err?.message || 'Subscription failed. Please try again later.'
      newsletterMessage.value = errorMessage
    } finally {
      loading.value = false
    }
  }

  return {
    newsletterEmail,
    newsletterMessage,
    loading,
    subscribeNewsletter,
  }
}
