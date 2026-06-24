import React from 'react';
import { Copy, Check } from 'lucide-react';

interface MobileResultDockProps {
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
    emerald: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    red: 'bg-red-500/10 text-red-700 border-red-200',
    blue: 'bg-blue-500/10 text-blue-700 border-blue-200',
    yellow: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-8px_16px_-6px_rgba(0,0,0,0.1)] p-4 pb-6 lg:hidden animate-in slide-in-from-bottom-full duration-300">
      <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
        <div className="flex-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">{label}</div>
          <div className="flex items-baseline gap-1.5 tabular-nums">
            <span className="text-3xl font-black tracking-tighter text-gray-900">{value}</span>
            {unit && <span className="text-sm font-medium text-gray-500">{unit}</span>}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2 shrink-0">
           {status && (
             <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${colorMap[statusColor]}`}>
               {status}
             </div>
           )}
           <button
             onClick={onCopy}
             className="flex items-center justify-center p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors border border-gray-200 active:scale-95"
             aria-label="Copy result"
           >
             {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
           </button>
        </div>
      </div>
    </div>
  );
}
