import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const initialize = useAuthStore((state) => state.initialize)
  const user = useAuthStore((state) => state.user)
  const isLoading = useAuthStore((state) => state.isLoading)
  const isInitialized = useAuthStore((state) => state.isInitialized)
  const login = useAuthStore((state) => state.login)
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle)
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => initialize(), [initialize])

  return {
    user,
    isLoading,
    isInitialized,
    login,
    loginWithGoogle,
    logout,
  }
}
