
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import type { Pinia } from 'pinia'

export default defineNuxtPlugin({
  name: 'pinia-persistedstate',
  dependsOn: ['pinia:plugin'],
  setup(nuxtApp) {
    console.log('[DEBUG] Registering pinia persisted state plugin')
    if (nuxtApp.$pinia) {
      (nuxtApp.$pinia as Pinia).use(piniaPluginPersistedstate)
      console.log('[DEBUG] Pinia persisted state plugin registered successfully')
    } else {
      console.error('[DEBUG] $pinia not available when trying to register persisted state plugin')
    }
  }
})
