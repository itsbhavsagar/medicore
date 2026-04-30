import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const initialize = useAuthStore((state) => state.initialize)
  const user = useAuthStore((state) => state.user)
  const isLoading = useAuthStore((state) => state.isLoading)
  const error = useAuthStore((state) => state.error)
  const isInitialized = useAuthStore((state) => state.isInitialized)
  const login = useAuthStore((state) => state.login)
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle)
  const logout = useAuthStore((state) => state.logout)
  const clearError = useAuthStore((state) => state.clearError)

  useEffect(() => initialize(), [initialize])

  return {
    user,
    isLoading,
    error,
    isInitialized,
    login,
    loginWithGoogle,
    logout,
    clearError,
  }
}
