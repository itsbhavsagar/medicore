import { motion } from 'framer-motion'
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
        <section className="hidden rounded-xl border border-border bg-surface p-8 lg:flex lg:flex-col lg:justify-between">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.32 }}
          >
            <p className="flex items-center gap-2 text-sm font-medium text-muted">
              <span className="h-2 w-2 rounded-full bg-accent" />
              medicore
            </p>
            <h1 className="mt-5 max-w-xl text-[32px] font-medium tracking-[-0.04em] text-foreground">
              Clinical operations, intelligence, and patient oversight in one
              secure workspace.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-muted">
              Built for care teams who need clear patient context, faster
              follow-up, and calm operational visibility.
            </p>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
            initial={{ opacity: 0, y: 16 }}
            transition={{ delay: 0.08, duration: 0.32 }}
          >
            <p className="flex items-start gap-3 text-sm text-muted">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" />
              Track critical patients, admissions, and recovery progress in one
              place.
            </p>
            <p className="flex items-start gap-3 text-sm text-muted">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" />
              Search records quickly and open focused patient detail panels.
            </p>
            <p className="flex items-start gap-3 text-sm text-muted">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" />
              Generate AI summaries from live patient context when needed.
            </p>
          </motion.div>
        </section>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-full max-w-xl"
          initial={{ opacity: 0, y: 18 }}
          transition={{ delay: 0.04, duration: 0.34 }}
        >
          <Card className="flex w-full flex-col justify-center p-6 md:p-7">
          <div className="mb-6">
            <h2 className="text-[28px] font-medium tracking-[-0.03em] text-foreground">
              Sign in to MediCore
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Use your Firebase email and password.
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
                className="h-12 w-full rounded-xl border border-border bg-surface-elevated px-4 text-sm text-foreground outline-none transition placeholder:text-subtle focus:border-primary"
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
                className="h-12 w-full rounded-xl border border-border bg-surface-elevated px-4 text-sm text-foreground outline-none transition placeholder:text-subtle focus:border-primary"
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
              <div className="text-sm text-muted">
                {error}
              </div>
            ) : null}

            <Button className="w-full" loading={isLoading} size="lg" type="submit">
              {isLoading ? 'Signing you in...' : 'Sign in'}
            </Button>
          </form>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}
