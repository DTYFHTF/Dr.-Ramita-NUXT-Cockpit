<template>
  <div class="container py-5">
    <h1 class="mb-4">Settings</h1>
    <div class="card p-4 shadow-sm">
      <h5 class="mb-3">User Preferences</h5>
      <div class="mb-3">
        <label class="form-label">Theme</label>
        <select class="form-select" v-model="theme">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
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
const theme = ref('light');
const notifications = ref(true);

function saveSettings() {
  alert(`Settings saved!\nTheme: ${theme.value}\nNotifications: ${notifications.value ? 'On' : 'Off'}`);
}
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>
