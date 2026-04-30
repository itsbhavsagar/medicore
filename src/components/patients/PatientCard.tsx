import { CalendarDays, DoorClosed, Stethoscope } from 'lucide-react'
import type { Patient } from '../../types'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'

interface PatientCardProps {
  patient: Patient
  onSelect: (patient: Patient) => void
}

export function PatientCard({ onSelect, patient }: PatientCardProps) {
  return (
    <button className="text-left" onClick={() => onSelect(patient)} type="button">
      <Card className="h-full" interactive>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={patient.name} />
            <div>
              <p className="text-lg font-semibold tracking-[-0.03em] text-foreground">
                {patient.name}
              </p>
              <p className="mt-1 text-sm text-muted">
                {patient.age} years old • {patient.gender}
              </p>
            </div>
          </div>
          <Badge status={patient.status} />
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-subtle">
              Diagnosis
            </p>
            <p className="mt-2 text-sm leading-6 text-foreground">
              {patient.diagnosis}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-surface-elevated p-3">
              <DoorClosed className="h-4 w-4 text-primary" />
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-subtle">
                Room
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {patient.roomNumber}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface-elevated p-3">
              <Stethoscope className="h-4 w-4 text-accent" />
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-subtle">
                Doctor
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {patient.doctor}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface-elevated p-3">
              <CalendarDays className="h-4 w-4 text-primary" />
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-subtle">
                Last visit
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {new Date(patient.lastVisit).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </button>
  )
}
