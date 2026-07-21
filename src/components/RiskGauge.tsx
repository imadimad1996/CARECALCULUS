import React from 'react';

export interface RiskGaugeProps {
  percentage: number; // 0 to 100
  label?: string;
  riskLevel?: 'low' | 'moderate' | 'high';
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ percentage, label, riskLevel = 'low' }) => {
  const validPercentage = Math.min(100, Math.max(0, percentage));
  // Needle angle from -90 deg (0%) to 90 deg (100%)
  const angle = -90 + (validPercentage / 100) * 180;

  const getColor = () => {
    if (riskLevel === 'high' || validPercentage >= 50) return '#ef4444'; // red-500
    if (riskLevel === 'moderate' || validPercentage >= 20) return '#f59e0b'; // amber-500
    return '#10b981'; // emerald-500
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-2xl border border-white/10 backdrop-blur-md">
      <div className="relative w-48 h-24 overflow-hidden flex items-end justify-center">
        {/* SVG Arc background */}
        <svg className="w-48 h-48 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="10"
            strokeDasharray="125.6 251.2"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke={getColor()}
            strokeWidth="10"
            strokeDasharray={`${(validPercentage / 100) * 125.6} 251.2`}
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Needle */}
        <div
          className="absolute bottom-0 w-1.5 h-16 bg-white origin-bottom rounded-full shadow-lg transition-transform duration-700 ease-out"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <div className="w-3 h-3 bg-cyan-400 rounded-full -ml-0.75 -mt-1 shadow-md animate-pulse" />
        </div>
      </div>

      <div className="mt-3 text-center">
        <span className="text-2xl font-black font-mono text-white tracking-tight">
          {validPercentage}%
        </span>
        {label && (
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
            {label}
          </p>
        )}
      </div>
    </div>
  );
};
