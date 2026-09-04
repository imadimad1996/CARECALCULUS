import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, Wind, HeartPulse, ShieldCheck, Stethoscope, ChevronRight, AlertTriangle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LangCode, Translations } from '../types';
import { layoutTranslations, buildPath } from '../utils/lang';
import { trackCalculatorUsage, trackCalculatorResult } from '../utils/telemetry';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_INTENSIVIST } from '../data/reviewers';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';

const translations: Translations = {
  en: {
    title: "P/F Ratio (PaO2/FiO2) — ARDS Berlin Criteria",
    subtitle: "Calculate Carrico index and stratify Acute Respiratory Distress Syndrome severity",
    pao2: "PaO2 (Arterial Oxygen Tension)",
    pao2Sub: "mmHg (from arterial blood gas)",
    fio2: "FiO2 (Fraction of Inspired Oxygen)",
    fio2Sub: "% or decimal (e.g. 40% or 0.40)",
    result: "Calculated P/F Ratio",
    formula: "P/F Ratio = PaO2 (mmHg) / (FiO2 / 100)",
    normal: "Normal Oxygenation",
    normalSub: "≥ 300 mmHg",
    mild: "Mild ARDS",
    mildSub: "201 - 300 mmHg (with PEEP ≥ 5)",
    moderate: "Moderate ARDS",
    moderateSub: "101 - 200 mmHg (with PEEP ≥ 5)",
    severe: "Severe ARDS",
    severeSub: "≤ 100 mmHg (with PEEP ≥ 5)",
    clinicalTitle: "Berlin Definition of ARDS & Oxygenation Cutoffs",
    clinicalText: "According to the Berlin Definition (JAMA 2012), ARDS requires acute onset within 1 week, bilateral chest opacities not fully explained by heart failure, and hypoxemia with PEEP ≥ 5 cmH2O. Severe ARDS (P/F ≤ 100) carries ~45% ICU mortality and strongly favors prone positioning and lung-protective ventilation.",
    pillarTitle: "Clinical Evidence & Pathophysiology of the P/F Ratio",
    pillarText: [
      "The PaO2/FiO2 ratio (Carrico Index) is the bedside clinical standard for assessing the degree of pulmonary shunt and alveolar-capillary barrier disruption in critically ill patients. At sea level with normal lung architecture breathing room air (PaO2 ~95 mmHg, FiO2 0.21), the physiological P/F ratio exceeds 450 mmHg.",
      "In acute lung injury and ARDS, diffuse alveolar damage, microvascular thrombosis, and proteinaceous fluid flooding lead to severe ventilation-perfusion (V/Q) mismatch and true intrapulmonary right-to-left shunt. Because shunted blood bypasses ventilated alveoli, increasing supplemental FiO2 produces diminished arterial PaO2 gains, causing the P/F ratio to precipitously drop.",
      "Under the Berlin Definition, severity stratification requires a minimum positive end-expiratory pressure (PEEP) or continuous positive airway pressure (CPAP) of at least 5 cmH2O. Patients with moderate-to-severe ARDS (P/F < 150 mmHg) demonstrate significant 28-day and 90-day mortality reductions when managed with early prone positioning (PROSEVA trial, NEJM 2013) and neuromuscular blockade in early ventilator dyssynchrony."
    ],
    references: "ARDS Definition Task Force, Ranieri VM, Rubenfeld GD, et al. Acute respiratory distress syndrome: the Berlin Definition. JAMA. 2012;307(23):2526-2533. (PMID: 22797452 / DOI: 10.1001/jama.2012.5669). Guérin C, et al. Prone positioning in severe acute respiratory distress syndrome (PROSEVA). N Engl J Med. 2013;368(23):2159-2168. (PMID: 23688302).",
    faqs: [
      { question: "What is the P/F Ratio (PaO2/FiO2)?", answer: "The P/F ratio (Carrico index) is the ratio of arterial oxygen partial pressure (PaO2 from an ABG in mmHg) to the fractional concentration of inspired oxygen (FiO2 as a decimal). It quantifies the efficiency of arterial oxygenation and alveolar gas exchange." },
      { question: "What is a normal P/F ratio?", answer: "A normal P/F ratio is > 400–500 mmHg. For example, a healthy patient breathing room air (FiO2 0.21) with a PaO2 of 95 mmHg has a P/F ratio of 95 / 0.21 ≈ 452 mmHg." },
      { question: "How does the Berlin Definition classify ARDS severity?", answer: "Under the Berlin Criteria with PEEP ≥ 5 cmH2O: Mild ARDS is P/F 201–300 mmHg; Moderate ARDS is P/F 101–200 mmHg; Severe ARDS is P/F ≤ 100 mmHg." },
      { question: "What are the key interventions for severe ARDS (P/F ≤ 150)?", answer: "Evidence-based interventions include: (1) Lung-protective ventilation targeting 6 mL/kg predicted body weight (PBW) with plateau pressure <30 cmH2O; (2) Prone positioning for ≥16 hours/day (PROSEVA trial); (3) High PEEP strategy based on ARDSNet titration tables; (4) Consideration of VV-ECMO for refractory hypoxemia (CESAR and EOLIA trials)." }
    ],
    howToSteps: [
      "Obtain an arterial blood gas (ABG) and record the PaO2 in mmHg.",
      "Record the current fraction of inspired oxygen (FiO2) from the ventilator or oxygen delivery device (e.g., 40% or 0.40).",
      "Input both values into the calculator to compute the PaO2/FiO2 ratio.",
      "Check the patient's PEEP setting (must be ≥5 cmH2O for official Berlin staging).",
      "Review the color-coded ARDS category and initiate lung-protective ventilation if indicated."
    ],
    nextStepsTitle: "Clinical Next Steps & Protocol Alignment",
    nextStepsARDS: "Initiate lung-protective ventilation: Target 6 mL/kg Predicted Body Weight (PBW) and Driving Pressure <15 cmH2O. For P/F < 150, initiate prone positioning.",
    linkTidalVolume: "ARDSNet 6 mL/kg PBW Ventilation",
    linkAaGradient: "A-a Gradient & Shunt Calculation",
  },
  fr: {
    title: "Calcul Rapport PaO2/FiO2 (P/F Ratio) — Sévérité SDRA Berlin",
    subtitle: "Calculez l'index de Carrico et stratifiez la sévérité du SDRA selon les critères de Berlin",
    pao2: "PaO2 (Pression Artérielle en Oxygène)",
    pao2Sub: "mmHg (mesurée sur gazométrie artérielle)",
    fio2: "FiO2 (Fraction Inspirée en Oxygène)",
    fio2Sub: "% ou décimal (ex: 40% ou 0,40)",
    result: "Rapport PaO2/FiO2 Calculé",
    formula: "Rapport P/F = PaO2 (mmHg) / (FiO2 / 100)",
    normal: "Oxygénation Normale",
    normalSub: "≥ 300 mmHg",
    mild: "SDRA Léger",
    mildSub: "201 - 300 mmHg (avec PEP ≥ 5)",
    moderate: "SDRA Modéré",
    moderateSub: "101 - 200 mmHg (avec PEP ≥ 5)",
    severe: "SDRA Sévère",
    severeSub: "≤ 100 mmHg (avec PEP ≥ 5)",
    clinicalTitle: "Définition de Berlin du SDRA & Seuils Pronostiques",
    clinicalText: "Selon la définition de Berlin (JAMA 2012), le diagnostic de SDRA nécessite une apparition aiguë (<7 jours), des opacités alvéolaires bilatérales non entièrement expliquées par une insuffisance cardiaque, et une hypoxémie avec PEP ≥ 5 cmH2O. Le SDRA sévère (P/F ≤ 100) est associé à une mortalité de ~45% et impose le décubitus ventral précoce.",
    pillarTitle: "Physiopathologie & Recommandations Cliniques du Rapport P/F",
    pillarText: [
      "Le rapport PaO2/FiO2 (index de Carrico) est l'étalon-or bedside pour évaluer l'intensité du shunt pulmonaire et la défaillance de la membrane alvéolo-capillaire chez le patient en soins critiques. À l'air ambiant (FiO2 0,21) chez un sujet sain (PaO2 ~95 mmHg), le rapport P/F physiologique dépasse 450 mmHg.",
      "Au cours du SDRA, l'œdème lésionnel riche en protéines et les atélectasies massives entraînent un effet shunt majeur. Le sang perfusant les territoires non ventilés n'étant plus oxygéné, l'augmentation de la FiO2 délivrée n'améliore que faiblement la PaO2, provoquant une chute brutale du rapport P/F.",
      "Selon les critères de Berlin, la stratification nécessite une pression expiratoire positive (PEP) d'au moins 5 cmH2O. Chez les patients présentant un SDRA modéré à sévère (P/F < 150 mmHg), l'application précoce de séances de décubitus ventral (≥16 heures consécutives, étude PROSEVA, NEJM 2013) réduit significativement la mortalité à J28 et J90."
    ],
    references: "ARDS Definition Task Force, Ranieri VM, Rubenfeld GD, et al. Acute respiratory distress syndrome: the Berlin Definition. JAMA. 2012;307(23):2526-2533. (PMID: 22797452 / DOI: 10.1001/jama.2012.5669). Recommandations d'experts SFAR/SRLF : Prise en charge du SDRA en réanimation.",
    faqs: [
      { question: "Qu'est-ce que le rapport PaO2/FiO2 (P/F Ratio) ?", answer: "Le rapport P/F (index de Carrico) est le quotient entre la pression partielle d'oxygène dans le sang artériel (PaO2 en mmHg mesurée par gaz du sang) et la fraction inspirée en oxygène (FiO2 sous forme décimale). Il évalue directement l'efficacité des échanges gazeux alvéolaires." },
      { question: "Quelle est la valeur normale du rapport P/F ?", answer: "La valeur physiologique normale est > 400–500 mmHg. Par exemple, à l'air ambiant (FiO2 0,21) avec une PaO2 de 95 mmHg, le rapport P/F est de 95 / 0,21 ≈ 452 mmHg." },
      { question: "Comment la classification de Berlin définit-elle les stades du SDRA ?", answer: "Avec une PEP ≥ 5 cmH2O : SDRA léger pour un rapport P/F entre 201 et 300 mmHg ; SDRA modéré entre 101 et 200 mmHg ; SDRA sévère pour un rapport P/F ≤ 100 mmHg." },
      { question: "Quelles sont les thérapeutiques recommandées en cas de SDRA sévère (P/F ≤ 150) ?", answer: "Les piliers thérapeutiques validés sont : (1) Ventilation protectrice avec volume courant à 6 mL/kg de poids prédit (PBW) et pression motrice (driving pressure) <15 cmH2O ; (2) Décubitus ventral précoce et prolongé (≥16h/jour) ; (3) Curarisation précoce en cas d'asynchronies majeures ; (4) Évaluation pour ECMO veino-veineuse en cas d'hypoxémie réfractaire." }
    ],
    howToSteps: [
      "Réalisez une gazométrie artérielle et relevez la PaO2 en mmHg.",
      "Relevez la fraction inspirée en oxygène (FiO2) réglée sur le respirateur ou le dispositif d'oxygénothérapie (ex: 40% ou 0,40).",
      "Saisissez ces deux valeurs dans le calculateur pour obtenir le rapport PaO2/FiO2.",
      "Vérifiez le niveau de PEP (doit être ≥5 cmH2O pour valider le stade de Berlin).",
      "Consultez la catégorie de sévérité et appliquez le protocole de ventilation protectrice adapté."
    ],
    nextStepsTitle: "Conduite à Tenir Clinique",
    nextStepsARDS: "Appliquer la ventilation protectrice ARDSNet : Cible de 6 mL/kg de Poids Idéal Prédit (PBW) et Pression de Plateau <30 cmH2O. Si P/F < 150, initier le décubitus ventral.",
    linkTidalVolume: "Volume Courant Protecteur ARDSNet",
    linkAaGradient: "Gradient Alvéolo-Artériel (A-a)",
  }
};

export default function PfRatio({ lang }: { lang: LangCode }) {
  const [pao2, setPao2] = useState<number | ''>(90);
  const [fio2, setFio2] = useState<number | ''>(21);

  const currentText = translations[lang] || translations.en;
  const isRtl = false;

  const pfRatio = useMemo(() => {
    if (pao2 === '' || fio2 === '' || fio2 <= 0) return null;
    const decimalFio2 = fio2 > 1.0 ? fio2 / 100 : fio2;
    return Math.round(pao2 / decimalFio2);
  }, [pao2, fio2]);

  const getCategory = (val: number) => {
    if (val >= 300) return { label: currentText.normal, sub: currentText.normalSub, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    if (val > 200) return { label: currentText.mild, sub: currentText.mildSub, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' };
    if (val > 100) return { label: currentText.moderate, sub: currentText.moderateSub, color: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/20' };
    return { label: currentText.severe, sub: currentText.severeSub, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' };
  };

  const category = pfRatio !== null ? getCategory(pfRatio) : null;

  useEffect(() => {
    if (pfRatio !== null && pfRatio > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('pf-ratio', lang, pfRatio);
        if (category) {
          trackCalculatorResult('pf-ratio', pfRatio, category.label, lang);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [pfRatio, lang, category]);

  return (
    <>
      <CalcPageSchemas 
        name={currentText.title}
        description={currentText.subtitle}
        path={`/${lang === 'en' ? '' : lang + '/'}pf-ratio`}
        scoringSystem="Berlin ARDS Definition (PaO2/FiO2)"
        faqs={currentText.faqs}
        howToSteps={currentText.howToSteps}
      />

      <div className="w-full max-w-full max-w-3xl mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="pf-ratio" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3">
          {currentText.subtitle}
        </p>

        {/* GEO Definition Block for AI extraction */}
        <div className="mt-4 p-4 rounded-xl bg-teal-50/80 border border-teal-200/70 text-xs text-teal-900 leading-relaxed font-sans">
          <strong className="font-semibold text-teal-950">Clinical Definition (Berlin ARDS Criteria): </strong>
          The PaO2/FiO2 ratio (Carrico Index) quantifies the severity of arterial hypoxemia and intrapulmonary shunt in Acute Respiratory Distress Syndrome. Validated with PEEP ≥ 5 cmH2O, cutoffs are: Mild ARDS (201–300 mmHg), Moderate ARDS (101–200 mmHg), and Severe ARDS (≤ 100 mmHg).
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-gray-950/5 p-6 md:p-8">
            <div className="space-y-6">
              
              <div className="group">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{currentText.pao2}</label>
                  <span className="text-xs text-gray-400">{currentText.pao2Sub}</span>
                </div>
                <input
                  type="number" inputMode="decimal"
                  value={pao2}
                  onChange={(e) => setPao2(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-600/10 focus:border-teal-600 text-2xl font-semibold text-gray-900"
                />
              </div>
              
              <div className="group">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{currentText.fio2}</label>
                  <span className="text-xs text-gray-400">{currentText.fio2Sub}</span>
                </div>
                <input
                  type="number" inputMode="decimal"
                  value={fio2}
                  min="21"
                  max="100"
                  onChange={(e) => setFio2(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-600/10 focus:border-teal-600 text-2xl font-semibold text-gray-900"
                />
              </div>

            </div>
          </div>

          {/* Berlin Criteria Reference Rubric Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              {lang === 'fr' ? 'Grille des Stades de Sévérité (Berlin 2012)' : 'ARDS Severity Rubric (Berlin 2012)'}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="pb-2">{lang === 'fr' ? 'Stade' : 'Stage'}</th>
                    <th className="pb-2">{lang === 'fr' ? 'Seuil PaO2/FiO2' : 'P/F Threshold'}</th>
                    <th className="pb-2">{lang === 'fr' ? 'Condition PEP' : 'PEEP Requirement'}</th>
                    <th className="pb-2">{lang === 'fr' ? 'Mortalité' : 'Mortality'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  <tr>
                    <td className="py-2.5 font-bold text-emerald-600">{lang === 'fr' ? 'Normal' : 'Normal'}</td>
                    <td className="py-2.5">&gt; 300 mmHg</td>
                    <td className="py-2.5">—</td>
                    <td className="py-2.5">Baseline</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-amber-600">{lang === 'fr' ? 'SDRA Léger' : 'Mild ARDS'}</td>
                    <td className="py-2.5">201 – 300 mmHg</td>
                    <td className="py-2.5">≥ 5 cmH2O (VNI / invasive)</td>
                    <td className="py-2.5">~27%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-orange-600">{lang === 'fr' ? 'SDRA Modéré' : 'Moderate ARDS'}</td>
                    <td className="py-2.5">101 – 200 mmHg</td>
                    <td className="py-2.5">≥ 5 cmH2O (invasive)</td>
                    <td className="py-2.5">~32%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-red-600">{lang === 'fr' ? 'SDRA Sévère' : 'Severe ARDS'}</td>
                    <td className="py-2.5">≤ 100 mmHg</td>
                    <td className="py-2.5">≥ 5 cmH2O (invasive)</td>
                    <td className="py-2.5">~45%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky bottom-4 z-40 lg:top-28 lg:bottom-auto bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 flex flex-col justify-between p-5 lg:p-8 lg:min-h-[340px]">
            <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-teal-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                {currentText.result}
              </span>
              
              <div className="flex items-baseline gap-2 tabular-nums">
                <span className="text-7xl font-bold tracking-tighter transition-all duration-300">
                  {pfRatio !== null ? pfRatio : '--'}
                </span>
                <span className="text-xl font-medium text-gray-400">mmHg</span>
              </div>
            </div>

            {category && (
              <div className="relative z-10 mt-6">
                <div className={`p-4 rounded-xl border flex justify-between items-center transition-all ${category.bg} ${category.color}`}>
                  <div>
                    <div className="font-bold text-sm">
                      {category.label}
                    </div>
                    <div className="text-xs opacity-80 mt-0.5">
                      {category.sub}
                    </div>
                  </div>
                </div>

                <ClinicalExportButton
                  title={currentText.title}
                  inputs={[
                    { label: currentText.pao2, value: `${pao2} mmHg` },
                    { label: currentText.fio2, value: `${fio2} %` }
                  ]}
                  results={[
                    { label: currentText.result, value: pfRatio !== null ? pfRatio : 0, unit: 'mmHg' },
                    { label: 'ARDS Severity Stage', value: category.label }
                  ]}
                  formula={currentText.formula}
                  disclaimer={currentText.clinicalText}
                  references={currentText.references}
                  lang={lang}
                />

                {/* Clinical Next Steps */}
                <div className="mt-4 p-4 rounded-xl border border-teal-500/20 bg-teal-500/10">
                  <h4 className="text-[10px] font-bold text-teal-400 uppercase tracking-wider mb-1.5">{currentText.nextStepsTitle}</h4>
                  <p className="text-xs text-gray-300 mb-3">{currentText.nextStepsARDS}</p>
                  <div className="flex flex-wrap gap-2">
                    <Link to={buildPath('/tidal-volume', lang)} className="px-2.5 py-1.5 bg-gray-800/80 hover:bg-gray-700 text-[11px] font-semibold rounded-lg border border-gray-700 transition-colors flex items-center gap-1.5 shadow-sm text-teal-300">
                      <Wind className="w-3.5 h-3.5 text-teal-400" />
                      {currentText.linkTidalVolume}
                    </Link>
                    <Link to={buildPath('/aa-gradient', lang)} className="px-2.5 py-1.5 bg-gray-800/80 hover:bg-gray-700 text-[11px] font-semibold rounded-lg border border-gray-700 transition-colors flex items-center gap-1.5 shadow-sm text-teal-300">
                      <HeartPulse className="w-3.5 h-3.5 text-teal-400" />
                      {currentText.linkAaGradient}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deep Clinical Pillars & Pathophysiology */}
      <div className="mt-16 pt-10 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          {currentText.pillarTitle}
        </h2>
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed mb-10 max-w-4xl">
          {currentText.pillarText.map((p: string, i: number) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* Evidence & Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-teal-50 text-teal-600 rounded-lg shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-base">{currentText.clinicalTitle}</h3>
              <p className="text-gray-600 text-xs leading-relaxed">{currentText.clinicalText}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div className="w-full">
              <h3 className="font-semibold text-gray-900 mb-2 text-base">{layoutTranslations[lang].mathMetric}</h3>
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
              <h3 className="font-semibold text-gray-900 mb-2 text-base">{layoutTranslations[lang].evidenceLit}</h3>
              <p className="text-gray-500 text-xs leading-relaxed italic mb-2">{currentText.references}</p>
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/22797452/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-teal-600 hover:text-teal-700 font-semibold inline-flex items-center gap-1"
              >
                PubMed PMID: 22797452 <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* E-E-A-T Reviewer Card */}
        <MedicalReviewerCard reviewer={REVIEWER_INTENSIVIST} lang={lang} />
      </div>
    </>
  );
}

