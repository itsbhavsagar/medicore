import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import type {
  BloodType,
  Department,
  Gender,
  NewPatientInput,
  PatientStatus,
} from '../../types'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

interface AddPatientModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (patient: NewPatientInput) => void
}

const genderOptions: Gender[] = ['Female', 'Male', 'Non-binary']
const bloodTypeOptions: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const departmentOptions: Department[] = [
  'Cardiology',
  'Neurology',
  'Oncology',
  'Orthopedics',
  'Pulmonology',
  'Emergency',
  'Pediatrics',
]
const statusOptions: PatientStatus[] = [
  'Critical',
  'Stable',
  'Recovering',
  'Discharged',
]

const initialState: NewPatientInput = {
  name: '',
  age: 0,
  gender: 'Female',
  bloodType: 'A+',
  diagnosis: '',
  status: 'Stable',
  roomNumber: '',
  doctor: '',
  department: 'Cardiology',
  medications: [],
  emergencyContactName: '',
  emergencyContactRelationship: '',
  emergencyContactPhone: '',
}

export function AddPatientModal({
  isOpen,
  onClose,
  onSubmit,
}: AddPatientModalProps) {
  const [formState, setFormState] = useState<NewPatientInput>(initialState)
  const [medicationInput, setMedicationInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const requiredFieldsFilled = useMemo(
    () =>
      Boolean(
        formState.name.trim() &&
          formState.age > 0 &&
          formState.diagnosis.trim() &&
          formState.roomNumber.trim() &&
          formState.doctor.trim() &&
          formState.emergencyContactName.trim() &&
          formState.emergencyContactRelationship.trim() &&
          formState.emergencyContactPhone.trim(),
      ),
    [formState],
  )

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  const updateField = <Key extends keyof NewPatientInput>(
    field: Key,
    value: NewPatientInput[Key],
  ) => {
    setFormState((current) => ({ ...current, [field]: value }))
  }

  const handleAddMedication = () => {
    if (!medicationInput.trim()) {
      return
    }

    updateField('medications', [
      ...formState.medications,
      medicationInput.trim(),
    ])
    setMedicationInput('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!requiredFieldsFilled) {
      setError('Complete the required fields before saving the patient.')

      return
    }

    onSubmit({
      ...formState,
      medications: formState.medications.length > 0 ? formState.medications : ['Observation pending'],
    })
    setFormState(initialState)
    setMedicationInput('')
    setError(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 cursor-pointer bg-background/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            onClick={onClose}
            type="button"
          />
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="fixed inset-x-4 top-4 z-50 mx-auto w-full max-w-2xl"
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            transition={{ duration: 0.22 }}
          >
            <Card className="max-h-[calc(100vh-2rem)] overflow-y-auto p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[22px] font-medium tracking-[-0.03em] text-foreground">
                    Add patient
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Create a new patient record for the current care roster.
                  </p>
                </div>
                <Button className="cursor-pointer" onClick={onClose} size="sm" variant="ghost">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Full name" required>
                    <input
                      className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm text-foreground outline-none"
                      onChange={(event) => updateField('name', event.target.value)}
                      value={formState.name}
                    />
                  </Field>
                  <Field label="Age" required>
                    <input
                      className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm text-foreground outline-none"
                      min="0"
                      onChange={(event) => updateField('age', Number(event.target.value))}
                      type="number"
                      value={formState.age || ''}
                    />
                  </Field>
                  <Field label="Diagnosis" required>
                    <input
                      className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm text-foreground outline-none"
                      onChange={(event) => updateField('diagnosis', event.target.value)}
                      value={formState.diagnosis}
                    />
                  </Field>
                  <Field label="Room number" required>
                    <input
                      className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm text-foreground outline-none"
                      onChange={(event) => updateField('roomNumber', event.target.value)}
                      value={formState.roomNumber}
                    />
                  </Field>
                  <Field label="Doctor" required>
                    <input
                      className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm text-foreground outline-none"
                      onChange={(event) => updateField('doctor', event.target.value)}
                      value={formState.doctor}
                    />
                  </Field>
                  <Field label="Status">
                    <select
                      className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm text-foreground outline-none"
                      onChange={(event) => updateField('status', event.target.value as PatientStatus)}
                      value={formState.status}
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Department">
                    <select
                      className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm text-foreground outline-none"
                      onChange={(event) => updateField('department', event.target.value as Department)}
                      value={formState.department}
                    >
                      {departmentOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Gender">
                    <select
                      className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm text-foreground outline-none"
                      onChange={(event) => updateField('gender', event.target.value as Gender)}
                      value={formState.gender}
                    >
                      {genderOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Blood type">
                    <select
                      className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm text-foreground outline-none"
                      onChange={(event) => updateField('bloodType', event.target.value as BloodType)}
                      value={formState.bloodType}
                    >
                      {bloodTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Emergency contact" required>
                    <input
                      className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm text-foreground outline-none"
                      onChange={(event) => updateField('emergencyContactName', event.target.value)}
                      value={formState.emergencyContactName}
                    />
                  </Field>
                  <Field label="Relationship" required>
                    <input
                      className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm text-foreground outline-none"
                      onChange={(event) =>
                        updateField('emergencyContactRelationship', event.target.value)
                      }
                      value={formState.emergencyContactRelationship}
                    />
                  </Field>
                  <Field label="Contact phone" required>
                    <input
                      className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm text-foreground outline-none"
                      onChange={(event) => updateField('emergencyContactPhone', event.target.value)}
                      value={formState.emergencyContactPhone}
                    />
                  </Field>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Medications
                  </label>
                  <div className="flex gap-3">
                    <input
                      className="h-10 flex-1 rounded-xl border border-border bg-surface-elevated px-3 text-sm text-foreground outline-none"
                      onChange={(event) => setMedicationInput(event.target.value)}
                      placeholder="Add medication"
                      value={medicationInput}
                    />
                    <Button
                      className="cursor-pointer"
                      onClick={handleAddMedication}
                      type="button"
                      variant="secondary"
                    >
                      Add
                    </Button>
                  </div>
                  {formState.medications.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formState.medications.map((medication) => (
                        <span
                          className="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary"
                          key={medication}
                        >
                          {medication}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                {error ? <p className="text-sm text-muted">{error}</p> : null}

                <div className="flex justify-end gap-3 pt-1">
                  <Button className="cursor-pointer" onClick={onClose} variant="secondary">
                    Cancel
                  </Button>
                  <Button className="cursor-pointer" type="submit">
                    Save patient
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}

function Field({
  children,
  label,
  required = false,
}: {
  children: ReactNode
  label: string
  required?: boolean
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-foreground">
        {label}
        {required ? ' *' : ''}
      </span>
      {children}
    </label>
  )
}
