// LEAF - Assessment Results Page
// Success banner, FIB-4 score display, clinical reference, Save/Download/History buttons

import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Download, History, Save, AlertTriangle, Info } from 'lucide-react';
import { mockApi } from '../api/mockData';
import { CardSkeleton, ErrorState } from '../components/common/index';
import { formatDate, formatDateTime, formatFIB4, getFIB4Label } from '../utils/formatters';
import { FIB4_REFERENCE_CITATION } from '../utils/fibrosis';

export default function AssessmentDetailPage() {
  const { patientId, assessmentId } = useParams<{ patientId: string; assessmentId: string }>();
  const navigate = useNavigate();

  const { data: patient } = useQuery({ queryKey: ['patient', patientId], queryFn: () => mockApi.getPatient(patientId!) });
  const { data: assessment, isLoading, isError } = useQuery({
    queryKey: ['assessment', assessmentId],
    queryFn: () => mockApi.getAssessment(assessmentId!),
    enabled: !!assessmentId,
  });

  if (isLoading) return <div className="space-y-4 max-w-3xl mx-auto"><CardSkeleton /><CardSkeleton /></div>;
  if (isError || !assessment) return <ErrorState title="Assessment not found" message="Could not load this assessment." onRetry={() => navigate(`/patients/${patientId}`)} />;

  const fib4Label = getFIB4Label(assessment.fib4);

  const handlePrint = () => window.print();

  return (
    <div className="max-w-3xl mx-auto space-y-5 fade-in">
      {/* Success banner */}
      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" aria-hidden="true" />
        <p className="text-sm font-semibold text-green-800">Calculation completed successfully!</p>
      </div>

      {/* FIB-4 Score card */}
      {assessment.fib4 != null && (
        <div className="card p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-base font-semibold text-slate-800">FIB-4 Score</h2>
                <button title="About FIB-4" className="text-slate-400 hover:text-slate-600" aria-label="FIB-4 information">
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-500">Interpretation (Clinical Reference)</p>
            </div>
            <span className="text-xs text-slate-400">
              {formatDate(assessment.assessment_date)}
            </span>
          </div>

          {/* Score */}
          <div className="flex items-end gap-4 mb-4">
            <span className="text-6xl font-bold text-slate-800">{formatFIB4(assessment.fib4)}</span>
            <div className="mb-2">
              <span className={`inline-block text-sm px-3 py-1.5 rounded-xl font-semibold
                ${fib4Label.color === 'success' ? 'bg-green-100 text-green-700' :
                  fib4Label.color === 'warning' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'}
              `}>
                {fib4Label.label}
              </span>
            </div>
          </div>

          {/* Interpretation note */}
          <div className="p-3 bg-slate-50 rounded-xl mb-4 text-xs text-slate-600 leading-relaxed">
            FIB-4 between 1.3 – 2.67: Indeterminate range. Suggests intermediate risk of advanced fibrosis. Consider further evaluation and follow-up.
            <p className="text-slate-400 mt-1">Source: AASLD Guidelines (2022)</p>
          </div>

          {/* Clinical Reference note */}
          <p className="text-xs text-slate-400 leading-relaxed">
            These ranges are informational only. Clinical interpretation requires professional judgment and a validated guideline context.
            <br />Reference: {FIB4_REFERENCE_CITATION}
          </p>
        </div>
      )}

      {/* Two-column: Lab Values + FibroScan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Lab Values */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Laboratory Values</h3>
          <div className="space-y-3">
            {[
              { label: 'Age', value: assessment.age_at_assessment, unit: 'years' },
              { label: 'AST', value: assessment.ast, unit: 'U/L' },
              { label: 'ALT', value: assessment.alt, unit: 'U/L' },
              { label: 'Platelets', value: assessment.platelets, unit: '×10⁹/L' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-500">{item.label}</span>
                <span className="text-sm font-semibold text-slate-800">{item.value} <span className="text-xs font-normal text-slate-400">{item.unit}</span></span>
              </div>
            ))}
          </div>
        </div>

        {/* FibroScan & CAP */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">FibroScan & CAP</h3>
          {assessment.fibroscan_kpa != null ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-sm text-slate-500">FibroScan</span>
                <span className="text-sm font-semibold text-slate-800">{assessment.fibroscan_kpa} <span className="text-xs font-normal text-slate-400">kPa</span></span>
              </div>
              {assessment.cap_dbm != null && (
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-sm text-slate-500">CAP</span>
                  <span className="text-sm font-semibold text-slate-800">{assessment.cap_dbm} <span className="text-xs font-normal text-slate-400">dB/m</span></span>
                </div>
              )}
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Liver stiffness must be interpreted in clinical context. It does not automatically correspond to a fibrosis stage.
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">FibroScan not recorded for this assessment.</p>
          )}
        </div>
      </div>

      {/* Data quality flags */}
      {assessment.data_quality_flags.length > 0 && (
        <div className="space-y-2">
          {assessment.data_quality_flags.map(flag => (
            <div key={flag.id} className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-amber-800">{flag.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Calculation traceability */}
      {assessment.calculation_metadata && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Calculation Traceability</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs">
            {[
              ['Formula', '(Age × AST) / (Platelets × √ALT)'],
              ['Version', `${assessment.calculation_metadata.formula_id} v${assessment.calculation_metadata.formula_version}`],
              ['Calculated', formatDateTime(assessment.calculation_metadata.calculated_at)],
              ['Reference', assessment.calculation_metadata.reference_id],
            ].map(([k, v]) => (
              <><span key={k + 'k'} className="text-slate-400">{k}:</span><span key={k + 'v'} className="text-slate-700">{v}</span></>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate(`/patients/${patientId}`)}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700"
        >
          <Save className="w-4 h-4" aria-hidden="true" />
          Save Assessment
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          Download Report
        </button>
        <button
          onClick={() => navigate(`/patients/${patientId}/compare`)}
          className="flex items-center gap-2 px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50"
        >
          <History className="w-4 h-4" aria-hidden="true" />
          View History
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 leading-relaxed text-center pb-4">
        LEAF provides calculation and information-management support. It does not independently establish a medical diagnosis.
      </p>
    </div>
  );
}
