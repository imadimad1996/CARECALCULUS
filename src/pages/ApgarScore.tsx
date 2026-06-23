import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, Check, Copy } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';

const translations: Translations = {
  en: {
    title: "APGAR Score Calculator",
    subtitle: "Quickly assess newborns at 1 and 5 minutes after birth",
    appearance: "Appearance (Skin Color)",
    appearance2: "2 - Completely Pink",
    appearance1: "1 - Body Pink, Blue Extremities",
    appearance0: "0 - Blue-Gray, Pale All Over",
    pulse: "Pulse (Heart Rate)",
    pulse2: "2 - ≥ 100 bpm",
    pulse1: "1 - < 100 bpm",
    pulse0: "0 - Absent / No Pulse",
    grimace: "Grimace (Reflex Irritability)",
    grimace2: "2 - Cry, Sneeze, Cough, Active Pull",
    grimace1: "1 - Grimace / Feeble Cry",
    grimace0: "0 - No Response to Stimulation",
    activity: "Activity (Muscle Tone)",
    activity2: "2 - Active Motion / Well Flexed",
    activity1: "1 - Some Flexion of Extremities",
    activity0: "0 - Limp / Flaccid",
    respiration: "Respiration (Breathing)",
    respiration2: "2 - Good, Strong Cry",
    respiration1: "1 - Slow, Irregular, Weak Cry",
    respiration0: "0 - Absent / Not Breathing",
    result: "Calculated APGAR",
    formula: "APGAR = Appearance + Pulse + Grimace + Activity + Respiration",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "Normal (7-10), Moderately Depressed (4-6), Severely Depressed (0-3). Repeat every 5 minutes up to 20 minutes if score remains < 7.",
    references: "References: Apgar V. A proposal for a new method of evaluation of the newborn infant. Anesth Analg 1953.",
    normal: "Normal Newborn Status (7-10)",
    moderate: "Moderately Depressed (4-6)",
    severe: "Severely Depressed (0-3)",
    faqQ1: "What is the APGAR score?",
    faqA1: "The APGAR score is a rapid assessment of a newborn's clinical status performed at 1 minute and 5 minutes after birth. It evaluates: Appearance (color), Pulse (heart rate), Grimace (reflex irritability), Activity (muscle tone), and Respiration.",
    faqQ2: "What does a normal APGAR score mean?",
    faqA2: "An APGAR score of 7 to 10 is considered normal and indicates the newborn is in good health. Scores of 4 to 6 indicate moderate depression, and 0 to 3 indicate severe distress requiring immediate resuscitation.",
    faqQ3: "When is the APGAR score calculated?",
    faqA3: "It is calculated routinely at 1 and 5 minutes after birth. If the 5-minute score is low (<7), it may be repeated every 5 minutes up to 20 minutes to monitor resuscitation progress.",
    faqQ4: "Does a low APGAR score predict long-term brain damage?",
    faqA4: "Not necessarily. A low score at 1 minute is common and often resolves. Even at 5 minutes, a low score shows correlation with immediate survival but is a poor predictor of long-term neurological outcome in individual cases.",
  },
  fr: {
    title: "Score d'APGAR",
    subtitle: "Évaluation rapide du nouveau-né à 1 et 5 minutes de vie",
    appearance: "Apparence (Couleur de la peau)",
    appearance2: "2 - Entièrement rose",
    appearance1: "1 - Corps rose, extrémités bleues",
    appearance0: "0 - Bleu ou pâle partout",
    pulse: "Pouls (Fréquence cardiaque)",
    pulse2: "2 - ≥ 100 bpm",
    pulse1: "1 - < 100 bpm",
    pulse0: "0 - Absent / Pas de pouls",
    grimace: "Grimace (Réactivité aux stimuli)",
    grimace2: "2 - Vive (toux, éternuement, cri)",
    grimace1: "1 - Grimace / faible réaction",
    grimace0: "0 - Aucune réaction",
    activity: "Activité (Tonus musculaire)",
    activity2: "2 - Mouvements actifs, membres fléchis",
    activity1: "1 - Légère flexion des membres",
    activity0: "0 - Flasque",
    respiration: "Respiration (Cri/Effort respiratoire)",
    respiration2: "2 - Vigoureuse, cri fort",
    respiration1: "1 - Lente, irrégulière, râle",
    respiration0: "0 - Absente",
    result: "Score APGAR Calculé",
    formula: "APGAR = Apparence + Pouls + Grimace + Activité + Respiration",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Normal (7-10), Dépression modérée (4-6), Dépression sévère (0-3). Répéter toutes les 5 minutes jusqu'à 20 minutes si le score reste < 7.",
    references: "Références : Apgar V. A proposal for a new method of evaluation of the newborn infant. Anesth Analg 1953.",
    normal: "Nouveau-né normal (7-10)",
    moderate: "Dépression modérée (4-6)",
    severe: "Dépression sévère (0-3)",
    faqQ1: "Qu'est-ce que le score d'APGAR ?",
    faqA1: "Le score d'APGAR est un test d'évaluation rapide de l'état de santé d'un nouveau-né, réalisé à la 1re et à la 5e minute après la naissance. Il évalue : Apparence (couleur), Pouls (fréquence cardiaque), Grimace (réactivité), Activité (tonus) et Respiration.",
    faqQ2: "Que signifie un score d'APGAR normal ?",
    faqA2: "Un score d'APGAR de 7 à 10 est considéré comme normal et indique que le bébé est en bonne santé. Un score de 4 à 6 signale une détresse modérée, et un score de 0 à 3 indique une détresse sévère nécessitant une réanimation immédiate.",
    faqQ3: "Quand le score d'APGAR est-il calculé ?",
    faqA3: "Il est calculé systématiquement à 1 minute de vie (reflète l'adaptation à la naissance) et à 5 minutes (reflète la récupération et l'effet des soins). Si le score à 5 minutes est <7, il est recalculé toutes les 5 minutes.",
    faqQ4: "Un score d'APGAR bas prédit-il des séquelles neurologiques ?",
    faqA4: "Non, pas obligatoirement. Un score bas à 1 minute est fréquent et s'améliore souvent vite. Même à 5 minutes, il indique un besoin de soutien immédiat mais n'est pas un indicateur fiable du développement neurologique à long terme.",
  },
  ar: {
    title: "مقياس أبغار لحديثي الولادة",
    subtitle: "التقييم السريع للحالة الصحية للطفل حديث الولادة عند الدقيقة 1 و 5",
    appearance: "المظهر (لون الجلد)",
    appearance2: "2 - وردي بالكامل",
    appearance1: "1 - الجسم وردي والأطراف زرقاء",
    appearance0: "0 - أزرق أو شاحب بالكامل",
    pulse: "النبض (معدل ضربات القلب)",
    pulse2: "2 - أكثر من 100 نبضة/دقيقة",
    pulse1: "1 - أقل من 100 نبضة/دقيقة",
    pulse0: "0 - لا يوجد نبض",
    grimace: "التعبير (الاستجابة للمنبهات)",
    grimace2: "2 - حركة نشطة، سعال، عطس أو بكاء قوي",
    grimace1: "1 - عبوس أو بكاء ضعيف",
    grimace0: "0 - لا توجد استجابة",
    activity: "النشاط (الحركة ومرونة العضلات)",
    activity2: "2 - حركة نشطة وثني كامل للأطراف",
    activity1: "1 - انثناء طفيف في الأطراف",
    activity0: "0 - مرتخي بالكامل / خامل",
    respiration: "التنفس (مجهود التنفس)",
    respiration2: "2 - تنفس قوي وبكاء قوي",
    respiration1: "1 - تنفس بطيء، غير منتظم وبكاء ضعيف",
    respiration0: "0 - لا يوجد تنفس",
    result: "نقطة أبغار المحسوبة",
    formula: "المظهر + النبض + التعبير + النشاط + التنفس",
    clinicalTitle: "التفسير السريري والإجراءات",
    clinicalText: "طبيعي (7-10)، تثبيط معتدل (4-6)، تثبيط شديد (0-3). كرر التقييم كل 5 دقائق حتى 20 دقيقة إذا استمرت النتيجة أقل من 7.",
    references: "المراجع: اقتراح الدكتورة فرجينيا أبغار لطريقة جديدة لتقييم حديثي الولادة (1953).",
    normal: "حالة طفل طبيعية (7-10)",
    moderate: "تثبيط معتدل (4-6)",
    severe: "تثبيط شديد (0-3)",
    faqQ1: "ما هو مقياس أبغار (APGAR)؟",
    faqA1: "مقياس أبغار هو نظام تقييم سريع ومباشر للحالة السريرية لحديثي الولادة يُجرى عند الدقيقة الأولى والخامسة بعد الولادة. يقيم خمسة معايير: المظهر (اللون)، النبض، التعبير (الاستجابة)، النشاط (المرونة)، والتنفس.",
    faqQ2: "ماذا تعني درجة أبغار الطبيعية؟",
    faqA2: "تعتبر النتيجة من 7 إلى 10 طبيعية وتشير إلى صحة الوليد الجيدة. النتيجة من 4 إلى 6 تشير إلى تثبيط معتدل، بينما النتيجة من 0 إلى 3 تعني تثبيطًا شديدًا يتطلب إنعاشًا طبيًا فوريًا.",
    faqQ3: "متى يتم حساب مقياس أبغار؟",
    faqA3: "يُحسب روتينيًا بعد دقيقة واحدة و5 دقائق من الولادة. وإذا كانت نتيجة الدقيقة الخامسة منخفضة (أقل من 7)، فيمكن تكراره كل 5 دقائق حتى الدقيقة 20 لمتابعة استجابة الرضيع للإنعاش.",
    faqQ4: "هل النتيجة المنخفضة تعني تلفًا طويل الأمد في الدماغ؟",
    faqA4: "ليس بالضرورة. انخفاض الدرجة عند الدقيقة الأولى شائع وغالبًا ما يتلاشى سريعًا. وحتى عند 5 دقائق، تعكس الدرجة الحاجة للرعاية الفورية ولكنها ليست مؤشراً حتمياً للمشاكل العصبية طويلة الأمد.",
  }
};

export default function ApgarScore({ lang }: { lang: LangCode }) {
  const [appearance, setAppearance] = useState<number>(2);
  const [pulse, setPulse] = useState<number>(2);
  const [grimace, setGrimace] = useState<number>(2);
  const [activity, setActivity] = useState<number>(2);
  const [respiration, setRespiration] = useState<number>(2);
  const [copied, setCopied] = useState(false);

  const currentText = translations[lang];
  const isRtl = lang === 'ar';

  const apgarValue = appearance + pulse + grimace + activity + respiration;

  useEffect(() => {
    const timer = setTimeout(() => {
      trackCalculatorUsage('apgar-score', lang, apgarValue);
    }, 1500);
    return () => clearTimeout(timer);
  }, [apgarValue, lang]);

  const getApgarCategory = (val: number) => {
    if (val <= 3) return { label: currentText.severe, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
    if (val <= 6) return { label: currentText.moderate, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    return { label: currentText.normal, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
  };

  const category = getApgarCategory(apgarValue);

  const handleCopy = () => {
    navigator.clipboard.writeText(`APGAR Score: ${apgarValue}/10 (${category.label})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="max-w-3xl mb-12">
        <h1 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3 ${isRtl ? 'leading-normal' : ''}`}>
          {currentText.title}
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-gray-950/5 p-6 md:p-8">
            <div className="space-y-6">
              
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">{currentText.appearance}</label>
                <div className="grid grid-cols-1 gap-2">
                  {[2, 1, 0].map((val) => (
                    <button
                      key={`appearance-${val}`}
                      onClick={() => setAppearance(val)}
                      className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${appearance === val ? 'bg-blue-50 border-blue-600 text-blue-800 font-bold' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'}`}
                      style={{ minHeight: '44px' }}
                    >
                      {currentText[`appearance${val}`]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 mt-4">{currentText.pulse}</label>
                <div className="grid grid-cols-1 gap-2">
                  {[2, 1, 0].map((val) => (
                    <button
                      key={`pulse-${val}`}
                      onClick={() => setPulse(val)}
                      className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${pulse === val ? 'bg-blue-50 border-blue-600 text-blue-800 font-bold' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'}`}
                      style={{ minHeight: '44px' }}
                    >
                      {currentText[`pulse${val}`]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 mt-4">{currentText.grimace}</label>
                <div className="grid grid-cols-1 gap-2">
                  {[2, 1, 0].map((val) => (
                    <button
                      key={`grimace-${val}`}
                      onClick={() => setGrimace(val)}
                      className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${grimace === val ? 'bg-blue-50 border-blue-600 text-blue-800 font-bold' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'}`}
                      style={{ minHeight: '44px' }}
                    >
                      {currentText[`grimace${val}`]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 mt-4">{currentText.activity}</label>
                <div className="grid grid-cols-1 gap-2">
                  {[2, 1, 0].map((val) => (
                    <button
                      key={`activity-${val}`}
                      onClick={() => setActivity(val)}
                      className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${activity === val ? 'bg-blue-50 border-blue-600 text-blue-800 font-bold' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'}`}
                      style={{ minHeight: '44px' }}
                    >
                      {currentText[`activity${val}`]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 mt-4">{currentText.respiration}</label>
                <div className="grid grid-cols-1 gap-2">
                  {[2, 1, 0].map((val) => (
                    <button
                      key={`respiration-${val}`}
                      onClick={() => setRespiration(val)}
                      className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${respiration === val ? 'bg-blue-50 border-blue-600 text-blue-800 font-bold' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'}`}
                      style={{ minHeight: '44px' }}
                    >
                      {currentText[`respiration${val}`]}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky top-28 bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 flex flex-col justify-between p-8 min-h-[320px]">
            <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                  {currentText.result}
                </span>
                
                <div className="flex items-baseline gap-2 tabular-nums">
                  <span className="text-7xl font-bold tracking-tighter transition-all duration-300">
                    {apgarValue}
                  </span>
                  <span className="text-xl font-medium text-gray-400">/ 10</span>
                </div>
              </div>

              <button
                onClick={handleCopy}
                className="mt-2 p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors border border-gray-700/50 flex items-center justify-center text-gray-300 hover:text-white"
                title="Copy Result"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative z-10 mt-10">
              <div className={`p-4 rounded-xl border flex justify-between items-center transition-all ${category.bg} ${category.color}`}>
                <div className="font-semibold text-sm">
                  {category.label}
                </div>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: currentText.appearance, value: `${appearance} - ${currentText[`appearance${appearance}`]}` },
                  { label: currentText.pulse, value: `${pulse} - ${currentText[`pulse${pulse}`]}` },
                  { label: currentText.grimace, value: `${grimace} - ${currentText[`grimace${grimace}`]}` },
                  { label: currentText.activity, value: `${activity} - ${currentText[`activity${activity}`]}` },
                  { label: currentText.respiration, value: `${respiration} - ${currentText[`respiration${respiration}`]}` }
                ]}
                results={[
                  { label: currentText.result, value: `${apgarValue} / 10` },
                  { label: 'Classification', value: category.label }
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

      <div className="mt-16 pt-10 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-8 text-xs text-gray-400">
          <span className="font-semibold text-gray-500">{layoutTranslations[lang].reviewedBy}</span>
          <span>&middot;</span>
          <span>{layoutTranslations[lang].specialists}</span>
          <span>&middot;</span>
          <span>{layoutTranslations[lang].updated}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{currentText.clinicalTitle}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{currentText.clinicalText}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg shrink-0">
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
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{layoutTranslations[lang].evidenceLit}</h2>
              <p className="text-gray-500 text-xs leading-relaxed italic">{currentText.references}</p>
              <a href="https://pubmed.ncbi.nlm.nih.gov/13092343/" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Apgar V, Anesth Analg 1953 (PMID: 13092343) →</a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{layoutTranslations[lang].seeAlso}</h2>
        <div className="flex flex-wrap gap-2 mb-10">
          {[
            { label: 'GCS Calculator', path: '/glasgow-coma-scale' },
            { label: 'qSOFA Score', path: '/qsofa-score' },
            { label: 'SIRS Criteria', path: '/sirs-criteria' },
            { label: 'PHQ-9 Score', path: '/phq9-score' },
          ].map(({ label, path }) => {
            const prefix = lang === 'en' ? '' : `/${lang}`;
            return (
              <a key={path} href={`${prefix}${path}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-lg text-sm font-medium transition-colors border border-gray-200 hover:border-blue-200">
                {label}
              </a>
            );
          })}
        </div>
      </div>

      <div className="mt-0 pt-0 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{layoutTranslations[lang].faqTitle}</h2>
        <div className="space-y-3">
          {[
            { q: currentText.faqQ1, a: currentText.faqA1 },
            { q: currentText.faqQ2, a: currentText.faqA2 },
            { q: currentText.faqQ3, a: currentText.faqA3 },
            { q: currentText.faqQ4, a: currentText.faqA4 },
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
    </>
  );
}
