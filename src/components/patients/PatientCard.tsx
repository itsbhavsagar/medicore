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
    <button
      className="cursor-pointer text-left"
      onClick={() => onSelect(patient)}
      type="button"
    >
      <Card className="h-full p-4" interactive>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={patient.name} status={patient.status} />
            <div>
              <p className="text-base font-medium tracking-[-0.02em] text-foreground">
                {patient.name}
              </p>
              <p className="mt-1 text-sm text-muted">
                {patient.age} years old • {patient.gender}
              </p>
            </div>
          </div>
          <Badge className="px-2.5 py-0.5 text-[11px]" status={patient.status} />
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <p className="text-xs text-subtle">
              Diagnosis
            </p>
            <p className="mt-2 text-sm leading-6 text-foreground">
              {patient.diagnosis}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted">
              <DoorClosed className="h-4 w-4 text-subtle" />
              <span className="min-w-16">Room</span>
              <p className="font-medium text-foreground">
                {patient.roomNumber}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <Stethoscope className="h-4 w-4 text-subtle" />
              <span className="min-w-16">Doctor</span>
              <p className="font-medium text-foreground">
                {patient.doctor}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <CalendarDays className="h-4 w-4 text-subtle" />
              <span className="min-w-16">Last visit</span>
              <p className="font-medium text-foreground">
                {new Date(patient.lastVisit).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </button>
  )
}
