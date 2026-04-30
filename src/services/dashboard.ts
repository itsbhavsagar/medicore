import { dashboardStats, recentActivity } from "../data/mockPatients";

const MIN_DASHBOARD_DELAY_MS = 500;
const MAX_DASHBOARD_DELAY_MS = 800;

interface DashboardData {
  activity: typeof recentActivity;
  stats: typeof dashboardStats;
}

let cachedDashboardData: DashboardData | null = null;
let pendingDashboardRequest: Promise<DashboardData> | null = null;

const getDelay = () =>
  Math.floor(
    Math.random() * (MAX_DASHBOARD_DELAY_MS - MIN_DASHBOARD_DELAY_MS + 1),
  ) + MIN_DASHBOARD_DELAY_MS;

export async function fetchDashboardData() {
  if (cachedDashboardData) {
    return cachedDashboardData;
  }

  if (!pendingDashboardRequest) {
    pendingDashboardRequest = new Promise<DashboardData>((resolve) => {
      window.setTimeout(() => {
        const response = {
          activity: recentActivity,
          stats: dashboardStats,
        };

        cachedDashboardData = response;
        pendingDashboardRequest = null;
        resolve(response);
      }, getDelay());
    });
  }

  return pendingDashboardRequest;
}
