import { dashboardStats, recentActivity } from "../data/mockPatients";
import { createMockResource } from "./mockResource";

const MIN_DASHBOARD_DELAY_MS = 500;
const MAX_DASHBOARD_DELAY_MS = 800;

interface DashboardData {
  activity: typeof recentActivity;
  stats: typeof dashboardStats;
}

export const fetchDashboardData = createMockResource<DashboardData>(
  () => ({
    activity: recentActivity,
    stats: dashboardStats,
  }),
  {
    maxDelayMs: MAX_DASHBOARD_DELAY_MS,
    minDelayMs: MIN_DASHBOARD_DELAY_MS,
  },
);
