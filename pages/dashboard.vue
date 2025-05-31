<template>
  <div class="dashboard-container" v-if="user">
    <h1>Dashboard</h1>
    <div class="user-info">
      <p><strong>First Name:</strong> {{ user.first_name }}</p>
      <p><strong>Last Name:</strong> {{ user.last_name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Phone:</strong> {{ user.phone || 'N/A' }}</p>
      <p><strong>Email Verified:</strong> 
        <span v-if="user.email_verified_at">Yes</span>
        <span v-else>No
          <button class="btn btn-link p-0 ms-2" @click="sendVerification" :disabled="sending">
            <span v-if="sending">Sending...</span>
            <span v-else>Send verification email</span>
          </button>
          <span v-if="sentMsg" class="text-success ms-2">{{ sentMsg }}</span>
          <span v-if="sendError" class="text-danger ms-2">{{ sendError }}</span>
        </span>
      </p>
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
import { ref } from 'vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const sending = ref(false)
const sentMsg = ref('')
const sendError = ref('')
const API_BASE = useRuntimeConfig().public.apiBase

async function sendVerification() {
  sending.value = true
  sentMsg.value = ''
  sendError.value = ''
  try {
    const token = localStorage.getItem('auth_token')
    await $fetch(`${API_BASE}/email/verification-notification`, {
      method: 'POST',
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
    })
    sentMsg.value = 'Verification email sent! Please check your inbox.'
  } catch (e) {
    sendError.value = 'Failed to send verification email.'
  } finally {
    sending.value = false
  }
}
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
