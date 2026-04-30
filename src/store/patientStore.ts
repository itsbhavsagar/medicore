import { create } from 'zustand'
import { mockPatients } from '../data/mockPatients'
import type { Patient, ViewMode } from '../types'

interface PatientStoreState {
  patients: Patient[]
  selectedPatient: Patient | null
  viewMode: ViewMode
  searchQuery: string
  setView: (viewMode: ViewMode) => void
  selectPatient: (patient: Patient | null) => void
  setSearch: (searchQuery: string) => void
}

export const usePatientStore = create<PatientStoreState>((set) => ({
  patients: mockPatients,
  selectedPatient: null,
  viewMode: 'grid',
  searchQuery: '',
  setView: (viewMode) => set({ viewMode }),
  selectPatient: (selectedPatient) => set({ selectedPatient }),
  setSearch: (searchQuery) => set({ searchQuery }),
}))
