import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, Check, Copy } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import CalculatorInput from '../components/ui/CalculatorInput';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';

const translations: Translations = {
  en: {
    title: "Anion Gap Calculator",
    subtitle: "Calculate serum anion gap and correct for albumin to evaluate metabolic acidosis",
    sodium: "Sodium (Na+)",
    chloride: "Chloride (Cl-)",
    bicarbonate: "Bicarbonate (HCO3-)",
    albumin: "Serum Albumin",
    result: "Calculated Anion Gap",
    correctedResult: "Albumin-Corrected AG",
    normal: "Normal Anion Gap",
    normalSub: "8 - 12 mEq/L",
    high: "High Anion Gap",
    highSub: "> 12 mEq/L (HAGMA)",
    low: "Low Anion Gap",
    lowSub: "< 8 mEq/L",
    formula: "AG = Na+ - (Cl- + HCO3-)",
    correctedFormula: "Corrected AG = AG + 2.5 * (4.0 - Albumin)",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "An elevated anion gap suggests accumulation of unmeasured organic acids (e.g. lactic acid, ketoacids). Correcting for albumin is essential in patients with hypoalbuminemia, as a drop in albumin by 1 g/dL lowers the normal anion gap by 2.5 mEq/L.",
    references: "References: Emmett M, Narins RG. Clinical use of the anion gap. Medicine 1977.",
    faqQ1: "What is the serum Anion Gap?",
    faqA1: "The serum anion gap is a calculated metric representing the difference between measured cations (sodium) and measured anions (chloride and bicarbonate). It helps identify the cause of metabolic acidosis.",
    faqQ2: "What is a normal serum Anion Gap?",
    faqA2: "A normal anion gap is typically 8 to 12 mEq/L (without potassium). However, reference ranges vary slightly by laboratory and assay methods.",
    faqQ3: "Why is it important to correct the Anion Gap for albumin?",
    faqA3: "Albumin is the major unmeasured anion in serum. For every 1 g/dL decrease in serum albumin below the normal value of 4.0 g/dL, the baseline anion gap decreases by approximately 2.5 mEq/L. Failing to correct for low albumin can mask an underlying high-gap acidosis.",
    faqQ4: "What causes a high Anion Gap metabolic acidosis (HAGMA)?",
    faqA4: "HAGMA is caused by accumulation of unmeasured acid anions. Common etiologies can be recalled using the GOLD MARK mnemonic: Glycols, Oxoproline, L-lactate, D-lactate, Methanol, Aspirin (salicylates), Renal failure, and Ketoacidosis.",
  },
  fr: {
    title: "Calculateur de Trou Anionique",
    subtitle: "Calculer le trou anionique plasmatique corrigé par l'albumine",
    sodium: "Sodium (Na+)",
    chloride: "Chlore (Cl-)",
    bicarbonate: "Bicarbonate (HCO3-)",
    albumin: "Albumine Sérique",
    result: "Trou Anionique",
    correctedResult: "Trou Anionique Corrigé",
    normal: "Trou Anionique Normal",
    normalSub: "8 - 12 mEq/L",
    high: "Trou Anionique Élevé",
    highSub: "> 12 mEq/L (Acidose)",
    low: "Trou Anionique Bas",
    lowSub: "< 8 mEq/L",
    formula: "TA = Na+ - (Cl- + HCO3-)",
    correctedFormula: "TA Corrigé = TA + 2,5 * (4,0 - Albumine)",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Un trou anionique augmenté signale une accumulation d'acides organiques non mesurés (lactates, cétones). La correction par l'albumine est essentielle en cas d'hypoalbuminémie.",
    references: "Références : Emmett M, Narins RG. Clinical use of the anion gap. Medicine 1977.",
    faqQ1: "Qu'est-ce que le trou anionique plasmatique ?",
    faqA1: "Le trou anionique est la différence entre les cations mesurés (sodium) et les anions mesurés (chlore et bicarbonate). Il aide à diagnostiquer et classer les acidoses métaboliques.",
    faqQ2: "Quelle est la valeur normale du trou anionique ?",
    faqA2: "La valeur normale se situe habituellement entre 8 et 12 mEq/L (sans le potassium). Les valeurs de référence peuvent varier selon le laboratoire.",
    faqQ3: "Pourquoi corriger le trou anionique par l'albumine ?",
    faqA3: "L'albumine est la principale protéine chargée négativement dans le sang. Une baisse d'albumine de 1 g/dL diminue le trou anionique de base de 2,5 mEq/L. Corriger ce biais évite de rater une acidose masquée.",
    faqQ4: "Quelles sont les causes d'un trou anionique élevé ?",
    faqA4: "Un trou anionique élevé traduit une acidose métabolique à trou anionique augmenté (HAGMA). Les causes majeures incluent l'acidose lactique, l'acidocétose (diabétique, alcoolique), l'insuffisance rénale sévère et certaines intoxications (méthanol, éthylène glycol, aspirine).",
  },
  ar: {
    title: "حاسبة الفجوة الأنيونية",
    subtitle: "حساب الفجوة الأنيونية في المصل وتصحيحها بناءً على تركيز الألبومين",
    sodium: "الصوديوم (Na+)",
    chloride: "الكلوريد (Cl-)",
    bicarbonate: "البيكربونات (HCO3-)",
    albumin: "الألبومين في الدم",
    result: "الفجوة الأنيونية المحسوبة",
    correctedResult: "الفجوة المصححة بالألبومين",
    normal: "فجوة أنيونية طبيعية",
    normalSub: "8 - 12 ميكر/لتر",
    high: "فجوة أنيونية مرتفعة",
    highSub: "أكثر من 12 (حموضة الدم)",
    low: "فجوة أنيونية منخفضة",
    lowSub: "أقل من 8",
    formula: "الفجوة = الصوديوم - (الكلوريد + البيكربونات)",
    correctedFormula: "الفجوة المصححة = الفجوة + 2.5 * (4.0 - الألبومين)",
    clinicalTitle: "التفسير السريري والتطبيقات",
    clinicalText: "تشير الفجوة الأنيونية المرتفعة إلى تراكم الأحماض غير المقاسة في الجسم (مثل حمض اللاكتيك أو الأجسام الكيتونية). يعد تصحيح الفجوة للألبومين أمرًا بالغ الأهمية لمرضى نقص الألبومين.",
    references: "المراجع: إيميت ومارينز. الاستخدام السريري للفجوة الأنيونية. مجلة الطب 1977.",
    faqQ1: "ما هي الفجوة الأنيونية (Anion Gap)؟",
    faqA1: "الفجوة الأنيونية هي الفرق الحسابي بين الكاتيونات المقيسة (الصوديوم) والأنيونات المقيسة (الكلوريد والبيكربونات). تُستخدم لتحديد نوع وسبب حموضة الدم الاستقلابية.",
    faqQ2: "ما هي النسبة الطبيعية للفجوة الأنيونية؟",
    faqA2: "النسبة الطبيعية هي عادة بين 8 إلى 12 مللي مكافئ/لتر (بدون إدراج البوتاسيوم)، وقد تختلف قليلاً حسب المختبر.",
    faqQ3: "لماذا يجب تصحيح الفجوة الأنيونية وفقاً للألبومين؟",
    faqA3: "يعتبر الألبومين هو الأنيون الرئيسي غير المقاس في المصل. انخفاض الألبومين بمقدار 1 غرام/ديسيلتر يقلل الفجوة الأنيونية بمقدار 2.5 مللي مكافئ/لتر، لذا فإن إهمال هذا التصحيح قد يخفي حموضة دم خطيرة.",
    faqQ4: "ما هي أسباب ارتفاع الفجوة الأنيونية وحموضة الدم الاستقلابية؟",
    faqA4: "تنتج عن تراكم أحماض مثل حمض اللاكتيك (في حالات نقص الأكسجة أو الصدمة)، أو الكيتونات (السكري أو الكحولي)، أو الفشل الكلوي اليوريمي، أو التسمم بالمواد السامة مثل الأسبرين والميثانول.",
  }
};

export default function AnionGap({ lang }: { lang: LangCode }) {
  const [sodium, setSodium] = useState<number>(140);
  const [chloride, setChloride] = useState<number>(104);
  const [bicarbonate, setBicarbonate] = useState<number>(24);
  const [albumin, setAlbumin] = useState<number>(4.0);
  const [copied, setCopied] = useState(false);

  const currentText = translations[lang];
  const isRtl = lang === 'ar';

  const rawAg = useMemo(() => {
    if (sodium <= 0 || chloride <= 0 || bicarbonate <= 0) return 0;
    const computed = sodium - (chloride + bicarbonate);
    return parseFloat(computed.toFixed(1));
  }, [sodium, chloride, bicarbonate]);

  const correctedAg = useMemo(() => {
    if (rawAg <= 0) return 0;
    if (albumin <= 0 || albumin > 6.0) return rawAg;
    const computed = rawAg + 2.5 * (4.0 - albumin);
    return parseFloat(computed.toFixed(1));
  }, [rawAg, albumin]);

  useEffect(() => {
    if (rawAg > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('anion-gap', lang, rawAg);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [rawAg, lang]);

  const getAgCategory = (val: number) => {
    if (val > 12) return { label: currentText.high, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', sub: currentText.highSub };
    if (val < 8) return { label: currentText.low, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', sub: currentText.lowSub };
    return { label: currentText.normal, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', sub: currentText.normalSub };
  };

  const category = getAgCategory(correctedAg > 0 ? correctedAg : rawAg);

  const handleCopy = () => {
    navigator.clipboard.writeText(`Anion Gap: ${rawAg} mEq/L (Corrected for Albumin: ${correctedAg} mEq/L, Interpretation: ${category.label})`);
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
            <div className="space-y-8">
              <CalculatorInput
                label={currentText.sodium}
                unit="mEq/L"
                value={sodium}
                min={100}
                max={180}
                placeholder="140"
                onChange={setSodium}
              />

              <CalculatorInput
                label={currentText.chloride}
                unit="mEq/L"
                value={chloride}
                min={70}
                max={130}
                placeholder="104"
                onChange={setChloride}
              />

              <CalculatorInput
                label={currentText.bicarbonate}
                unit="mEq/L"
                value={bicarbonate}
                min={5}
                max={50}
                placeholder="24"
                onChange={setBicarbonate}
              />

              <CalculatorInput
                label={currentText.albumin}
                unit="g/dL"
                value={albumin}
                min={1.0}
                max={6.0}
                step={0.1}
                placeholder="4.0"
                onChange={setAlbumin}
              />
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
                    {rawAg > 0 ? rawAg : '--'}
                  </span>
                  <span className="text-xl font-medium text-gray-400">mEq/L</span>
                </div>

                {albumin !== 4.0 && rawAg > 0 && (
                  <div className="mt-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      {currentText.correctedResult}
                    </span>
                    <div className="flex items-baseline gap-2 tabular-nums">
                      <span className="text-3xl font-bold text-blue-400">
                        {correctedAg}
                      </span>
                      <span className="text-sm font-medium text-gray-400">mEq/L</span>
                    </div>
                  </div>
                )}
              </div>
              
              {rawAg > 0 && (
                <button
                  onClick={handleCopy}
                  className="mt-2 p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors border border-gray-700/50 flex items-center justify-center text-gray-300 hover:text-white"
                  title="Copy Result"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                </button>
              )}
            </div>

            <div className="relative z-10 mt-10">
              {rawAg > 0 && (
                <>
                  <div className={`p-4 rounded-xl border flex justify-between items-center transition-all ${category.bg} ${category.color}`}>
                    <div className="font-semibold text-sm">
                      {category.label}
                    </div>
                    <div className="font-mono text-xs opacity-80">
                      {category.sub}
                    </div>
                  </div>

                  <ClinicalExportButton
                    title={currentText.title}
                    inputs={[
                      { label: currentText.sodium, value: `${sodium} mEq/L` },
                      { label: currentText.chloride, value: `${chloride} mEq/L` },
                      { label: currentText.bicarbonate, value: `${bicarbonate} mEq/L` },
                      { label: currentText.albumin, value: `${albumin} g/dL` }
                    ]}
                    results={[
                      { label: currentText.result, value: rawAg, unit: 'mEq/L' },
                      { label: currentText.correctedResult, value: correctedAg, unit: 'mEq/L' },
                      { label: 'Acid-Base Category', value: category.label }
                    ]}
                    formula={currentText.formula}
                    disclaimer={currentText.clinicalText}
                    references={currentText.references}
                    lang={lang}
                  />
                </>
              )}
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
              <div className="font-mono text-xs bg-gray-100 text-gray-700 py-2 px-3 rounded-md border border-gray-200 uppercase tracking-tight mb-2" dir="ltr">
                {currentText.formula}
              </div>
              <div className="font-mono text-xs bg-gray-100 text-gray-700 py-2 px-3 rounded-md border border-gray-200 uppercase tracking-tight" dir="ltr">
                {currentText.correctedFormula}
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
              <a href="https://pubmed.ncbi.nlm.nih.gov/413723/" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Emmett & Narins, Medicine 1977 (PMID: 413723) →</a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{layoutTranslations[lang].seeAlso}</h2>
        <div className="flex flex-wrap gap-2 mb-10">
          {[
            { label: 'P/F Ratio', path: '/pf-ratio' },
            { label: 'Tidal Volume (ARDS)', path: '/tidal-volume' },
            { label: 'Creatinine Clearance', path: '/creatinine-clearance' },
            { label: 'Corrected Calcium', path: '/corrected-calcium' },
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
