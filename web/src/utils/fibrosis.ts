// LiverAsist - FIB-4 Calculation Engine
// ============================================================
// Formula: FIB-4 = (Age × AST) / (Platelets × √ALT)
//
// Expected units (MUST be normalized before calling calculateFIB4):
//   age       — years (integer)
//   ast       — U/L
//   alt       — U/L
//   platelets — ×10⁹/L
//
// Reference: Sterling RK et al. Hepatology. 2006;43(6):1317-25.
// Formula version: FIB4-v1.0
// ============================================================

export const FIB4_FORMULA_ID = 'FIB4';
export const FIB4_FORMULA_VERSION = '1.0';
export const FIB4_REFERENCE_ID = 'Sterling2006';
export const FIB4_REFERENCE_CITATION =
  'Sterling RK, et al. Development of a simple noninvasive index to predict significant fibrosis in patients with HIV/HCV coinfection. Hepatology. 2006;43(6):1317-1325.';

export interface FIB4Inputs {
  age: number;        // years
  ast: number;        // U/L
  alt: number;        // U/L
  platelets: number;  // ×10⁹/L
}

export interface FIB4Result {
  value: number;
  inputs: FIB4Inputs;
  formula_id: string;
  formula_version: string;
  reference_id: string;
  reference_citation: string;
  calculated_at: string;
}

export interface FIB4ValidationError {
  field: keyof FIB4Inputs;
  message: string;
  code: 'MISSING' | 'INVALID' | 'IMPLAUSIBLE';
}

/**
 * Validate inputs before FIB-4 calculation.
 * Returns an array of validation errors. Empty array = valid.
 */
export function validateFIB4Inputs(inputs: Partial<FIB4Inputs>): FIB4ValidationError[] {
  const errors: FIB4ValidationError[] = [];

  // Age validation
  if (inputs.age === undefined || inputs.age === null) {
    errors.push({ field: 'age', message: 'Age is required for FIB-4 calculation.', code: 'MISSING' });
  } else if (!Number.isFinite(inputs.age) || inputs.age <= 0) {
    errors.push({ field: 'age', message: 'Age must be a positive number.', code: 'INVALID' });
  } else if (inputs.age < 1 || inputs.age > 120) {
    errors.push({ field: 'age', message: 'Age value is outside the expected range (1–120 years).', code: 'IMPLAUSIBLE' });
  }

  // AST validation
  if (inputs.ast === undefined || inputs.ast === null) {
    errors.push({ field: 'ast', message: 'AST is required for FIB-4 calculation.', code: 'MISSING' });
  } else if (!Number.isFinite(inputs.ast) || inputs.ast <= 0) {
    errors.push({ field: 'ast', message: 'AST must be a positive number (U/L).', code: 'INVALID' });
  } else if (inputs.ast > 5000) {
    errors.push({ field: 'ast', message: 'AST value appears implausibly high. Please verify.', code: 'IMPLAUSIBLE' });
  }

  // ALT validation
  if (inputs.alt === undefined || inputs.alt === null) {
    errors.push({ field: 'alt', message: 'ALT is required for FIB-4 calculation.', code: 'MISSING' });
  } else if (!Number.isFinite(inputs.alt) || inputs.alt <= 0) {
    errors.push({ field: 'alt', message: 'ALT must be a positive number (U/L).', code: 'INVALID' });
  } else if (inputs.alt > 5000) {
    errors.push({ field: 'alt', message: 'ALT value appears implausibly high. Please verify.', code: 'IMPLAUSIBLE' });
  }

  // Platelets validation
  if (inputs.platelets === undefined || inputs.platelets === null) {
    errors.push({ field: 'platelets', message: 'Platelet count is required for FIB-4 calculation.', code: 'MISSING' });
  } else if (!Number.isFinite(inputs.platelets) || inputs.platelets <= 0) {
    errors.push({ field: 'platelets', message: 'Platelet count must be a positive number (×10⁹/L).', code: 'INVALID' });
  } else if (inputs.platelets > 1500) {
    errors.push({ field: 'platelets', message: 'Platelet count appears implausibly high. Please verify.', code: 'IMPLAUSIBLE' });
  }

  return errors;
}

/**
 * Calculate FIB-4 score.
 *
 * Formula: FIB-4 = (Age × AST) / (Platelets × √ALT)
 *
 * All inputs MUST be in their canonical units (see file header).
 * Validate inputs with validateFIB4Inputs() before calling this function.
 *
 * @throws Error if any input would cause a mathematical error (division by zero, etc.)
 */
export function calculateFIB4(inputs: FIB4Inputs): FIB4Result {
  const { age, ast, alt, platelets } = inputs;

  // Guard: these should already be caught by validation, but defend mathematically
  if (platelets <= 0) throw new Error('Platelet count must be positive (cannot divide by zero).');
  if (alt <= 0) throw new Error('ALT must be positive (cannot take square root of zero or negative).');

  const sqrtAlt = Math.sqrt(alt);
  const denominator = platelets * sqrtAlt;
  const numerator = age * ast;
  const value = numerator / denominator;

  // Round to 3 decimal places for display precision
  const roundedValue = Math.round(value * 1000) / 1000;

  return {
    value: roundedValue,
    inputs: { ...inputs },
    formula_id: FIB4_FORMULA_ID,
    formula_version: FIB4_FORMULA_VERSION,
    reference_id: FIB4_REFERENCE_ID,
    reference_citation: FIB4_REFERENCE_CITATION,
    calculated_at: new Date().toISOString(),
  };
}

/**
 * Convenience function: validate then calculate.
 * Returns either a result or a list of validation errors.
 */
export function validateAndCalculateFIB4(
  inputs: Partial<FIB4Inputs>
): { success: true; result: FIB4Result } | { success: false; errors: FIB4ValidationError[] } {
  const errors = validateFIB4Inputs(inputs);
  if (errors.length > 0) {
    return { success: false, errors };
  }
  const result = calculateFIB4(inputs as FIB4Inputs);
  return { success: true, result };
}
