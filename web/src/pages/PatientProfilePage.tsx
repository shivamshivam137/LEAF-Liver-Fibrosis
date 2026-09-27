// LEAF - Patient Details Page
// Tabbed layout: Overview | Assessments | Reports | Notes

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Pencil, Plus, Phone, Calendar, User } from 'lucide-react';
import { mockApi } from '../api/mockData';
import { CardSkeleton, ErrorState } from '../components/common/index';
import { FIB4TrendChart, FibroScanTrendChart } from '../components/charts/TrendCharts';
import { formatDate, formatFIB4 } from '../utils/formatters';

type Tab = 'overview' | 'assessments' | 'reports' | 'notes';

// ─── Patient Avatar ───────────────────────────────────────────
function PatientAvatar({ name, size = 'md' }: { name: string; size?: 'md' | 'lg' }) {
  const initials = name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['bg-teal-100 text-teal-700', 'bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-amber-100 text-amber-700'];
  const color = colors[initials.charCodeAt(0) % colors.length];
  const sz = size === 'lg' ? 'w-16 h-16 text-xl' : 'w-12 h-12 text-base';
  return (
    <div className={`${sz} rounded-2xl ${color} flex items-center justify-center font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────
function OverviewTab({ patientId, assessments }: { patientId: string; assessments: any[] }) {
  const navigate = useNavigate();
  const latest = assessments[0];

  const historyEntries = assessments.map(a => ({
    id: a.id, assessment_date: a.assessment_date,
    ast: a.ast, alt: a.alt, platelets: a.platelets,
    fib4: a.fib4, fibroscan_kpa: a.fibroscan_kpa, cap_dbm: a.cap_dbm,
    has_flags: a.data_quality_flags.length > 0,
  }));

  return (
    <div className="space-y-5">
      {/* Latest Assessment summary card */}
      {latest ? (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">Latest Assessment</h3>
            <span className="text-xs text-slate-400">{formatDate(latest.assessment_date)}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div className="p-3 bg-teal-50 rounded-xl">
              <p className="text-xs text-slate-500 mb-1">FIB-4</p>
              <p className="text-2xl font-bold text-teal-700">{formatFIB4(latest.fib4)}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <p className="text-xs text-slate-500 mb-1">FibroScan</p>
              <p className="text-2xl font-bold text-blue-700">{latest.fibroscan_kpa ?? '—'}</p>
              {latest.fibroscan_kpa && <p className="text-xs text-slate-400">kPa</p>}
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <p className="text-xs text-slate-500 mb-1">CAP</p>
              <p className="text-2xl font-bold text-amber-700">{latest.cap_dbm ?? '—'}</p>
              {latest.cap_dbm && <p className="text-xs text-slate-400">dB/m</p>}
            </div>
          </div>
          <button
            onClick={() => navigate(`/patients/${patientId}/assessments/${latest.id}`)}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            View Details →
          </button>
        </div>
      ) : (
        <div className="card p-8 text-center">
          <p className="text-slate-500 text-sm mb-4">No assessments yet.</p>
          <button
            onClick={() => navigate(`/assessments/new`)}
            className="px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700"
          >
            Create First Assessment
          </button>
        </div>
      )}

      {/* Assessment History table */}
      {assessments.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h3 className="text-base font-semibold text-slate-800">Assessment History</h3>
            <button className="text-sm text-teal-600 font-medium">View all →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Date', 'FIB-4', 'FibroScan'].map(h => (
                    <th key={h} className="py-2.5 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {assessments.slice(0, 4).map(a => (
                  <tr
                    key={a.id}
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                    onClick={() => navigate(`/patients/${patientId}/assessments/${a.id}`)}
                  >
                    <td className="py-3 px-4 text-sm font-medium text-slate-700">{formatDate(a.assessment_date)}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-slate-800">{formatFIB4(a.fib4)}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{a.fibroscan_kpa != null ? `${a.fibroscan_kpa} kPa` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trend charts */}
      {historyEntries.length >= 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FIB4TrendChart assessments={historyEntries} />
          <FibroScanTrendChart assessments={historyEntries} />
        </div>
      )}
    </div>
  );
}

// ─── Assessments Tab ──────────────────────────────────────────
function AssessmentsTab({ patientId, assessments }: { patientId: string; assessments: any[] }) {
  const navigate = useNavigate();
  return (
    <div className="card">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="text-base font-semibold text-slate-800">All Assessments</h3>
        <button
          onClick={() => navigate(`/assessments/new`)}
          className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700"
        >
          <Plus className="w-3.5 h-3.5" /> New
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" role="table">
          <thead>
            <tr className="border-b border-slate-100">
              {['Date', 'AST', 'ALT', 'Platelets', 'FIB-4', 'FibroScan', 'CAP'].map(h => (
                <th key={h} className="py-2.5 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assessments.map(a => (
              <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/patients/${patientId}/assessments/${a.id}`)}>
                <td className="py-3 px-4 text-sm font-medium text-slate-700">{formatDate(a.assessment_date)}</td>
                <td className="py-3 px-4 text-sm text-slate-600">{a.ast}</td>
                <td className="py-3 px-4 text-sm text-slate-600">{a.alt}</td>
                <td className="py-3 px-4 text-sm text-slate-600">{a.platelets}</td>
                <td className="py-3 px-4 text-sm font-semibold text-slate-800">{formatFIB4(a.fib4)}</td>
                <td className="py-3 px-4 text-sm text-slate-600">{a.fibroscan_kpa ?? '—'}</td>
                <td className="py-3 px-4 text-sm text-slate-600">{a.cap_dbm ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Reports Tab ──────────────────────────────────────────────
function ReportsTab({ patientId }: { patientId: string }) {
  const navigate = useNavigate();
  return (
    <div className="card p-8 text-center">
      <p className="text-slate-500 text-sm mb-4">Generate a PDF assessment report for this patient.</p>
      <button
        onClick={() => navigate('/reports')}
        className="px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700"
      >
        Go to Reports
      </button>
    </div>
  );
}

// ─── Notes Tab ────────────────────────────────────────────────
function NotesTab({ notes }: { notes?: string }) {
  return (
    <div className="card p-6">
      <h3 className="text-base font-semibold text-slate-800 mb-3">Clinical Notes</h3>
      {notes ? (
        <p className="text-sm text-slate-600 leading-relaxed">{notes}</p>
      ) : (
        <p className="text-sm text-slate-400 italic">No notes recorded for this patient.</p>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────

export default function PatientProfilePage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const { data: patient, isLoading: pLoading, isError } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => mockApi.getPatient(patientId!),
    enabled: !!patientId,
  });

  const { data: assessments = [] } = useQuery({
    queryKey: ['assessments', patientId],
    queryFn: () => mockApi.getAssessments(patientId!),
    enabled: !!patientId,
  });

  if (pLoading) return <div className="space-y-4"><CardSkeleton /><CardSkeleton /></div>;
  if (isError || !patient) return <ErrorState title="Patient not found" message="Could not load this patient." onRetry={() => navigate('/patients')} />;

  const initials = patient.display_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'assessments', label: 'Assessments' },
    { key: 'reports', label: 'Reports' },
    { key: 'notes', label: 'Notes' },
  ];

  return (
    <div className="space-y-5 fade-in">
      {/* Back */}
      <button onClick={() => navigate('/patients')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800">
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        Back to Patients
      </button>

      {/* Patient Header Card */}
      <div className="card p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <PatientAvatar name={patient.display_name} size="lg" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-slate-800">{patient.display_name}</h2>
                <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="Edit patient">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-sm text-slate-500 font-mono">Patient ID: {patient.patient_code}</p>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <span className="flex items-center gap-1.5 text-sm text-slate-600">
                  <User className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  {patient.age} yrs · <span className="capitalize">{patient.sex === 'unspecified' ? 'Gender not specified' : patient.sex}</span>
                </span>
                <span className="flex items-center gap-1.5 text-sm text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  +91 00000 00000
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/assessments/new')}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            New Assessment
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-1" role="tablist">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              role="tab"
              aria-selected={activeTab === key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === key
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'overview' && <OverviewTab patientId={patientId!} assessments={assessments} />}
        {activeTab === 'assessments' && <AssessmentsTab patientId={patientId!} assessments={assessments} />}
        {activeTab === 'reports' && <ReportsTab patientId={patientId!} />}
        {activeTab === 'notes' && <NotesTab notes={patient.notes} />}
      </div>
    </div>
  );
}
