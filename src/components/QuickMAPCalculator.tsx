import React, { useState } from 'react';
import { Activity, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function QuickMAPCalculator() {
  const [sbp, setSbp] = useState<number | ''>(120);
  const [dbp, setDbp] = useState<number | ''>(80);

  const map = (typeof sbp === 'number' && typeof dbp === 'number') 
    ? Math.round((sbp + 2 * dbp) / 3) 
    : null;

  const isLow = map !== null && map < 65;
  const isHigh = map !== null && map > 100;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 w-full max-w-sm mx-auto relative overflow-hidden group hover:shadow-teal-500/10 transition-all duration-500">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Activity className="w-24 h-24 text-teal-600" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-teal-100 text-teal-700 rounded-lg">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900">Quick MAP Calc</h3>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">SBP</label>
              <input 
                type="number" 
                value={sbp} 
                onChange={(e) => setSbp(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-mono font-bold focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                placeholder="120"
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">DBP</label>
              <input 
                type="number" 
                value={dbp} 
                onChange={(e) => setDbp(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-mono font-bold focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                placeholder="80"
              />
            </div>
          </div>

          <div className={`p-4 rounded-2xl flex items-center justify-between transition-colors ${
            map === null ? 'bg-slate-100 text-slate-400' :
            isLow ? 'bg-red-50 text-red-700 border border-red-100' : 
            isHigh ? 'bg-orange-50 text-orange-700 border border-orange-100' : 
            'bg-teal-50 text-teal-700 border border-teal-100'
          }`}>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider opacity-80">MAP Result</div>
              <div className="text-3xl font-black font-mono tracking-tighter">
                {map !== null ? map : '--'} <span className="text-sm font-semibold opacity-70">mmHg</span>
              </div>
            </div>
            {isLow && <div className="text-xs font-bold bg-red-200/50 px-2 py-1 rounded text-red-800">LOW (&lt;65)</div>}
          </div>

          <Link to="/map-calculator" className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors text-sm">
            Full Clinical Tool <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
