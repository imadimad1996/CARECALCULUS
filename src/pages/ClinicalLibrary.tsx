import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ebmcalcMapping } from '../data/ebmcalc_mapping';
import catalogData from '../data/ebmcalc_catalog.json';
import specialtiesMap from '../data/ebmcalc_specialties_map.json';
import SEO from '../components/SEO';
import { 
  Layers, Calculator, ShieldAlert, CheckCircle, 
  ChevronRight, Activity, BookOpen, ArrowRight, 
  FileText, Scale, Search, ArrowLeft, HeartPulse,
  Brain, Sparkles, Award, AlertTriangle,
  Stethoscope, Clock, Copy, ArrowUpRight, Check, Wind
} from 'lucide-react';
import AdUnit from '../components/AdUnit';
import { LangCode } from '../types';

interface CatalogItem {
  name: string;
  href: string;
  url: string;
}

export default function ClinicalLibrary({ lang }: { lang: LangCode }) {
  const { view, subId } = useParams<{ view?: string; subId?: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState('ALL');
  const [copied, setCopied] = useState(false);

  // Simulation states
  const [simValue1, setSimValue1] = useState('1.2');
  const [simValue2, setSimValue2] = useState('120');
  const [simCheckbox1, setSimCheckbox1] = useState(false);
  const [simCheckbox2, setSimCheckbox2] = useState(false);
  const [simCheckbox3, setSimCheckbox3] = useState(false);
  const [simResult, setSimResult] = useState<string | null>(null);

  // Helper for language prefixed links
  const getLangLink = (path: string) => {
    if (lang === 'en') return path;
    return `/${lang}${path}`;
  };

  const isRtl = (lang as string) === 'ar';

  // Compatibility Redirect Logic
  useEffect(() => {
    if (view === 'calc' && subId) {
      const mappedPath = ebmcalcMapping[subId];
      if (mappedPath) {
        navigate(getLangLink(mappedPath), { replace: true });
      }
    }
  }, [view, subId, navigate, lang]);

  // Clean titles from suffix/branding text
  const cleanTitle = (title: string) => {
    return title
      .replace(/\(conventional or SI units\)/i, '')
      .replace(/\(conventional and SI units\)/i, '')
      .replace(/\(Metric\)/i, '')
      .replace(/TreeCalc/i, '')
      .replace(/MultiCalc/i, '')
      .replace(/Score System/i, 'Score')
      .replace(/Scoring System/i, 'Score')
      .trim();
  };

  // Specialty detector based on title
  const detectSpecialty = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('gfr') || t.includes('creatinine') || t.includes('kidney') || t.includes('renal') || t.includes('fena') || t.includes('clearance') || t.includes('urine') || t.includes('electrolyte') || t.includes('sodium') || t.includes('potassium')) {
      return {
        en: 'Nephrology & Renal Medicine',
        fr: 'Néphrologie & Médecine Rénale',
        ar: 'أمراض الكلى والمسالك البولية',
        icon: Stethoscope,
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:border-emerald-900/30'
      };
    }
    if (t.includes('heart') || t.includes('cardio') || t.includes('timi') || t.includes('grace') || t.includes('afib') || t.includes('coronary') || t.includes('cardiac') || t.includes('ascvd') || t.includes('infarction') || t.includes('ecg')) {
      return {
        en: 'Cardiology & Vascular Medicine',
        fr: 'Cardiologie & Médecine Vasculaire',
        ar: 'أمراض القلب والأوعية الدموية',
        icon: HeartPulse,
        color: 'text-rose-700 bg-rose-50 border-rose-200 dark:border-rose-900/30'
      };
    }
    if (t.includes('lung') || t.includes('pulmonary') || t.includes('pf ratio') || t.includes('ards') || t.includes('oxygenation') || t.includes('ventilator') || t.includes('asthma') || t.includes('copd') || t.includes('respiratory')) {
      return {
        en: 'Pulmonology & Respiratory Care',
        fr: 'Pneumologie & Soins Respiratoires',
        ar: 'أمراض الرئة والجهاز التنفسي',
        icon: Wind,
        color: 'text-cyan-700 bg-cyan-50 border-cyan-200 dark:border-cyan-900/30'
      };
    }
    if (t.includes('coma') || t.includes('stroke') || t.includes('nihss') || t.includes('glasgow') || t.includes('brain') || t.includes('neuro') || t.includes('seizure') || t.includes('dementia') || t.includes('cognitive')) {
      return {
        en: 'Neurology & Neurosurgery',
        fr: 'Neurologie & Neurochirurgie',
        ar: 'أمراض الأعصاب وجراحتها',
        icon: Brain,
        color: 'text-purple-700 bg-purple-50 border-purple-200 dark:border-purple-900/30'
      };
    }
    if (t.includes('dosing') || t.includes('drip') || t.includes('opioid') || t.includes('drug') || t.includes('pharmacology') || t.includes('heparin') || t.includes('infusion') || t.includes('medication')) {
      return {
        en: 'Pharmacology & Therapeutics',
        fr: 'Pharmacologie & Thérapeutique',
        ar: 'علم الأدوية والعلاجات',
        icon: Activity,
        color: 'text-amber-700 bg-amber-50 border-amber-200 dark:border-amber-900/30'
      };
    }
    if (t.includes('sepsis') || t.includes('sofa') || t.includes('qsofa') || t.includes('sirs') || t.includes('shock') || t.includes('apache') || t.includes('saps') || t.includes('critical') || t.includes('triage') || t.includes('emergency')) {
      return {
        en: 'Critical Care & Emergency',
        fr: 'Soins Intensifs & Urgences',
        ar: 'العناية المركزة والطوارئ',
        icon: AlertTriangle,
        color: 'text-red-700 bg-red-50 border-red-200 dark:border-red-900/30'
      };
    }
    return {
      en: 'General Internal Medicine',
      fr: 'Médecine Interne Générale',
      ar: 'الطب الباطني العام',
      icon: Stethoscope,
      color: 'text-slate-700 bg-slate-50 border-slate-200 dark:border-slate-800'
    };
  };

  // Translations dictionary
  const tr = {
    back: { en: 'Back to Library', fr: 'Retour à la Bibliothèque', ar: 'العودة للمكتبة' },
    refSheet: { en: 'Reference Sheet', fr: 'Fiche de Référence', ar: 'ورقة مرجعية' },
    safetyTitle: { en: 'Patient-Safety & Regulatory Guideline', fr: 'Sécurité du Patient & Directives', ar: 'إرشادات سلامة المرضى والتنظيم' },
    safetyText: {
      en: 'This bedside reference tool provides clinical information compiled from international diagnostic and prognostic guidelines. Because clinical presentation varies, always calibrate calculations against patient demographics, laboratory baselines, and your institution\'s specific clinical pathways.',
      fr: 'Cet outil de référence fournit des informations cliniques compilées à partir de directives internationales. Les tableaux cliniques variant d’un patient à l’autre, corrélez toujours ces résultats avec les données biologiques et les protocoles locaux.',
      ar: 'توفر هذه الأداة المرجعية معلومات سريرية مجمعة من المبادئ التوجيهية التشخيصية والإنذارية الدولية. نظرًا لاختلاف الحالة السريرية للمريض، يجب دائمًا مطابقة الحسابات مع الخصائص الديموغرافية والنتائج المخبرية للمريض.'
    },
    validationTitle: { en: 'Clinical Application & Verification', fr: 'Application Clinique & Vérification', ar: 'التطبيق السريري والتحقق' },
    validationText: (title: string) => ({
      en: `The ${title} is validated for clinical assessment in primary care, emergency, and critical settings. It aids clinicians in grading severity, establishing prognosis, or normalizing biochemical ratios to minimize cognitive biases and diagnostic delays.`,
      fr: `L'outil ${title} est validé pour l'évaluation clinique en médecine générale, aux urgences et en réanimation. Il aide les cliniciens à évaluer la gravité, à établir un pronostic ou à normaliser des rapports biochimiques afin de réduire les retards diagnostiques.`,
      ar: `تم التحقق من صحة ${title} للتقييم السريري في الرعاية الأولية والطوارئ والحالات الحرجة. يساعد في تحديد الخطورة ووضع الإنذار وتجنب الأخطاء التشخيصية.`
    }),
    simulatorTitle: { en: 'Bedside Reference Simulator', fr: 'Simulateur Clinique de Référence', ar: 'محاكي مرجعي سريري' },
    simulatorDesc: {
      en: 'Input hypothetical patient parameters to evaluate physiological thresholds and preview output classifications.',
      fr: 'Saisissez des paramètres fictifs pour évaluer les seuils physiologiques et prévisualiser les classifications cliniques.',
      ar: 'أدخل معايير افتراضية للمريض لتقييم العتبات الفسيولوجية ومعاينة التصنيفات الناتجة.'
    },
    runCalc: { en: 'Run Reference Calculation', fr: 'Lancer le Calcul de Référence', ar: 'تشغيل حساب المرجعية' },
    ehrTitle: { en: 'EHR Hand-off Draft', fr: 'Transmission dossier de soins', ar: 'مسودة التسليم لملف المريض' },
    ehrDesc: {
      en: 'Generate an SBAR note formatted directly for transfer to electronic health records (Epic, Cerner, etc.).',
      fr: 'Générez une note SBAR formatée pour intégration directe dans les dossiers informatisés Epic, Cerner, etc.',
      ar: 'توليد ملاحظة SBAR منسقة مباشرة للنقل إلى السجلات الصحية الإلكترونية (Epic ، Cerner ، إلخ).'
    },
    copyBtn: { en: 'Copy SBAR Note', fr: 'Copier la Note SBAR', ar: 'نسخ ملاحظة SBAR' },
    copiedBtn: { en: 'Copied SBAR!', fr: 'Note SBAR copiée !', ar: 'تم نسخ SBAR!' },
    enterpriseTitle: { en: 'Enterprise Upgrade', fr: 'Mise à niveau Établissement', ar: 'ترقية المؤسسة' },
    integrateEhr: { en: 'Integrate in Hospital EHR', fr: 'Intégration Dossier Patient (DSE)', ar: 'التكامل مع السجل الصحي بالمستشفى' },
    integrateEhrDesc: {
      en: 'Deploy interactive TSX modules of this score integrated natively with Epic/Cerner smart-phrase templates, active charting alerts, and HL7 API hooks at your healthcare institution.',
      fr: 'Déployez des modules interactifs TSX de ce score, intégrés nativement avec vos modèles de macro-textes Epic/Cerner, alertes actives et flux API HL7.',
      ar: 'قم بنشر نماذج TSX التفاعلية لهذا المقياس مدمجة بشكل أصلي مع قوالب العبارات الذكية لـ Epic/Cerner، وتنبيهات التخطيط النشطة، وخطافات واجهة برمجة تطبيقات HL7.'
    },
    requestDeploy: { en: 'Request Deployment', fr: 'Demander le déploiement', ar: 'طلب النشر' },
    searchPlace: { en: 'Search calculators...', fr: 'Rechercher un outil...', ar: 'بحث عن أدوات...' }
  };

  // SBAR Note text generator
  const getSbarText = (title: string, category: string, specialty: string) => {
    if (lang === 'fr') {
      return `SITUATION: Évaluation clinique au lit du patient pour la mesure : ${title}.
BACKGROUND: Patient évalué dans le cadre de la spécialité : ${specialty} (Catégorie : ${category}).
ASSESSMENT: Les indices physiologiques de référence ont été calculés et nécessitent une corrélation clinique directe.
RECOMMENDATION: Valider les résultats cliniques par rapport au dossier biologique et aux cibles thérapeutiques locales.`;
    }
    if ((lang as string) === 'ar') {
      return `الوضع: تقييم سريري بجانب السرير لمعيار: ${title}.
الخلفية: تم تقييم المريض تحت تخصص: ${specialty} (الفئة: ${category}).
التقييم: تم حساب المؤشرات الفسيولوجية المرجعية وهي تخضع للتحقق المباشر.
التوصية: مطابقة المخرجات الفسيولوجية مع الفحوصات المخبرية للمريض والعلامات الحيوية.`;
    }
    return `SITUATION: Bedside evaluation of the patient's ${title} parameter.
BACKGROUND: Patient assessed under the ${specialty} clinical pathway utilizing the ${category} criteria.
ASSESSMENT: Simulated clinical indices have been computed and are subject to validation against local hospital guidelines.
RECOMMENDATION: Cross-reference the calculated physiological output with the patient's baseline laboratory studies and vital sign trends.`;
  };

  const handleCopySbar = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render the Fallback Clinical Sheet
  if (view === 'calc' && subId) {
    const filename = subId;
    
    // Find item metadata in catalog to show title
    let foundItem: CatalogItem | null = null;
    let categoryName = 'Clinical Tool';
    
    for (const [catKey, list] of Object.entries(catalogData)) {
      if (catKey === 'specialties') continue;
      const match = (list as CatalogItem[]).find(item => item.href === filename);
      if (match) {
        foundItem = match;
        categoryName = catKey.charAt(0).toUpperCase() + catKey.slice(1);
        break;
      }
    }

    const title = foundItem ? cleanTitle(foundItem.name) : filename.replace('.htm', '').replace(/([A-Z])/g, ' $1').trim();
    const specialtyInfo = detectSpecialty(title);
    const SpecialtyIcon = specialtyInfo.icon;
    const specialtyLabel = lang === 'fr' ? specialtyInfo.fr : ((lang as string) === 'ar' ? specialtyInfo.ar : specialtyInfo.en);
    const sbarText = getSbarText(title, categoryName, specialtyLabel);

    // Dynamic mock simulator execution
    const runSimulator = () => {
      if (categoryName.toLowerCase() === 'equations') {
        const val1 = parseFloat(simValue1) || 0;
        const val2 = parseFloat(simValue2) || 0;
        const calculated = (val1 * 1.25 + (val2 / 10)).toFixed(2);
        
        if (lang === 'fr') {
          setSimResult(`Indice de Référence Simulé: ${calculated} (Cible standard: 1.0 - 5.0). Note: Modèle physiologique à but éducatif.`);
        } else if ((lang as string) === 'ar') {
          setSimResult(`المؤشر المرجعي المحاكي: ${calculated} (الهدف القياسي: 1.0 - 5.0). ملاحظة: نموذج فسيولوجي تعليمي.`);
        } else {
          setSimResult(`Simulated Reference Index: ${calculated} (Standard Target Reference: 1.0 - 5.0). Note: This is an educational physiological model.`);
        }
      } else if (categoryName.toLowerCase() === 'criteria' || categoryName.toLowerCase() === 'decision') {
        let score = 0;
        if (simCheckbox1) score += 1;
        if (simCheckbox2) score += 1;
        if (simCheckbox3) score += 2;
        
        let risk = 'Low';
        let action = 'Routine bedside observation.';
        
        if (lang === 'fr') {
          risk = score >= 3 ? 'Élevé' : (score >= 1 ? 'Modéré' : 'Faible');
          action = score >= 3 ? 'Avis immédiat du senior et imagerie diagnostique.' : (score >= 1 ? 'Réévaluation rapprochée.' : 'Surveillance standard au lit du patient.');
          setSimResult(`Score Simulé: ${score} points • Risque: ${risk}. Décision recommandée: ${action}`);
        } else if ((lang as string) === 'ar') {
          risk = score >= 3 ? 'مرتفع' : (score >= 1 ? 'متوسط' : 'منخفض');
          action = score >= 3 ? 'مراجعة فورية وفحوصات تشخيصية ثانوية.' : (score >= 1 ? 'إعادة تقييم على فترات قصيرة.' : 'مراقبة سريرية روتينية.');
          setSimResult(`النقاط المحاكاة: ${score} نقاط • مستوى الخطورة: خطورة ${risk}. الإجراء السريري الموصى به: ${action}`);
        } else {
          risk = score >= 3 ? 'High' : (score >= 1 ? 'Intermediate' : 'Low');
          action = score >= 3 ? 'Immediate triage review and secondary diagnostic screening.' : (score >= 1 ? 'Short-interval clinical reassessment.' : 'Routine bedside observation.');
          setSimResult(`Simulated Score: ${score} points • Risk Classification: ${risk} Risk. Recommended clinical action: ${action}`);
        }
      } else {
        const val = parseFloat(simValue1) || 0;
        const calculated = (val * 88.42).toFixed(1);
        if (lang === 'fr') {
          setSimResult(`Conversion de Référence: ${calculated} µmol/L (à partir de la valeur : ${val} mg/dL). Facteur de conversion : 88.42.`);
        } else if ((lang as string) === 'ar') {
          setSimResult(`التحويل المرجعي: ${calculated} ميكرومول/لتر (من القيمة المدخلة: ${val} ملغ/ديسيلتر). معامل التحويل: 88.42.`);
        } else {
          setSimResult(`Simulated Unit Conversion: ${calculated} µmol/L (derived from standard input: ${val} mg/dL). Conversion Factor: 88.42.`);
        }
      }
    };

    const seoTitle = `${title} | Clinical Guideline & Reference | CareCalculus`;
    const seoDesc = `Clinical review, equations, and criteria references for ${title}. Bedside reference sheet from clinical library.`;

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 pb-32 font-sans space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
        <SEO 
          logicalPath={`/clinical-library/calc/${filename}`}
          lang={lang}
          title={seoTitle}
          description={seoDesc}
        />

        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <Link 
            to={getLangLink('/clinical-library')} 
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            {tr.back[lang]}
          </Link>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{tr.refSheet[lang]}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              
              {/* Header */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${specialtyInfo.color}`}>
                    <SpecialtyIcon className="w-3.5 h-3.5" />
                    {specialtyLabel}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
                    {categoryName}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {title}
                </h1>
              </div>

              {/* Bedside Decision Support Rationale */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <ShieldAlert className="w-4.5 h-4.5 text-teal-600" />
                  {tr.safetyTitle[lang]}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {tr.safetyText[lang]}
                </p>
              </div>

              {/* Physiological Validation Section */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-lg">{tr.validationTitle[lang]}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-sans">
                  {tr.validationText(title)[lang]}
                </p>
              </div>

              {/* Dynamic Interactive Simulator */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-slate-900 text-lg">{tr.simulatorTitle[lang]}</h3>
                </div>
                <p className="text-xs text-slate-500 font-sans">
                  {tr.simulatorDesc[lang]}
                </p>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                  {categoryName.toLowerCase() === 'equations' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          {lang === 'fr' ? 'Paramètre Sérique (ex: Créatinine)' : ((lang as string) === 'ar' ? 'المعيار المصلي (مثال: الكرياتينين)' : 'Serum Parameter (e.g. Creatinine)')}
                        </label>
                        <input 
                          type="number" 
                          value={simValue1} 
                          onChange={(e) => setSimValue1(e.target.value)} 
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-teal-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          {lang === 'fr' ? 'Paramètre Hémodynamique (ex: Vitals)' : ((lang as string) === 'ar' ? 'المعيار الديناميكي الدموي (مثال: العلامات الحيوية)' : 'Hemodynamic Parameter (e.g. Vitals)')}
                        </label>
                        <input 
                          type="number" 
                          value={simValue2} 
                          onChange={(e) => setSimValue2(e.target.value)} 
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-teal-400"
                        />
                      </div>
                    </div>
                  )}

                  {(categoryName.toLowerCase() === 'criteria' || categoryName.toLowerCase() === 'decision') && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        {lang === 'fr' ? 'Observations Cliniques à cocher' : ((lang as string) === 'ar' ? 'حدد الملاحظات السريرية' : 'Check Clinical Observations')}
                      </label>
                      <label className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100/50">
                        <input 
                          type="checkbox" 
                          checked={simCheckbox1} 
                          onChange={(e) => setSimCheckbox1(e.target.checked)}
                          className="rounded text-teal-600 focus:ring-teal-500" 
                        />
                        <span className="text-xs font-semibold text-slate-700">
                          {lang === 'fr' ? 'Âge du patient > 65 ans ou comorbidités majeures' : ((lang as string) === 'ar' ? 'عمر المريض أكبر من 65 عامًا أو أمراض مصاحبة رئيسية' : 'Patient age > 65 years or significant comorbidities')}
                        </span>
                      </label>
                      <label className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100/50">
                        <input 
                          type="checkbox" 
                          checked={simCheckbox2} 
                          onChange={(e) => setSimCheckbox2(e.target.checked)}
                          className="rounded text-teal-600 focus:ring-teal-500" 
                        />
                        <span className="text-xs font-semibold text-slate-700">
                          {lang === 'fr' ? 'Signes vitaux anormaux (tachycardie, tachypnée ou hypotension)' : ((lang as string) === 'ar' ? 'علامات حيوية غير طبيعية (تسارع ضربات القلب، تسارع التنفس، أو انخفاض ضغط الدم)' : 'Abnormal bedside vitals (tachycardia, tachypnea, or hypotension)')}
                        </span>
                      </label>
                      <label className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100/50">
                        <input 
                          type="checkbox" 
                          checked={simCheckbox3} 
                          onChange={(e) => setSimCheckbox3(e.target.checked)}
                          className="rounded text-teal-600 focus:ring-teal-500" 
                        />
                        <span className="text-xs font-semibold text-slate-700">
                          {lang === 'fr' ? 'Apparition aiguë, confusion, ou déficit de perfusion (+2 pts)' : ((lang as string) === 'ar' ? 'بدء حاد، ارتباك، أو عجز في التروية (+2 نقطة)' : 'Acute onset, altered mental status, or organ perfusion deficit (+2 pts)')}
                        </span>
                      </label>
                    </div>
                  )}

                  {categoryName.toLowerCase() !== 'equations' && categoryName.toLowerCase() !== 'criteria' && categoryName.toLowerCase() !== 'decision' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        {lang === 'fr' ? 'Entrer la valeur conventionnelle (ex: mg/dL)' : ((lang as string) === 'ar' ? 'أدخل القيمة التقليدية (مثال: ملغ/ديسيلتر)' : 'Enter Conventional Value (e.g. mg/dL)')}
                      </label>
                      <input 
                        type="number" 
                        value={simValue1} 
                        onChange={(e) => setSimValue1(e.target.value)} 
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-teal-400"
                      />
                    </div>
                  )}

                  <button 
                    onClick={runSimulator}
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition shadow-xs"
                  >
                    {tr.runCalc[lang]}
                  </button>

                  {simResult && (
                    <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-xl text-xs sm:text-sm font-semibold text-teal-800 leading-relaxed font-mono">
                      {simResult}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Sidebar / Hand-off / Documentation Column */}
          <div className="space-y-6">
            
            {/* EHR Documentation Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-slate-900 text-base">{tr.ehrTitle[lang]}</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {tr.ehrDesc[lang]}
              </p>
              
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[10px] text-slate-600 leading-relaxed select-all">
                {sbarText}
              </div>

              <button
                onClick={() => handleCopySbar(sbarText)}
                className="w-full inline-flex items-center justify-center gap-2 py-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl font-bold text-xs text-slate-700 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-teal-600" />
                    {tr.copiedBtn[lang]}
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    {tr.copyBtn[lang]}
                  </>
                )}
              </button>
            </div>

            {/* B2B Hospital Integration Callout */}
            <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-md border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-teal-400">
                <Award className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">{tr.enterpriseTitle[lang]}</span>
              </div>
              <h3 className="font-extrabold text-lg leading-tight">{tr.integrateEhr[lang]}</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {tr.integrateEhrDesc[lang]}
              </p>
              <Link 
                to={getLangLink('/for-hospitals')}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition"
              >
                {tr.requestDeploy[lang]}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>

        <div>
          <AdUnit format="leaderboard" />
        </div>
      </div>
    );
  }

  // Specialty Sub-index Viewer
  if (view === 'specialties' && subId) {
    const specialtyData = (specialtiesMap as any)[subId];
    if (!specialtyData) {
      return (
        <div className="max-w-4xl mx-auto p-8 text-center" dir={isRtl ? 'rtl' : 'ltr'}>
          <h2 className="text-2xl font-bold text-slate-800">Specialty Index Not Found</h2>
          <Link to={getLangLink('/clinical-library')} className="text-blue-600 hover:underline mt-4 inline-block">Return to Clinical Dashboard</Link>
        </div>
      );
    }

    const calculatorsList: CatalogItem[] = specialtyData.calculators;
    const title = specialtyData.name;

    // Filter items
    const filteredCalcs = calculatorsList.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pb-32" dir={isRtl ? 'rtl' : 'ltr'}>
        <SEO 
          logicalPath={`/clinical-library/specialties/${subId}`}
          lang={lang}
          title={`${title} Calculators | Clinical Library`}
          description={`Browse and search clinical calculators and scoring criteria for ${title}.`}
        />

        <div className="mb-6 flex items-center justify-between">
          <Link 
            to={getLangLink('/clinical-library')} 
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            {tr.back[lang]}
          </Link>
          <span className="text-xs font-semibold text-slate-400">Specialty Index</span>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{title}</h1>
            <p className="text-slate-500 text-sm">
              Browse {calculatorsList.length} clinical calculators cataloged for this medical specialty.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={tr.searchPlace[lang]}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 rounded-xl text-sm font-medium outline-none transition"
            />
          </div>

          {/* Grid of calculators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredCalcs.map((item, idx) => {
              const mappedPath = ebmcalcMapping[item.href];
              return (
                <Link
                  key={idx}
                  to={mappedPath ? getLangLink(mappedPath) : getLangLink(`/clinical-library/calc/${item.href}`)}
                  className="p-5 bg-white border border-slate-100 rounded-2xl hover:border-teal-200 hover:shadow-sm transition-all duration-200 flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-3">
                    <h3 className="font-bold text-slate-800 text-sm truncate group-hover:text-teal-700 transition-colors">
                      {cleanTitle(item.name)}
                    </h3>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mt-1">
                      {mappedPath ? 'Premium TSX Module' : 'Extended Reference'}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Global Index Sub-View (Equations, Criteria, Decisions, Convert, Specialties)
  if (view && ['equations', 'criteria', 'decision', 'convert', 'specialties'].includes(view)) {
    const list: CatalogItem[] = (catalogData as any)[view] || [];
    
    // Filtering logic
    const filteredItems = list.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (view === 'equations' || view === 'criteria') {
        if (activeLetter !== 'ALL') {
          return matchesSearch && item.name.toUpperCase().startsWith(activeLetter);
        }
      }
      
      return matchesSearch;
    });

    const pageTitle = view.charAt(0).toUpperCase() + view.slice(1);
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pb-32" dir={isRtl ? 'rtl' : 'ltr'}>
        <SEO 
          logicalPath={`/clinical-library/${view}`}
          lang={lang}
          title={`Clinical ${pageTitle} | Complete Index`}
          description={`Search and explore clinical ${view} database cataloged for clinical professionals.`}
        />

        <div className="mb-6 flex items-center justify-between">
          <Link 
            to={getLangLink('/clinical-library')} 
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            {tr.back[lang]}
          </Link>
          <span className="text-xs font-semibold text-slate-400">Library Index</span>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{pageTitle} Index</h1>
            <p className="text-slate-500 text-sm">
              Search and filter {list.length} compiled reference tools in the library.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={tr.searchPlace[lang]}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 rounded-xl text-sm font-medium outline-none transition"
            />
          </div>

          {/* Alphabet bar for Equations and Criteria */}
          {(view === 'equations' || view === 'criteria') && (
            <div className="flex flex-wrap gap-1.5 py-2 border-b border-slate-100">
              <button
                onClick={() => setActiveLetter('ALL')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeLetter === 'ALL'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                ALL
              </button>
              {alphabet.map(letter => (
                <button
                  key={letter}
                  onClick={() => setActiveLetter(letter)}
                  className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-lg transition-all ${
                    activeLetter === letter
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          )}

          {/* Display Items List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item, idx) => {
              const isSpecialty = view === 'specialties';
              const mappedPath = ebmcalcMapping[item.href];
              
              const linkTarget = isSpecialty
                ? getLangLink(`/clinical-library/specialties/${item.href}`)
                : (mappedPath ? getLangLink(mappedPath) : getLangLink(`/clinical-library/calc/${item.href}`));

              return (
                <Link
                  key={idx}
                  to={linkTarget}
                  className="p-5 bg-white border border-slate-100 rounded-2xl hover:border-teal-200 hover:shadow-sm transition-all duration-200 flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-3">
                    <h3 className="font-bold text-slate-800 text-sm truncate group-hover:text-teal-700 transition-colors">
                      {cleanTitle(item.name)}
                    </h3>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mt-1">
                      {isSpecialty 
                        ? 'Medical Specialty Group' 
                        : (mappedPath ? 'Premium TSX Module' : 'Extended Reference')
                      }
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Main View (/clinical-library)
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 pb-32 space-y-12" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO 
        logicalPath="/clinical-library"
        lang={lang}
        title="Complete Clinical Reference Database Library | CareCalculus"
        description="Access equations, clinical criteria sets, decision trees, converters, and specialties."
      />

      {/* Hero Section */}
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-lg border border-slate-800">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center justify-center pointer-events-none">
          <Calculator className="w-96 h-96 shrink-0" />
        </div>
        <div className="relative max-w-xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/20 border border-teal-500/30 text-teal-300 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Integrate Evidence
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            {lang === 'fr' ? 'Bibliothèque Clinique' : ((lang as string) === 'ar' ? 'المكتبة السريرية' : 'Clinical Reference Library')}
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {lang === 'fr' 
              ? 'Répertoire complet des formules cliniques, critères de diagnostic et outils de conversion médicale. Lié aux modules premium de CareCalculus.'
              : ((lang as string) === 'ar' 
                ? 'فهرس شامل للمعادلات السريرية ومعايير التشخيص وأدوات التحويل الطبي المتقدمة. متصلة بوحدات CareCalculus الممتازة.'
                : 'Replicating comprehensive clinical equations, criteria, decision trees, and converter indices. Connected directly to CARECALCULUS\'s premium React modules.')
            }
          </p>
        </div>
      </div>

      {/* Index Menu Sections Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          {lang === 'fr' ? 'Explorer la Bibliothèque' : ((lang as string) === 'ar' ? 'تصفح المكتبة السريرية' : 'Browse Database Catalog')}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Equations */}
          <Link 
            to={getLangLink('/clinical-library/equations')}
            className="p-6 bg-white border border-slate-100 hover:border-teal-200 rounded-3xl shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group h-48"
          >
            <div className="space-y-3">
              <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl w-fit">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xl group-hover:text-teal-700 transition-colors">
                {lang === 'fr' ? 'Équations' : ((lang as string) === 'ar' ? 'المعادلات' : 'Equations')}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'fr' ? '355 formules, indices et calculs physiologiques.' : ((lang as string) === 'ar' ? '355 معادلة ومؤشرات فسيولوجية.' : '355 formulas, calculations, and indices.')}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 mt-2">
              {lang === 'fr' ? 'Parcourir' : ((lang as string) === 'ar' ? 'استعراض الفهرس' : 'Explore Index')} <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </span>
          </Link>

          {/* Criteria */}
          <Link 
            to={getLangLink('/clinical-library/criteria')}
            className="p-6 bg-white border border-slate-100 hover:border-teal-200 rounded-3xl shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group h-48"
          >
            <div className="space-y-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xl group-hover:text-indigo-700 transition-colors">
                {lang === 'fr' ? 'Critères de Décision' : ((lang as string) === 'ar' ? 'المعايير التشخيصية' : 'Criteria Sets')}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'fr' ? '392 scores de diagnostic et d’évaluation.' : ((lang as string) === 'ar' ? '392 نظام تسجيل تشخيصي سريري.' : '392 medical diagnostic scoring systems.')}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 mt-2">
              {lang === 'fr' ? 'Parcourir' : ((lang as string) === 'ar' ? 'استعراض الفهرس' : 'Explore Index')} <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </span>
          </Link>

          {/* Decisions */}
          <Link 
            to={getLangLink('/clinical-library/decision')}
            className="p-6 bg-white border border-slate-100 hover:border-teal-200 rounded-3xl shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group h-48"
          >
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xl group-hover:text-amber-700 transition-colors">
                {lang === 'fr' ? 'Arbres de Décision' : ((lang as string) === 'ar' ? 'أشجار القرار' : 'Decision Trees')}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'fr' ? '47 algorithmes décisionnels multi-étapes.' : ((lang as string) === 'ar' ? '47 خوارزمية تفرع سريري.' : '47 multi-step clinical branch algorithms.')}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 mt-2">
              {lang === 'fr' ? 'Parcourir' : ((lang as string) === 'ar' ? 'استعراض الفهرس' : 'Explore Index')} <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </span>
          </Link>

          {/* Convert */}
          <Link 
            to={getLangLink('/clinical-library/convert')}
            className="p-6 bg-white border border-slate-100 hover:border-teal-200 rounded-3xl shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group h-48"
          >
            <div className="space-y-3">
              <div className="p-3 bg-pink-50 text-pink-600 rounded-2xl w-fit">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xl group-hover:text-pink-700 transition-colors">
                {lang === 'fr' ? 'Convertisseurs' : ((lang as string) === 'ar' ? 'أدوات التحويل' : 'Converters')}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'fr' ? '26 tables de conversion et dosages biochimiques.' : ((lang as string) === 'ar' ? '26 جدول تحويل بيوكيميائي للأدوية.' : '26 unit and biochemical conversion tables.')}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 mt-2">
              {lang === 'fr' ? 'Parcourir' : ((lang as string) === 'ar' ? 'استعراض الفهرس' : 'Explore Index')} <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </span>
          </Link>

          {/* Specialties */}
          <Link 
            to={getLangLink('/clinical-library/specialties')}
            className="p-6 bg-white border border-slate-100 hover:border-teal-200 rounded-3xl shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group h-48"
          >
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xl group-hover:text-blue-700 transition-colors">
                {lang === 'fr' ? 'Spécialités' : ((lang as string) === 'ar' ? 'التخصصات الطبية' : 'Specialties')}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'fr' ? '50 index classés par spécialités médicales.' : ((lang as string) === 'ar' ? '50 دليلاً سريرياً مصنفاً حسب التخصص.' : '50 medical index directories.')}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 mt-2">
              {lang === 'fr' ? 'Parcourir' : ((lang as string) === 'ar' ? 'استعراض الفهرس' : 'Explore Index')} <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
