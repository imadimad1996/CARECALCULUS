import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, ShieldAlert } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_INTENSIVIST } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Lactate Clearance in Sepsis Resuscitation",
    subtitle: "Assesses dynamic cellular reperfusion kinetics and adequacy of septic shock resuscitation",
    initLabel: "Baseline / Initial Lactate (mmol/L)",
    subLabel: "Repeat / Follow-up Lactate (mmol/L)",
    hoursLabel: "Time Interval Between Draws (Hours)",
    resultTitle: "Lactate Clearance Kinetics & Prognostic Tier",
    clearanceLabel: "Calculated Lactate Clearance",
    rateLabel: "Clearance Rate per Hour",
    points: "%",
    adequate: "Clearance ≥ 10% — Adequate Resuscitation Response",
    adequateDesc: "Clearance meets the Surviving Sepsis Campaign target (≥ 10% reduction over 2–4 hours). Indicates successful restoration of microvascular tissue perfusion and mitochondrial aerobic metabolism, correlating with significantly reduced 28-day mortality.",
    suboptimal: "Clearance < 10% — Impaired / Sluggish Clearance",
    suboptimalDesc: "Suboptimal clearance (< 10% reduction). Suggests ongoing cellular dysoxia, incomplete microvascular recruitment, or delayed hepatic clearance. Urgent clinical reassessment of volume responsiveness, MAP targets, and cardiac output indicated.",
    worsening: "Negative Clearance (Rising Lactate) — Severe Tissue Dysoxia / Shock",
    worseningDesc: "Worsening hyperlactatemia. Strong predictor of refractory septic shock, multi-organ dysfunction syndrome (MODS), occult mesenteric ischemia, or severe hepatic failure. Re-evaluate source control, inotrope support, and invasive hemodynamics immediately.",
    references: "Nguyen HB, Rivers EP, Knoblich BP, et al. Early lactate clearance is associated with improved outcome in severe sepsis and septic shock. Crit Care Med. 2004;32(8):1637-1642. (PMID: 15286537). Evans L, Rhodes A, Alhazzani W, et al. Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2021. Crit Care Med. 2021;49(11):e1063-e1143.",
    faqs: [
      {
        question: "Why is serial lactate clearance superior to a single static lactate level?",
        answer: "A single baseline lactate reflects the initial severity of illness, but dynamic lactate clearance directly tracks the biological efficacy of therapeutic interventions (fluids, vasopressors, antibiotics). Achieving ≥ 10% clearance every 2 hours has been repeatedly proven to reduce mortality in multicenter randomized trials."
      },
      {
        question: "Can epinephrine infusions elevate lactate without worsening tissue hypoperfusion?",
        answer: "Yes. Epinephrine stimulates beta-2 adrenergic receptors in skeletal muscle, accelerating aerobic glycolysis and producing 'type B' hyperlactatemia without true tissue hypoxia. Clinical context, urine output, and central venous oxygen saturation (ScvO2) help differentiate adrenergic effect from refractory shock."
      }
    ]
  },
  fr: {
    title: "Clairance du Lactate (Réanimation du Sepsis)",
    subtitle: "Évalue la cinétique de reperfusion tissulaire et l'efficacité de la réanimation du choc septique",
    initLabel: "Lactate Initial / Admission (mmol/L)",
    subLabel: "Lactate de Contrôle (mmol/L)",
    hoursLabel: "Délai Entre les Deux Dosages (Heures)",
    resultTitle: "Cinétique de Clairance & Réponse Thérapeutique",
    clearanceLabel: "Clairance du Lactate Calculée",
    rateLabel: "Taux de Clairance par Heure",
    points: "%",
    adequate: "Clairance ≥ 10% — Réponse Thérapeutique Favorable",
    adequateDesc: "Objectif des recommandations internationales Surviving Sepsis Campaign atteint (baisse ≥ 10% en 2 à 4h). Témoigne d'une restauration satisfaisante de la perfusion microcirculatoire, associée à une baisse majeure de la mortalité à J28.",
    suboptimal: "Clairance < 10% — Clairance Insuffisante",
    suboptimalDesc: "Diminution insuffisante du lactate (< 10%). Suggère une hypoperfusion tissulaire persistante ou une clairance hépatique compromise. Réévaluer d'urgence la volémie, la cible de PAM et le débit cardiaque.",
    worsening: "Clairance Négative (Ascension du Lactate) — Hypoxie Tissulaire Sévère",
    worseningDesc: "Majoration de l'hyperlactatémie. Marqueur d'extrême gravité : choc septique réfractaire, ischémie mésentérique occulte ou défaillance multiviscérale. Nécessite une réévaluation hémodynamique et chirurgicale immédiate.",
    references: "Nguyen HB, et al. Early lactate clearance is associated with improved outcome in severe sepsis and septic shock. Crit Care Med. 2004;32(8):1637-1642. Recommandations Surviving Sepsis Campaign 2021.",
    faqs: [
      {
        question: "Pourquoi la clairance dynamique est-elle supérieure à un dosage isolé ?",
        answer: "Un taux unique donne la gravité initiale, mais la clairance cinétique mesure l'efficacité réelle du remplissage et des vasopresseurs en temps réel. Une baisse d'au moins 10% toutes les 2 heures divise le risque de décès."
      },
      {
        question: "L'adrénaline peut-elle faire monter le lactate sans hypoxie ?",
        answer: "Oui. Par stimulation bêta-2 musculaire, l'adrénaline augmente la glycolyse aérobie (lactatémie de type B). Il faut toujours corréler la cinétique à la diurèse, au temps de recoloration cutanée et à la ScvO2."
      }
    ]
  }
};

export default function LactateClearance({ lang }: { lang: LangCode }) {
  const t = translations[lang] || translations.en;

  const [initLactate, setInitLactate] = useState<string>('4.5');
  const [subLactate, setSubLactate] = useState<string>('2.8');
  const [hours, setHours] = useState<string>('2');

  const { clearancePct, ratePerHour, tierInfo } = useMemo(() => {
    const l0 = parseFloat(initLactate) || 0;
    const l1 = parseFloat(subLactate) || 0;
    const h = parseFloat(hours) || 1;

    if (l0 <= 0) {
      return { clearancePct: 0, ratePerHour: 0, tierInfo: { color: 'slate', title: '', desc: '' } };
    }

    // Clearance (%) = [(L0 - L1) / L0] * 100
    const pct = ((l0 - l1) / l0) * 100.0;
    const rate = h > 0 ? pct / h : pct;

    let color = 'emerald';
    let title = t.adequate;
    let desc = t.adequateDesc;

    if (pct < 0) {
      color = 'rose';
      title = t.worsening;
      desc = t.worseningDesc;
    } else if (pct < 10) {
      color = 'amber';
      title = t.suboptimal;
      desc = t.suboptimalDesc;
    }

    return {
      clearancePct: Math.round(pct * 10) / 10,
      ratePerHour: Math.round(rate * 10) / 10,
      tierInfo: { color, title, desc }
    };
  }, [initLactate, subLactate, hours, t]);

  useEffect(() => {
    trackCalculatorUsage('lactate-clearance', lang, clearancePct);
  }, [clearancePct, ratePerHour, hours, lang]);

  const exportInputs = {
    [t.initLabel]: `${initLactate} mmol/L`,
    [t.subLabel]: `${subLactate} mmol/L`,
    [t.hoursLabel]: `${hours} h`,
  };
  const toExportList = (obj: Record<string, any>) => Object.entries(obj).map(([label, value]) => ({ label, value: String(value) }));


  const exportResults = {
    [t.clearanceLabel]: `${clearancePct}%`,
    [t.rateLabel]: `${ratePerHour}% / h`,
    [t.resultTitle]: tierInfo.title
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CalcPageSchemas
        name={t.title}
        description={t.subtitle}
        path="/lactate-clearance"
        howToSteps={[
          "Step 1: Record initial serum/arterial lactate level (mmol/L) at presentation or ICU admission.",
          "Step 2: Measure repeat lactate level 2 to 6 hours after initiating resuscitation bundles.",
          "Step 3: Evaluate clearance percentage. A target reduction ≥ 10% over 2 hours indicates successful cellular reperfusion."
        ]}
        faqs={t.faqs}
      />

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 rounded-xl text-rose-600 dark:text-rose-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t.title}</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1">{t.subtitle}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t.initLabel}</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={initLactate}
              onChange={(e) => setInitLactate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 text-lg font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t.subLabel}</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={subLactate}
              onChange={(e) => setSubLactate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 text-lg font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t.hoursLabel}</label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="24"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 text-lg font-medium"
            />
          </div>
        </div>

        {/* Results Box */}
        <div className={`mt-8 p-6 rounded-2xl border ${
          tierInfo.color === 'emerald'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
            : tierInfo.color === 'amber'
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.resultTitle}</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className={`text-4xl font-extrabold ${
                  clearancePct > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {clearancePct > 0 ? `+${clearancePct}` : clearancePct}%
                </span>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  ({ratePerHour > 0 ? `+${ratePerHour}` : ratePerHour}% / hr)
                </span>
              </div>
            </div>
            <div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 ${
                tierInfo.color === 'emerald'
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                  : tierInfo.color === 'amber'
                  ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                  : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300'
              }`}>
                {tierInfo.color === 'emerald' ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                {clearancePct >= 10 ? "TARGET REACHED (≥ 10%)" : "SUBOPTIMAL CLEARANCE"}
              </span>
            </div>
          </div>

          <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">
            {tierInfo.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {tierInfo.desc}
          </p>

          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <ClinicalExportButton
              calculatorName="Lactate Clearance Calculator"
              inputs={toExportList(exportInputs)}
              results={toExportList(exportResults)}
              formula="Lactate Clearance (%) = [(Initial Lactate - Repeat Lactate) / Initial Lactate] × 100"
              disclaimer="Surviving Sepsis Campaign resuscitation metric. Target ≥ 10% clearance over 2 hours."
              references={t.references}
              lang={lang}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-rose-600 dark:text-rose-400" />
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

      <MedicalReviewerCard reviewer={REVIEWER_INTENSIVIST} lang={lang} />
    </div>
  );
}
