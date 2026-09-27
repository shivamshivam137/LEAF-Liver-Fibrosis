// LEAF - Assessments List Page
// Route: /assessments  — aggregated view of all assessments across all patients

import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { mockApi } from '../api/mockData';
import { TableSkeleton } from '../components/common/index';
import { formatDate, formatFIB4, getFIB4Label } from '../utils/formatters';

export default function AssessmentsPage() {
  const navigate = useNavigate();

  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: () => mockApi.getPatients(),
  });

  // Collect all assessments across all patients for the demo
  const { data: allAssessments, isLoading: loadingAssessments } = useQuery({
    queryKey: ['all-assessments'],
    queryFn: async () => {
      if (!patients) return [];
      const results = await Promise.all(
        patients.map(p => mockApi.getAssessments(p.id).then(a => a.map(ass => ({ ...ass, patientName: p.display_name, patientCode: p.patient_code }))))
      );
      return results.flat().sort((a, b) => b.assessment_date.localeCompare(a.assessment_date));
    },
    enabled: !!patients,
  });

  const loading = isLoading || loadingAssessments;

  return (
    <div className="space-y-5 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Assessments</h2>
          <p className="text-sm text-slate-500 mt-0.5">All liver fibrosis assessments — fictional demo data</p>
        </div>
        <button
          id="new-assessment-btn"
          onClick={() => navigate('/assessments/new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 shadow-sm"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          New Assessment
        </button>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="p-6"><TableSkeleton /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" role="table" aria-label="All assessments">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  {['Date', 'Patient', 'AST', 'ALT', 'Platelets', 'FIB-4', 'FibroScan', 'Status'].map(h => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(allAssessments ?? []).map(a => {
                  const label = getFIB4Label(a.fib4);
                  return (
                    <tr
                      key={a.id}
                      className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                      onClick={() => navigate(`/patients/${a.patient_id}/assessments/${a.id}`)}
                      tabIndex={0}
                      onKeyDown={e => e.key === 'Enter' && navigate(`/patients/${a.patient_id}/assessments/${a.id}`)}
                    >
                      <td className="py-3.5 px-4 text-sm font-medium text-slate-700 whitespace-nowrap">{formatDate(a.assessment_date)}</td>
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{(a as any).patientName}</p>
                          <p className="text-xs text-slate-400 font-mono">{(a as any).patientCode}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-slate-600">{a.ast}</td>
                      <td className="py-3.5 px-4 text-sm text-slate-600">{a.alt}</td>
                      <td className="py-3.5 px-4 text-sm text-slate-600">{a.platelets}</td>
                      <td className="py-3.5 px-4">
                        {a.fib4 != null ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-800">{formatFIB4(a.fib4)}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              label.color === 'success' ? 'bg-green-100 text-green-700' :
                              label.color === 'warning' ? 'bg-amber-100 text-amber-700' :
                              label.color === 'error' ? 'bg-red-100 text-red-700' :
                              'bg-slate-100 text-slate-600'
                            }`}>{label.label}</span>
                          </div>
                        ) : <span className="text-slate-400 text-sm">—</span>}
                      </td>
                      <td className="py-3.5 px-4 text-sm text-slate-600">{a.fibroscan_kpa != null ? `${a.fibroscan_kpa} kPa` : '—'}</td>
                      <td className="py-3.5 px-4">
                        {a.data_quality_flags.length > 0
                          ? <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-lg font-medium">Review</span>
                          : <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-lg font-medium">OK</span>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
