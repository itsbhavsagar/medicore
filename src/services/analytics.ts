import { admissionTrend, mockPatients } from '../data/mockPatients'
import { createMockResource } from './mockResource'

const MIN_ANALYTICS_DELAY_MS = 500
const MAX_ANALYTICS_DELAY_MS = 800

interface AnalyticsData {
  patients: typeof mockPatients
  trend: typeof admissionTrend
}

export const fetchAnalyticsData = createMockResource<AnalyticsData>(
  () => ({
    patients: mockPatients,
    trend: admissionTrend,
  }),
  {
    maxDelayMs: MAX_ANALYTICS_DELAY_MS,
    minDelayMs: MIN_ANALYTICS_DELAY_MS,
  },
)
