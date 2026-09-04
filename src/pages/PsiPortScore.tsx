import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, Wind } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_PULMONOLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Pneumonia Severity Index (PSI / PORT)",
    subtitle: "Stratifies 30-day mortality and guides outpatient vs. inpatient admission for Community-Acquired Pneumonia (CAP)",
    demoSection: "Demographics & Residence",
    sex: "Sex",
    male: "Male (+Age)",
    female: "Female (+Age − 10)",
    age: "Age (years)",
    nursingHome: "Nursing home resident (+10)",
    comorbidSection: "Comorbid Illnesses",
    neoplasm: "Neoplastic disease / Active cancer (+30)",
    liver: "Liver disease / Cirrhosis (+20)",
    chf: "Congestive heart failure (+10)",
    cerebrovascular: "Cerebrovascular disease / Prior stroke (+10)",
    renal: "Renal disease / Chronic kidney disease (+10)",
    examSection: "Physical Exam Findings",
    alteredMental: "Altered mental status / Confusion (+20)",
    tachypnea: "Respiratory rate ≥ 30 breaths/min (+20)",
    hypotension: "Systolic blood pressure < 90 mmHg (+20)",
    temperature: "Temperature < 35°C (95°F) or ≥ 40°C (104°F) (+15)",
    tachycardia: "Heart rate ≥ 125 beats/min (+10)",
    labSection: "Laboratory & Radiographic Findings",
    acidosis: "Arterial pH < 7.35 (+30)",
    bun: "BUN ≥ 30 mg/dL (10.7 mmol/L) (+20)",
    hyponatremia: "Sodium < 130 mEq/L (+20)",
    hyperglycemia: "Glucose ≥ 250 mg/dL (13.9 mmol/L) (+10)",
    hematocrit: "Hematocrit < 30% (+10)",
    hypoxia: "PaO₂ < 60 mmHg or SpO₂ < 90% (+10)",
    effusion: "Pleural effusion on chest imaging (+10)",
    result: "Calculated PSI / PORT Score",
    riskTitle: "Risk Class & Disposition Recommendation",
    references: "Fine MJ, Auble TE, Yealy DM, et al. A prediction rule to identify low-risk patients with community-acquired pneumonia. N Engl J Med. 1997;336(4):243-250. (PMID: 8995086).",
    faqs: [
      { question: "What is the PSI / PORT Score?", answer: "The Pneumonia Severity Index is a validated tool recommended by the ATS/IDSA guidelines to determine 30-day mortality risk and safely identify pneumonia patients who can be treated as outpatients." },
      { question: "How does PSI compare to CURB-65?", answer: "PSI is more sensitive for identifying low-risk candidates for outpatient care because it heavily factors in patient age, underlying chronic comorbidities, and laboratory derangements." },
      { question: "What is the management for Class I and II?", answer: "Class I and II patients have an exceptionally low 30-day mortality (< 1%) and can generally be safely treated as outpatients with oral antibiotics unless social factors or hypoxemia preclude discharge." }
    ],
    class1_2: "Class I / II (Score ≤ 70): Low Risk (Mortality 0.1 – 0.6%)",
    class1_2Desc: "Safe for outpatient treatment with oral antibiotics. Hospital admission rarely required unless social barriers or acute hypoxemia exist.",
    class3: "Class III (Score 71 – 90): Low-Intermediate Risk (Mortality ~0.9 – 2.8%)",
    class3Desc: "Consider short observation stay or outpatient care with close 24-48 hour clinical monitoring.",
    class4: "Class IV (Score 91 – 130): Moderate-High Risk (Mortality ~8.2 – 9.3%)",
    class4Desc: "Inpatient hospital admission strongly recommended. Initiate intravenous empiric antibiotics.",
    class5: "Class V (Score > 130): High Risk (Mortality ~27 – 29%)",
    class5Desc: "Inpatient hospital admission mandatory. Urgently evaluate for intensive care unit (ICU) admission and vasopressor/ventilatory support."
  },
  fr: {
    title: "Score PSI / PORT (Pneumonie Aiguë Communautaire)",
    subtitle: "Évalue la mortalité à 30 jours et guide l'orientation (ambulatoire vs hospitalisation) dans la PAC",
    demoSection: "Démographie & Mode de Vie",
    sex: "Sexe",
    male: "Homme (+Âge)",
    female: "Femme (+Âge − 10)",
    age: "Âge (années)",
    nursingHome: "Résident en EHPAD / Maison de retraite (+10)",
    comorbidSection: "Comorbidités",
    neoplasm: "Cancer actif / Hémopathie maligne (+30)",
    liver: "Hépatopathie chronique / Cirrhose (+20)",
    chf: "Insuffisance cardiaque congestive (+10)",
    cerebrovascular: "Antécédent d'AVC / Maladie cérébro-vasculaire (+10)",
    renal: "Insuffisance rénale chronique (+10)",
    examSection: "Examen Clinique",
    alteredMental: "Troubles des fonctions supérieures / Confusion (+20)",
    tachypnea: "Fréquence respiratoire ≥ 30 /min (+20)",
    hypotension: "Pression artérielle systolique < 90 mmHg (+20)",
    temperature: "Température < 35°C ou ≥ 40°C (+15)",
    tachycardia: "Fréquence cardiaque ≥ 125 bpm (+10)",
    labSection: "Biologie & Imagerie",
    acidosis: "pH artériel < 7,35 (+30)",
    bun: "Urée sanguine ≥ 11 mmol/L ou BUN ≥ 30 mg/dL (+20)",
    hyponatremia: "Natrémie < 130 mEq/L (+20)",
    hyperglycemia: "Glycémie ≥ 14 mmol/L (250 mg/dL) (+10)",
    hematocrit: "Hématocrite < 30% (+10)",
    hypoxia: "PaO₂ < 60 mmHg ou SpO₂ < 90% (+10)",
    effusion: "Épanchement pleural radiologique (+10)",
    result: "Score PSI / PORT Calculé",
    riskTitle: "Classe de Risque & Lieu de Soins",
    references: "Fine MJ, et al. N Engl J Med. 1997;336(4):243-250. (PMID: 8995086).",
    faqs: [
      { question: "Quelle est l'utilité du score PSI / PORT ?", answer: "Il est recommandé pour guider la décision d'hospitalisation ou de traitement ambulatoire des pneumopathies aiguës communautaires." }
    ],
    class1_2: "Classe I / II (Score ≤ 70) : Risque Faible (Mortalité < 1%)",
    class1_2Desc: "Traitement ambulatoire par antibiothérapie orale à domicile recommandé.",
    class3: "Classe III (Score 71 – 90) : Risque Intermédiaire (Mortalité ~2%)",
    class3Desc: "Hospitalisation de courte durée (UHCD) ou prise en charge externe surveillée.",
    class4: "Classe IV (Score 91 – 130) : Risque Élevé (Mortalité ~9%)",
    class4Desc: "Hospitalisation conventionnelle indispensable.",
    class5: "Classe V (Score > 130) : Risque Majeur (Mortalité ~28%)",
    class5Desc: "Hospitalisation en soins intensifs ou réanimation requise."
  }
};

export default function PsiPortScore({ lang }: { lang: LangCode }) {
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number | ''>(68);
  const [nursingHome, setNursingHome] = useState<boolean>(false);

  // Comorbidities
  const [neoplasm, setNeoplasm] = useState<boolean>(false);
  const [liver, setLiver] = useState<boolean>(false);
  const [chf, setChf] = useState<boolean>(true);
  const [cerebrovascular, setCerebrovascular] = useState<boolean>(false);
  const [renal, setRenal] = useState<boolean>(false);

  // Physical Exam
  const [alteredMental, setAlteredMental] = useState<boolean>(false);
  const [tachypnea, setTachypnea] = useState<boolean>(true);
  const [hypotension, setHypotension] = useState<boolean>(false);
  const [temperature, setTemperature] = useState<boolean>(false);
  const [tachycardia, setTachycardia] = useState<boolean>(false);

  // Labs / Imaging
  const [acidosis, setAcidosis] = useState<boolean>(false);
  const [bunElevated, setBunElevated] = useState<boolean>(true);
  const [hyponatremia, setHyponatremia] = useState<boolean>(false);
  const [hyperglycemia, setHyperglycemia] = useState<boolean>(false);
  const [hematocritLow, setHematocritLow] = useState<boolean>(false);
  const [hypoxia, setHypoxia] = useState<boolean>(true);
  const [effusion, setEffusion] = useState<boolean>(false);

  const currentText = translations[lang] || translations.en;

  const score = useMemo(() => {
    if (age === '') return null;
    let s = Number(age);
    if (sex === 'female') s -= 10;
    if (nursingHome) s += 10;

    // Comorbidities
    if (neoplasm) s += 30;
    if (liver) s += 20;
    if (chf) s += 10;
    if (cerebrovascular) s += 10;
    if (renal) s += 10;

    // Exam
    if (alteredMental) s += 20;
    if (tachypnea) s += 20;
    if (hypotension) s += 20;
    if (temperature) s += 15;
    if (tachycardia) s += 10;

    // Labs
    if (acidosis) s += 30;
    if (bunElevated) s += 20;
    if (hyponatremia) s += 20;
    if (hyperglycemia) s += 10;
    if (hematocritLow) s += 10;
    if (hypoxia) s += 10;
    if (effusion) s += 10;

    return Math.max(0, s);
  }, [
    sex, age, nursingHome, neoplasm, liver, chf, cerebrovascular, renal,
    alteredMental, tachypnea, hypotension, temperature, tachycardia,
    acidosis, bunElevated, hyponatremia, hyperglycemia, hematocritLow, hypoxia, effusion
  ]);

  useEffect(() => {
    if (score !== null) {
      trackCalculatorUsage('psi-port-score', lang, score);
    }
  }, [score, lang]);

  const psiClass = useMemo(() => {
    if (score === null) return null;
    if (score <= 70) return 'class1_2';
    if (score <= 90) return 'class3';
    if (score <= 130) return 'class4';
    return 'class5';
  }, [score]);

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/psi-port-score"
        scoringSystem="Pneumonia Severity Index (PSI / PORT)"
        howToSteps={[
          lang === 'fr' ? 'Renseigner l\'âge, le sexe et le statut de résidence en établissement de soins.' : 'Input patient age, sex, and nursing home residence.',
          lang === 'fr' ? 'Cocher les comorbidités, anomalies de l\'examen physique et perturbations biologiques.' : 'Check chronic comorbidities, abnormal physical findings, and laboratory derangements.',
          lang === 'fr' ? 'Score ≤ 70 autorise le traitement ambulatoire; > 90 impose l\'hospitalisation.' : 'Score <= 70 indicates outpatient treatment; > 90 mandates hospital admission.'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2">
          <Wind className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Pneumologie & Soins Aigus' : 'Pulmonology & Acute Respiratory Care'}</span>
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
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-5">
            {/* Demographics */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">{currentText.demoSection}</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">{currentText.sex}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSex('male')}
                      className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                        sex === 'male' ? 'bg-teal-50 border-teal-500 text-teal-900 ring-2 ring-teal-500/20' : 'bg-gray-50 border-gray-200 text-gray-600'
                      }`}
                    >
                      {currentText.male}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSex('female')}
                      className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                        sex === 'female' ? 'bg-teal-50 border-teal-500 text-teal-900 ring-2 ring-teal-500/20' : 'bg-gray-50 border-gray-200 text-gray-600'
                      }`}
                    >
                      {currentText.female}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">{currentText.age}</label>
                  <input
                    type="number" min="18" max="110"
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-gray-50 px-4 py-2 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setNursingHome(!nursingHome)}
                className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  nursingHome ? 'bg-teal-50 border-teal-500 text-teal-900 ring-2 ring-teal-500/20 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'
                }`}
              >
                {currentText.nursingHome}
              </button>
            </div>

            {/* Comorbidities */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 block">{currentText.comorbidSection}</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { s: neoplasm, fn: setNeoplasm, l: currentText.neoplasm },
                  { s: liver, fn: setLiver, l: currentText.liver },
                  { s: chf, fn: setChf, l: currentText.chf },
                  { s: cerebrovascular, fn: setCerebrovascular, l: currentText.cerebrovascular },
                  { s: renal, fn: setRenal, l: currentText.renal }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => item.fn(!item.s)}
                    className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                      item.s ? 'bg-purple-50 border-purple-500 text-purple-900 ring-2 ring-purple-500/20 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    {item.l}
                  </button>
                ))}
              </div>
            </div>

            {/* Physical Exam */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">{currentText.examSection}</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { s: alteredMental, fn: setAlteredMental, l: currentText.alteredMental },
                  { s: tachypnea, fn: setTachypnea, l: currentText.tachypnea },
                  { s: hypotension, fn: setHypotension, l: currentText.hypotension },
                  { s: temperature, fn: setTemperature, l: currentText.temperature },
                  { s: tachycardia, fn: setTachycardia, l: currentText.tachycardia }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => item.fn(!item.s)}
                    className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                      item.s ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    {item.l}
                  </button>
                ))}
              </div>
            </div>

            {/* Labs / Imaging */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 block">{currentText.labSection}</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { s: acidosis, fn: setAcidosis, l: currentText.acidosis },
                  { s: bunElevated, fn: setBunElevated, l: currentText.bun },
                  { s: hyponatremia, fn: setHyponatremia, l: currentText.hyponatremia },
                  { s: hyperglycemia, fn: setHyperglycemia, l: currentText.hyperglycemia },
                  { s: hematocritLow, fn: setHematocritLow, l: currentText.hematocrit },
                  { s: hypoxia, fn: setHypoxia, l: currentText.hypoxia },
                  { s: effusion, fn: setEffusion, l: currentText.effusion }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => item.fn(!item.s)}
                    className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                      item.s ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    {item.l}
                  </button>
                ))}
              </div>
            </div>
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
              
              <div className="flex items-baseline gap-3 tabular-nums">
                <span className={`text-5xl md:text-6xl font-extrabold tracking-tight ${
                  psiClass === 'class1_2' ? 'text-emerald-400' : psiClass === 'class3' ? 'text-teal-400' : psiClass === 'class4' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {score !== null ? score : '--'}
                </span>
                <span className="text-xl text-gray-400 font-medium">points</span>
              </div>

              {psiClass && (
                <div className={`p-4 rounded-xl border ${
                  psiClass === 'class1_2'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : psiClass === 'class3'
                    ? 'bg-teal-50 text-teal-800 border-teal-200'
                    : psiClass === 'class4'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  <div className="font-bold text-sm mb-1">
                    {psiClass === 'class1_2' ? currentText.class1_2 : psiClass === 'class3' ? currentText.class3 : psiClass === 'class4' ? currentText.class4 : currentText.class5}
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">
                    {psiClass === 'class1_2' ? currentText.class1_2Desc : psiClass === 'class3' ? currentText.class3Desc : psiClass === 'class4' ? currentText.class4Desc : currentText.class5Desc}
                  </p>
                </div>
              )}

              {score !== null && (
                <ClinicalExportButton
                  title={currentText.title}
                  inputs={[
                    { label: "Age / Sex", value: `${age} yrs, ${sex}` },
                    { label: "Nursing Home", value: nursingHome ? "Yes" : "No" },
                    { label: "Comorbidities", value: [neoplasm && 'Cancer', liver && 'Liver', chf && 'CHF', renal && 'CKD'].filter(Boolean).join(', ') || 'None' },
                    { label: "Exam / Labs", value: [tachypnea && 'RR≥30', hypoxia && 'Hypoxia', bunElevated && 'BUN≥30'].filter(Boolean).join(', ') || 'Stable' }
                  ]}
                  results={[
                    { label: "PSI / PORT Score", value: `${score} points` },
                    { label: "Risk Classification", value: psiClass === 'class1_2' ? "Class I/II (Low Risk)" : psiClass === 'class3' ? "Class III (Low-Intermediate)" : psiClass === 'class4' ? "Class IV (Moderate-High)" : "Class V (High Risk)" },
                    { label: "Disposition", value: psiClass === 'class1_2' ? "Outpatient Care" : psiClass === 'class3' ? "Observation / Outpatient" : "Inpatient Admission" }
                  ]}
                  formula="Fine et al. PSI / PORT Multi-factor Model"
                  disclaimer="PSI Class I-II patients with adequate social support are appropriate for outpatient therapy."
                  references="Fine MJ, et al. N Engl J Med. 1997;336(4):243-250."
                  lang={lang}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <MedicalReviewerCard reviewer={REVIEWER_PULMONOLOGY} />
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900 block mb-1">Foundational Evidence:</span>
          <p className="italic mb-2">{currentText.references}</p>
          <div className="flex flex-wrap gap-4 text-teal-700">
            <a href="https://pubmed.ncbi.nlm.nih.gov/8995086/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Fine MJ et al. (1997) New England Journal of Medicine <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
