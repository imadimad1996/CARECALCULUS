import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';
import { playSleekSelect, playTactileClick, playTelemetrySuccess, playTelemetryAlert } from '../utils/audio';
import ClinicalExportButton from '../components/ClinicalExportButton';

const translations: Translations = {
  en: {
    title: "Glasgow Coma Scale (GCS)",
    subtitle: "Assess the level of consciousness after traumatic brain injury",
    eye: "Eye Opening Response",
    eye4: "4 - Spontaneous",
    eye3: "3 - To Voice",
    eye2: "2 - To Pain",
    eye1: "1 - None",
    verbal: "Verbal Response",
    verbal5: "5 - Orientated",
    verbal4: "4 - Confused",
    verbal3: "3 - Inappropriate Words",
    verbal2: "2 - Incomprehensible Sounds",
    verbal1: "1 - None",
    motor: "Motor Response",
    motor6: "6 - Obeys Commands",
    motor5: "5 - Localizes to Pain",
    motor4: "4 - Withdraws from Pain",
    motor3: "3 - Flexion to Pain (Decorticate)",
    motor2: "2 - Extension to Pain (Decerebrate)",
    motor1: "1 - None",
    result: "Calculated GCS",
    formula: "GCS = Eye + Verbal + Motor",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "Severe (GCS ≤ 8), Moderate (GCS 9-12), Minor (GCS ≥ 13). Intubation is generally recommended for GCS ≤ 8.",
    references: "References: Teasdale G, Jennett B. Assessment of coma and impaired consciousness.",
    severe: "Severe Brain Injury (≤8)",
    moderate: "Moderate Brain Injury (9-12)",
    minor: "Minor Brain Injury (13-15)"
  },
  fr: {
    title: "Score de Glasgow (GCS)",
    subtitle: "Évaluer le niveau de conscience après un traumatisme crânien",
    eye: "Ouverture des Yeux",
    eye4: "4 - Spontanée",
    eye3: "3 - À la parole",
    eye2: "2 - À la douleur",
    eye1: "1 - Aucune",
    verbal: "Réponse Verbale",
    verbal5: "5 - Orientée",
    verbal4: "4 - Confuse",
    verbal3: "3 - Mots inappropriés",
    verbal2: "2 - Sons incompréhensibles",
    verbal1: "1 - Aucune",
    motor: "Réponse Motrice",
    motor6: "6 - Obéit aux ordres",
    motor5: "5 - Orientée à la douleur",
    motor4: "4 - Évitement de la douleur",
    motor3: "3 - Décortication (Flexion)",
    motor2: "2 - Décérébration (Extension)",
    motor1: "1 - Aucune",
    result: "Score GCS Calculé",
    formula: "GCS = Yeux + Verbe + Moteur",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Sévère (GCS ≤ 8), Modéré (GCS 9-12), Mineur (GCS ≥ 13). L'intubation est généralement recommandée pour GCS ≤ 8.",
    references: "Références : Teasdale G, Jennett B. Assessment of coma and impaired consciousness.",
    severe: "Lésion cérébrale sévère (≤8)",
    moderate: "Lésion cérébrale modérée (9-12)",
    minor: "Lésion cérébrale mineure (13-15)"
  },
  ar: {
    title: "مقياس غلاسكو للغيبوبة (GCS)",
    subtitle: "تقييم مستوى الوعي بعد إصابات الدماغ الرضحية",
    eye: "استجابة فتح العين",
    eye4: "4 - تلقائي",
    eye3: "3 - للصوت",
    eye2: "2 - للألم",
    eye1: "1 - لا توجد",
    verbal: "الاستجابة اللفظية",
    verbal5: "5 - موجه (طبيعي)",
    verbal4: "4 - مشوش",
    verbal3: "3 - كلمات غير مناسبة",
    verbal2: "2 - أصوات غير مفهومة",
    verbal1: "1 - لا توجد",
    motor: "الاستجابة الحركية",
    motor6: "6 - يطيع الأوامر",
    motor5: "5 - يحدد مكان الألم",
    motor4: "4 - ينسحب من الألم",
    motor3: "3 - انثناء غير طبيعي للألم",
    motor2: "2 - امتداد غير طبيعي للألم",
    motor1: "1 - لا توجد",
    result: "نقطة GCS المحسوبة",
    formula: "استجابة العين + اللفظية + الحركية",
    clinicalTitle: "التفسير السريري",
    clinicalText: "شديد (GCS ≤ 8), متوسط (GCS 9-12), طفيف (GCS ≥ 13). يوصى بالتنبيب عادة لـ GCS ≤ 8.",
    references: "المراجع: Teasdale G, Jennett B. تقييم الغيبوبة وضعف الوعي.",
    severe: "إصابة شديدة (≤8)",
    moderate: "إصابة متوسطة (9-12)",
    minor: "إصابة طفيفة (13-15)"
  }
};

export default function GcsCalculator({ lang }: { lang: LangCode }) {
  const [eye, setEye] = useState<number>(4);
  const [verbal, setVerbal] = useState<number>(5);
  const [motor, setMotor] = useState<number>(6);

  const currentText = translations[lang];
  const isRtl = lang === 'ar';

  const gcsValue = eye + verbal + motor;

  useEffect(() => {
    if (gcsValue <= 8) {
      playTelemetryAlert();
    } else {
      playTelemetrySuccess();
    }
  }, [gcsValue]);

  const getGcsCategory = (val: number) => {
    if (val <= 8) return { label: currentText.severe, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
    if (val <= 12) return { label: currentText.moderate, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    return { label: currentText.minor, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
  };

  const category = getGcsCategory(gcsValue);

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
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">{currentText.eye}</label>
                <div className="grid grid-cols-1 gap-2">
                  {[4, 3, 2, 1].map((val) => (
                    <button
                      key={`eye-${val}`}
                      onClick={() => { setEye(val); playSleekSelect(); }}
                      onMouseEnter={playTactileClick}
                      className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${eye === val ? 'bg-blue-50 border-blue-600 text-blue-800 font-bold' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'}`}
                      style={{ minHeight: '44px' }}
                    >
                      {currentText[`eye${val}`]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 mt-4">{currentText.verbal}</label>
                <div className="grid grid-cols-1 gap-2">
                  {[5, 4, 3, 2, 1].map((val) => (
                    <button
                      key={`verbal-${val}`}
                      onClick={() => { setVerbal(val); playSleekSelect(); }}
                      onMouseEnter={playTactileClick}
                      className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${verbal === val ? 'bg-blue-50 border-blue-600 text-blue-800 font-bold' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'}`}
                      style={{ minHeight: '44px' }}
                    >
                      {currentText[`verbal${val}`]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 mt-4">{currentText.motor}</label>
                <div className="grid grid-cols-1 gap-2">
                  {[6, 5, 4, 3, 2, 1].map((val) => (
                    <button
                      key={`motor-${val}`}
                      onClick={() => { setMotor(val); playSleekSelect(); }}
                      onMouseEnter={playTactileClick}
                      className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${motor === val ? 'bg-blue-50 border-blue-600 text-blue-800 font-bold' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'}`}
                      style={{ minHeight: '44px' }}
                    >
                      {currentText[`motor${val}`]}
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
                  {gcsValue}
                </span>
                <span className="text-xl font-medium text-gray-400">/ 15</span>
              </div>
            </div>

            <div className="relative z-10 mt-10">
              <div className={`p-4 rounded-xl border flex justify-between items-center transition-all ${category.bg} ${category.color}`}>
                <div className="font-semibold text-sm">
                  {category.label}
                </div>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: currentText.eye, value: `${eye} - ${currentText[`eye${eye}`]}` },
                  { label: currentText.verbal, value: `${verbal} - ${currentText[`verbal${verbal}`]}` },
                  { label: currentText.motor, value: `${motor} - ${currentText[`motor${motor}`]}` }
                ]}
                results={[
                  { label: currentText.result, value: `${gcsValue} / 15` },
                  { label: 'Severity Score', value: category.label }
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
