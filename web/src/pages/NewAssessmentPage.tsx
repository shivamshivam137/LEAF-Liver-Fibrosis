// LEAF - New Assessment Page
// Patient selector dropdown, Calculate-first flow, two-column grid

import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RotateCcw, Calculator, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { mockApi, MOCK_ASSESSMENTS } from '../api/mockData';
import { Alert } from '../components/common/index';
import { validateAndCalculateFIB4, FIB4_REFERENCE_CITATION } from '../utils/fibrosis';
import { formatFIB4, getFIB4Label } from '../utils/formatters';
import type { FIB4Result } from '../utils/fibrosis';

const schema = z.object({
  patient_id: z.string().min(1, 'Please select a patient.'),
  assessment_date: z.string().min(1, 'Date is required.'),
  age: z.coerce.number().int().min(1).max(120),
  ast: z.coerce.number().positive().max(5000),
  alt: z.coerce.number().positive().max(5000),
  platelets: z.coerce.number().positive().max(1500),
  fibroscan_kpa: z.coerce.number().positive().max(100).optional().or(z.literal('')),
  cap: z.coerce.number().positive().max(400).optional().or(z.literal('')),
});
type FormData = z.infer<typeof schema>;

function LabInput({ id, label, unit, required, register, error, placeholder }: any) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="flex items-stretch gap-0">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step="any"
          placeholder={placeholder ?? '0'}
          {...register}
          className={`flex-1 px-3 py-2.5 rounded-l-xl border-y border-l text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:z-10 ${error ? 'border-red-400' : 'border-slate-300'}`}
        />
        <span className="px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-r-xl text-xs text-slate-500 font-mono flex items-center whitespace-nowrap">
          {unit}
        </span>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function NewAssessmentPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [result, setResult] = useState<FIB4Result | null>(null);
  const [calcErrors, setCalcErrors] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [searchParams] = useSearchParams();

  const today = new Date().toISOString().split('T')[0];
  const { data: patients } = useQuery({ queryKey: ['patients'], queryFn: () => mockApi.getPatients() });

  const { register, handleSubmit, getValues, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      patient_id: searchParams.get('patientId') ?? '',
      assessment_date: today,
    },
  });

  const handleCalculate = () => {
    const v = getValues();
    const res = validateAndCalculateFIB4({ age: Number(v.age), ast: Number(v.ast), alt: Number(v.alt), platelets: Number(v.platelets) });
    if (res.success) { setResult(res.result); setCalcErrors([]); }
    else { setCalcErrors(res.errors.map(e => e.message)); setResult(null); }
  };

  const onSubmit = async (data: FormData) => {
    const calcRes = validateAndCalculateFIB4({ age: data.age, ast: data.ast, alt: data.alt, platelets: data.platelets });
    const fib4 = calcRes.success ? calcRes.result.value : undefined;
    const newAssessment = {
      id: `assessment-${Date.now()}`,
      patient_id: data.patient_id,
      assessment_date: data.assessment_date,
      age_at_assessment: data.age,
      ast: data.ast, ast_unit: 'U/L' as const,
      alt: data.alt, alt_unit: 'U/L' as const,
      platelets: data.platelets, platelets_unit: '10^9/L' as const,
      fib4,
      fibroscan_kpa: data.fibroscan_kpa ? Number(data.fibroscan_kpa) : undefined,
      cap_dbm: data.cap ? Number(data.cap) : undefined,
      verification_status: 'verified' as const,
      data_quality_flags: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      calculation_metadata: calcRes.success ? {
        formula_id: calcRes.result.formula_id, formula_version: calcRes.result.formula_version,
        reference_id: calcRes.result.reference_id,
        inputs: { age: data.age, ast: data.ast, ast_unit: 'U/L', alt: data.alt, alt_unit: 'U/L', platelets: data.platelets, platelets_unit: '10^9/L' },
        result: calcRes.result.value, calculated_at: calcRes.result.calculated_at,
      } : undefined,
    };
    if (!MOCK_ASSESSMENTS[data.patient_id]) MOCK_ASSESSMENTS[data.patient_id] = [];
    MOCK_ASSESSMENTS[data.patient_id].unshift(newAssessment);
    queryClient.invalidateQueries({ queryKey: ['assessments', data.patient_id] });
    queryClient.invalidateQueries({ queryKey: ['patients'] });
    setSaved(true);
    await new Promise(r => setTimeout(r, 800));
    navigate(`/patients/${data.patient_id}/assessments/${newAssessment.id}`);
  };

  const fib4Label = result ? getFIB4Label(result.value) : null;

  return (
    <div className="max-w-3xl mx-auto space-y-5 fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">New Assessment</h2>
        <p className="text-sm text-slate-500 mt-0.5">Enter patient details and laboratory values to calculate fibrosis scores.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Patient Information */}
        <div className="card p-6 space-y-4">
          <h3 className="text-base font-semibold text-slate-800 border-b border-slate-100 pb-3">Patient Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="patient_id" className="block text-sm font-medium text-slate-700 mb-1">
                Select Patient <span className="text-red-500">*</span>
              </label>
              <select
                id="patient_id"
                {...register('patient_id')}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white ${errors.patient_id ? 'border-red-400' : 'border-slate-300'}`}
              >
                <option value="">Select a patient...</option>
                {patients?.map(p => (
                  <option key={p.id} value={p.id}>{p.patient_code} – {p.display_name}</option>
                ))}
              </select>
              {errors.patient_id && <p className="mt-1 text-xs text-red-600">{errors.patient_id.message}</p>}
            </div>
            <div>
              <label htmlFor="assessment_date" className="block text-sm font-medium text-slate-700 mb-1">
                Assessment Date <span className="text-red-500">*</span>
              </label>
              <input
                id="assessment_date"
                type="date"
                {...register('assessment_date')}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.assessment_date ? 'border-red-400' : 'border-slate-300'}`}
              />
            </div>
          </div>
        </div>

        {/* Laboratory Values */}
        <div className="card p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-semibold text-slate-800">Laboratory Values</h3>
            <p className="text-xs text-slate-400 mt-0.5">All fields required for FIB-4 calculation</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <LabInput id="age" label="Age" unit="years" required register={register('age')} error={errors.age?.message} placeholder="52" />
            <LabInput id="ast" label="AST" unit="U/L" required register={register('ast')} error={errors.ast?.message} placeholder="78" />
            <LabInput id="alt" label="ALT" unit="U/L" required register={register('alt')} error={errors.alt?.message} placeholder="65" />
            <LabInput id="platelets" label="Platelet Count" unit="×10⁹/L" required register={register('platelets')} error={errors.platelets?.message} placeholder="138" />
          </div>

          {/* Calc errors */}
          {calcErrors.map((msg, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
              {msg}
            </div>
          ))}

          {/* FIB-4 result preview */}
          {result && fib4Label && (
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4.5 h-4.5 text-teal-600" aria-hidden="true" />
                <span className="text-sm font-semibold text-teal-800">FIB-4 Calculated</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-slate-800">{formatFIB4(result.value)}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                  ${fib4Label.color === 'success' ? 'bg-green-100 text-green-700' :
                    fib4Label.color === 'warning' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'}
                `}>{fib4Label.label}</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                (Age × AST) / (Platelets × √ALT) · Ref: Sterling et al., Hepatology 2006
              </p>
            </div>
          )}
        </div>

        {/* FibroScan & CAP */}
        <div className="card p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-semibold text-slate-800">FibroScan & CAP</h3>
            <p className="text-xs text-slate-400 mt-0.5">Optional — record if available</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LabInput id="fibroscan_kpa" label="FibroScan Stiffness" unit="kPa" register={register('fibroscan_kpa')} error={errors.fibroscan_kpa?.message} placeholder="11.4" />
            <LabInput id="cap" label="CAP (Optional)" unit="dB/m" register={register('cap')} error={errors.cap?.message} placeholder="248" />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => { reset(); setResult(null); setCalcErrors([]); }}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleCalculate}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-semibold hover:bg-slate-900"
          >
            <Calculator className="w-4 h-4" aria-hidden="true" />
            Calculate Assessment
          </button>
          <button
            type="submit"
            disabled={isSubmitting || saved}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 disabled:opacity-60"
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            {isSubmitting || saved ? 'Saving...' : 'Save Assessment'}
          </button>
        </div>
      </form>

      <Alert variant="info">
        LEAF calculates FIB-4 using the deterministic formula (Sterling et al., 2006). Results are decision-support aids only and do not independently establish a diagnosis.
      </Alert>
    </div>
  );
}
