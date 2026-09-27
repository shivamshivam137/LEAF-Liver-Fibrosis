// LEAF - Patients List Page
// Patient ID, Name, Age, Gender, Last Assessment, Actions (three-dot menu)

import { useState, useRef, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, MoreHorizontal, Eye, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import { mockApi, MOCK_PATIENTS } from '../api/mockData';
import { TableSkeleton, EmptyState, ErrorState } from '../components/common/index';
import { formatDate } from '../utils/formatters';
import type { PatientSummary } from '../types/patient';

// ─── Three-dot Actions Menu ───────────────────────────────────

function ActionsMenu({ patientId, patientName, onEdit }: { patientId: string; patientName: string; onEdit: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={e => { e.stopPropagation(); setOpen(v => !v); }}
        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        aria-label={`Actions for ${patientName}`}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-10 w-40 bg-white rounded-xl border border-slate-200 shadow-lg py-1 fade-in">
          <button
            onClick={e => { e.stopPropagation(); navigate(`/patients/${patientId}`); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Eye className="w-3.5 h-3.5" aria-hidden="true" /> View
          </button>
          <button
            onClick={e => { e.stopPropagation(); onEdit(); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Pencil className="w-3.5 h-3.5" aria-hidden="true" /> Edit
          </button>
          <button
            onClick={e => { e.stopPropagation(); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Add Patient Modal ────────────────────────────────────────

const patientSchema = z.object({
  patient_code: z.string().min(1, 'Patient ID is required.'),
  display_name: z.string().min(1, 'Name is required.'),
  age: z.coerce.number().int().min(1).max(120, 'Please verify age.'),
  sex: z.enum(['male', 'female', 'other', 'unspecified']),
  notes: z.string().optional(),
});
type PatientForm = z.infer<typeof patientSchema>;

function AddPatientModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PatientForm>({
    resolver: zodResolver(patientSchema),
    defaultValues: { sex: 'unspecified' },
  });

  const onSubmit = async (data: PatientForm) => {
    await new Promise(r => setTimeout(r, 500));
    MOCK_PATIENTS.push({
      id: `patient-${Date.now()}`,
      patient_code: data.patient_code,
      display_name: data.display_name,
      age: data.age,
      sex: data.sex,
      notes: data.notes ?? '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="add-patient-title">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md fade-in">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 id="add-patient-title" className="text-lg font-semibold text-slate-800">Add Patient</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">Use fictional or de-identified data only. Demo prototype.</p>
          <div>
            <label htmlFor="patient_code" className="block text-sm font-medium text-slate-700 mb-1">Patient ID <span className="text-red-500">*</span></label>
            <input id="patient_code" {...register('patient_code')} className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.patient_code ? 'border-red-400' : 'border-slate-300'}`} placeholder="e.g. P-1004" />
            {errors.patient_code && <p className="mt-1 text-xs text-red-600">{errors.patient_code.message}</p>}
          </div>
          <div>
            <label htmlFor="display_name" className="block text-sm font-medium text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
            <input id="display_name" {...register('display_name')} className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.display_name ? 'border-red-400' : 'border-slate-300'}`} placeholder="e.g. Demo Patient D" />
            {errors.display_name && <p className="mt-1 text-xs text-red-600">{errors.display_name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-1">Age <span className="text-red-500">*</span></label>
              <input id="age" type="number" inputMode="numeric" {...register('age')} className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.age ? 'border-red-400' : 'border-slate-300'}`} placeholder="e.g. 52" />
              {errors.age && <p className="mt-1 text-xs text-red-600">{errors.age.message}</p>}
            </div>
            <div>
              <label htmlFor="sex" className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
              <select id="sex" {...register('sex')} className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                <option value="unspecified">Unspecified</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">Notes <span className="text-slate-400 text-xs">(optional)</span></label>
            <textarea id="notes" {...register('notes')} rows={2} className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 disabled:opacity-60">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Add Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Mobile Patient Card ──────────────────────────────────────
function PatientCard({ patient }: { patient: PatientSummary }) {
  const navigate = useNavigate();
  return (
    <div className="card p-4 cursor-pointer hover:shadow-md" onClick={() => navigate(`/patients/${patient.id}`)}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center font-bold text-teal-700 text-sm">
          {patient.display_name.split(' ').map(w => w[0]).join('').slice(0,2)}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{patient.display_name}</p>
          <p className="text-xs text-slate-400 font-mono">{patient.patient_code} · {patient.age} yrs · <span className="capitalize">{patient.sex}</span></p>
        </div>
      </div>
      <div className="text-xs text-slate-500">Last assessment: {patient.latest_assessment_date ? formatDate(patient.latest_assessment_date) : '—'}</div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────

export default function PatientsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const { data: patients, isLoading, isError, refetch } = useQuery({
    queryKey: ['patients'],
    queryFn: () => mockApi.getPatients(),
  });

  const filtered = patients?.filter(p =>
    p.display_name.toLowerCase().includes(search.toLowerCase()) ||
    p.patient_code.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <div className="space-y-5 fade-in">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-slate-800">Patients</h2>
        <button
          id="add-patient-btn"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 shadow-sm"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add Patient
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" aria-hidden="true" />
        <input
          id="patient-search"
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or phone..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          aria-label="Search patients"
        />
      </div>

      {/* Desktop table */}
      <div className="card hidden sm:block">
        {isLoading ? (
          <div className="p-6"><TableSkeleton /></div>
        ) : isError ? (
          <ErrorState message="Unable to load patients." onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={search ? 'No matching patients' : 'No patients yet'}
            description={search ? 'Try a different name or ID.' : 'Create a patient to begin.'}
            action={search ? undefined : { label: 'Add Patient', onClick: () => setShowModal(true) }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" role="table" aria-label="Patient list">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  {['Patient ID', 'Name', 'Age', 'Gender', 'Last Assessment', 'Actions'].map(h => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                    onClick={() => navigate(`/patients/${p.id}`)}
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && navigate(`/patients/${p.id}`)}
                  >
                    <td className="py-3.5 px-4 text-sm font-mono text-slate-600">{p.patient_code}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-xs font-bold text-teal-700 flex-shrink-0">
                          {p.display_name.split(' ').map(w => w[0]).join('').slice(0,2)}
                        </div>
                        <span className="text-sm font-semibold text-slate-800">{p.display_name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-sm text-slate-600">{p.age}</td>
                    <td className="py-3.5 px-4 text-sm text-slate-600 capitalize">{p.sex === 'unspecified' ? '—' : p.sex}</td>
                    <td className="py-3.5 px-4 text-sm text-slate-600">
                      {p.latest_assessment_date ? formatDate(p.latest_assessment_date) : '—'}
                    </td>
                    <td className="py-3.5 px-4" onClick={e => e.stopPropagation()}>
                      <ActionsMenu patientId={p.id} patientName={p.display_name} onEdit={() => {}} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination stub */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
              <p className="text-xs text-slate-400">Showing {filtered.length} patient{filtered.length !== 1 ? 's' : ''}</p>
              <div className="flex gap-1">
                {[1].map(n => (
                  <button key={n} className="w-7 h-7 rounded-lg text-xs font-medium bg-teal-600 text-white">{n}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {isLoading ? [1,2,3].map(i => <div key={i} className="skeleton h-28 w-full rounded-2xl" />) :
          filtered.map(p => <PatientCard key={p.id} patient={p} />)}
      </div>

      {showModal && (
        <AddPatientModal
          onClose={() => setShowModal(false)}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ['patients'] })}
        />
      )}
    </div>
  );
}
