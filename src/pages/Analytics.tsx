import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { admissionTrend, departmentMetrics } from '../data/mockPatients'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

const CHART_HEIGHT = 320
const dateRangeOptions = [
  { label: 'Last 7 days', value: 7 },
  { label: 'Last 30 days', value: 30 },
  { label: 'Last 90 days', value: 90 },
] as const

const pieColors = [
  'var(--app-chart-1)',
  'var(--app-chart-2)',
  'var(--app-chart-3)',
  'var(--app-chart-4)',
  'var(--app-chart-5)',
  'var(--app-chart-6)',
  'var(--app-chart-7)',
]

export function Analytics() {
  const [dateRange, setDateRange] = useState<(typeof dateRangeOptions)[number]['value']>(30)

  const lineData = useMemo(() => {
    const pointCount = dateRange === 7 ? 7 : dateRange === 30 ? 10 : admissionTrend.length

    return admissionTrend.slice(-pointCount)
  }, [dateRange])

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden bg-[linear-gradient(145deg,var(--app-accent-soft),transparent_42%),var(--app-surface)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge tone="info">Analytics center</Badge>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-foreground">
              Admissions, department load, and recovery performance
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
              Compare operational throughput across time windows and spot areas
              that need staffing or care-plan attention.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {dateRangeOptions.map((option) => (
              <Button
                className="min-w-28"
                key={option.value}
                onClick={() => setDateRange(option.value)}
                variant={dateRange === option.value ? 'primary' : 'secondary'}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <div className="mb-6">
            <p className="text-lg font-semibold text-foreground">
              Patient admission trends
            </p>
            <p className="mt-1 text-sm text-muted">
              Admissions and discharges over the selected date range.
            </p>
          </div>

          <ResponsiveContainer height={CHART_HEIGHT} width="100%">
            <LineChart data={lineData}>
              <CartesianGrid stroke="var(--app-border)" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="var(--app-subtle)" tickLine={false} />
              <YAxis stroke="var(--app-subtle)" tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'var(--app-surface-elevated)',
                  border: '1px solid var(--app-border)',
                  borderRadius: '18px',
                  color: 'var(--app-text)',
                }}
              />
              <Legend />
              <Line
                dataKey="admissions"
                dot={false}
                name="Admissions"
                stroke="var(--app-primary)"
                strokeWidth={3}
                type="monotone"
              />
              <Line
                dataKey="discharges"
                dot={false}
                name="Discharges"
                stroke="var(--app-accent)"
                strokeWidth={3}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div className="mb-6">
            <p className="text-lg font-semibold text-foreground">
              Department distribution
            </p>
            <p className="mt-1 text-sm text-muted">
              Current patient census across active departments.
            </p>
          </div>

          <ResponsiveContainer height={CHART_HEIGHT} width="100%">
            <PieChart>
              <Pie
                data={departmentMetrics}
                dataKey="patients"
                innerRadius={76}
                outerRadius={110}
                paddingAngle={3}
              >
                {departmentMetrics.map((entry, index) => (
                  <Cell
                    fill={pieColors[index % pieColors.length]}
                    key={entry.department}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--app-surface-elevated)',
                  border: '1px solid var(--app-border)',
                  borderRadius: '18px',
                  color: 'var(--app-text)',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <div className="mb-6">
            <p className="text-lg font-semibold text-foreground">
              Recovery rate by department
            </p>
            <p className="mt-1 text-sm text-muted">
              Higher recovery completion highlights smoother discharge planning.
            </p>
          </div>

          <ResponsiveContainer height={CHART_HEIGHT} width="100%">
            <BarChart data={departmentMetrics} layout="vertical">
              <CartesianGrid stroke="var(--app-border)" strokeDasharray="3 3" />
              <XAxis domain={[0, 100]} stroke="var(--app-subtle)" type="number" />
              <YAxis
                dataKey="department"
                stroke="var(--app-subtle)"
                tickLine={false}
                type="category"
                width={100}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--app-surface-elevated)',
                  border: '1px solid var(--app-border)',
                  borderRadius: '18px',
                  color: 'var(--app-text)',
                }}
              />
              <Bar
                dataKey="recoveryRate"
                fill="var(--app-primary)"
                radius={[0, 14, 14, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-foreground">
                Department performance snapshot
              </p>
              <p className="mt-1 text-sm text-muted">
                Recovery rates and current load at a glance.
              </p>
            </div>
            <Badge tone="info">Updated live</Badge>
          </div>

          <div className="mt-6 space-y-4">
            {departmentMetrics.map((metric) => (
              <div
                className="rounded-[24px] border border-border bg-surface-elevated p-5"
                key={metric.department}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {metric.department}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {metric.patients} active patients
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
                      {metric.recoveryRate}%
                    </p>
                    <p className="text-xs uppercase tracking-[0.18em] text-subtle">
                      recovery
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-subtle">
                  <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-primary">
                    Strong recovery
                  </span>
                  <span>{metric.recoveryRate}% complete</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  )
}
