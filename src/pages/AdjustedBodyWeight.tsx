import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';

const translations: Translations = {
  en: {
    title: "Ideal & Adjusted Body Weight",
    subtitle: "Estimates weight for medication dosing and lung ventilation",
    height: "Height (cm)",
    weight: "Actual Weight (kg)",
    sex: "Sex",
    male: "Male",
    female: "Female",
    ibwTitle: "Ideal Body Weight (IBW)",
    abwTitle: "Adjusted Body Weight (ABW)",
    lbwTitle: "Lean Body Weight (LBW)",
    formula: "IBW (Devine): 50(M)/45.5(F) + 0.91 × (Height - 152.4)",
    clinicalTitle: "Dosing Relevance",
    clinicalText: "Aminoglycosides and some chemotherapies use Adjusted BW if Actual > 120% of IBW. Tidal volume uses PBW/IBW.",
    references: "References: Devine BJ. Gentamicin therapy.",
  },
  fr: {
    title: "Poids Idéal et Ajusté",
    subtitle: "Estime le poids pour la posologie et la ventilation",
    height: "Taille (cm)",
    weight: "Poids Réel (kg)",
    sex: "Sexe",
    male: "Homme",
    female: "Femme",
    ibwTitle: "Poids Idéal (IBW)",
    abwTitle: "Poids Ajusté (ABW)",
    lbwTitle: "Masse Maigre (LBW)",
    formula: "IBW (Devine): 50(H)/45.5(F) + 0.91 × (Taille - 152.4)",
    clinicalTitle: "Pertinence Posologique",
    clinicalText: "Les aminosides utilisent le poids ajusté si le poids réel > 120% du poids idéal. Le volume courant s'appuie sur le poids idéal.",
    references: "Références: Devine BJ. Pai MP, et al.",
  },
  ar: {
    title: "الوزن المثالي والمعدّل",
    subtitle: "تقدير الوزن لحساب جُرعات الأدوية والتهوية الرئوية",
    height: "الطول (سم)",
    weight: "الوزن الفعلي (كغ)",
    sex: "الجنس",
    male: "ذكر",
    female: "أنثى",
    ibwTitle: "الوزن المثالي (IBW)",
    abwTitle: "الوزن المعدل (ABW)",
    lbwTitle: "الكتلة اللادهنية (LBW)",
    formula: "الوزن المثالي (Devine): 50/45.5 + 0.91 × (الطول - 152.4)",
    clinicalTitle: "أهمية الجرعات",
    clinicalText: "تُستخدم الأوزان المعدلة لحساب جرعة العديد من الأدوية عندما يتجاوز الوزن الفعلي 120% من الوزن المثالي.",
    references: "المراجع: معادلة Devine و Janmahasatian.",
  }
};

export default function AdjustedBodyWeight({ lang }: { lang: LangCode }) {
  const [height, setHeight] = useState<number | ''>(170);
  const [weight, setWeight] = useState<number | ''>(100);
  const [sex, setSex] = useState<number>(0); 

  const currentText = translations[lang];
  const isRtl = lang === 'ar';

  const results = useMemo(() => {
    if (height === '' || weight === '' || height <= 0 || weight <= 0) return null;
    const h = Number(height);
    const w = Number(weight);
    
    // IBW (Devine)
    const base = sex === 0 ? 50.0 : 45.5;
    const ibw = base + 0.91 * (h - 152.4);
    
    // Adjusted
    const isObese = w > 1.2 * ibw;
    const abw = isObese ? (ibw + 0.4 * (w - ibw)) : w;
    
    // BMI
    const hm = h / 100;
    const bmi = w / (hm * hm);
    
    // LBW (Janmahasatian)
    const lbw = sex === 0 
      ? (9270 * w) / (6680 + 216 * bmi)
      : (9270 * w) / (8780 + 244 * bmi);

    const savedStandard = localStorage.getItem('carecalculus-standard');
    return {
      ibw: Math.max(0, ibw),
      abw: Math.max(0, abw),
      lbw: Math.max(0, lbw),
      isObese
    };
  }, [height, weight, sex]);

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
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-gray-950/5 p-6 md:p-8 space-y-6">
            
            <div className="space-y-4">
               <div>
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.sex}</label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setSex(0)}
                      className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${sex === 0 ? 'bg-blue-600 border-blue-600 text-white font-bold' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}
                      style={{ minHeight: '44px' }}
                    >
                      {currentText.male}
                    </button>
                    <button
                      onClick={() => setSex(1)}
                      className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${sex === 1 ? 'bg-blue-600 border-blue-600 text-white font-bold' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}
                      style={{ minHeight: '44px' }}
                    >
                      {currentText.female}
                    </button>
                  </div>
                </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="group">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.height}</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Number(e.target.value);
                        setHeight(val);
                      }}
                      className="w-full bg-gray-50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-2xl font-semibold text-gray-900"
                    />
                  </div>
                  <div className="group">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.weight}</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Number(e.target.value);
                        setWeight(val);
                      }}
                      className="w-full bg-gray-50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-2xl font-semibold text-gray-900"
                    />
                  </div>
              </div>
            </div>

          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
            <div className="bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 p-8 min-h-[320px] relative">
               <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
                
               <div className="relative z-10 flex flex-col gap-6">
                  
                  <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-1">
                        {currentText.ibwTitle}
                    </span>
                    <div className="flex items-baseline gap-2 tabular-nums">
                        <span className="text-4xl font-bold tracking-tighter">
                        {results !== null ? results.ibw.toFixed(1) : '--'}
                        </span>
                        <span className="text-sm text-gray-400">kg</span>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-1">
                            {currentText.abwTitle}
                        </span>
                        {results?.isObese && <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded uppercase">Patient &gt; 120% IBW</span>}
                    </div>
                    <div className="flex items-baseline gap-2 tabular-nums">
                        <span className="text-4xl font-bold tracking-tighter">
                        {results !== null ? results.abw.toFixed(1) : '--'}
                        </span>
                        <span className="text-sm text-gray-400">kg</span>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                        {currentText.lbwTitle}
                    </span>
                    <div className="flex items-baseline gap-2 tabular-nums">
                        <span className="text-4xl font-bold tracking-tighter">
                        {results !== null ? results.lbw.toFixed(1) : '--'}
                        </span>
                        <span className="text-sm text-gray-400">kg</span>
                    </div>
                  </div>

                  {results !== null && (
                    <ClinicalExportButton
                      title={currentText.title}
                      inputs={[
                        { label: currentText.sex, value: sex === 0 ? currentText.male : currentText.female },
                        { label: currentText.height, value: `${height} cm` },
                        { label: currentText.weight, value: `${weight} kg` }
                      ]}
                      results={[
                        { label: currentText.ibwTitle, value: results.ibw.toFixed(1), unit: 'kg' },
                        { label: currentText.abwTitle, value: results.abw.toFixed(1), unit: 'kg' },
                        { label: currentText.lbwTitle, value: results.lbw.toFixed(1), unit: 'kg' },
                        { label: 'Obesity Status', value: results.isObese ? 'Obese (Actual > 120% Ideal)' : 'Non-obese' }
                      ]}
                      formula="Devine: Male IBW = 50.0 + 2.3 * ((Ht - 152.4)/2.54), Female IBW = 45.5 + 2.3 * ((Ht - 152.4)/2.54)"
                      disclaimer="This calculator estimates medical dry weights. Clinicians should evaluate physiological factors, fluid status, and muscle status."
                      references="Devine BJ. Gentamicin therapy. Drug Intell Clin Pharm. 1974;8:650–655. / Robinson Formula / Peters Formula."
                      lang={lang}
                    />
                  )}

               </div>
            </div>
        </div>
      </div>
    </>
  );
}
