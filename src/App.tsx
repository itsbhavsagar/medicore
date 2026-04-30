export function App() {
  return (
    <main className="medicore-shell flex min-h-screen items-center justify-center px-6 py-10">
      <div className="max-w-xl rounded-[32px] border border-border bg-surface p-10 text-center shadow-[var(--app-shadow)]">
        <span className="inline-flex rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
          MediCore
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-foreground">
          Healthcare operations workspace
        </h1>
        <p className="mt-4 text-base text-muted">
          Core UI primitives and theming are in place. Feature pages will be
          wired in next.
        </p>
      </div>
    </main>
  )
}

export default App
