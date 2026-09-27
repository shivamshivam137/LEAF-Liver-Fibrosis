// LiverAsist - Assessment Type Definitions
// Clinical decision-support prototype — not a diagnostic system

export type VerificationStatus = 'verified' | 'pending' | 'flagged';
export type FlagType = 'missing_data' | 'invalid_value' | 'implausible_value' | 'unit_issue' | 'discordance' | 'date_inconsistency';

export interface DataQualityFlag {
  id: string;
  assessment_id: string;
  flag_type: FlagType;
  field?: string;
  message: string;
}

export interface FibroScanRecord {
  id: string;
  assessment_id: string;
  measurement_date: string;
  kpa: number;
  cap_dbm?: number;
  valid_measurements?: number;
  iqr_median?: number;
  notes?: string;
}

export interface CalculationMetadata {
  formula_id: string;        // e.g. "FIB4"
  formula_version: string;   // e.g. "1.0"
  reference_id: string;      // e.g. "Sterling2006"
  inputs: {
    age: number;
    ast: number;
    ast_unit: string;
    alt: number;
    alt_unit: string;
    platelets: number;
    platelets_unit: string;
  };
  result: number;
  calculated_at: string;
}

export interface Assessment {
  id: string;
  patient_id: string;
  assessment_date: string;
  age_at_assessment: number;

  // Lab values
  ast: number;
  ast_unit: 'U/L';
  alt: number;
  alt_unit: 'U/L';
  platelets: number;
  platelets_unit: '10^9/L';

  // Derived
  fib4?: number;
  calculation_metadata?: CalculationMetadata;

  // FibroScan (optional)
  fibroscan_kpa?: number;
  cap_dbm?: number;

  notes?: string;
  verification_status: VerificationStatus;
  data_quality_flags: DataQualityFlag[];

  created_at: string;
  updated_at: string;
}

export interface CreateAssessmentInput {
  assessment_date: string;
  age_at_assessment: number;
  ast: number;
  ast_unit: 'U/L';
  alt: number;
  alt_unit: 'U/L';
  platelets: number;
  platelets_unit: '10^9/L';
  fibroscan_kpa?: number;
  cap_dbm?: number;
  notes?: string;
}

export interface AssessmentHistoryEntry {
  id: string;
  assessment_date: string;
  ast: number;
  alt: number;
  platelets: number;
  fib4?: number;
  fibroscan_kpa?: number;
  cap_dbm?: number;
  has_flags: boolean;
}
