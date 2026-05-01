import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { usePatientForm } from "../../hooks/usePatientForm";

import type { BloodType, Department, Gender, PatientStatus } from "../../types";
import {
  FIELD_MAX_LENGTH,
  getFieldCharacterCount,
  sanitizeAgeInput,
  sanitizePhoneInput,
} from "../../utils/patientFormValidation";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Select } from "../ui/Select";

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    patient: import("../../types").NewPatientInput,
  ) => void | Promise<void>;
}

const genderOptions: Gender[] = ["Male", "Female", "Non-binary"];
const bloodTypeOptions: BloodType[] = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];
const departmentOptions: Department[] = [
  "Cardiology",
  "Neurology",
  "Oncology",
  "Orthopedics",
  "Pulmonology",
  "Emergency",
  "Pediatrics",
];
const statusOptions: PatientStatus[] = [
  "Critical",
  "Stable",
  "Recovering",
  "Discharged",
];

export function AddPatientModal({
  isOpen,
  onClose,
  onSubmit,
}: AddPatientModalProps) {
  const {
    addMedication,
    errors,
    handleBlur,
    handleMedicationInputChange,
    handleSubmit,
    isSubmitting,
    isValid,
    medicationError,
    medicationInput,
    removeMedication,
    resetForm,
    setFieldValue,
    touched,
    values,
  } = usePatientForm(onSubmit);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

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
            className="fixed inset-x-3 top-3 z-50 mx-auto w-auto max-w-2xl sm:inset-x-4 sm:top-4 sm:w-full"
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            transition={{ duration: 0.22 }}
          >
            <Card className="max-h-[calc(100vh-1.5rem)] overflow-y-auto p-3 sm:max-h-[calc(100vh-2rem)] sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-medium tracking-[-0.03em] text-foreground sm:text-[22px]">
                    Add patient
                  </p>
                  <p className="mt-1 text-xs text-muted sm:text-sm">
                    Create a new patient record for the current care roster.
                  </p>
                </div>
                <Button
                  className="cursor-pointer"
                  onClick={() => {
                    resetForm();
                    onClose();
                  }}
                  size="sm"
                  variant="ghost"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form
                className="mt-4 space-y-3 sm:mt-5 sm:space-y-4"
                noValidate
                onSubmit={async (event) => {
                  event.preventDefault();
                  const didSubmit = await handleSubmit();

                  if (didSubmit) {
                    onClose();
                  }
                }}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    error={touched.name ? errors.name : undefined}
                    htmlFor="patient-name"
                    label="Full name"
                    required
                  >
                    <input
                      aria-describedby="patient-name-error patient-name-hint"
                      aria-invalid={Boolean(touched.name && errors.name)}
                      className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm text-foreground outline-none"
                      id="patient-name"
                      maxLength={FIELD_MAX_LENGTH.name}
                      onBlur={() => handleBlur("name")}
                      onChange={(event) =>
                        setFieldValue("name", event.target.value)
                      }
                      value={values.name}
                    />
                    <FieldHint id="patient-name-hint">
                      {getFieldCharacterCount(values.name)}/
                      {FIELD_MAX_LENGTH.name}
                    </FieldHint>
                  </Field>
                  <Field
                    error={touched.age ? errors.age : undefined}
                    htmlFor="patient-age"
                    label="Age"
                    required
                  >
                    <input
                      aria-describedby="patient-age-error"
                      aria-invalid={Boolean(touched.age && errors.age)}
                      className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm text-foreground outline-none"
                      id="patient-age"
                      inputMode="numeric"
                      max="120"
                      min="1"
                      onBlur={() => handleBlur("age")}
                      onChange={(event) =>
                        setFieldValue(
                          "age",
                          sanitizeAgeInput(event.target.value),
                        )
                      }
                      pattern="[0-9]*"
                      step="1"
                      type="text"
                      value={values.age}
                    />
                  </Field>
                  <Field
                    error={touched.diagnosis ? errors.diagnosis : undefined}
                    htmlFor="patient-diagnosis"
                    label="Diagnosis"
                    required
                  >
                    <input
                      aria-describedby="patient-diagnosis-error patient-diagnosis-hint"
                      aria-invalid={Boolean(
                        touched.diagnosis && errors.diagnosis,
                      )}
                      className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm text-foreground outline-none"
                      id="patient-diagnosis"
                      maxLength={FIELD_MAX_LENGTH.diagnosis}
                      onBlur={() => handleBlur("diagnosis")}
                      onChange={(event) =>
                        setFieldValue("diagnosis", event.target.value)
                      }
                      value={values.diagnosis}
                    />
                    <FieldHint id="patient-diagnosis-hint">
                      {getFieldCharacterCount(values.diagnosis)}/
                      {FIELD_MAX_LENGTH.diagnosis}
                    </FieldHint>
                  </Field>
                  <Field
                    error={touched.roomNumber ? errors.roomNumber : undefined}
                    htmlFor="patient-room"
                    label="Room number"
                    required
                  >
                    <input
                      aria-describedby="patient-room-error patient-room-hint"
                      aria-invalid={Boolean(
                        touched.roomNumber && errors.roomNumber,
                      )}
                      className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm text-foreground outline-none"
                      id="patient-room"
                      maxLength={FIELD_MAX_LENGTH.roomNumber}
                      onBlur={() => handleBlur("roomNumber")}
                      onChange={(event) =>
                        setFieldValue("roomNumber", event.target.value)
                      }
                      value={values.roomNumber}
                    />
                    <FieldHint id="patient-room-hint">
                      Letters, numbers, and hyphens only.
                    </FieldHint>
                  </Field>
                  <Field
                    error={touched.doctor ? errors.doctor : undefined}
                    htmlFor="patient-doctor"
                    label="Doctor"
                    required
                  >
                    <input
                      aria-describedby="patient-doctor-error patient-doctor-hint"
                      aria-invalid={Boolean(touched.doctor && errors.doctor)}
                      className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm text-foreground outline-none"
                      id="patient-doctor"
                      maxLength={FIELD_MAX_LENGTH.doctor}
                      onBlur={() => handleBlur("doctor")}
                      onChange={(event) =>
                        setFieldValue("doctor", event.target.value)
                      }
                      value={values.doctor}
                    />
                    <FieldHint id="patient-doctor-hint">
                      {getFieldCharacterCount(values.doctor)}/
                      {FIELD_MAX_LENGTH.doctor}
                    </FieldHint>
                  </Field>
                  <Field
                    error={touched.status ? errors.status : undefined}
                    htmlFor="patient-status"
                    label="Status"
                    required
                  >
                    <Select
                      aria-describedby="patient-status-error"
                      aria-invalid={Boolean(touched.status && errors.status)}
                      id="patient-status"
                      onBlur={() => handleBlur("status")}
                      onChange={(event) =>
                        setFieldValue(
                          "status",
                          event.target.value as PatientStatus,
                        )
                      }
                      value={values.status}
                    >
                      <option value="">Select status</option>
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field
                    error={touched.department ? errors.department : undefined}
                    htmlFor="patient-department"
                    label="Department"
                    required
                  >
                    <Select
                      aria-describedby="patient-department-error"
                      aria-invalid={Boolean(
                        touched.department && errors.department,
                      )}
                      id="patient-department"
                      onBlur={() => handleBlur("department")}
                      onChange={(event) =>
                        setFieldValue(
                          "department",
                          event.target.value as Department,
                        )
                      }
                      value={values.department}
                    >
                      <option value="">Select department</option>
                      {departmentOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field
                    error={touched.gender ? errors.gender : undefined}
                    htmlFor="patient-gender"
                    label="Gender"
                    required
                  >
                    <Select
                      aria-describedby="patient-gender-error"
                      aria-invalid={Boolean(touched.gender && errors.gender)}
                      id="patient-gender"
                      onBlur={() => handleBlur("gender")}
                      onChange={(event) =>
                        setFieldValue("gender", event.target.value as Gender)
                      }
                      value={values.gender}
                    >
                      <option value="">Select gender</option>
                      {genderOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field
                    error={touched.bloodType ? errors.bloodType : undefined}
                    htmlFor="patient-blood-type"
                    label="Blood type"
                    required
                  >
                    <Select
                      aria-describedby="patient-blood-type-error"
                      aria-invalid={Boolean(
                        touched.bloodType && errors.bloodType,
                      )}
                      id="patient-blood-type"
                      onBlur={() => handleBlur("bloodType")}
                      onChange={(event) =>
                        setFieldValue(
                          "bloodType",
                          event.target.value as BloodType,
                        )
                      }
                      value={values.bloodType}
                    >
                      <option value="">Select blood type</option>
                      {bloodTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field
                    error={
                      touched.emergencyContactName
                        ? errors.emergencyContactName
                        : undefined
                    }
                    htmlFor="patient-emergency-name"
                    label="Emergency contact Name"
                    required
                  >
                    <input
                      aria-describedby="patient-emergency-name-error patient-emergency-name-hint"
                      aria-invalid={Boolean(
                        touched.emergencyContactName &&
                        errors.emergencyContactName,
                      )}
                      className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm text-foreground outline-none"
                      id="patient-emergency-name"
                      maxLength={FIELD_MAX_LENGTH.emergencyContactName}
                      onBlur={() => handleBlur("emergencyContactName")}
                      onChange={(event) =>
                        setFieldValue(
                          "emergencyContactName",
                          event.target.value,
                        )
                      }
                      value={values.emergencyContactName}
                    />
                    <FieldHint id="patient-emergency-name-hint">
                      {getFieldCharacterCount(values.emergencyContactName)}/
                      {FIELD_MAX_LENGTH.emergencyContactName}
                    </FieldHint>
                  </Field>
                  <Field
                    error={
                      touched.emergencyContactRelationship
                        ? errors.emergencyContactRelationship
                        : undefined
                    }
                    htmlFor="patient-emergency-relationship"
                    label="Relationship"
                    required
                  >
                    <input
                      aria-describedby="patient-emergency-relationship-error patient-emergency-relationship-hint"
                      aria-invalid={Boolean(
                        touched.emergencyContactRelationship &&
                        errors.emergencyContactRelationship,
                      )}
                      className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm text-foreground outline-none"
                      id="patient-emergency-relationship"
                      maxLength={FIELD_MAX_LENGTH.emergencyContactRelationship}
                      onBlur={() => handleBlur("emergencyContactRelationship")}
                      onChange={(event) =>
                        setFieldValue(
                          "emergencyContactRelationship",
                          event.target.value,
                        )
                      }
                      value={values.emergencyContactRelationship}
                    />
                    <FieldHint id="patient-emergency-relationship-hint">
                      {getFieldCharacterCount(
                        values.emergencyContactRelationship,
                      )}
                      /{FIELD_MAX_LENGTH.emergencyContactRelationship}
                    </FieldHint>
                  </Field>
                  <Field
                    error={
                      touched.emergencyContactPhone
                        ? errors.emergencyContactPhone
                        : undefined
                    }
                    htmlFor="patient-emergency-phone"
                    label="Contact phone"
                    required
                  >
                    <input
                      aria-describedby="patient-emergency-phone-error patient-emergency-phone-hint"
                      aria-invalid={Boolean(
                        touched.emergencyContactPhone &&
                        errors.emergencyContactPhone,
                      )}
                      className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm text-foreground outline-none"
                      id="patient-emergency-phone"
                      inputMode="tel"
                      maxLength={FIELD_MAX_LENGTH.emergencyContactPhone}
                      onBlur={() => handleBlur("emergencyContactPhone")}
                      onChange={(event) =>
                        setFieldValue(
                          "emergencyContactPhone",
                          sanitizePhoneInput(event.target.value),
                        )
                      }
                      placeholder="+91 9876543210"
                      value={values.emergencyContactPhone}
                    />
                    <FieldHint id="patient-emergency-phone-hint">
                      Use international format when possible.
                    </FieldHint>
                  </Field>
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-foreground"
                    htmlFor="patient-medication"
                  >
                    Medications
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <input
                      aria-describedby={
                        medicationError ? "patient-medication-error" : undefined
                      }
                      aria-invalid={Boolean(medicationError)}
                      className="h-10 flex-1 rounded-xl border border-border bg-surface-elevated px-3 text-sm text-foreground outline-none py-2"
                      id="patient-medication"
                      maxLength={FIELD_MAX_LENGTH.medication}
                      onChange={(event) =>
                        handleMedicationInputChange(event.target.value)
                      }
                      placeholder="Add medication"
                      value={medicationInput}
                    />
                    <Button
                      className="cursor-pointer"
                      disabled={isSubmitting}
                      onClick={addMedication}
                      type="button"
                      variant="secondary"
                    >
                      Add
                    </Button>
                  </div>
                  {medicationError ? (
                    <p
                      className="text-xs text-danger"
                      id="patient-medication-error"
                    >
                      {medicationError}
                    </p>
                  ) : null}
                  {values.medications.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {values.medications.map((medication) => (
                        <button
                          className="cursor-pointer rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary"
                          key={medication}
                          onClick={() => removeMedication(medication)}
                          type="button"
                        >
                          {medication}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end sm:gap-3">
                  <Button
                    className="w-full cursor-pointer sm:w-auto"
                    disabled={isSubmitting}
                    onClick={() => {
                      resetForm();
                      onClose();
                    }}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="w-full cursor-pointer sm:w-auto"
                    disabled={!isValid || isSubmitting}
                    loading={isSubmitting}
                    type="submit"
                  >
                    Save patient
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function Field({
  children,
  error,
  htmlFor,
  label,
  required = false,
}: {
  children: ReactNode;
  error?: string;
  htmlFor: string;
  label: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5 sm:space-y-2">
      <label
        className="text-xs font-medium text-foreground sm:text-sm"
        htmlFor={htmlFor}
      >
        {label}
        {required ? " *" : ""}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-danger" id={`${htmlFor}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function FieldHint({ children, id }: { children: ReactNode; id: string }) {
  return (
    <p className="text-[11px] text-subtle" id={id}>
      {children}
    </p>
  );
}
