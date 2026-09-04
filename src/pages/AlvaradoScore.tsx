import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_EMERGENCY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Alvarado Score for Acute Appendicitis (MANTRELS)",
    subtitle: "Evidence-based risk stratification and diagnostic protocol for suspected acute appendicitis",
    migratory: "Migration of pain to the Right Lower Quadrant (RLQ)",
    anorexia: "Anorexia or acetone in urine",
    nausea: "Nausea or vomiting",
    tenderness: "Tenderness in the Right Lower Quadrant (RLQ)",
    rebound: "Rebound tenderness (Blumberg's sign)",
    fever: "Fever (oral temp ≥ 37.3°C / 99.1°F)",
    leukocytosis: "Leukocytosis (WBC > 10,000 / µL)",
    shift: "Neutrophilic shift to the left (> 75% neutrophils)",
    yes: "Yes",
    no: "No",
    result: "Calculated Alvarado Score",
    formula: "Score = M(1) + A(1) + N(1) + T(2) + R(1) + E(1) + L(2) + S(1) [Max: 10]",
    clinicalTitle: "Diagnostic & Surgical Management Recommendation",
    references: "Alvarado A. A practical score for the early diagnosis of acute appendicitis. Ann Emerg Med. 1986;15(5):557-564. (PMID: 3963537). Ohle R, et al. The utility of the Alvarado score in predicting acute appendicitis: a systematic review. BMC Med. 2011;9:139. (PMID: 22204638).",
    faqs: [
      { question: "What is the Alvarado Score (MANTRELS)?", answer: "The Alvarado Score is a validated 10-point clinical diagnostic scoring system based on symptoms, signs, and laboratory findings to stratify the likelihood of acute appendicitis in patients presenting with acute right lower quadrant abdominal pain." },
      { question: "How are Alvarado score results interpreted?", answer: "Scores 0-4: Appendicitis is unlikely (NPV ~95%); discharge or consider alternative diagnoses. Scores 5-6: Intermediate risk; active hospital observation and ultrasound/CT imaging advised. Scores 7-8: Probable appendicitis; urgent surgical consultation and cross-sectional imaging. Scores 9-10: Very high probability (>90%); proceed directly to surgical exploration or appendectomy." },
      { question: "Why do tenderness and leukocytosis count for 2 points?", answer: "Right lower quadrant focal peritonitis (tenderness) and marked systemic inflammatory response (leukocytosis >10,000) have the highest positive likelihood ratios for acute luminal inflammation of the vermiform appendix, warranting double weighting." }
    ],
    low: "Low Probability (Appendicitis Unlikely)",
    lowDesc: "Score 0–4: Appendicitis ruled out with high negative predictive value. Safe for outpatient discharge with safety-net return precautions.",
    intermediate: "Intermediate / Equivocal Risk",
    intermediateDesc: "Score 5–6: Appendicitis possible. Inpatient serial abdominal examinations and diagnostic ultrasound or IV-contrast abdominal CT recommended.",
    high: "High Probability (Probable Appendicitis)",
    highDesc: "Score 7–8: Probable acute appendicitis. Immediate general surgery consultation and cross-sectional imaging indicated.",
    veryHigh: "Very High Probability (Definite Appendicitis)",
    veryHighDesc: "Score 9–10: Extremely high likelihood of acute or gangrenous appendicitis. Direct surgical consultation for urgent appendectomy."
  },
  fr: {
    title: "Score d'Alvarado pour Appendicite Aiguë (MANTRELS)",
    subtitle: "Stratification du risque et protocole diagnostique pour douleur de la fosse iliaque droite",
    migratory: "Migration de la douleur vers la fosse iliaque droite (FID)",
    anorexia: "Anorexie ou acétonurie",
    nausea: "Nausées ou vomissements",
    tenderness: "Défense / douleur vive à la palpation de la FID",
    rebound: "Douleur à la décompression (signe de Blumberg)",
    fever: "Fièvre (température buccale ≥ 37,3°C)",
    leukocytosis: "Hyperleucocytose (GB > 10 000 / µL)",
    shift: "Polynucléose neutrophile (> 75% neutrophiles)",
    yes: "Oui",
    no: "Non",
    result: "Score d'Alvarado Calculé",
    formula: "Score = M(1) + A(1) + N(1) + T(2) + R(1) + E(1) + L(2) + S(1) [Max: 10]",
    clinicalTitle: "Recommandation Diagnostique et Chirurgicale",
    references: "Alvarado A. Ann Emerg Med. 1986;15(5):557-564. (PMID: 3963537). Ohle R, et al. BMC Med. 2011;9:139. (PMID: 22204638).",
    faqs: [
      { question: "Qu'est-ce que le score d'Alvarado ?", answer: "Le score d'Alvarado est une échelle clinique validée sur 10 points pour évaluer la probabilité d'appendicite aiguë devant une douleur aiguë de la fosse iliaque droite." },
      { question: "Comment interpréter les résultats du score d'Alvarado ?", answer: "Score 0-4 : Appendicite peu probable (valeur prédictive négative élevée). Score 5-6 : Risque intermédiaire (surveillance et échographie/scanner). Score 7-8 : Probable appendicite (avis chirurgical urgent). Score 9-10 : Appendicite quasi certaine (indication chirurgicale directe)." },
      { question: "Pourquoi la douleur en FID et l'hyperleucocytose valent-elles 2 points ?", answer: "La défense focalisée en FID et une élévation franche des leucocytes possèdent les meilleurs rapports de vraisemblance diagnostiques, justifiant une pondération double (+2 points)." }
    ],
    low: "Faible Probabilité (Appendicite Peu Probable)",
    lowDesc: "Score 0–4 : Diagnostic d'appendicite écarté avec haute valeur prédictive négative. Sortie envisageable avec consignes de retour claires.",
    intermediate: "Risque Intermédiaire / Doute Clinique",
    intermediateDesc: "Score 5–6 : Appendicite possible. Surveillance clinique armée et imagerie complémentaire (échographie abdominopelvienne ou scanner avec produit de contraste).",
    high: "Forte Probabilité (Appendicite Probable)",
    highDesc: "Score 7–8 : Appendicite aiguë probable. Avis chirurgical urgent et confirmation scannographique recommandée.",
    veryHigh: "Très Haute Probabilité (Appendicite Quasi Certaine)",
    veryHighDesc: "Score 9–10 : Probabilité > 90%. Prise en charge chirurgicale urgente pour appendicectomie."
  }
};

export default function AlvaradoScore({ lang }: { lang: LangCode }) {
  const [migratory, setMigratory] = useState<boolean>(false);
  const [anorexia, setAnorexia] = useState<boolean>(false);
  const [nausea, setNausea] = useState<boolean>(false);
  const [tenderness, setTenderness] = useState<boolean>(false);
  const [rebound, setRebound] = useState<boolean>(false);
  const [fever, setFever] = useState<boolean>(false);
  const [leukocytosis, setLeukocytosis] = useState<boolean>(false);
  const [shift, setShift] = useState<boolean>(false);

  const currentText = translations[lang] || translations.en;

  const score = useMemo(() => {
    let s = 0;
    if (migratory) s += 1;
    if (anorexia) s += 1;
    if (nausea) s += 1;
    if (tenderness) s += 2;
    if (rebound) s += 1;
    if (fever) s += 1;
    if (leukocytosis) s += 2;
    if (shift) s += 1;
    return s;
  }, [migratory, anorexia, nausea, tenderness, rebound, fever, leukocytosis, shift]);

  useEffect(() => {
    trackCalculatorUsage('alvarado-score', lang, score);
  }, [score, lang]);

  const riskTier = useMemo(() => {
    if (score <= 4) {
      return {
        label: currentText.low,
        desc: currentText.lowDesc,
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        scoreColor: 'text-emerald-600',
        barColor: 'bg-emerald-500'
      };
    }
    if (score <= 6) {
      return {
        label: currentText.intermediate,
        desc: currentText.intermediateDesc,
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
        scoreColor: 'text-amber-600',
        barColor: 'bg-amber-500'
      };
    }
    if (score <= 8) {
      return {
        label: currentText.high,
        desc: currentText.highDesc,
        badgeBg: 'bg-orange-50 text-orange-800 border-orange-200',
        scoreColor: 'text-orange-600',
        barColor: 'bg-orange-500'
      };
    }
    return {
      label: currentText.veryHigh,
      desc: currentText.veryHighDesc,
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
      scoreColor: 'text-rose-600',
      barColor: 'bg-rose-600'
    };
  }, [score, currentText]);

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/alvarado-score"
        scoringSystem="Alvarado MANTRELS Appendicitis Criteria"
        howToSteps={[
          lang === 'fr' ? 'Évaluer les 3 symptômes cliniques : migration de la douleur (+1), anorexie (+1), nausées/vomissements (+1).' : 'Assess 3 clinical symptoms: migratory RLQ pain (+1), anorexia (+1), nausea/vomiting (+1).',
          lang === 'fr' ? 'Rechercher les 3 signes physiques : sensibilité FID (+2), rebond (+1), fièvre ≥ 37.3°C (+1).' : 'Examine 3 physical signs: RLQ tenderness (+2), rebound tenderness (+1), pyrexia ≥ 37.3°C (+1).',
          lang === 'fr' ? 'Vérifier la biologie : hyperleucocytose > 10 000 (+2), neutrophiles > 75% (+1).' : 'Check laboratory findings: leukocytosis > 10,000 (+2), neutrophilic left shift > 75% (+1).',
          lang === 'fr' ? 'Sommer les points pour guider la décision : sortie (<5), imagerie/surveillance (5-6), chirurgie (≥7).' : 'Sum points to stratify: discharge (<5), observation/CT (5-6), surgery consult (≥7).'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2">
          <Stethoscope className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Urgences & Chirurgie Digestive' : 'Emergency Medicine & Acute Abdomen'}</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
          {currentText.title}
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2">
              {lang === 'fr' ? 'Critères Cliniques & Biologiques' : 'Clinical & Laboratory Predictors'}
            </h2>

            {/* Criteria switches */}
            <div className="space-y-3">
              {[
                { label: currentText.migratory, pts: "+1", val: migratory, set: setMigratory },
                { label: currentText.anorexia, pts: "+1", val: anorexia, set: setAnorexia },
                { label: currentText.nausea, pts: "+1", val: nausea, set: setNausea },
                { label: currentText.tenderness, pts: "+2", val: tenderness, set: setTenderness, highlight: true },
                { label: currentText.rebound, pts: "+1", val: rebound, set: setRebound },
                { label: currentText.fever, pts: "+1", val: fever, set: setFever },
                { label: currentText.leukocytosis, pts: "+2", val: leukocytosis, set: setLeukocytosis, highlight: true },
                { label: currentText.shift, pts: "+1", val: shift, set: setShift }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => item.set(!item.val)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${item.val ? 'bg-teal-50/80 border-teal-500/80 shadow-sm' : 'bg-gray-50/70 border-gray-200 hover:bg-gray-100/60'}`}
                >
                  <div className="flex items-center gap-3 pr-2">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-all ${item.val ? 'bg-teal-600 text-white' : 'border border-gray-300 bg-white'}`}>
                      {item.val ? '✓' : ''}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.label}</span>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${item.highlight ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-700'}`}>
                    {item.pts}
                  </span>
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
                <span className={`text-5xl md:text-6xl font-extrabold tracking-tight ${score >= 7 ? 'text-rose-400' : score >= 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {score}
                </span>
                <span className="text-xl text-gray-400 font-medium">/ 10 points</span>
              </div>

              {/* Visual Progress Bar */}
              <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${riskTier.barColor}`} 
                  style={{ width: `${(score / 10) * 100}%` }}
                />
              </div>

              <div className={`p-4 rounded-xl border ${riskTier.badgeBg}`}>
                <div className="font-bold text-sm mb-1">{riskTier.label}</div>
                <p className="text-xs leading-relaxed opacity-90">{riskTier.desc}</p>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "Migratory RLQ Pain", value: migratory ? "Present (+1)" : "Absent" },
                  { label: "Anorexia", value: anorexia ? "Present (+1)" : "Absent" },
                  { label: "Nausea/Vomiting", value: nausea ? "Present (+1)" : "Absent" },
                  { label: "RLQ Tenderness", value: tenderness ? "Present (+2)" : "Absent" },
                  { label: "Rebound Pain", value: rebound ? "Present (+1)" : "Absent" },
                  { label: "Pyrexia (Temp ≥37.3°C)", value: fever ? "Present (+1)" : "Absent" },
                  { label: "Leukocytosis (>10,000/µL)", value: leukocytosis ? "Present (+2)" : "Absent" },
                  { label: "Left Shift (>75% PMN)", value: shift ? "Present (+1)" : "Absent" }
                ]}
                results={[
                  { label: "Alvarado Score", value: score, unit: "/ 10" },
                  { label: "Risk Stratification", value: riskTier.label },
                  { label: "Recommended Pathway", value: riskTier.desc }
                ]}
                formula={currentText.formula}
                disclaimer="Clinical decision aid for emergency triage. Does not replace physical examination or surgical consultation."
                references="Alvarado A. Ann Emerg Med. 1986;15(5):557-564."
                lang={lang}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reviewer & Evidence */}
      <div className="mt-12 space-y-6">
        <MedicalReviewerCard reviewer={REVIEWER_EMERGENCY} />
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900 block mb-1">Foundational Evidence & Guidelines:</span>
          <p className="italic mb-2">{currentText.references}</p>
          <div className="flex flex-wrap gap-4 text-teal-700">
            <a href="https://pubmed.ncbi.nlm.nih.gov/3963537/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Alvarado A (1986) Ann Emerg Med <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://pubmed.ncbi.nlm.nih.gov/22204638/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Ohle R et al. (2011) Systematic Review BMC Med <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
