// LEAF - Printable Assessment Report Template
// Used by ReportsPage for browser print-to-PDF

import { LeafIcon } from '../common/LeafLogo';
import { formatDate, formatDateTime, formatFIB4, getFIB4Label } from '../../utils/formatters';
import { FIB4_REFERENCE_CITATION } from '../../utils/fibrosis';
import type { Assessment } from '../../types/assessment';
import type { Patient } from '../../types/patient';

interface PrintReportProps {
  patient: Patient;
  assessment: Assessment;
}

export function PrintReport({ patient, assessment }: PrintReportProps) {
  const fib4Label = getFIB4Label(assessment.fib4);

  const getInterpretation = (fib4?: number): string => {
    if (fib4 == null) return 'FIB-4 score was not calculated for this assessment.';
    if (fib4 < 1.3) return `FIB-4: ${formatFIB4(fib4)} (Lower range, below 1.30). Suggests lower likelihood of advanced fibrosis in the studied population. Ongoing monitoring per clinical protocol is advised.`;
    if (fib4 <= 2.67) return `FIB-4: ${formatFIB4(fib4)} (Indeterminate range, 1.30–2.67). Suggests intermediate risk of advanced fibrosis. Consider further evaluation and follow-up as per clinical protocol.`;
    return `FIB-4: ${formatFIB4(fib4)} (Higher range, above 2.67). Suggests higher likelihood of advanced fibrosis in the studied population. Further clinical evaluation is advised.`;
  };

  return (
    <div className="print-only bg-white p-10 text-slate-800 font-sans max-w-3xl mx-auto" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
      {/* Report Header */}
      <div className="flex items-start justify-between border-b-2 border-teal-600 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <LeafIcon size={44} />
          <div>
            <p className="text-xl font-bold text-slate-900 leading-tight">LEAF</p>
            <p className="text-xs text-teal-700">Liver Evaluation and Assessment for Fibrosis</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-base font-bold text-slate-800">Liver Fibrosis Assessment Report</p>
          <p className="text-xs text-slate-400 mt-1">Generated: {formatDateTime(new Date().toISOString())}</p>
        </div>
      </div>

      {/* Patient Info */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Patient Information</p>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-slate-500">Patient ID:</span>
            <span className="font-semibold ml-2">{patient.patient_code}</span>
          </div>
          <div>
            <span className="text-slate-500">Name:</span>
            <span className="font-semibold ml-2">{patient.display_name}</span>
          </div>
          <div>
            <span className="text-slate-500">Age:</span>
            <span className="font-semibold ml-2">{patient.age} years</span>
          </div>
          <div>
            <span className="text-slate-500">Gender:</span>
            <span className="font-semibold ml-2 capitalize">{patient.sex}</span>
          </div>
          <div>
            <span className="text-slate-500">Assessment Date:</span>
            <span className="font-semibold ml-2">{formatDate(assessment.assessment_date)}</span>
          </div>
        </div>
      </div>

      {/* Lab Values Table */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Laboratory Values</p>
        <table className="w-full border border-slate-200 rounded-lg overflow-hidden text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="py-2 px-4 text-left font-semibold text-slate-600">Parameter</th>
              <th className="py-2 px-4 text-left font-semibold text-slate-600">Value</th>
              <th className="py-2 px-4 text-left font-semibold text-slate-600">Unit</th>
              <th className="py-2 px-4 text-left font-semibold text-slate-600">Calculated Score</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="py-2 px-4 text-slate-700">AST</td>
              <td className="py-2 px-4 font-semibold">{assessment.ast}</td>
              <td className="py-2 px-4 text-slate-500">U/L</td>
              <td className="py-2 px-4 text-teal-700 font-bold" rowSpan={4}>
                FIB-4: {assessment.fib4 != null ? formatFIB4(assessment.fib4) : '—'}
              </td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 px-4 text-slate-700">ALT</td>
              <td className="py-2 px-4 font-semibold">{assessment.alt}</td>
              <td className="py-2 px-4 text-slate-500">U/L</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 px-4 text-slate-700">Platelet Count</td>
              <td className="py-2 px-4 font-semibold">{assessment.platelets}</td>
              <td className="py-2 px-4 text-slate-500">×10⁹/L</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-2 px-4 text-slate-700">Age at Assessment</td>
              <td className="py-2 px-4 font-semibold">{assessment.age_at_assessment}</td>
              <td className="py-2 px-4 text-slate-500">years</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Elastography */}
      {(assessment.fibroscan_kpa != null || assessment.cap_dbm != null) && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Elastography</p>
          <div className="flex gap-6 text-sm">
            {assessment.fibroscan_kpa != null && (
              <div>
                <span className="text-slate-500">FibroScan:</span>
                <span className="font-bold ml-2">{assessment.fibroscan_kpa} kPa</span>
              </div>
            )}
            {assessment.cap_dbm != null && (
              <div>
                <span className="text-slate-500">CAP:</span>
                <span className="font-bold ml-2">{assessment.cap_dbm} dB/m</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Clinical Interpretation */}
      <div className="mb-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Clinical Interpretation</p>
        <p className="text-sm text-slate-700 leading-relaxed">{getInterpretation(assessment.fib4)}</p>
        <p className="text-xs text-slate-500 mt-2">Reference: {FIB4_REFERENCE_CITATION}</p>
      </div>

      {/* Footer disclaimer */}
      <div className="border-t border-slate-200 pt-4 mt-6">
        <p className="text-xs text-slate-400 leading-relaxed text-center">
          This report is for clinical decision support only, not an independent diagnosis.
          LEAF is an academic prototype using fictional/demo data. All values are fictitious.
          Page 1 of 1
        </p>
      </div>
    </div>
  );
}
