import { CalendarDays, DoorClosed, Stethoscope } from "lucide-react";
import type { Patient } from "../../types";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

interface PatientCardProps {
  patient: Patient;
  onSelect: (patient: Patient) => void;
}

export function PatientCard({ onSelect, patient }: PatientCardProps) {
  return (
    <button
      className="cursor-pointer text-left w-full"
      onClick={() => onSelect(patient)}
      type="button"
    >
      <Card className="h-full p-3 sm:p-4" interactive>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Avatar
              className="h-8 w-8 sm:h-10 sm:w-10 shrink-0"
              name={patient.name}
              status={patient.status}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm sm:text-base font-medium tracking-[-0.02em] text-foreground truncate">
                {patient.name}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-muted truncate">
                {patient.age} years old • {patient.gender}
              </p>
            </div>
          </div>
          <Badge
            className="px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] shrink-0"
            status={patient.status}
          />
        </div>

        <div className="mt-3 sm:mt-5 space-y-3 sm:space-y-4">
          <div>
            <p className="text-xs text-subtle">Diagnosis</p>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-foreground">
              {patient.diagnosis}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted">
              <DoorClosed className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-subtle shrink-0" />
              <span className="min-w-12 sm:min-w-16 shrink-0">Room</span>
              <p className="font-medium text-foreground truncate">
                {patient.roomNumber}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted">
              <Stethoscope className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-subtle shrink-0" />
              <span className="min-w-12 sm:min-w-16 shrink-0">Doctor</span>
              <p className="font-medium text-foreground truncate">
                {patient.doctor}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted">
              <CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-subtle shrink-0" />
              <span className="min-w-12 sm:min-w-16 shrink-0">Last visit</span>
              <p className="font-medium text-foreground truncate">
                {new Date(patient.lastVisit).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </button>
  );
}
