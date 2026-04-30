import { useEffect } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { PageWrapper } from './components/layout/PageWrapper'
import { Sidebar } from './components/layout/Sidebar'
import { useAuth } from './hooks/useAuth'
import { Analytics } from './pages/Analytics'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { PatientDetails } from './pages/PatientDetails'
import { useThemeStore } from './store/themeStore'

const routeMetadata: Record<string, { title: string; subtitle: string }> = {
  '/': {
    title: 'Operations Overview',
    subtitle: 'Clinical, operational, and patient-level visibility in one place.',
  },
  '/analytics': {
    title: 'Analytics',
    subtitle: 'Admissions, departmental health, and recovery performance.',
  },
  '/patients': {
    title: 'Patient Details',
    subtitle: 'Search, review, and summarize patient records efficiently.',
  },
}

function AppLayout() {
  const location = useLocation()
  const { logout, user } = useAuth()
  const metadata = routeMetadata[location.pathname] ?? routeMetadata['/']

  return (
    <div className="medicore-shell flex min-h-screen bg-background text-foreground">
      <Sidebar onLogout={logout} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Header
          subtitle={metadata.subtitle}
          title={metadata.title}
          userName={user?.name ?? 'Operations Team'}
        />
        <PageWrapper>
          <Outlet />
        </PageWrapper>
      </div>
    </div>
  )
}

function ProtectedRoute() {
  const { isInitialized, user } = useAuth()

  if (!isInitialized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <p className="text-sm text-muted">Establishing secure session...</p>
      </main>
    )
  }

  if (!user) {
    return <Navigate replace to="/login" />
  }

  return <AppLayout />
}

export function App() {
  const initializeTheme = useThemeStore((state) => state.initialize)

  useEffect(() => {
    initializeTheme()
  }, [initializeTheme])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Login />} path="/login" />
        <Route element={<ProtectedRoute />}>
          <Route element={<Dashboard />} path="/" />
          <Route element={<Analytics />} path="/analytics" />
          <Route element={<PatientDetails />} path="/patients" />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
