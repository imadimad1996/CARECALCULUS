import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, Flame } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_INTENSIVIST } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "BISAP Score for Acute Pancreatitis Mortality",
    subtitle: "Early 24-hour bedside index predicting in-hospital mortality and severe organ failure",
    bun: "BUN > 25 mg/dL (8.9 mmol/L)",
    impaired: "Impaired mental status (GCS < 15, disorientation, or encephalopathy)",
    sirs: "SIRS present (≥ 2 Systemic Inflammatory Response Syndrome criteria)",
    age: "Age > 60 years",
    pleural: "Pleural effusion present on imaging (Chest X-ray or CT)",
    result: "Calculated BISAP Score",
    formula: "BISAP = B(1) + I(1) + S(1) + A(1) + P(1) [Max: 5]",
    clinicalTitle: "Clinical Severity & Disposition Guidance",
    references: "Wu BU, Johannes RS, Sun X, Tabak YP, Conwell DL, Banks PA. The early prediction of mortality in acute pancreatitis: a large population-based study. Gut. 2008;57(12):1698-1703. (PMID: 18519429).",
    faqs: [
      { question: "What is the BISAP Score?", answer: "The Bedside Index for Severity in Acute Pancreatitis (BISAP) is a 5-point score calculated within the first 24 hours of admission to identify patients at high risk for in-hospital mortality, persistent organ failure, and pancreatic necrosis." },
      { question: "Why choose BISAP over Ranson's Criteria?", answer: "Ranson's Criteria requires 48 hours to complete. BISAP uses 5 easily obtainable parameters within the first 24 hours, allowing immediate ER and ICU triage upon hospital presentation." },
      { question: "What is the clinical cutoff for high risk in BISAP?", answer: "A score of ≥ 3 marks severe pancreatitis with substantial in-hospital mortality (>5–10%) and persistent organ failure, indicating the need for ICU or Step-down admission." }
    ],
    tier0: "Score 0 (< 1% Mortality)",
    tier0Desc: "Very low risk of severe pancreatitis or death (<0.5%). Ward admission with goal-directed fluid resuscitation.",
    tier1: "Score 1 (~1% Mortality)",
    tier1Desc: "Low mortality risk. Floor admission with serial monitoring of vitals and urine output.",
    tier2: "Score 2 (~2% Mortality)",
    tier2Desc: "Moderate risk. Close clinical observation; ensure adequate resuscitation and repeat hematocrit/BUN at 24 hours.",
    tier3: "Score 3 (~5–8% Mortality)",
    tier3Desc: "High risk of severe pancreatitis and organ failure. Strongly recommend Step-down or ICU bed.",
    tier4: "Score 4 (~10–15% Mortality)",
    tier4Desc: "High risk of multi-organ dysfunction. Mandatory ICU admission, invasive monitoring, and contrast CT at 72 hours.",
    tier5: "Score 5 (> 20% Mortality)",
    tier5Desc: "Extreme mortality risk (>22%). Critical care admission, aggressive resuscitation, and early multi-specialty intervention."
  },
  fr: {
    title: "Score BISAP pour la Pancréatite Aiguë",
    subtitle: "Score précoce à 24h prédisant la mortalité hospitalière et la défaillance viscérale",
    bun: "Urée sanguine (BUN) > 25 mg/dL (8,9 mmol/L)",
    impaired: "Altération de la conscience (Glasgow < 15, désorientation ou léthargie)",
    sirs: "SIRS présent (≥ 2 critères de syndrome de réponse inflammatoire systémique)",
    age: "Âge > 60 ans",
    pleural: "Épanchement pleural à l'imagerie (Radio thorax ou scanner)",
    result: "Score BISAP Calculé",
    formula: "Score = B(1) + I(1) + S(1) + A(1) + P(1) [Max : 5]",
    clinicalTitle: "Gravité Clinique et Décision d'Orientation",
    references: "Wu BU, et al. Gut. 2008;57(12):1698-1703. (PMID: 18519429).",
    faqs: [
      { question: "Qu'est-ce que le score BISAP ?", answer: "Le score BISAP (Bedside Index for Severity in Acute Pancreatitis) évalue le risque de mortalité précoce et de défaillance multiviscérale lors des 24 premières heures d'une pancréatite aiguë." },
      { question: "Pourquoi préférer le BISAP à Ranson ?", answer: "Ranson demande 48 heures d'attente. Le score BISAP s'obtient dès l'admission aux urgences avec 5 variables simples." },
      { question: "Quel est le seuil de gravité du BISAP ?", answer: "Un score ≥ 3 définit une pancréatite aiguë sévère avec risque élevé de défaillance persistante, justifiant une admission directe en soins continus ou réanimation." }
    ],
    tier0: "Score 0 (Mortalité < 1%)",
    tier0Desc: "Risque minime de complication grave (<0,5%). Hospitalisation en médecine conventionnelle.",
    tier1: "Score 1 (Mortalité ~1%)",
    tier1Desc: "Faible risque. Surveillance standard et réhydratation IV.",
    tier2: "Score 2 (Mortalité ~2%)",
    tier2Desc: "Risque modéré. Surveillance rapprochée de la diurèse et réévaluation biologique à 24h.",
    tier3: "Score 3 (Mortalité ~5–8%)",
    tier3Desc: "Risque élevé de pancréatite sévère. Orientation recommandée vers unité de surveillance continue ou réanimation.",
    tier4: "Score 4 (Mortalité ~10–15%)",
    tier4Desc: "Défaillance multiviscérale probable. Admission impérative en réanimation.",
    tier5: "Score 5 (Mortalité > 20%)",
    tier5Desc: "Pronostic vital engagé (>22% mortalité). Réanimation intensive spécialisée d'emblée."
  }
};

export default function BisapScore({ lang }: { lang: LangCode }) {
  const [bun, setBun] = useState<boolean>(false);
  const [impaired, setImpaired] = useState<boolean>(false);
  const [sirs, setSirs] = useState<boolean>(false);
  const [age, setAge] = useState<boolean>(false);
  const [pleural, setPleural] = useState<boolean>(false);

  const currentText = translations[lang] || translations.en;

  const score = useMemo(() => {
    let s = 0;
    if (bun) s += 1;
    if (impaired) s += 1;
    if (sirs) s += 1;
    if (age) s += 1;
    if (pleural) s += 1;
    return s;
  }, [bun, impaired, sirs, age, pleural]);

  useEffect(() => {
    trackCalculatorUsage('bisap-score', lang, score);
  }, [score, lang]);

  const riskTier = useMemo(() => {
    if (score === 0) return { label: currentText.tier0, desc: currentText.tier0Desc, badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', bar: 'bg-emerald-500' };
    if (score === 1) return { label: currentText.tier1, desc: currentText.tier1Desc, badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', bar: 'bg-emerald-500' };
    if (score === 2) return { label: currentText.tier2, desc: currentText.tier2Desc, badge: 'bg-amber-50 text-amber-800 border-amber-200', bar: 'bg-amber-500' };
    if (score === 3) return { label: currentText.tier3, desc: currentText.tier3Desc, badge: 'bg-orange-50 text-orange-800 border-orange-200', bar: 'bg-orange-500' };
    if (score === 4) return { label: currentText.tier4, desc: currentText.tier4Desc, badge: 'bg-rose-50 text-rose-800 border-rose-200', bar: 'bg-rose-600' };
    return { label: currentText.tier5, desc: currentText.tier5Desc, badge: 'bg-red-100 text-red-900 border-red-300', bar: 'bg-red-700' };
  }, [score, currentText]);

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/bisap-score"
        scoringSystem="BISAP Pancreatitis Mortality Index"
        howToSteps={[
          lang === 'fr' ? 'Évaluer les 5 critères dans les premières 24 heures de prise en charge.' : 'Assess 5 clinical criteria within the first 24 hours of hospital admission.',
          lang === 'fr' ? 'Cocher : Urée > 25 mg/dL (+1), Altération conscience (+1), SIRS (+1), Âge > 60 (+1), Épanchement pleural (+1).' : 'Check: BUN > 25 mg/dL (+1), Impaired mental status (+1), SIRS (≥2) (+1), Age > 60 (+1), Pleural effusion (+1).',
          lang === 'fr' ? 'Interpréter : Score ≥ 3 indique une pancréatite grave nécessitant des soins intensifs.' : 'Interpret: Score ≥ 3 indicates severe pancreatitis warranting ICU/step-down admission.'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-600 mb-2">
          <Flame className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Gastroentérologie & Urgences' : 'Gastroenterology & Critical Care'}</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
          {currentText.title}
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2">
              {lang === 'fr' ? 'Critères des 24 Premières Heures' : '24-Hour Bedside Criteria'}
            </h2>
            <div className="space-y-3">
              {[
                { label: currentText.bun, val: bun, set: setBun, acronym: "B" },
                { label: currentText.impaired, val: impaired, set: setImpaired, acronym: "I" },
                { label: currentText.sirs, val: sirs, set: setSirs, acronym: "S" },
                { label: currentText.age, val: age, set: setAge, acronym: "A" },
                { label: currentText.pleural, val: pleural, set: setPleural, acronym: "P" }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => item.set(!item.val)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${item.val ? 'bg-rose-50/80 border-rose-500/80 shadow-sm' : 'bg-gray-50/70 border-gray-200 hover:bg-gray-100/60'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-gray-200 text-gray-800 font-extrabold text-xs flex items-center justify-center">
                      {item.acronym}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{item.label}</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gray-200 text-gray-700">+1</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 p-6 md:p-8 relative">
            <div className="absolute top-0 right-0 p-24 bg-gradient-to-bl from-rose-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-5">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block">
                {currentText.result}
              </span>
              
              <div className="flex items-baseline gap-3 tabular-nums">
                <span className={`text-5xl md:text-6xl font-extrabold tracking-tight ${score >= 3 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {score}
                </span>
                <span className="text-xl text-gray-400 font-medium">/ 5 points</span>
              </div>

              <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${riskTier.bar}`} 
                  style={{ width: `${(score / 5) * 100}%` }}
                />
              </div>

              <div className={`p-4 rounded-xl border ${riskTier.badge}`}>
                <div className="font-bold text-sm mb-1">{riskTier.label}</div>
                <p className="text-xs leading-relaxed opacity-90">{riskTier.desc}</p>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "BUN > 25 mg/dL", value: bun ? "Yes (+1)" : "No" },
                  { label: "Impaired Mental Status", value: impaired ? "Yes (+1)" : "No" },
                  { label: "SIRS Criteria", value: sirs ? "Yes (+1)" : "No" },
                  { label: "Age > 60", value: age ? "Yes (+1)" : "No" },
                  { label: "Pleural Effusion", value: pleural ? "Yes (+1)" : "No" }
                ]}
                results={[
                  { label: "BISAP Score", value: score, unit: "/ 5" },
                  { label: "Mortality Category", value: riskTier.label },
                  { label: "Disposition Guidance", value: riskTier.desc }
                ]}
                formula={currentText.formula}
                disclaimer="Calculated within 24h of presentation. Scores >= 3 mandate high-dependency or ICU level of care."
                references="Wu BU, et al. Gut. 2008;57(12):1698-1703."
                lang={lang}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <MedicalReviewerCard reviewer={REVIEWER_INTENSIVIST} />
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900 block mb-1">Foundational Evidence:</span>
          <p className="italic mb-2">{currentText.references}</p>
          <div className="flex flex-wrap gap-4 text-rose-700">
            <a href="https://pubmed.ncbi.nlm.nih.gov/18519429/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Wu BU et al. (2008) Gut <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
