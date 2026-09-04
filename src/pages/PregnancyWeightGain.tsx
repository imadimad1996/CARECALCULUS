import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, ShieldAlert, Heart } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_PEDIATRICS } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Pregnancy Weight Gain Calculator (IOM Guidelines)",
    subtitle: "Estimates healthy gestational weight gain targets and tracking by pre-pregnancy BMI (singleton and twins)",
    unitToggle: "Units",
    metricUnits: "Metric (kg, cm)",
    usUnits: "US (lbs, inches)",
    preWtLabel: "Pre-Pregnancy Weight",
    htLabel: "Height",
    currWtLabel: "Current Weight",
    gaLabel: "Current Gestational Age (Weeks)",
    pregTypeLabel: "Pregnancy Type",
    singleton: "Singleton (1 Fetus)",
    twins: "Twins (2 Fetuses)",
    resultTitle: "Gestational Weight Gain Tracking & Targets",
    bmiLabel: "Pre-Pregnancy BMI",
    actualGainLabel: "Actual Weight Gained",
    expectedGainLabel: "Expected Gain at Current Week",
    totalTargetLabel: "Recommended Total Full-Term Gain",
    rateLabel: "Recommended 2nd/3rd Trimester Rate",
    onTrack: "On Target (Within Healthy IOM Range)",
    onTrackDesc: "Weight gain is tracking within the healthy Institute of Medicine (IOM) target range for gestational age and baseline BMI. Continue balanced maternal nutrition and recommended prenatal physical activity.",
    belowTrack: "Below Target Range (Risk of FGR / SGA)",
    belowTrackDesc: "Weight gain is below recommended IOM guidelines. Inadequate gestational weight gain is associated with increased risk of fetal growth restriction (FGR), small-for-gestational-age (SGA) infants, and preterm birth. Dietary evaluation recommended.",
    aboveTrack: "Above Target Range (Risk of LGA / GDM)",
    aboveTrackDesc: "Weight gain exceeds recommended IOM guidelines. Excessive gestational weight gain increases maternal risks of gestational diabetes (GDM), preeclampsia, cesarean delivery, macrosomia (LGA), and postpartum weight retention.",
    references: "Institute of Medicine (IOM) and National Research Council. Weight Gain During Pregnancy: Reexamining the Guidelines. Washington, DC: The National Academies Press; 2009. ACOG Committee Opinion No. 548: Weight Gain During Pregnancy. Obstet Gynecol. 2013;121(1):210-212.",
    faqs: [
      {
        question: "How is weight gain distributed across trimesters?",
        answer: "During the first trimester (weeks 1–13), maternal weight gain is minimal, typically 1.1 to 4.4 lbs (0.5 to 2.0 kg) total for the entire trimester. In the second and third trimesters, fetal growth and amniotic/placental expansion accelerate, requiring steady weekly weight gain based on baseline BMI."
      },
      {
        question: "Should an obese pregnant woman actively diet to lose weight?",
        answer: "No. ACOG and IOM guidelines strictly advise against active caloric restriction or weight loss during pregnancy, as maternal ketonemia can impair fetal neurodevelopment. Instead, obese mothers should aim for controlled, modest weight gain (11–20 lbs / 5–9 kg for singleton) under obstetric and nutritional guidance."
      }
    ]
  },
  fr: {
    title: "Prise de Poids pendant la Grossesse (Normes IOM)",
    subtitle: "Calcule les objectifs de prise de poids gestationnelle selon l'IMC préconceptionnel (grossesses uniques et gémellaires)",
    unitToggle: "Unités",
    metricUnits: "Métrique (kg, cm)",
    usUnits: "US (lbs, pouces)",
    preWtLabel: "Poids Pré-Grossesse",
    htLabel: "Taille",
    currWtLabel: "Poids Actuel",
    gaLabel: "Âge Gestationnel Actuel (Semaines d'Aménorrhée)",
    pregTypeLabel: "Type de Grossesse",
    singleton: "Grossesse Unique",
    twins: "Grossesse Gémellaire",
    resultTitle: "Suivi & Objectifs de Prise de Poids Gestationnelle",
    bmiLabel: "IMC Pré-Grossesse",
    actualGainLabel: "Prise de Poids Actuelle",
    expectedGainLabel: "Prise Attendue à ce Terme",
    totalTargetLabel: "Objectif Total Recommandé à Terme",
    rateLabel: "Rythme Conseillé aux 2e et 3e Trimestres",
    onTrack: "Prise de Poids Conforme aux Recommandations",
    onTrackDesc: "L'évolution pondérale s'inscrit parfaitement dans la fourchette recommandée par l'IOM pour ce terme et cet IMC initial. Poursuivre une alimentation équilibrée et une activité physique adaptée.",
    belowTrack: "Prise de Poids Insuffisante (Risque de RCIU)",
    belowTrackDesc: "La prise de poids est inférieure aux recommandations. Une prise insuffisante majore le risque de petit poids de naissance (RCIU/PAG) et de prématurité. Un bilan diététique est préconisé.",
    aboveTrack: "Prise de Poids Excessive (Risque de Macrosomie / Diabète)",
    aboveTrackDesc: "La prise de poids dépasse les recommandations. Une prise excessive expose à un sur-risque de diabète gestationnel, prééclampsie, césarienne et macrosomie fœtale.",
    references: "Recommandations IOM 2009 et CNGOF / ACOG 2013 sur la prise de poids pendant la grossesse.",
    faqs: [
      {
        question: "Comment se répartit la prise de poids au cours de la grossesse ?",
        answer: "Au 1er trimestre, la prise est faible (0,5 à 2 kg au total). Aux 2e et 3e trimestres, le gain est régulier (environ 300 à 500 g par semaine selon l'IMC initial)."
      },
      {
        question: "Une femme enceinte obèse doit-elle perdre du poids ?",
        answer: "Non, les régimes restrictifs sont formellement proscrits car ils entraînent une cétose délétère pour le cerveau fœtal. L'objectif est une prise de poids modérée et encadrée (5 à 9 kg à terme)."
      }
    ]
  }
};

export default function PregnancyWeightGain({ lang }: { lang: LangCode }) {
  const t = translations[lang] || translations.en;

  const [isUs, setIsUs] = useState<boolean>(false);
  const [preWeight, setPreWeight] = useState<string>('62'); // kg or lbs
  const [height, setHeight] = useState<string>('165'); // cm or in
  const [currWeight, setCurrWeight] = useState<string>('68'); // kg or lbs
  const [gestWeeks, setGestWeeks] = useState<string>('24'); // weeks
  const [isTwins, setIsTwins] = useState<boolean>(false);

  const calcResults = useMemo(() => {
    let preKg = parseFloat(preWeight) || 0;
    let currKg = parseFloat(currWeight) || 0;
    let htM = (parseFloat(height) || 0) / 100.0;
    const ga = Math.max(1, Math.min(42, parseFloat(gestWeeks) || 1));

    if (isUs) {
      preKg = preKg * 0.453592;
      currKg = currKg * 0.453592;
      htM = ((parseFloat(height) || 0) * 2.54) / 100.0;
    }

    if (preKg <= 0 || htM <= 0 || currKg <= 0) {
      return { bmi: 0, bmiCategory: '', actualGainKg: 0, actualGainDisp: '', targetRange: '', expectedRange: '', status: 'valid', desc: '', title: '', color: 'slate', rate: '' };
    }

    const bmi = preKg / (htM * htM);
    const actualGainKg = currKg - preKg;
    const actualGainLbs = actualGainKg * 2.20462;

    // IOM Guidelines based on BMI:
    let minTotalKg = 11.5;
    let maxTotalKg = 16.0;
    let minRateKg = 0.36; // kg/wk 2nd/3rd tri
    let maxRateKg = 0.45;
    let tri1Min = 0.5;
    let tri1Max = 2.0;
    let cat = 'Normal Weight';

    if (bmi < 18.5) {
      cat = 'Underweight';
      minTotalKg = isTwins ? 16.8 : 12.5;
      maxTotalKg = isTwins ? 24.5 : 18.0;
      minRateKg = 0.45;
      maxRateKg = 0.59;
    } else if (bmi <= 24.9) {
      cat = 'Normal Weight';
      minTotalKg = isTwins ? 16.8 : 11.5;
      maxTotalKg = isTwins ? 24.5 : 16.0;
      minRateKg = 0.36;
      maxRateKg = 0.45;
    } else if (bmi <= 29.9) {
      cat = 'Overweight';
      minTotalKg = isTwins ? 14.1 : 7.0;
      maxTotalKg = isTwins ? 22.7 : 11.5;
      minRateKg = 0.23;
      maxRateKg = 0.32;
      tri1Min = 0.5;
      tri1Max = 1.5;
    } else {
      cat = 'Obese';
      minTotalKg = isTwins ? 11.3 : 5.0;
      maxTotalKg = isTwins ? 19.1 : 9.0;
      minRateKg = 0.18;
      maxRateKg = 0.27;
      tri1Min = 0.5;
      tri1Max = 1.0;
    }

    // Expected gain at gestational week:
    let expMinKg = 0;
    let expMaxKg = 0;
    if (ga <= 13) {
      expMinKg = (tri1Min / 13.0) * ga;
      expMaxKg = (tri1Max / 13.0) * ga;
    } else {
      const weeksPost13 = ga - 13;
      expMinKg = tri1Min + weeksPost13 * minRateKg;
      expMaxKg = tri1Max + weeksPost13 * maxRateKg;
    }

    let statusTitle = t.onTrack;
    let statusDesc = t.onTrackDesc;
    let statusColor = 'emerald';

    if (actualGainKg < expMinKg - 0.5) {
      statusTitle = t.belowTrack;
      statusDesc = t.belowTrackDesc;
      statusColor = 'amber';
    } else if (actualGainKg > expMaxKg + 0.5) {
      statusTitle = t.aboveTrack;
      statusDesc = t.aboveTrackDesc;
      statusColor = 'rose';
    }

    const actualGainDisp = !isUs
      ? `${actualGainKg > 0 ? '+' : ''}${Math.round(actualGainKg * 10) / 10} kg`
      : `${actualGainLbs > 0 ? '+' : ''}${Math.round(actualGainLbs * 10) / 10} lbs`;

    const totalTargetDisp = !isUs
      ? `${minTotalKg} – ${maxTotalKg} kg`
      : `${Math.round(minTotalKg * 2.20462)} – ${Math.round(maxTotalKg * 2.20462)} lbs`;

    const expectedGainDisp = !isUs
      ? `${Math.round(expMinKg * 10) / 10} – ${Math.round(expMaxKg * 10) / 10} kg`
      : `${Math.round(expMinKg * 2.20462 * 10) / 10} – ${Math.round(expMaxKg * 2.20462 * 10) / 10} lbs`;

    const rateDisp = !isUs
      ? `${minRateKg} – ${maxRateKg} kg / week`
      : `${Math.round(minRateKg * 2.20462 * 10) / 10} – ${Math.round(maxRateKg * 2.20462 * 10) / 10} lbs / week`;

    return {
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory: cat,
      actualGainKg,
      actualGainDisp,
      targetRange: totalTargetDisp,
      expectedRange: expectedGainDisp,
      rate: rateDisp,
      title: statusTitle,
      desc: statusDesc,
      color: statusColor
    };
  }, [preWeight, currWeight, height, gestWeeks, isTwins, isUs, t]);

  useEffect(() => {
    trackCalculatorUsage('pregnancy-weight-gain', lang, calcResults.bmi || 0);
  }, [calcResults.bmi, gestWeeks, isTwins, lang]);

  const exportInputs = {
    [t.preWtLabel]: !isUs ? `${preWeight} kg` : `${preWeight} lbs`,
    [t.currWtLabel]: !isUs ? `${currWeight} kg` : `${currWeight} lbs`,
    [t.htLabel]: !isUs ? `${height} cm` : `${height} in`,
    [t.gaLabel]: `${gestWeeks} weeks`,
    [t.pregTypeLabel]: isTwins ? t.twins : t.singleton,
  };
  const toExportList = (obj: Record<string, any>) => Object.entries(obj).map(([label, value]) => ({ label, value: String(value) }));


  const exportResults = {
    [t.bmiLabel]: `${calcResults.bmi} kg/m² (${calcResults.bmiCategory})`,
    [t.actualGainLabel]: calcResults.actualGainDisp,
    [t.expectedGainLabel]: calcResults.expectedRange,
    [t.totalTargetLabel]: calcResults.targetRange,
    [t.resultTitle]: calcResults.title
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CalcPageSchemas
        name={t.title}
        description={t.subtitle}
        path="/pregnancy-weight-gain"
        howToSteps={[
          "Step 1: Enter pre-pregnancy weight, height, current gestational age (weeks), and current weight.",
          "Step 2: Select pregnancy type: Singleton or Twin gestation.",
          "Step 3: Compare actual weight gained against the target range for current gestational age and full-term targets per IOM/ACOG guidelines."
        ]}
        faqs={t.faqs}
      />

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-pink-50 dark:bg-pink-950/60 rounded-xl text-pink-600 dark:text-pink-400">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t.title}</h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setIsUs(false)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[36px] ${
                !isUs ? 'bg-white dark:bg-slate-800 text-pink-600 dark:text-pink-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.metricUnits}
            </button>
            <button
              type="button"
              onClick={() => setIsUs(true)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[36px] ${
                isUs ? 'bg-white dark:bg-slate-800 text-pink-600 dark:text-pink-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.usUnits}
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              {t.preWtLabel} ({!isUs ? 'kg' : 'lbs'})
            </label>
            <input
              type="number"
              step="0.5"
              min="30"
              value={preWeight}
              onChange={(e) => setPreWeight(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              {t.currWtLabel} ({!isUs ? 'kg' : 'lbs'})
            </label>
            <input
              type="number"
              step="0.5"
              min="30"
              value={currWeight}
              onChange={(e) => setCurrWeight(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              {t.htLabel} ({!isUs ? 'cm' : 'in'})
            </label>
            <input
              type="number"
              step="0.5"
              min="40"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              {t.gaLabel}
            </label>
            <input
              type="number"
              min="1"
              max="42"
              value={gestWeeks}
              onChange={(e) => setGestWeeks(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 font-medium"
            />
          </div>
        </div>

        {/* Singleton vs Twins */}
        <div className="mt-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-750/50">
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t.pregTypeLabel}</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsTwins(false)}
              className={`py-2 px-3 text-sm font-semibold rounded-lg border transition-all min-h-[44px] ${
                !isTwins ? 'bg-pink-600 text-white border-pink-600 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {t.singleton}
            </button>
            <button
              type="button"
              onClick={() => setIsTwins(true)}
              className={`py-2 px-3 text-sm font-semibold rounded-lg border transition-all min-h-[44px] ${
                isTwins ? 'bg-pink-600 text-white border-pink-600 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {t.twins}
            </button>
          </div>
        </div>

        {/* Results Box */}
        <div className={`mt-8 p-6 rounded-2xl border ${
          calcResults.color === 'emerald'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
            : calcResults.color === 'amber'
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.resultTitle}</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{calcResults.actualGainDisp}</span>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  (Pre-Pregnancy BMI: {calcResults.bmi} — {calcResults.bmiCategory})
                </span>
              </div>
            </div>
            <div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 ${
                calcResults.color === 'emerald'
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                  : calcResults.color === 'amber'
                  ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                  : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300'
              }`}>
                {calcResults.color === 'emerald' ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                {calcResults.color === 'emerald' ? "ON TARGET" : calcResults.color === 'amber' ? "BELOW TARGET" : "ABOVE TARGET"}
              </span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-white/80 dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-750">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block mb-1">{t.expectedGainLabel}</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">{calcResults.expectedRange}</span>
            </div>
            <div className="p-3 bg-white/80 dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-750">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block mb-1">{t.totalTargetLabel}</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">{calcResults.targetRange}</span>
            </div>
            <div className="p-3 bg-white/80 dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-750">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block mb-1">{t.rateLabel}</span>
              <span className="text-base font-bold text-slate-900 dark:text-white font-mono">{calcResults.rate}</span>
            </div>
          </div>

          <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">
            {calcResults.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {calcResults.desc}
          </p>

          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <ClinicalExportButton
              calculatorName="Pregnancy Weight Gain Calculator"
              inputs={toExportList(exportInputs)}
              results={toExportList(exportResults)}
              formula="IOM (2009) Gestational Weight Gain Targets based on baseline BMI categories"
              disclaimer="Clinical decision aid for perinatal nutrition. Caloric restriction and weight loss are not recommended during pregnancy."
              references={t.references}
              lang={lang}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-pink-600 dark:text-pink-400" />
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

      <MedicalReviewerCard reviewer={REVIEWER_PEDIATRICS} lang={lang} />
    </div>
  );
}
