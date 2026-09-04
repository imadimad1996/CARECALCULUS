import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, ShieldAlert } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_HEPATOLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Child-Pugh Score for Cirrhosis & Surgical Mortality",
    subtitle: "Stratifies chronic liver disease severity, 1- and 2-year survival, and perioperative abdominal surgical risk",
    biliTitle: "Total Bilirubin",
    bili1: "< 2.0 mg/dL (< 34 µmol/L) [1 pt]",
    bili2: "2.0 – 3.0 mg/dL (34 – 50 µmol/L) [2 pts]",
    bili3: "> 3.0 mg/dL (> 50 µmol/L) [3 pts]",
    albTitle: "Serum Albumin",
    alb1: "> 3.5 g/dL (> 35 g/L) [1 pt]",
    alb2: "2.8 – 3.5 g/dL (28 – 35 g/L) [2 pts]",
    alb3: "< 2.8 g/dL (< 28 g/L) [3 pts]",
    inrTitle: "Prothrombin Time / INR",
    inr1: "INR < 1.7 (< 4s prolonged) [1 pt]",
    inr2: "INR 1.7 – 2.3 (4–6s prolonged) [2 pts]",
    inr3: "INR > 2.3 (> 6s prolonged) [3 pts]",
    ascitesTitle: "Ascites",
    asc1: "None [1 pt]",
    asc2: "Mild / Controlled with Diuretics [2 pts]",
    asc3: "Moderate to Severe / Refractory [3 pts]",
    encephTitle: "Hepatic Encephalopathy",
    enc1: "None [1 pt]",
    enc2: "Grade 1 – 2 (Confusion, asterixis) [2 pts]",
    enc3: "Grade 3 – 4 (Somnolence, stupor, coma) [3 pts]",
    resultTitle: "Child-Pugh Class & Survival Prognostication",
    scoreLabel: "Total Child-Pugh Score",
    points: "points",
    surv1Yr: "1-Year Survival",
    surv2Yr: "2-Year Survival",
    periopRisk: "Perioperative Surgical Mortality",
    classA: "Class A (Score 5 – 6) — Well-Compensated Cirrhosis",
    classADesc: "Well-compensated chronic liver disease. 1-year survival ~100%, 2-year survival ~85%. Elective abdominal surgery carries acceptable risk (~10% perioperative mortality).",
    classB: "Class B (Score 7 – 9) — Significant Functional Compromise",
    classBDesc: "Moderate decompensation. 1-year survival ~80%, 2-year survival ~60%. Abdominal surgery carries significant risk (~30% mortality); optimize medical therapy and consider liver transplantation evaluation.",
    classC: "Class C (Score 10 – 15) — Severe Decompensated Cirrhosis",
    classCDesc: "Severe end-stage liver decompensation. 1-year survival drops to ~45%, 2-year survival ~35%. Elective surgery is strictly contraindicated due to 70–80% perioperative mortality. Urgent liver transplant evaluation indicated.",
    references: "Pugh RN, Murray-Lyon IM, Dawson JL, Pietroni MC, Williams R. Transection of the oesophagus for bleeding oesophageal varices. Br J Surg. 1973;60(8):646-649. (PMID: 4541913). European Association for the Study of the Liver (EASL) Clinical Practice Guidelines on Decompensated Cirrhosis. J Hepatol. 2018;69(2):406-460.",
    faqs: [
      {
        question: "When should Child-Pugh be used versus MELD 3.0?",
        answer: "The Child-Pugh score provides an intuitive bedside clinical assessment of cirrhosis compensation (including ascites and encephalopathy) and remains the standard for grading surgical perioperative risk and pharmacologic drug dosing in hepatic impairment. MELD 3.0 is used primarily for objective liver transplant waitlist prioritization."
      },
      {
        question: "What are the special cutoffs for Primary Biliary Cholangitis (PBC)?",
        answer: "In cholestatic diseases like PBC or PSC, bilirubin clearance is impaired early; bilirubin cutoffs are adjusted to < 4 mg/dL (1 pt), 4–10 mg/dL (2 pts), and > 10 mg/dL (3 pts)."
      }
    ]
  },
  fr: {
    title: "Score de Child-Pugh (Cirrhose & Risque Chirurgical)",
    subtitle: "Évalue la sévérité de la cirrhose hépatique, la survie à 1 et 2 ans et la mortalité périopératoire",
    biliTitle: "Bilirubine Totale",
    bili1: "< 34 µmol/L (< 2,0 mg/dL) [1 pt]",
    bili2: "34 – 50 µmol/L (2,0 – 3,0 mg/dL) [2 pts]",
    bili3: "> 50 µmol/L (> 3,0 mg/dL) [3 pts]",
    albTitle: "Albuminémie",
    alb1: "> 35 g/L (> 3,5 g/dL) [1 pt]",
    alb2: "28 – 35 g/L (2,8 – 3,5 g/dL) [2 pts]",
    alb3: "< 28 g/L (< 2,8 g/dL) [3 pts]",
    inrTitle: "Taux de Prothrombine / INR",
    inr1: "INR < 1,7 (TP > 50%) [1 pt]",
    inr2: "INR 1,7 – 2,3 (TP 30–50%) [2 pts]",
    inr3: "INR > 2,3 (TP < 30%) [3 pts]",
    ascitesTitle: "Ascite",
    asc1: "Absente [1 pt]",
    asc2: "Minime / Contrôlée par Diurétiques [2 pts]",
    asc3: "Moyenne à Sévère / Réfractaire [3 pts]",
    encephTitle: "Encéphalopathie Hépatique",
    enc1: "Absente [1 pt]",
    enc2: "Grade 1 – 2 (Confusion, astérixis) [2 pts]",
    enc3: "Grade 3 – 4 (Somnolence, stupeur, coma) [3 pts]",
    resultTitle: "Classe de Child-Pugh & Pronostic de Survie",
    scoreLabel: "Score Total de Child-Pugh",
    points: "points",
    surv1Yr: "Survie à 1 an",
    surv2Yr: "Survie à 2 ans",
    periopRisk: "Mortalité Chirurgicale Abdominale",
    classA: "Classe A (Score 5 – 6) — Cirrhose Compensée",
    classADesc: "Hépatopathie chronique bien compensée. Survie à 1 an ~100%, à 2 ans ~85%. Chirurgie abdominale élective envisageable avec un risque opératoire modéré (~10%).",
    classB: "Classe B (Score 7 – 9) — Insuffisance Hépatique Modérée",
    classBDesc: "Cirrhose décompensée modérée. Survie à 1 an ~80%, à 2 ans ~60%. Mortalité périopératoire élevée (~30%). Bilan de transplantation hépatique à discuter.",
    classC: "Classe C (Score 10 – 15) — Cirrhose Sévère Décompensée",
    classCDesc: "Insuffisance hépatique terminale. Survie à 1 an ~45%, à 2 ans ~35%. Chirurgie élective formellement contre-indiquée (mortalité 70–80%). Transplantation hépatique urgente.",
    references: "Pugh RN, et al. Transection of the oesophagus for bleeding oesophageal varices. Br J Surg. 1973;60(8):646-649. Recommandations EASL 2018 Cirrhose Décompensée.",
    faqs: [
      {
        question: "Quand utiliser Child-Pugh plutôt que le MELD 3.0 ?",
        answer: "Le score de Child-Pugh reste la référence pour l'adaptation posologique des médicaments, l'évaluation du risque opératoire abdominal et le suivi clinique des décompensations (ascite, encéphalopathie)."
      },
      {
        question: "Quelles sont les cibles dans la cirrhose biliaire primitive ?",
        answer: "Dans la CBP, les seuils de bilirubine sont décalés à < 70 µmol/L (4 mg/dL), 70–170 µmol/L et > 170 µmol/L (10 mg/dL)."
      }
    ]
  }
};

export default function ChildPughDetailed({ lang }: { lang: LangCode }) {
  const t = translations[lang] || translations.en;

  const [biliPts, setBiliPts] = useState<number>(1);
  const [albPts, setAlbPts] = useState<number>(1);
  const [inrPts, setInrPts] = useState<number>(1);
  const [ascitesPts, setAscitesPts] = useState<number>(1);
  const [encephPts, setEncephPts] = useState<number>(1);

  const totalScore = useMemo(() => biliPts + albPts + inrPts + ascitesPts + encephPts, [biliPts, albPts, inrPts, ascitesPts, encephPts]);

  const classInfo = useMemo(() => {
    if (totalScore <= 6) {
      return {
        cls: 'Class A',
        name: t.classA,
        desc: t.classADesc,
        s1: '100%',
        s2: '85%',
        periop: '~10%',
        color: 'emerald'
      };
    }
    if (totalScore <= 9) {
      return {
        cls: 'Class B',
        name: t.classB,
        desc: t.classBDesc,
        s1: '80%',
        s2: '60%',
        periop: '~30%',
        color: 'amber'
      };
    }
    return {
      cls: 'Class C',
      name: t.classC,
      desc: t.classCDesc,
      s1: '45%',
      s2: '35%',
      periop: '70% – 80%',
      color: 'rose'
    };
  }, [totalScore, t]);

  useEffect(() => {
    trackCalculatorUsage('child-pugh-decompensated', lang, totalScore);
  }, [totalScore, classInfo.cls, lang]);

  const exportInputs = {
    [t.biliTitle]: `${biliPts} pts`,
    [t.albTitle]: `${albPts} pts`,
    [t.inrTitle]: `${inrPts} pts`,
    [t.ascitesTitle]: `${ascitesPts} pts`,
    [t.encephTitle]: `${encephPts} pts`,
  };
  const toExportList = (obj: Record<string, any>) => Object.entries(obj).map(([label, value]) => ({ label, value: String(value) }));


  const exportResults = {
    [t.scoreLabel]: `${totalScore} / 15 ${t.points} (${classInfo.cls})`,
    [t.resultTitle]: classInfo.name,
    [t.surv1Yr]: classInfo.s1,
    [t.surv2Yr]: classInfo.s2,
    [t.periopRisk]: classInfo.periop
  };

  const sections = [
    {
      title: t.biliTitle,
      val: biliPts,
      setVal: setBiliPts,
      options: [
        { val: 1, label: t.bili1 },
        { val: 2, label: t.bili2 },
        { val: 3, label: t.bili3 },
      ]
    },
    {
      title: t.albTitle,
      val: albPts,
      setVal: setAlbPts,
      options: [
        { val: 1, label: t.alb1 },
        { val: 2, label: t.alb2 },
        { val: 3, label: t.alb3 },
      ]
    },
    {
      title: t.inrTitle,
      val: inrPts,
      setVal: setInrPts,
      options: [
        { val: 1, label: t.inr1 },
        { val: 2, label: t.inr2 },
        { val: 3, label: t.inr3 },
      ]
    },
    {
      title: t.ascitesTitle,
      val: ascitesPts,
      setVal: setAscitesPts,
      options: [
        { val: 1, label: t.asc1 },
        { val: 2, label: t.asc2 },
        { val: 3, label: t.asc3 },
      ]
    },
    {
      title: t.encephTitle,
      val: encephPts,
      setVal: setEncephPts,
      options: [
        { val: 1, label: t.enc1 },
        { val: 2, label: t.enc2 },
        { val: 3, label: t.enc3 },
      ]
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CalcPageSchemas
        name={t.title}
        description={t.subtitle}
        path="/child-pugh-decompensated"
        howToSteps={[
          "Step 1: Score serum total bilirubin, albumin, and INR (1 to 3 points each).",
          "Step 2: Score clinical complications: presence of ascites and hepatic encephalopathy (1 to 3 points each).",
          "Step 3: Sum points (5–15) to classify into Child-Pugh Class A (5–6), B (7–9), or C (10–15) with corresponding 1- and 2-year survival."
        ]}
        faqs={t.faqs}
      />

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-orange-50 dark:bg-orange-950/60 rounded-xl text-orange-600 dark:text-orange-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t.title}</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1">{t.subtitle}</p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {sections.map((sec, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-750/50">
              <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-3">{sec.title}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {sec.options.map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => sec.setVal(opt.val)}
                    className={`p-3 text-sm font-medium rounded-xl border transition-all text-center min-h-[48px] ${
                      sec.val === opt.val
                        ? 'bg-orange-600 border-orange-600 text-white shadow-sm font-bold'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Results Box */}
        <div className={`mt-8 p-6 rounded-2xl border ${
          classInfo.color === 'emerald'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
            : classInfo.color === 'amber'
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.resultTitle}</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{totalScore}</span>
                <span className="text-xl text-slate-600 dark:text-slate-300 font-bold">/ 15 {t.points}</span>
                <span className="text-lg font-bold text-orange-600 dark:text-orange-400 ml-2">({classInfo.cls})</span>
              </div>
            </div>
            <div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 ${
                classInfo.color === 'emerald'
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                  : classInfo.color === 'amber'
                  ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                  : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300'
              }`}>
                {classInfo.color === 'emerald' ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                {classInfo.cls.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-white/80 dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-750 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block mb-1">{t.surv1Yr}</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{classInfo.s1}</span>
            </div>
            <div className="p-3 bg-white/80 dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-750 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block mb-1">{t.surv2Yr}</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{classInfo.s2}</span>
            </div>
            <div className="p-3 bg-white/80 dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-750 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block mb-1">{t.periopRisk}</span>
              <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400">{classInfo.periop}</span>
            </div>
          </div>

          <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">
            {classInfo.name}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {classInfo.desc}
          </p>

          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <ClinicalExportButton
              calculatorName="Child-Pugh Score Calculator"
              inputs={toExportList(exportInputs)}
              results={toExportList(exportResults)}
              formula="Child-Pugh = Bilirubin (1-3) + Albumin (1-3) + INR (1-3) + Ascites (1-3) + Encephalopathy (1-3)"
              disclaimer="Clinical staging of liver cirrhosis. Correlates with surgical abdominal perioperative mortality and actuarial survival."
              references={t.references}
              lang={lang}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-orange-600 dark:text-orange-400" />
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

      <MedicalReviewerCard reviewer={REVIEWER_HEPATOLOGY} lang={lang} />
    </div>
  );
}
