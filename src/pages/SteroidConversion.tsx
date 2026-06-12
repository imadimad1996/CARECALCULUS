import React, { useState, useMemo } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';

const translations: Translations = {
  en: {
    title: "Corticosteroid Equivalence",
    subtitle: "Converts between systemic corticosteroids using standard relative potencies",
    from: "From Medication",
    to: "To Medication",
    dose: "Current Dose (mg/day)",
    result: "Equivalent Dose",
    formula: "Ratio calculated relative to Hydrocortisone (20mg)",
    clinicalTitle: "Equivalent Adjustments",
    clinicalText: "Values are approximate relative potencies. Clinical equivalence may vary based on route, half-life, and inflammatory state.",
    references: "Standard pharmacological equivalencies based on anti-inflammatory potency.",
  },
  fr: {
    title: "Équivalence des Corticoïdes",
    subtitle: "Convertit entre corticoïdes systémiques selon leur puissance",
    from: "Médicament d'origine",
    to: "Cible",
    dose: "Dose actuelle (mg)",
    result: "Dose Équivalente",
    formula: "Ratio par rapport à l'Hydrocortisone (20mg)",
    clinicalTitle: "Ajustements Cliniques",
    clinicalText: "Valeurs approximatives. L'équivalence clinique peut différer selon la demi-vie biologique.",
    references: "Équivalences pharmacologiques standards.",
  },
  ar: {
    title: "تحويل الكورتيكوستيرويدات",
    subtitle: "يحول بين القشرانيات الجهازية",
    from: "من الدواء",
    to: "إلى الدواء",
    dose: "الجرعة الحالية (مغ)",
    result: "الجرعة المكافئة",
    formula: "النسبة محسوبة مقارنة بالهيدروكورتيزون (20 مغ)",
    clinicalTitle: "التعديلات",
    clinicalText: "القيم تقريبية. قد يختلف التكافؤ السريري بناءً على الحالة ونصف العمر.",
    references: "التكافؤات الدوائية القياسية.",
  }
};

const steroids = [
  { id: 'hydrocortisone', name: 'Hydrocortisone', dose: 20 },
  { id: 'prednisone', name: 'Prednisone', dose: 5 },
  { id: 'prednisolone', name: 'Prednisolone', dose: 5 },
  { id: 'methylprednisolone', name: 'Methylprednisolone', dose: 4 },
  { id: 'triamcinolone', name: 'Triamcinolone', dose: 4 },
  { id: 'dexamethasone', name: 'Dexamethasone', dose: 0.75 },
  { id: 'betamethasone', name: 'Betamethasone', dose: 0.6 },
  { id: 'fludrocortisone', name: 'Fludrocortisone', dose: 2 }
];

export default function SteroidConversion({ lang }: { lang: LangCode }) {
  const [fromId, setFromId] = useState<string>('prednisone');
  const [toId, setToId] = useState<string>('dexamethasone');
  const [dose, setDose] = useState<number | ''>(50);

  const currentText = translations[lang];
  const isRtl = lang === 'ar';

  const equivalent = useMemo(() => {
    if (dose === '' || dose <= 0) return null;
    const fromDrug = steroids.find(s => s.id === fromId);
    const toDrug = steroids.find(s => s.id === toId);
    if (!fromDrug || !toDrug) return null;
    return (Number(dose) / fromDrug.dose) * toDrug.dose;
  }, [fromId, toId, dose]);

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
            <div className="space-y-6">
              
              <div className="group">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.dose}</label>
                <input
                  type="number"
                  value={dose}
                  onChange={(e) => setDose(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-2xl font-semibold text-gray-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="group">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.from}</label>
                  <select
                    value={fromId}
                    onChange={(e) => setFromId(e.target.value)}
                    className="w-full bg-gray-50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-lg font-medium text-gray-800 rtl:text-right"
                  >
                    {steroids.map(s => <option key={`f-${s.id}`} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="group">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.to}</label>
                  <select
                    value={toId}
                    onChange={(e) => setToId(e.target.value)}
                    className="w-full bg-gray-50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-lg font-medium text-gray-800 rtl:text-right"
                  >
                    {steroids.map(s => <option key={`t-${s.id}`} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky top-28 bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 flex flex-col p-8 min-h-[320px]">
            <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            <div className="relative z-10 flex-1 flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-6">{currentText.result}</span>
              <div className="flex-1 flex flex-col justify-center">
                 <div className="text-3xl font-bold tracking-tighter text-blue-400 mb-2 truncate">
                   {toId ? steroids.find(s => s.id === toId)?.name : ''}
                 </div>
                 <div className="flex items-baseline gap-2 tabular-nums">
                   <span className="text-6xl font-bold tracking-tighter text-white">
                     {equivalent !== null ? (equivalent % 1 === 0 ? equivalent : equivalent.toFixed(2)) : '--'}
                   </span>
                   <span className="text-xl font-medium text-gray-400">mg</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-10 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0"><Info className="w-5 h-5"/></div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">{currentText.clinicalTitle}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{currentText.clinicalText}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0"><Activity className="w-5 h-5"/></div>
            <div className="w-full">
              <h3 className="font-semibold text-gray-900 mb-1">Mathematical Metric</h3>
              <div className="font-mono text-xs bg-gray-100 text-gray-700 py-2 px-3 rounded-md border border-gray-200">
                {currentText.formula}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
