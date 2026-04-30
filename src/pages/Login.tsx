import { ActivitySquare, ShieldCheck } from 'lucide-react'
import { startTransition, type FormEvent, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useAuth } from '../hooks/useAuth'

interface FormState {
  email: string
  password: string
}

const initialFormState: FormState = {
  email: '',
  password: '',
}

const emailPattern = /\S+@\S+\.\S+/

export function Login() {
  const { clearError, error, isInitialized, isLoading, login, user } = useAuth()
  const [formState, setFormState] = useState<FormState>(initialFormState)
  const [fieldErrors, setFieldErrors] = useState<Partial<FormState>>({})

  const validationErrors = useMemo(() => {
    const nextErrors: Partial<FormState> = {}

    if (!formState.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!emailPattern.test(formState.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!formState.password.trim()) {
      nextErrors.password = 'Password is required.'
    } else if (formState.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }

    return nextErrors
  }, [formState])

  if (user) {
    return <Navigate replace to="/" />
  }

  if (!isInitialized) {
    return (
      <main className="medicore-shell flex min-h-screen items-center justify-center px-6 py-10">
        <Card className="w-full max-w-lg p-10">
          <p className="text-sm text-muted">Preparing secure sign-in...</p>
        </Card>
      </main>
    )
  }

  const handleChange = (field: keyof FormState, value: string) => {
    startTransition(() => {
      setFormState((current) => ({ ...current, [field]: value }))
      setFieldErrors((current) => ({ ...current, [field]: undefined }))
      clearError()
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors)

      return
    }

    try {
      await login(formState.email, formState.password)
    } catch {
      setFieldErrors((current) => ({ ...current }))
    }
  }

  return (
    <main className="medicore-shell flex min-h-screen items-center justify-center px-6 py-10">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden rounded-[36px] border border-border bg-[linear-gradient(145deg,var(--app-primary-soft),transparent_40%),var(--app-surface)] p-10 shadow-[var(--app-shadow)] lg:flex lg:flex-col lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              MediCore
            </span>
            <h1 className="mt-6 max-w-xl text-5xl font-semibold tracking-[-0.05em] text-foreground">
              Clinical operations, intelligence, and patient oversight in one
              secure workspace.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted">
              Designed for care teams who need instant visibility into critical
              cases, admissions, recovery trends, and AI-assisted summaries.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="rounded-[28px] bg-surface-elevated p-5">
              <ActivitySquare className="h-5 w-5 text-accent" />
              <p className="mt-4 text-sm font-semibold text-foreground">
                Live operational awareness
              </p>
              <p className="mt-2 text-sm leading-6 text-subtle">
                Track critical patients, department trends, and active updates
                without context switching.
              </p>
            </Card>
            <Card className="rounded-[28px] bg-surface-elevated p-5">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <p className="mt-4 text-sm font-semibold text-foreground">
                Authenticated access
              </p>
              <p className="mt-2 text-sm leading-6 text-subtle">
                Uses Firebase email and password authentication for a clean
                assignment-ready sign-in flow.
              </p>
            </Card>
          </div>
        </section>

        <Card className="mx-auto flex w-full max-w-xl flex-col justify-center rounded-[36px] p-8 md:p-10">
          <div className="mb-8">
            <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Secure Access
            </span>
            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-foreground">
              Sign in to MediCore
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Use your Firebase email and password to access the healthcare
              operations dashboard.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                className="mb-2 block text-sm font-medium text-foreground"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="h-12 w-full rounded-2xl border border-border bg-surface-elevated px-4 text-sm text-foreground outline-none transition placeholder:text-subtle focus:border-primary"
                id="email"
                onChange={(event) => handleChange('email', event.target.value)}
                placeholder="care.team@medicore.com"
                type="email"
                value={formState.email}
              />
              {fieldErrors.email ? (
                <p className="mt-2 text-sm text-danger">{fieldErrors.email}</p>
              ) : null}
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-foreground"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="h-12 w-full rounded-2xl border border-border bg-surface-elevated px-4 text-sm text-foreground outline-none transition placeholder:text-subtle focus:border-primary"
                id="password"
                onChange={(event) =>
                  handleChange('password', event.target.value)
                }
                placeholder="Enter your password"
                type="password"
                value={formState.password}
              />
              {fieldErrors.password ? (
                <p className="mt-2 text-sm text-danger">
                  {fieldErrors.password}
                </p>
              ) : null}
            </div>

            {error ? (
              <div className="rounded-2xl border border-danger/30 bg-[var(--status-critical-bg)] px-4 py-3 text-sm text-[var(--status-critical-text)]">
                {error}
              </div>
            ) : null}

            <Button className="w-full" loading={isLoading} size="lg" type="submit">
              {isLoading ? 'Signing you in...' : 'Sign in'}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  )
}
