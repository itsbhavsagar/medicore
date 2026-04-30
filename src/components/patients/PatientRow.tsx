import type { Patient } from '../../types'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'
import { cn } from '../../utils/cn'

interface PatientRowProps {
  patient: Patient
  onSelect: (patient: Patient) => void
}

export function PatientRow({ onSelect, patient }: PatientRowProps) {
  return (
    <button
      className={cn(
        'grid w-full grid-cols-[1.5fr_0.8fr_1.2fr_0.8fr_0.9fr] items-center gap-4 rounded-[24px] border border-border bg-surface px-5 py-4 text-left transition duration-200 hover:border-primary/30 hover:bg-surface-elevated',
      )}
      onClick={() => onSelect(patient)}
      type="button"
    >
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10 rounded-xl text-xs" name={patient.name} />
        <div>
          <p className="text-sm font-semibold text-foreground">{patient.name}</p>
          <p className="mt-1 text-sm text-muted">
            {patient.age} • {patient.gender}
          </p>
        </div>
      </div>
      <p className="text-sm text-foreground">{patient.diagnosis}</p>
      <Badge className="justify-center" status={patient.status} />
      <div>
        <p className="text-sm font-semibold text-foreground">{patient.roomNumber}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-subtle">
          {patient.department}
        </p>
      </div>
      <p className="text-sm text-muted">
        {new Date(patient.lastVisit).toLocaleDateString()}
      </p>
    </button>
  )
}
