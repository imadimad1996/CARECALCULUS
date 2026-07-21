import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import CalculatorInput from '../components/ui/CalculatorInput';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_INTENSIVIST } from '../data/reviewers';
import { trackCalculatorUsage } from '../utils/telemetry';
import { layoutTranslations } from '../utils/lang';
import MobileResultDock from '../components/ui/MobileResultDock';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd, generateMedicalCalculatorSchema } from '../components/JsonLd';

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
    clinicalTitle: "Clinical Interventions & Autoregulation",
    clinicalText: "A MAP of at least 65 mmHg is critical to maintain vital organ perfusion in septic shock or acute conditions. Clinical Pearl: Patients with chronic uncontrolled hypertension may require a higher target (75-85 mmHg) to avoid acute kidney injury (AKI), as their renal autoregulatory curve is shifted to the right.",
    pillarTitle: "Clinical Evidence & Pathophysiology of MAP",
    pillarText: [
      "Mean Arterial Pressure (MAP) is the primary driving force for tissue perfusion, making it a more critical hemodynamic target than systolic blood pressure alone, particularly in critically ill patients. The physiological rationale stems from the cardiac cycle: diastole accounts for approximately two-thirds of the cycle duration at normal heart rates. Therefore, the MAP formula heavily weights the diastolic blood pressure.",
      "In states of distributive shock, such as sepsis, profound vasodilation leads to a precipitous drop in systemic vascular resistance (SVR) and consequently MAP. The Surviving Sepsis Campaign guidelines strongly recommend a target MAP of ≥ 65 mmHg for initial resuscitation. Maintaining MAP above this threshold ensures adequate autoregulation of blood flow to vital organs, including the brain, kidneys, and splanchnic bed. Prolonged hypotension below this autoregulatory threshold is directly associated with acute kidney injury (AKI), myocardial ischemia, and increased mortality.",
      "However, individualizing the MAP target is increasingly recognized. In patients with chronic uncontrolled hypertension, a higher MAP target (e.g., 75-85 mmHg) may be necessary to maintain renal perfusion, as their autoregulatory curve is shifted to the right. Conversely, in acute hemorrhagic shock without traumatic brain injury, permissive hypotension (targeting a lower MAP, e.g., 50-60 mmHg) is often employed to minimize blood loss while maintaining basic perfusion until surgical control of bleeding is achieved."
    ],
    references: "Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2021. Intensive Care Med. 2021;47(11):1181-1247 (PMID: 34657111). American Heart Association (AHA) Guidelines for Cardiopulmonary Resuscitation.",
    faqQ1: "What is Mean Arterial Pressure (MAP)?",
    faqA1: "Mean Arterial Pressure (MAP) is the average arterial pressure throughout one cardiac cycle. It reflects the average perfusion pressure driving blood to organs and is calculated as: MAP = DBP + 1/3 × (SBP − DBP).",
    faqQ2: "What MAP value indicates adequate organ perfusion?",
    faqA2: "A MAP of at least 65 mmHg is the widely accepted minimum threshold for adequate perfusion of vital organs, particularly in septic shock. Resuscitation targeting ≥65 mmHg significantly reduces acute kidney injury (AKI) risks, as validated by the Surviving Sepsis Campaign (PMID: 34657111).",
    faqQ3: "When should I use the MAP calculator?",
    faqA3: "Use the MAP calculator in ICU, ER, or any acute care setting — septic shock resuscitation, vasopressor titration, hypertensive emergencies, and post-operative hemodynamic monitoring.",
    faqQ4: "What is the difference between MAP and systolic blood pressure?",
    faqA4: "Systolic BP is the peak pressure during ventricular contraction. MAP accounts for the entire cardiac cycle and better reflects tissue perfusion because diastole occupies approximately 2/3 of the cycle.",
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
    clinicalTitle: "Interventions Cliniques & Autorégulation",
    clinicalText: "Une PAM d'au moins 65 mmHg est indispensable pour assurer la perfusion des organes cibles en cas de choc septique. Note clinique : Les patients souffrant d'hypertension chronique non contrôlée peuvent nécessiter une cible plus élevée (75-85 mmHg) pour éviter l'insuffisance rénale aiguë (IRA), leur courbe d'autorégulation rénale étant décalée vers la droite.",
    pillarTitle: "Preuves Cliniques et Physiopathologie de la PAM",
    pillarText: [
      "La pression artérielle moyenne (PAM) est la principale force motrice de la perfusion tissulaire, ce qui en fait une cible hémodynamique plus critique que la pression artérielle systolique seule, en particulier chez les patients en état critique. La justification physiologique découle du cycle cardiaque : la diastole représente environ les deux tiers de la durée du cycle à des fréquences cardiaques normales. Par conséquent, la formule de la PAM accorde une pondération importante à la pression artérielle diastolique.",
      "Dans les états de choc distributif, tels que la septicémie, une vasodilatation profonde entraîne une chute précipitée des résistances vasculaires systémiques (RVS) et, par conséquent, de la PAM. Les directives de la Surviving Sepsis Campaign recommandent fortement une PAM cible ≥ 65 mmHg pour la réanimation initiale. Le maintien de la PAM au-dessus de ce seuil garantit une autorégulation adéquate du flux sanguin vers les organes vitaux, notamment le cerveau, les reins et le lit splanchnique. Une hypotension prolongée en dessous de ce seuil d'autorégulation est directement associée à une insuffisance rénale aiguë (IRA), une ischémie myocardique et une mortalité accrue.",
      "Cependant, l'individualisation de la cible de la PAM est de plus en plus reconnue. Chez les patients souffrant d'hypertension chronique non contrôlée, une cible de PAM plus élevée (par exemple, 75-85 mmHg) peut être nécessaire pour maintenir la perfusion rénale, car leur courbe d'autorégulation est déplacée vers la droite. À l'inverse, dans le choc hémorragique aigu sans traumatisme crânien, une hypotension permissive (ciblant une PAM plus faible, par exemple, 50-60 mmHg) est souvent utilisée pour minimiser la perte de sang tout en maintenant une perfusion de base jusqu'à ce que le contrôle chirurgical du saignement soit obtenu."
    ],
    references: "Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2021. Intensive Care Med. 2021;47(11):1181-1247 (PMID: 34657111). American Heart Association (AHA) Guidelines.",
    faqQ1: "Qu'est-ce que la pression artérielle moyenne (PAM) ?",
    faqA1: "La pression artérielle moyenne (PAM) est la pression moyenne dans les artères d'un patient pendant un cycle cardiaque complet. Elle reflète la pression de perfusion des organes et se calcule ainsi : PAM = PAD + 1/3 × (PAS − PAD).",
    faqQ2: "Quelle valeur de PAM indique une perfusion d'organe adéquate ?",
    faqA2: "Une PAM d'au moins 65 mmHg est le seuil minimal généralement accepté pour assurer une perfusion adéquate des organes vitaux. Le maintien de la PAM ≥65 mmHg réduit significativement le risque d'insuffisance rénale aiguë (IRA) selon la Surviving Sepsis Campaign (PMID: 34657111).",
    faqQ3: "Quand dois-je utiliser le calculateur de PAM ?",
    faqA3: "Utilisez le calculateur de PAM en réanimation, aux urgences ou dans tout service de soins critiques : réanimation de choc septique, titration des vasopresseurs, urgences hypertensives et surveillance hémodynamique postopératoire.",
    faqQ4: "Quelle est la différence entre la PAM et la pression artérielle systolique ?",
    faqA4: "La pression artérielle systolique (PAS) est la pression maximale pendant la contraction ventriculaire. La PAM prend en compte l'ensemble du cycle cardiaque et reflète mieux la perfusion tissulaire car la diastole occupe environ les 2/3 du cycle.",
  }
};

export default function MapCalculator({ lang }: { lang: LangCode }) {
  const [sys, setSys] = useState<number>(120);
  const [dia, setDia] = useState<number>(80);
  const [copied, setCopied] = useState(false);

  const currentText = translations[lang];
  const isRtl = false;

  const mapValue = useMemo(() => {
    if (sys <= 0 || dia <= 0 || sys < dia) return 0;
    const computed = dia + (1 / 3) * (sys - dia);
    return parseFloat(computed.toFixed(1));
  }, [sys, dia]);

  const mapValueIsNormal = mapValue >= 65;

  useEffect(() => {
    if (mapValue > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('map-calculator', lang, mapValue);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [mapValue, lang]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`MAP: ${mapValue} mmHg (${mapValue >= 65 ? currentText.normal : currentText.low})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <JsonLd data={generateMedicalCalculatorSchema(currentText.title, currentText.subtitle)} />
      <div className="max-w-3xl mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="map-calculator" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3">
          {currentText.subtitle}
        </p>

        {/* GEO Definition Block - 40-60 words for AI extraction */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 md:p-5 mt-6 mb-2">
          <h2 className="text-sm font-semibold text-blue-900 mb-2 uppercase tracking-wide">
            {lang === 'fr' ? 'Définition Clinique' : 'Clinical Definition'}
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            {currentText.faqA1}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-gray-950/5 p-6 md:p-8">
            <div className="space-y-8">
              <CalculatorInput
                label={currentText.systolic}
                unit="mmHg"
                value={sys}
                min={40}
                max={260}
                placeholder="120"
                onChange={setSys}
              />

              <CalculatorInput
                label={currentText.diastolic}
                unit="mmHg"
                value={dia}
                min={20}
                max={180}
                placeholder="80"
                onChange={setDia}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky top-28 bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 flex flex-col justify-between p-8 min-h-[320px]">
            <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex items-start justify-between">
              <div>
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
              
              {mapValue > 0 && (
                <button
                  onClick={handleCopy}
                  className="mt-2 p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors border border-gray-700/50 flex items-center justify-center text-gray-300 hover:text-white"
                  title="Copy Result"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                </button>
              )}
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

                    {/* Reciprocity Prompt */}
                    <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm flex flex-col sm:flex-row items-center justify-between gap-3 transition-all">
                      <div className="font-medium text-center sm:text-left">
                        {lang === 'en' ? 'Did this save you time? Bookmark us or share with a colleague!' : 
                         lang === 'fr' ? 'Cela vous a-t-il fait gagner du temps ? Partagez avec un collègue !' :
                         'هل وفر هذا من وقتك؟ شاركها مع زملائك!'}
                      </div>
                    </div>
                  </>
                )}
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
              <a href="https://pubmed.ncbi.nlm.nih.gov/26253338/" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Singer et al., JAMA 2016 (Sepsis-3) →</a>
            </div>
          </div>

        </div>
      </div>
      
      {/* In-Content Native Ad */}

      {/* Pillar Content Section */}
      <div className="mt-8 pt-10 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{currentText.pillarTitle}</h2>
        <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
          {currentText.pillarText.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
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

      {/* E-E-A-T Trust Signal — Physician Reviewer Card */}
      <MedicalReviewerCard reviewer={REVIEWER_INTENSIVIST} lang={lang} />
      <MobileResultDock
        value={mapValue > 0 ? mapValue : '--'}
        unit="mmHg"
        label={currentText.result}
        status={mapValue >= 65 ? currentText.normal : currentText.low}
        statusColor={mapValue >= 65 ? 'emerald' : 'red'}
        copied={copied}
        onCopy={handleCopy}
        isVisible={mapValue > 0}
      />
    </>
  );
}
