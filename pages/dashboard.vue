<template>
  <div class="dashboard-container" v-if="user">
    <h1>Dashboard</h1>
    <div class="user-info">
      <p><strong>First Name:</strong> {{ user.first_name }}</p>
      <p><strong>Last Name:</strong> {{ user.last_name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Phone:</strong> {{ user.phone || 'N/A' }}</p>
      <p><strong>Email Verified:</strong> {{ user.email_verified_at ? 'Yes' : 'No' }}</p>
    </div>
  </div>
  <div v-else>
    <h1>Dashboard</h1>
    <p>You are not logged in.</p>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
</script>

<style scoped>
.dashboard-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.user-info p {
  margin: 0.5rem 0;
}
</style>
