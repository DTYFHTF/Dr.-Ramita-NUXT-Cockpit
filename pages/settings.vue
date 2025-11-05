<template>
  <div class="container py-5">
    <h1 class="mb-4">Settings</h1>
    <div class="card p-4 shadow-sm">
      <h5 class="mb-3">User Preferences</h5>
      <div class="mb-3">
        <label class="form-label">Theme : <ThemeToggle /></label>
        
      </div>
      <div class="mb-3">
        <label class="form-label">Notifications</label>
        <input type="checkbox" v-model="notifications" /> Enable notifications
      </div>
      <button class="btn btn-smooth-success" @click="saveSettings">Save Settings</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ThemeToggle from '@/components/ThemeToggle.vue';
import { useTheme } from '@/composables/useTheme';

const notifications = ref(true);
const { theme } = useTheme();

function saveSettings() {
  alert(`Settings saved!\nTheme: ${theme.value}\nNotifications: ${notifications.value ? 'On' : 'Off'}`);
}
</script>

<style scoped>
.container {
  max-width: 600px;
  background: var(--background-white);
}
</style>
