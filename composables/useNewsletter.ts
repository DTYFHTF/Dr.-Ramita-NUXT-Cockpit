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
      newsletterMessage.value = err?.message || 'Subscription failed.'
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
