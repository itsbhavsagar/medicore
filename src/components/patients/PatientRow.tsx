import type { Patient } from "../../types";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { cn } from "../../utils/cn";

interface PatientRowProps {
  patient: Patient;
  onSelect: (patient: Patient) => void;
}

export function PatientRow({ onSelect, patient }: PatientRowProps) {
  return (
    <button
      className={cn(
        "w-full cursor-pointer rounded-xl border border-border bg-surface px-3 sm:px-5 py-3 sm:py-4 text-left transition duration-200 hover:border-primary/20 hover:bg-surface-elevated",
      )}
      onClick={() => onSelect(patient)}
      type="button"
    >
      <div className="flex flex-col sm:grid sm:grid-cols-[1.5fr_0.8fr_1.2fr_0.8fr_0.9fr] sm:items-center sm:gap-4 gap-3">
        <div className="flex items-center gap-3">
          <Avatar
            className="h-8 sm:h-10 w-8 sm:w-10 text-xs flex-shrink-0"
            name={patient.name}
            status={patient.status}
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-foreground truncate">
              {patient.name}
            </p>
            <p className="mt-1 text-xs text-muted truncate">
              {patient.age} • {patient.gender}
            </p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-foreground truncate sm:block hidden">
          {patient.diagnosis}
        </p>
        <Badge
          className="justify-start sm:justify-center w-fit"
          status={patient.status}
        />
        <div className="hidden sm:block">
          <p className="text-xs sm:text-sm font-medium text-foreground truncate">
            {patient.roomNumber}
          </p>
          <p className="mt-1 text-xs text-subtle truncate">
            {patient.department}
          </p>
        </div>
        <p className="text-xs sm:text-sm text-muted truncate hidden sm:block">
          {new Date(patient.lastVisit).toLocaleDateString()}
        </p>
      </div>
    </button>
  );
}
