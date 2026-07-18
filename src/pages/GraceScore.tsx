import React, { useState, useMemo, useEffect } from 'react';
import { HeartPulse, Activity, AlertTriangle, CheckSquare, Square } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd } from '../components/JsonLd';
import ClinicalContextPanel from '../components/ClinicalContextPanel';

const translations: Translations = {
  en: {
    title: "GRACE Score (ACS Risk)",
    subtitle: "Estimates admission-to-6-month mortality for patients with Acute Coronary Syndrome",
    clinicalDefinition: "The GRACE (Global Registry of Acute Coronary Events) score is a validated clinical risk stratification tool used to estimate the 6-month admission-to-mortality risk in patients presenting with acute coronary syndrome (ACS), including STEMI, NSTEMI, and unstable angina. It integrates physiological continuous variables—such as age, heart rate, systolic blood pressure, and creatinine—with Killip class and biomarker elevation to objectively guide early invasive strategies.",
    ageLabel: "Age (years)",
    hrLabel: "Heart Rate (bpm)",
    sbpLabel: "Systolic BP (mmHg)",
    crLabel: "Creatinine (mg/dL)",
    killipLabel: "Killip Class",
    killipOptions: [
      { v: 0, l: 'I (No heart failure)' },
      { v: 1, l: 'II (S3 gallop, rales, JVD)' },
      { v: 2, l: 'III (Frank pulmonary edema)' },
      { v: 3, l: 'IV (Cardiogenic shock)' }
    ],
    checks: [
      { id: 'arrest', label: 'Cardiac arrest at admission' },
      { id: 'st', label: 'ST-segment deviation' },
      { id: 'enzymes', label: 'Elevated cardiac enzymes / markers' }
    ],
    resultTitle: "GRACE Score",
    riskTitle: "In-Hospital Mortality Risk",
    clinicalTitle: "Clinical Context",
    pearls: [
      "In emergency and ICU settings, a GRACE score > 140 dictates an early invasive strategy (coronary angiography < 24 hours) per AHA/ACC guidelines.",
      "The GRACE score is demonstrably more accurate than the TIMI score because it utilizes continuous physiological variables (age, HR, BP, Cr) rather than blunt dichotomous cutoffs.",
      "Killip class independently drives mortality risk; a patient in cardiogenic shock (Killip IV) automatically accumulates massive risk points, overriding minor variables."
    ],
    pitfalls: [
      "Contraindicated for undifferentiated chest pain. The GRACE score is exclusively validated for patients with suspected or electrocardiographically confirmed Acute Coronary Syndrome (ACS).",
      "Renal function caveats: The nomogram specifically requires serum creatinine in mg/dL. Ensure proper conversion if your laboratory reports in µmol/L (1 mg/dL = 88.4 µmol/L).",
      "Do not recalculate dynamically to assess recovery; it is designed for risk stratification at the time of initial admission."
    ],
    evidence: "<b>Risk Strata for In-Hospital Mortality:</b><br/>• Low Risk (< 109 pts): < 1% mortality.<br/>• Intermediate Risk (109-140 pts): 1-3% mortality.<br/>• High Risk (> 140 pts): > 3% mortality.<br/><br/><i>Validated in over 100,000 patients across global registries, GRACE remains the gold standard for ACS mortality prediction.</i>",
    references: "Granger CB, et al. Predictors of hospital mortality in the global registry of acute coronary events. Arch Intern Med. 2003;163(19):2345-53."
  },
  fr: {
    title: "Score de GRACE (SCA)",
    subtitle: "Estime la mortalité intra-hospitalière à 6 mois pour les Syndromes Coronariens Aigus",
    clinicalDefinition: "Le score GRACE (Global Registry of Acute Coronary Events) est un outil clinique validé de stratification du risque, utilisé pour estimer la mortalité à 6 mois chez les patients présentant un syndrome coronarien aigu (SCA). Il intègre des variables physiologiques continues (âge, fréquence cardiaque, pression artérielle, créatinine) à la classe de Killip et à l'élévation des biomarqueurs pour guider de manière objective les stratégies invasives précoces.",
    ageLabel: "Âge (ans)",
    hrLabel: "Fréq. Cardiaque (bpm)",
    sbpLabel: "PA Systolique (mmHg)",
    crLabel: "Créatinine (mg/dL)",
    killipLabel: "Classe de Killip",
    killipOptions: [
      { v: 0, l: 'I (Pas d\'insuffisance cardiaque)' },
      { v: 1, l: 'II (Bruit B3, crépitants, turgescence jugulaire)' },
      { v: 2, l: 'III (Œdème aigu du poumon)' },
      { v: 3, l: 'IV (Choc cardiogénique)' }
    ],
    checks: [
      { id: 'arrest', label: 'Arrêt cardiaque à l\'admission' },
      { id: 'st', label: 'Déviation du segment ST' },
      { id: 'enzymes', label: 'Marqueurs cardiaques élevés (Troponine)' }
    ],
    resultTitle: "Score de GRACE",
    riskTitle: "Risque de mortalité intra-hospitalière",
    clinicalTitle: "Contexte Clinique",
    pearls: [
      "Un score GRACE > 140 impose une stratégie invasive précoce (coronarographie < 24h) selon les recommandations de l'ESC et de l'AHA.",
      "Le score GRACE est nettement plus précis que le score TIMI car il exploite des variables physiologiques continues au lieu de simples seuils arbitraires.",
      "La classe de Killip est un moteur majeur du risque ; un choc cardiogénique augmente drastiquement la mortalité."
    ],
    pitfalls: [
      "Contre-indiqué pour les douleurs thoraciques non différenciées. Ce score est exclusivement validé pour le Syndrome Coronarien Aigu (SCA) suspecté ou confirmé.",
      "Attention à la fonction rénale : ce nomogramme exige une créatinine en mg/dL. Convertissez si votre laboratoire utilise des µmol/L (1 mg/dL = 88.4 µmol/L)."
    ],
    evidence: "<b>Stratification du risque de mortalité intra-hospitalière :</b><br/>• Risque Faible (< 109 pts) : < 1%.<br/>• Risque Intermédiaire (109-140 pts) : 1-3%.<br/>• Risque Élevé (> 140 pts) : > 3%.<br/><br/><i>Validé sur plus de 100 000 patients, le score GRACE est le standard de référence pour le pronostic du SCA.</i>",
    references: "Granger CB, et al. Predictors of hospital mortality in the global registry of acute coronary events. Arch Intern Med. 2003;163(19):2345-53."
  }
};

export default function GraceScore({ lang }: { lang: LangCode }) {
  const [age, setAge] = useState<string>('65');
  const [hr, setHr] = useState<string>('85');
  const [sbp, setSbp] = useState<string>('120');
  const [cr, setCr] = useState<string>('1.0');
  const [killip, setKillip] = useState<number>(0);
  const [checks, setChecks] = useState<Record<string, boolean>>({
    arrest: false,
    st: false,
    enzymes: false
  });

  const currentText = translations[lang] || translations.en;
  
  const toggleCheck = (id: string) => {
    setChecks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const a = parseFloat(age) || 0;
  const h = parseFloat(hr) || 0;
  const s = parseFloat(sbp) || 0;
  const c = parseFloat(cr) || 0;

  const score = useMemo(() => {
    if (!a || !h || !s || !c) return null;
    let pts = 0;

    // Age
    if (a < 30) pts += 0;
    else if (a <= 39) pts += 0;
    else if (a <= 49) pts += 18;
    else if (a <= 59) pts += 36;
    else if (a <= 69) pts += 55;
    else if (a <= 79) pts += 73;
    else if (a <= 89) pts += 91;
    else pts += 100;

    // HR
    if (h < 50) pts += 0;
    else if (h <= 69) pts += 3;
    else if (h <= 89) pts += 9;
    else if (h <= 109) pts += 15;
    else if (h <= 149) pts += 24;
    else if (h <= 199) pts += 38;
    else pts += 46;

    // SBP
    if (s < 80) pts += 58;
    else if (s <= 99) pts += 53;
    else if (s <= 119) pts += 43;
    else if (s <= 139) pts += 34;
    else if (s <= 159) pts += 24;
    else if (s <= 199) pts += 10;
    else pts += 0;

    // Cr
    if (c <= 0.39) pts += 1;
    else if (c <= 0.79) pts += 4;
    else if (c <= 1.19) pts += 7;
    else if (c <= 1.59) pts += 10;
    else if (c <= 1.99) pts += 13;
    else if (c <= 3.99) pts += 21;
    else pts += 28;

    // Killip
    if (killip === 1) pts += 20;
    else if (killip === 2) pts += 39;
    else if (killip === 3) pts += 59;

    // Booleans
    if (checks.arrest) pts += 39;
    if (checks.st) pts += 28;
    if (checks.enzymes) pts += 14;

    return pts;
  }, [a, h, s, c, killip, checks]);

  const riskAssessment = useMemo(() => {
    if (score === null) return null;
    if (score <= 108) return { risk: lang === 'fr' ? 'Faible (< 1%)' : 'Low (< 1%)', color: 'bg-green-50 border-green-200 text-green-900' };
    if (score <= 140) return { risk: lang === 'fr' ? 'Intermédiaire (1 - 3%)' : 'Intermediate (1 - 3%)', color: 'bg-amber-50 border-amber-200 text-amber-900' };
    return { risk: lang === 'fr' ? 'Fort (> 3%)' : 'High (> 3%)', color: 'bg-red-50 border-red-200 text-red-900' };
  }, [score, lang]);

  useEffect(() => {
    if (score !== null) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('grace-score', lang, score);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [score, lang]);

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "MedicalWebPage",
            "@id": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}grace-score`,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}grace-score`,
            "name": currentText.title as string,
            "description": (currentText.clinicalDefinition || currentText.subtitle) as string,
            "inLanguage": lang
          },
          {
            "@type": "MedicalCalculator",
            "name": currentText.title as string,
            "description": (currentText.clinicalDefinition || currentText.subtitle) as string,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}grace-score`,
            "relevantSpecialty": {
              "@type": "MedicalSpecialty",
              "name": "Cardiology"
            }
          }
        ]
      }} />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-rose-500/5 via-red-500/5 to-orange-500/5 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-3xl mb-12 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100/50 border border-rose-200 text-rose-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <HeartPulse className="w-3.5 h-3.5" />
          <span>Cardiology / Emergency</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          {currentText.title as string}
        </h1>
        <p className="text-slate-600 text-base md:text-lg max-w-2xl leading-relaxed">
          {currentText.subtitle as string}
        </p>
        {currentText.clinicalDefinition && (
          <p className="mt-4 text-sm text-slate-500 leading-relaxed max-w-3xl border-l-2 border-teal-500 pl-4">
            {currentText.clinicalDefinition as string}
          </p>
        )}
        <div className="mt-6 flex gap-3">
          <EmbedCodeButton calculatorSlug="grace-score" lang={lang} title={currentText.title as string} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{currentText.ageLabel as string}</label>
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 font-mono text-lg" placeholder="65" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{currentText.hrLabel as string}</label>
                  <input type="number" value={hr} onChange={(e) => setHr(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 font-mono text-lg" placeholder="85" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{currentText.sbpLabel as string}</label>
                  <input type="number" value={sbp} onChange={(e) => setSbp(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 font-mono text-lg" placeholder="120" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{currentText.crLabel as string}</label>
                  <input type="number" step="0.1" value={cr} onChange={(e) => setCr(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 font-mono text-lg" placeholder="1.0" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">{currentText.killipLabel as string}</label>
                <div className="space-y-2">
                  {(currentText.killipOptions as any[]).map(opt => (
                    <button
                      key={opt.v}
                      onClick={() => setKillip(opt.v)}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                        killip === opt.v
                          ? 'border-rose-500 bg-rose-50 text-rose-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {(currentText.checks as any[]).map((c: any) => (
                  <button
                    key={c.id}
                    onClick={() => toggleCheck(c.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      checks[c.id] 
                        ? 'border-rose-500 bg-rose-50/50 text-rose-900' 
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`shrink-0 ${checks[c.id] ? 'text-rose-500' : 'text-slate-400'}`}>
                      {checks[c.id] ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-sm">{c.label}</span>
                    </div>
                  </button>
                ))}
              </div>

            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 sticky top-24">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
              {currentText.resultTitle as string}
            </h3>

            {score !== null && riskAssessment ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`p-5 rounded-2xl border relative overflow-hidden group ${riskAssessment.color}`}>
                  <div className="flex items-baseline gap-2 mb-4 justify-center">
                    <span className="text-6xl font-extrabold tracking-tight">{score}</span>
                    <span className="text-xl font-semibold opacity-80">pts</span>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">{currentText.riskTitle as string}</div>
                    <div className="text-2xl font-black">{riskAssessment.risk}</div>
                  </div>
                </div>
                
                {score > 140 && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-rose-800 font-medium">
                      {lang === 'fr' 
                        ? 'Score > 140. Haut risque. Indication forte pour une stratégie invasive précoce (< 24h).' 
                        : 'Score > 140. High risk. Strong indication for early invasive strategy (angiography < 24h).'}
                    </p>
                  </div>
                )}

                <ClinicalExportButton
                  title={currentText.title as string}
                  inputs={[
                    { label: "Age", value: age },
                    { label: "HR", value: hr },
                    { label: "SBP", value: sbp },
                    { label: "Creatinine", value: cr },
                    { label: "Killip Class", value: (currentText.killipOptions as any[])[killip].l },
                    ...(currentText.checks as any[]).map((c: any) => ({
                      label: c.label, value: checks[c.id] ? 'Yes' : 'No'
                    }))
                  ]}
                  results={[
                    { label: currentText.resultTitle as string, value: `${score} pts` },
                    { label: currentText.riskTitle as string, value: riskAssessment.risk }
                  ]}
                  disclaimer={lang === 'fr' ? "Ceci est un outil d'aide à la décision. Il ne remplace pas le jugement clinique." : "This tool is for decision support only and does not replace clinical judgment."}
                  references={currentText.references as string}
                  lang={lang}
                />
              </div>
            ) : (
              <div className="py-12 px-4 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 font-medium text-sm flex flex-col items-center gap-3">
                <Activity className="w-8 h-8 opacity-20" />
                {lang === 'fr' ? "Remplissez toutes les valeurs" : "Fill all values to calculate"}
              </div>
            )}
          </div>
        </div>
      </div>

      <ClinicalContextPanel
        lang={lang}
        pearls={currentText.pearls as string[]}
        pitfalls={currentText.pitfalls as string[]}
        evidence={currentText.evidence as string}
        references={[currentText.references as string]}
      />
    </>
  );
}
