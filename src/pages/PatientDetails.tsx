import { Search } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { PatientCard } from '../components/patients/PatientCard'
import { PatientRow } from '../components/patients/PatientRow'
import { PatientSidePanel } from '../components/patients/PatientSidePanel'
import { ViewToggle } from '../components/patients/ViewToggle'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { usePatients } from '../hooks/usePatients'

const SEARCH_DEBOUNCE_MS = 250

export function PatientDetails() {
  const {
    filteredPatients,
    selectedPatient,
    searchQuery,
    selectPatient,
    setSearch,
    setView,
    viewMode,
  } = usePatients()
  const [localSearch, setLocalSearch] = useState(searchQuery)

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setSearch(localSearch),
      SEARCH_DEBOUNCE_MS,
    )

    return () => window.clearTimeout(timeoutId)
  }, [localSearch, setSearch])

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden bg-[linear-gradient(145deg,var(--app-primary-soft),transparent_40%),var(--app-surface)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge tone="info">Patient directory</Badge>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-foreground">
              Search and review active patient records
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
              Switch between a quick-scan grid and a denser list view while
              keeping the current patient selection in shared state.
            </p>
          </div>
          <ViewToggle onChange={setView} value={viewMode} />
        </div>
      </Card>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
          <input
            className="h-12 w-full rounded-2xl border border-border bg-surface px-12 text-sm text-foreground outline-none transition placeholder:text-subtle focus:border-primary"
            onChange={(event) => setLocalSearch(event.target.value)}
            placeholder="Search by patient, diagnosis, doctor, department, or room"
            type="search"
            value={localSearch}
          />
        </div>
        <p className="text-sm text-muted">
          Showing {filteredPatients.length} of 20 patients
        </p>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.section
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            initial={{ opacity: 0, y: 8 }}
            key="grid-view"
            layout
            transition={{ duration: 0.22 }}
          >
            {filteredPatients.map((patient) => (
              <motion.div key={patient.id} layout>
                <PatientCard onSelect={selectPatient} patient={patient} />
              </motion.div>
            ))}
          </motion.section>
        ) : (
          <motion.section
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
            initial={{ opacity: 0, y: 8 }}
            key="list-view"
            transition={{ duration: 0.22 }}
          >
            <div className="hidden grid-cols-[1.5fr_0.8fr_1.2fr_0.8fr_0.9fr] gap-4 px-5 text-xs font-semibold uppercase tracking-[0.18em] text-subtle xl:grid">
              <span>Patient</span>
              <span>Diagnosis</span>
              <span>Status</span>
              <span>Room</span>
              <span>Last visit</span>
            </div>

            {filteredPatients.map((patient) => (
              <motion.div key={patient.id} layout>
                <PatientRow onSelect={selectPatient} patient={patient} />
              </motion.div>
            ))}
          </motion.section>
        )}
      </AnimatePresence>

      <PatientSidePanel
        onClose={() => selectPatient(null)}
        patient={selectedPatient}
      />
    </div>
  )
}
