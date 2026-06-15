import React, { useState, useMemo, useEffect } from 'react';
import { Info, ArrowRightLeft, Activity, BookOpen } from 'lucide-react';
import { LangCode } from '../types';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';
import ClinicalExportButton from '../components/ClinicalExportButton';

const pageTranslations: Record<LangCode, any> = {
  en: {
    pageTitle: "Medical Unit Conversions",
    pageSubtitle: "Quick conversion tool for biological lab values",
    sourceValue: "Source Value",
    calculate: "Calculate",
    inUnit: "In {unit}",
    albuminTitle: "Albumin / Proteins",
    albuminNormal: "Normal range: 35–50 g/L | 3.5–5.0 g/dL | 530–756 µmol/L",
    calciumTitle: "Calcium",
    calciumNormal: "Normal range: 2.2–2.6 mmol/L | 88–104 mg/L | 8.8–10.4 mg/dL | 4.4–5.2 mEq/L",
    cholesterolTitle: "Cholesterol (Total, HDL, LDL)",
    cholesterolNormal: "• Total: Desirable < 5.2 mmol/L | < 200 mg/dL | < 2.0 g/L\n• HDL: Desirable > 1.0 mmol/L (M) / > 1.3 mmol/L (F)\n• LDL: Optimal < 2.6 mmol/L | < 100 mg/dL | < 1.0 g/L",
    creatinineTitle: "Creatinine",
    creatinineNormal: "• Male: 62–115 µmol/L | 7–13 mg/L | 0.7–1.3 mg/dL\n• Female: 44–97 µmol/L | 5–11 mg/L | 0.5–1.1 mg/dL",
    glucoseTitle: "Blood Glucose",
    glucoseNormal: "• Fasting Normal: 3.9–5.5 mmol/L | 0.70–1.00 g/L | 70–100 mg/dL\n• Prediabetes: 5.6–6.9 mmol/L | 1.00–1.25 g/L | 100–125 mg/dL\n• Diabetes: ≥ 7.0 mmol/L | ≥ 1.26 g/L | ≥ 126 mg/dL",
    hba1cTitle: "HbA1c (Glycated Hemoglobin)",
    hba1cNormal: "Normal < 42 mmol/mol (< 6%) | Prediabetes: 42–47 mmol/mol (6–6.4%) | Diabetes ≥ 48 mmol/mol (≥ 6.5%)",
    triglyceridesTitle: "Triglycerides",
    triglyceridesNormal: "• Normal < 1.7 mmol/L | < 150 mg/dL | < 1.50 g/L\n• Borderline: 1.7–2.3 mmol/L | 150–200 mg/dL | 1.5–2.0 g/L\n• High: 2.3–5.6 mmol/L | 200–499 mg/dL | 2.0–4.99 g/L\n• Very High ≥ 5.6 mmol/L | ≥ 500 mg/dL | ≥ 5.0 g/L",
    enterValue: "Enter a value to convert",
    clinicalTitle: "Clinical Context",
    clinicalText: "Reference ranges are indicative and may vary significantly by laboratory methodology, population variations, and patient specific conditions. Always follow standard clinical guidelines for your region.",
    formula: "Standard IUPAC and SI unit conversion factors",
    references: "World Health Organization (WHO) Laboratory Manuals & IUPAC-IFCC Recommendations on Quantities and Units in Clinical Chemistry."
  },
  fr: {
    pageTitle: "Conversions d'Unités Médicales",
    pageSubtitle: "Outil de conversion rapide pour les analyses biologiques",
    sourceValue: "Valeur Source",
    calculate: "Calculer",
    inUnit: "En {unit}",
    albuminTitle: "Albumine / Protéines",
    albuminNormal: "Valeurs normales: 35–50 g/L | 3.5–5.0 g/dL | 530–756 µmol/L",
    calciumTitle: "Calcium",
    calciumNormal: "Valeurs normales: 2.2–2.6 mmol/L | 88–104 mg/L | 8.8–10.4 mg/dL | 4.4–5.2 mEq/L",
    cholesterolTitle: "Cholestérol (Total, HDL, LDL)",
    cholesterolNormal: "• Total: Souhaitable < 5.2 mmol/L | < 200 mg/dL | < 2.0 g/L\n• HDL: Souhaitable > 1.0 mmol/L (H) / > 1.3 mmol/L (F)\n• LDL: Optimal < 2.6 mmol/L | < 100 mg/dL | < 1.0 g/L",
    creatinineTitle: "Créatinine",
    creatinineNormal: "• Homme: 62–115 µmol/L | 7–13 mg/L | 0.7–1.3 mg/dL\n• Femme: 44–97 µmol/L | 5–11 mg/L | 0.5–1.1 mg/dL",
    glucoseTitle: "Glycémie",
    glucoseNormal: "• À jeun Normal: 3.9–5.5 mmol/L | 0.70–1.00 g/L | 70–100 mg/dL\n• Prédiabète: 5.6–6.9 mmol/L | 1.00–1.25 g/L | 100–125 mg/dL\n• Diabète: ≥ 7.0 mmol/L | ≥ 1.26 g/L | ≥ 126 mg/dL",
    hba1cTitle: "HbA1c (Hémoglobine Glyquée)",
    hba1cNormal: "Normal < 42 mmol/mol (< 6%) | Prédiabète: 42–47 mmol/mol (6–6.4%) | Diabète ≥ 48 mmol/mol (≥ 6.5%)",
    triglyceridesTitle: "Triglycérides",
    triglyceridesNormal: "• Normal < 1.7 mmol/L | < 150 mg/dL | < 1.50 g/L\n• Limite haute: 1.7–2.3 mmol/L | 150–200 mg/dL | 1.5–2.0 g/L\n• Élevé: 2.3–5.6 mmol/L | 200–499 mg/dL | 2.0–4.99 g/L\n• Très élevé ≥ 5.6 mmol/L | ≥ 500 mg/dL | ≥ 5.0 g/L",
    enterValue: "Entrez une valeur à convertir",
    clinicalTitle: "Contexte Clinique",
    clinicalText: "Les plages de référence sont indicatives et peuvent varier considérablement selon la méthodologie de laboratoire, les variations de population et les conditions spécifiques du patient. Suivez toujours les directives cliniques standard de votre région.",
    formula: "Facteurs de conversion standard IUPAC et unités SI",
    references: "Manuels de laboratoire de l'Organisation mondiale de la santé (OMS) & Recommandations IUPAC-IFCC sur les quantités et unités en chimie clinique."
  },
  ar: {
    pageTitle: "تحويلات الوحدات الطبية",
    pageSubtitle: "أداة تحويل سريعة للتحاليل البيولوجية",
    sourceValue: "القيمة المدخلة",
    calculate: "احسب",
    inUnit: "بـ {unit}",
    albuminTitle: "ألبومين / بروتينات",
    albuminNormal: "القيم الطبيعية: 35–50 g/L | 3.5–5.0 g/dL | 530–756 µmol/L",
    calciumTitle: "الكالسيوم",
    calciumNormal: "القيم الطبيعية: 2.2–2.6 mmol/L | 88–104 mg/L | 8.8–10.4 mg/dL | 4.4–5.2 mEq/L",
    cholesterolTitle: "الكوليسترول (الكلي، HDL، LDL)",
    cholesterolNormal: "• الكلي: المرغوب < 5.2 mmol/L | < 200 mg/dL | < 2.0 g/L\n• HDL: المرغوب > 1.0 mmol/L (ذكر) / > 1.3 mmol/L (أنثى)\n• LDL: الأمثل < 2.6 mmol/L | < 100 mg/dL | < 1.0 g/L",
    creatinineTitle: "الكرياتينين",
    creatinineNormal: "• ذكر: 62–115 µmol/L | 7–13 mg/L | 0.7–1.3 mg/dL\n• أنثى: 44–97 µmol/L | 5–11 mg/L | 0.5–1.1 mg/dL",
    glucoseTitle: "سكر الدم (الغلوكوز)",
    glucoseNormal: "• طبيعي (صائماً): 3.9–5.5 mmol/L | 0.70–1.00 g/L | 70–100 mg/dL\n• ما قبل السكري: 5.6–6.9 mmol/L | 1.00–1.25 g/L | 100–125 mg/dL\n• السكري: ≥ 7.0 mmol/L | ≥ 1.26 g/L | ≥ 126 mg/dL",
    hba1cTitle: "HbA1c (الهيموغلوبين الغليكوزيلاتي)",
    hba1cNormal: "طبيعي < 42 mmol/mol (< 6%) | ما قبل السكري: 42–47 (6–6.4%) | سكري ≥ 48 mmol/mol (≥ 6.5%)",
    triglyceridesTitle: "الدهون الثلاثية",
    triglyceridesNormal: "• طبيعي < 1.7 mmol/L | < 150 mg/dL | < 1.50 g/L\n• حدودي: 1.7–2.3 mmol/L | 150–200 mg/dL | 1.5–2.0 g/L\n• مرتفع: 2.3–5.6 mmol/L | 200–499 mg/dL | 2.0–4.99 g/L\n• مرتفع جداً ≥ 5.6 mmol/L | ≥ 500 mg/dL | ≥ 5.0 g/L",
    enterValue: "أدخل قيمة للتحويل",
    clinicalTitle: "السياق السريري",
    clinicalText: "النطاقات المرجعية استرشادية وقد تختلف بشكل كبير حسب منهجية المختبر، والاختلافات السكانية، وظروف المريض الخاصة. اتبع دائماً التوجيهات السريرية المعتمدة في منطقتك.",
    formula: "عوامل تحويل الوحدات القياسية المعتمدة من IUPAC والنظام الدولي",
    references: "أدلة مختبرات منظمة الصحة العالمية (WHO) وتوصيات IUPAC-IFCC بشأن الكميات والوحدات في الكيمياء السريرية."
  }
};

type ConfigLinear = { id: string; nameKey: string; linear: true; units: Record<string, number>; normalKey: string; };
type ConfigCustom = { id: string; nameKey: string; linear: false; units: string[]; normalKey: string; };

const converters: Array<ConfigLinear | ConfigCustom> = [
  {
    id: "albumin",
    nameKey: "albuminTitle",
    linear: true,
    units: { "g/L": 1, "g/dL": 0.1, "µmol/L": 15.124 },
    normalKey: "albuminNormal"
  },
  {
    id: "calcium",
    nameKey: "calciumTitle",
    linear: true,
    units: { "mmol/L": 1, "mg/dL": 4.008, "mg/L": 40.08, "g/L": 0.04008, "mEq/L": 2 },
    normalKey: "calciumNormal"
  },
  {
    id: "cholesterol",
    nameKey: "cholesterolTitle",
    linear: true,
    units: { "mmol/L": 1, "mg/dL": 38.665, "g/L": 0.38665 },
    normalKey: "cholesterolNormal"
  },
  {
    id: "creatinine",
    nameKey: "creatinineTitle",
    linear: true,
    units: { "µmol/L": 1, "mg/L": 0.11312, "mg/dL": 0.011312 },
    normalKey: "creatinineNormal"
  },
  {
    id: "glucose",
    nameKey: "glucoseTitle",
    linear: true,
    units: { "mmol/L": 1, "mg/dL": 18.016, "g/L": 0.18016 },
    normalKey: "glucoseNormal"
  },
  {
    id: "hba1c",
    nameKey: "hba1cTitle",
    linear: false,
    units: ["mmol/mol", "%"],
    normalKey: "hba1cNormal"
  },
  {
    id: "triglycerides",
    nameKey: "triglyceridesTitle",
    linear: true,
    units: { "mmol/L": 1, "mg/dL": 88.54, "g/L": 0.8854 },
    normalKey: "triglyceridesNormal"
  }
];

function ConverterCard({ config, currentText, lang }: { config: ConfigLinear | ConfigCustom, currentText: any, lang: LangCode }) {
  const availableUnits: string[] = config.linear 
    ? Object.keys(config.units as Record<string, number>) 
    : (config.units as string[]);
  const [val, setVal] = useState<string>('');
  const [fromUnit, setFromUnit] = useState<string>(availableUnits[0]);

  const results = useMemo(() => {
    if (val.trim() === '') return null;
    const num = parseFloat(val);
    if (isNaN(num)) return null;

    if (!config.linear) {
      // Special logic for HbA1c
      const res: Record<string, number> = {};
      if (fromUnit === 'mmol/mol') {
        res['mmol/mol'] = num;
        res['%'] = (num / 10.929) + 2.15;
      } else {
        res['%'] = num;
        res['mmol/mol'] = (num - 2.15) * 10.929;
      }
      return res;
    } else {
      const units = config.units as Record<string, number>;
      const baseVal = num / units[fromUnit];
      const res: Record<string, number> = {};
      for (const u of Object.keys(units)) {
        res[u] = baseVal * units[u];
      }
      return res;
    }
  }, [val, fromUnit, config]);

  useEffect(() => {
    if (results !== null) {
      const timer = setTimeout(() => {
        trackCalculatorUsage(`medical-conversion-${config.id}`, lang, parseFloat(val) || 0);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [results, val, config.id, lang]);

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-blue-900/5 p-6 md:p-8 flex flex-col md:flex-row gap-8">
      <div className="flex-1 space-y-6 md:border-r border-gray-100 md:pr-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{currentText[config.nameKey]}</h2>
          <div className="text-xs text-gray-500 whitespace-pre-wrap leading-relaxed mt-2 p-3 bg-blue-50/50 rounded-lg">
            {currentText[config.normalKey]}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div className="w-full">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">{currentText.sourceValue}</label>
            <input
              type="number"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="w-full bg-white px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-xl font-semibold text-gray-900 placeholder:text-gray-300"
              placeholder="0.0"
            />
          </div>
          <div>
             <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full bg-gray-50 px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-lg font-medium text-gray-800"
              dir="ltr"
            >
              {availableUnits.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-[0.8] flex flex-col justify-center">
        {results ? (
          <div className="bg-gray-900 text-white rounded-2xl p-6 space-y-4">
            <div className="space-y-3">
              {availableUnits.map(unit => {
                const isSource = unit === fromUnit;
                return (
                  <div key={unit} className={`flex justify-between items-center p-4 rounded-xl border ${isSource ? 'bg-white/5 border-white/10' : 'bg-blue-500/10 border-blue-500/20'}`}>
                    <span className="text-sm font-medium text-gray-400" dir="ltr">{currentText.inUnit.replace('{unit}', unit)}</span>
                    <span className={`text-xl font-bold tabular-nums ${isSource ? 'text-gray-500' : 'text-blue-400'}`} dir="ltr">
                      {results[unit].toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <ClinicalExportButton
              title={currentText[config.nameKey]}
              inputs={[
                { label: currentText.sourceValue, value: `${val} ${fromUnit}` }
              ]}
              results={availableUnits.map(unit => ({
                label: currentText.inUnit.replace('{unit}', unit),
                value: results[unit].toFixed(2)
              }))}
              formula={currentText.formula}
              disclaimer={currentText.clinicalText}
              references={currentText.references}
              lang={lang}
            />
          </div>
        ) : (
          <div className="h-full min-h-[160px] flex items-center justify-center p-6 border-2 border-dashed border-gray-100 rounded-2xl">
            <div className="text-center text-gray-400 flex flex-col items-center">
              <ArrowRightLeft className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-sm font-medium">{currentText.enterValue}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MedicalConversions({ lang }: { lang: LangCode }) {
  const currentText = pageTranslations[lang];
  const isRtl = lang === 'ar';

  return (
    <>
      <div className="max-w-3xl mb-12">
        <h1 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3 ${isRtl ? 'leading-normal' : ''}`}>
          {currentText.pageTitle}
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl">
          {currentText.pageSubtitle}
        </p>
      </div>

      <div className="flex flex-col gap-8 max-w-5xl">
        {converters.map(config => (
          <ConverterCard key={config.id} config={config} currentText={currentText} lang={lang} />
        ))}
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
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0"><Info className="w-5 h-5"/></div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-1 text-base">{currentText.clinicalTitle}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{currentText.clinicalText}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0"><Activity className="w-5 h-5"/></div>
            <div className="w-full">
              <h2 className="font-semibold text-gray-900 mb-1 text-base">{layoutTranslations[lang].mathMetric}</h2>
              <div className="font-mono text-xs bg-gray-100 text-gray-700 py-2 px-3 rounded-md border border-gray-200 uppercase tracking-tight" dir="ltr">
                {currentText.formula}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0"><BookOpen className="w-5 h-5"/></div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-1 text-base">{layoutTranslations[lang].evidenceLit}</h2>
              <p className="text-gray-500 text-xs leading-relaxed italic">{currentText.references}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
