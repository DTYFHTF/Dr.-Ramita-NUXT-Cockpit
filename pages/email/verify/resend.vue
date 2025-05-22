<template>
  <div class="container py-5 d-flex flex-column align-items-center justify-content-center min-vh-100">
    <div class="card p-4 shadow-sm w-100" style="max-width: 420px;">
      <h2 class="mb-3 text-center fw-bold">Resend Verification Email</h2>
      <div v-if="success" class="alert alert-success text-center">
        Verification email resent! Please check your inbox.
      </div>
      <div v-else>
        <button class="btn btn-primary w-100" @click="resendVerification" :disabled="resending">
          <span v-if="resending">Resending...</span><span v-else>Resend verification email</span>
        </button>
        <div v-if="errorMsg" class="alert alert-danger mt-3 text-center">{{ errorMsg }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const API_BASE = 'http://ayurveda-marketplace.test';
const resending = ref(false);
const success = ref(false);
const errorMsg = ref('');

async function resendVerification() {
  resending.value = true;
  errorMsg.value = '';
  try {
    const token = localStorage.getItem('auth_token');
    await $fetch(`${API_BASE}/api/email/verification-notification`, {
      method: 'POST',
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
    });
    success.value = true;
  } catch (e: any) {
    errorMsg.value = e?.data?.message || e?.message || 'Failed to resend verification email.';
  } finally {
    resending.value = false;
  }
}
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>
