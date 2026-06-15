import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';
import ClinicalExportButton from '../components/ClinicalExportButton';

const translations: Translations = {
  en: {
    title: "Tidal Volume Calculator (ARDSNet)",
    subtitle: "Ideal Body Weight and ARDSNet Target Tidal Volume",
    height: "Height (cm)",
    sex: "Sex",
    male: "Male",
    female: "Female",
    result: "Predicted Body Weight",
    target: "Target Tidal Volume (6 mL/kg)",
    formula: "PBW = 50 + 0.91 × (Height - 152.4) [Males]",
    clinicalTitle: "ARDSNet Protocol",
    clinicalText: "The ARDSNet protocol recommends a target tidal volume of 6 mL/kg of predicted body weight (PBW) to prevent ventilator-induced lung injury. Max plateau pressure < 30 cmH2O.",
    references: "References: ARDSNet. Ventilation with lower tidal volumes as compared with traditional tidal volumes for acute lung injury and the acute respiratory distress syndrome.",
  },
  fr: {
    title: "Volume Courant (ARDSNet)",
    subtitle: "Poids Idéal et Volume Courant Cible",
    height: "Taille (cm)",
    sex: "Sexe",
    male: "Homme",
    female: "Femme",
    result: "Poids Prédit (PBW)",
    target: "Volume Courant Cible (6 mL/kg)",
    formula: "PBW = 50 + 0.91 × (Taille - 152.4) [Hommes]",
    clinicalTitle: "Protocole ARDSNet",
    clinicalText: "Le protocole recommande un volume courant de 6 mL/kg du poids corporel prédit (PBW) avec une pression de plateau < 30 cmH2O pour le SDRA.",
    references: "Références: The Acute Respiratory Distress Syndrome Network.",
  },
  ar: {
    title: "حجم المد والجزر (ARDSNet)",
    subtitle: "وزن الجسم المثالي وحجم المد والجزر المستهدف",
    height: "الطول (سم)",
    sex: "الجنس",
    male: "ذكر",
    female: "أنثى",
    result: "وزن الجسم المتوقع",
    target: "حجم المد والجزر المستهدف (6 مل/كغ)",
    formula: "الوزن = 50 + 0.91 × (الطول - 152.4) [للذكور]",
    clinicalTitle: "بروتوكول ARDSNet",
    clinicalText: "يوصي البروتوكول باستهداف 6 مل لكل كيلوغرام من وزن الجسم المتوقع لمنع إصابة الرئة المرتبطة بجهاز التنفس في متلازمة الضائقة التنفسية (الضغط < 30).",
    references: "المراجع: شبكة ARDS.",
  }
};

export default function TidalVolume({ lang }: { lang: LangCode }) {
  const [height, setHeight] = useState<number | ''>(170);
  const [sex, setSex] = useState<number>(0); // 0: male, 1: female

  const currentText = translations[lang];
  const isRtl = lang === 'ar';

  const pbw = useMemo(() => {
    if (height === '' || height <= 0) return null;
    const h = Number(height);
    if (sex === 0) {
      return 50.0 + 0.91 * (h - 152.4);
    } else {
      return 45.5 + 0.91 * (h - 152.4);
    }
  }, [height, sex]);

  useEffect(() => {
    if (pbw !== null && pbw > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('tidal-volume', lang, pbw);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [pbw, lang]);

  return (
    <>
      <div className="max-w-3xl mb-12">
        <h1 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3 ${isRtl ? 'leading-normal' : ''}`}>
          {currentText.title}
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-gray-950/5 p-6 md:p-8 space-y-6">
            
            <div className="space-y-4">
               <div>
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.sex}</label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setSex(0)}
                      className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${sex === 0 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}
                    >
                      {currentText.male}
                    </button>
                    <button
                      onClick={() => setSex(1)}
                      className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${sex === 1 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}
                    >
                      {currentText.female}
                    </button>
                  </div>
                </div>

              <div className="group pt-4">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.height}</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-2xl font-semibold text-gray-900"
                />
              </div>
            </div>

          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky top-28 bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 flex flex-col justify-between p-8 min-h-[320px]">
            <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                {currentText.result}
              </span>
              
              <div className="flex items-baseline gap-2 tabular-nums mb-6">
                <span className="text-6xl font-bold tracking-tighter transition-all duration-300">
                  {pbw !== null ? pbw.toFixed(1) : '--'}
                </span>
                <span className="text-lg font-medium text-gray-400">kg</span>
              </div>
              
              {pbw !== null && (
                 <>
                   <div className="pt-6 border-t border-white/10">
                     <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-2">
                       {currentText.target}
                     </span>
                     <div className="text-4xl font-bold text-white tracking-tight">
                       {Math.round(pbw * 6)} <span className="text-lg font-normal text-gray-400">mL</span>
                     </div>
                     <div className="text-sm text-gray-400 mt-2">
                       Range (4-8 mL/kg): {Math.round(pbw * 4)} - {Math.round(pbw * 8)} mL
                     </div>
                   </div>

                   <ClinicalExportButton
                     title={currentText.title}
                     inputs={[
                       { label: currentText.sex, value: sex === 0 ? currentText.male : currentText.female },
                       { label: currentText.height, value: `${height} cm` }
                     ]}
                     results={[
                       { label: currentText.result, value: pbw.toFixed(1), unit: 'kg (PBW)' },
                       { label: currentText.target, value: `${Math.round(pbw * 6)} mL` },
                       { label: 'Ventilation Range (4-8 mL/kg)', value: `${Math.round(pbw * 4)} - ${Math.round(pbw * 8)} mL` }
                     ]}
                     formula={currentText.formula}
                     disclaimer={currentText.clinicalText}
                     references={currentText.references}
                     lang={lang}
                   />
                 </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-10 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-8 text-xs text-gray-400">
          <span className="font-semibold text-gray-500">{layoutTranslations[lang].reviewedBy}</span>
          <span>&middot;</span>
          <span>{layoutTranslations[lang].specialists}</span>
          <span>&middot;</span>
          <span>{layoutTranslations[lang].updated}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{currentText.clinicalTitle}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{currentText.clinicalText}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div className="w-full">
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{layoutTranslations[lang].mathMetric}</h2>
              <div className="font-mono text-xs bg-gray-100 text-gray-700 py-2 px-3 rounded-md border border-gray-200 uppercase tracking-tight" dir="ltr">
                {currentText.formula}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{layoutTranslations[lang].evidenceLit}</h2>
              <p className="text-gray-500 text-xs leading-relaxed italic">{currentText.references}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
