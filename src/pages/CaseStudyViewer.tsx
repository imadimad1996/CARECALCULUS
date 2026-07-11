import React, { useState } from 'react';
import { Stethoscope, CheckCircle2, HelpCircle, ArrowRight } from 'lucide-react';
import { LangCode } from '../types';
import { useLang } from '../utils/lang';
import { CASE_STUDIES_DB } from '../utils/caseStudyDb';

const T = {
  en: {
    clinicalSimulation: "CLINICAL SIMULATION",
    submitDecision: "SUBMIT DECISION",
    clinicalExplanation: "Clinical Explanation",
    reference: "Reference",
    nextStep: "PROCEED TO NEXT CLINICAL STEP",
    heartRate: "Heart Rate",
    bloodPressure: "Blood Pressure",
    temperature: "Temperature",
    respRate: "Resp Rate",
    spo2: "SpO2"
  },
  fr: {
    clinicalSimulation: "PRATIQUE CLINIQUE INTERACTIVE",
    submitDecision: "SOUMETTRE LA DÉCISION",
    clinicalExplanation: "Explication Clinique",
    reference: "Référence",
    nextStep: "PASSER À L'ÉTAPE CLINIQUE SUIVANTE",
    heartRate: "Fréquence Cardiaque",
    bloodPressure: "Pression Artérielle",
    temperature: "Température",
    respRate: "Fréq. Respiratoire",
    spo2: "SpO2"
  },
  ar: {
    clinicalSimulation: "تدريب الحالات السريرية التفاعلية",
    submitDecision: "إرسال القرار السريري",
    clinicalExplanation: "الشرح السريري والتعليل",
    reference: "المصدر المرجعي",
    nextStep: "الانتقال إلى الخطوة السريرية التالية",
    heartRate: "نبض القلب",
    bloodPressure: "ضغط الدم",
    temperature: "درجة الحرارة",
    respRate: "معدل التنفس",
    spo2: "أكسجة الدم SpO2"
  }
};

export default function CaseStudyViewer({ lang }: { lang: LangCode }) {
  const { langPath } = useLang();
  const isRtl = false;
  const caseData = CASE_STUDIES_DB[0]; // Renders Sepsis study case
  const t = T[lang] || T.en;

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const activeStep = caseData.steps[currentStep];

  const stepTitle = lang === 'fr' ? activeStep.titleFr || activeStep.title : activeStep.title;
  const stepDesc = lang === 'fr' ? activeStep.descriptionFr || activeStep.description : activeStep.description;

  return (
    <div className="max-w-3xl mx-auto py-6 px-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="mb-8 text-center sm:text-left">
        <span className="text-[10px] font-mono font-black text-teal-600 uppercase tracking-widest">
          {t.clinicalSimulation}
        </span>
        <h1 className="text-3xl font-black text-slate-900 mt-1">
          {lang === 'fr' ? caseData.titleFr : caseData.titleEn}
        </h1>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200/85 p-6 md:p-8 space-y-6 shadow-xs">
        {/* Progress bar */}
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-teal-500 h-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / caseData.steps.length) * 100}%` }}
          />
        </div>

        {/* Step details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-teal-600" />
            {stepTitle}
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed font-medium">
            {stepDesc}
          </p>
        </div>

        {/* Vitals HUD */}
        {activeStep.vitals && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-150">
            <div className="text-center">
              <span className="text-[9px] font-mono text-gray-400 font-bold uppercase block">{t.heartRate}</span>
              <span className="text-sm font-black text-red-500">{activeStep.vitals.hr} bpm</span>
            </div>
            <div className="text-center border-l sm:border-r border-gray-200/60">
              <span className="text-[9px] font-mono text-gray-400 font-bold uppercase block">{t.bloodPressure}</span>
              <span className="text-sm font-black text-slate-800">{activeStep.vitals.bp}</span>
            </div>
            <div className="text-center border-l border-gray-200/60">
              <span className="text-[9px] font-mono text-gray-400 font-bold uppercase block">{t.temperature}</span>
              <span className="text-sm font-black text-orange-500">{activeStep.vitals.temp} °C</span>
            </div>
            <div className="text-center border-l border-gray-200/60">
              <span className="text-[9px] font-mono text-gray-400 font-bold uppercase block">{t.respRate}</span>
              <span className="text-sm font-black text-blue-500">{activeStep.vitals.rr} /min</span>
            </div>
            <div className="text-center border-l border-gray-200/60">
              <span className="text-[9px] font-mono text-gray-400 font-bold uppercase block">{t.spo2}</span>
              <span className="text-sm font-black text-emerald-600">{activeStep.vitals.spo2}%</span>
            </div>
          </div>
        )}

        {/* MCQ Question block */}
        {activeStep.question && (
          <div className="border-t border-gray-100 pt-6 space-y-4">
            <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              {lang === 'fr' ? activeStep.question.textFr || activeStep.question.text : activeStep.question.text}
            </p>
            <div className="space-y-2">
              {(lang === 'fr' ? activeStep.question.optionsFr || activeStep.question.options : activeStep.question.options).map((opt, idx) => {
                let btnStyle = "border-gray-200 hover:border-blue-400 bg-gray-50/30";
                if (isAnswered) {
                  if (idx === activeStep.question!.correctIndex) {
                    btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-800";
                  } else if (selectedOption === idx) {
                    btnStyle = "border-red-500 bg-red-50 text-red-800";
                  } else {
                    btnStyle = "opacity-50 border-gray-150";
                  }
                } else if (selectedOption === idx) {
                  btnStyle = "border-blue-600 ring-2 ring-blue-100 bg-blue-50/20";
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full p-4 text-left border rounded-xl text-xs font-semibold flex items-center justify-between transition-all duration-200 cursor-pointer ${btnStyle} ${isRtl ? 'text-right' : 'text-left'}`}
                    style={{ minHeight: '44px' }}
                  >
                    <span>{opt}</span>
                    {isAnswered && idx === activeStep.question!.correctIndex && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer validation buttons */}
            {!isAnswered ? (
              <button
                disabled={selectedOption === null}
                onClick={() => {
                  setIsAnswered(true);
                  if (selectedOption === activeStep.question!.correctIndex) {
                    const completed = JSON.parse(localStorage.getItem('carecalculus-completed-cases') || '[]');
                    if (!completed.includes('sepsis')) {
                      localStorage.setItem('carecalculus-completed-cases', JSON.stringify([...completed, 'sepsis']));
                    }
                  }
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs tracking-wide transition active:scale-95 cursor-pointer"
              >
                {t.submitDecision}
              </button>
            ) : (
              <div className="bg-blue-50/50 border border-blue-100/80 p-4 rounded-2xl space-y-2 animate-fade-in text-xs leading-relaxed text-slate-700">
                <span className="font-bold text-blue-700 uppercase tracking-wide block">{t.clinicalExplanation}</span>
                <p>{lang === 'fr' ? activeStep.question.rationaleFr || activeStep.question.rationale : activeStep.question.rationale}</p>
                <div className="border-t border-blue-100/60 pt-2 mt-2 text-[10px] text-gray-400 font-mono">
                  {t.reference}: Surviving Sepsis Campaign Guidelines 2021 / JAMA.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step navigation */}
        {isAnswered && currentStep < caseData.steps.length - 1 && (
          <button
            onClick={handleNext}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95 mt-4 cursor-pointer"
          >
            <span>{t.nextStep}</span>
            <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
    </div>
  );
}
