import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown } from 'lucide-react';
import { LangCode, Translations } from '../types';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';
import ClinicalExportButton from '../components/ClinicalExportButton';
import AdsterraNativeBanner from '../components/AdsterraNativeBanner';

const translations: Translations = {
  en: {
    title: "CURB-65 Score",
    subtitle: "Pneumonia severity assessment",
    confusion: "Confusion (New disorientation)",
    urea: "BUN > 19 mg/dL (> 7 mmol/L Urea)",
    rr30: "Respiratory rate ≥ 30/min",
    bp: "Blood pressure: Systolic < 90 OR Diastolic ≤ 60 mmHg",
    age65: "Age ≥ 65 years",
    result: "Calculated Score",
    formula: "1 point per positive criterion",
    clinicalTitle: "Management Strategy",
    clinicalText: "Score 0-1: Low risk (Outpatient care). Score 2: Moderate risk (Consider short hospitalization). Score 3-5: Severe (Hospitalize, possibly ICU).",
    references: "References: Lim WS, et al. Defining community acquired pneumonia severity.",
    low: "Low Risk (0-1)",
    inter: "Intermediate Risk (2)",
    high: "High Risk (3-5)",
    faqQ1: "What does CURB-65 stand for?",
    faqA1: "CURB-65 is an acronym: C = Confusion (new disorientation), U = Urea >7 mmol/L (BUN >19 mg/dL), R = Respiratory rate ≥30/min, B = Blood pressure (Systolic <90 or Diastolic ≤60 mmHg), 65 = Age ≥65 years. Each criterion scores 1 point.",
    faqQ2: "What CURB-65 score requires hospitalization?",
    faqA2: "Score 0-1: Low risk — outpatient management appropriate. Score 2: Intermediate risk — consider short inpatient admission. Score 3-5: High risk — hospitalize, consider ICU admission for score ≥4-5.",
    faqQ3: "What is the source study for CURB-65?",
    faqA3: "CURB-65 was derived by Lim et al. (2003) from British Thoracic Society CAP guideline data, published in Thorax (PMID: 12668799). It has been validated across multiple international CAP cohorts.",
    faqQ4: "What is the difference between CURB-65 and PSI?",
    faqA4: "PSI (PORT score) uses 20 variables for finer risk stratification. CURB-65 uses only 5 criteria and is faster at the bedside. CURB-65 is preferred for rapid triage in emergency settings.",
    pillarTitle: "Clinical Validation, Risk Stratification in Community-Acquired Pneumonia, and Bedside Comparison vs. PSI",
    pillarText: [
      "The CURB-65 severity score was derived and prospectively validated by Lim et al. in 2003 through a multicenter international study across the United Kingdom, New Zealand, and the Netherlands. By refining the British Thoracic Society (BTS) criteria into a simple 6-point scoring system based on five primary clinical parameters (Confusion, Urea, Respiratory rate, Blood pressure, and Age ≥ 65), CURB-65 enables objective 30-day mortality risk stratification for patients presenting with community-acquired pneumonia (CAP).",
      "From a pathophysiological and triage perspective, CURB-65 pinpoints patients who are transitioning from localized pulmonary infection to systemic decompensation. Specifically, new-onset confusion indicates cerebral hypoperfusion or severe hypoxia, while blood urea nitrogen (BUN > 19 mg/dL or urea > 7 mmol/L) reflects microvascular dehydration, catabolism, and early renal involvement. Respiratory tachypnea (≥ 30 breaths/min) and hypotension (systolic < 90 mmHg or diastolic ≤ 60 mmHg) signify impending respiratory exhaustion and distributive vasodilation.",
      "While the Pneumonia Severity Index (PSI/PORT score) evaluates 20 demographic, comorbidity, and laboratory variables to accurately identify very low-risk patients suitable for outpatient management, CURB-65 is significantly faster to calculate at the bedside in emergency departments. For scores of 2, short-term hospitalization or supervised outpatient care is warranted. A score of 3 or higher demands urgent inpatient admission, with immediate assessment for intensive care unit (ICU) transfer and broad-spectrum intravenous antimicrobial coverage."
    ],
  },
  fr: {
    title: "Score CURB-65",
    subtitle: "Évaluation de la sévérité de la pneumonie",
    confusion: "Confusion (Nouvelle désorientation)",
    urea: "Urée > 7 mmol/L (BUN > 19 mg/dL)",
    rr30: "Fréquence respiratoire ≥ 30/min",
    bp: "Pression artérielle: Sys < 90 OU Dia ≤ 60 mmHg",
    age65: "Âge ≥ 65 ans",
    result: "Score Calculé",
    formula: "1 point par critère",
    clinicalTitle: "Stratégie de Prise en charge",
    clinicalText: "Score 0-1: Risque faible (Ambulatoire). Score 2: Modéré (Hospitalisation courte). Score 3-5: Sévère (Hospitaliser, potentiellement en réa).",
    references: "Références: Lim WS, et al. Defining community acquired pneumonia severity.",
    low: "Risque Faible (0-1)",
    inter: "Risque Intermédiaire (2)",
    high: "Risque Élevé (3-5)",
    faqQ1: "Que signifie CURB-65 ?",
    faqA1: "CURB-65 est un acronyme : C = Confusion (nouvelle désorientation), U = Urée > 7 mmol/L (BUN > 19 mg/dL), R = Fréquence respiratoire (Respiratory rate) ≥ 30/min, B = Pression artérielle (Blood pressure) (Systolique < 90 ou Diastolic ≤ 60 mmHg), 65 = Âge ≥ 65 ans. Chaque critère positif vaut 1 point.",
    faqQ2: "Quel score CURB-65 nécessite une hospitalisation ?",
    faqA2: "Score 0-1 : Risque faible — traitement ambulatoire approprié. Score 2 : Risque modéré — envisager une hospitalisation de courte durée. Score 3-5 : Risque élevé — hospitalisation impérative, envisager les soins intensifs si le score est ≥ 4-5.",
    faqQ3: "Quelle est l'étude source du score CURB-65 ?",
    faqA3: "Le score CURB-65 a été établi par Lim et al. (2003) à partir des données de recommandations de la British Thoracic Society, et publié dans Thorax (PMID: 12668799). Il est largement validé au niveau international.",
    faqQ4: "Quelle est la différence entre le CURB-65 et l'indice PSI (PORT) ?",
    faqA4: "L'indice PSI utilise 20 variables et s'avère plus complexe mais précis pour identifier les patients à très faible risque. Le CURB-65 utilise seulement 5 critères cliniques simples, ce qui le rend beaucoup plus rapide et adapté au triage en urgence.",
    pillarTitle: "Validation Clinique, Stratification du Risque dans la PAC et Comparaison avec l'Indice PSI",
    pillarText: [
      "Le score de sévérité CURB-65 a été dérivé et validé prospectivement par Lim et al. en 2003 lors d'une étude multicentrique internationale menée au Royaume-Uni, en Nouvelle-Zélande et aux Pays-Bas. En simplifiant les critères de la British Thoracic Society (BTS) en un score sur 5 points basé sur cinq paramètres cliniques clés (Confusion, Urée, Fréquence respiratoire, Pression artérielle et Âge ≥ 65 ans), le CURB-65 permet d'évaluer objectivement le risque de mortalité à 30 jours chez les patients atteints de pneumonie aiguë communautaire (PAC).",
      "Sur le plan physiopathologique et du triage, le CURB-65 identifie les patients évoluant d'une infection pulmonaire localisée vers une décompensation systémique. Une confusion récente traduit une hypoperfusion cérébrale ou une hypoxémie sévère, tandis qu'une urée sanguine élevée (> 7 mmol/L) indique une déshydratation, un catabolisme accru ou une souffrance rénale débutante. Une tachypnée (≥ 30/min) et une hypotension signent un épuisement respiratoire et un collapsus vasculaire imminent.",
      "Alors que l'indice de sévérité de la pneumonie (PSI/score PORT) évalue 20 variables pour identifier avec précision les patients à très faible risque éligibles à un suivi ambulatoire, le CURB-65 s'avère beaucoup plus rapide à calculer aux urgences. Un score de 2 justifie une hospitalisation courte ou une surveillance ambulatoire étroite. Un score ≥ 3 impose une admission immédiate en milieu hospitalier avec évaluation urgente pour une prise en charge en réanimation."
    ],
  }
};

const criteriaList = [
  { key: 'confusion' },
  { key: 'urea' },
  { key: 'rr30' },
  { key: 'bp' },
  { key: 'age65' }
] as const;

export default function Curb65Score({ lang }: { lang: LangCode }) {
  const [selections, setSelections] = useState<Record<string, boolean>>({});

  const currentText = translations[lang];
  const isRtl = false;

  const toggleSelection = (key: string) => {
    setSelections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const scoreValue = useMemo(() => {
    return criteriaList.reduce((acc, item) => {
      return acc + (selections[item.key] ? 1 : 0);
    }, 0);
  }, [selections]);

  useEffect(() => {
    if (scoreValue > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('curb65-score', lang, scoreValue);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [scoreValue, lang]);

  const getCategory = (val: number) => {
    if (val <= 1) return { label: currentText.low, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    if (val === 2) return { label: currentText.inter, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' };
    return { label: currentText.high, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' };
  };

  const category = getCategory(scoreValue);

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
            <div className="space-y-4">
              
              {criteriaList.map(item => (
                <div 
                  key={item.key}
                  onClick={() => toggleSelection(item.key)}
                  className={`p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-all flex items-start gap-4 ${selections[item.key] ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500/30' : 'border-gray-200'}`}
                >
                  <div className={`mt-0.5 shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${selections[item.key] ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'}`}>
                    {selections[item.key] && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.6667 3.5L5.25001 9.91667L2.33334 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 flex justify-between gap-4 pt-0.5">
                    <span className={`text-base font-medium ${selections[item.key] ? 'text-gray-900' : 'text-gray-700'}`}>
                      {currentText[item.key]}
                    </span>
                  </div>
                </div>
              ))}

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
                  {scoreValue}
                </span>
                <span className="text-xl font-medium text-gray-400">/ 5</span>
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
                  { label: currentText.confusion, value: selections.confusion ? 'Yes (1)' : 'No (0)' },
                  { label: currentText.urea, value: selections.urea ? 'Yes (1)' : 'No (0)' },
                  { label: currentText.rr30, value: selections.rr30 ? 'Yes (1)' : 'No (0)' },
                  { label: currentText.bp, value: selections.bp ? 'Yes (1)' : 'No (0)' },
                  { label: currentText.age65, value: selections.age65 ? 'Yes (1)' : 'No (0)' }
                ]}
                results={[
                  { label: currentText.result, value: `${scoreValue} / 5` },
                  { label: 'Risk Stratification', value: category.label }
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
              <a href="https://pubmed.ncbi.nlm.nih.gov/12668799/" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Lim et al., Thorax 2003 — CURB-65 derivation (PMID: 12668799) →</a>
            </div>
          </div>
        </div>
      </div>

      <AdsterraNativeBanner refreshDependency={scoreValue} />

      {/* Pillar Content Section */}
      <div className="mt-8 pt-10 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{currentText.pillarTitle}</h2>
        <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
          {currentText.pillarText?.map((paragraph: string, idx: number) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{layoutTranslations[lang].seeAlso}</h2>
        <div className="flex flex-wrap gap-2 mb-10">
          {[
            { label: 'qSOFA Score', path: '/qsofa-score' },
            { label: 'SIRS Criteria', path: '/sirs-criteria' },
            { label: 'ANC Calculator', path: '/anc-calculator' },
            { label: 'MAP Calculator', path: '/map-calculator' },
          ].map(({ label, path }) => {
            const prefix = lang === 'en' ? '' : `/${lang}`;
            return (
              <a key={path} href={`${prefix}${path}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-lg text-sm font-medium transition-colors border border-gray-200 hover:border-blue-200">
                {label}
              </a>
            );
          })}
        </div>
      </div>

      <div className="mt-0 pt-0 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{layoutTranslations[lang].faqTitle}</h2>
        <div className="space-y-3">
          {[
            { q: currentText.faqQ1, a: currentText.faqA1 },
            { q: currentText.faqQ2, a: currentText.faqA2 },
            { q: currentText.faqQ3, a: currentText.faqA3 },
            { q: currentText.faqQ4, a: currentText.faqA4 },
          ].map(({ q, a }) => (
            <details key={q} className="group border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                <span className="text-sm">{q}</span>
                <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-3 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}
