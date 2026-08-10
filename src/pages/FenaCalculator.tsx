import React, { useState, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, Droplet } from 'lucide-react';
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
    title: "FeNa Calculator",
    subtitle: "Fractional Excretion of Sodium for acute kidney injury (AKI) evaluation",
    sNa: "Serum Sodium (mEq/L)",
    sCr: "Serum Creatinine (mg/dL)",
    uNa: "Urine Sodium (mEq/L)",
    uCr: "Urine Creatinine (mg/dL)",
    result: "FeNa",
    points: "%",
    status: "Interpretation:",
    formula: "FeNa = (Serum Cr × Urine Na) / (Serum Na × Urine Cr) × 100",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "The Fractional Excretion of Sodium (FeNa) measures the percentage of filtered sodium that is excreted in the urine. It is widely used to differentiate prerenal disease (decreased renal perfusion) from acute tubular necrosis (ATN) as the cause of acute kidney injury (AKI).",
    pillarTitle: "Usage Guidelines",
    pillarText: [
      "< 1%: Suggests prerenal AKI (the kidneys are functioning properly and holding onto sodium to restore volume).",
      "> 2%: Suggests intrinsic renal failure, typically Acute Tubular Necrosis (ATN) (the kidneys are damaged and losing sodium inappropriately).",
      "1 - 2%: Indeterminate.",
      "IMPORTANT: If the patient has received diuretics, FeNa is often > 1% even in prerenal states. In this case, Fractional Excretion of Urea (FeUrea) may be more accurate."
    ],
    references: "Espinel CH. The FENa test. Use in the differential diagnosis of acute renal failure. JAMA. 1976;236(6):579-81.",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "Can I use FeNa if the patient is on loop diuretics (e.g., Furosemide)?",
    faqA1: "Loop diuretics force the kidneys to excrete sodium, which will artificially raise the FeNa > 1% even if the patient is severely hypovolemic (prerenal). Consider using FeUrea instead.",
    faqQ2: "Does this work for Chronic Kidney Disease (CKD)?",
    faqA2: "FeNa is primarily validated for oliguric Acute Kidney Injury (AKI). In CKD, the fractional excretion of sodium increases as nephron mass decreases to maintain sodium balance, so a high FeNa is expected and non-diagnostic for ATN.",
  },
  fr: {
    title: "Calculateur FeNa",
    subtitle: "Fraction d'Excrétion du Sodium pour l'évaluation de l'insuffisance rénale aiguë (IRA)",
    sNa: "Sodium Sérique (mmol/L)",
    sCr: "Créatinine Sérique (mg/dL ou µmol/L*)",
    uNa: "Sodium Urinaire (mmol/L)",
    uCr: "Créatinine Urinaire (mg/dL ou µmol/L*)",
    result: "FeNa",
    points: "%",
    status: "Interprétation :",
    formula: "FeNa = (Cr Sérique × Na Urinaire) / (Na Sérique × Cr Urinaire) × 100",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "La FeNa mesure le pourcentage de sodium filtré qui est excrété dans les urines. Elle permet de différencier une IRA prérénale (fonctionnelle) d'une nécrose tubulaire aiguë (NTA, organique).",
    pillarTitle: "Recommandations d'Utilisation",
    pillarText: [
      "< 1% : IRA Prérénale (les reins fonctionnent et retiennent le sodium pour restaurer la volémie).",
      "> 2% : IRA Organique (souvent NTA, les reins endommagés perdent du sodium).",
      "1 - 2% : Indéterminé.",
      "* Les unités de créatinine sérique et urinaire doivent être identiques (toutes deux en mg/dL ou µmol/L).",
      "ATTENTION : Si le patient prend des diurétiques, la FeNa perd sa valeur (souvent > 1% même si prérénal). Utiliser la FeUrée."
    ],
    references: "Espinel CH. The FENa test. JAMA. 1976.",
    faqTitle: "Questions Fréquentes",
    faqQ1: "Puis-je l'utiliser si le patient est sous Furosémide ?",
    faqA1: "Non. Les diurétiques forcent l'excrétion de sodium. La FeNa sera faussement élevée. Préférez la Fraction d'Excrétion de l'Urée (FeUrée).",
    faqQ2: "Est-ce utile dans l'Insuffisance Rénale Chronique (IRC) ?",
    faqA2: "Non, validé principalement pour l'IRA oligurique. Dans l'IRC, la FeNa augmente naturellement pour maintenir la balance sodée.",
  },
  es: {
    title: "Calculadora FeNa",
    subtitle: "Fracción de Excreción de Sodio para evaluar la lesión renal aguda (LRA)",
    sNa: "Sodio Sérico (mEq/L)",
    sCr: "Creatinina Sérica (mg/dL)",
    uNa: "Sodio Urinario (mEq/L)",
    uCr: "Creatinina Urinaria (mg/dL)",
    result: "FeNa",
    points: "%",
    status: "Interpretación:",
    formula: "FeNa = (Cr Sérica × Na Urinario) / (Na Sérico × Cr Urinaria) × 100",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "La FeNa mide el porcentaje de sodio filtrado que se excreta en la orina. Se usa para diferenciar la LRA prerrenal (disminución de la perfusión) de la necrosis tubular aguda (NTA).",
    pillarTitle: "Pautas de Uso",
    pillarText: [
      "< 1%: LRA prerrenal (los riñones conservan el sodio).",
      "> 2%: LRA intrínseca o NTA (los riñones pierden sodio de forma inapropiada).",
      "1 - 2%: Indeterminado.",
      "Las unidades de creatinina sérica y urinaria deben ser iguales.",
      "IMPORTANTE: Si el paciente recibe diuréticos de asa, la FeNa aumenta artificialmente. En este caso es mejor usar la Fracción de Excreción de Urea (FeUrea)."
    ],
    references: "Espinel CH. The FENa test. JAMA. 1976.",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Es útil si el paciente toma diuréticos?",
    faqA1: "Los diuréticos de asa (furosemida) fuerzan la excreción de sodio, por lo que la FeNa será >1% incluso en LRA prerrenal severa. Use FeUrea en su lugar.",
    faqQ2: "¿Sirve para la Enfermedad Renal Crónica (ERC)?",
    faqA2: "No. En la ERC avanzada, la FeNa es alta por adaptación fisiológica, no por daño tubular agudo.",
  },
  ar: {
    title: "حاسبة FeNa",
    subtitle: "الطرح الجزئي للصوديوم لتقييم إصابة الكلى الحادة (AKI)",
    sNa: "صوديوم الدم (mEq/L)",
    sCr: "كرياتينين الدم (mg/dL)",
    uNa: "صوديوم البول (mEq/L)",
    uCr: "كرياتينين البول (mg/dL)",
    result: "FeNa",
    points: "٪",
    status: "التفسير:",
    formula: "FeNa = (كرياتينين الدم × صوديوم البول) / (صوديوم الدم × كرياتينين البول) × 100",
    clinicalTitle: "التفسير السريري",
    clinicalText: "يقيس FeNa نسبة الصوديوم المصفى الذي يتم إخراجه في البول. ويستخدم للتفريق بين الفشل الكلوي قبل الكلى (Prerenal - نقص التروية) والنخر الأنبوبي الحاد (ATN - تلف الكلى الداخلي).",
    pillarTitle: "إرشادات الاستخدام",
    pillarText: [
      "أقل من 1٪: يشير إلى فشل كلوي قبل الكلى (Prerenal)، حيث تعمل الكلى بشكل جيد وتحتفظ بالصوديوم لتعويض نقص السوائل.",
      "أكبر من 2٪: يشير إلى فشل كلوي داخلي (مثل النخر الأنبوبي الحاد ATN)، حيث تفقد الكلى التالفة القدرة على حبس الصوديوم.",
      "من 1 إلى 2٪: غير محدد.",
      "هام: يجب أن تكون وحدات قياس كرياتينين الدم والبول متطابقة (كلاهما mg/dL أو كلاهما µmol/L).",
      "ملاحظة هامة: إذا تناول المريض مدرات البول (مثل اللازيكس)، ستكون النتيجة عالية كاذبة (> 1٪). في هذه الحالة يفضل استخدام الطرح الجزئي لليوريا (FeUrea)."
    ],
    references: "Espinel CH. The FENa test. JAMA. 1976.",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "هل يمكنني استخدام FeNa إذا كان المريض يأخذ مدرات البول؟",
    faqA1: "لا يفضل. مدرات البول تجبر الكلى على التخلص من الصوديوم، مما يعطي قراءة > 1٪ حتى لو كان المريض يعاني من جفاف شديد. استخدم FeUrea بدلاً من ذلك.",
    faqQ2: "هل يصلح هذا الاختبار لمرضى القصور الكلوي المزمن (CKD)؟",
    faqA2: "لا، هذا الاختبار مخصص لإصابات الكلى الحادة. في مرضى القصور المزمن، تتخلص الكلى طبيعياً من نسبة أعلى من الصوديوم للحفاظ على التوازن، لذا تكون النتيجة عالية دائماً ولا تعتبر مشخصة.",
  }
};

export default function FenaCalculator({ lang }: { lang: LangCode }) {
  const [sNa, setSNa] = useState<string>('');
  const [uNa, setUNa] = useState<string>('');
  const [sCr, setSCr] = useState<string>('');
  const [uCr, setUCr] = useState<string>('');

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const isComplete = sNa !== '' && !isNaN(parseFloat(sNa)) && parseFloat(sNa) > 0 &&
                     uNa !== '' && !isNaN(parseFloat(uNa)) && parseFloat(uNa) >= 0 &&
                     sCr !== '' && !isNaN(parseFloat(sCr)) && parseFloat(sCr) > 0 &&
                     uCr !== '' && !isNaN(parseFloat(uCr)) && parseFloat(uCr) > 0;
  
  let fena = 0;
  let interpretation = "";

  if (isComplete) {
    const s_na = parseFloat(sNa);
    const u_na = parseFloat(uNa);
    const s_cr = parseFloat(sCr);
    const u_cr = parseFloat(uCr);
    
    fena = ((s_cr * u_na) / (s_na * u_cr)) * 100;

    if (fena < 1) {
      interpretation = lang === 'fr' ? 'Prérénal (Fonctionnel)' : lang === 'es' ? 'Prerrenal (Hipoperfusión)' : lang === 'ar' ? 'قبل الكلى (نقص التروية)' : 'Prerenal (Decreased Perfusion)';
    } else if (fena > 2) {
      interpretation = lang === 'fr' ? 'Rénal (Nécrose Tubulaire Aiguë probable)' : lang === 'es' ? 'Intrínseco (NTA probable)' : lang === 'ar' ? 'كلوي داخلي (نخر أنبوبي حاد محتمل)' : 'Intrinsic (Probable ATN)';
    } else {
      interpretation = lang === 'fr' ? 'Indéterminé (1 - 2%)' : lang === 'es' ? 'Indeterminado (1 - 2%)' : lang === 'ar' ? 'غير محدد (1 - 2%)' : 'Indeterminate (1 - 2%)';
    }
  }

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('fena-calculator', lang, fena);
        trackCalculatorResult('fena-calculator', fena, '%', lang);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, fena, lang]);

  return (
    <>
      <JsonLd data={generateMedicalCalculatorSchema(currentText.title, currentText.subtitle)} />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-purple-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="w-full max-w-full max-w-3xl mb-12 relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 bg-clip-text text-transparent mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="fena-calculator" lang={lang} title={currentText.title} />
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
                  <label className="text-sm font-semibold text-gray-900">{currentText.sNa}</label>
                  <input
                    type="number"
                    value={sNa}
                    onChange={(e) => setSNa(e.target.value)}
                    placeholder="e.g. 140"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.uNa}</label>
                  <input
                    type="number"
                    value={uNa}
                    onChange={(e) => setUNa(e.target.value)}
                    placeholder="e.g. 15"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.sCr}</label>
                  <input
                    type="number"
                    value={sCr}
                    onChange={(e) => setSCr(e.target.value)}
                    placeholder="e.g. 1.8"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.uCr}</label>
                  <input
                    type="number"
                    value={uCr}
                    onChange={(e) => setUCr(e.target.value)}
                    placeholder="e.g. 50"
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
                <Droplet className="w-5 h-5 text-blue-400" />
              </div>
              
              <div className="flex items-baseline gap-2 tabular-nums my-2" dir="ltr">
                <span className="text-7xl font-black tracking-tighter transition-all duration-300 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {isComplete ? fena.toFixed(2) : '--'}
                </span>
                <span className="text-2xl font-bold text-slate-500">{currentText.points}</span>
              </div>
            </div>

            <div className="relative z-10 mt-6 space-y-4">
              {isComplete ? (
                <div className={`p-4 rounded-2xl border backdrop-blur-md transition-all shadow-lg flex flex-col gap-1 ${
                  fena < 1 ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                  fena > 2 ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                  'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                }`}>
                  <div className="font-bold text-sm tracking-wide">
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
                  { label: "Serum Sodium", value: `${sNa} mEq/L` },
                  { label: "Urine Sodium", value: `${uNa} mEq/L` },
                  { label: "Serum Creatinine", value: sCr },
                  { label: "Urine Creatinine", value: uCr }
                ]}
                results={[
                  { label: "FeNa", value: isComplete ? `${fena.toFixed(2)}%` : '--' },
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
