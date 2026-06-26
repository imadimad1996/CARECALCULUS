import React, { ReactNode } from 'react';

export interface StatTileProps {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  status?: 'normal' | 'caution' | 'danger' | 'neutral';
  trend?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export const StatTile: React.FC<StatTileProps> = ({
  label,
  value,
  unit,
  status = 'neutral',
  trend,
  icon,
  className = ''
}) => {
  const statusColors = {
    normal: 'border-emerald-200 bg-emerald-50/40 text-emerald-900',
    caution: 'border-amber-200 bg-amber-50/40 text-amber-900',
    danger: 'border-red-200 bg-red-50/40 text-red-900',
    neutral: 'border-slate-200 bg-white text-slate-900'
  };

  const badgeColors = {
    normal: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    caution: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  return (
    <div
      className={`rounded-xl border p-5 transition-all duration-200 hover:shadow-sm ${statusColors[status]} ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">
          {label}
        </span>
        {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1.5 flex-wrap my-1">
        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums font-mono">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-semibold text-slate-500 shrink-0">
            {unit}
          </span>
        )}
      </div>
      {(trend || status !== 'neutral') && (
        <div className="mt-2.5 flex items-center gap-2 pt-2 border-t border-slate-100/80 text-xs">
          {status !== 'neutral' && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border capitalize ${badgeColors[status]}`}
            >
              {status}
            </span>
          )}
          {trend && <span className="text-slate-600 truncate">{trend}</span>}
        </div>
      )}
    </div>
  );
};

export default StatTile;
