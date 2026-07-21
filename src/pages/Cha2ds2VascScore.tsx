import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';
import ClinicalExportButton from '../components/ClinicalExportButton';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd, generateMedicalCalculatorSchema } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_CARDIOLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "CHA₂DS₂-VASc Score for Atrial Fibrillation Stroke Risk",
    subtitle: "Estimates stroke risk in patients with atrial fibrillation",
    age: "Age",
    ageUnder65: "Under 65 (0 points)",
    age65to74: "65-74 years (+1 point)",
    age75orOver: "75 years or older (+2 points)",
    sex: "Sex",
    male: "Male (0 points)",
    female: "Female (+1 point)",
    chf: "Congestive Heart Failure history",
    htn: "Hypertension history",
    stroke: "Stroke / TIA / Thromboembolism history",
    vascular: "Vascular disease (e.g., prior MI, PAD, aortic plaque)",
    diabetes: "Diabetes Mellitus history",
    result: "Calculated Score",
    formula: "Sum of points (0 to 9)",
    clinicalTitle: "Recommendation",
    clinicalText: "Score 0 (Men) / 1 (Women): No anticoagulation recommended. Score 1 (Men): Consider anticoagulation. Score ≥ 2: Anticoagulation highly recommended.",
    pillarTitle: "Clinical Guidelines & OAC Anticoagulation Strategy",
    pillarText: [
      "The CHA₂DS₂-VASc score is the foundational clinical risk stratification rule recommended by both the European Society of Cardiology (ESC) and the American Heart Association (AHA/ACC) to estimate the risk of stroke and systemic thromboembolism in non-valvular atrial fibrillation (AFib).",
      "A critical nuance in clinical application is the female sex modifier (+1 point). According to international consensus, female sex alone in an otherwise healthy individual (Score = 1 in women under 65) does not confer an elevated stroke risk that warrants oral anticoagulation (OAC). Anticoagulation is formally indicated only when a patient has at least one additional non-sex risk factor (Score ≥ 2 in men, ≥ 3 in women).",
      "When OAC therapy is indicated, Direct Oral Anticoagulants (DOACs such as apixaban, rivaroxaban, dabigatran, or edoxaban) are strongly preferred over Vitamin K Antagonists (VKAs like warfarin) due to their superior safety profile, particularly regarding intracranial hemorrhage."
    ],
    faqQ1: "What does CHA2DS2-VASc stand for?",
    faqA1: "CHA2DS2-VASc is an acronym representing Congestive heart failure, Hypertension, Age ≥ 75 (doubled), Diabetes, prior Stroke/TIA (doubled), Vascular disease, Age 65-74, and Sex category (female).",
    faqQ2: "Does a score of 1 in a female patient require blood thinners?",
    faqA2: "No. Female sex alone gives 1 point but does not increase stroke risk independently in young women. Oral anticoagulation is typically initiated only when additional clinical risk factors are present.",
    faqQ3: "Should bleeding risk be assessed alongside this score?",
    faqA3: "Yes. Clinicians routinely calculate the HAS-BLED score alongside CHA2DS2-VASc to evaluate modifiable bleeding risks, though high bleeding risk rarely contraindicates anticoagulation when stroke risk is severe.",
    references: "References: Lip GY, et al. Refining clinical risk stratification for predicting stroke and thromboembolism in atrial fibrillation. Chest.",
    low: "Low Risk",
    moderate: "Moderate Risk",
    high: "High Risk"
  },
  fr: {
    title: "Score CHA₂DS₂-VASc",
    subtitle: "Estime le risque d'AVC chez les patients avec fibrillation atriale",
    age: "Âge",
    ageUnder65: "Moins de 65 ans (0 points)",
    age65to74: "65-74 ans (+1 point)",
    age75orOver: "75 ans ou plus (+2 points)",
    sex: "Sexe",
    male: "Homme (0 points)",
    female: "Femme (+1 point)",
    chf: "Insuffisance Cardiaque Congestive",
    htn: "Hypertension Artérielle",
    stroke: "Antécédents d'AVC / AIT / Thromboembolie",
    vascular: "Maladie Vasculaire (ex: IDM, artériopathie périphérique)",
    diabetes: "Antécédent de Diabète",
    result: "Score Calculé",
    formula: "Somme des points (0 à 9)",
    clinicalTitle: "Recommandation",
    clinicalText: "Score 0 (H) / 1 (F) : Pas d'anticoagulation. Score 1 (H) : Anticoagulation à envisager. Score ≥ 2 : Anticoagulation fortement recommandée.",
    pillarTitle: "Directives Cliniques et Stratégie d'Anticoagulation",
    pillarText: [
      "Le score CHA₂DS₂-VASc est l'outil de stratification du risque thromboembolique de référence recommandé par la Société Européenne de Cardiologie (ESC) pour guider le traitement anticoagulant dans la fibrillation atriale (FA) non valvulaire.",
      "Une nuance fondamentale concerne le critère du sexe féminin (+1 point). Chez une femme de moins de 65 ans sans autre facteur de risque (Score = 1), le risque d'AVC n'est pas augmenté et n'indique pas d'anticoagulation orale (ACO). L'ACO est formellement recommandée dès la présence d'un facteur de risque non lié au sexe (Score ≥ 2 chez l'homme, ≥ 3 chez la femme).",
      "Lorsque l'anticoagulation est indiquée, les anticoagulants oraux directs (AOD comme l'apixaban ou le rivaroxaban) sont privilégiés par rapport aux anti-vitamines K (AVK) en raison de leur profil de sécurité supérieur."
    ],
    faqQ1: "Que signifie l'acronyme CHA2DS2-VASc ?",
    faqA1: "Il correspond à : Insuffisance Cardiaque, Hypertension, Âge ≥ 75 ans (2 pts), Diabète, AVC/AIT (2 pts), Maladie Vasculaire, Âge 65-74 ans, et Sexe (féminin).",
    faqQ2: "Une femme avec un score de 1 doit-elle prendre un anticoagulant ?",
    faqA2: "Non. Le sexe féminin attribue 1 point mais ne justifie pas à lui seul un traitement anticoagulant en l'absence d'autres facteurs de risque cliniques.",
    faqQ3: "Faut-il évaluer le risque hémorragique ?",
    faqA3: "Oui, le score HAS-BLED est couramment utilisé en parallèle pour identifier et corriger les facteurs de risque hémorragique modifiables.",
    references: "Références: Lip GY, et al. Refining clinical risk stratification for predicting stroke.",
    low: "Risque Faible",
    moderate: "Risque Modéré",
    high: "Risque Élevé"
  }
};

export default function Cha2ds2VascScore({ lang }: { lang: LangCode }) {
  const [age, setAge] = useState<number>(0); // 0: <65, 1: 65-74, 2: >=75
  const [sex, setSex] = useState<number>(0); // 0: male, 1: female
  
  const [chf, setChf] = useState<boolean>(false);
  const [htn, setHtn] = useState<boolean>(false);
  const [stroke, setStroke] = useState<boolean>(false);
  const [vascular, setVascular] = useState<boolean>(false);
  const [diabetes, setDiabetes] = useState<boolean>(false);

  const currentText = translations[lang];
  const isRtl = false;

  const scoreValue = useMemo(() => {
    let score = 0;
    if (age === 1) score += 1;
    if (age === 2) score += 2;
    if (sex === 1) score += 1;
    if (chf) score += 1;
    if (htn) score += 1;
    if (stroke) score += 2;
    if (vascular) score += 1;
    if (diabetes) score += 1;
    return score;
  }, [age, sex, chf, htn, stroke, vascular, diabetes]);

  useEffect(() => {
    if (scoreValue > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('cha2ds2-vasc', lang, scoreValue);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [scoreValue, lang]);

  const category = useMemo(() => {
    if (scoreValue >= 2) return { label: currentText.high, bg: 'bg-red-500/10 border-red-500/20', color: 'text-red-500' };
    if (scoreValue === 1 && sex === 0) return { label: currentText.moderate, bg: 'bg-amber-500/10 border-amber-500/20', color: 'text-amber-500' };
    if (scoreValue === 1 && sex === 1) return { label: currentText.low, bg: 'bg-emerald-500/10 border-emerald-500/20', color: 'text-emerald-500' };
    return { label: currentText.low, bg: 'bg-emerald-500/10 border-emerald-500/20', color: 'text-emerald-500' };
  }, [scoreValue, sex, currentText]);

  return (
    <>
      <JsonLd data={generateMedicalCalculatorSchema(currentText.title, currentText.subtitle)} />
      
      {/* Ambient 2026 Page Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-purple-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-3xl mb-12 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 bg-clip-text text-transparent mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="cha2ds2-vasc" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3 leading-relaxed">
          {currentText.subtitle}
        </p>

        {/* GEO Definition Block with Glassmorphic Accent */}
        <div className="backdrop-blur-md bg-blue-50/70 border border-blue-200/60 shadow-sm rounded-2xl p-5 mt-6 mb-2 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-2">
            
            <h2 className="text-xs font-bold text-blue-900 uppercase tracking-widest">
              {lang === 'fr' ? 'Définition Clinique' : 'Clinical Definition'}
            </h2>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed font-medium">
            {currentText.faqA1}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-gray-950/5 p-6 md:p-8 space-y-8 transition-all">
            
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">{currentText.age}</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setAge(0)}
                  className={`p-3.5 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${age === 0 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-lg shadow-blue-500/25' : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 shadow-sm'}`}
                >
                  {currentText.ageUnder65}
                </button>
                <button
                  onClick={() => setAge(1)}
                  className={`p-3.5 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${age === 1 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-lg shadow-blue-500/25' : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 shadow-sm'}`}
                >
                  {currentText.age65to74}
                </button>
                <button
                  onClick={() => setAge(2)}
                  className={`p-3.5 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${age === 2 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-lg shadow-blue-500/25' : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 shadow-sm'}`}
                >
                  {currentText.age75orOver}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">{currentText.sex}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setSex(0)}
                  className={`p-3.5 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${sex === 0 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-lg shadow-blue-500/25' : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 shadow-sm'}`}
                >
                  {currentText.male}
                </button>
                <button
                  onClick={() => setSex(1)}
                  className={`p-3.5 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${sex === 1 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-lg shadow-blue-500/25' : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 shadow-sm'}`}
                >
                  {currentText.female}
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100">
              {[
                { label: currentText.chf, state: chf, setter: setChf, pts: 1 },
                { label: currentText.htn, state: htn, setter: setHtn, pts: 1 },
                { label: currentText.diabetes, state: diabetes, setter: setDiabetes, pts: 1 },
                { label: currentText.stroke, state: stroke, setter: setStroke, pts: 2 },
                { label: currentText.vascular, state: vascular, setter: setVascular, pts: 1 },
              ].map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => item.setter(!item.state)}
                  className={`p-4 border rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] flex items-center justify-between gap-4 ${item.state ? 'border-blue-500/60 bg-gradient-to-r from-blue-50/90 to-indigo-50/50 shadow-md ring-1 ring-blue-500/20' : 'border-gray-200/80 bg-white hover:bg-gray-50/60 shadow-sm'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`shrink-0 w-6 h-6 rounded-xl border flex items-center justify-center transition-all duration-200 ${item.state ? 'bg-blue-600 border-blue-600 text-white shadow-sm scale-110' : 'border-gray-300 bg-gray-50'}`}>
                      {item.state && (
                        <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm font-semibold transition-colors ${item.state ? 'text-gray-900' : 'text-gray-700'}`}>
                      {item.label}
                    </span>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg transition-colors ${item.state ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500'}`}>
                    +{item.pts}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky top-28 backdrop-blur-2xl bg-gradient-to-b from-slate-900 via-gray-900 to-slate-950 text-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-white/15 flex flex-col justify-between p-8 min-h-[360px] transition-all duration-300">
            <div className="absolute top-0 right-0 p-36 bg-gradient-to-bl from-blue-500/30 via-indigo-500/10 to-transparent rounded-bl-[120px] pointer-events-none animate-pulse" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {currentText.result}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-slate-300 backdrop-blur-md">
                  
                  Live Score
                </span>
              </div>
              
              <div className="flex items-baseline gap-2 tabular-nums my-2">
                <span className="text-8xl font-black tracking-tighter transition-all duration-300 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {scoreValue}
                </span>
                <span className="text-2xl font-bold text-slate-500">/ 9</span>
              </div>
            </div>

            <div className="relative z-10 mt-10 space-y-4">
              <div className={`p-4 rounded-2xl border backdrop-blur-md flex justify-between items-center transition-all shadow-lg ${category.bg} ${category.color}`}>
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-currentColor animate-pulse" />
                  <span className="font-bold text-sm tracking-wide">
                    {category.label}
                  </span>
                </div>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: currentText.age, value: age === 0 ? currentText.ageUnder65 : age === 1 ? currentText.age65to74 : currentText.age75orOver },
                  { label: currentText.sex, value: sex === 0 ? currentText.male : currentText.female },
                  { label: currentText.chf, value: chf ? 'Yes (1)' : 'No (0)' },
                  { label: currentText.htn, value: htn ? 'Yes (1)' : 'No (0)' },
                  { label: currentText.diabetes, value: diabetes ? 'Yes (1)' : 'No (0)' },
                  { label: currentText.stroke, value: stroke ? 'Yes (2)' : 'No (0)' },
                  { label: currentText.vascular, value: vascular ? 'Yes (1)' : 'No (0)' }
                ]}
                results={[
                  { label: currentText.result, value: `${scoreValue} / 9` },
                  { label: 'Stroke Risk Status', value: category.label }
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

      {/* In-Content Native Ad */}

      {/* Pillar Content Section */}
      <div className="mt-8 pt-10 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{currentText.pillarTitle}</h2>
        <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
          {currentText.pillarText?.map((paragraph: string, idx: number) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12 pt-8 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{layoutTranslations[lang].faqTitle}</h2>
        <div className="space-y-3">
          {[
            { q: currentText.faqQ1, a: currentText.faqA1 },
            { q: currentText.faqQ2, a: currentText.faqA2 },
            { q: currentText.faqQ3, a: currentText.faqA3 },
          ].map(({ q, a }) => (
            <details key={q} className="group border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                <span className="text-sm">{q}</span>
                <span className="w-4 h-4 text-gray-400 shrink-0 ml-3 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* E-E-A-T Trust Signal — Physician Reviewer Card */}
      <MedicalReviewerCard reviewer={REVIEWER_CARDIOLOGY} lang={lang} />
    </>
  );
}
