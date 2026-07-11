import { LangCode } from '../types';

export interface ClinicalNoteInput {
  calculatorName: {
    en: string;
    fr?: string;
    ar?: string;
  } | string;
  score: string | number;
  interpretation?: {
    en: string;
    fr?: string;
    ar?: string;
  } | string;
  inputs?: Record<string, any>;
  recommendations?: string[];
  lang?: LangCode;
}

/**
 * Helper to resolve multilingual strings or fallback to string
 */
function resolveText(val: { en: string; fr?: string; ar?: string; } | string | undefined, lang: LangCode = 'en'): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  return val[lang] || val.en || '';
}

/**
 * Formats a key-value record of inputs into readable clinical bullet points
 */
function formatInputsList(inputs?: Record<string, any>, lang: LangCode = 'en'): string {
  if (!inputs || Object.keys(inputs).length === 0) return '';
  
  return Object.entries(inputs)
    .filter(([_, val]) => val !== undefined && val !== null && val !== '')
    .map(([key, val]) => {
      // Clean up variable names (e.g. creatinine_mg_dl -> Creatinine)
      const cleanKey = key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      return `  • ${cleanKey}: ${val}`;
    })
    .join('\n');
}

/**
 * Generates a SOAP (Subjective, Objective, Assessment, Plan) Note for EHR insertion
 */
export function generateSOAP(data: ClinicalNoteInput): string {
  const lang = data.lang || 'en';
  const calcName = resolveText(data.calculatorName, lang);
  const interp = resolveText(data.interpretation, lang);
  const inputBullets = formatInputsList(data.inputs, lang);
  const timestamp = new Date().toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    dateStyle: 'short',
    timeStyle: 'short'
  });

  if (lang === 'fr') {
    return `--- NOTE CLINIQUE SOAP (${timestamp}) ---
S (Subjectif) : Évaluation des critères de sévérité clinique au lit du patient.
O (Objectif) : Paramètres physiologiques / biochimiques mesurés :
${inputBullets || '  • Paramètres évalués selon protocole'}
A (Analyse / Résultat) : ${calcName} = ${data.score}
  → Interprétation : ${interp || 'Évaluation clinique continue'}
P (Plan) : 
  • Surveillance continue selon protocole de service.
  • Réévaluation des scores cliniques selon évolution.
--- Généré par CareCalculus Clinical Suite ---`;
  }

  if (false) {
    return `--- تقرير طبي SOAP (${timestamp}) ---
S (الأعراض والتقييم) : تقييم الحالة السريرية ومؤشرات الخطورة بجانب السرير.
O (البيانات والمؤشرات) : القياسات الفسيولوجية والمخبرية المسجلة :
${inputBullets || '  • تم تسجيل القياسات وفق البروتوكول'}
A (التقييم والنتيجة) : ${calcName} = ${data.score}
  → التفسير الطبي : ${interp || 'متابعة مستمرة للحالة السريرية'}
P (الخطة العلاجية) : 
  • استمرار المراقبة السريرية الدقيقة وفق بروتوكول الرعاية.
  • إعادة تقييم المؤشر بناءً على استجابة المريض.
--- تم التوليد بواسطة CareCalculus ---`;
  }

  return `--- SOAP CLINICAL NOTE (${timestamp}) ---
S (Subjective): Bedside evaluation of clinical severity and organ function.
O (Objective): Measured physiological / biochemical parameters:
${inputBullets || '  • Clinical variables documented per protocol'}
A (Assessment): ${calcName} = ${data.score}
  → Interpretation: ${interp || 'Continuous clinical evaluation'}
P (Plan): 
  • Continue clinical monitoring per unit protocol.
  • Re-evaluate diagnostic score based on therapeutic response.
--- Generated via CareCalculus Clinical Suite ---`;
}

/**
 * Generates an SBAR (Situation, Background, Assessment, Recommendation) Note for shift handover / consults
 */
export function generateSBAR(data: ClinicalNoteInput): string {
  const lang = data.lang || 'en';
  const calcName = resolveText(data.calculatorName, lang);
  const interp = resolveText(data.interpretation, lang);
  const inputBullets = formatInputsList(data.inputs, lang);
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (lang === 'fr') {
    return `[SBAR TRANSMISSION / ALERTE - ${timestamp}]
S (Situation) : Évaluation urgente par score ${calcName}.
B (Contexte) : Mesures cliniques et biologiques actuelles :
${inputBullets || '  • Données saisies au dossier'}
A (Évaluation) : SCORE MESURÉ : ${data.score} (${interp})
R (Recommandation) : Prise en charge adaptée à la stratification de risque ${data.score}. Prise d'avis spécialisé si dégradation.`;
  }

  if (false) {
    return `[تقرير تسليم وردية / SBAR - ${timestamp}]
S (الموقف) : تقييم سريري عاجل باستخدام مؤشر ${calcName}.
B (الخلفية والبيانات) : القياسات الحيوية والمخبرية الحالية :
${inputBullets || '  • البيانات مسجلة في الملف'}
A (التقييم) : النتيجة المسجلة : ${data.score} (${interp})
R (التوصية) : تطبيق بروتوكول الرعاية المتوافق مع مستوى الخطورة (${data.score}). طلب استشارة تخصصية في حال تدهور المؤشرات.`;
  }

  return `[SBAR HANDOVER / CONSULT - ${timestamp}]
S (Situation): Bedside clinical stratification using ${calcName}.
B (Background): Current vital signs and lab variables:
${inputBullets || '  • Documented in EHR'}
A (Assessment): CALCULATED SCORE: ${data.score} (${interp})
R (Recommendation): Align clinical intervention with risk stratification level ${data.score}. Consider specialist consult if trend deteriorates.`;
}

/**
 * Generates an EPIC / Cerner DotPhrase (@SMART_PHRASE@) for instant chart macros
 */
export function generateDotPhrase(data: ClinicalNoteInput): string {
  const lang = data.lang || 'en';
  const calcName = resolveText(data.calculatorName, lang);
  const interp = resolveText(data.interpretation, lang);
  const inputBullets = formatInputsList(data.inputs, lang).replace(/\n/g, ' ; ');

  const tag = calcName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 12);

  return `@CALC_${tag}@ : ${calcName} is ${data.score}. Interpretation: ${interp}. [Inputs: ${inputBullets || 'Standard protocol'}]. Ref: CareCalculus Clinical Decision Support.`;
}

/**
 * Generates a concise WhatsApp / SMS shift handover snippet with emojis
 */
export function generateShiftHandover(data: ClinicalNoteInput): string {
  const lang = data.lang || 'en';
  const calcName = resolveText(data.calculatorName, lang);
  const interp = resolveText(data.interpretation, lang);
  
  if (lang === 'fr') {
    return `🚨 *Alerte Score Clinique - CareCalculus*
📊 *Outil :* ${calcName}
📈 *Résultat :* ${data.score}
📋 *Interprétation :* ${interp}
⏱️ _Évalué à ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}_`;
  }

  if (false) {
    return `🚨 *تنبيه تقييم سريري - CareCalculus*
📊 *المؤشر :* ${calcName}
📈 *النتيجة :* ${data.score}
📋 *التفسير :* ${interp}
⏱️ _تم التقييم الساعة ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}_`;
  }

  return `🚨 *Clinical Score Handover - CareCalculus*
📊 *Tool:* ${calcName}
📈 *Score/Value:* ${data.score}
📋 *Interpretation:* ${interp}
⏱️ _Evaluated at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}_`;
}

/**
 * Generates a shareable URL with query parameters containing the current calculator state
 */
export function generateCaseShareUrl(path: string, inputs?: Record<string, any>): string {
  if (typeof window === 'undefined') return path;
  
  try {
    const origin = window.location.origin;
    const url = new URL(path, origin);
    
    if (inputs) {
      Object.entries(inputs).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          url.searchParams.set(key, String(val));
        }
      });
    }
    
    return url.toString();
  } catch (err) {
    return path;
  }
}

/**
 * Parses URL search parameters back into an inputs record for auto-population
 */
export function parseCaseUrlParams(search?: string): Record<string, string> {
  if (typeof window === 'undefined' && !search) return {};
  
  try {
    const searchStr = search || window.location.search;
    const params = new URLSearchParams(searchStr);
    const result: Record<string, string> = {};
    
    params.forEach((val, key) => {
      result[key] = val;
    });
    
    return result;
  } catch (err) {
    return {};
  }
}
