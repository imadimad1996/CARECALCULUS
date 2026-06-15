import React from 'react';

interface CalculatorInputProps {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  placeholder?: string;
  onChange: (value: number) => void;
  step?: number;
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
}: CalculatorInputProps) {
  return (
    <div className="group">
      <div className="flex justify-between items-baseline mb-2">
        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          {label}
        </label>
        <span className="text-xs font-medium text-gray-400 tabular-nums">
          {unit}
        </span>
      </div>
      <div className="relative flex items-center">
        <input
          type="number"
          value={value === 0 ? '' : value}
          onChange={(e) => {
            const v = Number(e.target.value);
            onChange(v);
          }}
          className="w-full bg-gray-50/50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-3xl tabular-nums font-semibold text-gray-900 transition-all placeholder:text-gray-300"
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full mt-4 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
      />
    </div>
  );
}
