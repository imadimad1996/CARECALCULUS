import React, { useState, useMemo, useEffect } from 'react';
import { Brain, Info, BookOpen, Copy } from 'lucide-react';
import { LangCode, Translations } from '../types';
import SEO from '../components/SEO';
import { JsonLd } from '../components/JsonLd';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';

const translations: Translations = {
  en: {
    title: "Pediatric Glasgow Coma Scale (pGCS)",
    subtitle: "Validated consciousness score for infants (<1 year) and young children (1-4 years)",
    ageGroup: "Patient Age Group",
    infant: "Infant (< 1 Year)",
    child: "Child (1 - 4 Years)",
    eyeOpening: "Eye Opening Response (E)",
    e4: "4 - Spontaneous",
    e3: "3 - To speech / sound",
    e2: "2 - To pain / stimulation",
    e1: "1 - None / No response",
    verbal: "Verbal Response (V)",
    v5_infant: "5 - Coos, babbles, normal vocalization",
    v4_infant: "4 - Irritable cry, consolable",
    v3_infant: "3 - Cries to pain, persistent crying",
    v2_infant: "2 - Moans to pain, grunts",
    v1_infant: "1 - None / No response",
    v5_child: "5 - Appropriate words, smiles, follows objects",
    v4_child: "4 - Inappropriate words, confused, crying",
    v3_child: "3 - Cries / screams to pain",
    v2_child: "2 - Grunts to pain, moans",
    v1_child: "1 - None / No response",
    motor: "Motor Response (M)",
    m6_infant: "6 - Normal spontaneous movements",
    m5_infant: "5 - Withdraws to touch / localizes pain",
    m4_infant: "4 - Withdraws to pain",
    m3_infant: "3 - Abnormal flexion (decorticate)",
    m2_infant: "2 - Extension to pain (decerebrate)",
    m1_infant: "1 - None / Flaccid",
    m6_child: "6 - Obeys commands / normal motion",
    m5_child: "5 - Localizes pain",
    m4_child: "4 - Withdraws to pain",
    m3_child: "3 - Abnormal flexion (decorticate)",
    m2_child: "2 - Extension to pain (decerebrate)",
    m1_child: "1 - None / Flaccid",
    result: "Calculated Pediatric GCS",
    formula: "pGCS = Eye Opening (E) + Verbal Response (V) + Motor Response (M)",
    mild: "Mild Head Injury / Normal (13-15)",
    moderate: "Moderate Head Injury (9-12)",
    severe: "Severe Head Injury / Intubate (3-8)",
    clinicalTitle: "Clinical Guidance & Airway Management",
    clinicalText: "Score 13-15 indicates mild trauma; 9-12 indicates moderate trauma requiring CT scan; ≤8 indicates severe coma requiring prompt airway securing (intubation threshold).",
    references: "References: Teasdale G, Jennett B. Assessment of coma and impaired consciousness. Lancet 1974; Simpson DA et al. Pediatric Coma Scale. Child Brain 1982.",
  },
  fr: {
    title: "Échelle de Glasgow Pédiatrique (pGCS)",
    subtitle: "Score de conscience validé chez le nourrisson (<1 an) et le jeune enfant (1-4 ans)",
    ageGroup: "Groupe d'âge du patient",
    infant: "Nourrisson (< 1 An)",
    child: "Enfant (1 - 4 Ans)",
    eyeOpening: "Ouverture des yeux (E)",
    e4: "4 - Spontanée",
    e3: "3 - Au bruit / à la voix",
    e2: "2 - À la douleur / stimulation",
    e1: "1 - Nulle / Aucune réponse",
    verbal: "Réponse verbale / vocalisation (V)",
    v5_infant: "5 - Gazouille, babille, sons normaux",
    v4_infant: "4 - Cris irritables mais consolable",
    v3_infant: "3 - Crie à la douleur, pleurs inhabituels",
    v2_infant: "2 - Gémissements à la douleur, grognements",
    v1_infant: "1 - Nulle / Aucune réponse",
    v5_child: "5 - Mots appropriés, sourit, fixe du regard",
    v4_child: "4 - Mots inappropriés, confus, pleure",
    v3_child: "3 - Crie / hurle à la douleur",
    v2_child: "2 - Gémissements à la douleur",
    v1_child: "1 - Nulle / Aucune réponse",
    motor: "Réponse motrice (M)",
    m6_infant: "6 - Mouvements spontanés normaux",
    m5_infant: "5 - Retrait au toucher / localise",
    m4_infant: "4 - Évitement à la douleur",
    m3_infant: "3 - Flexion anormale (décortication)",
    m2_infant: "2 - Extension à la douleur (décérébration)",
    m1_infant: "1 - Nulle / Flasque",
    m6_child: "6 - Obéit aux ordres / mouvements normaux",
    m5_child: "5 - Localise la douleur",
    m4_child: "4 - Évitement à la douleur",
    m3_child: "3 - Flexion anormale (décortication)",
    m2_child: "2 - Extension à la douleur (décérébration)",
    m1_child: "1 - Nulle / Flasque",
    result: "Score pGCS Calculé",
    formula: "pGCS = Ouverture yeux (E) + Réponse verbale (V) + Réponse motrice (M)",
    mild: "Traumatisme léger / Normal (13-15)",
    moderate: "Traumatisme modéré (9-12)",
    severe: "Traumatisme sévère / Intubation (3-8)",
    clinicalTitle: "Recommandations Cliniques & Voies Aériennes",
    clinicalText: "Score 13-15 : traumatisme léger ; 9-12 : traumatisme modéré (TDM indiqué) ; ≤ 8 : coma grave imposant la protection immédiate des voies aériennes (intubation).",
    references: "Références : Teasdale G, Jennett B. Assessment of coma. Lancet 1974 ; Simpson DA et al. Pediatric Coma Scale. Child Brain 1982.",
  }
};

export default function PediatricGcs({ lang }: { lang: LangCode }) {
  const [ageGroup, setAgeGroup] = useState<'infant' | 'child'>('infant');
  const [eye, setEye] = useState<number>(4);
  const [verbal, setVerbal] = useState<number>(5);
  const [motor, setMotor] = useState<number>(6);

  const t = translations[lang];

  const score = useMemo(() => eye + verbal + motor, [eye, verbal, motor]);

  useEffect(() => {
    trackCalculatorUsage('PediatricGcs', lang, score);
  }, [lang, score]);

  const interpretation = useMemo(() => {
    if (score >= 13) return { text: t.mild, color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    if (score >= 9) return { text: t.moderate, color: 'bg-amber-50 text-amber-800 border-amber-200' };
    return { text: t.severe, color: 'bg-rose-50 text-rose-800 border-rose-200' };
  }, [score, t]);

  const ehrSummary = `pGCS (${ageGroup === 'infant' ? 'Infant' : 'Child'}): E${eye} V${verbal} M${motor} = Total ${score}/15 (${interpretation.text})`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <SEO logicalPath="/pediatric-gcs" lang={lang} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["SoftwareApplication", "MedicalWebPage"],
        "name": t.title,
        "description": t.subtitle,
        "medicalAudience": { "@type": "MedicalAudience", "audienceType": "Pediatricians, ER Doctors, ICU Nurses" }
      }} />

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-teal-50 text-teal-600">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t.title}</h1>
            <p className="text-sm text-slate-500">{t.subtitle}</p>
          </div>
        </div>

        {/* Age Selector */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">{t.ageGroup}</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setAgeGroup('infant')}
              className={`py-2.5 px-4 rounded-xl text-xs font-extrabold border transition-all ${
                ageGroup === 'infant'
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t.infant}
            </button>
            <button
              onClick={() => setAgeGroup('child')}
              className={`py-2.5 px-4 rounded-xl text-xs font-extrabold border transition-all ${
                ageGroup === 'child'
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t.child}
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-6">
          {/* Eye Opening */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">{t.eyeOpening}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { val: 4, label: t.e4 },
                { val: 3, label: t.e3 },
                { val: 2, label: t.e2 },
                { val: 1, label: t.e1 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setEye(opt.val)}
                  className={`p-3 rounded-xl text-xs font-bold text-left border transition-all ${
                    eye === opt.val
                      ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Verbal */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">{t.verbal}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(ageGroup === 'infant'
                ? [
                    { val: 5, label: t.v5_infant },
                    { val: 4, label: t.v4_infant },
                    { val: 3, label: t.v3_infant },
                    { val: 2, label: t.v2_infant },
                    { val: 1, label: t.v1_infant },
                  ]
                : [
                    { val: 5, label: t.v5_child },
                    { val: 4, label: t.v4_child },
                    { val: 3, label: t.v3_child },
                    { val: 2, label: t.v2_child },
                    { val: 1, label: t.v1_child },
                  ]
              ).map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setVerbal(opt.val)}
                  className={`p-3 rounded-xl text-xs font-bold text-left border transition-all ${
                    verbal === opt.val
                      ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Motor */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">{t.motor}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(ageGroup === 'infant'
                ? [
                    { val: 6, label: t.m6_infant },
                    { val: 5, label: t.m5_infant },
                    { val: 4, label: t.m4_infant },
                    { val: 3, label: t.m3_infant },
                    { val: 2, label: t.m2_infant },
                    { val: 1, label: t.m1_infant },
                  ]
                : [
                    { val: 6, label: t.m6_child },
                    { val: 5, label: t.m5_child },
                    { val: 4, label: t.m4_child },
                    { val: 3, label: t.m3_child },
                    { val: 2, label: t.m2_child },
                    { val: 1, label: t.m1_child },
                  ]
              ).map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setMotor(opt.val)}
                  className={`p-3 rounded-xl text-xs font-bold text-left border transition-all ${
                    motor === opt.val
                      ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result Card */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className={`p-6 rounded-2xl border ${interpretation.color} space-y-4`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider">{t.result}</span>
                <div className="text-4xl font-black tracking-tight">{score} <span className="text-lg font-bold opacity-75">/ 15</span></div>
                <div className="text-sm font-extrabold mt-1">{interpretation.text}</div>
              </div>
              <ClinicalExportButton
                calculatorName={t.title}
                inputs={[
                  { label: t.ageGroup, value: ageGroup === 'infant' ? t.infant : t.child },
                  { label: t.eyeOpening, value: eye },
                  { label: t.verbal, value: verbal },
                  { label: t.motor, value: motor },
                ]}
                results={[{ label: t.result, value: `${score}/15 (${interpretation.text})` }]}
                lang={lang}
              />
            </div>
          </div>
        </div>

        {/* Evidence & References */}
        <div className="mt-8 space-y-4 text-xs text-slate-600 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-teal-600" />
            {t.clinicalTitle}
          </h3>
          <p>{t.clinicalText}</p>
          <p className="font-mono text-[11px] text-slate-500">{t.references}</p>
        </div>
      </div>
    </div>
  );
}
