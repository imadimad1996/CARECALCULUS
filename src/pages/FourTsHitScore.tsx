import React, { useState, useMemo, useEffect } from 'react';
import { AlertOctagon, Info } from 'lucide-react';
import { LangCode, Translations } from '../types';
import SEO from '../components/SEO';
import { JsonLd } from '../components/JsonLd';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';

const translations: Translations = {
  en: {
    title: "4Ts Score for Heparin-Induced Thrombocytopenia (HIT)",
    subtitle: "Pre-test probability score for diagnosing Heparin-Induced Thrombocytopenia",
    t1: "1. Thrombocytopenia",
    t1_2: "2 - Drop > 50% AND nadir ≥ 20 x 10⁹/L",
    t1_1: "1 - Drop 30-50% OR nadir 10-19 x 10⁹/L",
    t1_0: "0 - Drop < 30% OR nadir < 10 x 10⁹/L",
    t2: "2. Timing of Platelet Count Fall",
    t2_2: "2 - Clear onset Days 5-10 (or ≤1 day if heparin exposure within 30 days)",
    t2_1: "1 - Onset > Day 10 OR timing unclear (or ≤1 day if heparin exposure 31-100 days ago)",
    t2_0: "0 - Onset < Day 4 without recent heparin exposure",
    t3: "3. Thrombosis or Other Sequelae",
    t3_2: "3 - New confirmed thrombosis, skin necrosis, or acute systemic reaction post-IV bolus",
    t3_1: "1 - Progressive / recurrent thrombosis, erythematous skin lesions, unconfirmed suspected thrombosis",
    t3_0: "0 - None",
    t4: "4. oTher Cause for Thrombocytopenia",
    t4_2: "2 - No other cause evident",
    t4_1: "1 - Possible other cause evident",
    t4_0: "0 - Definite alternative cause present (e.g. sepsis, DIC, post-cardiopulmonary bypass)",
    result: "Calculated 4Ts Score",
    lowRisk: "Low Probability (Score 0 - 3): NPV > 99%",
    modRisk: "Intermediate Probability (Score 4 - 5): ~14% HIT Risk",
    highRisk: "High Probability (Score 6 - 8): ~64% HIT Risk",
    clinicalTitle: "Management & Action Plan",
    clinicalText: "For Low Risk (0-3): Stop HIT workup; continue/resume Heparin if indicated. For Intermediate/High Risk (4-8): IMMEDIATELY DISCONTINUE ALL HEPARIN (including flushes) and initiate non-heparin anticoagulant (Argatroban, Bivalirudin, or Fondaparinux). Send anti-PF4/heparin immunoassay.",
    references: "References: Lo GK et al. Evaluation of pretest clinical score (4 Ts) for heparin-induced thrombocytopenia. J Thromb Haemost 2006; ASH HIT Guidelines 2018.",
  },
  fr: {
    title: "Score des 4T pour la Thrombopénie Induite par l'Héparine (TIH)",
    subtitle: "Score de probabilité pré-test pour le diagnostic de la TIH",
    t1: "1. Thrombopénie (Chute des plaquettes)",
    t1_2: "2 - Chute > 50% ET nadir ≥ 20 x 10⁹/L",
    t1_1: "1 - Chute 30-50% OU nadir 10-19 x 10⁹/L",
    t1_0: "0 - Chute < 30% OU nadir < 10 x 10⁹/L",
    t2: "2. Timing (Délai d'apparition)",
    t2_2: "2 - Début net à J5-J10 (ou ≤1 jour si héparine reçue dans les 30 derniers jours)",
    t2_1: "1 - Début > J10 OU délai flou (ou ≤1 jour si héparine reçue il y a 31-100 jours)",
    t2_0: "0 - Début < J4 sans exposition récente à l'héparine",
    t3: "3. Thrombose ou autres séquelles",
    t3_2: "3 - Thrombose confirmée, nécrose cutanée ou réaction systémique aiguë après bolus",
    t3_1: "1 - Thrombose récidivante/progressive, lésions érythémateuses, thrombose suspectée",
    t3_0: "0 - Aucune",
    t4: "4. oTher (Autre cause de thrombopénie)",
    t4_2: "2 - Aucune autre cause évidente",
    t4_1: "1 - Autre cause possible",
    t4_0: "0 - Autre cause évidente (ex: sepsis, CIVD, choc)",
    result: "Score des 4T Calculé",
    lowRisk: "Faible probabilité (Score 0 - 3) : VPN > 99%",
    modRisk: "Probabilité intermédiaire (Score 4 - 5) : Risk ~14%",
    highRisk: "Forte probabilité (Score 6 - 8) : Risk ~64%",
    clinicalTitle: "Prise en Charge Clinique",
    clinicalText: "Si risque faible (0-3) : TIH très improbable, maintenir/reprendre l'héparine. Si risque intermédiaire ou fort (4-8) : ARRETER IMMEDIATEMENT TOUTE HEPAINE (y compris rênçages) et débuter un anticoagulant non héparinique (Argatroban, Danaparoïde, Fondaparinux). Demander la recherche d'anticorps anti-FP4.",
    references: "Références : Lo GK et al. J Thromb Haemost 2006 ; Recommandations ASH sur la TIH 2018.",
  }
};

export default function FourTsHitScore({ lang }: { lang: LangCode }) {
  const [t1, setT1] = useState<number>(2);
  const [t2, setT2] = useState<number>(2);
  const [t3, setT3] = useState<number>(0);
  const [t4, setT4] = useState<number>(2);

  const t = translations[lang] || translations.en;

  const score = useMemo(() => t1 + t2 + t3 + t4, [t1, t2, t3, t4]);

  useEffect(() => {
    trackCalculatorUsage('FourTsHitScore', lang, score);
  }, [lang, score]);

  const risk = useMemo(() => {
    if (score >= 6) return { text: t.highRisk, color: 'bg-rose-50 text-rose-900 border-rose-200' };
    if (score >= 4) return { text: t.modRisk, color: 'bg-amber-50 text-amber-900 border-amber-200' };
    return { text: t.lowRisk, color: 'bg-emerald-50 text-emerald-900 border-emerald-200' };
  }, [score, t]);

  const ehrSummary = `4Ts HIT Score: ${score}/8 (${risk.text}) [T1:${t1}, T2:${t2}, T3:${t3}, T4:${t4}]`;

  return (
    <div className="w-full max-w-full max-w-4xl mx-auto space-y-8 pb-12">
      <SEO logicalPath="/four-ts-hit-score" lang={lang} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["SoftwareApplication", "MedicalWebPage"],
        "name": t.title,
        "description": t.subtitle,
      }} />

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t.title}</h1>
            <p className="text-sm text-slate-500">{t.subtitle}</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">{t.t1}</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { val: 2, label: t.t1_2 },
                { val: 1, label: t.t1_1 },
                { val: 0, label: t.t1_0 },
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setT1(opt.val)}
                  className={`p-3 rounded-xl text-xs font-bold text-left border transition-all ${
                    t1 === opt.val ? 'bg-amber-50 border-amber-500 text-amber-950' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">{t.t2}</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { val: 2, label: t.t2_2 },
                { val: 1, label: t.t2_1 },
                { val: 0, label: t.t2_0 },
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setT2(opt.val)}
                  className={`p-3 rounded-xl text-xs font-bold text-left border transition-all ${
                    t2 === opt.val ? 'bg-amber-50 border-amber-500 text-amber-950' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">{t.t3}</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { val: 2, label: t.t3_2 },
                { val: 1, label: t.t3_1 },
                { val: 0, label: t.t3_0 },
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setT3(opt.val)}
                  className={`p-3 rounded-xl text-xs font-bold text-left border transition-all ${
                    t3 === opt.val ? 'bg-amber-50 border-amber-500 text-amber-950' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">{t.t4}</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { val: 2, label: t.t4_2 },
                { val: 1, label: t.t4_1 },
                { val: 0, label: t.t4_0 },
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setT4(opt.val)}
                  className={`p-3 rounded-xl text-xs font-bold text-left border transition-all ${
                    t4 === opt.val ? 'bg-amber-50 border-amber-500 text-amber-950' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className={`p-6 rounded-2xl border ${risk.color} space-y-4`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider">{t.result}</span>
                <div className="text-4xl font-black tracking-tight">{score} <span className="text-lg font-bold opacity-75">/ 8</span></div>
                <div className="text-sm font-extrabold mt-1">{risk.text}</div>
              </div>
              <ClinicalExportButton
                calculatorName={t.title}
                inputs={[
                  { label: t.t1, value: t1 },
                  { label: t.t2, value: t2 },
                  { label: t.t3, value: t3 },
                  { label: t.t4, value: t4 },
                ]}
                results={[{ label: t.result, value: `${score}/8 (${risk.text})` }]}
                lang={lang}
              />
            </div>
          </div>
        </div>

        {/* Clinical Action */}
        <div className="mt-8 space-y-3 text-xs text-slate-600 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600" />
            {t.clinicalTitle}
          </h3>
          <p>{t.clinicalText}</p>
          <p className="font-mono text-[11px] text-slate-400">{t.references}</p>
        </div>
      </div>
    </div>
  );
}
