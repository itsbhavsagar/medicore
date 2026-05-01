import { create } from 'zustand'
import type { ThemeMode } from '../types'

const THEME_STORAGE_KEY = 'medicore-theme'
const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)'
const THEME_TRANSITION_CLASS = 'theme-transition'
const THEME_TRANSITION_DURATION_MS = 280

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

let themeTransitionTimeoutId: number | null = null

interface ApplyThemeOptions {
  persist?: boolean
  withTransition?: boolean
}

export const applyTheme = (
  theme: ThemeMode,
  { persist = true, withTransition = false }: ApplyThemeOptions = {},
) => {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement

  if (themeTransitionTimeoutId !== null) {
    window.clearTimeout(themeTransitionTimeoutId)
    themeTransitionTimeoutId = null
  }

  const commitTheme = () => {
    root.dataset.theme = theme
    root.style.colorScheme = theme

    if (persist && typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    }
  }

  if (!withTransition) {
    root.classList.remove(THEME_TRANSITION_CLASS)
    commitTheme()
    return
  }

  root.classList.add(THEME_TRANSITION_CLASS)

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      commitTheme()

      themeTransitionTimeoutId = window.setTimeout(() => {
        root.classList.remove(THEME_TRANSITION_CLASS)
        themeTransitionTimeoutId = null
      }, THEME_TRANSITION_DURATION_MS)
    })
  })
}

if (typeof document !== 'undefined') {
  applyTheme(readInitialTheme(), { persist: false, withTransition: false })
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
    applyTheme(theme, { withTransition: false })
    set({ theme })
  },
  toggle: () => {
    const nextTheme: ThemeMode = get().theme === 'dark' ? 'light' : 'dark'
    applyTheme(nextTheme, { withTransition: true })
    set({ theme: nextTheme })
  },
}))
