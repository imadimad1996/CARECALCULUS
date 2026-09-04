import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, ShieldAlert, Pill } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_INTERNAL_MEDICINE } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Ganzoni Formula for Iron Deficit",
    subtitle: "Calculates cumulative elemental iron deficit to guide intravenous iron replacement therapy",
    wtLabel: "Patient Weight (kg)",
    actualHbLabel: "Actual Hemoglobin (g/dL)",
    targetHbLabel: "Target Hemoglobin (g/dL)",
    depotLabel: "Iron Depot / Storage (mg)",
    depotHint: "Standard adult depot is 500 mg (or 15 mg/kg if weight < 35 kg)",
    resultTitle: "Total Elemental Iron Deficit & Dosing",
    deficitLabel: "Total Elemental Iron Deficit",
    points: "mg",
    fcmLabel: "Ferric Carboxymaltose (Injectafer/Ferinject)",
    venoLabel: "Iron Sucrose (Venofer)",
    derisoLabel: "Ferric Derisomaltose (Monoferric)",
    dosingTitle: "Practical IV Infusion Regimen Planning",
    references: "Ganzoni AM. Intravenous iron-dextran: therapeutic and experimental possibilities. Schweiz Med Wochenschr. 1970;100(49):1962-1963. (PMID: 5493035). Auerbach M, Macdougall I. The available intravenous iron formulations: History, efficacy, and safety. Am J Hematol. 2017;92(5):486-492.",
    faqs: [
      {
        question: "What is the factor 2.4 in the Ganzoni formula?",
        answer: "The factor 2.4 equals 0.0034 (fraction of iron in hemoglobin, ~0.34%) multiplied by 0.07 (normal blood volume as a fraction of body weight, ~70 mL/kg) multiplied by 10,000 (conversion factor from g/dL to mg/L)."
      },
      {
        question: "Can the total iron deficit be administered in a single infusion?",
        answer: "It depends on the chosen IV formulation. High-molecular-weight and modern matrix complexes such as Ferric Derisomaltose (Monoferric) or Ferric Carboxymaltose (Injectafer) allow single large infusions of 1,000 mg over 15–30 minutes. Older formulations like Iron Sucrose (Venofer) are limited to 200–300 mg per session to avoid labile free iron toxicity."
      }
    ]
  },
  fr: {
    title: "Formule de Ganzoni (Déficit en Fer & Fer IV)",
    subtitle: "Calcule le déficit cumulé en fer élémentaire pour guider la posologie du fer injectable par voie intraveineuse",
    wtLabel: "Poids du Patient (kg)",
    actualHbLabel: "Hémoglobine Actuelle (g/dL)",
    targetHbLabel: "Hémoglobine Cible (g/dL)",
    depotLabel: "Réserves en Fer / Dépôt (mg)",
    depotHint: "La réserve standard chez l'adulte est de 500 mg (ou 15 mg/kg si poids < 35 kg)",
    resultTitle: "Déficit Total en Fer & Schémas d'Administration",
    deficitLabel: "Déficit Total en Fer Élémentaire",
    points: "mg",
    fcmLabel: "Carboxymaltose Ferrique (Ferinject)",
    venoLabel: "Saccharate de Fer (Venofer)",
    derisoLabel: "Isomaltoside Ferrique (Monoferric)",
    dosingTitle: "Planification des Perfusions de Fer IV",
    references: "Ganzoni AM. Schweiz Med Wochenschr. 1970;100(49):1962-1963. Auerbach M, et al. Am J Hematol. 2017.",
    faqs: [
      {
        question: "D'où vient le coefficient 2,4 dans la formule de Ganzoni ?",
        answer: "Ce facteur résulte du produit de la teneur en fer de l'hémoglobine (0,34%), de la volémie rapportée au poids corporel (7%) et d'un facteur d'harmonisation des unités."
      },
      {
        question: "Peut-on perfuser tout le fer en une seule fois ?",
        answer: "Cela dépend de la molécule. Le carboxymaltose ferrique (Ferinject) ou le fer isomaltoside autorisent de fortes doses uniques (jusqu'à 1000 mg par perfusion). Le saccharate de fer (Venofer) est limité à 200 mg par séance pour éviter le relargage toxique de fer libre."
      }
    ]
  }
};

export default function GanzoniIronDeficit({ lang }: { lang: LangCode }) {
  const t = translations[lang] || translations.en;

  const [weight, setWeight] = useState<string>('70');
  const [actualHb, setActualHb] = useState<string>('8.5');
  const [targetHb, setTargetHb] = useState<string>('15.0');
  const [depot, setDepot] = useState<string>('500');

  const { totalDeficit, fcmDoses, venoDoses } = useMemo(() => {
    const wt = parseFloat(weight) || 0;
    const act = parseFloat(actualHb) || 0;
    const tgt = parseFloat(targetHb) || 0;
    const dep = parseFloat(depot) || 500;

    if (wt <= 0 || act <= 0 || tgt <= act) {
      return { totalDeficit: 0, fcmDoses: '0', venoDoses: '0' };
    }

    // Ganzoni Formula:
    // Iron deficit [mg] = Weight [kg] * (Target Hb - Actual Hb) [g/dL] * 2.4 + Depot [mg]
    const deficitHb = wt * (tgt - act) * 2.4;
    const total = Math.round(deficitHb + dep);

    // Dosing breakdowns:
    // Ferric Carboxymaltose: usually 1000 mg max per single dose
    const fcmCount = Math.ceil(total / 1000);
    // Venofer: usually 200 mg per session
    const venoCount = Math.ceil(total / 200);

    return {
      totalDeficit: total,
      fcmDoses: `${fcmCount} ${lang === 'fr' ? 'perfusion(s) de ≤1000 mg' : 'infusion(s) of ≤1000 mg'}`,
      venoDoses: `${venoCount} ${lang === 'fr' ? 'perfusions de 200 mg' : 'infusions of 200 mg'}`
    };
  }, [weight, actualHb, targetHb, depot, lang]);

  useEffect(() => {
    trackCalculatorUsage('ganzoni-formula', lang, totalDeficit);
  }, [totalDeficit, weight, actualHb, targetHb, lang]);

  const exportInputs = {
    [t.wtLabel]: `${weight} kg`,
    [t.actualHbLabel]: `${actualHb} g/dL`,
    [t.targetHbLabel]: `${targetHb} g/dL`,
    [t.depotLabel]: `${depot} mg`,
  };
  const toExportList = (obj: Record<string, any>) => Object.entries(obj).map(([label, value]) => ({ label, value: String(value) }));


  const exportResults = {
    [t.deficitLabel]: `${totalDeficit} ${t.points}`,
    [t.fcmLabel]: fcmDoses,
    [t.venoLabel]: venoDoses,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CalcPageSchemas
        name={t.title}
        description={t.subtitle}
        path="/ganzoni-formula"
        howToSteps={[
          "Step 1: Enter patient body weight (kg), current hemoglobin (g/dL), and target hemoglobin (typically 15 g/dL).",
          "Step 2: Confirm iron storage depot (default 500 mg for adults).",
          "Step 3: Calculate cumulative iron deficit (mg) and plan appropriate IV infusion aliquots based on formulation."
        ]}
        faqs={t.faqs}
      />

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-red-50 dark:bg-red-950/60 rounded-xl text-red-600 dark:text-red-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t.title}</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1">{t.subtitle}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t.wtLabel}</label>
            <input
              type="number"
              step="0.5"
              min="1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 text-lg font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t.actualHbLabel}</label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="20"
              value={actualHb}
              onChange={(e) => setActualHb(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 text-lg font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t.targetHbLabel}</label>
            <input
              type="number"
              step="0.1"
              min="10"
              max="18"
              value={targetHb}
              onChange={(e) => setTargetHb(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 text-lg font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-1">{t.depotLabel}</label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{t.depotHint}</p>
            <input
              type="number"
              step="50"
              min="0"
              value={depot}
              onChange={(e) => setDepot(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 text-lg font-medium"
            />
          </div>
        </div>

        {/* Results Box */}
        <div className="mt-8 p-6 rounded-2xl border bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.resultTitle}</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{totalDeficit}</span>
                <span className="text-xl text-red-600 dark:text-red-400 font-bold">{t.points} elemental iron</span>
              </div>
            </div>
            <div>
              <span className="px-4 py-2 rounded-full text-sm font-bold bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-300 flex items-center gap-1.5">
                <Pill className="w-5 h-5" />
                IV IRON REPLACEMENT
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-red-200/80 dark:border-red-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">{t.dosingTitle}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-white/80 dark:bg-slate-900/70 rounded-xl border border-red-200/60 dark:border-red-800/60">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">{t.fcmLabel}:</span>
                <span className="font-mono font-bold text-red-600 dark:text-red-400 text-base">{fcmDoses}</span>
              </div>
              <div className="p-3 bg-white/80 dark:bg-slate-900/70 rounded-xl border border-red-200/60 dark:border-red-800/60">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">{t.venoLabel}:</span>
                <span className="font-mono font-bold text-red-600 dark:text-red-400 text-base">{venoDoses}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <ClinicalExportButton
              calculatorName="Ganzoni Iron Deficit Calculator"
              inputs={toExportList(exportInputs)}
              results={toExportList(exportResults)}
              formula="Total Iron Deficit = [Weight (kg) × (Target Hb - Actual Hb) × 2.4] + Depot (500 mg)"
              disclaimer="Clinical dosing aid. Adjust single infusion maximums according to institutional pharmacy protocols and specific IV iron compound labels."
              references={t.references}
              lang={lang}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-red-600 dark:text-red-400" />
          {lang === 'fr' ? "Questions Fréquentes (FAQ)" : "Frequently Asked Questions"}
        </h2>
        <div className="space-y-4">
          {t.faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-1">{faq.question}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <MedicalReviewerCard reviewer={REVIEWER_INTERNAL_MEDICINE} lang={lang} />
    </div>
  );
}
