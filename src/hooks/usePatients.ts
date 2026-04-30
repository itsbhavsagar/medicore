import { useDeferredValue, useMemo } from 'react'
import { usePatientStore } from '../store/patientStore'

export const usePatients = () => {
  const patients = usePatientStore((state) => state.patients)
  const selectedPatient = usePatientStore((state) => state.selectedPatient)
  const viewMode = usePatientStore((state) => state.viewMode)
  const searchQuery = usePatientStore((state) => state.searchQuery)
  const setView = usePatientStore((state) => state.setView)
  const selectPatient = usePatientStore((state) => state.selectPatient)
  const setSearch = usePatientStore((state) => state.setSearch)
  const addPatient = usePatientStore((state) => state.addPatient)
  const deferredSearch = useDeferredValue(searchQuery)

  const filteredPatients = useMemo(() => {
    const normalizedQuery = deferredSearch.trim().toLowerCase()

    if (!normalizedQuery) {
      return patients
    }

    return patients.filter((patient) =>
      [
        patient.name,
        patient.diagnosis,
        patient.department,
        patient.doctor,
        patient.roomNumber,
      ].some((value) => value.toLowerCase().includes(normalizedQuery)),
    )
  }, [deferredSearch, patients])

  return {
    patients,
    filteredPatients,
    selectedPatient,
    viewMode,
    searchQuery,
    setView,
    selectPatient,
    setSearch,
    addPatient,
  }
}
