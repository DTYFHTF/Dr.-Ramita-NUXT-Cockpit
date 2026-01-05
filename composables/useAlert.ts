// Composable for showing user-friendly alerts with actions
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export interface AlertAction {
  label: string
  handler: () => void
  primary?: boolean
}

export interface AlertOptions {
  title?: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  actions?: AlertAction[]
  showLoginButton?: boolean
}

const alerts = ref<(AlertOptions & { id: string })[]>([])
let alertIdCounter = 0

export function useAlert() {
  const router = useRouter()

  const showAlert = (options: AlertOptions) => {
    const id = `alert-${alertIdCounter++}`
    const alert = { ...options, id }
    alerts.value.push(alert)

    // Auto-dismiss after duration (unless there are actions)
    if (options.duration !== 0 && !options.actions?.length && !options.showLoginButton) {
      setTimeout(() => {
        dismissAlert(id)
      }, options.duration || 5000)
    }

    return id
  }

  const dismissAlert = (id: string) => {
    const index = alerts.value.findIndex(a => a.id === id)
    if (index > -1) {
      alerts.value.splice(index, 1)
    }
  }

  const dismissAll = () => {
    alerts.value = []
  }

  // Pre-configured alert types
  const success = (message: string, duration = 3000) => {
    return showAlert({ message, type: 'success', duration })
  }

  const error = (message: string, duration = 5000) => {
    return showAlert({ message, type: 'error', duration })
  }

  const warning = (message: string, duration = 5000) => {
    return showAlert({ message, type: 'warning', duration })
  }

  const info = (message: string, duration = 5000) => {
    return showAlert({ message, type: 'info', duration })
  }

  // Authentication-specific alerts
  const authRequired = (message = 'Please log in to continue') => {
    return showAlert({
      title: 'Authentication Required',
      message,
      type: 'warning',
      duration: 0,
      showLoginButton: true,
      actions: [
        {
          label: 'Cancel',
          handler: () => {},
          primary: false
        }
      ]
    })
  }

  const sessionExpired = (message = 'Your session has expired. Please log in again.') => {
    return showAlert({
      title: 'Session Expired',
      message,
      type: 'warning',
      duration: 0,
      showLoginButton: true
    })
  }

  // Custom alert with actions
  const confirm = (message: string, onConfirm: () => void, onCancel?: () => void) => {
    return showAlert({
      title: 'Confirm Action',
      message,
      type: 'warning',
      duration: 0,
      actions: [
        {
          label: 'Cancel',
          handler: () => {
            onCancel?.()
          },
          primary: false
        },
        {
          label: 'Confirm',
          handler: () => {
            onConfirm()
          },
          primary: true
        }
      ]
    })
  }

  return {
    alerts,
    showAlert,
    dismissAlert,
    dismissAll,
    success,
    error,
    warning,
    info,
    authRequired,
    sessionExpired,
    confirm
  }
}
