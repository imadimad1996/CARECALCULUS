import React, { useId } from 'react';

export interface CalculatorInputProps {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  placeholder?: string;
  onChange: (value: number) => void;
  step?: number;
  helper?: string;
  error?: string;
}

export default function CalculatorInput({
  label,
  unit,
  value,
  min,
  max,
  placeholder,
  onChange,
  step = 1,
  helper,
  error,
}: CalculatorInputProps) {
  const inputId = useId();

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      onChange(0);
      return;
    }
    const val = Number(raw);
    if (!isNaN(val)) {
      onChange(val);
    }
  };

  return (
    <div className="group w-full">
      <div className="flex justify-between items-baseline mb-2 gap-2">
        <label
          htmlFor={inputId}
          className="text-sm font-bold text-slate-800 tracking-tight cursor-pointer"
        >
          {label}
        </label>
        {unit && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 tabular-nums uppercase border border-slate-200">
            {unit}
          </span>
        )}
      </div>

      <div className="relative flex items-center">
        <input
          id={inputId}
          type="number"
          value={value === 0 ? '' : value}
          onChange={handleTextChange}
          className={`w-full bg-slate-50 px-4 py-3.5 border rounded-xl focus:outline-none focus:bg-white focus:ring-3 focus:ring-[#0891B2]/20 text-2xl sm:text-3xl tabular-nums font-bold text-slate-900 transition-all placeholder:text-slate-300 ${
            error
              ? 'border-red-400 focus:border-red-500'
              : 'border-slate-200 focus:border-[#0891B2]'
          }`}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
        />
      </div>

      <div className="mt-3.5 flex items-center gap-3">
        <span className="text-[11px] font-mono font-medium text-slate-400 tabular-nums">
          {min}
        </span>
        <input
          type="range"
          aria-label={`${label} range slider`}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0891B2] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/40"
        />
        <span className="text-[11px] font-mono font-medium text-slate-400 tabular-nums">
          {max}
        </span>
      </div>

      {(helper || error) && (
        <p
          className={`text-xs mt-2 ${
            error ? 'text-red-600 font-medium' : 'text-slate-500'
          }`}
        >
          {error || helper}
        </p>
      )}
    </div>
  );
}
