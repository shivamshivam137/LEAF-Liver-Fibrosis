// LEAF - Dashboard Page
// Good morning greeting, 3 stat cards, Quick Actions, Recent Patients table

import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Users, ClipboardList, TrendingUp, Plus, UserPlus,
  FileText, ArrowRight, AlertTriangle
} from 'lucide-react';
import { mockApi } from '../api/mockData';
import { CardSkeleton } from '../components/common/index';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, formatFIB4, getFIB4Label } from '../utils/formatters';

// ─── Time-based greeting ──────────────────────────────────────
function getGreeting(name: string): string {
  const hour = new Date().getHours();
  const first = name.split(' ').find(w => w !== 'Dr.' && w !== 'Dr') ?? name.split(' ')[0];
  if (hour < 12) return `Good morning, ${first}`;
  if (hour < 17) return `Good afternoon, ${first}`;
  return `Good evening, ${first}`;
}

// ─── Avg FIB-4 helper ─────────────────────────────────────────
function avgFIB4(fib4s: (number | undefined)[]): string {
  const valid = fib4s.filter((v): v is number => v != null);
  if (!valid.length) return '—';
  return (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(2);
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: patients, isLoading, isError, refetch } = useQuery({
    queryKey: ['patients'],
    queryFn: () => mockApi.getPatients(),
  });

  const greeting = getGreeting(user?.display_name ?? 'Doctor');
  const totalPatients = patients?.length ?? 0;
  const totalAssessments = patients?.reduce((s, p) => s + p.assessment_count, 0) ?? 0;
  const avgScore = avgFIB4(patients?.map(p => p.latest_fib4) ?? []);
  const needsReview = patients?.filter(p => p.has_quality_flags) ?? [];

  return (
    <div className="space-y-6 fade-in">

      {/* Greeting header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{greeting}</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Here's an overview of your liver fibrosis assessment system.
          </p>
        </div>
      </div>

      {/* Stat cards + Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">

        {/* 3 Stat Cards */}
        <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {isLoading ? (
            <><CardSkeleton /><CardSkeleton /><CardSkeleton /></>
          ) : (
            <>
              {/* Total Patients */}
              <div className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-slate-500">Total Patients</p>
                  <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                    <Users className="w-4.5 h-4.5 text-teal-600" aria-hidden="true" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-800">{totalPatients}</p>
                <p className="text-xs text-green-600 font-medium mt-1">Demo records</p>
              </div>

              {/* Assessments */}
              <div className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-slate-500">Assessments</p>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                    <ClipboardList className="w-4.5 h-4.5 text-blue-600" aria-hidden="true" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-800">{totalAssessments}</p>
                <p className="text-xs text-blue-600 font-medium mt-1">All time</p>
              </div>

              {/* Avg FIB-4 */}
              <div className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-slate-500">Avg FIB-4 Score</p>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                    <TrendingUp className="w-4.5 h-4.5 text-amber-600" aria-hidden="true" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-800">{avgScore}</p>
                <p className="text-xs text-slate-400 font-medium mt-1">Across patients</p>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions panel */}
        <div className="card p-5 flex flex-col gap-3 relative overflow-hidden">
          <p className="text-sm font-semibold text-slate-700">Quick Actions</p>

          <button
            id="quick-new-assessment"
            onClick={() => navigate('/assessments/new')}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 w-full"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            New Assessment
          </button>

          <button
            id="quick-add-patient"
            onClick={() => navigate('/patients')}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 w-full"
          >
            <UserPlus className="w-4 h-4" aria-hidden="true" />
            Add Patient
          </button>

          <button
            id="quick-view-reports"
            onClick={() => navigate('/reports')}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 w-full"
          >
            <FileText className="w-4 h-4" aria-hidden="true" />
            View Reports
          </button>

          {/* Decorative leaf */}
          <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none" aria-hidden="true">
            <svg width="120" height="120" viewBox="0 0 300 300" fill="none">
              <path d="M150 20C150 20 40 90 40 170C40 230 90 280 150 280C210 280 260 230 260 170C260 90 150 20 150 20Z" fill="#16a34a" />
            </svg>
          </div>

          <p className="text-xs text-slate-400 mt-auto">Early detection leads to better outcomes.</p>
        </div>
      </div>

      {/* Quality notices */}
      {!isLoading && needsReview.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-500" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-slate-800">Patients Requiring Review</h3>
          </div>
          <div className="space-y-2">
            {needsReview.map(p => (
              <div
                key={p.id}
                onClick={() => navigate(`/patients/${p.id}`)}
                className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer hover:bg-amber-100"
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && navigate(`/patients/${p.id}`)}
                aria-label={`Review patient ${p.display_name}`}
              >
                <span className="text-sm font-medium text-slate-800">{p.display_name} <span className="text-slate-400 font-mono text-xs">({p.patient_code})</span></span>
                <span className="text-xs text-amber-700">Data quality notice →</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">Informational workflow aids — not diagnoses. Clinical correlation required.</p>
        </div>
      )}

      {/* Recent Patients */}
      <div className="card">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="text-base font-semibold text-slate-800">Recent Patients</h3>
          <button onClick={() => navigate('/patients')} className="text-sm text-teal-600 hover:text-teal-700 font-medium">
            View all →
          </button>
        </div>

        {isLoading ? (
          <div className="px-5 pb-5 space-y-2">
            {[1,2,3].map(i => <div key={i} className="skeleton h-12 w-full" aria-hidden="true" />)}
          </div>
        ) : isError ? (
          <div className="px-5 pb-5 text-sm text-slate-500">Unable to load patients. <button onClick={() => refetch()} className="text-teal-600">Retry</button></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Patient ID', 'Name', 'Age', 'Last Assessment', ''].map(h => (
                    <th key={h} className="py-2.5 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {patients?.slice(0, 5).map(p => {
                  const fib4Label = getFIB4Label(p.latest_fib4);
                  return (
                    <tr
                      key={p.id}
                      className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                      onClick={() => navigate(`/patients/${p.id}`)}
                      tabIndex={0}
                      onKeyDown={e => e.key === 'Enter' && navigate(`/patients/${p.id}`)}
                    >
                      <td className="py-3.5 px-4 text-sm font-mono text-slate-600">{p.patient_code}</td>
                      <td className="py-3.5 px-4 text-sm font-semibold text-slate-800">{p.display_name}</td>
                      <td className="py-3.5 px-4 text-sm text-slate-600">{p.age}</td>
                      <td className="py-3.5 px-4 text-sm text-slate-600">{p.latest_assessment_date ? formatDate(p.latest_assessment_date) : '—'}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button className="text-xs text-teal-600 font-medium hover:underline">View</button>
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
