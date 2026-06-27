import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown } from 'lucide-react';
import { LangCode, Translations } from '../types';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';
import ClinicalExportButton from '../components/ClinicalExportButton';

const translations: Translations = {
  en: {
    title: "qSOFA Score",
    subtitle: "Quick Sepsis-related Organ Failure Assessment",
    rr22: "Respiratory rate ≥ 22/min",
    mentation: "Altered mentation (GCS < 15)",
    sbp100: "Systolic blood pressure ≤ 100 mmHg",
    result: "qSOFA Score",
    formula: "1 point per positive criterion",
    clinicalTitle: "Clinical Management",
    clinicalText: "Score ≥ 2 indicates a high risk of poor outcome and suggests the patient should be investigated for sepsis.",
    pillarTitle: "Sepsis-3 Consensus and the Evolution of Sepsis Screening",
    pillarText: [
      "The quick Sequential Organ Failure Assessment (qSOFA) score was introduced in 2016 as part of the Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3). Prior to this, the Systemic Inflammatory Response Syndrome (SIRS) criteria were universally used to screen for sepsis. However, the Sepsis-3 task force argued that SIRS criteria lacked specificity, as many non-infectious conditions (like pancreatitis, trauma, or severe burns) routinely trigger a robust systemic inflammatory response without indicating an impending, life-threatening infection.",
      "The qSOFA score was specifically designed as a bedside prompt for clinicians outside the intensive care unit (such as in emergency departments or general medical wards). It is not diagnostic for sepsis; rather, it is prognostic. A score of 2 or greater signifies a high probability of a poor clinical outcome (specifically, an in-hospital mortality risk of approximately 10% or an impending ICU admission). This should trigger immediate clinical actions, including drawing blood cultures, measuring serum lactate, and initiating empiric broad-spectrum intravenous antibiotics.",
      "While qSOFA improves specificity over SIRS, it sacrifices sensitivity. Some studies have shown that waiting for a patient to develop two qSOFA criteria may delay the recognition of early sepsis compared to SIRS. Consequently, many modern hospital protocols and the Surviving Sepsis Campaign recommend using qSOFA in conjunction with other clinical early warning scores (like MEWS or NEWS), rather than as a standalone screening tool to replace clinical judgment."
    ],
    references: "References: Singer M, et al. The Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3).",
    lowRisk: "Low Risk (< 2)",
    highRisk: "High Risk of Sepsis (≥ 2)",
    faqQ1: "What is the qSOFA score?",
    faqA1: "The quick SOFA (qSOFA) is a bedside clinical tool for rapid identification of patients likely to have poor outcomes due to infection-related organ dysfunction (sepsis). It scores three criteria: Respiratory Rate ≥22/min, Altered Mentation (GCS <15), and Systolic BP ≤100 mmHg.",
    faqQ2: "What qSOFA score is considered high risk?",
    faqA2: "A qSOFA score of ≥2 out of 3 indicates high risk of poor outcome and should prompt clinicians to investigate for sepsis, initiate monitoring, and consider ICU-level care, per the Sepsis-3 consensus (Singer et al., JAMA 2016).",
    faqQ3: "What is the difference between qSOFA and SOFA?",
    faqA3: "qSOFA is a 3-item bedside screening tool usable without lab tests. Full SOFA requires lab values (PaO2, bilirubin, creatinine, platelets) and is used for formal organ failure quantification in the ICU.",
    faqQ4: "Should qSOFA replace SIRS criteria for sepsis screening?",
    faqA4: "The Sepsis-3 consensus replaced SIRS with qSOFA for out-of-ICU sepsis screening, arguing SIRS lacked specificity. Both tools remain in use across different guidelines and settings.",
  },
  fr: {
    title: "Score qSOFA",
    subtitle: "Évaluation rapide de la défaillance d'organe liée au sepsis",
    rr22: "Fréquence respiratoire ≥ 22/min",
    mentation: "Altération de l'état mental (GCS < 15)",
    sbp100: "Pression artérielle systolique ≤ 100 mmHg",
    result: "Score qSOFA",
    formula: "1 point par critère",
    clinicalTitle: "Prise en charge",
    clinicalText: "Un score ≥ 2 indique un risque élevé de mortalité et suggère d'investiguer un sepsis.",
    pillarTitle: "Le Consensus Sepsis-3 et l'Évolution du Dépistage du Sepsis",
    pillarText: [
      "Le score qSOFA (quick Sequential Organ Failure Assessment) a été introduit en 2016 dans le cadre de la troisième définition du consensus international pour le sepsis et le choc septique (Sepsis-3). Auparavant, les critères du syndrome de réponse inflammatoire systémique (SIRS) étaient universellement utilisés pour dépister le sepsis. Cependant, le groupe de travail Sepsis-3 a fait valoir que les critères SIRS manquaient de spécificité, car de nombreuses affections non infectieuses (comme la pancréatite ou les traumatismes) déclenchent une réponse inflammatoire systémique sans indiquer d'infection mortelle.",
      "Le score qSOFA a été spécifiquement conçu comme une alerte au chevet du patient pour les cliniciens en dehors des unités de soins intensifs (comme aux urgences ou dans les services de médecine générale). Il ne permet pas de diagnostiquer le sepsis ; il est plutôt pronostique. Un score supérieur ou égal à 2 signifie une forte probabilité d'évolution clinique défavorable (mortalité intra-hospitalière d'environ 10 %). Cela doit déclencher des actions cliniques immédiates, notamment des hémocultures, la mesure des lactates et l'initiation d'une antibiothérapie intraveineuse à large spectre.",
      "Bien que le qSOFA améliore la spécificité par rapport au SIRS, il sacrifie la sensibilité. Certaines études ont montré qu'attendre qu'un patient développe deux critères qSOFA peut retarder la reconnaissance d'un sepsis précoce. Par conséquent, de nombreux protocoles hospitaliers modernes recommandent d'utiliser le qSOFA en conjonction avec d'autres scores d'alerte clinique (comme le MEWS ou le NEWS)."
    ],
    references: "Références: Singer M, et al. (Sepsis-3).",
    lowRisk: "Faible Risque (< 2)",
    highRisk: "Haut Risque de Sepsis (≥ 2)",
    faqQ1: "Qu'est-ce que le score qSOFA ?",
    faqA1: "Le score qSOFA (quick SOFA) est un outil clinique de chevet permettant d'identifier rapidement les patients risquant de présenter des complications graves liées à un dysfonctionnement d'organe induit par une infection (sepsis). Il évalue trois critères : Fréquence respiratoire ≥22/min, État mental altéré (GCS <15) et Pression artérielle systolique ≤100 mmHg.",
    faqQ2: "Quel score qSOFA est considéré comme à haut risque ?",
    faqA2: "Un score qSOFA ≥2 sur 3 indique un risque élevé d'évolution défavorable. Il doit inciter les cliniciens à rechercher un sepsis, à renforcer la surveillance et à envisager une admission en réanimation, selon le consensus Sepsis-3 (Singer et al., JAMA 2016).",
    faqQ3: "Quelle est la différence entre le qSOFA et le SOFA ?",
    faqA3: "Le qSOFA est un outil de dépistage rapide au chevet utilisable sans examen biologique. Le score SOFA complet nécessite des analyses de laboratoire (PaO2, bilirubine, créatinine, plaquettes) pour quantifier formellement les défaillances d'organes en soins intensifs.",
    faqQ4: "Le score qSOFA doit-il remplacer les critères SIRS pour le dépistage du sepsis ?",
    faqA4: "Le consensus Sepsis-3 a remplacé le SIRS par le qSOFA pour le dépistage hors réanimation, estimant que le SIRS manquait de spécificité. Cependant, les deux outils restent couramment utilisés selon les directives et les contextes cliniques.",
  },
  ar: {
    title: "مقياس qSOFA",
    subtitle: "التقييم السريع لفشل الأعضاء المرتبط بالإنتان (Sepsis)",
    rr22: "معدل التنفس ≥ 22/دقيقة",
    mentation: "تغير في الحالة العقلية (GCS < 15)",
    sbp100: "ضغط الدم الانقباضي ≤ 100 مم زئبق",
    result: "نقاط qSOFA",
    formula: "نقطة واحدة لكل معيار إيجابي",
    clinicalTitle: "التدبير السريري",
    clinicalText: "درجة ≥ 2 تشير إلى ارتفاع خطر النتائج السيئة ويجب تقييم المريض لاحتمال وجود إنتان.",
    pillarTitle: "إجماع Sepsis-3 وتطور فحص الإنتان",
    pillarText: [
      "تم تقديم مقياس qSOFA السريع في عام 2016 كجزء من تعريفات الإجماع الدولي الثالث للإنتان والصدمة الإنتانية (Sepsis-3). قبل ذلك، كانت معايير متلازمة الاستجابة الالتهابية الجهازية (SIRS) تستخدم عالمياً للكشف عن الإنتان. ومع ذلك، جادل فريق عمل Sepsis-3 بأن معايير SIRS تفتقر إلى التحديد، حيث أن العديد من الحالات غير المعدية (مثل التهاب البنكرياس أو الصدمات أو الحروق الشديدة) تؤدي بشكل روتيني إلى استجابة التهابية جهازية قوية دون الإشارة إلى وجود عدوى وشيكة تهدد الحياة.",
      "تم تصميم مقياس qSOFA خصيصاً كأداة تحذير بجانب السرير للأطباء خارج وحدة العناية المركزة (كما هو الحال في أقسام الطوارئ أو الأجنحة الطبية العامة). إنه ليس تشخيصياً للإنتان؛ بل هو إنذاري. النتيجة 2 أو أكثر تشير إلى احتمال كبير لنتيجة سريرية سيئة (تحديداً، خطر الوفاة في المستشفى بنسبة تقارب 10٪ أو الدخول الوشيك إلى وحدة العناية المركزة). يجب أن يؤدي هذا إلى إجراءات سريرية فورية، بما في ذلك سحب مزارع الدم، وقياس اللاكتات في المصل، والبدء في إعطاء المضادات الحيوية واسعة الطيف.",
      "في حين أن qSOFA يحسن التحديد مقارنة بـ SIRS، فإنه يضحي بالحساسية. أظهرت بعض الدراسات أن انتظار إصابة المريض بمعيارين من معايير qSOFA قد يؤخر التعرف على الإنتان المبكر مقارنة بـ SIRS. وبالتالي، توصي العديد من بروتوكولات المستشفيات الحديثة وحملة النجاة من الإنتان باستخدام qSOFA بالاقتران مع درجات الإنذار المبكر السريرية الأخرى (مثل MEWS أو NEWS)."
    ],
    references: "المراجع: إجماع Sepsis-3.",
    lowRisk: "خطر منخفض (< 2)",
    highRisk: "خطر عالٍ للإنتان (≥ 2)",
    faqQ1: "ما هو مقياس qSOFA السريع؟",
    faqA1: "مقياس qSOFA (quick SOFA) هو أداة سريرية سريعة تستخدم بجانب سرير المريض لتحديد المرضى المعرضين لنتائج سيئة بسبب خلل وظائف الأعضاء الناتج عن العدوى (الإنتان). يقيس ثلاثة معايير: معدل التنفس ≥ 22/دقيقة، الاضطراب الذهني (GCS < 15)، والضغط الانقباضي ≤ 100 مم زئبق.",
    faqQ2: "ما هي درجة مقياس qSOFA التي تمثل خطورة عالية؟",
    faqA2: "تمثل نتيجة 2 أو أكثر من 3 خطورة عالية لنتائج سريرية سيئة، ويجب أن تدفع الطبيب فوراً لفحص المريض تحسباً للإنتان وتفعيل بروتوكولات العلاج والمراقبة، وفقاً لتوصيات Sepsis-3.",
    faqQ3: "ما الفرق بين qSOFA ومقياس SOFA الكامل؟",
    faqA3: "مقياس qSOFA هو أداة فحص سريرية سريعة يمكن إجراؤها فوراً بدون فحوصات مخبرية. بينما يتطلب SOFA الكامل فحوصات مخبرية مثل مستويات الكرياتينين، والصفائح الدموية، والبليروبين، وغازات الدم الشرياني لتقييم الأعضاء بالتفصيل في العناية المركزة.",
    faqQ4: "هل يجب أن يحل qSOFA محل معايير SIRS للالتهاب العام؟",
    faqA4: "استبدل إجماع Sepsis-3 معايير SIRS بمقياس qSOFA لفرز حالات الإنتان خارج العناية المركزة لكونه أكثر دقة وتحديداً للوفيات. ومع ذلك، لا تزال كلتا الأداتين تستخدمان بشكل متكامل في العديد من الإرشادات الطبية.",
  }
};

const criteriaList = [
  { key: 'rr22' },
  { key: 'mentation' },
  { key: 'sbp100' }
] as const;

export default function QsofaScore({ lang }: { lang: LangCode }) {
  const [selections, setSelections] = useState<Record<string, boolean>>({});

  const currentText = translations[lang];
  const isRtl = lang === 'ar';

  const toggleSelection = (key: string) => {
    setSelections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const scoreValue = useMemo(() => {
    return criteriaList.reduce((acc, item) => {
      return acc + (selections[item.key] ? 1 : 0);
    }, 0);
  }, [selections]);

  useEffect(() => {
    if (scoreValue > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('qsofa-score', lang, scoreValue);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [scoreValue, lang]);

  const category = scoreValue >= 2 
    ? { label: currentText.highRisk, bg: 'bg-red-500/10 border-red-500/20', color: 'text-red-500' }
    : { label: currentText.lowRisk, bg: 'bg-emerald-500/10 border-emerald-500/20', color: 'text-emerald-500' };

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
            <div className="space-y-4">
              
              {criteriaList.map(item => (
                <div 
                  key={item.key}
                  onClick={() => toggleSelection(item.key)}
                  className={`p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-all flex items-start gap-4 ${selections[item.key] ? 'border-red-500 bg-red-50/30 ring-1 ring-red-500/30' : 'border-gray-200'}`}
                >
                  <div className={`mt-0.5 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selections[item.key] ? 'bg-red-600 border-red-600 text-white' : 'border-gray-300'}`}>
                    {selections[item.key] && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.6667 3.5L5.25001 9.91667L2.33334 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 flex justify-between gap-4 pt-0.5">
                    <span className={`text-base font-medium ${selections[item.key] ? 'text-gray-900' : 'text-gray-700'}`}>
                      {currentText[item.key]}
                    </span>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky top-28 bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 flex flex-col justify-between p-8 min-h-[320px]">
            <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-red-500/10 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                {currentText.result}
              </span>
              
              <div className="flex items-baseline gap-2 tabular-nums">
                <span className="text-7xl font-bold tracking-tighter transition-all duration-300">
                  {scoreValue}
                </span>
                <span className="text-xl font-medium text-gray-400">/ 3</span>
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
                inputs={[
                  { label: currentText.rr22, value: selections.rr22 ? 'Yes (1)' : 'No (0)' },
                  { label: currentText.mentation, value: selections.mentation ? 'Yes (1)' : 'No (0)' },
                  { label: currentText.sbp100, value: selections.sbp100 ? 'Yes (1)' : 'No (0)' }
                ]}
                results={[
                  { label: currentText.result, value: `${scoreValue} / 3` },
                  { label: 'Risk Stratification', value: category.label }
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
              <a href="https://pubmed.ncbi.nlm.nih.gov/26973543/" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Singer et al., JAMA 2016 — Sepsis-3 Definitions (PMID: 26973543) →</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pillar Content Section */}
      <div className="mt-12 pt-10 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{currentText.pillarTitle}</h2>
        <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
          {currentText.pillarText.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{layoutTranslations[lang].seeAlso}</h2>
        <div className="flex flex-wrap gap-2 mb-10">
          {[
            { label: 'SIRS Criteria', path: '/sirs-criteria' },
            { label: 'CURB-65 Score', path: '/curb65-score' },
            { label: 'MAP Calculator', path: '/map-calculator' },
            { label: 'Glasgow Coma Scale', path: '/glasgow-coma-scale' },
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
