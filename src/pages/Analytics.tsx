import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
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
    <div className="space-y-4">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
        initial={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.3 }}
      >
          <div>
            <h2 className="text-[28px] font-medium tracking-[-0.03em] text-foreground">
              Analytics
            </h2>
            <p className="mt-1 text-sm text-muted">
              Admissions, department load, and recovery performance.
            </p>
          </div>

          <div className="inline-flex rounded-full border border-border bg-surface p-1">
            {dateRangeOptions.map((option) => (
              <button
                className={
                  dateRange === option.value
                    ? 'rounded-full bg-primary-soft px-4 py-2 text-sm font-medium text-foreground'
                    : 'rounded-full px-4 py-2 text-sm font-medium text-muted'
                }
                key={option.value}
                onClick={() => setDateRange(option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
      </motion.div>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 14 }}
          transition={{ delay: 0.08, duration: 0.28 }}
        >
          <Card>
          <div className="mb-4">
            <p className="text-sm font-medium text-foreground">
              Patient admission trends
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
                  borderRadius: '12px',
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
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 14 }}
          transition={{ delay: 0.14, duration: 0.28 }}
        >
          <Card>
          <div className="mb-4">
            <p className="text-sm font-medium text-foreground">
              Department distribution
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
                  borderRadius: '12px',
                  color: 'var(--app-text)',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          </Card>
        </motion.div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 14 }}
          transition={{ delay: 0.2, duration: 0.28 }}
        >
          <Card>
          <div className="mb-4">
            <p className="text-sm font-medium text-foreground">
              Recovery rate by department
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
                  borderRadius: '12px',
                  color: 'var(--app-text)',
                }}
              />
              <Bar
                dataKey="recoveryRate"
                fill="var(--app-primary)"
              radius={[0, 8, 8, 0]}
            />
            </BarChart>
          </ResponsiveContainer>
          </Card>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 14 }}
          transition={{ delay: 0.26, duration: 0.28 }}
        >
          <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Department performance snapshot
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {departmentMetrics.map((metric) => (
              <div
                className="rounded-xl border border-border bg-surface-elevated p-4"
                key={metric.department}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {metric.department}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {metric.patients} active patients
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold tracking-[-0.03em] text-foreground">
                      {metric.recoveryRate}%
                    </p>
                    <p className="text-xs text-subtle">
                      recovery
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs font-medium text-subtle">
                  <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-primary">
                    Strong recovery
                  </span>
                  <span>{metric.recoveryRate}% complete</span>
                </div>
              </div>
            ))}
          </div>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}
