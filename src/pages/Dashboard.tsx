import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarCheck2,
  HeartPulse,
  Plus,
  UsersRound,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../utils/cn'
import { dashboardStats, recentActivity } from '../data/mockPatients'
import { useAuth } from '../hooks/useAuth'
import type { DashboardStat } from '../types'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Skeleton } from '../components/ui/Skeleton'

const DASHBOARD_LOADING_MS = 850
const COUNT_UP_DURATION_MS = 900
const COUNT_UP_STEP_MS = 24

const statIcons: Record<DashboardStat['id'], typeof UsersRound> = {
  'total-patients': UsersRound,
  'critical-cases': AlertTriangle,
  'appointments-today': CalendarCheck2,
  'avg-recovery-rate': HeartPulse,
}

function useCountUp(targetValue: number) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let frame = 0
    const totalFrames = Math.max(
      1,
      Math.floor(COUNT_UP_DURATION_MS / COUNT_UP_STEP_MS),
    )

    const intervalId = window.setInterval(() => {
      frame += 1
      const progress = Math.min(frame / totalFrames, 1)
      setValue(Math.round(targetValue * progress))

      if (progress >= 1) {
        window.clearInterval(intervalId)
      }
    }, COUNT_UP_STEP_MS)

    return () => window.clearInterval(intervalId)
  }, [targetValue])

  return value
}

function StatCard({ stat }: { stat: DashboardStat }) {
  const Icon = statIcons[stat.id]
  const animatedValue = useCountUp(stat.value)
  const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight
  const trendColor =
    stat.id === 'critical-cases'
      ? 'text-success'
      : stat.trend === 'up'
        ? 'text-success'
        : 'text-danger'
  const suffix = stat.id === 'avg-recovery-rate' ? '%' : ''

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-start justify-between p-6">
        <div>
          <p className="text-sm font-medium text-muted">{stat.label}</p>
          <p className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-foreground">
            {animatedValue}
            {suffix}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border px-6 py-4">
        <div className={`flex items-center gap-1 text-sm font-semibold ${trendColor}`}>
          <TrendIcon className="h-4 w-4" />
          <span>{stat.change}%</span>
        </div>
        <p className="text-xs uppercase tracking-[0.18em] text-subtle">
          vs last week
        </p>
      </div>
    </Card>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={`stat-skeleton-${index}`} className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-12 w-full" />
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-4">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </Card>
        <Card className="space-y-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </Card>
      </div>
    </div>
  )
}

export function Dashboard() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setIsLoading(false),
      DASHBOARD_LOADING_MS,
    )

    return () => window.clearTimeout(timeoutId)
  }, [])

  const quickActions = useMemo(
    () => [
      { label: 'Add Patient', icon: Plus, to: '/patients' },
      { label: 'View Analytics', icon: HeartPulse, to: '/analytics' },
      { label: 'Schedule', icon: CalendarCheck2, to: '/patients' },
    ],
    [],
  )

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden bg-[linear-gradient(140deg,var(--app-primary-soft),transparent_40%),var(--app-surface)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">
              Welcome back
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">
              {user?.name ?? 'Care team'}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
              Here’s your morning snapshot across admissions, critical care, and
              department-level momentum.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {quickActions.map(({ icon: Icon, label, to }) => (
              <Link
                className={cn(
                  'inline-flex min-w-40 items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground transition duration-200 hover:bg-surface-elevated',
                )}
                key={label}
                to={to}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </Card>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-foreground">Recent activity</p>
              <p className="mt-1 text-sm text-muted">
                Latest patient updates from the last clinical rounds.
              </p>
            </div>
            <Badge tone="info">Live feed</Badge>
          </div>

          <div className="mt-6 space-y-4">
            {recentActivity.map((activity) => (
              <div
                className="rounded-[24px] border border-border bg-surface-elevated p-4"
                key={activity.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {activity.patientName}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {activity.detail}
                    </p>
                  </div>
                  <Badge status={activity.status} />
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.18em] text-subtle">
                  {new Date(activity.occurredAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-lg font-semibold text-foreground">Team priorities</p>
            <p className="mt-1 text-sm text-muted">
              Focus areas for today’s clinical operations.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-[24px] border border-border bg-surface-elevated p-5">
              <p className="text-sm font-semibold text-foreground">
                Review all ICU critical cases before noon
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Ava Thompson, Henry Walker, Benjamin Scott, Jackson Cooper, and
                Owen Turner all need specialist follow-up.
              </p>
            </div>
            <div className="rounded-[24px] border border-border bg-surface-elevated p-5">
              <p className="text-sm font-semibold text-foreground">
                Coordinate department recovery plans
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Orthopedics and Pediatrics are pacing ahead, while Pulmonology
                requires closer discharge planning.
              </p>
            </div>
            <div className="rounded-[24px] border border-border bg-surface-elevated p-5">
              <p className="text-sm font-semibold text-foreground">
                Align afternoon appointment load
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                14 appointments are scheduled today. Prioritize cardiology and
                oncology check-ins first.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}
