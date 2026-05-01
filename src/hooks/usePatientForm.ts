import { useCallback, useState } from "react";
import type { NewPatientInput } from "../types";
import {
  buildPatientPayload,
  getNormalizedMedication,
  initialPatientFormValues,
  type PatientFormErrors,
  type PatientFormField,
  type PatientFormValues,
  validateMedicationInput,
  validatePatientForm,
} from "../utils/patientFormValidation";

type SubmitPatientHandler = (patient: NewPatientInput) => void | Promise<void>;

const getEmptyTouchedState = () =>
  ({}) as Partial<Record<PatientFormField, boolean>>;

export function usePatientForm(onSubmit: SubmitPatientHandler) {
  const [values, setValues] = useState<PatientFormValues>(
    initialPatientFormValues,
  );
  const [errors, setErrors] = useState<PatientFormErrors>({});
  const [touched, setTouched] = useState(getEmptyTouchedState);
  const [medicationInput, setMedicationInput] = useState("");
  const [medicationError, setMedicationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = Object.keys(validatePatientForm(values)).length === 0;

  const setFieldValue = useCallback(
    <Key extends PatientFormField>(
      field: Key,
      value: PatientFormValues[Key],
    ) => {
      setValues((current) => {
        const nextValues = { ...current, [field]: value };

        const nextErrors = validatePatientForm(nextValues);

        setErrors((prev) => ({
          ...prev,
          [field]: nextErrors[field],
        }));

        return nextValues;
      });
    },
    [errors, touched],
  );

  const handleBlur = useCallback(
    (field: PatientFormField) => {
      const nextErrors = validatePatientForm(values);

      setTouched((current) => ({ ...current, [field]: true }));
      setErrors((current) => ({
        ...current,
        [field]: nextErrors[field],
      }));
    },
    [values],
  );

  const addMedication = useCallback(() => {
    const nextError = validateMedicationInput(medicationInput);

    if (nextError) {
      setMedicationError(nextError);
      return;
    }

    const normalizedMedication = getNormalizedMedication(medicationInput);

    if (values.medications.includes(normalizedMedication)) {
      setMedicationError("This medication has already been added.");
      return;
    }

    setValues((current) => ({
      ...current,
      medications: [...current.medications, normalizedMedication],
    }));
    setMedicationInput("");
    setMedicationError(null);
  }, [medicationInput, values.medications]);

  const removeMedication = useCallback((medication: string) => {
    setValues((current) => ({
      ...current,
      medications: current.medications.filter((item) => item !== medication),
    }));
  }, []);

  const handleMedicationInputChange = useCallback(
    (value: string) => {
      setMedicationInput(value);

      if (medicationError) {
        setMedicationError(null);
      }
    },
    [medicationError],
  );

  const resetForm = useCallback(() => {
    setValues(initialPatientFormValues);
    setErrors({});
    setTouched(getEmptyTouchedState());
    setMedicationInput("");
    setMedicationError(null);
    setIsSubmitting(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    const nextErrors = validatePatientForm(values);
    setTouched({
      age: true,
      bloodType: true,
      department: true,
      diagnosis: true,
      doctor: true,
      emergencyContactName: true,
      emergencyContactPhone: true,
      emergencyContactRelationship: true,
      gender: true,
      name: true,
      roomNumber: true,
      status: true,
    });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || isSubmitting) {
      return false;
    }

    setIsSubmitting(true);

    try {
      await Promise.resolve(onSubmit(buildPatientPayload(values)));
      resetForm();
      return true;
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, onSubmit, resetForm, values]);

  return {
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
  };
}
