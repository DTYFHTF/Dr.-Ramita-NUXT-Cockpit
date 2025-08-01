import { ref } from 'vue'
import { useRuntimeConfig } from '#imports'

export function useNewsletter() {
  const newsletterEmail = ref('')
  const newsletterMessage = ref('')
  const loading = ref(false)

  async function subscribeNewsletter() {
    newsletterMessage.value = ''
    loading.value = true
    try {
      const config = useRuntimeConfig()
      const apiBase = config.public.apiBase
      const res = await $fetch(`${apiBase}/newsletter/subscribe`, {
        method: 'POST',
        body: { email: newsletterEmail.value },
        headers: { 'Content-Type': 'application/json' },
      })
      newsletterMessage.value = res.message || 'Subscribed successfully!'
      newsletterEmail.value = ''
    } catch (err) {
      newsletterMessage.value = err?.data?.message || 'Subscription failed.'
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
