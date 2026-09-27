// LiverAsist - Trend Charts Component
// Used in Patient Profile for FIB-4 and FibroScan longitudinal visualization

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { formatDate } from '../../utils/formatters';
import type { AssessmentHistoryEntry } from '../../types/assessment';

interface TrendChartProps {
  assessments: AssessmentHistoryEntry[];
  title: string;
  dataKey: keyof AssessmentHistoryEntry;
  unit: string;
  color?: string;
  referenceLines?: { y: number; label: string; color: string }[];
}

// Custom tooltip
function CustomTooltip({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} style={{ color: entry.color }} className="font-medium">
          {entry.name}: {entry.value?.toFixed(3)} {unit}
        </p>
      ))}
    </div>
  );
}

export function TrendChart({
  assessments,
  title,
  dataKey,
  unit,
  color = '#0d9488',
  referenceLines = [],
}: TrendChartProps) {
  // Sort ascending by date for chart
  const chartData = [...assessments]
    .sort((a, b) => a.assessment_date.localeCompare(b.assessment_date))
    .map(a => ({
      date: formatDate(a.assessment_date),
      rawDate: a.assessment_date,
      value: a[dataKey] as number | undefined,
    }))
    .filter(d => d.value != null);

  if (chartData.length === 0) {
    return (
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">{title}</h3>
        <div className="h-32 flex items-center justify-center text-slate-400 text-sm">
          No data available for chart.
        </div>
      </div>
    );
  }

  const values = chartData.map(d => d.value as number);
  const minVal = Math.max(0, Math.min(...values) - 0.5);
  const maxVal = Math.max(...values) + 0.5;

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">{title}</h3>

      {/* Accessible text summary */}
      <p className="sr-only">
        {title} trend chart. Data points: {chartData.map(d => `${d.date}: ${d.value?.toFixed(3)} ${unit}`).join(', ')}
      </p>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ top: 5, right: 16, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
          />
          <YAxis
            domain={[minVal, maxVal]}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => v.toFixed(1)}
            label={{ value: unit, angle: -90, position: 'insideLeft', fontSize: 10, fill: '#94a3b8', dx: -4 }}
          />
          <Tooltip content={<CustomTooltip unit={unit} />} />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          {referenceLines.map(ref => (
            <ReferenceLine
              key={ref.label}
              y={ref.y}
              stroke={ref.color}
              strokeDasharray="4 4"
              label={{ value: ref.label, fill: ref.color, fontSize: 10, position: 'right' }}
            />
          ))}
          <Line
            type="monotone"
            dataKey="value"
            name={title}
            stroke={color}
            strokeWidth={2.5}
            dot={{ r: 5, fill: color, strokeWidth: 2, stroke: 'white' }}
            activeDot={{ r: 7, stroke: color, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <p className="text-xs text-slate-400 text-center mt-2">
        {chartData.length} assessment{chartData.length !== 1 ? 's' : ''} · Units: {unit}
      </p>
    </div>
  );
}

// ─── FIB-4 Trend (with reference lines for context) ──────────

export function FIB4TrendChart({ assessments }: { assessments: AssessmentHistoryEntry[] }) {
  return (
    <TrendChart
      assessments={assessments}
      title="FIB-4 Score Over Time"
      dataKey="fib4"
      unit=""
      color="#0d9488"
      referenceLines={[
        { y: 1.3, label: '1.30', color: '#22c55e' },
        { y: 2.67, label: '2.67', color: '#ef4444' },
      ]}
    />
  );
}

// ─── FibroScan Trend ──────────────────────────────────────────

export function FibroScanTrendChart({ assessments }: { assessments: AssessmentHistoryEntry[] }) {
  return (
    <TrendChart
      assessments={assessments}
      title="Liver Stiffness (FibroScan) Over Time"
      dataKey="fibroscan_kpa"
      unit="kPa"
      color="#2563eb"
    />
  );
}

// ─── Multi-line Lab Trends ────────────────────────────────────

export function LabTrendChart({ assessments }: { assessments: AssessmentHistoryEntry[] }) {
  const chartData = [...assessments]
    .sort((a, b) => a.assessment_date.localeCompare(b.assessment_date))
    .map(a => ({
      date: formatDate(a.assessment_date),
      AST: a.ast,
      ALT: a.alt,
      Platelets: a.platelets,
    }));

  if (chartData.length === 0) return null;

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Laboratory Values Over Time</h3>
      <p className="sr-only">
        Laboratory values chart showing AST, ALT, and Platelet trends over {chartData.length} assessments.
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ top: 5, right: 16, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          <Line type="monotone" dataKey="AST" name="AST (U/L)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="ALT" name="ALT (U/L)" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="Platelets" name="Platelets (×10⁹/L)" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-slate-400 mt-2 text-center">
        Reference lines for FIB-4 are informational. Thresholds require clinical context (Sterling et al., 2006).
      </p>
    </div>
  );
}
