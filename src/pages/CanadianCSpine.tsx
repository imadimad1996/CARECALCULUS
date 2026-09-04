import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, Shield } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_EMERGENCY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Canadian C-Spine Rule",
    subtitle: "Safely excludes cervical spine injury without radiography in alert, stable adult trauma patients",
    prereqTitle: "Applicability Criteria (Must all be met)",
    prereqText: "Patient is alert (GCS 15), hemodynamically stable, acute blunt trauma within 48 hours. Not applicable to non-trauma, GCS < 15, age < 16, or penetrating trauma.",
    step1Title: "1. Any High-Risk Factor Mandating Radiography?",
    step1Age: "Age ≥ 65 years",
    step1Mech: "Dangerous mechanism (fall ≥ 3 ft / 5 stairs, axial load to head, high-speed MVC ≥ 100 km/h, rollover, ejection, bicycle strike, ATV)",
    step1Para: "Paresthesias in extremities",
    step2Title: "2. Any Low-Risk Factor Allowing Safe Assessment of Neck Range of Motion?",
    step2Mva: "Simple rear-end motor vehicle collision",
    step2Sitting: "Sitting position in emergency department",
    step2Ambulatory: "Ambulatory at any time since trauma",
    step2Delayed: "Delayed onset of neck pain (not immediate)",
    step2NoMidline: "Absence of midline cervical spine tenderness",
    step3Title: "3. Able to Actively Rotate Neck 45° Left and Right?",
    step3Rot: "Patient can actively rotate neck 45 degrees both left and right",
    yes: "Yes",
    no: "No",
    result: "Clinical Decision",
    references: "Stiell IG, Wells GA, Vandemheen KL, et al. The Canadian C-spine rule for radiography in alert and stable trauma patients. JAMA. 2001;286(15):1841-1848. (PMID: 11597285).",
    faqs: [
      { question: "What is the sensitivity of the Canadian C-Spine Rule?", answer: "The Canadian C-Spine Rule has demonstrated 99-100% sensitivity for detecting clinically important cervical spine injuries, virtually eliminating missed fractures when properly applied." },
      { question: "When does a patient need C-spine imaging?", answer: "Imaging is required if ANY high-risk factor is present (Age ≥ 65, dangerous mechanism, paresthesias), OR if NO low-risk factors are present, OR if the patient CANNOT actively rotate their neck 45 degrees bilaterally." },
      { question: "What imaging modality is preferred?", answer: "In trauma centers, non-contrast CT from occiput to T1 with sagittal and coronal reconstructions is the imaging modality of choice for patients requiring radiography." }
    ],
    noImage: "No Radiography Required (C-Spine Cleared)",
    noImageDesc: "100% sensitivity for excluding clinically important cervical spine injury. Cervical collar may be safely removed.",
    imageNeeded: "Cervical Spine Imaging Indicated (CT / X-ray)",
    imageNeededDesc: "Patient fails clinical clearance rule. Maintain cervical immobilization precautions until definitive CT imaging confirms absence of unstable fracture/subluxation."
  },
  fr: {
    title: "Règle Canadienne du Rachis Cervical",
    subtitle: "Élimine avec sécurité une lésion instable du rachis cervical sans radiographie chez l'adulte traumatisé vigile",
    prereqTitle: "Critères d'Inclusion",
    prereqText: "Patient vigile (Glasgow 15), stable, traumatisme contondant < 48h. Non applicable si GCS < 15, âge < 16 ans, traumatisme pénétrant.",
    step1Title: "1. Présence d'au moins un critère de haut risque ? (Imagerie obligatoire si Oui)",
    step1Age: "Âge ≥ 65 ans",
    step1Mech: "Mécanisme dangereux (chute ≥ 1 m ou 5 marches, charge axiale sur la tête, AVP ≥ 100 km/h, tonneau, éjection, vélo)",
    step1Para: "Paresthésies des membres",
    step2Title: "2. Présence d'au moins un critère de faible risque permettant d'évaluer la mobilité ? (Imagerie obligatoire si Aucun)",
    step2Mva: "Collision arrière simple de voiture",
    step2Sitting: "Position assise aux urgences",
    step2Ambulatory: "Déambulation à un moment quelconque après l'accident",
    step2Delayed: "Apparition retardée de la cervicalgie (non immédiate)",
    step2NoMidline: "Absence de douleur à la palpation médiane des épineuses cervicales",
    step3Title: "3. Rotation active du cou à 45° à gauche et à droite possible ?",
    step3Rot: "Le patient est capable de tourner activement la tête à 45° des deux côtés",
    yes: "Oui",
    no: "Non",
    result: "Décision Clinique",
    references: "Stiell IG, et al. JAMA. 2001;286(15):1841-1848. (PMID: 11597285).",
    faqs: [
      { question: "Quelle est la fiabilité de la règle canadienne ?", answer: "Sa sensibilité pour les lésions cervicales graves est de 99 à 100%. Elle permet de retirer le collier cervical en toute sécurité sans imagerie chez les patients négatifs." }
    ],
    noImage: "Aucune Imagerie Requise (Rachis Cliniquement Indemne)",
    noImageDesc: "Sensibilité de 100% pour éliminer une fracture instable. Le collier cervical peut être retiré sans cliché.",
    imageNeeded: "Imagerie du Rachis Cervical Indiquée (TDM)",
    imageNeededDesc: "Le patient ne répond pas aux critères de levée de collier. Réaliser un scanner cervical avec reconstructions sagittales et coronales."
  }
};

export default function CanadianCSpine({ lang }: { lang: LangCode }) {
  const [step1Any, setStep1Any] = useState<boolean>(false);
  const [step2HasLowRisk, setStep2HasLowRisk] = useState<boolean>(true);
  const [step3CanRotate, setStep3CanRotate] = useState<boolean>(true);

  const currentText = translations[lang] || translations.en;

  const requiresImaging = useMemo(() => {
    if (step1Any) return true; // High risk present
    if (!step2HasLowRisk) return true; // Cannot safely test ROM
    if (!step3CanRotate) return true; // Cannot rotate 45 deg
    return false;
  }, [step1Any, step2HasLowRisk, step3CanRotate]);

  useEffect(() => {
    trackCalculatorUsage('canadian-c-spine', lang, requiresImaging ? 1 : 0);
  }, [requiresImaging, lang]);

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/canadian-c-spine"
        scoringSystem="Canadian C-Spine Rule"
        howToSteps={[
          lang === 'fr' ? 'Vérifier l\'absence de facteurs de haut risque (âge ≥ 65, paresthésies, mécanisme violent).' : 'Check for high-risk factors (age >= 65, paresthesias, dangerous mechanism).',
          lang === 'fr' ? 'Identifier au moins un facteur de faible risque autorisant l\'évaluation de la mobilité.' : 'Confirm presence of at least one low-risk feature permitting range of motion assessment.',
          lang === 'fr' ? 'Tester la rotation active du cou à 45° bilatérale pour lever le collier sans radiographie.' : 'Assess active 45-degree neck rotation bilaterally to safely clear C-spine without imaging.'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2">
          <Shield className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Traumatologie & Médecine d\'Urgence' : 'Trauma & Emergency Medicine'}</span>
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
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 leading-relaxed">
              <span className="font-bold block mb-0.5">{currentText.prereqTitle}</span>
              {currentText.prereqText}
            </div>

            {/* Step 1: High risk */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-rose-700 block">
                {currentText.step1Title}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStep1Any(false)}
                  className={`py-3 px-3 rounded-xl border font-bold text-sm transition-all ${
                    !step1Any ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20' : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {currentText.no} (None present)
                </button>
                <button
                  type="button"
                  onClick={() => setStep1Any(true)}
                  className={`py-3 px-3 rounded-xl border font-bold text-sm transition-all ${
                    step1Any ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/20' : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {currentText.yes} (≥ 1 Present)
                </button>
              </div>
            </div>

            {/* Step 2: Low risk present */}
            {!step1Any && (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                  {currentText.step2Title}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStep2HasLowRisk(true)}
                    className={`py-3 px-3 rounded-xl border font-bold text-sm transition-all ${
                      step2HasLowRisk ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20' : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    {currentText.yes} (≥ 1 Low Risk Factor)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep2HasLowRisk(false)}
                    className={`py-3 px-3 rounded-xl border font-bold text-sm transition-all ${
                      !step2HasLowRisk ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/20' : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    {currentText.no} (No Low Risk Factors)
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Rotation */}
            {!step1Any && step2HasLowRisk && (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                  {currentText.step3Title}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStep3CanRotate(true)}
                    className={`py-3 px-3 rounded-xl border font-bold text-sm transition-all ${
                      step3CanRotate ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20' : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    {currentText.yes} (Rotates 45° Left & Right)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep3CanRotate(false)}
                    className={`py-3 px-3 rounded-xl border font-bold text-sm transition-all ${
                      !step3CanRotate ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/20' : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    {currentText.no} (Cannot Rotate 45°)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 p-6 md:p-8 relative">
            <div className="absolute top-0 right-0 p-24 bg-gradient-to-bl from-teal-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-5">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block">
                {currentText.result}
              </span>
              
              <div className="flex items-baseline gap-3">
                <span className={`text-2xl md:text-3xl font-extrabold tracking-tight ${
                  !requiresImaging ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {!requiresImaging ? (lang === 'fr' ? 'Collier Retirable' : 'Clear C-Spine') : (lang === 'fr' ? 'Imagerie TDM Requise' : 'Imaging Indicated')}
                </span>
              </div>

              <div className={`p-4 rounded-xl border ${
                !requiresImaging ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                <div className="font-bold text-sm mb-1">
                  {!requiresImaging ? currentText.noImage : currentText.imageNeeded}
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  {!requiresImaging ? currentText.noImageDesc : currentText.imageNeededDesc}
                </p>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "High Risk Factors Present", value: step1Any ? "Yes (Mandates Imaging)" : "No" },
                  { label: "Low Risk Factors Present", value: step2HasLowRisk ? "Yes" : "No" },
                  { label: "Active 45° Neck Rotation", value: step3CanRotate ? "Able to rotate" : "Unable" }
                ]}
                results={[
                  { label: "Radiography Decision", value: !requiresImaging ? "No Imaging Required" : "Imaging Indicated (CT Cervical Spine)" },
                  { label: "Sensitivity for Fracture", value: "99 - 100%" }
                ]}
                formula="Canadian C-Spine 3-Tier Clinical Algorithm"
                disclaimer="Valid only in alert (GCS 15) and hemodynamically stable trauma patients."
                references="Stiell IG, et al. JAMA. 2001;286(15):1841-1848."
                lang={lang}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <MedicalReviewerCard reviewer={REVIEWER_EMERGENCY} />
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900 block mb-1">Foundational Evidence:</span>
          <p className="italic mb-2">{currentText.references}</p>
          <div className="flex flex-wrap gap-4 text-teal-700">
            <a href="https://pubmed.ncbi.nlm.nih.gov/11597285/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Stiell IG et al. (2001) JAMA <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
