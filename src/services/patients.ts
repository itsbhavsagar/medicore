import { mockPatients } from '../data/mockPatients'

const MIN_PATIENT_DELAY_MS = 500
const MAX_PATIENT_DELAY_MS = 800

let cachedPatients: typeof mockPatients | null = null
let pendingPatientsRequest: Promise<typeof mockPatients> | null = null

const getDelay = () =>
  Math.floor(
    Math.random() * (MAX_PATIENT_DELAY_MS - MIN_PATIENT_DELAY_MS + 1),
  ) + MIN_PATIENT_DELAY_MS

export async function fetchPatientsData() {
  if (cachedPatients) {
    return cachedPatients
  }

  if (!pendingPatientsRequest) {
    pendingPatientsRequest = new Promise<typeof mockPatients>((resolve) => {
      window.setTimeout(() => {
        cachedPatients = mockPatients
        pendingPatientsRequest = null
        resolve(mockPatients)
      }, getDelay())
    })
  }

  return pendingPatientsRequest
}
