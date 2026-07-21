import React, { useState, useEffect } from 'react';
import { ClipboardList, Trash2, Copy, Check, X, Clock, UserCheck } from 'lucide-react';

export interface ShiftRecord {
  id: string;
  patientId: string;
  calculatorName: string;
  score: string | number;
  riskLevel: string;
  timestamp: string;
  formattedNote: string;
}

const STORAGE_KEY = 'carecalculus_shift_queue';

export function getShiftRecords(): ShiftRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveShiftRecord(record: Omit<ShiftRecord, 'id' | 'timestamp'>) {
  const existing = getShiftRecords();
  const newRec: ShiftRecord = {
    ...record,
    id: 'rec_' + Date.now(),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  const updated = [newRec, ...existing];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save shift record', e);
  }
}

export const ShiftStorageDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [records, setRecords] = useState<ShiftRecord[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setRecords(getShiftRecords());
    }
  }, [isOpen]);

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRecords([]);
  };

  const handleCopySingle = (id: string, note: string) => {
    navigator.clipboard.writeText(note);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyBatch = () => {
    const batchText = records.map((r, i) => `--- PATIENT CASE #${i + 1} (${r.patientId || 'Unassigned'}) ---\nTime: ${r.timestamp}\nTool: ${r.calculatorName}\nScore: ${r.score} (${r.riskLevel})\n${r.formattedNote}\n`).join('\n');
    navigator.clipboard.writeText(batchText);
    setCopiedId('batch');
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm transition-all">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 text-white h-full flex flex-col shadow-2xl p-6 overflow-hidden animate-in slide-in-from-right">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Shift Patient Queue</h3>
              <p className="text-xs text-slate-400">Local Shift Logs ({records.length})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {records.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-semibold">No patient records saved this shift.</p>
              <p className="text-xs mt-1 text-slate-600">Calculations exported using the Export button automatically log here.</p>
            </div>
          ) : (
            records.map((rec) => (
              <div key={rec.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {rec.patientId || 'Ref #' + rec.id.slice(-4)}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" /> {rec.timestamp}
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-bold text-sm text-slate-100">{rec.calculatorName}</span>
                  <span className="text-xs font-semibold text-slate-300">Score: {rec.score}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 mt-1">
                  <span className="text-xs text-amber-400 font-medium">{rec.riskLevel}</span>
                  <button
                    onClick={() => handleCopySingle(rec.id, rec.formattedNote)}
                    className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-semibold transition cursor-pointer"
                  >
                    {copiedId === rec.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === rec.id ? 'Copied' : 'Copy Note'}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {records.length > 0 && (
          <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
            <button
              onClick={handleCopyBatch}
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/50"
            >
              {copiedId === 'batch' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedId === 'batch' ? 'Batch Copied!' : 'Copy Shift Handover'}</span>
            </button>
            <button
              onClick={handleClear}
              className="py-2.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl transition border border-red-500/20 flex items-center justify-center cursor-pointer"
              title="Clear Shift Records"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
