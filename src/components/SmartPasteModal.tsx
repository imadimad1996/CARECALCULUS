import React, { useState, useEffect } from 'react';
import { Sparkles, ClipboardPaste, Check, X, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { parseLabText, saveParsedLabs, getParsedLabs, clearParsedLabs, ParsedLabPanel } from '../utils/labParser';
import { LangCode } from '../types';

interface SmartPasteModalProps {
  lang?: LangCode;
}

const SAMPLE_EPIC_REPORT = `CHEMISTRY PANEL (07/07/2026 08:30)
SODIUM        131 mEq/L  (135-145) [L]
POTASSIUM     4.2 mEq/L  (3.5-5.0)
CREATININE    1.8 mg/dL  (0.6-1.2) [H]
TOTAL BILI    2.9 mg/dL  (0.2-1.2) [H]
ALBUMIN       3.1 g/dL   (3.5-5.2) [L]
GLUCOSE       142 mg/dL  (70-99)   [H]
BUN           28 mg/dL   (7-20)    [H]

COAGULATION
INR           1.6        (0.8-1.2) [H]
`;

export default function SmartPasteModal({ lang = 'en' }: SmartPasteModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rawText, setRawText] = useState('');
  const [parsed, setParsed] = useState<ParsedLabPanel>({});
  const [isSaved, setIsSaved] = useState(false);
  const [activeLabs, setActiveLabs] = useState<ParsedLabPanel | null>(null);

  const isRtl = lang === 'ar';

  useEffect(() => {
    setActiveLabs(getParsedLabs());
    const handleUpdate = (e: any) => {
      setActiveLabs(e.detail);
    };
    window.addEventListener('carecalculus:labs-updated', handleUpdate);
    return () => window.removeEventListener('carecalculus:labs-updated', handleUpdate);
  }, []);

  useEffect(() => {
    if (rawText.trim()) {
      const result = parseLabText(rawText);
      setParsed(result);
      setIsSaved(false);
    } else {
      setParsed({});
    }
  }, [rawText]);

  const handleApply = () => {
    if (Object.keys(parsed).length > 0) {
      saveParsedLabs(parsed);
      setIsSaved(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 1200);
    }
  };

  const handleLoadSample = () => {
    setRawText(SAMPLE_EPIC_REPORT);
  };

  const handleClear = () => {
    clearParsedLabs();
    setRawText('');
    setParsed({});
  };

  const biomarkerCount = Object.keys(parsed).filter(k => k !== 'timestamp').length;
  const activeCount = activeLabs ? Object.keys(activeLabs).filter(k => k !== 'timestamp').length : 0;

  const titles = {
    en: {
      btn: "Smart Paste Labs",
      modalTitle: "Universal EHR Lab Parser",
      subtitle: "Paste raw text from EPIC, Cerner, Meditech, or any blood test report to auto-fill all calculators instantly.",
      placeholder: "Paste lab report text here...\nExample:\nSODIUM 132, POTASSIUM 4.1, CREATININE 1.8, TOTAL BILI 2.9, INR 1.6...",
      sampleBtn: "Load Sample EPIC Panel",
      extracted: "Extracted Biomarkers",
      noLabs: "No biomarkers detected yet. Try pasting a standard lab report.",
      applyBtn: "Apply to All Calculators",
      applied: "Labs Synced! Auto-filling...",
      clearBtn: "Clear Synced Labs",
      activeNotice: `${activeCount} lab biomarker(s) currently synced across CareCalculus.`,
    },
    fr: {
      btn: "Import Intelligent Labs",
      modalTitle: "Analyseur Universel de Bilan Sanguin (EHR)",
      subtitle: "Collez le texte de votre dossier médical ou bilan sanguin pour préremplir automatiquement tous les calculateurs.",
      placeholder: "Collez le résultat du laboratoire ici...\nExemple :\nSODIUM 132, POTASSIUM 4.1, CREATININE 1.8, BILIRUBINE 2.9, INR 1.6...",
      sampleBtn: "Charger un exemple (EPIC)",
      extracted: "Biomarqueurs Détectés",
      noLabs: "Aucun biomarqueur détecté. Collez un rapport de laboratoire standard.",
      applyBtn: "Appliquer à tous les calculateurs",
      applied: "Données synchronisées !",
      clearBtn: "Effacer les données synchronisées",
      activeNotice: `${activeCount} biomarqueur(s) actuellement synchronisé(s).`,
    },
    ar: {
      btn: "الاستيراد الذكي للتحاليل",
      modalTitle: "المحلل الشامل للتحاليل الطبية (EHR)",
      subtitle: "انسخ وألصق نص التحاليل من النظام الطبي لملء جميع الحاسبات تلقائياً في ثوانٍ.",
      placeholder: "ألصق نص تقرير التحاليل هنا...\nمثال:\nSODIUM 132, POTASSIUM 4.1, CREATININE 1.8, BILIRUBIN 2.9, INR 1.6...",
      sampleBtn: "تحميل نموذج تحليل تجريبي",
      extracted: "المؤشرات الحيوية المستخرجة",
      noLabs: "لم يتم اكتشاف مؤشرات بعد. جرب لصق نص تقرير معملي.",
      applyBtn: "تطبيق على جميع الحاسبات",
      applied: "تمت المزامنة بنجاح!",
      clearBtn: "مسح التحاليل المتزامنة",
      activeNotice: `يوجد حالياً ${activeCount} مؤشر(ات) متزامنة في تطبيق CareCalculus.`,
    }
  };

  const t = titles[lang] || titles.en;

  return (
    <>
      {/* Trigger Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 hover:from-emerald-500/20 hover:to-cyan-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm hover:shadow-md transition-all duration-200"
          title="Auto-populate calculators from EHR lab reports"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span>{t.btn}</span>
          {activeCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>

        {activeCount > 0 && (
          <button
            onClick={handleClear}
            className="text-[11px] text-gray-400 hover:text-red-500 underline transition-colors"
            title="Clear synced labs"
          >
            {isRtl ? 'مسح' : 'Clear'}
          </button>
        )}
      </div>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <ClipboardPaste className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {t.modalTitle}
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-300 dark:border-emerald-800">
                      AI Parser v1.0
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              
              {/* Active Notice */}
              {activeCount > 0 && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 text-xs">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    {t.activeNotice}
                  </span>
                  <button
                    onClick={handleClear}
                    className="font-semibold underline hover:text-red-500 shrink-0"
                  >
                    {t.clearBtn}
                  </button>
                </div>
              )}

              {/* Text Area Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-gray-400" />
                    <span>Raw Lab Report Text</span>
                  </label>
                  <button
                    onClick={handleLoadSample}
                    className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    {t.sampleBtn}
                  </button>
                </div>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder={t.placeholder}
                  rows={6}
                  className="w-full p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-xs font-mono placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-y"
                />
              </div>

              {/* Extracted Biomarkers Preview */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center justify-between">
                  <span>{t.extracted}</span>
                  {biomarkerCount > 0 && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold lowercase">
                      ({biomarkerCount} values ready)
                    </span>
                  )}
                </h4>

                {biomarkerCount > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {parsed.sodium !== undefined && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col">
                        <span className="text-[10px] font-semibold uppercase text-gray-500 dark:text-gray-400">Sodium (Na)</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{parsed.sodium} <span className="text-[10px] font-normal text-gray-500">mEq/L</span></span>
                      </div>
                    )}
                    {parsed.potassium !== undefined && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col">
                        <span className="text-[10px] font-semibold uppercase text-gray-500 dark:text-gray-400">Potassium (K)</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{parsed.potassium} <span className="text-[10px] font-normal text-gray-500">mEq/L</span></span>
                      </div>
                    )}
                    {parsed.creatinine !== undefined && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col">
                        <span className="text-[10px] font-semibold uppercase text-gray-500 dark:text-gray-400">Creatinine (Cr)</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{parsed.creatinine} <span className="text-[10px] font-normal text-gray-500">mg/dL</span></span>
                      </div>
                    )}
                    {parsed.bilirubin !== undefined && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col">
                        <span className="text-[10px] font-semibold uppercase text-gray-500 dark:text-gray-400">Total Bili</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{parsed.bilirubin} <span className="text-[10px] font-normal text-gray-500">mg/dL</span></span>
                      </div>
                    )}
                    {parsed.inr !== undefined && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col">
                        <span className="text-[10px] font-semibold uppercase text-gray-500 dark:text-gray-400">INR</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{parsed.inr}</span>
                      </div>
                    )}
                    {parsed.albumin !== undefined && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col">
                        <span className="text-[10px] font-semibold uppercase text-gray-500 dark:text-gray-400">Albumin</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{parsed.albumin} <span className="text-[10px] font-normal text-gray-500">g/dL</span></span>
                      </div>
                    )}
                    {parsed.glucose !== undefined && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col">
                        <span className="text-[10px] font-semibold uppercase text-gray-500 dark:text-gray-400">Glucose</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{parsed.glucose} <span className="text-[10px] font-normal text-gray-500">mg/dL</span></span>
                      </div>
                    )}
                    {parsed.wbc !== undefined && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col">
                        <span className="text-[10px] font-semibold uppercase text-gray-500 dark:text-gray-400">WBC</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{parsed.wbc} <span className="text-[10px] font-normal text-gray-500">x10³/µL</span></span>
                      </div>
                    )}
                    {parsed.platelets !== undefined && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col">
                        <span className="text-[10px] font-semibold uppercase text-gray-500 dark:text-gray-400">Platelets</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{parsed.platelets} <span className="text-[10px] font-normal text-gray-500">x10³/µL</span></span>
                      </div>
                    )}
                    {parsed.bun !== undefined && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col">
                        <span className="text-[10px] font-semibold uppercase text-gray-500 dark:text-gray-400">BUN</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{parsed.bun} <span className="text-[10px] font-normal text-gray-500">mg/dL</span></span>
                      </div>
                    )}
                    {parsed.hemoglobin !== undefined && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col">
                        <span className="text-[10px] font-semibold uppercase text-gray-500 dark:text-gray-400">Hemoglobin</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{parsed.hemoglobin} <span className="text-[10px] font-normal text-gray-500">g/dL</span></span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 text-center text-gray-400 dark:text-gray-500 text-xs flex flex-col items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                    <span>{t.noLabs}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/80">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                {isRtl ? 'إغلاق' : 'Close'}
              </button>
              
              <button
                onClick={handleApply}
                disabled={biomarkerCount === 0}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-2 transition-all ${
                  biomarkerCount > 0
                    ? isSaved
                      ? 'bg-emerald-600 scale-95 shadow-emerald-500/25'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20 hover:shadow-lg hover:scale-[1.02]'
                    : 'bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4 animate-bounce" />
                    <span>{t.applied}</span>
                  </>
                ) : (
                  <>
                    <span>{t.applyBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
