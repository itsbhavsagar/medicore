import { create } from 'zustand'
import { fetchPatientsData } from '../services/patients'
import type { NewPatientInput, Patient, ViewMode } from '../types'

const DEFAULT_VITALS = {
  heartRate: 78,
  bloodPressure: '120/80',
  temperature: 36.8,
  oxygenSaturation: 98,
}

interface PatientStoreState {
  initialize: () => Promise<void>
  isLoading: boolean
  isLoaded: boolean
  patients: Patient[]
  selectedPatient: Patient | null
  viewMode: ViewMode
  searchQuery: string
  setView: (viewMode: ViewMode) => void
  selectPatient: (patient: Patient | null) => void
  setSearch: (searchQuery: string) => void
  addPatient: (patient: NewPatientInput) => Patient
}

export const usePatientStore = create<PatientStoreState>((set) => ({
  initialize: async () => {
    set({ isLoading: true })

    try {
      const patients = await fetchPatientsData()
      set({
        isLoaded: true,
        isLoading: false,
        patients,
      })
    } catch {
      set({
        isLoaded: true,
        isLoading: false,
        patients: [],
      })
    }
  },
  isLoading: false,
  isLoaded: false,
  patients: [],
  selectedPatient: null,
  viewMode: 'grid',
  searchQuery: '',
  setView: (viewMode) => set({ viewMode }),
  selectPatient: (selectedPatient) => set({ selectedPatient }),
  setSearch: (searchQuery) => set({ searchQuery }),
  addPatient: (patient) => {
    const createdPatient: Patient = {
      id: `PT-${Date.now().toString().slice(-6)}`,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      bloodType: patient.bloodType,
      diagnosis: patient.diagnosis,
      status: patient.status,
      roomNumber: patient.roomNumber,
      admissionDate: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      doctor: patient.doctor,
      department: patient.department,
      medications: patient.medications,
      vitals: DEFAULT_VITALS,
      emergencyContact: {
        name: patient.emergencyContactName,
        relationship: patient.emergencyContactRelationship,
        phone: patient.emergencyContactPhone,
      },
    }

    set((state) => ({
      patients: [createdPatient, ...state.patients],
      selectedPatient: createdPatient,
    }))

    return createdPatient
  },
}))
