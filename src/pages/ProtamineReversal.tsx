import React, { useState, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, ShieldAlert } from 'lucide-react';
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
    title: "Protamine Reversal",
    subtitle: "Calculate Protamine Sulfate dose for Heparin/LMWH reversal",
    agent: "Anticoagulant Agent",
    enox: "Enoxaparin (LMWH)",
    heparin: "Heparin IV (UFH)",
    enoxDose: "Enoxaparin Dose Given (mg)",
    hepDose: "Heparin Dose Given in Last 2-3 Hours (Units)",
    timeElapsed: "Time Since Last Dose",
    less8: "≤ 8 hours",
    between812: "8 - 12 hours",
    more12: "> 12 hours",
    result: "Recommended Protamine",
    mg: "mg",
    formula: "LMWH: 1 mg/1mg (<8h) | UFH: 1 mg/100U",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "Protamine sulfate rapidly neutralizes unfractionated heparin (UFH). It only partially neutralizes low molecular weight heparins (LMWH) like enoxaparin (~60%).",
    pillarTitle: "Usage Guidelines",
    pillarText: [
      "MAXIMUM single dose of protamine should not exceed 50 mg due to risk of hypotension and paradoxically acting as a weak anticoagulant.",
      "Administer by slow IV push (over 10 minutes).",
      "Heparin half-life is short (~60-90 min), so only the heparin infused in the preceding 2-3 hours needs to be neutralized.",
      "Allergic reactions are more common in patients with fish allergies, prior protamine exposure (e.g., NPH insulin), or vasectomy."
    ],
    references: "Garcia DA, et al. Parenteral anticoagulants: Antithrombotic Therapy and Prevention of Thrombosis, 9th ed: ACCP Guidelines. Chest. 2012.",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "Can I give more than 50 mg?",
    faqA1: "Generally no. Doses > 50 mg in a single injection increase the risk of severe cardiovascular collapse and can actually worsen bleeding.",
    faqQ2: "Does protamine reverse apixaban or rivaroxaban?",
    faqA2: "No. Protamine only works on heparin and partially on LMWH. For DOACs, agents like Andexanet alfa or PCC are used.",
  },
  fr: {
    title: "Inversion par Protamine",
    subtitle: "Calculer la dose de sulfate de protamine",
    agent: "Anticoagulant",
    enox: "Énoxaparine (HBPM)",
    heparin: "Héparine IV (HNF)",
    enoxDose: "Dose d'Énoxaparine Reçue (mg)",
    hepDose: "Héparine Reçue (2-3 dernières heures) (Unités)",
    timeElapsed: "Temps depuis la dernière dose",
    less8: "≤ 8 heures",
    between812: "8 - 12 heures",
    more12: "> 12 heures",
    result: "Protamine Recommandée",
    mg: "mg",
    formula: "HBPM: 1mg/1mg (<8h) | HNF: 1mg/100U",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "La protamine neutralise rapidement l'héparine non fractionnée (HNF). Elle ne neutralise que partiellement les HBPM (~60%).",
    pillarTitle: "Recommandations d'Utilisation",
    pillarText: [
      "La dose MAXIMALE unique ne doit pas dépasser 50 mg (risque d'hypotension et d'effet anticoagulant paradoxal).",
      "Administrer en IV lente (sur 10 minutes).",
      "La demi-vie de l'HNF étant courte, seule la dose reçue dans les 2-3 dernières heures doit être neutralisée.",
      "Risque allergique accru si : allergie au poisson, exposition préalable (insuline NPH), vasectomie."
    ],
    references: "Garcia DA, et al. Parenteral anticoagulants: Antithrombotic Therapy and Prevention of Thrombosis, 9th ed: ACCP Guidelines. Chest. 2012.",
    faqTitle: "Questions Fréquentes",
    faqQ1: "Puis-je donner plus de 50 mg ?",
    faqA1: "Généralement non. Une dose >50 mg augmente le risque de collapsus cardiovasculaire et peut aggraver les saignements.",
    faqQ2: "La protamine neutralise-t-elle l'apixaban (AOD) ?",
    faqA2: "Non. Elle n'agit que sur l'héparine et les HBPM.",
  },
  es: {
    title: "Reversión con Protamina",
    subtitle: "Calcular la dosis de sulfato de protamina",
    agent: "Agente Anticoagulante",
    enox: "Enoxaparina (HBPM)",
    heparin: "Heparina IV (HNF)",
    enoxDose: "Dosis de Enoxaparina Administrada (mg)",
    hepDose: "Heparina administrada (últimas 2-3 hs) (Unidades)",
    timeElapsed: "Tiempo desde la última dosis",
    less8: "≤ 8 horas",
    between812: "8 - 12 horas",
    more12: "> 12 horas",
    result: "Protamina Recomendada",
    mg: "mg",
    formula: "HBPM: 1mg/1mg (<8h) | HNF: 1mg/100U",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "El sulfato de protamina neutraliza rápidamente la heparina (HNF). Solo neutraliza parcialmente las HBPM (enoxaparina) en un ~60%.",
    pillarTitle: "Pautas de Uso",
    pillarText: [
      "La dosis MÁXIMA por bolo no debe superar los 50 mg por riesgo de hipotensión y efecto anticoagulante paradójico.",
      "Administrar por inyección IV lenta (en 10 minutos).",
      "La vida media de la HNF es corta, por lo que solo debe neutralizarse lo administrado en las últimas 2-3 hs.",
      "Las reacciones alérgicas son más comunes en pacientes con alergia al pescado, exposición previa a protamina o vasectomía."
    ],
    references: "Garcia DA, et al. Parenteral anticoagulants: Antithrombotic Therapy and Prevention of Thrombosis, 9th ed: ACCP Guidelines. Chest. 2012.",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Puedo administrar más de 50 mg?",
    faqA1: "Generalmente no. Las dosis > 50 mg en una sola inyección aumentan el riesgo de colapso cardiovascular y pueden empeorar el sangrado.",
    faqQ2: "¿Revierte DOACs como apixabán?",
    faqA2: "No. Solo heparinas.",
  },
  ar: {
    title: "انعكاس الهيبارين بالبروتامين",
    subtitle: "حساب جرعة كبريتات البروتامين لمعاكسة مفعول الهيبارين",
    agent: "مضاد التخثر",
    enox: "إينوكسابارين (LMWH)",
    heparin: "هيبارين وريدي (UFH)",
    enoxDose: "جرعة الإينوكسابارين المعطاة (مجم)",
    hepDose: "جرعة الهيبارين المعطاة في آخر ساعتين (وحدات)",
    timeElapsed: "الوقت منذ آخر جرعة",
    less8: "≤ 8 ساعات",
    between812: "8 - 12 ساعة",
    more12: "> 12 ساعة",
    result: "البروتامين الموصى به",
    mg: "مجم",
    formula: "الهيبارين: 1مجم/100وحدة | الإينوكسابارين: 1مجم/1مجم",
    clinicalTitle: "التفسير السريري",
    clinicalText: "يعادل كبريتات البروتامين مفعول الهيبارين غير المجزأ (UFH) بسرعة. ولكنه يعادل الهيبارين منخفض الوزن الجزيئي (مثل الإينوكسابارين) جزئياً فقط (~60%).",
    pillarTitle: "إرشادات الاستخدام",
    pillarText: [
      "يجب ألا تتجاوز الجرعة الواحدة القصوى من البروتامين 50 مجم بسبب خطر هبوط الضغط وعمل البروتامين كمضاد تخثر ضعيف.",
      "يُعطى ببطء عبر الوريد (خلال 10 دقائق).",
      "عمر النصف للهيبارين قصير، لذا يتم حساب الجرعة المطلوبة لمعادلة ما تم تسريبه في آخر ساعتين إلى ثلاث ساعات فقط.",
      "تكون التفاعلات التحسسية أكثر شيوعاً عند مرضى حساسية الأسماك، أو التعرض السابق للبروتامين."
    ],
    references: "Garcia DA, et al. Parenteral anticoagulants: Antithrombotic Therapy and Prevention of Thrombosis, 9th ed: ACCP Guidelines. Chest. 2012.",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "هل يمكنني إعطاء أكثر من 50 مجم؟",
    faqA1: "بشكل عام لا. زيادة الجرعة عن 50 مجم في الحقنة الواحدة تزيد خطر الانهيار القلبي الوعائي وقد تزيد النزيف سوءاً.",
    faqQ2: "هل يعكس البروتامين أدوية السيولة الحديثة (DOACs)؟",
    faqA2: "لا، البروتامين مخصص للهيبارين فقط.",
  }
};

export default function ProtamineReversal({ lang }: { lang: LangCode }) {
  const [agent, setAgent] = useState<'heparin' | 'enox'>('heparin');
  const [dose, setDose] = useState<string>('');
  const [timeSince, setTimeSince] = useState<'<8' | '8-12' | '>12'>('<8');

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const isComplete = dose !== '' && !isNaN(parseFloat(dose)) && parseFloat(dose) > 0;
  
  let result = 0;
  let capped = false;

  if (isComplete) {
    const doseNum = parseFloat(dose);
    if (agent === 'heparin') {
      // 1 mg per 100 U of heparin
      result = doseNum / 100;
    } else {
      // Enoxaparin
      if (timeSince === '<8') {
        result = doseNum * 1;
      } else if (timeSince === '8-12') {
        result = doseNum * 0.5;
      } else {
        result = 0;
      }
    }

    if (result > 50) {
      result = 50;
      capped = true;
    }
  }

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('protamine-reversal', lang, result);
        trackCalculatorResult('protamine-reversal', result, 'mg', lang);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, result, lang]);

  const renderToggle = (val: any, setter: any, option1: any, option2: any, label1: string, label2: string) => (
    <div className="flex bg-gray-100 p-1 rounded-xl w-full">
      <button
        onClick={() => setter(option1)}
        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${val === option1 ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
      >
        {label1}
      </button>
      <button
        onClick={() => setter(option2)}
        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${val === option2 ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
      >
        {label2}
      </button>
    </div>
  );

  return (
    <>
      <JsonLd data={generateMedicalCalculatorSchema(currentText.title, currentText.subtitle)} />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-purple-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="w-full max-w-full max-w-3xl mb-12 relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 bg-clip-text text-transparent mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="protamine-reversal" lang={lang} title={currentText.title} />
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
                <label className="text-sm font-semibold text-gray-900">{currentText.agent}</label>
                {renderToggle(agent, setAgent, 'heparin', 'enox', currentText.heparin, currentText.enox)}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">
                  {agent === 'heparin' ? currentText.hepDose : currentText.enoxDose}
                </label>
                <input
                  type="number" inputMode="decimal"
                  value={dose}
                  onChange={(e) => setDose(e.target.value)}
                  placeholder={agent === 'heparin' ? "1000" : "80"}
                  className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                  dir="ltr"
                />
              </div>

              {agent === 'enox' && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.timeElapsed}</label>
                  <div className="grid grid-cols-3 gap-2 bg-gray-100 p-1 rounded-xl">
                    <button
                      onClick={() => setTimeSince('<8')}
                      className={`py-2 text-sm font-bold rounded-lg transition-all ${timeSince === '<8' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {currentText.less8}
                    </button>
                    <button
                      onClick={() => setTimeSince('8-12')}
                      className={`py-2 text-sm font-bold rounded-lg transition-all ${timeSince === '8-12' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {currentText.between812}
                    </button>
                    <button
                      onClick={() => setTimeSince('>12')}
                      className={`py-2 text-sm font-bold rounded-lg transition-all ${timeSince === '>12' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {currentText.more12}
                    </button>
                  </div>
                </div>
              )}

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
                <ShieldAlert className="w-5 h-5 text-red-400" />
              </div>
              
              <div className="flex items-baseline gap-2 tabular-nums my-2" dir="ltr">
                <span className="text-7xl font-black tracking-tighter transition-all duration-300 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {isComplete ? result.toFixed(1) : '--'}
                </span>
                <span className="text-2xl font-bold text-slate-500">{currentText.mg}</span>
              </div>
            </div>

            <div className="relative z-10 mt-6 space-y-4">
              {isComplete ? (
                <div className={`p-4 rounded-2xl border backdrop-blur-md transition-all shadow-lg ${capped ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-gray-800/50 border-gray-700/80 text-white'}`}>
                  {capped && (
                    <div className="font-bold text-sm tracking-wide mb-1">
                      ⚠️ Dose capped at 50 mg max.
                    </div>
                  )}
                  <div className="text-sm opacity-90">
                    Administer by slow IV push (1-3 mg/min), not to exceed 50 mg per dose in any 10 minute period.
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border flex justify-between items-center transition-all bg-gray-800/50 border-gray-700/80 text-slate-400 backdrop-blur-md">
                  <div className="font-semibold text-sm">
                    {lang === 'fr' ? 'Entrez la dose' : lang === 'es' ? 'Ingrese dosis' : lang === 'ar' ? 'أدخل الجرعة' : 'Enter dose to calculate'}
                  </div>
                </div>
              )}

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "Agent", value: agent === 'heparin' ? 'Heparin' : 'Enoxaparin' },
                  { label: "Dose", value: agent === 'heparin' ? `${dose} Units` : `${dose} mg` },
                  ...(agent === 'enox' ? [{ label: "Time", value: timeSince }] : [])
                ]}
                results={[
                  { label: "Protamine Dose", value: isComplete ? `${result.toFixed(1)} mg` : '--' }
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

