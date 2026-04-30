import { create } from 'zustand'
import type { ThemeMode } from '../types'

const THEME_STORAGE_KEY = 'medicore-theme'
const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)'

const getSystemTheme = (): ThemeMode =>
  window.matchMedia(DARK_MEDIA_QUERY).matches ? 'dark' : 'light'

const readInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  return getSystemTheme()
}

const applyTheme = (theme: ThemeMode) => {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
}

interface ThemeStoreState {
  theme: ThemeMode
  initialize: () => void
  toggle: () => void
}

export const useThemeStore = create<ThemeStoreState>((set, get) => ({
  theme: readInitialTheme(),
  initialize: () => {
    const theme = readInitialTheme()
    applyTheme(theme)
    set({ theme })
  },
  toggle: () => {
    const nextTheme: ThemeMode = get().theme === 'dark' ? 'light' : 'dark'
    applyTheme(nextTheme)
    set({ theme: nextTheme })
  },
}))
