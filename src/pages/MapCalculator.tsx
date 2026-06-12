import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LangCode, Translations } from '../types';
import { playDialTick, playTelemetrySuccess, playTelemetryAlert } from '../utils/audio';
import ClinicalExportButton from '../components/ClinicalExportButton';

const translations: Translations = {
  en: {
    title: "Mean Arterial Pressure (MAP)",
    subtitle: "Calculate global perfusion pressure safely across acute settings",
    systolic: "Systolic Blood Pressure",
    diastolic: "Diastolic Blood Pressure",
    result: "Calculated MAP",
    normal: "Normal Perfusion",
    normalSub: "70 - 100 mmHg",
    low: "Low Perfusion Risk",
    lowSub: "< 65 mmHg",
    formula: "MAP = SBP + (1/3) * (SBP - DBP)",
    clinicalTitle: "Clinical Interventions",
    clinicalText: "A MAP of at least 65 mmHg is critical to maintain vital organ perfusion in septic shock or acute conditions.",
    references: "References: Intensive Care Medicine Standards / American Heart Association guidelines.",
  },
  fr: {
    title: "Pression Artérielle Moyenne",
    subtitle: "Calculez la pression de perfusion globale en milieu critique",
    systolic: "Pression Artérielle Systolique",
    diastolic: "Pression Artérielle Diastolique",
    result: "PAM Calculée",
    normal: "Perfusion Normale",
    normalSub: "70 - 100 mmHg",
    low: "Risque de Perfusion Faible",
    lowSub: "< 65 mmHg",
    formula: "PAM = PAS + (1/3) * (PAS - PAD)",
    clinicalTitle: "Interventions Cliniques",
    clinicalText: "Une PAM d'au moins 65 mmHg est indispensable pour assurer la perfusion des organes cibles en cas de choc septique.",
    references: "Références : Recommandations de la SFAR / SRLF.",
  },
  ar: {
    title: "حاسبة الضغط الشرياني المتوسط",
    subtitle: "حساب ضغط تروية الأعضاء الحيوي في حالات العناية المركزة",
    systolic: "الضغط الانقباضي",
    diastolic: "الضغط الانبساطي",
    result: "الضغط الشرياني المحسوب",
    normal: "تروية طبيعية",
    normalSub: "70 - 100 مم زئبق",
    low: "مخاطر نقص التروية",
    lowSub: "< 65 مم زئبق",
    formula: "الضغط المتوسط = الانبساطي + 1/3 (الانقباضي - الانبساطي)",
    clinicalTitle: "التدخلات السريرية والتطبيق",
    clinicalText: "يعد الحفاظ على معدل ضغط شرياني لا يقل عن 65 مم زئبق أمراً بالغ الأهمية لضمان تروية الأعضاء الحيوية في حالات الصدمة الإنتانية.",
    references: "المراجع: معايير طب العناية المركزة / جمعية القلب الأمريكية.",
  }
};

export default function MapCalculator({ lang }: { lang: LangCode }) {
  const [sys, setSys] = useState<number>(120);
  const [dia, setDia] = useState<number>(80);

  const currentText = translations[lang];
  const isRtl = lang === 'ar';

  const mapValue = useMemo(() => {
    if (sys <= 0 || dia <= 0 || sys < dia) return 0;
    const computed = dia + (1 / 3) * (sys - dia);
    return parseFloat(computed.toFixed(1));
  }, [sys, dia]);

  const mapValueIsNormal = mapValue >= 65;
  useEffect(() => {
    if (mapValue === 0) return;
    if (mapValueIsNormal) {
      playTelemetrySuccess();
    } else {
      playTelemetryAlert();
    }
  }, [mapValueIsNormal]);

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
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-gray-950/5 p-6 md:p-8">
            <div className="space-y-8">
              <div className="group">
                <div className="flex justify-between items-baseline mb-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{currentText.systolic}</label>
                  <span className="text-xs font-medium text-gray-400 tabular-nums">mmHg</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={sys === 0 ? '' : sys}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setSys(v);
                      playDialTick((v - 40) / 220);
                    }}
                    className="w-full bg-gray-50/50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-3xl tabular-nums font-semibold text-gray-900 transition-all placeholder:text-gray-300"
                    min="40"
                    max="260"
                    placeholder="120"
                  />
                </div>
                <input 
                  type="range" min="40" max="260" 
                  value={sys}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setSys(v);
                    playDialTick((v - 40) / 220);
                  }}
                  className="w-full mt-4 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="group">
                <div className="flex justify-between items-baseline mb-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{currentText.diastolic}</label>
                  <span className="text-xs font-medium text-gray-400 tabular-nums">mmHg</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={dia === 0 ? '' : dia}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setDia(v);
                      playDialTick((v - 20) / 160);
                    }}
                    className="w-full bg-gray-50/50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-3xl tabular-nums font-semibold text-gray-900 transition-all placeholder:text-gray-300"
                    min="20"
                    max="180"
                    placeholder="80"
                  />
                </div>
                <input 
                  type="range" min="20" max="180" 
                  value={dia}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setDia(v);
                    playDialTick((v - 20) / 160);
                  }}
                  className="w-full mt-4 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
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
              
              <div className="flex items-baseline gap-2 tabular-nums">
                <span 
                  key={mapValue || 'empty'}
                  className="text-7xl font-bold tracking-tighter transition-all duration-300"
                >
                  {mapValue > 0 ? mapValue : '--'}
                </span>
                <span className="text-xl font-medium text-gray-400">mmHg</span>
              </div>
            </div>

            <div className="relative z-10 mt-10">
                {mapValue > 0 && (
                  <>
                    <div 
                      key={mapValue >= 65 ? 'normal' : 'low'}
                      className={`p-4 rounded-xl border flex justify-between items-center transition-all ${
                        mapValue >= 65 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}
                    >
                      <div className="font-semibold text-sm">
                        {mapValue >= 65 ? currentText.normal : currentText.low}
                      </div>
                      <div className="font-mono text-xs opacity-80">
                        {mapValue >= 65 ? currentText.normalSub : currentText.lowSub}
                      </div>
                    </div>

                    <ClinicalExportButton
                      title={currentText.title}
                      inputs={[
                        { label: currentText.systolic, value: `${sys} mmHg` },
                        { label: currentText.diastolic, value: `${dia} mmHg` }
                      ]}
                      results={[
                        { label: currentText.result, value: mapValue, unit: 'mmHg' },
                        { label: 'Perfusion Status', value: mapValue >= 65 ? currentText.normal : currentText.low }
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">{currentText.clinicalTitle}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{currentText.clinicalText}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div className="w-full">
              <h3 className="font-semibold text-gray-900 mb-2">Mathematical Metric</h3>
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
              <h3 className="font-semibold text-gray-900 mb-2">Evidence & Lit</h3>
              <p className="text-gray-500 text-xs leading-relaxed italic">{currentText.references}</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
