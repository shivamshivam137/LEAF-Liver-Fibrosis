// LiverAsist - Formatting Utilities

/**
 * Format a date string (ISO 8601) to a human-readable display format.
 * e.g. "2026-09-27" → "27 Sep 2026"
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  try {
    const date = new Date(dateStr + (dateStr.length === 10 ? 'T00:00:00' : ''));
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

/**
 * Format a datetime string to display format.
 * e.g. "2026-09-27T10:30:00Z" → "27 Sep 2026, 10:30"
 */
export function formatDateTime(dateStr: string): string {
  if (!dateStr) return '—';
  try {
    const date = new Date(dateStr);
    return date.toLocaleString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format a decimal number to a fixed number of decimal places.
 * Returns '—' for null/undefined/NaN.
 */
export function formatDecimal(value: number | null | undefined, decimals = 2): string {
  if (value === null || value === undefined || isNaN(value)) return '—';
  return value.toFixed(decimals);
}

/**
 * Format FIB-4 score with 3 decimal places.
 */
export function formatFIB4(value: number | null | undefined): string {
  return formatDecimal(value, 3);
}

/**
 * Return a human-readable label for a FIB-4 value based on commonly referenced ranges.
 * NOTE: These ranges are provided for informational context only.
 * Clinical interpretation must consider patient context, population, and guideline version.
 * Reference: Sterling RK et al. Hepatology. 2006;43(6):1317-25.
 */
export function getFIB4Label(value: number | null | undefined): {
  label: string;
  color: 'success' | 'warning' | 'error' | 'neutral';
} {
  if (value === null || value === undefined) return { label: 'Not calculated', color: 'neutral' };
  if (value < 1.3) return { label: 'Lower range', color: 'success' };
  if (value <= 2.67) return { label: 'Indeterminate range', color: 'warning' };
  return { label: 'Higher range', color: 'error' };
}

/**
 * Format a relative time string (e.g. "2 days ago").
 */
export function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return '—';
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  } catch {
    return dateStr;
  }
}

/**
 * Format a delta (change) value with +/- prefix and optional unit.
 */
export function formatDelta(current: number, previous: number, decimals = 2, unit = ''): string {
  const delta = current - previous;
  const sign = delta >= 0 ? '+' : '';
  return `${sign}${delta.toFixed(decimals)}${unit ? ' ' + unit : ''}`;
}
