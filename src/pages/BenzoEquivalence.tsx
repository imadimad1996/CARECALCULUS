import React, { useState, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, ArrowRightLeft } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage, trackCalculatorResult } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd, generateMedicalCalculatorSchema } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_PHARMACY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Benzodiazepine Equivalence",
    subtitle: "Calculate equivalent doses of various benzodiazepines",
    fromDrug: "Current Drug (PO)",
    toDrug: "Target Drug (PO)",
    dose: "Current Dose (mg)",
    result: "Equivalent Dose",
    formula: "(Current Dose) × (Target Equiv / Current Equiv)",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "Benzodiazepine equivalencies are approximate. Cross-tolerance is often incomplete, meaning it is generally recommended to reduce the calculated target dose by 25-50% when switching agents to avoid toxicity.",
    pillarTitle: "Usage Guidelines",
    pillarText: [
      "These equivalencies apply primarily to oral (PO) administration.",
      "Half-lives vary significantly between agents (e.g., Diazepam has active metabolites with a half-life >100h, while Midazolam is very short-acting).",
      "Always consider patient age, hepatic function, and concurrent medications."
    ],
    references: "Ashton CH. Benzodiazepines: How they work and how to withdraw. The Ashton Manual. 2002.",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "Should I switch at 100% of the calculated equivalent dose?",
    faqA1: "No. Due to incomplete cross-tolerance, you should typically reduce the new dose by 25-50% and titrate to effect.",
    faqQ2: "Does this apply to IV formulations?",
    faqA2: "No, these are oral (PO) equivalencies. IV dosing, especially for midazolam or lorazepam, has different bioavailability and equivalence.",
  },
  fr: {
    title: "Équivalence des Benzodiazépines",
    subtitle: "Calculer les doses équivalentes de diverses benzodiazépines",
    fromDrug: "Médicament Actuel (PO)",
    toDrug: "Médicament Cible (PO)",
    dose: "Dose Actuelle (mg)",
    result: "Dose Équivalente",
    formula: "(Dose Actuelle) × (Équiv Cible / Équiv Actuel)",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Les équivalences sont approximatives. La tolérance croisée étant souvent incomplète, il est recommandé de réduire la dose calculée de 25 à 50 % lors du changement de molécule.",
    pillarTitle: "Recommandations d'Utilisation",
    pillarText: [
      "Ces équivalences s'appliquent principalement à la voie orale (PO).",
      "Les demi-vies varient considérablement (ex: le Diazépam a des métabolites actifs >100h, le Midazolam est très court).",
      "Toujours tenir compte de l'âge, de la fonction hépatique et des autres traitements."
    ],
    references: "Ashton CH. Benzodiazepines: How they work and how to withdraw. The Ashton Manual. 2002.",
    faqTitle: "Questions Fréquentes",
    faqQ1: "Dois-je prescrire 100% de la dose équivalente ?",
    faqA1: "Non, réduisez généralement la nouvelle dose de 25 à 50 % pour éviter un surdosage lié à une tolérance croisée incomplète.",
    faqQ2: "Cela s'applique-t-il aux formes IV ?",
    faqA2: "Non, ce sont des équivalences orales (PO). La biodisponibilité IV est différente.",
  },
  es: {
    title: "Equivalencia de Benzodiacepinas",
    subtitle: "Calcular dosis equivalentes de varias benzodiacepinas",
    fromDrug: "Fármaco Actual (PO)",
    toDrug: "Fármaco Objetivo (PO)",
    dose: "Dosis Actual (mg)",
    result: "Dosis Equivalente",
    formula: "(Dosis Actual) × (Equiv Objetivo / Equiv Actual)",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "Las equivalencias son aproximadas. La tolerancia cruzada suele ser incompleta, por lo que se recomienda reducir la dosis calculada en un 25-50% al cambiar de fármaco.",
    pillarTitle: "Pautas de Uso",
    pillarText: [
      "Estas equivalencias se aplican principalmente a la vía oral (PO).",
      "Las vidas medias varían significativamente (ej. el Diazepam tiene metabolitos activos con una vida media >100h).",
      "Siempre considere la edad, función hepática y medicación concomitante."
    ],
    references: "Ashton CH. Benzodiazepines: How they work and how to withdraw. The Ashton Manual. 2002.",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Debo cambiar al 100% de la dosis equivalente?",
    faqA1: "No. Se suele recomendar reducir la nueva dosis un 25-50% debido a la tolerancia cruzada incompleta.",
    faqQ2: "¿Esto aplica a formulaciones IV?",
    faqA2: "No, son equivalencias orales (PO). Las dosis IV tienen diferente biodisponibilidad.",
  },
  ar: {
    title: "حاسبة تكافؤ البنزوديازيبينات",
    subtitle: "حساب الجرعات المتكافئة لأنواع مختلفة من البنزوديازيبين",
    fromDrug: "الدواء الحالي (عن طريق الفم)",
    toDrug: "الدواء المستهدف (عن طريق الفم)",
    dose: "الجرعة الحالية (مجم)",
    result: "الجرعة المكافئة",
    formula: "(الجرعة الحالية) × (تكافؤ المستهدف / تكافؤ الحالي)",
    clinicalTitle: "التفسير السريري",
    clinicalText: "حسابات التكافؤ تقريبية. بسبب عدم اكتمال التحمل المتبادل (Cross-tolerance)، يوصى بتقليل الجرعة المحسوبة بنسبة 25-50% عند التبديل لتجنب السمية.",
    pillarTitle: "إرشادات الاستخدام",
    pillarText: [
      "تنطبق هذه الحسابات بشكل أساسي على الأدوية الفموية (PO).",
      "تختلف فترة عمر النصف بشكل كبير (مثال: ديازيبام له مستقلبات نشطة قد تبقى لأكثر من 100 ساعة).",
      "ضع في اعتبارك دائماً عمر المريض، ووظائف الكبد، والأدوية الأخرى."
    ],
    references: "Ashton CH. Benzodiazepines: How they work and how to withdraw. The Ashton Manual. 2002.",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "هل يجب إعطاء 100% من الجرعة المكافئة المحسوبة؟",
    faqA1: "لا. يُنصح عادةً بتخفيض الجرعة الجديدة بنسبة 25-50% وضبطها حسب استجابة المريض.",
    faqQ2: "هل ينطبق هذا على الحقن الوريدي (IV)؟",
    faqA2: "لا، هذه القيم خاصة بالأدوية الفموية. تختلف الفعالية الحيوية والتكافؤ في حالة الحقن الوريدي.",
  }
};

const drugs = [
  { id: 'alprazolam', name: 'Alprazolam (Xanax)', equiv: 0.5 },
  { id: 'chlordiazepoxide', name: 'Chlordiazepoxide (Librium)', equiv: 25 },
  { id: 'clonazepam', name: 'Clonazepam (Klonopin)', equiv: 0.5 },
  { id: 'clorazepate', name: 'Clorazepate (Tranxene)', equiv: 15 },
  { id: 'diazepam', name: 'Diazepam (Valium)', equiv: 10 },
  { id: 'flurazepam', name: 'Flurazepam (Dalmane)', equiv: 15 },
  { id: 'lorazepam', name: 'Lorazepam (Ativan)', equiv: 1 },
  { id: 'oxazepam', name: 'Oxazepam (Serax)', equiv: 20 },
  { id: 'temazepam', name: 'Temazepam (Restoril)', equiv: 20 },
  { id: 'triazolam', name: 'Triazolam (Halcion)', equiv: 0.25 },
];

export default function BenzoEquivalence({ lang }: { lang: LangCode }) {
  const [fromDrug, setFromDrug] = useState<string>('diazepam');
  const [toDrug, setToDrug] = useState<string>('lorazepam');
  const [dose, setDose] = useState<string>('');

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const fromEquiv = drugs.find(d => d.id === fromDrug)?.equiv || 1;
  const toEquiv = drugs.find(d => d.id === toDrug)?.equiv || 1;

  const isComplete = dose !== '' && !isNaN(parseFloat(dose)) && parseFloat(dose) > 0;
  
  let result = 0;
  if (isComplete) {
    const inputDose = parseFloat(dose);
    result = inputDose * (toEquiv / fromEquiv);
  }

  // Format to a reasonable number of decimals
  const displayResult = result % 1 === 0 ? result.toString() : result.toFixed(2);
  const reducedDose = isComplete ? (result * 0.75).toFixed(2) + " - " + (result * 0.5).toFixed(2) : '--';

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('benzo-equivalence', lang, `${fromDrug}->${toDrug}`);
        trackCalculatorResult('benzo-equivalence', result, 'Equivalent Dose', lang);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, fromDrug, toDrug, result, lang]);

  return (
    <>
      <JsonLd data={generateMedicalCalculatorSchema(currentText.title, currentText.subtitle)} />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-purple-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="w-full max-w-full max-w-3xl mb-12 relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 bg-clip-text text-transparent mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="benzo-equivalence" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3 leading-relaxed">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="lg:col-span-7 space-y-6">
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-gray-950/5 p-6 md:p-8 transition-all">
            <div className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">{currentText.fromDrug}</label>
                <select
                  value={fromDrug}
                  onChange={(e) => setFromDrug(e.target.value)}
                  className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  {drugs.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">{currentText.dose}</label>
                <input
                  type="number"
                  value={dose}
                  onChange={(e) => setDose(e.target.value)}
                  placeholder="e.g. 10"
                  className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                  dir="ltr"
                />
              </div>

              <div className="flex justify-center -my-2 relative z-10">
                <div className="bg-white p-2 rounded-full border border-gray-100 shadow-sm text-gray-400">
                  <ArrowRightLeft className="w-5 h-5 rotate-90" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">{currentText.toDrug}</label>
                <select
                  value={toDrug}
                  onChange={(e) => setToDrug(e.target.value)}
                  className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  {drugs.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky bottom-4 z-40 lg:top-28 lg:bottom-auto backdrop-blur-2xl bg-gradient-to-b from-slate-900 via-gray-900 to-slate-950 text-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-white/15 flex flex-col justify-between p-5 lg:p-8 lg:min-h-[360px] transition-all duration-300">
            <div className="absolute top-0 right-0 p-36 bg-gradient-to-bl from-blue-500/30 via-indigo-500/10 to-transparent rounded-bl-[120px] pointer-events-none animate-pulse" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                  {currentText.result}
                </span>
                <ArrowRightLeft className="w-5 h-5 text-blue-400" />
              </div>
              
              <div className="flex items-baseline gap-2 tabular-nums my-2" dir="ltr">
                <span className="text-7xl font-black tracking-tighter transition-all duration-300 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {isComplete ? displayResult : '--'}
                </span>
                <span className="text-2xl font-bold text-slate-500">mg</span>
              </div>
            </div>

            <div className="relative z-10 mt-6 space-y-4">
              {isComplete ? (
                <div className="p-4 rounded-2xl border backdrop-blur-md transition-all shadow-lg bg-orange-500/10 border-orange-500/20 text-orange-400">
                  <div className="font-bold text-sm tracking-wide mb-1">
                    Target Dose (Reduced 25-50% for incomplete cross-tolerance):
                  </div>
                  <div className="font-bold text-lg" dir="ltr">{reducedDose} mg</div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border flex justify-between items-center transition-all bg-gray-800/50 border-gray-700/80 text-slate-400 backdrop-blur-md">
                  <div className="font-semibold text-sm">
                    {lang === 'fr' ? 'Entrez la dose actuelle' : lang === 'es' ? 'Ingrese la dosis actual' : lang === 'ar' ? 'أدخل الجرعة الحالية' : 'Enter current dose to calculate'}
                  </div>
                </div>
              )}

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "From", value: `${dose} mg ${drugs.find(d => d.id === fromDrug)?.name}` },
                  { label: "To", value: drugs.find(d => d.id === toDrug)?.name || '--' }
                ]}
                results={[
                  { label: "Calculated Equiv.", value: isComplete ? `${displayResult} mg` : '--' },
                  { label: "Recommended Target (-25-50%)", value: isComplete ? `${reducedDose} mg` : '--' }
                ]}
                formula={currentText.formula}
                disclaimer={currentText.clinicalText}
                references={currentText.references}
                lang={lang}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-10 border-t border-gray-200" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 min-h-[44px] min-w-[44px].5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{currentText.clinicalTitle}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{currentText.clinicalText}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 min-h-[44px] min-w-[44px].5 bg-purple-50 text-purple-600 rounded-lg shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div className="w-full">
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{layoutTranslations[lang].mathMetric}</h2>
              <div className="font-mono text-xs bg-gray-100 text-gray-700 py-2 px-3 rounded-md border border-gray-200 uppercase tracking-tight" dir="ltr">
                {currentText.formula}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 min-h-[44px] min-w-[44px].5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{layoutTranslations[lang].evidenceLit}</h2>
              <p className="text-gray-500 text-xs leading-relaxed italic">{currentText.references}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-10 border-t border-gray-100" dir={isRtl ? 'rtl' : 'ltr'}>
        <h2 className="text-xl font-bold text-gray-900 mb-6">{currentText.pillarTitle}</h2>
        <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
          {currentText.pillarText.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="mt-0 pt-10 border-t border-gray-100" dir={isRtl ? 'rtl' : 'ltr'}>
        <h2 className="text-xl font-bold text-gray-900 mb-6">{currentText.faqTitle || layoutTranslations[lang].faqTitle}</h2>
        <div className="space-y-3">
          {[
            { q: currentText.faqQ1, a: currentText.faqA1 },
            { q: currentText.faqQ2, a: currentText.faqA2 },
          ].map(({ q, a }) => (
            <details key={q} className="group border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                <span className="text-sm">{q}</span>
                <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-3 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="mt-8" dir={isRtl ? 'rtl' : 'ltr'}>
        <MedicalReviewerCard reviewer={REVIEWER_PHARMACY} lang={lang} />
      </div>
    </>
  );
}
