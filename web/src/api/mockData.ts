// LiverAsist - Mock Data
// ============================================================
// IMPORTANT: All data below is FICTIONAL and for demo/prototype
// purposes only. No real patient information is used.
// ============================================================

import type { Patient, PatientSummary } from '../types/patient';
import type { Assessment, AssessmentHistoryEntry } from '../types/assessment';
import type { User } from '../types/api';
import { calculateFIB4 } from '../utils/fibrosis';

// Demo user (clinician)
export const DEMO_USER: User = {
  id: 'user-001',
  email: 'doctor@example.test',
  display_name: 'Dr. Demo',
  role: 'clinician',
  created_at: '2026-01-01T00:00:00Z',
};

export const DEMO_PASSWORD = 'demo-password';

// ─── Patients ───────────────────────────────────────────────

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'patient-001',
    patient_code: 'P-1001',
    display_name: 'Demo Patient A',
    age: 52,
    sex: 'unspecified',
    notes: 'Fictional demo record. Not a real patient.',
    created_at: '2025-06-01T09:00:00Z',
    updated_at: '2026-09-27T10:00:00Z',
  },
  {
    id: 'patient-002',
    patient_code: 'P-1002',
    display_name: 'Demo Patient B',
    age: 47,
    sex: 'unspecified',
    notes: 'Fictional demo record. Not a real patient.',
    created_at: '2026-01-15T09:00:00Z',
    updated_at: '2026-09-20T10:00:00Z',
  },
  {
    id: 'patient-003',
    patient_code: 'P-1003',
    display_name: 'Demo Patient C',
    age: 61,
    sex: 'unspecified',
    notes: 'Fictional demo record. Not a real patient.',
    created_at: '2026-03-10T09:00:00Z',
    updated_at: '2026-09-15T10:00:00Z',
  },
];

// ─── Assessments ────────────────────────────────────────────

// Helper: calculate FIB-4 for seeding
function fib4(age: number, ast: number, alt: number, platelets: number) {
  const r = calculateFIB4({ age, ast, alt, platelets });
  return r.value;
}

export const MOCK_ASSESSMENTS: Record<string, Assessment[]> = {
  'patient-001': [
    {
      id: 'assessment-001-c',
      patient_id: 'patient-001',
      assessment_date: '2026-09-27',
      age_at_assessment: 52,
      ast: 78, ast_unit: 'U/L',
      alt: 65, alt_unit: 'U/L',
      platelets: 138, platelets_unit: '10^9/L',
      fib4: fib4(52, 78, 65, 138),
      fibroscan_kpa: 11.4,
      cap_dbm: 280,
      notes: 'Fictional demo assessment. Assessment values are not clinical examples.',
      verification_status: 'verified',
      data_quality_flags: [],
      created_at: '2026-09-27T10:30:00Z',
      updated_at: '2026-09-27T10:30:00Z',
      calculation_metadata: {
        formula_id: 'FIB4',
        formula_version: '1.0',
        reference_id: 'Sterling2006',
        inputs: { age: 52, ast: 78, ast_unit: 'U/L', alt: 65, alt_unit: 'U/L', platelets: 138, platelets_unit: '10^9/L' },
        result: fib4(52, 78, 65, 138),
        calculated_at: '2026-09-27T10:30:00Z',
      },
    },
    {
      id: 'assessment-001-b',
      patient_id: 'patient-001',
      assessment_date: '2026-01-12',
      age_at_assessment: 51,
      ast: 52, ast_unit: 'U/L',
      alt: 48, alt_unit: 'U/L',
      platelets: 151, platelets_unit: '10^9/L',
      fib4: fib4(51, 52, 48, 151),
      fibroscan_kpa: 8.7,
      notes: 'Fictional demo assessment.',
      verification_status: 'verified',
      data_quality_flags: [],
      created_at: '2026-01-12T11:00:00Z',
      updated_at: '2026-01-12T11:00:00Z',
      calculation_metadata: {
        formula_id: 'FIB4',
        formula_version: '1.0',
        reference_id: 'Sterling2006',
        inputs: { age: 51, ast: 52, ast_unit: 'U/L', alt: 48, alt_unit: 'U/L', platelets: 151, platelets_unit: '10^9/L' },
        result: fib4(51, 52, 48, 151),
        calculated_at: '2026-01-12T11:00:00Z',
      },
    },
    {
      id: 'assessment-001-a',
      patient_id: 'patient-001',
      assessment_date: '2025-06-10',
      age_at_assessment: 51,
      ast: 45, ast_unit: 'U/L',
      alt: 43, alt_unit: 'U/L',
      platelets: 160, platelets_unit: '10^9/L',
      fib4: fib4(51, 45, 43, 160),
      fibroscan_kpa: 7.9,
      notes: 'Fictional demo assessment.',
      verification_status: 'verified',
      data_quality_flags: [],
      created_at: '2025-06-10T09:30:00Z',
      updated_at: '2025-06-10T09:30:00Z',
      calculation_metadata: {
        formula_id: 'FIB4',
        formula_version: '1.0',
        reference_id: 'Sterling2006',
        inputs: { age: 51, ast: 45, ast_unit: 'U/L', alt: 43, alt_unit: 'U/L', platelets: 160, platelets_unit: '10^9/L' },
        result: fib4(51, 45, 43, 160),
        calculated_at: '2025-06-10T09:30:00Z',
      },
    },
  ],
  'patient-002': [
    {
      id: 'assessment-002-a',
      patient_id: 'patient-002',
      assessment_date: '2026-09-20',
      age_at_assessment: 47,
      ast: 42, ast_unit: 'U/L',
      alt: 51, alt_unit: 'U/L',
      platelets: 176, platelets_unit: '10^9/L',
      fib4: fib4(47, 42, 51, 176),
      fibroscan_kpa: 6.8,
      cap_dbm: 245,
      notes: 'Fictional demo assessment.',
      verification_status: 'verified',
      data_quality_flags: [],
      created_at: '2026-09-20T14:00:00Z',
      updated_at: '2026-09-20T14:00:00Z',
      calculation_metadata: {
        formula_id: 'FIB4',
        formula_version: '1.0',
        reference_id: 'Sterling2006',
        inputs: { age: 47, ast: 42, ast_unit: 'U/L', alt: 51, alt_unit: 'U/L', platelets: 176, platelets_unit: '10^9/L' },
        result: fib4(47, 42, 51, 176),
        calculated_at: '2026-09-20T14:00:00Z',
      },
    },
  ],
  'patient-003': [
    {
      id: 'assessment-003-a',
      patient_id: 'patient-003',
      assessment_date: '2026-09-15',
      age_at_assessment: 61,
      ast: 94, ast_unit: 'U/L',
      alt: 71, alt_unit: 'U/L',
      platelets: 112, platelets_unit: '10^9/L',
      fib4: fib4(61, 94, 71, 112),
      fibroscan_kpa: 15.2,
      cap_dbm: 310,
      notes: 'Fictional demo assessment.',
      verification_status: 'verified',
      data_quality_flags: [
        {
          id: 'flag-003-1',
          assessment_id: 'assessment-003-a',
          flag_type: 'discordance',
          message: 'The available non-invasive assessments may not be fully concordant. Clinical correlation is recommended.',
        },
      ],
      created_at: '2026-09-15T10:00:00Z',
      updated_at: '2026-09-15T10:00:00Z',
      calculation_metadata: {
        formula_id: 'FIB4',
        formula_version: '1.0',
        reference_id: 'Sterling2006',
        inputs: { age: 61, ast: 94, ast_unit: 'U/L', alt: 71, alt_unit: 'U/L', platelets: 112, platelets_unit: '10^9/L' },
        result: fib4(61, 94, 71, 112),
        calculated_at: '2026-09-15T10:00:00Z',
      },
    },
  ],
};

// ─── Derived views ───────────────────────────────────────────

export function getMockPatientSummaries(): PatientSummary[] {
  return MOCK_PATIENTS.map(patient => {
    const assessments = MOCK_ASSESSMENTS[patient.id] ?? [];
    const latest = assessments[0];
    return {
      ...patient,
      latest_assessment_date: latest?.assessment_date,
      latest_fib4: latest?.fib4,
      latest_fibroscan_kpa: latest?.fibroscan_kpa,
      assessment_count: assessments.length,
      has_quality_flags: assessments.some(a => a.data_quality_flags.length > 0),
    };
  });
}

export function getMockAssessmentHistory(patientId: string): AssessmentHistoryEntry[] {
  const assessments = MOCK_ASSESSMENTS[patientId] ?? [];
  return assessments.map(a => ({
    id: a.id,
    assessment_date: a.assessment_date,
    ast: a.ast,
    alt: a.alt,
    platelets: a.platelets,
    fib4: a.fib4,
    fibroscan_kpa: a.fibroscan_kpa,
    cap_dbm: a.cap_dbm,
    has_flags: a.data_quality_flags.length > 0,
  }));
}

// ─── Mock API service (simulates network delay) ─────────────

export const mockApi = {
  async getPatients(): Promise<PatientSummary[]> {
    await delay(400);
    return getMockPatientSummaries();
  },

  async getPatient(id: string): Promise<Patient | null> {
    await delay(300);
    return MOCK_PATIENTS.find(p => p.id === id) ?? null;
  },

  async getAssessments(patientId: string): Promise<Assessment[]> {
    await delay(350);
    return MOCK_ASSESSMENTS[patientId] ?? [];
  },

  async getAssessment(id: string): Promise<Assessment | null> {
    await delay(250);
    for (const assessments of Object.values(MOCK_ASSESSMENTS)) {
      const found = assessments.find(a => a.id === id);
      if (found) return found;
    }
    return null;
  },

  async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    await delay(600);
    if (email === DEMO_USER.email && password === DEMO_PASSWORD) {
      return { user: DEMO_USER, token: 'prototype-demo-token' };
    }
    return null;
  },
};

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
