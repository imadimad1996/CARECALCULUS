import React from 'react';
import { Copy, Check } from 'lucide-react';

export interface MobileResultDockProps {
  value: string | number;
  unit: string;
  label: string;
  status?: string;
  statusColor?: 'emerald' | 'red' | 'blue' | 'yellow';
  copied: boolean;
  onCopy: () => void;
  isVisible: boolean;
}

export default function MobileResultDock({
  value,
  unit,
  label,
  status,
  statusColor = 'blue',
  copied,
  onCopy,
  isVisible
}: MobileResultDockProps) {
  if (!isVisible) return null;

  const colorMap = {
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    red: 'bg-red-50 text-red-800 border-red-200',
    blue: 'bg-[#0891B2]/10 text-[#0891B2] border-[#0891B2]/20',
    yellow: 'bg-amber-50 text-amber-800 border-amber-200',
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.12)] p-4 pb-6 lg:hidden transition-all duration-300">
      <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate mb-0.5">
            {label}
          </div>
          <div className="flex items-baseline gap-1.5 tabular-nums flex-wrap">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 font-mono">
              {value}
            </span>
            {unit && (
              <span className="text-sm font-bold text-slate-500 shrink-0">
                {unit}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          {status && (
            <div
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${colorMap[statusColor]}`}
            >
              {status}
            </div>
          )}
          <button
            onClick={onCopy}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl transition-all border border-slate-200 active:scale-95 cursor-pointer"
            aria-label="Copy clinical result"
          >
            {copied ? (
              <Check className="w-5 h-5 text-emerald-600" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
