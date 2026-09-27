// LiverAsist - Common UI Components

// ─── LoadingSkeleton ─────────────────────────────────────────
export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

export function CardSkeleton() {
  return (
    <div className="card p-6 space-y-3" aria-busy="true" aria-label="Loading...">
      <LoadingSkeleton className="h-4 w-1/3" />
      <LoadingSkeleton className="h-8 w-1/2" />
      <LoadingSkeleton className="h-3 w-2/3" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-busy="true" aria-label="Loading table...">
      {Array.from({ length: rows }).map((_, i) => (
        <LoadingSkeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

// ─── EmptyState ──────────────────────────────────────────────
interface EmptyStateProps {
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && (
        <div className="mb-4 text-slate-300">{icon}</div>
      )}
      <h3 className="text-lg font-semibold text-slate-700 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm max-w-xs mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 focus-visible:outline-primary-500"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// ─── ErrorState ──────────────────────────────────────────────
interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-error-100 flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-error-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-slate-500 text-sm mb-5">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

// ─── Badge ───────────────────────────────────────────────────
type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

const badgeStyles: Record<BadgeVariant, string> = {
  success: 'bg-success-100 text-success-700',
  warning: 'bg-warning-100 text-warning-700',
  error: 'bg-error-100 text-error-700',
  info: 'bg-info-100 text-info-700',
  neutral: 'bg-slate-100 text-slate-600',
};

export function Badge({ children, variant = 'neutral' }: { children: React.ReactNode; variant?: BadgeVariant }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeStyles[variant]}`}>
      {children}
    </span>
  );
}

// ─── Alert ───────────────────────────────────────────────────
type AlertVariant = 'info' | 'warning' | 'error' | 'success';

const alertStyles: Record<AlertVariant, { container: string; icon: string }> = {
  info: { container: 'bg-info-50 border-info-200 text-info-800', icon: 'text-info-500' },
  warning: { container: 'bg-warning-50 border-warning-200 text-warning-800', icon: 'text-warning-500' },
  error: { container: 'bg-error-50 border-error-200 text-error-800', icon: 'text-error-500' },
  success: { container: 'bg-success-50 border-success-200 text-success-800', icon: 'text-success-500' },
};

export function Alert({ variant = 'info', title, children }: { variant?: AlertVariant; title?: string; children: React.ReactNode }) {
  const styles = alertStyles[variant];
  return (
    <div className={`rounded-xl border p-4 ${styles.container}`} role="alert">
      {title && <p className="font-semibold text-sm mb-1">{title}</p>}
      <p className="text-sm">{children}</p>
    </div>
  );
}

// ─── StatCard ────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
  colorClass?: string;
}

export function StatCard({ title, value, subtitle, icon, trend, colorClass = 'text-primary-600 bg-primary-50' }: StatCardProps) {
  return (
    <div className="card p-6 fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-800">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend.positive ? 'text-success-600' : 'text-error-600'}`}>
              <span>{trend.positive ? '↑' : '↓'}</span>
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// ─── Medical Disclaimer ───────────────────────────────────────
export function MedicalDisclaimer() {
  return (
    <div className="mt-auto pt-4 border-t border-slate-200">
      <p className="text-xs text-slate-400 text-center leading-relaxed">
        <strong className="text-slate-500">Clinical decision-support prototype:</strong>{' '}
        LiverAsist organizes health information and performs specified calculations.
        It does not independently diagnose liver disease or replace professional clinical judgment.
      </p>
    </div>
  );
}
