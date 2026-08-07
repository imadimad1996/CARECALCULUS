import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ClipboardList, Trash2, Copy, Check, X, Clock, UserCheck, Sparkles, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const isPro = localStorage.getItem('carecalculus_pro_status') === 'active';
  const MAX_FREE_PATIENTS = 3;

  if (!isPro && existing.length >= MAX_FREE_PATIENTS) {
    // Cannot save if free limit reached
    const event = new CustomEvent('carecalculus:open-shift-drawer-limit');
    window.dispatchEvent(event);
    return;
  }

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

  const isPro = localStorage.getItem('carecalculus_pro_status') === 'active';
  const MAX_FREE_PATIENTS = 3;

  useEffect(() => {
    if (isOpen) {
      setRecords(getShiftRecords());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleLimitEvent = () => {
      // Force open the drawer to show the limit paywall
      if (!isOpen && typeof onClose === 'function') {
         // It's up to the parent to manage isOpen, but we can't force it open easily from here without changing props.
         // At least the user sees it next time they open.
      }
    };
    window.addEventListener('carecalculus:open-shift-drawer-limit', handleLimitEvent);
    return () => window.removeEventListener('carecalculus:open-shift-drawer-limit', handleLimitEvent);
  }, [isOpen, onClose]);

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

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex justify-end bg-slate-950/70 backdrop-blur-md transition-all"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 text-white h-full flex flex-col shadow-2xl p-6 overflow-hidden animate-in slide-in-from-right"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-3 min-h-[44px] min-w-[44px] bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Shift Patient Queue</h3>
              <p className="text-xs text-slate-400">
                Local Shift Logs ({records.length}{!isPro ? ` / ${MAX_FREE_PATIENTS}` : ''})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 min-h-[44px] min-w-[44px] text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer">
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
            records.map((r, i) => (
              <div key={r.id} className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-400">
                    Patient #{i + 1} ({r.patientId || 'Unassigned'})
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" /> {r.timestamp}
                  </span>
                </div>
                <div className="text-xs text-slate-200">
                  <span className="font-semibold">{r.calculatorName}:</span> {r.score}
                  {r.riskLevel && (
                    <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      {r.riskLevel}
                    </span>
                  )}
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleCopySingle(r.id, r.formattedNote)}
                    className="text-[11px] text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === r.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === r.id ? 'Copied Note' : 'Copy Note'}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {(!isPro && records.length >= MAX_FREE_PATIENTS) && (
          <div className="p-4 mb-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Lock className="w-24 h-24" />
            </div>
            <h4 className="text-sm font-black text-cyan-400 mb-1 flex items-center justify-center gap-1.5">
              <Lock className="w-4 h-4" /> Limit Reached
            </h4>
            <p className="text-xs text-slate-300 mb-3 px-2">
              Free users are limited to {MAX_FREE_PATIENTS} patients per shift. Upgrade to Pro for unlimited offline storage.
            </p>
            <Link
              to="/pricing"
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Upgrade to Pro
            </Link>
          </div>
        )}

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
    </div>,
    document.body
  );
};
