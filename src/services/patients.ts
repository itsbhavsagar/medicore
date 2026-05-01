import { mockPatients } from '../data/mockPatients'
import { createMockResource } from './mockResource'

const MIN_PATIENT_DELAY_MS = 500
const MAX_PATIENT_DELAY_MS = 800

export const fetchPatientsData = createMockResource(
  () => mockPatients,
  {
    maxDelayMs: MAX_PATIENT_DELAY_MS,
    minDelayMs: MIN_PATIENT_DELAY_MS,
  },
)
