<template>
  <div class="container py-5 d-flex flex-column align-items-center justify-content-center min-vh-100">
    <div class="card p-4 shadow-sm w-100" style="max-width: 420px;">
      <h2 class="mb-3 text-center fw-bold">Email Verification</h2>
      <div v-if="loading" class="text-center my-3">
        <span>Verifying your email...</span>
      </div>
      <div v-else-if="success" class="alert alert-success text-center">
        Your email has been verified! <br>
        <NuxtLink to="/dashboard" class="btn btn-success mt-3">Go to Profile</NuxtLink>
      </div>
      <div v-else class="alert alert-danger text-center">
        {{ errorMsg }}
        <div v-if="canResend" class="mt-3">
          <button class="btn btn-link p-0" @click="resendVerification" :disabled="resending">
            <span v-if="resending">Resending...</span><span v-else>Resend verification email</span>
          </button>
          <div v-if="resendMsg" class="text-success small mt-1">{{ resendMsg }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const API_BASE = useRuntimeConfig().public.apiBase;

const loading = ref(true);
const success = ref(false);
const errorMsg = ref('');
const canResend = ref(false);
const resending = ref(false);
const resendMsg = ref('');

onMounted(async () => {
  const { id, hash } = route.params;
  const token = localStorage.getItem('auth_token');
  if (!token) {
    errorMsg.value = 'You must be logged in to verify your email.';
    loading.value = false;
    return;
  }
  try {
    const url = `${API_BASE}/email/verify/${id}/${hash}${route.fullPath.includes('?') ? route.fullPath.substring(route.fullPath.indexOf('?')) : ''}`;
    const response = await $fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
    }) as { message?: string };
    if (response.message && response.message.toLowerCase().includes('verified')) {
      success.value = true;
      // Optionally refresh user info here
      if (userStore.user) {
        userStore.setUser({ 
          ...userStore.user, 
          id: userStore.user.id ?? 0, // Ensure id is always a number
          email_verified_at: new Date().toISOString(),
          first_name: userStore.user.first_name ?? '',
          last_name: userStore.user.last_name ?? '',
          email: userStore.user.email ?? '',
          phone: userStore.user.phone ?? ''
        });
      }
    } else {
      errorMsg.value = response.message || 'Verification failed.';
      canResend.value = true;
    }
  } catch (e: any) {
    errorMsg.value = e?.data?.message || e?.message || 'Verification failed.';
    canResend.value = true;
  } finally {
    loading.value = false;
  }
});

async function resendVerification() {
  resending.value = true;
  resendMsg.value = '';
  try {
    const token = localStorage.getItem('auth_token');
    await $fetch(`${API_BASE}/email/verification-notification`, {
      method: 'POST',
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
    });
    resendMsg.value = 'Verification email resent! Please check your inbox.';
  } catch (e) {
    resendMsg.value = 'Failed to resend verification email.';
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
