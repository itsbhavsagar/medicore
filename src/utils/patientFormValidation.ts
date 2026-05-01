import type { NewPatientInput } from '../types'

export const FIELD_MAX_LENGTH = {
  diagnosis: 140,
  doctor: 80,
  emergencyContactName: 80,
  emergencyContactPhone: 18,
  emergencyContactRelationship: 40,
  medication: 60,
  name: 80,
  roomNumber: 24,
} as const

const POSITIVE_INTEGER_PATTERN = /^\d+$/
const ROOM_NUMBER_PATTERN = /^[A-Za-z0-9-]{1,24}$/
const PHONE_PATTERN = /^\+?[1-9]\d{7,14}$/
const TEXT_PATTERN = /[A-Za-z]/

export interface PatientFormValues
  extends Omit<
    NewPatientInput,
    'age' | 'medications' | 'gender' | 'bloodType' | 'status' | 'department'
  > {
  age: string
  bloodType: NewPatientInput['bloodType'] | ''
  department: NewPatientInput['department'] | ''
  gender: NewPatientInput['gender'] | ''
  medications: string[]
  status: NewPatientInput['status'] | ''
}

export type PatientFormField = keyof PatientFormValues

export type PatientFormErrors = Partial<Record<PatientFormField, string>>

export const initialPatientFormValues: PatientFormValues = {
  name: '',
  age: '',
  gender: '',
  bloodType: '',
  diagnosis: '',
  status: '',
  roomNumber: '',
  doctor: '',
  department: '',
  medications: [],
  emergencyContactName: '',
  emergencyContactRelationship: '',
  emergencyContactPhone: '',
}

const normalizeWhitespace = (value: string) => value.trim().replace(/\s+/g, ' ')

const getTrimmedLength = (value: string) => normalizeWhitespace(value).length

const validateRequiredText = (
  value: string,
  fieldLabel: string,
  maxLength: number,
) => {
  const normalizedValue = normalizeWhitespace(value)

  if (!normalizedValue) {
    return `${fieldLabel} is required.`
  }

  if (!TEXT_PATTERN.test(normalizedValue)) {
    return `Enter a valid ${fieldLabel.toLowerCase()}.`
  }

  if (normalizedValue.length > maxLength) {
    return `${fieldLabel} must be ${maxLength} characters or fewer.`
  }

  return undefined
}

const validateRequiredSelection = (value: string, fieldLabel: string) => {
  if (!value) {
    return `Select a ${fieldLabel.toLowerCase()}.`
  }

  return undefined
}

export const validatePatientField = (
  field: PatientFormField,
  values: PatientFormValues,
) => {
  switch (field) {
    case 'name':
      return validateRequiredText(values.name, 'Full name', FIELD_MAX_LENGTH.name)
    case 'age': {
      const normalizedAge = values.age.trim()

      if (!normalizedAge) {
        return 'Age is required.'
      }

      if (!POSITIVE_INTEGER_PATTERN.test(normalizedAge)) {
        return 'Age must be a whole number.'
      }

      const parsedAge = Number.parseInt(normalizedAge, 10)

      if (parsedAge < 1 || parsedAge > 120) {
        return 'Age must be between 1 and 120.'
      }

      return undefined
    }
    case 'diagnosis': {
      const normalizedDiagnosis = normalizeWhitespace(values.diagnosis)

      if (!normalizedDiagnosis) {
        return 'Diagnosis is required.'
      }

      if (normalizedDiagnosis.length > FIELD_MAX_LENGTH.diagnosis) {
        return `Diagnosis must be ${FIELD_MAX_LENGTH.diagnosis} characters or fewer.`
      }

      return undefined
    }
    case 'roomNumber': {
      const normalizedRoom = normalizeWhitespace(values.roomNumber)

      if (!normalizedRoom) {
        return 'Room number is required.'
      }

      if (!ROOM_NUMBER_PATTERN.test(normalizedRoom)) {
        return 'Use letters, numbers, or hyphens only.'
      }

      return undefined
    }
    case 'doctor':
      return validateRequiredText(values.doctor, 'Doctor', FIELD_MAX_LENGTH.doctor)
    case 'status':
      return validateRequiredSelection(values.status, 'status')
    case 'department':
      return validateRequiredSelection(values.department, 'department')
    case 'gender':
      return validateRequiredSelection(values.gender, 'gender')
    case 'bloodType':
      return validateRequiredSelection(values.bloodType, 'blood type')
    case 'emergencyContactName':
      return validateRequiredText(
        values.emergencyContactName,
        'Emergency contact',
        FIELD_MAX_LENGTH.emergencyContactName,
      )
    case 'emergencyContactRelationship':
      return validateRequiredText(
        values.emergencyContactRelationship,
        'Relationship',
        FIELD_MAX_LENGTH.emergencyContactRelationship,
      )
    case 'emergencyContactPhone': {
      const normalizedPhone = values.emergencyContactPhone.replace(/[\s()-]/g, '')

      if (!normalizedPhone) {
        return 'Contact phone is required.'
      }

      if (normalizedPhone.length > FIELD_MAX_LENGTH.emergencyContactPhone) {
        return `Contact phone must be ${FIELD_MAX_LENGTH.emergencyContactPhone} characters or fewer.`
      }

      if (!PHONE_PATTERN.test(normalizedPhone)) {
        return 'Enter a valid phone number.'
      }

      return undefined
    }
    default:
      return undefined
  }
}

export const validatePatientForm = (
  values: PatientFormValues,
): PatientFormErrors => {
  const nextErrors: PatientFormErrors = {}

  ;(
    [
      'name',
      'age',
      'diagnosis',
      'roomNumber',
      'doctor',
      'status',
      'department',
      'gender',
      'bloodType',
      'emergencyContactName',
      'emergencyContactRelationship',
      'emergencyContactPhone',
    ] as const
  ).forEach((field) => {
    const error = validatePatientField(field, values)

    if (error) {
      nextErrors[field] = error
    }
  })

  return nextErrors
}

export const buildPatientPayload = (
  values: PatientFormValues,
): NewPatientInput => ({
  ...values,
  age: Number.parseInt(values.age.trim(), 10),
  bloodType: values.bloodType as NewPatientInput['bloodType'],
  department: values.department as NewPatientInput['department'],
  diagnosis: normalizeWhitespace(values.diagnosis),
  doctor: normalizeWhitespace(values.doctor),
  emergencyContactName: normalizeWhitespace(values.emergencyContactName),
  emergencyContactPhone: values.emergencyContactPhone.replace(/[\s()-]/g, ''),
  emergencyContactRelationship: normalizeWhitespace(
    values.emergencyContactRelationship,
  ),
  gender: values.gender as NewPatientInput['gender'],
  medications:
    values.medications.length > 0
      ? values.medications
      : ['Observation pending'],
  name: normalizeWhitespace(values.name),
  roomNumber: normalizeWhitespace(values.roomNumber).toUpperCase(),
  status: values.status as NewPatientInput['status'],
})

export const validateMedicationInput = (value: string) => {
  const normalizedValue = normalizeWhitespace(value)

  if (!normalizedValue) {
    return 'Enter a medication name.'
  }

  if (normalizedValue.length > FIELD_MAX_LENGTH.medication) {
    return `Medication must be ${FIELD_MAX_LENGTH.medication} characters or fewer.`
  }

  return undefined
}

export const getNormalizedMedication = (value: string) =>
  normalizeWhitespace(value)

export const getFieldCharacterCount = (value: string) => getTrimmedLength(value)

export const sanitizeAgeInput = (value: string) => value.replace(/[^\d]/g, '')

export const sanitizePhoneInput = (value: string) => {
  const hasLeadingPlus = value.startsWith('+')
  const digitsOnly = value.replace(/\D/g, '')

  return hasLeadingPlus ? `+${digitsOnly}` : digitsOnly
}
