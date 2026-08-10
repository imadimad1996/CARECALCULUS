import React, { useState, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, FlaskConical } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage, trackCalculatorResult } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd, generateMedicalCalculatorSchema } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_NEPHROLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Anion Gap Calculator",
    subtitle: "Calculates serum Anion Gap with optional Albumin correction",
    na: "Sodium (Na) (mEq/L)",
    cl: "Chloride (Cl) (mEq/L)",
    hco3: "Bicarbonate (HCO₃) (mEq/L)",
    alb: "Albumin (g/dL) - Optional",
    result: "Anion Gap",
    points: "mEq/L",
    correctedAg: "Corrected AG:",
    status: "Interpretation:",
    formula: "AG = Na - (Cl + HCO3). Corrected = AG + 2.5 × (4 - Albumin)",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "The anion gap is used to differentiate causes of metabolic acidosis. A high anion gap (> 12 mEq/L) indicates the presence of unmeasured anions (e.g., lactate, ketones, toxins).",
    pillarTitle: "Usage Guidelines",
    pillarText: [
      "Normal Anion Gap: ~ 8-12 mEq/L.",
      "High Anion Gap Metabolic Acidosis (HAGMA) causes: MUDPILES (Methanol, Uremia, DKA, Paraldehyde, Iron/Isoniazid, Lactic acidosis, Ethylene glycol, Salicylates) or GOLD MARK.",
      "Normal Anion Gap Metabolic Acidosis (NAGMA) causes: HARDUP (Hyperalimentation, Acetazolamide, Renal tubular acidosis, Diarrhea, Uretero-pelvic shunt, Post-hypocapnia).",
      "Because albumin is a major unmeasured anion, hypoalbuminemia will falsely lower the anion gap. The corrected AG adjusts for this (adds 2.5 mEq/L to the AG for every 1 g/dL drop in albumin below 4.0)."
    ],
    references: "Figge J, Jabor A, Kazda A, Fenves A. Anion gap and hypoalbuminemia. Crit Care Med. 1998;26(11):1807-10.",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "Why correct for Albumin?",
    faqA1: "Albumin is negatively charged and accounts for a large portion of the normal anion gap. In patients with low albumin (very common in critically ill patients), a 'normal' uncorrected anion gap might actually be masking a high anion gap metabolic acidosis. Correcting it reveals the true gap.",
    faqQ2: "Is Potassium included?",
    faqA2: "The standard formula omits Potassium (Na - (Cl + HCO3)) because its extracellular concentration is small and relatively constant. If included, the normal range changes to 12-16 mEq/L.",
  },
  fr: {
    title: "Trou Anionique",
    subtitle: "Calcule le trou anionique plasmatique avec correction éventuelle par l'albumine",
    na: "Sodium (Na) (mmol/L)",
    cl: "Chlore (Cl) (mmol/L)",
    hco3: "Bicarbonate (HCO₃) (mmol/L)",
    alb: "Albumine (g/dL) - Optionnel",
    result: "Trou Anionique",
    points: "mmol/L",
    correctedAg: "TA Corrigé :",
    status: "Interprétation :",
    formula: "TA = Na - (Cl + HCO3). Corrigé = TA + 2.5 × (4 - Albumine)",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Le trou anionique permet de différencier les causes d'acidose métabolique. Un TA élevé (> 12 mmol/L) indique la présence d'anions indosés (lactate, cétones, toxines).",
    pillarTitle: "Recommandations d'Utilisation",
    pillarText: [
      "Trou Anionique Normal : ~ 8-12 mmol/L.",
      "Causes de TA élevé (HAGMA) : MUDPILES (Méthanol, Urémie, Acidocétose, Paraldéhyde, Isoniazide, Lactate, Éthylène glycol, Salicylates).",
      "Causes de TA normal (NAGMA) : Pertes digestives (diarrhée), acidose tubulaire rénale.",
      "L'albumine étant le principal anion indosé, une hypoalbuminémie abaisse faussement le TA. Le TA corrigé ajoute 2.5 mmol/L au TA pour chaque baisse de 1 g/dL de l'albumine sous 4.0."
    ],
    references: "Figge J, et al. Anion gap and hypoalbuminemia. Crit Care Med. 1998.",
    faqTitle: "Questions Fréquentes",
    faqQ1: "Pourquoi corriger par l'albumine ?",
    faqA1: "L'albumine est chargée négativement. Chez les patients en réanimation (souvent hypoalbuminémiques), un TA 'normal' peut cacher une acidose métabolique à TA élevé. La correction rétablit la vraie valeur.",
    faqQ2: "Le potassium est-il inclus ?",
    faqA2: "La formule standard ignore le potassium car sa concentration extracellulaire est faible. S'il est inclus, la normale devient 12-16 mmol/L.",
  },
  es: {
    title: "Brecha Aniónica (Anion Gap)",
    subtitle: "Calcula el Anion Gap sérico con corrección opcional por albúmina",
    na: "Sodio (Na) (mEq/L)",
    cl: "Cloruro (Cl) (mEq/L)",
    hco3: "Bicarbonato (HCO₃) (mEq/L)",
    alb: "Albúmina (g/dL) - Opcional",
    result: "Anion Gap",
    points: "mEq/L",
    correctedAg: "AG Corregido:",
    status: "Interpretación:",
    formula: "AG = Na - (Cl + HCO3). Corregido = AG + 2.5 × (4 - Albúmina)",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "La brecha aniónica se usa para diferenciar causas de acidosis metabólica. Un AG alto (> 12 mEq/L) indica presencia de aniones no medidos (lactato, cetonas, toxinas).",
    pillarTitle: "Pautas de Uso",
    pillarText: [
      "Anion Gap Normal: ~ 8-12 mEq/L.",
      "Causas de AG Alto (HAGMA): MUDPILES (Metanol, Uremia, Cetoacidosis, Paraldehído, Isoniazida, Lactato, Etilenglicol, Salicilatos).",
      "Causas de AG Normal (NAGMA): Pérdidas GI (diarrea), acidosis tubular renal, fístulas.",
      "La albúmina es un anión importante. La hipoalbuminemia reduce falsamente el AG. El AG corregido suma 2.5 mEq/L al AG por cada 1 g/dL que la albúmina cae por debajo de 4.0."
    ],
    references: "Figge J, et al. Anion gap and hypoalbuminemia. Crit Care Med. 1998.",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Por qué corregir con albúmina?",
    faqA1: "La albúmina tiene carga negativa. En pacientes con hipoalbuminemia, un AG 'normal' podría estar ocultando una acidosis metabólica de AG alto. La corrección revela la brecha real.",
    faqQ2: "¿Se incluye el potasio?",
    faqA2: "La fórmula estándar omite el potasio porque su concentración extracelular es pequeña. Si se incluye, el rango normal sube a 12-16 mEq/L.",
  },
  ar: {
    title: "الفجوة الأنيونية (Anion Gap)",
    subtitle: "حساب الفجوة الأنيونية في الدم مع تصحيح الألبومين الاختياري",
    na: "الصوديوم (Na) (mEq/L)",
    cl: "الكلوريد (Cl) (mEq/L)",
    hco3: "البيكربونات (HCO₃) (mEq/L)",
    alb: "الألبومين (g/dL) - اختياري",
    result: "الفجوة الأنيونية",
    points: "mEq/L",
    correctedAg: "الفجوة المصححة:",
    status: "التفسير:",
    formula: "الفجوة = الصوديوم - (الكلوريد + البيكربونات). المصححة = الفجوة + 2.5 × (4 - الألبومين)",
    clinicalTitle: "التفسير السريري",
    clinicalText: "تُستخدم الفجوة الأنيونية للتفريق بين أسباب الحماض الأيضي (Metabolic Acidosis). تشير الفجوة العالية (> 12) إلى وجود أنيونات غير مقاسة مثل اللاكتات والكيتونات والسموم.",
    pillarTitle: "إرشادات الاستخدام",
    pillarText: [
      "الفجوة الأنيونية الطبيعية: ~ 8-12 mEq/L.",
      "أسباب الحماض الأيضي بفجوة عالية: MUDPILES (الميثانول، اليوريميا، الحماض الكيتوني، اللاكتات، الإيثيلين جلايكول، الساليسيلات).",
      "أسباب الحماض الأيضي بفجوة طبيعية: فقدان البيكربونات من الجهاز الهضمي (الإسهال) أو الكلى (الحماض الأنبوبي الكلوي).",
      "بما أن الألبومين هو أنيون رئيسي غير مقاس، فإن نقص الألبومين يقلل الفجوة الأنيونية بشكل خاطئ. الفجوة المصححة تضيف 2.5 للفجوة لكل انخفاض بمقدار 1 جم/ديسيلتر في الألبومين أقل من 4.0."
    ],
    references: "Figge J, et al. Anion gap and hypoalbuminemia. Crit Care Med. 1998.",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "لماذا نقوم بتصحيح الفجوة بناءً على الألبومين؟",
    faqA1: "الألبومين يحمل شحنة سالبة. لدى المرضى الذين يعانون من نقص الألبومين (شائع في العناية المركزة)، قد تبدو الفجوة طبيعية ظاهرياً بينما هي في الواقع عالية. التصحيح يظهر الفجوة الحقيقية.",
    faqQ2: "هل يتم تضمين البوتاسيوم في الحساب؟",
    faqA2: "المعادلة القياسية تتجاهل البوتاسيوم لأن تركيزه خارج الخلايا قليل وثابت نسبياً. إذا تم تضمينه، يصبح النطاق الطبيعي 12-16.",
  }
};

export default function AnionGap({ lang }: { lang: LangCode }) {
  const [na, setNa] = useState<string>('');
  const [cl, setCl] = useState<string>('');
  const [hco3, setHco3] = useState<string>('');
  const [alb, setAlb] = useState<string>('');

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const isComplete = na !== '' && !isNaN(parseFloat(na)) &&
                     cl !== '' && !isNaN(parseFloat(cl)) &&
                     hco3 !== '' && !isNaN(parseFloat(hco3));
  
  let ag = 0;
  let correctedAg = 0;
  let interpretation = "";
  let hasAlbumin = false;

  if (isComplete) {
    const n = parseFloat(na);
    const c = parseFloat(cl);
    const h = parseFloat(hco3);
    ag = n - (c + h);

    if (alb !== '' && !isNaN(parseFloat(alb))) {
      hasAlbumin = true;
      const a = parseFloat(alb);
      correctedAg = ag + 2.5 * (4.0 - a);
    }

    const valToUse = hasAlbumin ? correctedAg : ag;

    if (valToUse > 12) {
      interpretation = lang === 'fr' ? 'Élevé (Acidose à TA élevé probable)' : lang === 'es' ? 'Alto (HAGMA probable)' : lang === 'ar' ? 'فجوة عالية (حماض أيضي مرتفع الفجوة)' : 'High (Probable High AG Metabolic Acidosis)';
    } else {
      interpretation = lang === 'fr' ? 'Normal (8-12)' : lang === 'es' ? 'Normal (8-12)' : lang === 'ar' ? 'طبيعي (8-12)' : 'Normal (8-12 mEq/L)';
    }
  }

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        const valToUse = hasAlbumin ? correctedAg : ag;
        trackCalculatorUsage('anion-gap', lang, valToUse);
        trackCalculatorResult('anion-gap', valToUse, 'mEq/L', lang);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, ag, correctedAg, hasAlbumin, lang]);

  return (
    <>
      <JsonLd data={generateMedicalCalculatorSchema(currentText.title, currentText.subtitle)} />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-purple-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="w-full max-w-full max-w-3xl mb-12 relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 bg-clip-text text-transparent mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="anion-gap" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3 leading-relaxed">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="lg:col-span-7 space-y-6">
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-gray-950/5 p-6 md:p-8 transition-all">
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.na}</label>
                  <input
                    type="number"
                    value={na}
                    onChange={(e) => setNa(e.target.value)}
                    placeholder="e.g. 140"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.cl}</label>
                  <input
                    type="number"
                    value={cl}
                    onChange={(e) => setCl(e.target.value)}
                    placeholder="e.g. 104"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.hco3}</label>
                  <input
                    type="number"
                    value={hco3}
                    onChange={(e) => setHco3(e.target.value)}
                    placeholder="e.g. 24"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.alb}</label>
                  <input
                    type="number"
                    value={alb}
                    onChange={(e) => setAlb(e.target.value)}
                    placeholder="e.g. 4.0"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                    dir="ltr"
                  />
                </div>
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
                <FlaskConical className="w-5 h-5 text-blue-400" />
              </div>
              
              <div className="flex items-baseline gap-2 tabular-nums my-2" dir="ltr">
                <span className="text-7xl font-black tracking-tighter transition-all duration-300 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {isComplete ? (hasAlbumin ? correctedAg.toFixed(1) : ag.toFixed(1)) : '--'}
                </span>
                <span className="text-2xl font-bold text-slate-500">{currentText.points}</span>
              </div>
              {isComplete && hasAlbumin && (
                <div className="text-sm font-medium text-slate-400 mt-1">
                  Uncorrected AG: {ag.toFixed(1)} mEq/L
                </div>
              )}
            </div>

            <div className="relative z-10 mt-6 space-y-4">
              {isComplete ? (
                <div className={`p-4 rounded-2xl border backdrop-blur-md transition-all shadow-lg ${
                  (hasAlbumin ? correctedAg : ag) > 12 ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                  'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                  <div className="font-bold text-sm tracking-wide mb-1">
                    {currentText.status}
                  </div>
                  <div className="font-semibold text-lg">{interpretation}</div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border flex justify-between items-center transition-all bg-gray-800/50 border-gray-700/80 text-slate-400 backdrop-blur-md">
                  <div className="font-semibold text-sm">
                    {lang === 'fr' ? 'Entrez les valeurs' : lang === 'es' ? 'Ingrese los valores' : lang === 'ar' ? 'أدخل القيم' : 'Enter values to calculate'}
                  </div>
                </div>
              )}

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "Sodium", value: `${na} mEq/L` },
                  { label: "Chloride", value: `${cl} mEq/L` },
                  { label: "Bicarbonate", value: `${hco3} mEq/L` },
                  ...(hasAlbumin ? [{ label: "Albumin", value: `${alb} g/dL` }] : [])
                ]}
                results={[
                  { label: "Anion Gap", value: isComplete ? ag.toFixed(1) : '--' },
                  ...(hasAlbumin ? [{ label: "Corrected Anion Gap", value: correctedAg.toFixed(1) }] : []),
                  { label: "Interpretation", value: isComplete ? interpretation : '--' }
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
        <MedicalReviewerCard reviewer={REVIEWER_NEPHROLOGY} lang={lang} />
      </div>
    </>
  );
}
