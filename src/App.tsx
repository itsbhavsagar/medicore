import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { PageWrapper } from './components/layout/PageWrapper'
import { Sidebar } from './components/layout/Sidebar'
import { Card } from './components/ui/Card'
import { useThemeStore } from './store/themeStore'

export function App() {
  const initializeTheme = useThemeStore((state) => state.initialize)

  useEffect(() => {
    initializeTheme()
  }, [initializeTheme])

  return (
    <BrowserRouter>
      <div className="medicore-shell flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Header
            subtitle="Shared shell components are active and ready for route-level pages."
            title="MediCore Workspace"
            userName="Operations Team"
          />
          <PageWrapper>
            <Card className="max-w-3xl">
              <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Foundation
              </span>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-foreground">
                Dashboard chrome is ready
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
                We now have the reusable navigation shell, theme toggle, and
                page motion wrapper in place. The next commits plug real pages
                into this frame.
              </p>
            </Card>
          </PageWrapper>
        </div>
      </div>
    </BrowserRouter>
  )
}
