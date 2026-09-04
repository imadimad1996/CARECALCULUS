import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, Droplet } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_EMERGENCY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Glasgow-Blatchford Bleeding Score (GBS)",
    subtitle: "Pre-endoscopic risk stratification for acute upper gastrointestinal bleeding",
    sex: "Biological Sex",
    male: "Male",
    female: "Female",
    bun: "Blood Urea Nitrogen (BUN)",
    hb: "Hemoglobin (Hb)",
    sbp: "Systolic Blood Pressure (SBP)",
    hr: "Heart Rate ≥ 100 bpm",
    melena: "Presentation with Melena",
    syncope: "Presentation with Syncope",
    hepatic: "History of Hepatic Disease (Cirrhosis, Portal HTN)",
    cardiac: "History of Heart Failure",
    yes: "Yes",
    no: "No",
    result: "Calculated GBS Score",
    formula: "GBS = BUN + Hb + SBP + HR(1) + Melena(1) + Syncope(2) + Hepatic(2) + Cardiac(2) [Max: 23]",
    clinicalTitle: "Inpatient Admission vs Outpatient Discharge Recommendation",
    references: "Blatchford O, Murray WR, Blatchford M. A risk score to predict need for treatment for upper-gastrointestinal haemorrhage. Lancet. 2000;356(9238):1318-1321. (PMID: 11073021).",
    faqs: [
      { question: "What is the Glasgow-Blatchford Score (GBS)?", answer: "The Glasgow-Blatchford Score is a validated clinical risk tool used prior to endoscopy in patients presenting with acute upper GI bleeding (hematemesis or melena) to determine who requires intervention (transfusion, endoscopy, or surgery) and who is safe for outpatient care." },
      { question: "Who can be safely discharged from the Emergency Department?", answer: "Patients with a GBS of 0 (or in some updated guidelines, GBS ≤ 1) have an extremely low risk of rebleeding or death (<1%) and can be considered for safe outpatient management without emergency overnight hospitalization." },
      { question: "Why is elevated BUN weighted heavily in GBS?", answer: "Blood digested in the upper gastrointestinal tract is absorbed as protein, causing an elevated blood urea nitrogen (BUN) disproportional to serum creatinine, serving as a biological marker of ongoing or significant intraluminal bleeding." }
    ],
    zeroScore: "Score 0: Very Low Risk (<0.5% Intervention)",
    zeroDesc: "Patient is suitable for outpatient management and elective endoscopy. Hospital admission is generally unnecessary unless social factors preclude discharge.",
    lowScore: "Score 1–5: Low-to-Moderate Risk",
    lowDesc: "Admission to an inpatient floor. Endoscopy indicated within 24 hours. Intravenous PPI therapy and hemodynamic observation.",
    highScore: "Score ≥ 6: High Risk (>50% Need for Intervention)",
    highDesc: "High risk of blood transfusion, endoscopic hemostasis, or surgery. Urgent gastroenterology consultation, IV access with 2 large-bore lines, and early endoscopy (<12h)."
  },
  fr: {
    title: "Score de Glasgow-Blatchford (GBS)",
    subtitle: "Stratification du risque pré-endoscopique d'hémorragie digestive haute",
    sex: "Sexe Biologique",
    male: "Homme",
    female: "Femme",
    bun: "Urée Sanguine (BUN)",
    hb: "Hémoglobine (Hb)",
    sbp: "Pression Artérielle Systolique (PAS)",
    hr: "Fréquence cardiaque ≥ 100 bpm",
    melena: "Présence de méléna",
    syncope: "Présence d'une syncope",
    hepatic: "Antécédent d'hépatopathie chronique (Cirrhose)",
    cardiac: "Antécédent d'insuffisance cardiaque",
    yes: "Oui",
    no: "Non",
    result: "Score GBS Calculé",
    formula: "GBS = Urée + Hb + PAS + FC(1) + Méléna(1) + Syncope(2) + Foie(2) + Cœur(2) [Max : 23]",
    clinicalTitle: "Recommandation d'Orientation et Endoscopie",
    references: "Blatchford O, et al. Lancet. 2000;356(9238):1318-1321. (PMID: 11073021).",
    faqs: [
      { question: "À quoi sert le score de Glasgow-Blatchford ?", answer: "Le score de Glasgow-Blatchford évalue la gravité d'une hémorragie digestive haute avant toute endoscopie, pour identifier les patients à très faible risque pouvant être gérés en ambulatoire." },
      { question: "Quel est le seuil pour une prise en charge ambulatoire ?", answer: "Un score GBS de 0 (ou ≤ 1 selon certaines sociétés savantes) présente un risque d'intervention < 1%, autorisant un retour à domicile avec endoscopie programmée." },
      { question: "Pourquoi l'urée sanguine est-elle fortement pondérée ?", answer: "Le sang digéré dans le tractus digestif haut libère des protéines absorbées qui augmentent l'urée sanguine, constituant un reflet direct du volume de saignement intraluminal." }
    ],
    zeroScore: "Score 0 : Risque Très Faible (< 0,5% d'intervention)",
    zeroDesc: "Prise en charge ambulatoire envisageable avec fibroscopie en externe. Hospitalisation non indispensable en l'absence de facteur de vulnérabilité.",
    lowScore: "Score 1–5 : Risque Faible à Modéré",
    lowDesc: "Hospitalisation en service conventionnel. Endoscopie digestive haute recommandée dans les 24 heures. IPP par voie intraveineuse.",
    highScore: "Score ≥ 6 : Haut Risque (> 50% besoin d'intervention)",
    highDesc: "Risque majeur de transfusion ou d'hémostase endoscopique. Avis gastroentérologique urgent, 2 VVP de bon calibre et endoscopie précoce (< 12h)."
  }
};

export default function GlasgowBlatchford({ lang }: { lang: LangCode }) {
  const [sex, setSex] = useState<number>(0); // 0 male, 1 female
  const [bunTier, setBunTier] = useState<number>(0); // 0: <6.5, 1: 6.5-7.9 (+2), 2: 8-9.9 (+3), 3: 10-24.9 (+4), 4: >=25 (+6)
  const [hbTier, setHbTier] = useState<number>(0);
  const [sbpTier, setSbpTier] = useState<number>(0);
  const [hr, setHr] = useState<boolean>(false);
  const [melena, setMelena] = useState<boolean>(false);
  const [syncope, setSyncope] = useState<boolean>(false);
  const [hepatic, setHepatic] = useState<boolean>(false);
  const [cardiac, setCardiac] = useState<boolean>(false);

  const currentText = translations[lang] || translations.en;

  const score = useMemo(() => {
    let s = 0;
    // BUN points
    if (bunTier === 1) s += 2;
    if (bunTier === 2) s += 3;
    if (bunTier === 3) s += 4;
    if (bunTier === 4) s += 6;

    // Hb points
    if (sex === 0) {
      // Male: 12-12.9 (+1), 10-11.9 (+3), <10 (+6)
      if (hbTier === 1) s += 1;
      if (hbTier === 2) s += 3;
      if (hbTier === 3) s += 6;
    } else {
      // Female: 10-11.9 (+1), <10 (+6)
      if (hbTier === 1) s += 0;
      if (hbTier === 2) s += 1;
      if (hbTier === 3) s += 6;
    }

    // SBP points: 100-109 (+1), 90-99 (+2), <90 (+3)
    if (sbpTier === 1) s += 1;
    if (sbpTier === 2) s += 2;
    if (sbpTier === 3) s += 3;

    if (hr) s += 1;
    if (melena) s += 1;
    if (syncope) s += 2;
    if (hepatic) s += 2;
    if (cardiac) s += 2;

    return s;
  }, [bunTier, hbTier, sbpTier, sex, hr, melena, syncope, hepatic, cardiac]);

  useEffect(() => {
    trackCalculatorUsage('glasgow-blatchford', lang, score);
  }, [score, lang]);

  const riskTier = useMemo(() => {
    if (score === 0) return { label: currentText.zeroScore, desc: currentText.zeroDesc, badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', bar: 'bg-emerald-500' };
    if (score <= 5) return { label: currentText.lowScore, desc: currentText.lowDesc, badge: 'bg-amber-50 text-amber-800 border-amber-200', bar: 'bg-amber-500' };
    return { label: currentText.highScore, desc: currentText.highDesc, badge: 'bg-rose-50 text-rose-800 border-rose-200', bar: 'bg-rose-600' };
  }, [score, currentText]);

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/glasgow-blatchford"
        scoringSystem="Glasgow-Blatchford Upper GI Bleeding Risk Score"
        howToSteps={[
          lang === 'fr' ? 'Identifier le sexe biologique du patient.' : 'Select biological sex for sex-specific hemoglobin cutoffs.',
          lang === 'fr' ? 'Renseigner les paliers d\'urée sanguine (BUN), d\'hémoglobine et de pression systolique.' : 'Select corresponding intervals for BUN, hemoglobin, and systolic blood pressure.',
          lang === 'fr' ? 'Cocher les facteurs cliniques : FC ≥ 100, méléna, syncope, cirrhose, insuffisance cardiaque.' : 'Check clinical presentation markers: tachycardia >=100 bpm, melena, syncope, liver disease, heart failure.',
          lang === 'fr' ? 'Interpréter le score GBS : 0 = ambulatoire possible, ≥ 6 = haut risque d\'intervention.' : 'Interpret GBS: 0 = safe outpatient candidate, >=6 = high risk requiring urgent endoscopy.'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-600 mb-2">
          <Droplet className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Gastroentérologie & Urgences' : 'Gastroenterology & Emergency Medicine'}</span>
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
            {/* Sex Toggle */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">{currentText.sex}</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setSex(0)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${sex === 0 ? 'bg-teal-700 border-teal-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}
                >
                  {currentText.male}
                </button>
                <button
                  onClick={() => setSex(1)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${sex === 1 ? 'bg-teal-700 border-teal-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}
                >
                  {currentText.female}
                </button>
              </div>
            </div>

            {/* BUN Interval */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">{currentText.bun}</label>
              <select
                value={bunTier}
                onChange={(e) => setBunTier(Number(e.target.value))}
                className="w-full bg-gray-50 px-3.5 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
              >
                <option value={0}>&lt; 6.5 mmol/L (&lt; 18.2 mg/dL) [0 pts]</option>
                <option value={1}>6.5 – 7.9 mmol/L (18.2 – 22.1 mg/dL) [+2 pts]</option>
                <option value={2}>8.0 – 9.9 mmol/L (22.4 – 27.7 mg/dL) [+3 pts]</option>
                <option value={3}>10.0 – 24.9 mmol/L (28.0 – 69.7 mg/dL) [+4 pts]</option>
                <option value={4}>≥ 25.0 mmol/L (≥ 70.0 mg/dL) [+6 pts]</option>
              </select>
            </div>

            {/* Hemoglobin Interval */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">{currentText.hb}</label>
              <select
                value={hbTier}
                onChange={(e) => setHbTier(Number(e.target.value))}
                className="w-full bg-gray-50 px-3.5 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
              >
                <option value={0}>{sex === 0 ? '≥ 13.0 g/dL [0 pts]' : '≥ 12.0 g/dL [0 pts]'}</option>
                <option value={1}>{sex === 0 ? '12.0 – 12.9 g/dL [+1 pt]' : '10.0 – 11.9 g/dL [+1 pt]'}</option>
                <option value={2}>{sex === 0 ? '10.0 – 11.9 g/dL [+3 pts]' : '10.0 – 11.9 g/dL [+1 pt]'}</option>
                <option value={3}>&lt; 10.0 g/dL [+6 pts]</option>
              </select>
            </div>

            {/* SBP Interval */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">{currentText.sbp}</label>
              <select
                value={sbpTier}
                onChange={(e) => setSbpTier(Number(e.target.value))}
                className="w-full bg-gray-50 px-3.5 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
              >
                <option value={0}>≥ 110 mmHg [0 pts]</option>
                <option value={1}>100 – 109 mmHg [+1 pt]</option>
                <option value={2}>90 – 99 mmHg [+2 pts]</option>
                <option value={3}>&lt; 90 mmHg [+3 pts]</option>
              </select>
            </div>

            {/* Toggles */}
            <div className="space-y-2.5 pt-2 border-t border-gray-100">
              {[
                { label: currentText.hr, val: hr, set: setHr, pts: "+1" },
                { label: currentText.melena, val: melena, set: setMelena, pts: "+1" },
                { label: currentText.syncope, val: syncope, set: setSyncope, pts: "+2" },
                { label: currentText.hepatic, val: hepatic, set: setHepatic, pts: "+2" },
                { label: currentText.cardiac, val: cardiac, set: setCardiac, pts: "+2" }
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => item.set(!item.val)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${item.val ? 'bg-teal-50/80 border-teal-500/80 shadow-sm' : 'bg-gray-50/70 border-gray-200 hover:bg-gray-100/60'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-all ${item.val ? 'bg-teal-600 text-white' : 'border border-gray-300 bg-white'}`}>
                      {item.val ? '✓' : ''}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.label}</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gray-200 text-gray-700">{item.pts}</span>
                </div>
              ))}
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
                <span className={`text-5xl md:text-6xl font-extrabold tracking-tight ${score >= 6 ? 'text-rose-400' : score > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {score}
                </span>
                <span className="text-xl text-gray-400 font-medium">/ 23 points</span>
              </div>

              <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${riskTier.bar}`} 
                  style={{ width: `${Math.min(100, (score / 15) * 100)}%` }}
                />
              </div>

              <div className={`p-4 rounded-xl border ${riskTier.badge}`}>
                <div className="font-bold text-sm mb-1">{riskTier.label}</div>
                <p className="text-xs leading-relaxed opacity-90">{riskTier.desc}</p>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "Sex", value: sex === 0 ? "Male" : "Female" },
                  { label: "BUN Tier", value: `Tier ${bunTier}` },
                  { label: "Hemoglobin Tier", value: `Tier ${hbTier}` },
                  { label: "Systolic BP Tier", value: `Tier ${sbpTier}` },
                  { label: "Tachycardia (HR ≥100)", value: hr ? "Yes" : "No" },
                  { label: "Melena", value: melena ? "Yes" : "No" },
                  { label: "Syncope", value: syncope ? "Yes" : "No" },
                  { label: "Hepatic Disease", value: hepatic ? "Yes" : "No" },
                  { label: "Heart Failure", value: cardiac ? "Yes" : "No" }
                ]}
                results={[
                  { label: "Glasgow-Blatchford Score", value: score, unit: "/ 23" },
                  { label: "Risk Category", value: riskTier.label },
                  { label: "Clinical Disposition", value: riskTier.desc }
                ]}
                formula={currentText.formula}
                disclaimer="A score of 0 predicts very low risk (<1% intervention); patients may be suitable for outpatient care."
                references="Blatchford O, et al. Lancet. 2000;356(9238):1318-1321."
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
            <a href="https://pubmed.ncbi.nlm.nih.gov/11073021/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Blatchford O et al. (2000) Lancet <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
