// LiverAsist - Patient Type Definitions
// Fictional/demo patient records only — no real patient data

export type Sex = 'male' | 'female' | 'other' | 'unspecified';

export interface Patient {
  id: string;
  patient_code: string;
  display_name: string;
  age: number;
  sex: Sex;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePatientInput {
  patient_code: string;
  display_name: string;
  age: number;
  sex: Sex;
  notes?: string;
}

export interface UpdatePatientInput {
  display_name?: string;
  age?: number;
  sex?: Sex;
  notes?: string;
}

export interface PatientSummary extends Patient {
  latest_assessment_date?: string;
  latest_fib4?: number;
  latest_fibroscan_kpa?: number;
  assessment_count: number;
  has_quality_flags: boolean;
}
