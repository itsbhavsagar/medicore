export type ThemeMode = 'light' | 'dark'

export type ViewMode = 'grid' | 'list'

export type PatientStatus = 'Critical' | 'Stable' | 'Recovering' | 'Discharged'

export type Department =
  | 'Cardiology'
  | 'Neurology'
  | 'Oncology'
  | 'Orthopedics'
  | 'Pulmonology'
  | 'Emergency'
  | 'Pediatrics'

export type Gender = 'Female' | 'Male' | 'Non-binary'

export type BloodType =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-'

export interface Vitals {
  heartRate: number
  bloodPressure: string
  temperature: number
  oxygenSaturation: number
}

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
}

export interface Patient {
  id: string
  name: string
  age: number
  gender: Gender
  bloodType: BloodType
  diagnosis: string
  status: PatientStatus
  roomNumber: string
  admissionDate: string
  lastVisit: string
  doctor: string
  department: Department
  medications: string[]
  vitals: Vitals
  emergencyContact: EmergencyContact
}

export interface AuthUser {
  uid: string
  email: string
  name: string
}

export interface DashboardStat {
  id: string
  label: string
  value: number
  change: number
  trend: 'up' | 'down'
}

export interface ActivityItem {
  id: string
  patientId: string
  patientName: string
  detail: string
  occurredAt: string
  status: PatientStatus
}

export interface DepartmentMetric {
  department: Department
  patients: number
  recoveryRate: number
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  createdAt: string
  read: boolean
}

export type ToastTone = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  title: string
  message: string
  tone: ToastTone
}

export interface AiSummaryPayload {
  patient: Patient
}

export interface NewPatientInput {
  name: string
  age: number
  gender: Gender
  bloodType: BloodType
  diagnosis: string
  status: PatientStatus
  roomNumber: string
  doctor: string
  department: Department
  medications: string[]
  emergencyContactName: string
  emergencyContactRelationship: string
  emergencyContactPhone: string
}
