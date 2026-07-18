import React, { useState, useMemo, useEffect } from 'react';
import { Activity, AlertTriangle, Syringe, HeartPulse } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd } from '../components/JsonLd';
import ClinicalContextPanel from '../components/ClinicalContextPanel';

const translations: Translations = {
  en: {
    title: "Weight-Based Heparin Dosing Nomogram",
    subtitle: "Standard and low-dose IV heparin protocols for VTE and ACS",
    weightLabel: "Weight (kg)",
    indicationLabel: "Clinical Indication",
    vte: "VTE / Pulmonary Embolism (Standard Protocol)",
    acs: "ACS / STEMI / NSTEMI (Low-Dose Protocol)",
    bolusTitle: "Initial IV Bolus",
    infusionTitle: "Initial IV Infusion",
    units: "Units",
    unitsHr: "Units/hr",
    clinicalTitle: "Clinical Context",
    pearls: [
      "Always verify local hospital protocols, as heparin concentration and rounding rules may vary.",
      "Obtain a baseline aPTT, PT/INR, and CBC (platelets) prior to initiating heparin.",
      "Check aPTT 6 hours after the initial bolus and adjust the drip according to the nomogram."
    ],
    pitfalls: [
      "Do NOT use the standard VTE protocol for patients with Acute Coronary Syndrome (ACS); they require the lower-dose protocol (60 U/kg bolus, 12 U/kg/hr infusion).",
      "Heparin is high-risk. Over-bolusing can cause severe bleeding. In obese patients, consider using an adjusted or ideal body weight depending on local protocol."
    ],
    evidence: "VTE Protocol: Bolus 80 Units/kg. Infusion 18 Units/kg/hr.\nACS Protocol: Bolus 60 Units/kg (Max 4,000 U). Infusion 12 Units/kg/hr (Max 1,000 U/hr).",
    references: "Raschke RA, Reilly BM, Guidry JR, Fontana JR, Srinivas S. The weight-based heparin dosing nomogram compared with a 'standard care' nomogram. A randomized controlled trial. Ann Intern Med. 1993;119(9):874-81."
  },
  fr: {
    title: "Dosage de l'Héparine selon le Poids",
    subtitle: "Protocoles d'héparine IV pour MTEV et SCA",
    weightLabel: "Poids (kg)",
    indicationLabel: "Indication Clinique",
    vte: "MTEV / Embolie Pulmonaire (Protocole Standard)",
    acs: "SCA / STEMI / NSTEMI (Protocole Faible Dose)",
    bolusTitle: "Bolus IV Initial",
    infusionTitle: "Perfusion IV Initiale",
    units: "Unités",
    unitsHr: "Unités/h",
    clinicalTitle: "Contexte Clinique",
    pearls: [
      "Vérifiez toujours les protocoles de l'hôpital local, car la concentration d'héparine et les règles d'arrondi peuvent varier.",
      "Obtenez un TCA, TP/INR et une numération plaquettaire (NFS) de base avant d'initier l'héparine.",
      "Vérifiez le TCA 6 heures après le bolus initial et ajustez la perfusion selon le nomogramme."
    ],
    pitfalls: [
      "NE PAS utiliser le protocole MTEV standard pour les patients atteints de syndrome coronarien aigu (SCA) ; ils nécessitent le protocole à faible dose.",
      "L'héparine est à haut risque. Un bolus excessif peut provoquer des saignements sévères."
    ],
    evidence: "Protocole MTEV : Bolus 80 Unités/kg. Perfusion 18 Unités/kg/h.\nProtocole SCA : Bolus 60 Unités/kg (Max 4 000 U). Perfusion 12 Unités/kg/h (Max 1 000 U/h).",
    references: "Raschke RA, Reilly BM, Guidry JR, Fontana JR, Srinivas S. The weight-based heparin dosing nomogram compared with a 'standard care' nomogram. A randomized controlled trial. Ann Intern Med. 1993;119(9):874-81."
  }
};

export default function HeparinDosing({ lang }: { lang: LangCode }) {
  const [weight, setWeight] = useState<string>('70');
  const [protocol, setProtocol] = useState<'vte' | 'acs'>('vte');

  const currentText = translations[lang] || translations.en;
  const w = parseFloat(weight) || 0;

  const result = useMemo(() => {
    if (w <= 0) return null;
    let bolus = 0;
    let infusion = 0;

    if (protocol === 'vte') {
      bolus = Math.round(w * 80);
      infusion = Math.round(w * 18);
    } else {
      bolus = Math.min(Math.round(w * 60), 4000);
      infusion = Math.min(Math.round(w * 12), 1000);
    }

    return { bolus, infusion };
  }, [w, protocol]);

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('heparin-dosing', lang, result.bolus);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [result, lang]);

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "MedicalWebPage",
            "@id": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}heparin-dosing`,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}heparin-dosing`,
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "inLanguage": lang
          },
          {
            "@type": "MedicalCalculator",
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}heparin-dosing`,
            "relevantSpecialty": {
              "@type": "MedicalSpecialty",
              "name": "Internal Medicine"
            }
          }
        ]
      }} />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-rose-500/5 via-red-500/5 to-orange-500/5 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-3xl mb-12 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100/50 border border-rose-200 text-rose-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Syringe className="w-3.5 h-3.5" />
          <span>Internal Medicine / Cardiology</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          {currentText.title as string}
        </h1>
        <p className="text-slate-600 text-base md:text-lg max-w-2xl leading-relaxed">
          {currentText.subtitle as string}
        </p>
        <div className="mt-4 flex gap-3">
          <EmbedCodeButton calculatorSlug="heparin-dosing" lang={lang} title={currentText.title as string} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="space-y-6">
              
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">
                  {currentText.indicationLabel as string}
                </label>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => setProtocol('vte')}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                      protocol === 'vte' 
                        ? 'border-rose-500 bg-rose-50/50 text-rose-900' 
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Activity className={`w-5 h-5 ${protocol === 'vte' ? 'text-rose-500' : 'text-slate-400'}`} />
                    <span className="font-medium text-sm">{currentText.vte as string}</span>
                  </button>
                  <button
                    onClick={() => setProtocol('acs')}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                      protocol === 'acs' 
                        ? 'border-rose-500 bg-rose-50/50 text-rose-900' 
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <HeartPulse className={`w-5 h-5 ${protocol === 'acs' ? 'text-rose-500' : 'text-slate-400'}`} />
                    <span className="font-medium text-sm">{currentText.acs as string}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">
                  {currentText.weightLabel as string}
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all font-mono text-lg"
                  placeholder="70"
                />
              </div>

            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 sticky top-24">
            
            {result !== null ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border text-rose-800 bg-rose-500/10 border-rose-500/20 relative overflow-hidden group">
                    <div className="text-sm font-bold opacity-80 mb-1">{currentText.bolusTitle as string}</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold tracking-tight">{result.bolus}</span>
                      <span className="text-sm font-semibold opacity-80">{currentText.units as string}</span>
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl border text-orange-800 bg-orange-500/10 border-orange-500/20 relative overflow-hidden group">
                    <div className="text-sm font-bold opacity-80 mb-1">{currentText.infusionTitle as string}</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold tracking-tight">{result.infusion}</span>
                      <span className="text-sm font-semibold opacity-80">{currentText.unitsHr as string}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 font-medium">
                    {lang === 'fr' 
                      ? 'L\'héparine est un médicament à haut risque. Vérifiez avec les protocoles hospitaliers (arrondis, maximums de dose, nomogrammes cibles TCA) avant l\'administration.' 
                      : 'Heparin is a high-alert medication. Cross-reference with hospital protocols (rounding, dose caps, target aPTT nomograms) before administration.'}
                  </p>
                </div>

                <ClinicalExportButton
                  title={currentText.title as string}
                  inputs={[
                    { label: currentText.indicationLabel as string, value: protocol === 'vte' ? currentText.vte as string : currentText.acs as string },
                    { label: currentText.weightLabel as string, value: weight }
                  ]}
                  results={[
                    { label: currentText.bolusTitle as string, value: `${result.bolus} ${currentText.units as string}` },
                    { label: currentText.infusionTitle as string, value: `${result.infusion} ${currentText.unitsHr as string}` }
                  ]}
                  disclaimer={lang === 'fr' ? "Ceci est un outil d'aide à la décision. Il ne remplace pas le jugement clinique." : "This tool is for decision support only and does not replace clinical judgment."}
                  references={currentText.references as string}
                  lang={lang}
                />
              </div>
            ) : (
              <div className="py-12 px-4 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 font-medium text-sm flex flex-col items-center gap-3">
                <Syringe className="w-8 h-8 opacity-20" />
                {lang === 'fr' 
                  ? "Entrez le poids du patient pour calculer le dosage" 
                  : "Enter patient weight to calculate dosing"}
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
