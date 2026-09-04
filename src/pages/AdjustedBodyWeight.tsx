import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, TestTube, Droplet, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, Pill, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { layoutTranslations, buildPath } from '../utils/lang';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_PHARMACY } from '../data/reviewers';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';

const translations: Translations = {
  en: {
    title: "Adjusted & Ideal Body Weight (IBW / ABW / LBW) Calculator",
    subtitle: "Evidence-based Devine formula, 40% obesity correction factor, and Janmahasatian Lean Body Weight",
    height: "Height (cm)",
    weight: "Actual Total Body Weight (kg)",
    sex: "Biological Sex",
    male: "Male",
    female: "Female",
    ibwTitle: "Ideal Body Weight (IBW / PBW)",
    abwTitle: "Adjusted Body Weight (ABW 0.4)",
    lbwTitle: "Lean Body Weight (LBW)",
    formula: "IBW (Devine): 50 (M) / 45.5 (F) + 0.91 × (Height [cm] - 152.4)",
    clinicalTitle: "Pharmacokinetic & Dosing Relevance",
    clinicalText: "Hydrophilic drugs (e.g., aminoglycosides) distribute minimally into adipose tissue (~40%). When actual weight exceeds 120% of IBW, dosing should utilize Adjusted Body Weight (ABW) to prevent nephrotoxicity and ototoxicity. Mechanical ventilation tidal volumes must always use Predicted Body Weight (PBW = IBW).",
    pillarTitle: "Pharmacokinetics & Body Weight Selection in Critical Care",
    pillarText: [
      "In critically ill patients, administering weight-based pharmaceuticals using actual total body weight (TBW) in obesity frequently results in supratherapeutic drug concentrations, acute kidney injury, or organ toxicity. Conversely, utilizing unadjusted ideal body weight (IBW) for all medications risks severe underdosing and therapeutic failure.",
      "Adipose tissue is poorly vascularized, receiving only ~5% of cardiac output despite comprising up to 50% of an obese individual's body mass. Hydrophilic molecules—such as aminoglycosides (gentamicin, tobramycin, amikacin)—distribute into extracellular water and partition into excess adipose tissue at approximately 40% of the concentration observed in lean tissue. Hence, the consensus 0.4 correction factor: ABW = IBW + 0.4 × (TBW - IBW).",
      "For mechanical ventilation in acute lung injury and ARDS, alveolar dimensions correlate strictly with biological sex and standing skeletal height, not actual body weight. ARDSNet lung-protective protocols require strict 4–8 mL/kg of Predicted Body Weight (PBW, identical to Devine IBW) to prevent barotrauma and volutrauma."
    ],
    references: "Devine BJ. Gentamicin therapy. Drug Intell Clin Pharm. 1974;8:650-655. (PMID: 4443485). Pai MP, Paloucek FP. The origin of the 'ideal' body weight equations. Ann Pharmacother. 2000;34(9):1066-1069. (PMID: 10981254). Janmahasatian S, et al. Lean body mass normalizes the clearance of busulfan. Clin Pharmacokinet. 2005;44(10):1051-1065. (PMID: 16198656).",
    dosingToolsTitle: "ICU Weight-Based Protocols",
    dosingToolsText: "When the patient is obese (>120% IBW or BMI ≥ 30), apply Adjusted Body Weight to these validated clinical dosing protocols:",
    linkVanco: "Vancomycin Dosing",
    linkAmino: "Aminoglycoside Dosing",
    linkHeparin: "Heparin Nomogram",
    faqs: [
      { question: "What is Adjusted Body Weight (ABW) and when is it indicated?", answer: "Adjusted Body Weight (ABW) adjusts ideal body weight upward to account for the limited extracellular volume of adipose tissue in overweight or obese patients. It is clinically indicated when a patient's actual total body weight exceeds 120% of their Ideal Body Weight (IBW), or when BMI ≥ 30 kg/m²." },
      { question: "What is the Devine formula for Ideal Body Weight (IBW)?", answer: "For men: IBW (kg) = 50.0 + 0.91 × (Height in cm - 152.4). For women: IBW (kg) = 45.5 + 0.91 × (Height in cm - 152.4). This formula is also termed Predicted Body Weight (PBW) in critical care ventilation." },
      { question: "Why is the 0.4 correction factor used for aminoglycosides?", answer: "Hydrophilic antibiotics like gentamicin and amikacin distribute into extracellular fluids. Adipose tissue contains approximately 30-40% extracellular water compared to lean tissue. Multiplying excess weight (TBW - IBW) by 0.4 accurately mirrors this expanded volume of distribution without overestimating clearance." },
      { question: "Which weight is used for ARDSNet mechanical ventilation?", answer: "Mechanical ventilation tidal volumes (4–8 mL/kg) must always be calculated using Predicted Body Weight (PBW / Devine IBW), NEVER actual total body weight, as lung volume is determined by height and sex rather than adiposity." }
    ],
    matrixTitle: "Evidence-Based Medication Dosing Matrix",
    matrixHeaders: ["Medication / Protocol", "Recommended Weight Metric", "Clinical Rationale & Caveats"],
    matrixRows: [
      { med: "Aminoglycosides (Gentamicin, Tobramycin, Amikacin)", weight: "ABW (0.4 factor) if TBW > 120% IBW; TBW if normal", rationale: "Hydrophilic; distributes into ~40% of excess adipose tissue. Prevents nephrotoxicity." },
      { med: "Vancomycin (Empiric Loading & Maintenance)", weight: "Total Body Weight (TBW)", rationale: "Lipophilic and hydrophilic properties; loading doses (25-35 mg/kg) use TBW up to max 3000 mg." },
      { med: "Acyclovir IV", weight: "Ideal Body Weight (IBW)", rationale: "Hydrophilic; dosing on TBW in obesity precipitates acute crystalline nephropathy." },
      { med: "LMWH (Enoxaparin VTE Prophylaxis / Treatment)", weight: "Total Body Weight (TBW) with anti-Xa monitoring", rationale: "Dosed on TBW for therapeutic anticoagulation; cap or anti-Xa monitoring advised if BMI > 40." },
      { med: "ARDSNet Mechanical Ventilation (Tidal Volume)", weight: "Predicted Body Weight (PBW = Devine IBW)", rationale: "Target 4-8 mL/kg PBW. Lung parenchyma dimensions do not expand with adipose tissue." }
    ]
  },
  fr: {
    title: "Calcul Poids Idéal et Ajusté (IBW / ABW / LBW) — Formule Devine",
    subtitle: "Formule de Devine, facteur de correction 40% pour l'obésité et masse maigre de Janmahasatian",
    height: "Taille (cm)",
    weight: "Poids Réel Total (kg)",
    sex: "Sexe Biologique",
    male: "Homme",
    female: "Femme",
    ibwTitle: "Poids Idéal Théorique (IBW / PBW)",
    abwTitle: "Poids Ajusté (ABW 0.4)",
    lbwTitle: "Masse Maigre (LBW)",
    formula: "IBW (Devine) : 50 (H) / 45.5 (F) + 0.91 × (Taille [cm] - 152.4)",
    clinicalTitle: "Pharmacocinétique et Posologie en Réanimation",
    clinicalText: "Les molécules hydrophiles (comme les aminosides) diffusent peu dans le tissu adipeux (~40%). Quand le poids réel dépasse 120% du poids idéal, la posologie doit reposer sur le Poids Ajusté (ABW) pour éviter néphrotoxicité et ototoxicité. Le volume courant ventilatoire doit obligatoirement utiliser le Poids Prédit (PBW = IBW).",
    pillarTitle: "Pharmacocinétique et Sélection du Poids en Soins Intensifs",
    pillarText: [
      "Chez le patient hospitalisé ou en réanimation, doser les médicaments sur le poids réel (TBW) en cas d'obésité expose à des concentrations plasmatiques suprathérapeutiques et à une insuffisance rénale aiguë iatrogène. Inversement, utiliser systématiquement le poids idéal strict (IBW) expose à un sous-dosage majeur lors d'infections sévères.",
      "Le tissu adipeux est peu vascularisé : il ne reçoit que ~5% du débit cardiaque alors qu'il peut représenter 50% de la masse corporelle chez le patient obèse. Les aminosides (gentamicine, amikacine, tobramycine) étant hautement hydrophiles, leur volume de distribution ne s'étend au tissu adipeux excédentaire qu'à hauteur de 40%. D'où la formule validée : Poids Ajusté (ABW) = IBW + 0,4 × (Poids Réel - IBW).",
      "En ventilation mécanique (notamment dans le SDRA), les dimensions pulmonaires dépendent exclusivement de la taille squelettique et du sexe biologique, et aucunement de l'adiposité. Les protocoles ARDSNet imposent 4 à 8 mL/kg de Poids Prédit (PBW = formule de Devine) pour prévenir le barotraumatisme et le volutraumatisme."
    ],
    references: "Devine BJ. Gentamicin therapy. Drug Intell Clin Pharm. 1974;8:650-655. (PMID: 4443485). Pai MP, Paloucek FP. The origin of the 'ideal' body weight equations. Ann Pharmacother. 2000;34(9):1066-1069. (PMID: 10981254). Janmahasatian S, et al. Lean body mass normalizes the clearance of busulfan. Clin Pharmacokinet. 2005;44(10):1051-1065. (PMID: 16198656).",
    dosingToolsTitle: "Protocoles Posologiques en Réanimation",
    dosingToolsText: "Lorsque le patient est obèse (> 120% du poids idéal ou IMC ≥ 30), appliquez le Poids Ajusté aux protocoles suivants :",
    linkVanco: "Dosage Vancomycine",
    linkAmino: "Dosage Aminosides",
    linkHeparin: "Nomogramme Héparine",
    faqs: [
      { question: "Qu'est-ce que le Poids Ajusté (ABW) et quand l'utiliser ?", answer: "Le Poids Ajusté (ABW) corrige le poids idéal théorique en ajoutant 40% de l'excès pondéral lié à l'adiposité. Il est indiqué lorsque le poids réel dépasse 120% du poids idéal (IBW), ou dès que l'IMC ≥ 30 kg/m²." },
      { question: "Quelle est la formule de Devine pour le calcul du poids idéal ?", answer: "Chez l'homme : Poids Idéal (kg) = 50,0 + 0,91 × (Taille en cm - 152,4). Chez la femme : Poids Idéal (kg) = 45,5 + 0,91 × (Taille en cm - 152,4). En réanimation, cette formule correspond au Poids Prédit (PBW)." },
      { question: "Pourquoi utilise-t-on le facteur 0,4 pour les aminosides ?", answer: "Les aminosides (gentamicine, amikacine) sont hydrophiles. Le tissu adipeux contient environ 30 à 40% d'eau extracellulaire par rapport au tissu maigre. Le facteur 0,4 compense fidèlement cette expansion modérée sans surévaluer la clairance rénale." },
      { question: "Quel poids utiliser pour la ventilation mécanique protectrice ?", answer: "Le volume courant (4 à 8 mL/kg) doit TOUJOURS être calculé sur le Poids Idéal Prédit (PBW = formule de Devine), JAMAIS sur le poids réel, car le volume pulmonaire ne varie pas avec la surcharge graisseuse." }
    ],
    matrixTitle: "Matrice Posologique Selon le Type de Molécule",
    matrixHeaders: ["Médicament / Protocole", "Poids Recommandé", "Rationnel Pharmacologique"],
    matrixRows: [
      { med: "Aminosides (Gentamicine, Tobramycine, Amikacine)", weight: "Poids Ajusté (ABW 0.4) si Poids Réel > 120% IBW", rationale: "Molécule hydrophile diffusant à 40% dans le tissu graisseux. Évite la néphrotoxicité." },
      { med: "Vancomycine (Charge et Entretien)", weight: "Poids Réel (TBW)", rationale: "Propriétés lipophiles et hydrophiles mixtes. Dose de charge sur poids réel (max 3000 mg)." },
      { med: "Aciclovir IV", weight: "Poids Idéal Théorique (IBW)", rationale: "Molécule hydrophile. Une posologie sur poids réel chez l'obèse induit des néphropathies cristallines aiguës." },
      { med: "HBPM (Énoxaparine Préventive / Curative)", weight: "Poids Réel (TBW) avec contrôle anti-Xa", rationale: "Calculé sur poids réel ; surveillance du pic anti-Xa recommandée si IMC > 40 kg/m²." },
      { med: "Ventilation Mécanique Protectrice (SDRA)", weight: "Poids Prédit (PBW = formule de Devine)", rationale: "Objectif 4 à 8 mL/kg PBW. La taille alvéolaire dépend de la stature squelettique, pas du tissu adipeux." }
    ]
  }
};

export default function AdjustedBodyWeight({ lang }: { lang: LangCode }) {
  const [height, setHeight] = useState<number | ''>(170);
  const [weight, setWeight] = useState<number | ''>(100);
  const [sex, setSex] = useState<number>(0); 

  const currentText = translations[lang] || translations.en;
  const isRtl = false;

  const results = useMemo(() => {
    if (height === '' || weight === '' || height <= 0 || weight <= 0) return null;
    const h = Number(height);
    const w = Number(weight);
    
    // IBW (Devine)
    const base = sex === 0 ? 50.0 : 45.5;
    const ibw = base + 0.91 * (h - 152.4);
    
    // Adjusted Body Weight (ABW 0.4)
    const isObese = w > 1.2 * ibw;
    const abw = isObese ? (ibw + 0.4 * (w - ibw)) : w;
    
    // BMI
    const hm = h / 100;
    const bmi = w / (hm * hm);
    
    // LBW (Janmahasatian 2005)
    const lbw = sex === 0 
      ? (9270 * w) / (6680 + 216 * bmi)
      : (9270 * w) / (8780 + 244 * bmi);

    return {
      ibw: Math.max(0, ibw),
      abw: Math.max(0, abw),
      lbw: Math.max(0, lbw),
      isObese,
      bmi
    };
  }, [height, weight, sex]);

  useEffect(() => {
    if (results !== null) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('adjusted-body-weight', lang, results.ibw);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [results, lang]);

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/adjusted-body-weight"
        howToSteps={[
          lang === 'fr' 
            ? 'Mesurer la taille précise en centimètres et identifier le sexe biologique pour la constante basale (50 kg homme, 45.5 kg femme).'
            : 'Measure standing height in cm and select biological sex for baseline constant (50 kg male, 45.5 kg female).',
          lang === 'fr'
            ? 'Calculer le poids idéal (Devine) : IBW = Base + 0.91 × (Taille en cm - 152.4).'
            : 'Compute Ideal Body Weight (Devine formula): IBW = Base + 0.91 × (Height in cm - 152.4).',
          lang === 'fr'
            ? 'Si le poids réel > 1.2 × IBW, calculer le poids ajusté : ABW = IBW + 0.4 × (Poids Réel - IBW).'
            : 'If actual weight > 1.2 × IBW, calculate adjusted weight: ABW = IBW + 0.4 × (Actual Weight - IBW).'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2">
          <Pill className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Pharmacocinétique & Réanimation' : 'Pharmacokinetics & Critical Care'}</span>
        </div>
        <h1 className={`text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-3 ${isRtl ? 'leading-normal' : ''}`}>
          {currentText.title}
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed">
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
                      className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${sex === 0 ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}
                      style={{ minHeight: '44px' }}
                    >
                      {currentText.male}
                    </button>
                    <button
                      onClick={() => setSex(1)}
                      className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${sex === 1 ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}
                      style={{ minHeight: '44px' }}
                    >
                      {currentText.female}
                    </button>
                  </div>
                </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="group">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.height}</label>
                    <input
                      type="number" inputMode="decimal"
                      value={height}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Number(e.target.value);
                        setHeight(val);
                      }}
                      className="w-full bg-gray-50 px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-2xl font-semibold text-gray-900"
                    />
                  </div>
                  <div className="group">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.weight}</label>
                    <input
                      type="number" inputMode="decimal"
                      value={weight}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Number(e.target.value);
                        setWeight(val);
                      }}
                      className="w-full bg-gray-50 px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-2xl font-semibold text-gray-900"
                    />
                  </div>
              </div>
            </div>

            {results !== null && (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between text-xs text-blue-900">
                <span className="font-semibold">{lang === 'fr' ? 'Indice de Masse Corporelle (IMC) :' : 'Body Mass Index (BMI):'}</span>
                <span className="font-bold text-sm">{results.bmi.toFixed(1)} kg/m²</span>
              </div>
            )}

          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
            <div className="bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 p-6 md:p-8 relative">
               <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
                
               <div className="relative z-10 flex flex-col gap-5">
                  
                  <div className="bg-white/5 rounded-xl p-4 md:p-5 border border-white/10">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-1">
                        {currentText.ibwTitle}
                    </span>
                    <div className="flex items-baseline gap-2 tabular-nums">
                        <span className="text-3xl md:text-4xl font-extrabold tracking-tight">
                        {results !== null ? results.ibw.toFixed(1) : '--'}
                        </span>
                        <span className="text-sm text-gray-400 font-medium">kg</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {lang === 'fr' ? 'Volume de ventilation protectrice (ARDSNet 4-8 mL/kg)' : 'Protective ventilation target (ARDSNet 4-8 mL/kg)'}
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 md:p-5 border border-white/10">
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-1">
                            {currentText.abwTitle}
                        </span>
                        {results?.isObese ? (
                          <span className="text-[10px] bg-red-500/20 text-red-300 font-semibold px-2 py-0.5 rounded uppercase">
                            {lang === 'fr' ? 'Poids Réel > 120% Idéal' : 'Actual > 120% IBW'}
                          </span>
                        ) : (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded uppercase">
                            {lang === 'fr' ? 'Non-Obèse (Poids Réel)' : 'Non-Obese (TBW)'}
                          </span>
                        )}
                    </div>
                    <div className="flex items-baseline gap-2 tabular-nums">
                        <span className="text-3xl md:text-4xl font-extrabold tracking-tight">
                        {results !== null ? results.abw.toFixed(1) : '--'}
                        </span>
                        <span className="text-sm text-gray-400 font-medium">kg</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {lang === 'fr' ? 'Recommandé pour posologie des aminosides et chimiothérapies' : 'Recommended for aminoglycoside dosing and hydrophilic therapies'}
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 md:p-5 border border-white/10">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                        {currentText.lbwTitle}
                    </span>
                    <div className="flex items-baseline gap-2 tabular-nums">
                        <span className="text-3xl md:text-4xl font-extrabold tracking-tight">
                        {results !== null ? results.lbw.toFixed(1) : '--'}
                        </span>
                        <span className="text-sm text-gray-400 font-medium">kg</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {lang === 'fr' ? 'Masse maigre sans tissu adipeux (Janmahasatian 2005)' : 'Fat-free metabolic mass (Janmahasatian 2005)'}
                    </p>
                  </div>

                  {results !== null && (
                    <>
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
                          { label: 'BMI', value: results.bmi.toFixed(1), unit: 'kg/m²' },
                          { label: 'Obesity Status', value: results.isObese ? 'Obese (Actual > 120% Ideal)' : 'Non-obese' }
                        ]}
                        formula="Devine: Male IBW = 50.0 + 0.91 * (Ht - 152.4), Female IBW = 45.5 + 0.91 * (Ht - 152.4); ABW = IBW + 0.4 * (TBW - IBW)"
                        disclaimer="This calculator estimates medical dry weights. Clinicians should evaluate physiological factors, fluid status, and muscle status."
                        references="Devine BJ. Gentamicin therapy. Drug Intell Clin Pharm. 1974;8:650-655. (PMID: 4443485) / Janmahasatian S, et al. Clin Pharmacokinet. 2005;44(10):1051-1065. (PMID: 16198656)."
                        lang={lang}
                      />
                      
                      {/* ICU Dosing Tools */}
                      <div className="mt-2 p-4 rounded-xl border border-blue-500/20 bg-blue-500/10">
                        <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1.5">{currentText.dosingToolsTitle}</h4>
                        <p className="text-xs text-gray-300 mb-3">{currentText.dosingToolsText}</p>
                        <div className="flex flex-wrap gap-2">
                          <Link to={buildPath('/aminoglycoside-dosing', lang)} className="px-2.5 py-1.5 bg-gray-800/80 hover:bg-gray-700 text-[11px] font-semibold rounded-lg border border-gray-700 transition-colors flex items-center gap-1.5 shadow-sm">
                            <TestTube className="w-3.5 h-3.5 text-blue-400" />
                            {currentText.linkAmino}
                          </Link>
                          <Link to={buildPath('/heparin-dosing', lang)} className="px-2.5 py-1.5 bg-gray-800/80 hover:bg-gray-700 text-[11px] font-semibold rounded-lg border border-gray-700 transition-colors flex items-center gap-1.5 shadow-sm">
                            <Activity className="w-3.5 h-3.5 text-blue-400" />
                            {currentText.linkHeparin}
                          </Link>
                          <Link to={buildPath('/vancomycin-dosing', lang)} className="px-2.5 py-1.5 bg-gray-800/80 hover:bg-gray-700 text-[11px] font-semibold rounded-lg border border-gray-700 transition-colors flex items-center gap-1.5 shadow-sm">
                            <Droplet className="w-3.5 h-3.5 text-blue-400" />
                            {currentText.linkVanco}
                          </Link>
                        </div>
                      </div>
                    </>
                  )}

               </div>
            </div>
        </div>
      </div>

      {/* Medication Dosing Matrix Table */}
      <div className="mt-12 bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-blue-600">
          <Scale className="w-5 h-5" />
          <h2 className="text-xl font-bold text-gray-900">{currentText.matrixTitle}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-700 font-semibold">
                <th className="p-3.5">{currentText.matrixHeaders[0]}</th>
                <th className="p-3.5">{currentText.matrixHeaders[1]}</th>
                <th className="p-3.5">{currentText.matrixHeaders[2]}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentText.matrixRows.map((row: any, idx: number) => (
                <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                  <td className="p-3.5 font-semibold text-gray-900">{row.med}</td>
                  <td className="p-3.5 font-mono text-xs text-blue-700 font-bold bg-blue-50/50 rounded">{row.weight}</td>
                  <td className="p-3.5 text-gray-600 text-xs leading-relaxed">{row.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deep Clinical Rationale */}
      <div className="mt-12 bg-gray-50 rounded-2xl border border-gray-200 p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
          <Stethoscope className="w-5 h-5 text-blue-600" />
          <h2>{currentText.pillarTitle}</h2>
        </div>
        {currentText.pillarText.map((paragraph: string, idx: number) => (
          <p key={idx} className="text-sm md:text-base text-gray-700 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Height to IBW Reference Table */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {lang === 'fr' ? 'Table de Référence Stature vs Poids Idéal (IBW)' : 'Height to Ideal Body Weight (IBW) Reference Table'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse text-sm text-gray-600">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-700 font-bold">
                <th className="p-3">{lang === 'fr' ? 'Stature' : 'Height'}</th>
                <th className="p-3">{lang === 'fr' ? 'IBW Homme' : 'Male IBW'}</th>
                <th className="p-3">{lang === 'fr' ? 'IBW Femme' : 'Female IBW'}</th>
                <th className="p-3">{lang === 'fr' ? 'Ventilation Protectrice (6 mL/kg PBW)' : 'Protective Tidal Volume (6 mL/kg PBW)'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="border-b border-gray-100">
                <td className="p-3 font-mono">152 cm (5'0")</td>
                <td className="p-3 font-mono font-semibold text-blue-700">50.0 kg</td>
                <td className="p-3 font-mono font-semibold text-purple-700">45.5 kg</td>
                <td className="p-3 text-xs text-gray-500">300 mL (H) / 273 mL (F)</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-mono">160 cm (5'3")</td>
                <td className="p-3 font-mono font-semibold text-blue-700">56.9 kg</td>
                <td className="p-3 font-mono font-semibold text-purple-700">52.4 kg</td>
                <td className="p-3 text-xs text-gray-500">341 mL (H) / 314 mL (F)</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-mono">170 cm (5'7")</td>
                <td className="p-3 font-mono font-semibold text-blue-700">66.0 kg</td>
                <td className="p-3 font-mono font-semibold text-purple-700">61.5 kg</td>
                <td className="p-3 text-xs text-gray-500">396 mL (H) / 369 mL (F)</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-mono">180 cm (5'11")</td>
                <td className="p-3 font-mono font-semibold text-blue-700">75.1 kg</td>
                <td className="p-3 font-mono font-semibold text-purple-700">70.6 kg</td>
                <td className="p-3 text-xs text-gray-500">451 mL (H) / 424 mL (F)</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-mono">190 cm (6'3")</td>
                <td className="p-3 font-mono font-semibold text-blue-700">84.2 kg</td>
                <td className="p-3 font-mono font-semibold text-purple-700">79.7 kg</td>
                <td className="p-3 text-xs text-gray-500">505 mL (H) / 478 mL (F)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12 bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {lang === 'fr' ? 'Questions Fréquentes sur le Poids Idéal et Ajusté' : 'Frequently Asked Questions: Ideal & Adjusted Body Weight'}
        </h2>
        <div className="space-y-6 divide-y divide-gray-100">
          {currentText.faqs.map((faq: { question: string; answer: string }, idx: number) => (
            <div key={idx} className={idx > 0 ? 'pt-6' : ''}>
              <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-start gap-2">
                <span className="text-blue-600 font-bold">Q:</span>
                <span>{faq.question}</span>
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed pl-6">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Medical Reviewer Card & References */}
      <div className="mt-12 space-y-6">
        <MedicalReviewerCard reviewer={REVIEWER_PHARMACY} />
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900 block mb-1">Primary Clinical Literature:</span>
          <p className="italic mb-2">{currentText.references}</p>
          <div className="flex flex-wrap gap-4 text-blue-600">
            <a href="https://pubmed.ncbi.nlm.nih.gov/4443485/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Devine BJ (1974) Gentamicin Therapy <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://pubmed.ncbi.nlm.nih.gov/10981254/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Pai MP & Paloucek FP (2000) IBW Equations <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://pubmed.ncbi.nlm.nih.gov/16198656/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Janmahasatian S (2005) Lean Body Weight <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}


