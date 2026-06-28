import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { layoutTranslations } from '../utils/lang';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd, generateMedicalCalculatorSchema } from '../components/JsonLd';
import AdsterraNativeBanner from '../components/AdsterraNativeBanner';

const translations: Translations = {
  en: {
    title: "Wells' Criteria for DVT",
    subtitle: "Determine the pretest probability of deep vein thrombosis",
    cancer: "Active cancer (treatment within 6 months or palliative)",
    paralysis: "Paralysis, paresis, or recent cast of lower extremities",
    bedridden: "Recently bedridden > 3 days, or major surgery within 12 weeks",
    tenderness: "Localized tenderness along the deep venous system",
    swelling: "Entire leg swollen",
    calfSwelling: "Calf swelling > 3 cm compared to asymptomatic leg",
    pittingEdema: "Pitting edema confined to symptomatic leg",
    collateral: "Collateral nonvaricose superficial veins",
    dvthistory: "Previously documented DVT",
    alternativeDiagnoses: "Alternative diagnosis at least as likely as DVT",
    result: "Calculated Score",
    formula: "Sum of points (-2 to 9)",
    clinicalTitle: "Clinical Next Steps",
    clinicalText: "Score ≥ 2 indicates DVT is likely; consider ultrasound. Score < 2 generally indicates DVT is unlikely; a D-dimer may be appropriate.",
    pillarTitle: "Clinical Evidence & Diagnostic Strategy for DVT",
    pillarText: [
      "The Wells' Criteria for Deep Vein Thrombosis (DVT) is the gold-standard pretest probability clinical prediction rule used to risk-stratify patients presenting with suspected lower extremity DVT. Developed by Dr. Philip S. Wells, the score safely guides diagnostic imaging and laboratory testing, dramatically reducing unnecessary compression ultrasonography.",
      "In the dichotomous two-tier model, patients are stratified into 'DVT Unlikely' (Score < 2) and 'DVT Likely' (Score ≥ 2). For patients in the unlikely category, a high-sensitivity D-dimer assay is recommended; a negative D-dimer safely rules out DVT without the need for ultrasound. Conversely, for patients in the likely category, mandatory proximal lower extremity venous ultrasound is indicated regardless of D-dimer results.",
      "Clinicians must exercise careful judgment when evaluating the 'Alternative diagnosis' criterion (-2 points). This requires clinical experience to assess whether conditions such as cellulitis, Baker's cyst, muscle tear, or superficial thrombophlebitis are as likely or more likely than DVT."
    ],
    faqQ1: "What is the Wells Score for DVT?",
    faqA1: "The Wells Score for DVT is a validated clinical prediction rule that calculates the pretest probability of deep vein thrombosis based on 10 clinical history and physical exam criteria.",
    faqQ2: "What score indicates a likely DVT?",
    faqA2: "A Wells Score of 2 or higher indicates that DVT is likely, warranting diagnostic venous compression ultrasound. A score under 2 indicates DVT is unlikely, where a negative D-dimer safely rules out thrombosis.",
    faqQ3: "Can the Wells Score be used in pregnant patients?",
    faqA3: "No. The standard Wells Criteria are not validated for pregnant or postpartum patients. Specialized algorithms such as the LEFt clinical prediction rule should be utilized during pregnancy.",
    references: "References: Wells PS, et al. Value of assessment of pretest probability of deep-vein thrombosis. NEJM.",
    likely: "DVT Likely",
    unlikely: "DVT Unlikely"
  },
  fr: {
    title: "Score de Wells pour l'at TVP",
    subtitle: "Déterminer la probabilité pré-test de thrombose veineuse profonde",
    cancer: "Cancer actif (traitement dans les 6 mois ou palliatif)",
    paralysis: "Paralysie, parésie ou plâtre récent des membres inférieurs",
    bedridden: "Alitement récent > 3 jours ou chirurgie majeure (< 12 sem)",
    tenderness: "Sensibilité localisée sur le trajet veineux profond",
    swelling: "Gonflement de toute la jambe",
    calfSwelling: "Gonflement du mollet > 3 cm par rapport à l'autre jambe",
    pittingEdema: "Œdème prenant le godet sur la jambe symptomatique",
    collateral: "Veines superficielles collatérales non variqueuses",
    dvthistory: "Antécédent documenté de TVP",
    alternativeDiagnoses: "Diagnostic alternatif au moins aussi probable que TVP (-2 points)",
    result: "Score Calculé",
    formula: "Somme des points (-2 à 9)",
    clinicalTitle: "Prochaines Étapes Cliniques",
    clinicalText: "Un score ≥ 2 indique que la TVP est probable ; envisagez une échographie. < 2 indique que la TVP est peu probable.",
    pillarTitle: "Preuves Cliniques et Stratégie Diagnostique de la TVP",
    pillarText: [
      "Le score de Wells pour la thrombose veineuse profonde (TVP) est la règle de prédiction clinique de référence pour évaluer la probabilité pré-test chez les patients présentant une suspicion de TVP des membres inférieurs. Développé par le Dr Philip S. Wells, ce score permet de guider en toute sécurité les examens d'imagerie et de laboratoire.",
      "Dans le modèle dichotomique, les patients sont classés en 'TVP peu probable' (Score < 2) et 'TVP probable' (Score ≥ 2). Chez les patients à faible probabilité, un dosage des D-dimères de haute sensibilité est recommandé ; des D-dimères négatifs permettent d'exclure une TVP sans échographie. Pour la catégorie probable, une échographie veineuse des membres inférieurs est indispensable.",
      "Le critère 'Diagnostic alternatif' (-2 points) nécessite un jugement clinique rigoureux pour déterminer si des affections telles qu'une érysipèle, un kyste de Baker ou une déchirure musculaire sont plus probables qu'une TVP."
    ],
    faqQ1: "Qu'est-ce que le score de Wells pour la TVP ?",
    faqA1: "Le score de Wells pour la TVP est un outil clinique validé qui évalue la probabilité pré-test de thrombose veineuse profonde reposant sur 10 critères anamnestiques et cliniques.",
    faqQ2: "Quel score indique une TVP probable ?",
    faqA2: "Un score de Wells ≥ 2 indique que la TVP est probable, nécessitant une échographie-doppler veineuse. Un score < 2 indique une faible probabilité, où des D-dimères négatifs suffisent à exclure la thrombose.",
    faqQ3: "Le score de Wells est-il applicable chez la femme enceinte ?",
    faqA3: "Non. Le score de Wells standard n'est pas validé pendant la grossesse ou le post-partum. Des algorithmes spécifiques comme le score LEFt doivent être utilisés.",
    references: "Références : Wells PS, et al. Value of assessment of pretest probability of deep-vein thrombosis.",
    likely: "TVP Probable",
    unlikely: "TVP Peu Probable"
  },
  ar: {
    title: "معايير ويلز لتجلط الأوردة العميقة",
    subtitle: "تحديد الاحتمال المسبق لتجلط الأوردة العميقة (DVT)",
    cancer: "سرطان نشط (علاج خلال 6 أشهر أو تلطيفي)",
    paralysis: "شلل، ضعف، أو تجبير حديث في الأطراف السفلية",
    bedridden: "ملازم الفراش حديثًا لـ> 3 أيام أو جراحة كبرى خلال 12 أسبوع",
    tenderness: "ألم موضعي على طول الجهاز الوريدي العميق",
    swelling: "تورم كامل في الساق",
    calfSwelling: "تورم ربلة الساق > 3 سم مقارنة بالساق الطبيعية",
    pittingEdema: "وذمة انطباعية تقتصر على الساق المصابة",
    collateral: "أوردة سطحية جانبية غير دوالية",
    dvthistory: "تاريخ موثق مسبقًا لـ DVT",
    alternativeDiagnoses: "تشخيص بديل محتمل على الأقل مثل DVT (-2 نقطة)",
    result: "النتيجة المحسوبة",
    formula: "مجموع النقاط (من -2 إلى 9)",
    clinicalTitle: "خطوات المعالجة السريرية",
    clinicalText: "درجة ≥ 2 تشير إلى احتمال كبير لـ DVT؛ يوصى بالتصوير بالموجات. درجة < 2 تشير إلى احتمال ضعيف.",
    pillarTitle: "الأدلة السريرية واستراتيجية تشخيص تجلط الأوردة العميقة",
    pillarText: [
      "تعد معايير ويلز لتجلط الأوردة العميقة (DVT) القاعدة الذهبية المعتمدة عالمياً لتقييم الاحتمالية السريرية المسبقة لدى المرضى المشتبه بإصابتهم بتجلط الأوردة في الأطراف السفلية. طورها الدكتور فيليب ويلز لترشيد استخدام التصوير بالموجات فوق الصوتية (الدوبلر) والفحوصات المعملية.",
      "في النموذج الثنائي المعتمد، يُصنف المرضى إلى 'احتمال غير مرجح' (أقل من 2) و'احتمال مرجح' (2 فأكثر). في الفئة غير المرجحة، يُجرى فحص D-dimer؛ والنتيجة السلبية تنفي الجلطة بأمان دون الحاجة لأشعة. أما في الفئة المرجحة، فيلزم إجراء أشعة دوبلر فوق صوتية للأوردة مباشرة.",
      "يتطلب معيار 'وجود تشخيص بديل أكثر احتمالاً' (-2 نقطة) تقييماً إكلينيكياً دقيقاً لاستبعاد حالات مثل التهاب الخلوي، كيس بيكر، أو تمزق العضلات قبل خصم النقاط."
    ],
    faqQ1: "ما هو مقياس ويلز لتجلط الأوردة العميقة (DVT)؟",
    faqA1: "مقياس ويلز هو أداة تقييم سريرية معتمدة تحسب الاحتمالية المسبقة للإصابة بتجلط الأوردة العميقة بناءً على 10 معايير مستمدة من التاريخ الطبي والفحص البدني.",
    faqQ2: "ما هي النتيجة التي تشير إلى احتمال وجود جلطة؟",
    faqA2: "النتيجة 2 أو أكثر تشير إلى احتمال مرجح لوجود جلطة، مما يستوجب إجراء أشعة دوبلر بالموجات فوق الصوتية. النتيجة أقل من 2 تشير لاحتمال ضعيف يُستبعد بفحص D-dimer سلبي.",
    faqQ3: "هل يمكن استخدام مقياس ويلز للحوامل؟",
    faqA3: "لا، مقياس ويلز غير معتمد سريرياً للمرأة الحامل أو في فترة النفاس. يُنصح باستخدام أدوات مخصصة لتلك الفئة مثل مقياس LEFt.",
    references: "المراجع: Wells PS, et al. تقييم الاحتمال المسبق لتجلط الأوردة.",
    likely: "محتمل",
    unlikely: "غير محتمل"
  }
};

const itemsList = [
  { key: 'cancer', points: 1 },
  { key: 'paralysis', points: 1 },
  { key: 'bedridden', points: 1 },
  { key: 'tenderness', points: 1 },
  { key: 'swelling', points: 1 },
  { key: 'calfSwelling', points: 1 },
  { key: 'pittingEdema', points: 1 },
  { key: 'collateral', points: 1 },
  { key: 'dvthistory', points: 1 },
  { key: 'alternativeDiagnoses', points: -2 },
] as const;

export default function WellsScore({ lang }: { lang: LangCode }) {
  const [selections, setSelections] = useState<Record<string, boolean>>({});

  const currentText = translations[lang];
  const isRtl = lang === 'ar';

  const toggleSelection = (key: string) => {
    setSelections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const scoreValue = useMemo(() => {
    return itemsList.reduce((acc, item) => {
      return acc + (selections[item.key] ? item.points : 0);
    }, 0);
  }, [selections]);

  useEffect(() => {
    if (scoreValue !== 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('wells-score', lang, scoreValue);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [scoreValue, lang]);

  const category = scoreValue >= 2 
    ? { label: currentText.likely, bg: 'bg-red-500/10 border-red-500/20', color: 'text-red-500' }
    : { label: currentText.unlikely, bg: 'bg-emerald-500/10 border-emerald-500/20', color: 'text-emerald-500' };

  return (
    <>
      <JsonLd data={generateMedicalCalculatorSchema(currentText.title, currentText.subtitle)} />
      <div className="max-w-3xl mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="wells-score" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3">
          {currentText.subtitle}
        </p>

        {/* GEO Definition Block */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 md:p-5 mt-6 mb-2">
          <h2 className="text-sm font-semibold text-blue-900 mb-2 uppercase tracking-wide">
            {lang === 'en' ? 'Clinical Definition' : lang === 'fr' ? 'Définition Clinique' : 'التعريف السريري'}
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            {currentText.faqA1}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-gray-950/5 p-6 md:p-8">
            <div className="space-y-4">
              
              {itemsList.map(item => (
                <div 
                  key={item.key}
                  onClick={() => toggleSelection(item.key)}
                  className={`p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-all flex items-start gap-4 ${selections[item.key] ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500/30' : 'border-gray-200'}`}
                >
                  <div className={`mt-0.5 shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${selections[item.key] ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'}`}>
                    {selections[item.key] && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 flex justify-between gap-4">
                    <span className={`text-sm font-medium ${selections[item.key] ? 'text-gray-900' : 'text-gray-700'}`}>
                      {currentText[item.key]}
                    </span>
                    <span className={`text-sm font-mono shrink-0 ${item.points > 0 ? 'text-gray-500' : 'text-red-500'}`}>
                      {item.points > 0 ? `+${item.points}` : item.points}
                    </span>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky top-28 bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 flex flex-col justify-between p-8 min-h-[320px]">
            <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                {currentText.result}
              </span>
              
              <div className="flex items-baseline gap-2 tabular-nums">
                <span className="text-7xl font-bold tracking-tighter transition-all duration-300">
                  {scoreValue}
                </span>
                <span className="text-xl font-medium text-gray-400">Points</span>
              </div>
            </div>

            <div className="relative z-10 mt-10">
              <div className={`p-4 rounded-xl border flex justify-between items-center transition-all ${category.bg} ${category.color}`}>
                <div className="font-semibold text-sm">
                  {category.label}
                </div>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={itemsList.map(item => ({
                  label: currentText[item.key],
                  value: selections[item.key] ? 'YES (+1 pt)' : 'NO (0 pt)'
                }))}
                results={[
                  { label: 'Wells Score', value: `${scoreValue} Points` },
                  { label: 'Risk Probability', value: category.label }
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
            </div>
          </div>
        </div>
      </div>

      {/* In-Content Native Ad */}
      <AdsterraNativeBanner refreshDependency={scoreValue} />

      {/* Pillar Content Section */}
      <div className="mt-8 pt-10 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{currentText.pillarTitle}</h2>
        <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
          {currentText.pillarText?.map((paragraph: string, idx: number) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12 pt-8 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{layoutTranslations[lang].faqTitle}</h2>
        <div className="space-y-3">
          {[
            { q: currentText.faqQ1, a: currentText.faqA1 },
            { q: currentText.faqQ2, a: currentText.faqA2 },
            { q: currentText.faqQ3, a: currentText.faqA3 },
          ].map(({ q, a }) => (
            <details key={q} className="group border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                <span className="text-sm">{q}</span>
                <span className="w-4 h-4 text-gray-400 shrink-0 ml-3 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}
