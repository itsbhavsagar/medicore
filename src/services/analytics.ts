import { admissionTrend, mockPatients } from '../data/mockPatients'

const MIN_ANALYTICS_DELAY_MS = 500
const MAX_ANALYTICS_DELAY_MS = 800

interface AnalyticsData {
  patients: typeof mockPatients
  trend: typeof admissionTrend
}

let cachedAnalyticsData: AnalyticsData | null = null
let pendingAnalyticsRequest: Promise<AnalyticsData> | null = null

const getDelay = () =>
  Math.floor(
    Math.random() * (MAX_ANALYTICS_DELAY_MS - MIN_ANALYTICS_DELAY_MS + 1),
  ) + MIN_ANALYTICS_DELAY_MS

export async function fetchAnalyticsData() {
  if (cachedAnalyticsData) {
    return cachedAnalyticsData
  }

  if (!pendingAnalyticsRequest) {
    pendingAnalyticsRequest = new Promise<AnalyticsData>((resolve) => {
      window.setTimeout(() => {
        const response = {
          patients: mockPatients,
          trend: admissionTrend,
        }

        cachedAnalyticsData = response
        pendingAnalyticsRequest = null
        resolve(response)
      }, getDelay())
    })
  }

  return pendingAnalyticsRequest
}
