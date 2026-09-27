// LEAF - Settings Page

import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FIB4_REFERENCE_CITATION, FIB4_FORMULA_ID, FIB4_FORMULA_VERSION, FIB4_REFERENCE_ID } from '../utils/fibrosis';
import { LogOut, User, Shield, BookOpen, Info } from 'lucide-react';
import { LeafLogotype } from '../components/common/LeafLogo';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-6 fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
        <p className="text-sm text-slate-500 mt-0.5">Account and application configuration</p>
      </div>

      {/* User profile */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <User className="w-4.5 h-4.5 text-slate-500" aria-hidden="true" />
          <h3 className="text-base font-semibold text-slate-800">User Profile</h3>
        </div>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-teal-100 border border-teal-200 flex items-center justify-center">
            <span className="text-xl font-bold text-teal-700">
              {user?.display_name?.split(' ').map(w => w[0]).join('').slice(0, 2) ?? 'DR'}
            </span>
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-800">{user?.display_name ?? 'Dr. Demo'}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <span className="inline-block mt-1 text-xs bg-teal-50 text-teal-700 border border-teal-100 px-2.5 py-0.5 rounded-full font-medium capitalize">
              {user?.role ?? 'clinician'}
            </span>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          id="sign-out-btn"
          className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          Sign Out
        </button>
      </div>

      {/* Clinical references */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <BookOpen className="w-4.5 h-4.5 text-slate-500" aria-hidden="true" />
          <h3 className="text-base font-semibold text-slate-800">Clinical Reference Information</h3>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">FIB-4 Formula</p>
            {[
              ['Formula', '(Age × AST) / (Platelets × √ALT)'],
              ['Formula ID', `${FIB4_FORMULA_ID} v${FIB4_FORMULA_VERSION}`],
              ['Reference ID', FIB4_REFERENCE_ID],
              ['Units', 'Age: years · AST: U/L · ALT: U/L · Platelets: ×10⁹/L'],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-3 text-sm">
                <span className="text-slate-500 w-28 flex-shrink-0">{k}:</span>
                <span className="text-slate-800 font-mono text-xs leading-relaxed">{v}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Primary Reference</p>
            <p className="text-sm text-slate-700 leading-relaxed">{FIB4_REFERENCE_CITATION}</p>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong>Important:</strong> FIB-4 thresholds and clinical interpretation depend on patient population, comorbidities,
              and the clinical guideline version in use. The LEAF prototype uses reference ranges from Sterling et al. (2006)
              for informational context only.
            </p>
          </div>
        </div>
      </div>

      {/* App info */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Info className="w-4.5 h-4.5 text-slate-500" aria-hidden="true" />
          <h3 className="text-base font-semibold text-slate-800">Application Information</h3>
        </div>
        <div className="flex items-center gap-3 mb-5">
          <LeafLogotype />
        </div>
        <div className="space-y-0 divide-y divide-slate-100">
          {[
            ['Application', 'LEAF'],
            ['Full Name', 'Liver Evaluation and Assessment for Fibrosis'],
            ['Version', '0.1.0 (Academic Prototype)'],
            ['Type', 'Clinical Decision-Support Prototype'],
            ['Data', 'Fictional / de-identified demo data only'],
            ['Status', 'Academic mini-project — not for clinical use'],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-4 py-2.5">
              <span className="text-slate-500 text-sm w-36 flex-shrink-0">{k}:</span>
              <span className="text-slate-800 text-sm">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Security note */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4.5 h-4.5 text-slate-500" aria-hidden="true" />
          <h3 className="text-base font-semibold text-slate-800">Security & Privacy</h3>
        </div>
        <p className="text-sm text-slate-600 mb-3">
          This is an <strong>academic prototype</strong>. A real healthcare deployment would require:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-500 mb-4">
          <li>Strong authentication and session management</li>
          <li>Role-based access controls and audit logging</li>
          <li>Data encryption in transit and at rest</li>
          <li>Regulatory compliance review (jurisdiction-dependent)</li>
          <li>Formal privacy impact assessment</li>
        </ul>
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong>LEAF</strong> does not store real patient data. All data in this prototype is fictional and used for demonstration purposes only.
        </p>
      </div>
    </div>
  );
}
