import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarCheck2,
  HeartPulse,
  UsersRound,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../utils/cn";
import { useAuth } from "../hooks/useAuth";
import { fetchDashboardData } from "../services/dashboard";
import type { ActivityItem, DashboardStat } from "../types";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { Skeleton } from "../components/ui/Skeleton";

const COUNT_UP_DURATION_MS = 900;
const COUNT_UP_STEP_MS = 24;

const statIcons: Record<DashboardStat["id"], typeof UsersRound> = {
  "total-patients": UsersRound,
  "critical-cases": AlertTriangle,
  "appointments-today": CalendarCheck2,
  "avg-recovery-rate": HeartPulse,
};

function useCountUp(targetValue: number) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = Math.max(
      1,
      Math.floor(COUNT_UP_DURATION_MS / COUNT_UP_STEP_MS),
    );

    const intervalId = window.setInterval(() => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      setValue(Math.round(targetValue * progress));

      if (progress >= 1) {
        window.clearInterval(intervalId);
      }
    }, COUNT_UP_STEP_MS);

    return () => window.clearInterval(intervalId);
  }, [targetValue]);

  return value;
}

function StatCard({ stat }: { stat: DashboardStat }) {
  const Icon = statIcons[stat.id];
  const animatedValue = useCountUp(stat.value);
  const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
  const trendColor =
    stat.id === "critical-cases"
      ? "text-success"
      : stat.trend === "up"
        ? "text-success"
        : "text-danger";
  const suffix = stat.id === "avg-recovery-rate" ? "%" : "";

  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-sm font-medium text-muted">{stat.label}</p>
      </div>
      <div className="space-y-2">
        <p className="text-3xl font-bold tracking-[-0.04em] text-foreground">
          {animatedValue}
          {suffix}
        </p>
        <div
          className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}
        >
          <TrendIcon className="h-3.5 w-3.5" />
          <span>{stat.change}%</span>
        </div>
      </div>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="mt-3 h-9 w-52 max-w-full" />
            <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
            <Skeleton className="mt-2 h-4 w-[82%] max-w-xl" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-11 w-36 rounded-xl" />
            <Skeleton className="h-11 w-36 rounded-xl" />
          </div>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={`stat-skeleton-${index}`} className="space-y-4 p-5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-4 w-14" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-60 max-w-full" />
            </div>
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </Card>
        <Card className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-56 max-w-full" />
          </div>
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </Card>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      setIsLoading(true);

      try {
        const response = await fetchDashboardData();

        if (!isMounted) {
          return;
        }

        setStats(response.stats ?? []);
        setActivity(response.activity ?? []);
      } catch {
        if (!isMounted) {
          return;
        }

        setStats([]);
        setActivity([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const quickActions = useMemo(
    () => [
      { label: "Patients", icon: UsersRound, to: "/patients" },
      { label: "View Analytics", icon: HeartPulse, to: "/analytics" },
    ],
    [],
  );

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-muted">
                <span className="h-2 w-2 rounded-full bg-accent" />
                Welcome back
              </p>
              <h2 className="mt-3 text-[28px] font-medium tracking-[-0.03em] text-foreground">
                {user?.name ?? "Care team"}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                Here’s your morning snapshot across admissions, critical care,
                and department-level momentum.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {quickActions.map(({ icon: Icon, label, to }) => (
                <Link
                  className={cn(
                    label === "Patients"
                      ? "inline-flex min-w-36 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition duration-200"
                      : "inline-flex min-w-36 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition duration-200 hover:bg-surface-elevated",
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
      </motion.div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 16 }}
            key={stat.id}
            transition={{ delay: index * 0.06, duration: 0.28 }}
          >
            <StatCard stat={stat} />
          </motion.div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 14 }}
          transition={{ delay: 0.18, duration: 0.28 }}
        >
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-foreground">
                  Recent activity
                </p>
                <p className="mt-1 text-sm text-muted">
                  Latest patient updates from the last clinical rounds.
                </p>
              </div>
              <Badge tone="info">Live feed</Badge>
            </div>

            <div className="mt-6 space-y-4">
              {activity.length > 0 ? (
                activity.map((activityItem) => (
                  <div
                    className="rounded-xl border border-border bg-surface-elevated p-4"
                    key={activityItem.id}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {activityItem.patientName}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-muted">
                          {activityItem.detail}
                        </p>
                      </div>
                      <Badge status={activityItem.status} />
                    </div>
                    <p className="mt-4 text-xs text-subtle">
                      {new Date(activityItem.occurredAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-border bg-surface-elevated p-4">
                  <p className="text-sm font-medium text-foreground">
                    No recent activity
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Patient updates will appear here once new activity is
                    available.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 14 }}
          transition={{ delay: 0.24, duration: 0.28 }}
        >
          <Card>
            <div>
              <p className="text-base font-medium text-foreground">
                Team priorities
              </p>
              <p className="mt-1 text-sm text-muted">
                Focus areas for today’s clinical operations.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-border bg-surface-elevated p-4">
                <p className="text-sm font-medium text-foreground">
                  Review all ICU critical cases before noon
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Ava Thompson, Henry Walker, Benjamin Scott, Jackson Cooper,
                  and Owen Turner all need specialist follow-up.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-surface-elevated p-4">
                <p className="text-sm font-medium text-foreground">
                  Coordinate department recovery plans
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Orthopedics and Pediatrics are pacing ahead, while Pulmonology
                  requires closer discharge planning.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-surface-elevated p-4">
                <p className="text-sm font-medium text-foreground">
                  Align afternoon appointment load
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  14 appointments are scheduled today. Prioritize cardiology and
                  oncology check-ins first.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
