import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';
import ClinicalExportButton from '../components/ClinicalExportButton';

const translations: Translations = {
  en: {
    title: "Drip Rate Calculator",
    subtitle: "Calculate IV drip rate based on total volume, time, and drop factor",
    volume: "Total Volume (mL)",
    time: "Time (minutes)",
    dropFactor: "Drop Factor (gtt/mL)",
    result: "Calculated Drip Rate",
    formula: "Rate (gtt/min) = (Volume (mL) × Drop Factor (gtt/mL)) / Time (minutes)",
    clinicalTitle: "Nursing Interventions",
    clinicalText: "Ensure the correct drop factor for the specific IV tubing (microdrip: 60 gtt/mL, macrodrip: 10, 15, or 20 gtt/mL) to avoid medication errors.",
    references: "References: Standard Nursing IV Administration Guidelines.",
  },
  fr: {
    title: "Calculateur de Goutte à Goutte",
    subtitle: "Calculez le débit de perfusion IV (gouttes par minute)",
    volume: "Volume Total (mL)",
    time: "Temps (minutes)",
    dropFactor: "Facteur de Goutte (gtt/mL)",
    result: "Débit Calculé",
    formula: "Débit (gtt/min) = (Volume (mL) × Facteur (gtt/mL)) / Temps (minutes)",
    clinicalTitle: "Interventions Infirmières",
    clinicalText: "Vérifiez le facteur d'égouttement de la tubulure (micro: 60 gtt/mL, macro: 10, 15 ou 20 gtt/mL) pour éviter les erreurs de dosage.",
    references: "Références : Directives standards d'administration IV.",
  },
};

export default function DripRate({ lang }: { lang: LangCode }) {
  const [volume, setVolume] = useState<number | ''>('');
  const [time, setTime] = useState<number | ''>('');
  const [dropFactor, setDropFactor] = useState<number | ''>('');

  const currentText = translations[lang];
  const isRtl = false;

  const rateValue = useMemo(() => {
    if (volume === '' || time === '' || dropFactor === '') return 0;
    if (volume <= 0 || time <= 0 || dropFactor <= 0) return 0;
    const computed = (volume * dropFactor) / time;
    return parseFloat(computed.toFixed(1));
  }, [volume, time, dropFactor]);

  useEffect(() => {
    if (rateValue > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('drip-rate-calculator', lang, rateValue);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [rateValue, lang]);

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
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{currentText.volume}</label>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={volume}
                    onChange={(e) => {
                      if (e.target.value === '') {
                        setVolume('');
                      } else {
                        let val = Number(e.target.value);
                        if (val > 5000) val = 5000;
                        if (val < 0) val = 0;
                        setVolume(val);
                      }
                    }}
                    className="w-full bg-gray-50/50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-3xl tabular-nums font-semibold text-gray-900 transition-all placeholder:text-gray-300"
                    min="1"
                    max="5000"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-baseline mb-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{currentText.time}</label>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={time}
                    onChange={(e) => {
                      if (e.target.value === '') {
                        setTime('');
                      } else {
                        let val = Number(e.target.value);
                        if (val > 1440) val = 1440;
                        if (val < 0) val = 0;
                        setTime(val);
                      }
                    }}
                    className="w-full bg-gray-50/50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-3xl tabular-nums font-semibold text-gray-900 transition-all placeholder:text-gray-300"
                    min="1"
                    max="1440" // up to 24 hr
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="group">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-3">{currentText.dropFactor}</label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {[10, 15, 20, 60].map((val) => (
                    <button
                      key={`gtt-${val}`}
                      onClick={() => setDropFactor(val)}
                      className={`py-3 rounded-xl border text-lg font-semibold tabular-nums transition-all ${dropFactor === val ? 'bg-blue-50 border-blue-600 text-blue-800' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'}`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
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
                <span className="text-7xl font-bold tracking-tighter transition-all duration-300">
                  {rateValue > 0 ? rateValue : '--'}
                </span>
                <span className="text-xl font-medium text-gray-400">gtt/min</span>
              </div>
            </div>
            
             <div className="relative z-10 mt-10">
              <div className={`p-4 rounded-xl border flex justify-between items-center transition-all ${rateValue > 0 ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-gray-800/50 border-gray-700 text-gray-400'}`}>
                <div className="font-semibold text-sm">
                  {rateValue > 0 && typeof volume === 'number' && typeof time === 'number' ? `${(volume / (time/60)).toFixed(1)} mL/hr` : (lang === 'fr' ? 'Saisissez les valeurs' : 'Awaiting inputs')}
                </div>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: currentText.volume, value: volume ? `${volume} mL` : '--' },
                  { label: currentText.time, value: time ? `${time} minutes` : '--' },
                  { label: currentText.dropFactor, value: dropFactor ? `${dropFactor} gtt/mL` : '--' }
                ]}
                results={[
                  { label: currentText.result, value: rateValue > 0 ? rateValue : '--', unit: 'gtt/min' },
                  { label: 'Flow Rate (mL/hr)', value: volume && time ? `${(Number(volume) / (Number(time)/60)).toFixed(1)} mL/hr` : '--' }
                ]}
                formula={currentText.formula}
                disclaimer={currentText.clinicalText}
                references={currentText.references}
                lang={lang}
              />
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
