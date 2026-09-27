// LEAF - Leaf Logo SVG Component
// Liver Evaluation and Assessment for Fibrosis

interface LeafLogoProps {
  size?: number;
  className?: string;
}

export function LeafIcon({ size = 32, className = '' }: LeafLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="10" fill="url(#leafGradient)" />
      <defs>
        <linearGradient id="leafGradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
      </defs>
      {/* Leaf shape */}
      <path
        d="M20 8C20 8 10 14 10 22C10 27.5 14.5 32 20 32C25.5 32 30 27.5 30 22C30 14 20 8 20 8Z"
        fill="white"
        fillOpacity="0.9"
      />
      {/* Leaf vein */}
      <path
        d="M20 12V28"
        stroke="url(#leafGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M20 18L16 14M20 22L16 19M20 22L24 19M20 18L24 14"
        stroke="url(#leafGradient)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.7"
      />
    </svg>
  );
}

export function LeafLogotype({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <LeafIcon size={36} />
      <div>
        <span className={`text-xl font-bold tracking-tight ${dark ? 'text-white' : 'text-slate-800'}`}>
          LEAF
        </span>
        <p className={`text-[9px] leading-tight font-medium ${dark ? 'text-green-300' : 'text-slate-500'}`}>
          Liver Evaluation and Assessment for Fibrosis
        </p>
      </div>
    </div>
  );
}
