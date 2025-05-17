<template>
  <div class="profile-page">
    <h2>User Profile</h2>
    <div v-if="user">
      <p><strong>Name:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <!-- Add more user fields as needed -->
    </div>
    <div v-else>
      <p>Loading user info...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({ middleware: 'auth' })

const userStore = useUserStore()
const user = ref<any>(userStore.user)
const router = useRouter()

onMounted(async () => {
  if (!userStore.token) {
    router.push('/login')
    return
  }
  // Optionally, fetch latest user info from API
  try {
    const API_BASE = 'http://ayurveda-marketplace.test'
    const fetchedUser = await $fetch<any>(`${API_BASE}/api/user`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${userStore.token}`
      }
    })
    userStore.setUser(fetchedUser)
    user.value = fetchedUser
  } catch (e) {
    userStore.logout()
    router.push('/login')
  }
})
</script>

<style scoped>
.profile-page {
  max-width: 400px;
  margin: 60px auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
}
</style>
