// LEAF - Reports Page
// Route: /reports — Generate and download PDF assessment reports

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Download, Printer } from 'lucide-react';
import { mockApi } from '../api/mockData';
import { CardSkeleton } from '../components/common/index';
import { PrintReport } from '../components/common/PrintReport';
import { formatDate, formatFIB4 } from '../utils/formatters';

export default function ReportsPage() {
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const { data: patients, isLoading: pLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: () => mockApi.getPatients(),
  });

  const { data: assessments, isLoading: aLoading } = useQuery({
    queryKey: ['assessments', selectedPatientId],
    queryFn: () => mockApi.getAssessments(selectedPatientId),
    enabled: !!selectedPatientId,
  });

  const { data: patient } = useQuery({
    queryKey: ['patient', selectedPatientId],
    queryFn: () => mockApi.getPatient(selectedPatientId),
    enabled: !!selectedPatientId,
  });

  const selectedAssessment = assessments?.find(a => a.id === selectedAssessmentId);

  const handleGenerate = () => setShowPreview(true);
  const handlePrint = () => window.print();

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Reports</h2>
        <p className="text-sm text-slate-500 mt-0.5">Generate PDF assessment reports for patients — fictional demo data only</p>
      </div>

      {/* Configuration card */}
      <div className="card p-6 space-y-5 no-print">
        <h3 className="text-base font-semibold text-slate-800 border-b border-slate-100 pb-3">Report Configuration</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Patient selector */}
          <div>
            <label htmlFor="report-patient" className="block text-sm font-medium text-slate-700 mb-1.5">
              Select Patient <span className="text-red-500">*</span>
            </label>
            {pLoading ? (
              <div className="skeleton h-11 w-full rounded-xl" />
            ) : (
              <select
                id="report-patient"
                value={selectedPatientId}
                onChange={e => { setSelectedPatientId(e.target.value); setSelectedAssessmentId(''); setShowPreview(false); }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="">Select a patient...</option>
                {patients?.map(p => (
                  <option key={p.id} value={p.id}>{p.patient_code} – {p.display_name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Assessment selector */}
          <div>
            <label htmlFor="report-assessment" className="block text-sm font-medium text-slate-700 mb-1.5">
              Select Assessment <span className="text-red-500">*</span>
            </label>
            {aLoading ? (
              <div className="skeleton h-11 w-full rounded-xl" />
            ) : (
              <select
                id="report-assessment"
                value={selectedAssessmentId}
                onChange={e => { setSelectedAssessmentId(e.target.value); setShowPreview(false); }}
                disabled={!selectedPatientId}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select an assessment...</option>
                {assessments?.map(a => (
                  <option key={a.id} value={a.id}>
                    {formatDate(a.assessment_date)} — FIB-4: {a.fib4 != null ? formatFIB4(a.fib4) : 'N/A'}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleGenerate}
            disabled={!selectedPatientId || !selectedAssessmentId}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="w-4 h-4" aria-hidden="true" />
            Generate Report
          </button>
          {showPreview && (
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-semibold hover:bg-slate-900"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              Print / Save as PDF
            </button>
          )}
        </div>
      </div>

      {/* Report Preview */}
      {showPreview && patient && selectedAssessment ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between no-print">
            <h3 className="text-base font-semibold text-slate-800">Report Preview</h3>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              Download PDF
            </button>
          </div>

          {/* Wrapper: screen shows as card, print shows full bleed */}
          <div className="card overflow-hidden no-print">
            <PrintReport patient={patient} assessment={selectedAssessment} />
          </div>

          {/* Print-only: renders outside card */}
          <div className="hidden print:block">
            <PrintReport patient={patient} assessment={selectedAssessment} />
          </div>
        </div>
      ) : !showPreview && (
        <div className="card p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-7 h-7 text-slate-300" aria-hidden="true" />
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">No report generated yet</p>
          <p className="text-slate-400 text-xs">Select a patient and assessment above, then click Generate Report.</p>
        </div>
      )}

      {/* Info note */}
      <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl no-print">
        <p className="text-xs text-teal-800 leading-relaxed">
          <strong>How to save as PDF:</strong> Click "Print / Save as PDF", then in the print dialog select "Save as PDF" as the destination.
          The report is formatted for A4 / Letter paper. All data is fictional and for demo purposes only.
        </p>
      </div>
    </div>
  );
}
