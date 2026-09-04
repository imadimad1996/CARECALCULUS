import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, ShieldAlert } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_PERIOPERATIVE } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Caprini Score for Surgical VTE Risk",
    subtitle: "Stratifies venous thromboembolism risk (DVT/PE) in general, urologic, gynecologic, plastic, and orthopedic surgery",
    ageCategory: "Age Category",
    ageUnder40: "< 41 years (0)",
    age41to60: "41 – 60 years (+1)",
    age61to74: "61 – 74 years (+2)",
    age75plus: "≥ 75 years (+3)",
    section1: "1-Point Risk Factors",
    section2: "2-Point Risk Factors",
    section3: "3-Point Risk Factors",
    section5: "5-Point High-Risk Factors",
    result: "Calculated Caprini Score",
    riskTitle: "ACCP VTE Prophylaxis Recommendation",
    references: "Bahl V, Hu HM, Henke PK, Wakefield TW, Campbell DA Jr, Caprini JA. A validation study of a retrospective venous thromboembolism risk scoring system. Ann Surg. 2010;251(2):344-350. (PMID: 19779324).",
    faqs: [
      { question: "What is the Caprini Score?", answer: "The Caprini Score is an extensively validated clinical decision tool recommended by the American College of Chest Physicians (ACCP) to predict venous thromboembolism (VTE) risk and guide pharmacologic and mechanical thromboprophylaxis in surgical patients." },
      { question: "What is the recommendation for a high-risk score (≥ 5)?", answer: "Patients with a Caprini score ≥ 5 should receive dual thromboprophylaxis: pharmacologic prophylaxis (low-molecular-weight heparin [LMWH] or low-dose unfractionated heparin) combined with mechanical prophylaxis (intermittent pneumatic compression [IPC]). Extended prophylaxis (up to 28-35 days post-discharge) is recommended for major abdominopelvic cancer surgery or joint arthroplasty." },
      { question: "When should pharmacologic prophylaxis be withheld?", answer: "When patients have high bleeding risks (active bleeding, platelet count < 50,000, severe coagulopathy, recent intracranial hemorrhage). In such cases, mechanical prophylaxis (IPC) should be used until bleeding risk abates." }
    ],
    veryLow: "Caprini 0: Very Low Risk (< 0.5% VTE)",
    veryLowDesc: "Early, aggressive ambulation alone. No specific mechanical or pharmacologic prophylaxis required.",
    low: "Caprini 1 – 2: Low Risk (~1.5% VTE)",
    lowDesc: "Mechanical prophylaxis with Intermittent Pneumatic Compression (IPC) devices preferred until fully ambulatory.",
    moderate: "Caprini 3 – 4: Moderate Risk (~3.0% VTE)",
    moderateDesc: "Pharmacologic prophylaxis (LMWH or LDUH) OR mechanical prophylaxis (IPC). Dual prophylaxis may be considered.",
    high: "Caprini ≥ 5: High Risk (≥ 6.0% VTE)",
    highDesc: "Dual prophylaxis recommended: Pharmacologic (LMWH) PLUS mechanical (IPC). Extended post-discharge prophylaxis (up to 28–35 days) for major oncologic or joint replacement surgery."
  },
  fr: {
    title: "Score de Caprini (Risque Thrombo-Embolique Chirurgical)",
    subtitle: "Stratification du risque de MTEV (TVP / EP) en chirurgie et recommandations de thromboprophylaxie ACCP",
    ageCategory: "Tranche d'Âge",
    ageUnder40: "< 41 ans (0)",
    age41to60: "41 à 60 ans (+1)",
    age61to74: "61 à 74 ans (+2)",
    age75plus: "≥ 75 ans (+3)",
    section1: "Facteurs de Risque (1 Point chacun)",
    section2: "Facteurs de Risque (2 Points chacun)",
    section3: "Facteurs de Risque (3 Points chacun)",
    section5: "Facteurs Majeurs (5 Points chacun)",
    result: "Score de Caprini Calculé",
    riskTitle: "Recommandation de Thromboprophylaxie ACCP",
    references: "Bahl V, et al. Ann Surg. 2010;251(2):344-350. (PMID: 19779324).",
    faqs: [
      { question: "À quoi sert le score de Caprini ?", answer: "Il évalue le risque de thrombose veineuse profonde et d'embolie pulmonaire en période péri-opératoire afin d'adapter la prévention (HBPM, compression pneumatique)." },
      { question: "Quelle est la prise en charge pour un score ≥ 5 ?", answer: "Un score ≥ 5 justifie une prophylaxie combinée : HBPM à dose préventive renforcée ET compression pneumatique intermittente (CPI), prolongée jusqu'à 28 à 35 jours en cancérologie ou orthopédie majeure." }
    ],
    veryLow: "Caprini 0 : Risque Très Faible (< 0,5%)",
    veryLowDesc: "Lever précoce et mobilisation seule.",
    low: "Caprini 1 – 2 : Risque Faible (~1,5%)",
    lowDesc: "Compression pneumatique intermittente (CPI) ou bas de contention jusqu'à déambulation complète.",
    moderate: "Caprini 3 – 4 : Risque Modéré (~3,0%)",
    moderateDesc: "Prophylaxie médicamenteuse (HBPM) OU compression mécanique (CPI).",
    high: "Caprini ≥ 5 : Risque Élevé (≥ 6,0%)",
    highDesc: "Bithérapie prophylactique : HBPM + Compression mécanique (CPI). Prophylaxie prolongée (28 à 35 jours) pour chirurgie carcinologique majeure ou prothèse totale."
  }
};

interface CapriniItem {
  id: string;
  points: number;
  labelEn: string;
  labelFr: string;
}

const ITEMS_1PT: CapriniItem[] = [
  { id: 'minor_surg', points: 1, labelEn: "Minor surgery planned (< 45 min)", labelFr: "Chirurgie mineure prévue (< 45 min)" },
  { id: 'bmi25', points: 1, labelEn: "BMI > 25 kg/m²", labelFr: "IMC > 25 kg/m²" },
  { id: 'swollen_legs', points: 1, labelEn: "Swollen legs / edema / varicose veins", labelFr: "Œdème des membres inférieurs / varices" },
  { id: 'pregnancy', points: 1, labelEn: "Pregnancy or postpartum (< 1 month)", labelFr: "Grossesse ou post-partum (< 1 mois)" },
  { id: 'oral_contra', points: 1, labelEn: "Oral contraceptives or HRT", labelFr: "Contraception œstroprogestative ou THM" },
  { id: 'copd', points: 1, labelEn: "Serious lung disease / COPD / acute pneumonia (< 1 mo)", labelFr: "BPCO sévère ou pneumopathie aiguë (< 1 mois)" },
  { id: 'sepsis', points: 1, labelEn: "Sepsis (< 1 month)", labelFr: "Sepsis (< 1 mois)" },
  { id: 'bed_rest', points: 1, labelEn: "Medical patient currently at bed rest", labelFr: "Patient médical actuellement alité" },
  { id: 'chf_mi', points: 1, labelEn: "Acute MI or congestive heart failure (< 1 mo)", labelFr: "Infarctus ou insuffisance cardiaque récente (< 1 mois)" }
];

const ITEMS_2PT: CapriniItem[] = [
  { id: 'major_surg', points: 2, labelEn: "Major surgery (> 45 min, open or laparoscopic)", labelFr: "Chirurgie majeure (> 45 min, ouverte ou cœlio)" },
  { id: 'malignancy', points: 2, labelEn: "Active malignancy (past or present < 5 yr)", labelFr: "Cancer évolutif ou traité (< 5 ans)" },
  { id: 'bed_72h', points: 2, labelEn: "Confined to bed (> 72 hours)", labelFr: "Alitement prolongé (> 72 heures)" },
  { id: 'plaster_cast', points: 2, labelEn: "Immobilizing plaster cast or splint", labelFr: "Plâtre ou attelle immobilisant un membre" },
  { id: 'cvc', points: 2, labelEn: "Central venous catheter access", labelFr: "Cathéter veineux central (CVC)" }
];

const ITEMS_3PT: CapriniItem[] = [
  { id: 'prior_vte', points: 3, labelEn: "History of prior DVT or Pulmonary Embolism", labelFr: "Antécédent personnel de TVP ou EP" },
  { id: 'family_vte', points: 3, labelEn: "Family history of thrombosis / VTE", labelFr: "Antécédent familial de maladie thrombo-embolique" },
  { id: 'thrombophilia', points: 3, labelEn: "Known thrombophilia (Factor V Leiden, Lupus anticoagulant, etc.)", labelFr: "Thrombophilie biologique connue (Facteur V, SAPL, etc.)" }
];

const ITEMS_5PT: CapriniItem[] = [
  { id: 'elective_arthro', points: 5, labelEn: "Elective major lower extremity arthroplasty (hip/knee replacement)", labelFr: "Prothèse totale de hanche ou de genou programmée" },
  { id: 'hip_fracture', points: 5, labelEn: "Hip, pelvis, or leg fracture (< 1 month)", labelFr: "Fracture de hanche, bassin ou membre inférieur (< 1 mois)" },
  { id: 'stroke_trauma', points: 5, labelEn: "Acute stroke, spinal cord injury, or multiple trauma (< 1 month)", labelFr: "AVC aigu, traumatisme médullaire ou polytraumatisme (< 1 mois)" }
];

export default function CapriniScore({ lang }: { lang: LangCode }) {
  const [agePoints, setAgePoints] = useState<number>(1);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(['major_surg']));

  const currentText = translations[lang] || translations.en;

  const toggleItem = (id: string) => {
    const updated = new Set(selectedItems);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedItems(updated);
  };

  const totalScore = useMemo(() => {
    let sum = agePoints;
    const all = [...ITEMS_1PT, ...ITEMS_2PT, ...ITEMS_3PT, ...ITEMS_5PT];
    for (const item of all) {
      if (selectedItems.has(item.id)) {
        sum += item.points;
      }
    }
    return sum;
  }, [agePoints, selectedItems]);

  useEffect(() => {
    trackCalculatorUsage('caprini-score', lang, totalScore);
  }, [totalScore, lang]);

  const riskTier = useMemo(() => {
    if (totalScore === 0) return 'veryLow';
    if (totalScore <= 2) return 'low';
    if (totalScore <= 4) return 'moderate';
    return 'high';
  }, [totalScore]);

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/caprini-score"
        scoringSystem="Caprini VTE Risk Score"
        howToSteps={[
          lang === 'fr' ? 'Sélectionner la tranche d\'âge du patient opéré.' : 'Select patient surgical age category.',
          lang === 'fr' ? 'Cocher les facteurs de risque chirurgicaux, néoplasiques et médicaux.' : 'Check surgical, oncologic, and clinical thrombotic risk factors.',
          lang === 'fr' ? 'Un score ≥ 5 justifie une double thromboprophylaxie (HBPM + compression mécanique).' : 'Caprini score >= 5 warrants dual prophylaxis (LMWH + IPC).'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-700 mb-2">
          <ShieldAlert className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Chirurgie & Prévention Thrombo-Embolique' : 'Surgical Care & Thromboprophylaxis'}</span>
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
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
            {/* Age Category */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">{currentText.ageCategory}</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { pts: 0, label: currentText.ageUnder40 },
                  { pts: 1, label: currentText.age41to60 },
                  { pts: 2, label: currentText.age61to74 },
                  { pts: 3, label: currentText.age75plus }
                ].map((tier) => (
                  <button
                    key={tier.pts}
                    type="button"
                    onClick={() => setAgePoints(tier.pts)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                      agePoints === tier.pts
                        ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20 shadow-sm'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 5-Point Major Factors */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block mb-2">{currentText.section5}</span>
              <div className="space-y-2">
                {ITEMS_5PT.map((item) => {
                  const checked = selectedItems.has(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                        checked ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                    >
                      +5 pts: {lang === 'fr' ? item.labelFr : item.labelEn}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3-Point Factors */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 block mb-2">{currentText.section3}</span>
              <div className="space-y-2">
                {ITEMS_3PT.map((item) => {
                  const checked = selectedItems.has(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                        checked ? 'bg-purple-50 border-purple-500 text-purple-900 ring-2 ring-purple-500/20 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                    >
                      +3 pts: {lang === 'fr' ? item.labelFr : item.labelEn}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2-Point Factors */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-2">{currentText.section2}</span>
              <div className="space-y-2">
                {ITEMS_2PT.map((item) => {
                  const checked = selectedItems.has(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                        checked ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                    >
                      +2 pts: {lang === 'fr' ? item.labelFr : item.labelEn}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 1-Point Factors */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block mb-2">{currentText.section1}</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ITEMS_1PT.map((item) => {
                  const checked = selectedItems.has(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                        checked ? 'bg-teal-50 border-teal-500 text-teal-900 ring-2 ring-teal-500/20 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                    >
                      +1 pt: {lang === 'fr' ? item.labelFr : item.labelEn}
                    </button>
                  );
                })}
              </div>
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
                  riskTier === 'veryLow' ? 'text-emerald-400' : riskTier === 'low' ? 'text-teal-400' : riskTier === 'moderate' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {totalScore}
                </span>
                <span className="text-xl text-gray-400 font-medium">points</span>
              </div>

              <div className={`p-4 rounded-xl border ${
                riskTier === 'veryLow'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : riskTier === 'low'
                  ? 'bg-teal-50 text-teal-800 border-teal-200'
                  : riskTier === 'moderate'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                <div className="font-bold text-sm mb-1">
                  {riskTier === 'veryLow' ? currentText.veryLow : riskTier === 'low' ? currentText.low : riskTier === 'moderate' ? currentText.moderate : currentText.high}
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  {riskTier === 'veryLow' ? currentText.veryLowDesc : riskTier === 'low' ? currentText.lowDesc : riskTier === 'moderate' ? currentText.moderateDesc : currentText.highDesc}
                </p>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "Age Category", value: `${agePoints} pts` },
                  { label: "Selected Factors", value: `${selectedItems.size} risk criteria checked` }
                ]}
                results={[
                  { label: "Caprini Score", value: `${totalScore} points` },
                  { label: "Risk Stratification", value: riskTier.toUpperCase() },
                  { label: "ACCP Prophylaxis", value: riskTier === 'high' ? "Dual (LMWH + IPC)" : riskTier === 'moderate' ? "LMWH or IPC" : riskTier === 'low' ? "Mechanical (IPC)" : "Early Ambulation" }
                ]}
                formula="Caprini Thrombosis Risk Model (Weighted cumulative points: 1, 2, 3, 5)"
                disclaimer="Caprini >= 5 indicates high VTE risk, warranting pharmacologic plus mechanical prophylaxis in the absence of active bleeding."
                references="Bahl V, et al. Ann Surg. 2010;251(2):344-350."
                lang={lang}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <MedicalReviewerCard reviewer={REVIEWER_PERIOPERATIVE} />
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900 block mb-1">Foundational Evidence:</span>
          <p className="italic mb-2">{currentText.references}</p>
          <div className="flex flex-wrap gap-4 text-rose-700">
            <a href="https://pubmed.ncbi.nlm.nih.gov/19779324/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Bahl V et al. (2010) Annals of Surgery <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
