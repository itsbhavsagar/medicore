import { useMemo, useState } from "react";
import { motion } from "framer-motion";
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
} from "recharts";
import { admissionTrend, mockPatients } from "../data/mockPatients";
import { Card } from "../components/ui/Card";
import type { Department, PatientStatus } from "../types";

const CHART_HEIGHT = 320;
const SNAPSHOT_PAGE_SIZE = 4;
const ANALYTICS_RANGE_STORAGE_KEY = "medicore-analytics-range";
const CHART_ANIMATION_DURATION = 700;
const dateRangeOptions = [
  { label: "Last 7 days", value: 7 },
  { label: "Last 30 days", value: 30 },
  { label: "Last 90 days", value: 90 },
] as const;

const pieColors = [
  "var(--app-chart-1)",
  "var(--app-chart-2)",
  "var(--app-chart-3)",
  "var(--app-chart-4)",
  "var(--app-chart-5)",
  "var(--app-chart-6)",
  "var(--app-chart-7)",
];

const statusRecoveryWeights: Record<PatientStatus, number> = {
  Critical: 0.28,
  Stable: 0.66,
  Recovering: 0.84,
  Discharged: 1,
};

export function Analytics() {
  const [dateRange, setDateRange] = useState<
    (typeof dateRangeOptions)[number]["value"]
  >(() => {
    if (typeof window === "undefined") {
      return 30;
    }

    const savedRange = window.localStorage.getItem(ANALYTICS_RANGE_STORAGE_KEY);
    const normalizedRange = Number(savedRange);

    return dateRangeOptions.some((option) => option.value === normalizedRange)
      ? (normalizedRange as (typeof dateRangeOptions)[number]["value"])
      : 30;
  });
  const [snapshotPage, setSnapshotPage] = useState(1);

  const departmentMetrics = useMemo(() => {
    const groupedMetrics = mockPatients.reduce<
      Record<
        Department,
        {
          department: Department;
          patients: number;
          recoveryWeight: number;
        }
      >
    >(
      (accumulator, patient) => {
        const entry = accumulator[patient.department] ?? {
          department: patient.department,
          patients: 0,
          recoveryWeight: 0,
        };

        entry.patients += 1;
        entry.recoveryWeight += statusRecoveryWeights[patient.status];
        accumulator[patient.department] = entry;

        return accumulator;
      },
      {} as Record<
        Department,
        {
          department: Department;
          patients: number;
          recoveryWeight: number;
        }
      >,
    );

    return Object.values(groupedMetrics)
      .map((entry) => ({
        department: entry.department,
        patients: entry.patients,
        recoveryRate: Math.round((entry.recoveryWeight / entry.patients) * 100),
      }))
      .sort((left, right) => right.patients - left.patients);
  }, []);

  const lineData = useMemo(() => {
    if (dateRange === 7) {
      return admissionTrend.slice(-7);
    }

    if (dateRange === 30) {
      return admissionTrend.slice(-10);
    }

    return admissionTrend;
  }, [dateRange]);

  const totalSnapshotPages = Math.max(
    1,
    Math.ceil(departmentMetrics.length / SNAPSHOT_PAGE_SIZE),
  );
  const safeSnapshotPage = Math.min(snapshotPage, totalSnapshotPages);
  const visibleSnapshotMetrics = useMemo(() => {
    const startIndex = (safeSnapshotPage - 1) * SNAPSHOT_PAGE_SIZE;

    return departmentMetrics.slice(startIndex, startIndex + SNAPSHOT_PAGE_SIZE);
  }, [departmentMetrics, safeSnapshotPage]);

  const visibleSnapshotPages = useMemo(() => {
    return Array.from({ length: totalSnapshotPages }, (_, index) => index + 1);
  }, [totalSnapshotPages]);

  return (
    <div className="space-y-4">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
        initial={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.3 }}
      >
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-2xl md:text-[28px] font-medium tracking-[-0.03em] text-foreground line-clamp-2 sm:line-clamp-none">
            Analytics
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted line-clamp-2 sm:line-clamp-none">
            Admissions, department load, and recovery performance.
          </p>
        </div>

        <div className="inline-flex rounded-full border border-border bg-surface p-0.5 sm:p-1 flex-wrap justify-center md:justify-end gap-0.5 sm:gap-1 md:gap-0 shrink-0">
          {dateRangeOptions.map((option) => (
            <button
              className={
                dateRange === option.value
                  ? "rounded-full bg-primary-soft px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-foreground whitespace-nowrap"
                  : "rounded-full px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-muted whitespace-nowrap"
              }
              key={option.value}
              onClick={() => {
                setDateRange(option.value);
                setSnapshotPage(1);
                window.localStorage.setItem(
                  ANALYTICS_RANGE_STORAGE_KEY,
                  String(option.value),
                );
              }}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </motion.div>

      <section className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
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
                <CartesianGrid
                  stroke="var(--app-border)"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="day"
                  stroke="var(--app-subtle)"
                  tickLine={false}
                />
                <YAxis stroke="var(--app-subtle)" tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--app-surface-elevated)",
                    border: "1px solid var(--app-border)",
                    borderRadius: "12px",
                    color: "var(--app-text)",
                  }}
                />
                <Legend />
                <Line
                  dataKey="admissions"
                  dot={false}
                  animationDuration={CHART_ANIMATION_DURATION}
                  animationEasing="ease-out"
                  isAnimationActive
                  name="Admissions"
                  stroke="var(--app-primary)"
                  strokeWidth={3}
                  type="monotone"
                />
                <Line
                  dataKey="discharges"
                  dot={false}
                  animationBegin={100}
                  animationDuration={CHART_ANIMATION_DURATION}
                  animationEasing="ease-out"
                  isAnimationActive
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
                  animationDuration={CHART_ANIMATION_DURATION}
                  animationEasing="ease-out"
                  data={departmentMetrics}
                  dataKey="patients"
                  innerRadius={76}
                  isAnimationActive
                  nameKey="department"
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
                    background: "var(--app-surface-elevated)",
                    border: "1px solid var(--app-border)",
                    borderRadius: "12px",
                    color: "var(--app-text)",
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
                <CartesianGrid
                  stroke="var(--app-border)"
                  strokeDasharray="3 3"
                />
                <XAxis
                  domain={[0, 100]}
                  stroke="var(--app-subtle)"
                  type="number"
                />
                <YAxis
                  dataKey="department"
                  stroke="var(--app-subtle)"
                  tickLine={false}
                  type="category"
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--app-surface-elevated)",
                    border: "1px solid var(--app-border)",
                    borderRadius: "12px",
                    color: "var(--app-text)",
                  }}
                />
                <Bar
                  animationDuration={CHART_ANIMATION_DURATION}
                  animationEasing="ease-out"
                  dataKey="recoveryRate"
                  fill="var(--app-primary)"
                  isAnimationActive
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

            <div className="mt-6 max-h-90 space-y-4 overflow-y-auto pr-1">
              {visibleSnapshotMetrics.map((metric) => (
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
                      <p className="text-xs text-subtle">recovery</p>
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
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button
                className="h-9 cursor-pointer rounded-xl border border-border bg-surface px-3 text-sm font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                disabled={safeSnapshotPage === 1}
                onClick={() => setSnapshotPage((page) => Math.max(1, page - 1))}
                type="button"
              >
                Previous
              </button>
              {visibleSnapshotPages.map((page) => (
                <button
                  className={
                    page === safeSnapshotPage
                      ? "h-9 min-w-9 cursor-pointer rounded-xl bg-primary text-sm font-medium text-white"
                      : "h-9 min-w-9 cursor-pointer rounded-xl border border-border bg-surface text-sm font-medium text-foreground"
                  }
                  key={page}
                  onClick={() => setSnapshotPage(page)}
                  type="button"
                >
                  {page}
                </button>
              ))}
              <button
                className="h-9 cursor-pointer rounded-xl border border-border bg-surface px-3 text-sm font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                disabled={safeSnapshotPage === totalSnapshotPages}
                onClick={() =>
                  setSnapshotPage((page) =>
                    Math.min(totalSnapshotPages, page + 1),
                  )
                }
                type="button"
              >
                Next
              </button>
            </div>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
