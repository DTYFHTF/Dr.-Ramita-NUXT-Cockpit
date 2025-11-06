/**
 * Composable for handling password reset functionality
 */
export const usePasswordReset = () => {
  const config = useRuntimeConfig()
  const API_BASE = config.public.apiBase

  /**
   * Send password reset link to email
   */
  const sendResetLink = async (email: string) => {
    try {
      const response = await $fetch(`${API_BASE}/forgot-password`, {
        method: 'POST',
        body: { email },
        headers: { 
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }) as { message?: string }
      
      return {
        success: true,
        message: response.message || 'Password reset link has been sent to your email address.'
      }
    } catch (error: any) {
      return {
        success: false,
        message: error?.data?.message || 
                error?.data?.errors?.email?.[0] || 
                error?.message || 
                'Failed to send reset link. Please try again.'
      }
    }
  }

  /**
   * Reset password with token
   */
  const resetPassword = async (data: {
    email: string
    password: string
    password_confirmation: string
    token: string
  }) => {
    
    try {
      const response = await $fetch(`${API_BASE}/reset-password`, {
        method: 'POST',
        body: data,
        headers: { 
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }) as { message?: string }
      
      
      return {
        success: true,
        message: response.message || 'Password has been reset successfully.'
      }
    } catch (error: any) {
      console.error('Password reset API error:', error)
      console.error('Error status:', error?.status)
      console.error('Error data:', error?.data)
      
      let message = 'Failed to reset password. Please try again.'
      
      if (error?.data?.message) {
        message = error.data.message
      } else if (error?.data?.errors) {
        const errors = error.data.errors
        if (errors.email) {
          message = errors.email[0]
        } else if (errors.password) {
          message = errors.password[0]
        } else if (errors.token) {
          message = errors.token[0]
        }
      } else if (error?.message) {
        message = error.message
      }
      
      return {
        success: false,
        message
      }
    }
  }

  return {
    sendResetLink,
    resetPassword
  }
}
