import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  Phone,
  Pill,
  Stethoscope,
  UserRoundX,
  X,
} from 'lucide-react'
import type { Patient } from '../../types'
import { AIPatientSummary } from './AIPatientSummary'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

interface PatientSidePanelProps {
  patient: Patient | null
  onClose: () => void
}

export function PatientSidePanel({
  onClose,
  patient,
}: PatientSidePanelProps) {
  return (
    <AnimatePresence>
      {patient ? (
        <>
          <motion.button
            animate={{ opacity: 1 }}
            aria-label="Close patient panel"
            className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            onClick={onClose}
            type="button"
          />
          <motion.aside
            animate={{ opacity: 1, x: 0 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl overflow-y-auto border-l border-border bg-background p-5 shadow-[var(--app-shadow)]"
            initial={{ opacity: 0, x: 32 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="min-h-full bg-surface-elevated p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 text-base" name={patient.name} status={patient.status} />
                  <div>
                    <p className="text-[28px] font-medium tracking-[-0.03em] text-foreground">
                      {patient.name}
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      {patient.age} years old • {patient.gender} • Blood type{' '}
                      {patient.bloodType}
                    </p>
                  </div>
                </div>
                <Button onClick={onClose} size="sm" variant="ghost">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Badge status={patient.status} />
                <Badge tone="info">{patient.department}</Badge>
                <Badge tone="neutral">Room {patient.roomNumber}</Badge>
              </div>

              <div className="mt-10 grid gap-6">
                <Card className="bg-surface p-5">
                  <div className="flex items-center gap-3">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    <p className="text-sm font-medium text-foreground">
                      Care ownership
                    </p>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted">
                    {patient.doctor}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Diagnosis: {patient.diagnosis}
                  </p>
                </Card>
                <Card className="bg-surface p-5">
                  <div className="flex items-center gap-3">
                    <UserRoundX className="h-5 w-5 text-accent" />
                    <p className="text-sm font-medium text-foreground">
                      Emergency contact
                    </p>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted">
                    {patient.emergencyContact.name} •{' '}
                    {patient.emergencyContact.relationship}
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-muted">
                    <Phone className="h-4 w-4" />
                    {patient.emergencyContact.phone}
                  </p>
                </Card>
              </div>

              <div className="mt-10 grid gap-6">
                <Card className="bg-surface p-5">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-primary" />
                    <p className="text-sm font-medium text-foreground">Vitals</p>
                  </div>
                  <div className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <p className="text-xs text-subtle">
                        Heart rate
                      </p>
                      <p className="mt-2 text-lg font-medium text-foreground">
                        {patient.vitals.heartRate} bpm
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-subtle">
                        Blood pressure
                      </p>
                      <p className="mt-2 text-lg font-medium text-foreground">
                        {patient.vitals.bloodPressure}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-subtle">
                        Temperature
                      </p>
                      <p className="mt-2 text-lg font-medium text-foreground">
                        {patient.vitals.temperature}°C
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-subtle">
                        O2 saturation
                      </p>
                      <p className="mt-2 text-lg font-medium text-foreground">
                        {patient.vitals.oxygenSaturation}%
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-surface p-5">
                  <div className="flex items-center gap-3">
                    <Pill className="h-5 w-5 text-accent" />
                    <p className="text-sm font-medium text-foreground">
                      Active medications
                    </p>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {patient.medications.map((medication) => (
                      <Badge key={medication} tone="neutral">
                        {medication}
                      </Badge>
                    ))}
                  </div>
                </Card>

                <AIPatientSummary patient={patient} />
              </div>
            </Card>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}
