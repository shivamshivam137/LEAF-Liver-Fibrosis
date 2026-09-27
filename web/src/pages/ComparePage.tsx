// LEAF - History & Trends Page
// Time period filter (1M/3M/6M/1Y/All), FIB-4 + FibroScan charts, assessment history table

import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import { mockApi } from '../api/mockData';
import { CardSkeleton } from '../components/common/index';
import { FIB4TrendChart, FibroScanTrendChart, LabTrendChart } from '../components/charts/TrendCharts';
import { formatDate, formatFIB4 } from '../utils/formatters';
import type { AssessmentHistoryEntry } from '../types/assessment';

type Period = '1M' | '3M' | '6M' | '1Y' | 'All';

const periods: Period[] = ['1M', '3M', '6M', '1Y', 'All'];

function filterByPeriod(entries: AssessmentHistoryEntry[], period: Period): AssessmentHistoryEntry[] {
  if (period === 'All') return entries;
  const now = new Date();
  const monthsMap: Record<Exclude<Period, 'All'>, number> = { '1M': 1, '3M': 3, '6M': 6, '1Y': 12 };
  const months = monthsMap[period as Exclude<Period, 'All'>];
  const cutoff = new Date(now.getFullYear(), now.getMonth() - months, now.getDate());
  return entries.filter(e => new Date(e.assessment_date) >= cutoff);
}

export default function ComparePage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>('All');

  const { data: patient } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => mockApi.getPatient(patientId!),
    enabled: !!patientId,
  });

  const { data: assessments, isLoading } = useQuery({
    queryKey: ['assessments', patientId],
    queryFn: () => mockApi.getAssessments(patientId!),
    enabled: !!patientId,
  });

  const allEntries: AssessmentHistoryEntry[] = useMemo(() =>
    (assessments ?? []).map(a => ({
      id: a.id,
      assessment_date: a.assessment_date,
      ast: a.ast, alt: a.alt, platelets: a.platelets,
      fib4: a.fib4, fibroscan_kpa: a.fibroscan_kpa, cap_dbm: a.cap_dbm,
      has_flags: a.data_quality_flags.length > 0,
    })),
    [assessments]
  );

  const filteredEntries = useMemo(() => filterByPeriod(allEntries, period), [allEntries, period]);

  if (isLoading) return <div className="space-y-4"><CardSkeleton /><CardSkeleton /></div>;

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/patients/${patientId}`)}
          className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
          aria-label="Back to patient"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">History &amp; Trends</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {patient?.display_name} · {patient?.patient_code}
          </p>
        </div>
      </div>

      {/* Patient + Period controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700">
          <span className="font-mono text-slate-500">{patient?.patient_code}</span>
          <span className="text-slate-300">·</span>
          <span className="font-medium">{patient?.display_name}</span>
        </div>

        {/* Time period buttons */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          {periods.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                period === p
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              aria-pressed={period === p}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      {filteredEntries.length >= 2 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FIB4TrendChart assessments={filteredEntries} />
            <FibroScanTrendChart assessments={filteredEntries} />
          </div>
          <LabTrendChart assessments={filteredEntries} />
        </>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-slate-500 text-sm">
            {allEntries.length < 2
              ? 'At least 2 assessments are needed to display trends.'
              : `No assessments in the selected period (${period}). Try a wider range.`}
          </p>
        </div>
      )}

      {/* Assessment History Table */}
      <div className="card">
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-base font-semibold text-slate-800">Assessment History</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Fictional demo data · Numerical changes alone do not establish disease progression or regression
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" role="table" aria-label="Assessment history">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {['Date', 'Age', 'AST', 'ALT', 'Platelets', 'FIB-4', 'FibroScan', 'CAP'].map(h => (
                  <th key={h} className="py-2.5 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-sm text-slate-400">No assessments in selected period.</td>
                </tr>
              ) : (
                filteredEntries.map(a => (
                  <tr
                    key={a.id}
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                    onClick={() => navigate(`/patients/${patientId}/assessments/${a.id}`)}
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && navigate(`/patients/${patientId}/assessments/${a.id}`)}
                  >
                    <td className="py-3.5 px-4 text-sm font-medium text-slate-700">{formatDate(a.assessment_date)}</td>
                    <td className="py-3.5 px-4 text-sm text-slate-600">—</td>
                    <td className="py-3.5 px-4 text-sm text-slate-600">{a.ast}</td>
                    <td className="py-3.5 px-4 text-sm text-slate-600">{a.alt}</td>
                    <td className="py-3.5 px-4 text-sm text-slate-600">{a.platelets}</td>
                    <td className="py-3.5 px-4 text-sm font-bold text-slate-800">{a.fib4 != null ? formatFIB4(a.fib4) : '—'}</td>
                    <td className="py-3.5 px-4 text-sm text-slate-600">{a.fibroscan_kpa != null ? `${a.fibroscan_kpa} kPa` : '—'}</td>
                    <td className="py-3.5 px-4 text-sm text-slate-600">{a.cap_dbm != null ? `${a.cap_dbm}` : '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
