import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, ActivitySquare } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_CARDIOLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "NYHA Heart Failure Functional Classification",
    subtitle: "Universally adopted classification grading functional limitation and exercise capacity in heart failure patients",
    selectClass: "Select Patient Symptom & Functional Limitations",
    class1Title: "Class I: No Limitation",
    class1Desc: "No limitation of physical activity. Ordinary physical activity (walking, climbing stairs) does not cause undue fatigue, palpitation, or dyspnea.",
    class2Title: "Class II: Slight Limitation",
    class2Desc: "Slight limitation of physical activity. Comfortable at rest. Ordinary physical activity results in fatigue, palpitation, dyspnea, or angina.",
    class3Title: "Class III: Marked Limitation",
    class3Desc: "Marked limitation of physical activity. Comfortable at rest. Less than ordinary activity (e.g., walking 1–2 blocks, dressing, minor household chores) causes fatigue or dyspnea.",
    class4Title: "Class IV: Severe Limitation / Rest Symptoms",
    class4Desc: "Unable to carry on any physical activity without discomfort. Symptoms of heart failure (dyspnea, fatigue) are present even at rest. Discomfort increases with any effort.",
    result: "NYHA Functional Class",
    prognosisTitle: "Clinical Significance & GDMT Guidance",
    references: "The Criteria Committee of the New York Heart Association. Nomenclature and Criteria for Diagnosis of Diseases of the Heart and Great Vessels. 9th ed. Boston: Little, Brown & Co; 1994:253-256.",
    faqs: [
      { question: "What is the difference between ACC/AHA Stages and NYHA Classes?", answer: "ACC/AHA Stages (A, B, C, D) reflect progressive structural heart disease and do not fluctuate backwards. NYHA Classes (I, II, III, IV) reflect subjective functional capacity and can improve or worsen depending on medical optimization (GDMT) or decompensation." },
      { question: "What GDMT therapies are guided by NYHA class?", answer: "SGLT2 inhibitors and ARNI/ACEi/ARB plus beta-blockers and MRAs are foundational across all symptomatic stages (NYHA II-IV). Device therapies (ICD, CRT-D) and advanced therapies (LVAD, transplant) depend directly on NYHA functional status." }
    ],
    c1Result: "NYHA Class I: Mild / Asymptomatic Limitation",
    c1Desc: "Preserved exercise tolerance. Continue guideline-directed medical therapy (GDMT) optimization and risk factor management.",
    c2Result: "NYHA Class II: Mild Symptomatic Heart Failure",
    c2Desc: "Symptoms on moderate exertion. Foundational 4-pillar GDMT indicated (ARNI, Beta-blocker, MRA, SGLT2i). Consider loop diuretics for volume overload.",
    c3Result: "NYHA Class III: Moderate-to-Severe Limitation",
    c3Desc: "Substantial functional impairment. Optimize GDMT. Evaluate candidacy for CRT-D if LBBB with QRS ≥ 130 ms. Close monitoring of renal function and electrolytes.",
    c4Result: "NYHA Class IV: End-Stage / Rest Symptoms",
    c4Desc: "Advanced heart failure. Inpatient hemodynamic monitoring, intravenous inotropes, evaluation for mechanical circulatory support (LVAD) or heart transplantation."
  },
  fr: {
    title: "Classification Fonctionnelle NYHA (Insuffisance Cardiaque)",
    subtitle: "Classification universelle de la tolérance à l'effort et de la sévérité fonctionnelle dans l'insuffisance cardiaque",
    selectClass: "Sélectionnez le niveau de limitation fonctionnelle",
    class1Title: "Classe I : Aucune limitation",
    class1Desc: "Pas de gêne lors des activités physiques habituelles (marche, montée des escaliers). Pas de fatigue excessive ni d'essoufflement.",
    class2Title: "Classe II : Limitation légère",
    class2Desc: "Asymptomatique au repos. Les activités physiques courantes provoquent une dyspnée, des palpitations ou une fatigue inhabituelle.",
    class3Title: "Classe III : Limitation marquée",
    class3Desc: "Asymptomatique au repos. Une activité physique inférieure à la normale (marcher sur terrain plat, s'habiller) entraîne une dyspnée.",
    class4Title: "Classe IV : Symptômes au repos",
    class4Desc: "Incapacité à effectuer tout effort physique sans gêne. Dyspnée présente même au repos complet, majorée au moindre geste.",
    result: "Classe Fonctionnelle NYHA",
    prognosisTitle: "Implications Cliniques & Traitements",
    references: "The Criteria Committee of the New York Heart Association. 1994.",
    faqs: [
      { question: "Quelle est la différence entre les stades AHA et les classes NYHA ?", answer: "Les stades AHA (A à D) traduisent l'évolution anatomique irréversible de la maladie, tandis que les classes NYHA (I à IV) traduisent la capacité fonctionnelle qui peut s'améliorer sous traitement." }
    ],
    c1Result: "NYHA Classe I : Limitation Minime",
    c1Desc: "Tolérance à l'effort conservée. Poursuivre le traitement médical optimal.",
    c2Result: "NYHA Classe II : Insuffisance Cardiaque Modérée",
    c2Desc: "Quadrithérapie recommandée (ARNI/IEC, Bêtabloquant, ARM, iSGLT2) et ajustement des diurétiques de l'anse.",
    c3Result: "NYHA Classe III : Handicap Fonctionnel Sévère",
    c3Desc: "Altération marquée de l'autonomie. Évaluer l'indication d'une resynchronisation cardiaque (CRT) si QRS large.",
    c4Result: "NYHA Classe IV : Insuffisance Cardiaque Avancée",
    c4Desc: "Décompensation permanente. Avis spécialisé urgent : inotropes, assistance circulatoire mécanique (LVAD) ou transplantation."
  }
};

export default function NyhaClassification({ lang }: { lang: LangCode }) {
  const [selectedClass, setSelectedClass] = useState<number>(2);

  const currentText = translations[lang] || translations.en;

  useEffect(() => {
    trackCalculatorUsage('nyha-classification', lang, selectedClass);
  }, [selectedClass, lang]);

  const items = [
    { num: 1, title: currentText.class1Title, desc: currentText.class1Desc, roman: 'I' },
    { num: 2, title: currentText.class2Title, desc: currentText.class2Desc, roman: 'II' },
    { num: 3, title: currentText.class3Title, desc: currentText.class3Desc, roman: 'III' },
    { num: 4, title: currentText.class4Title, desc: currentText.class4Desc, roman: 'IV' }
  ];

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/nyha-classification"
        scoringSystem="NYHA Heart Failure Functional Classification"
        howToSteps={[
          lang === 'fr' ? 'Interroger le patient sur l\'impact de l\'effort quotidien sur sa respiration.' : 'Interview patient regarding exertional dyspnea and limitations during daily activities.',
          lang === 'fr' ? 'Sélectionner la classe correspondante de I (asymptomatique) à IV (dyspnée de repos).' : 'Select class from I (asymptomatic ordinary activity) to IV (rest dyspnea).',
          lang === 'fr' ? 'Guider la quadrithérapie recommandée et l\'indication de dispositifs (défibrillateur, CRT).' : 'Guide 4-pillar GDMT and device indications (ICD/CRT).'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-700 mb-2">
          <ActivitySquare className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Cardiologie & Insuffisance Cardiaque' : 'Cardiology & Heart Failure'}</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
          {currentText.title}
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
              {currentText.selectClass}
            </label>

            <div className="space-y-3">
              {items.map((item) => {
                const isSelected = selectedClass === item.num;
                return (
                  <button
                    key={item.num}
                    type="button"
                    onClick={() => setSelectedClass(item.num)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? item.num <= 2
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                          : 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 shadow-sm'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold text-sm ${isSelected ? 'text-gray-900' : 'text-gray-800'}`}>
                        {item.title}
                      </span>
                      <span className={`text-xs px-2.5 py-0.5 rounded font-bold ${
                        item.num <= 2 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        Class {item.roman}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 p-6 md:p-8 relative">
            <div className="absolute top-0 right-0 p-24 bg-gradient-to-bl from-rose-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-5">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block">
                {currentText.result}
              </span>
              
              <div className="flex items-baseline gap-3 tabular-nums">
                <span className={`text-5xl md:text-6xl font-extrabold tracking-tight ${
                  selectedClass === 1 ? 'text-emerald-400' : selectedClass === 2 ? 'text-teal-400' : selectedClass === 3 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  Class {items[selectedClass - 1].roman}
                </span>
              </div>

              <div className={`p-4 rounded-xl border ${
                selectedClass === 1
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : selectedClass === 2
                  ? 'bg-teal-50 text-teal-800 border-teal-200'
                  : selectedClass === 3
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                <div className="font-bold text-sm mb-1">
                  {selectedClass === 1 ? currentText.c1Result : selectedClass === 2 ? currentText.c2Result : selectedClass === 3 ? currentText.c3Result : currentText.c4Result}
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  {selectedClass === 1 ? currentText.c1Desc : selectedClass === 2 ? currentText.c2Desc : selectedClass === 3 ? currentText.c3Desc : currentText.c4Desc}
                </p>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "Patient Classification", value: items[selectedClass - 1].title }
                ]}
                results={[
                  { label: "NYHA Functional Class", value: `Class ${items[selectedClass - 1].roman}` },
                  { label: "Symptom Burden", value: selectedClass <= 2 ? "Mild Functional Limitation" : "Severe Functional Limitation" }
                ]}
                formula="New York Heart Association 4-Tier Functional Staging"
                disclaimer="NYHA status tracks functional capacity and guides GDMT medical/device therapies."
                references="The Criteria Committee of the New York Heart Association. 1994."
                lang={lang}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <MedicalReviewerCard reviewer={REVIEWER_CARDIOLOGY} />
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900 block mb-1">Foundational Evidence:</span>
          <p className="italic mb-2">{currentText.references}</p>
        </div>
      </div>
    </>
  );
}
