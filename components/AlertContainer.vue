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
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border-left: 4px solid;
  
  &.alert-success {
    border-left-color: #10b981;
  }
  
  &.alert-error {
    border-left-color: #ef4444;
  }
  
  &.alert-warning {
    border-left-color: #f59e0b;
  }
  
  &.alert-info {
    border-left-color: #3b82f6;
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
    background: #d1fae5;
    color: #10b981;
  }
  
  .alert-error & {
    background: #fee2e2;
    color: #ef4444;
  }
  
  .alert-warning & {
    background: #fef3c7;
    color: #f59e0b;
  }
  
  .alert-info & {
    background: #dbeafe;
    color: #3b82f6;
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
  color: #1f2937;
}

.alert-message {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
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
    background: #047857;
    color: white;
    
    &:hover {
      background: #065f46;
    }
  }
  
  &.alert-btn-secondary {
    background: #f3f4f6;
    color: #6b7280;
    
    &:hover {
      background: #e5e7eb;
    }
  }
}

.alert-dismiss {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: #9ca3af;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
  
  &:hover {
    color: #4b5563;
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
