<template>
  <Teleport to="body">
    <div class="alert-container">
      <TransitionGroup name="alert">
        <div 
          v-for="alert in alerts" 
          :key="alert.id" 
          :class="['alert-item', `alert-${alert.type || 'info'}`]"
        >
          <div class="alert-content">
            <div class="alert-icon">
              <span v-if="alert.type === 'success'">✓</span>
              <span v-else-if="alert.type === 'error'">✕</span>
              <span v-else-if="alert.type === 'warning'">⚠</span>
              <span v-else>ℹ</span>
            </div>
            <div class="alert-body">
              <h4 v-if="alert.title" class="alert-title">{{ alert.title }}</h4>
              <p class="alert-message">{{ alert.message }}</p>
              
              <!-- Action buttons -->
              <div v-if="alert.actions?.length || alert.showLoginButton" class="alert-actions">
                <!-- Login button for auth-related alerts -->
                <button
                  v-if="alert.showLoginButton"
                  class="alert-btn alert-btn-primary"
                  @click="handleLogin(alert.id)"
                >
                  Log In
                </button>
                
                <!-- Custom action buttons -->
                <button
                  v-for="(action, index) in alert.actions"
                  :key="index"
                  :class="['alert-btn', action.primary ? 'alert-btn-primary' : 'alert-btn-secondary']"
                  @click="handleAction(alert.id, action.handler)"
                >
                  {{ action.label }}
                </button>
              </div>
            </div>
            <button class="alert-dismiss" @click="dismissAlert(alert.id)" aria-label="Dismiss">
              ×
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useAlert } from '@/composables/useAlert'
import { useRouter } from 'vue-router'

const { alerts, dismissAlert } = useAlert()
const router = useRouter()

const handleAction = (alertId: string, handler: () => void) => {
  handler()
  dismissAlert(alertId)
}

const handleLogin = (alertId: string) => {
  dismissAlert(alertId)
  router.push('/login')
}
</script>

<style scoped lang="scss">
.alert-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 420px;
  pointer-events: none;
}

.alert-item {
  pointer-events: auto;
  background: var(--surface-primary);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border-left: 4px solid;
  
  &.alert-success {
    border-left-color: var(--status-success);
  }
  
  &.alert-error {
    border-left-color: var(--status-error);
  }
  
  &.alert-warning {
    border-left-color: var(--status-warning);
  }
  
  &.alert-info {
    border-left-color: var(--status-info);
  }
}

.alert-content {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  gap: 12px;
}

.alert-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  
  .alert-success & {
    background: var(--status-success-bg);
    color: var(--status-success);
  }
  
  .alert-error & {
    background: var(--status-error-bg);
    color: var(--status-error);
  }
  
  .alert-warning & {
    background: var(--status-warning-bg);
    color: var(--status-warning);
  }
  
  .alert-info & {
    background: var(--status-info-bg);
    color: var(--status-info);
  }
}

.alert-body {
  flex: 1;
  min-width: 0;
}

.alert-title {
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.alert-message {
  margin: 0;
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.5;
}

.alert-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.alert-btn {
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  
  &.alert-btn-primary {
    background: var(--status-success-emphasis);
    color: var(--text-inverse);
    
    &:hover {
      background: var(--status-success-emphasis);
    }
  }
  
  &.alert-btn-secondary {
    background: var(--surface-muted);
    color: var(--text-muted);
    
    &:hover {
      background: var(--border-default);
    }
  }
}

.alert-dismiss {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--text-placeholder);
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
  
  &:hover {
    color: var(--text-secondary);
  }
}

// Animations
.alert-enter-active,
.alert-leave-active {
  transition: all 0.3s ease;
}

.alert-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.alert-leave-to {
  opacity: 0;
  transform: translateX(100px) scale(0.95);
}

@media (max-width: 768px) {
  .alert-container {
    right: 12px;
    left: 12px;
    max-width: none;
  }
}
</style>
