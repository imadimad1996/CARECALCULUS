import React, { ErrorInfo } from 'react';
import { Route } from 'react-router-dom';
import { LangCode } from '../types';
import EmbedLayout from '../components/EmbedLayout';
import CalculatorShell from '../components/CalculatorShell';
import { Activity, BookOpen, HeartPulse, Menu, X, LayoutDashboard, Calculator, Droplet, Brain, TestTube, AlertOctagon, ArrowRightLeft, AlertTriangle, Stethoscope, Wind, FileText, ShieldCheck, Sparkles, ChevronRight, Search, Globe, Scale, MonitorPlay, GraduationCap, Newspaper, Scissors, Layers, Award, Pill } from 'lucide-react';

// Page import factories kept in one list so they can be (a) wrapped in
// React.lazy for client-side code-splitting and (b) eagerly awaited during
// build-time prerendering, which primes React.lazy's cache so renderToString
// emits the real page body instead of the Suspense fallback.
const pageLoaders = [
  () => import('../pages/MapCalculator'),
  () => import('../pages/BmiCalculator'),
  () => import('../pages/GcsCalculator'),
  () => import('../pages/DripRate'),
  () => import('../pages/CreatinineClearance'),
  () => import('../pages/WellsScore'),
  () => import('../pages/MedicalConversions'),
  () => import('../pages/CorrectedCalcium'),
  () => import('../pages/QsofaScore'),
  () => import('../pages/Curb65Score'),
  () => import('../pages/Cha2ds2VascScore'),
  () => import('../pages/Phq9Score'),
  () => import('../pages/MeldScore'),
  () => import('../pages/SirsCriteria'),
  () => import('../pages/PfRatio'),
  () => import('../pages/TidalVolume'),
  () => import('../pages/AncCalculator'),
  () => import('../pages/AdjustedBodyWeight'),
  () => import('../pages/SteroidConversion'),
  () => import('../pages/MedicalBlog'),
  () => import('../pages/Blog'),
  () => import('../pages/PdfSplitter'),
  () => import('../pages/PdfMerger'),
  () => import('../pages/Presentations'),
  () => import('../pages/Courses'),
  () => import('../pages/About'),
  () => import('../pages/Disclaimer'),
  () => import('../pages/Privacy'),
  () => import('../pages/Terms'),
  () => import('../pages/Glp1Hub'),
  () => import('../pages/ApgarScore'),
  () => import('../pages/SofaScore'),
  () => import('../pages/ChildPughScore'),
  () => import('../pages/AnionGap'),
  () => import('../pages/AaGradient'),
  () => import('../pages/FmpMedecine'),
  () => import('../pages/IspitsAcademic'),
  () => import('../pages/FlashcardGenerator'),
  () => import('../pages/CaseStudyViewer'),
  () => import('../pages/DrugSheets'),
  () => import('../pages/StudyTracker'),
  () => import('../pages/AbbreviationLookup'),
  () => import('../pages/Compare'),
  () => import('../pages/NutritionTdee'),
  () => import('../pages/NutritionMust'),
  () => import('../pages/NutritionNrs2002'),
  () => import('../pages/ConditionHub'),
  () => import('../pages/MdrdGfr'),
  () => import('../pages/CkdEpiGfr'),
  () => import('../pages/EmbedGallery'),
  () => import('../pages/ForHospitals'),
  () => import('../pages/SpecialtyHub'),
  () => import('../pages/NutritionHub'),
  () => import('../pages/ClinicalQuestionPage'),
  () => import('../pages/ProgrammaticGuidePage'),
  () => import('../pages/ParklandFormula'),
  () => import('../pages/FenaCalculator'),
  () => import('../pages/WintersFormula'),
  () => import('../pages/HasBledScore'),
  () => import('../pages/CiwaArScore'),
  () => import('../pages/FreeWaterDeficit'),
  () => import('../pages/SodiumCorrection'),
  () => import('../pages/HeparinDosing'),
  () => import('../pages/OpioidConversion'),
  () => import('../pages/MaintenanceFluids'),
  () => import('../pages/OsmolalGap'),
  () => import('../pages/TimiScore'),
  () => import('../pages/HeartScore'),
  () => import('../pages/PercRule'),
  () => import('../pages/GenevaScore'),
  () => import('../pages/NihssScore'),
  () => import('../pages/GraceScore'),
  () => import('../pages/BicarbDeficit'),
  () => import('../pages/ReticIndex'),
  () => import('../pages/PhenytoinCorrection'),
  () => import('../pages/AscvdRisk'),
  () => import('../pages/VancomycinDosing'),
  () => import('../pages/AminoglycosideDosing'),
  () => import('../pages/PesiScore'),
  () => import('../pages/BovaScore'),
  () => import('../pages/ApacheIIScore'),
  () => import('../pages/SapsIIScore'),
  () => import('../pages/DrugInteractions'),
  () => import('../pages/MedicalStatistics'),
  () => import('../pages/FavoritesPage'),
  () => import('../pages/ClinicalLibrary'),
  () => import('../pages/PricingPage'),
] as const;

const [
  MapCalculator, BmiCalculator, GcsCalculator, DripRate, CreatinineClearance,
  WellsScore, MedicalConversions, CorrectedCalcium, QsofaScore, Curb65Score,
  Cha2ds2VascScore, Phq9Score, MeldScore, SirsCriteria, PfRatio, TidalVolume,
  AncCalculator, AdjustedBodyWeight, SteroidConversion, MedicalBlog, Blog,
  PdfSplitter, PdfMerger, Presentations, Courses, About, Disclaimer, Privacy, Terms,
  Glp1Hub, ApgarScore, SofaScore, ChildPughScore, AnionGap, AaGradient,
  FmpMedecine, IspitsAcademic,
  FlashcardGenerator, CaseStudyViewer, DrugSheets, StudyTracker, AbbreviationLookup,
  Compare, NutritionTdee, NutritionMust, NutritionNrs2002, ConditionHub,
  MdrdGfr, CkdEpiGfr, EmbedGallery, ForHospitals, SpecialtyHub, NutritionHub,
  ClinicalQuestionPage, ProgrammaticGuidePage,
  ParklandFormula, FenaCalculator, WintersFormula, HasBledScore,
  CiwaArScore, FreeWaterDeficit, SodiumCorrection,
  HeparinDosing, OpioidConversion, MaintenanceFluids,
  OsmolalGap, TimiScore, HeartScore,
  PercRule, GenevaScore, NihssScore,
  GraceScore, BicarbDeficit, ReticIndex,
  PhenytoinCorrection, AscvdRisk, VancomycinDosing, AminoglycosideDosing,
  PesiScore, BovaScore, ApacheIIScore, SapsIIScore, DrugInteractions, MedicalStatistics, FavoritesPage, ClinicalLibrary, PricingPage
] = pageLoaders.map((loader) => React.lazy(loader as any)) as any[];

export const HomePage = React.lazy(() => import('../pages/HomePage'));
export const NotFound = React.lazy(() => import('../pages/NotFound'));

/**
 * Eagerly resolve every page chunk. Called once before prerendering so that
 * React.lazy resolves synchronously during renderToString. Each loader returns
 * the SAME module promise React.lazy uses (bundler-cached), so awaiting them
 * here transitions the lazy components to their resolved state.
 */
export async function preloadPages() {
  await Promise.all([
    ...pageLoaders.map((load) => load()),
    import('../pages/HomePage'),
  ]);
}

// Routes for the static legal/about pages (no lang prop needed)
export const LEGAL_ROUTES = ['/about', '/disclaimer', '/privacy', '/terms', '/embed-gallery', '/for-hospitals'];

// Routes that open in full-width reading mode (no sidebar, no top widgets)
export const CONTENT_ROUTES = ['/blog', '/blog-articles', '/presentations', '/cours', '/about', '/disclaimer', '/privacy', '/terms', '/glp-1-hub', '/hub-glp1', '/%D9%85%D8%B1%D9%83%D8%B2-glp1', '/مركز-glp1', '/ispits', '/embed-gallery', '/for-hospitals', '/clinical-guide', '/clinical-library'];

export class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-red-600 bg-red-50 font-mono text-sm max-w-full overflow-auto h-screen">
          <h1 className="text-xl font-bold mb-4">React Error</h1>
          <pre>{this.state.error?.toString()}</pre>
          <pre className="mt-4 opacity-70">{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Structured Clinical Navigation Items with Tier levels & localizations for multi-lingual routing
export const navItems = [
  // Tier 1: Emergency & Critical Care
  { path: '/map-calculator', nameEn: 'MAP Calculator', nameFr: 'Calculateur PAM', nameAr: 'حساب الضغط المتوسط MAP', icon: Activity, tier: 1 },
  { path: '/parkland-formula', nameEn: 'Parkland Burn Fluid', nameFr: 'Formule de Parkland Brûlure', nameAr: 'معادلة باركلاند للحروق', icon: Droplet, tier: 1 },
  { path: '/fena', nameEn: 'FENa Sodium Excretion', nameFr: 'FENa Excrétion Sodium', nameAr: 'حساب FENa للكلى', icon: TestTube, tier: 1 },
  { path: '/winters-formula', nameEn: 'Winters Formula Acidosis', nameFr: 'Formule de Winters Acidose', nameAr: 'معادلة وينترز للحموضة', icon: Wind, tier: 1 },
  { path: '/has-bled', nameEn: 'HAS-BLED Bleeding Risk', nameFr: 'Score HAS-BLED Risque Hémorragique', nameAr: 'مقياس HAS-BLED للنزيف', icon: HeartPulse, tier: 1 },
  { path: '/glasgow-coma-scale', nameEn: 'GCS Calculator', nameFr: 'Échelle de Glasgow', nameAr: 'معيار غلاسكو للغيبوبة GCS', icon: Brain, tier: 1 },
  { path: '/qsofa-score', nameEn: 'qSOFA Score Sepsis', nameFr: 'Score qSOFA Sepsis', nameAr: 'مؤشر qSOFA لتسمم الدم', icon: AlertTriangle, tier: 1 },
  { path: '/sirs-criteria', nameEn: 'SIRS Criteria Sepsis', nameFr: 'Critères SIRS Sepsis', nameAr: 'معايير SIRS للالتهاب العام', icon: AlertTriangle, tier: 1 },
  { path: '/curb65-score', nameEn: 'CURB-65 Pneumonia', nameFr: 'Score CURB-65 Pneumonie', nameAr: 'معيار CURB-65 للالتهاب الرئوي', icon: Stethoscope, tier: 1 },
  { path: '/pf-ratio', nameEn: 'P/F Ratio Lung Injury', nameFr: 'Rapport P/F Respiratoire', nameAr: 'نسبة PaO2/FiO2 للرئتين', icon: Wind, tier: 1 },
  { path: '/tidal-volume', nameEn: 'Tidal Volume ARDS', nameFr: 'Volume Courant (Tidal)', nameAr: 'حجم الهواء التنفسي المتوقع', icon: Wind, tier: 1 },
  { path: '/apgar-score', nameEn: 'APGAR Score', nameFr: 'Score d’APGAR', nameAr: 'مقياس أبغار للوليد APGAR', icon: Activity, tier: 1 },
  { path: '/sofa-score', nameEn: 'SOFA Score ICU', nameFr: 'Score SOFA Réanimation', nameAr: 'مقياس SOFA للفشل العضوي', icon: AlertOctagon, tier: 1 },
  { path: '/ciwa-ar', nameEn: 'CIWA-Ar Alcohol Score', nameFr: 'Score CIWA-Ar Alcool', nameAr: 'مقياس CIWA-Ar لانسحاب الكحول', icon: Activity, tier: 1 },
  { path: '/timi-score', nameEn: 'TIMI Score NSTEMI', nameFr: 'Score TIMI NSTEMI', nameAr: 'نقاط TIMI لنقص التروية', icon: HeartPulse, tier: 1 },
  { path: '/heart-score', nameEn: 'HEART Score Chest Pain', nameFr: 'Score HEART Douleur Thoracique', nameAr: 'مقياس HEART لألم الصدر', icon: HeartPulse, tier: 1 },
  { path: '/grace-score', nameEn: 'GRACE ACS Score', nameFr: 'Score GRACE SCA', nameAr: 'مقياس GRACE لمتلازمة الشريان التاجي', icon: HeartPulse, tier: 1 },
  { path: '/perc-rule', nameEn: 'PERC Rule for PE', nameFr: 'Score PERC Embolie Pulmonaire', nameAr: 'قاعدة PERC لاستبعاد الجلطة الرئوية', icon: Wind, tier: 1 },
  { path: '/geneva-score', nameEn: 'Geneva Score PE', nameFr: 'Score de Genève EP', nameAr: 'مقياس جنيف للجلطة الرئوية', icon: Wind, tier: 1 },
  { path: '/pesi-score', nameEn: 'PESI Score PE', nameFr: 'Score PESI EP', nameAr: 'مقياس PESI للجلطة الرئوية', icon: Wind, tier: 1 },
  { path: '/bova-score', nameEn: 'Bova Score PE', nameFr: 'Score Bova EP', nameAr: 'مقياس بوفا للجلطة الرئوية', icon: HeartPulse, tier: 1 },
  { path: '/apache-ii-score', nameEn: 'APACHE II', nameFr: 'Score APACHE II', nameAr: 'مقياس أباتشي للرعاية المركزة', icon: Activity, tier: 1 },
  { path: '/saps-ii-score', nameEn: 'SAPS II', nameFr: 'Score SAPS II', nameAr: 'مقياس SAPS II', icon: Activity, tier: 1 },
  { path: '/nihss-score', nameEn: 'NIHSS Stroke Scale', nameFr: 'Score NIHSS AVC', nameAr: 'مقياس السكتة الدماغية NIHSS', icon: Brain, tier: 1 },

  // Tier 2: Organ Function & Internal Medicine
  { path: '/creatinine-clearance', nameEn: 'Creatinine Clearance', nameFr: 'Clairance Créatinine', nameAr: 'تصفية الكرياتينين وكفاءة الكلى', icon: TestTube, tier: 2 },
  { path: '/mdrd-gfr', nameEn: 'MDRD GFR Score', nameFr: 'MDRD DFG Score', nameAr: 'معدل الترشيح الكبيبي MDRD', icon: TestTube, tier: 2 },
  { path: '/ckd-epi-gfr', nameEn: 'CKD-EPI GFR Score', nameFr: 'CKD-EPI DFG Score', nameAr: 'معدل الترشيح الكبيبي CKD-EPI', icon: TestTube, tier: 2 },
  { path: '/meld-score', nameEn: 'MELD Score Liver', nameFr: 'Score MELD Hépatique', nameAr: 'نقاط MELD لتليف وفشل الكبد', icon: Activity, tier: 2 },
  { path: '/wells-score', nameEn: 'Wells Score', nameFr: 'Score de Wells DVT/PE', nameAr: 'نقاط ويلز للانسداد الرئوي والجلطة', icon: AlertOctagon, tier: 2 },
  { path: '/cha2ds2-vasc', nameEn: 'CHA2DS2-VASc stroke', nameFr: 'Score CHA2DS2-VASc FA', nameAr: 'معيار سكتة الرجفان الأذيني', icon: HeartPulse, tier: 2 },
  { path: '/corrected-calcium', nameEn: 'Corrected Calcium', nameFr: 'Calcium Corrigé Albumin', nameAr: 'الكالسيوم المصحح بالألبومين', icon: TestTube, tier: 2 },
  { path: '/anc-calculator', nameEn: 'ANC Calculator', nameFr: 'Calculateur NAN Neutro', nameAr: 'حساب خلايا الدم المتعادلة ANC', icon: TestTube, tier: 2 },
  { path: '/ascvd-risk', nameEn: 'ASCVD Risk', nameFr: 'Risque ASCVD', nameAr: 'خطر أمراض القلب', icon: HeartPulse, tier: 2 },
  { path: '/retic-index', nameEn: 'Reticulocyte Index', nameFr: 'Indice Réticulocytaire', nameAr: 'مؤشر الخلايا الشبكية', icon: Droplet, tier: 2 },
  { path: '/child-pugh-score', nameEn: 'Child-Pugh Score', nameFr: 'Score de Child-Pugh', nameAr: 'تصنيف تشايلد بيو للكبد', icon: Activity, tier: 2 },
  { path: '/anion-gap', nameEn: 'Anion Gap', nameFr: 'Trou Anionique', nameAr: 'الفجوة الأنيونية للدم', icon: TestTube, tier: 2 },
  { path: '/osmolal-gap', nameEn: 'Osmolal Gap', nameFr: 'Trou Osmolaire', nameAr: 'الفجوة الأسموزية للدم', icon: TestTube, tier: 2 },
  { path: '/aa-gradient', nameEn: 'A-a Gradient', nameFr: 'Gradient Alvéolo-Artériel', nameAr: 'فرق الأكسجين A-a Gradient', icon: Wind, tier: 2 },
  { path: '/free-water-deficit', nameEn: 'Free Water Deficit', nameFr: 'Déficit en Eau Libre', nameAr: 'نقص الماء الحر في فرط الصوديوم', icon: Droplet, tier: 2 },
  { path: '/sodium-correction', nameEn: 'Sodium Correction Rate', nameFr: 'Correction de Sodium', nameAr: 'معدل تصحيح الصوديوم', icon: Activity, tier: 2 },
  { path: '/nutrition-tdee', nameEn: 'TDEE & BMR Nutrition', nameFr: 'TDEE & Métabolisme de Base', nameAr: 'احتياجات الطاقة والسعرات', icon: Activity, tier: 2 },
  { path: '/nutrition-must', nameEn: 'MUST Malnutrition Score', nameFr: 'Score MUST Dénutrition', nameAr: 'أداة MUST لسوء التغذية', icon: Activity, tier: 2 },
  { path: '/nutrition-nrs2002', nameEn: 'NRS-2002 Nutrition Risk', nameFr: 'NRS-2002 Risque Nutritionnel', nameAr: 'أداة NRS-2002 للمخاطر الغذائية', icon: AlertOctagon, tier: 2 },

  // Tier 3: Infusions, Metrics & Pharmacology
  { path: '/drip-rate-calculator', nameEn: 'IV Drip Rate Tool', nameFr: 'Calcul Débit Perfusion', nameAr: 'سرعة تنقيط المحلول الوريدي', icon: Droplet, tier: 3 },
  { path: '/steroid-conversion', nameEn: 'Steroids Equivalence', nameFr: 'Équivalence Corticoïdes', nameAr: 'تحويل جرعات الكورتيزون والستيرويد', icon: ArrowRightLeft, tier: 3 },
  { path: '/adjusted-body-weight', nameEn: 'IBW & ABW Weight', nameFr: 'Poids Idéal & Ajusté', nameAr: 'حساب الوزن المثالي والمعدل', icon: LayoutDashboard, tier: 3 },
  { path: '/medical-conversions', nameEn: 'Unit Conversions', nameFr: 'Conversions d’Unités', nameAr: 'تحويل الوحدات المخبرية والطبية', icon: ArrowRightLeft, tier: 3 },
  { path: '/bicarb-deficit', nameEn: 'Bicarbonate Deficit', nameFr: 'Déficit en Bicarbonate', nameAr: 'نقص البيكربونات', icon: Droplet, tier: 3 },
  { path: '/bmi-calculator', nameEn: 'BMI Calculator', nameFr: 'Calculateur IMC', nameAr: 'مؤشر كتلة وزن الجسم BMI', icon: LayoutDashboard, tier: 3 },
  { path: '/phq9-score', nameEn: 'PHQ-9 Depression', nameFr: 'Score PHQ-9 Dépression', nameAr: 'مقياس PHQ-9 لتشخيص الاكتئاب', icon: Brain, tier: 3 },
  { path: '/heparin-dosing', nameEn: 'Heparin Dosing', nameFr: 'Dosage Héparine', nameAr: 'جرعة الهيبارين', icon: Activity, tier: 3 },
  { path: '/vancomycin-dosing', nameEn: 'Vancomycin Dosing', nameFr: 'Dosage Vancomycine', nameAr: 'جرعة الفانكومايسين', icon: Pill, tier: 3 },
  { path: '/aminoglycoside-dosing', nameEn: 'Aminoglycoside Dosing', nameFr: 'Dosage Aminosides', nameAr: 'جرعة الأمينوغليكوزيد', icon: Pill, tier: 3 },
  { path: '/opioid-conversion', nameEn: 'Opioid Conversion', nameFr: 'Conversion Opioïdes', nameAr: 'تحويل مسكنات الألم', icon: ArrowRightLeft, tier: 3 },
  { path: '/maintenance-fluids', nameEn: 'Maintenance IV Fluids', nameFr: 'Fluides d’Entretien IV', nameAr: 'السوائل الوريدية اليومية', icon: Droplet, tier: 3 },
  { path: '/phenytoin-correction', nameEn: 'Phenytoin Correction', nameFr: 'Correction Phénytoïne', nameAr: 'تصحيح الفينيتوين', icon: Pill, tier: 3 },
  
  // Tier 4 — Resources & Library
  { path: '/drug-interactions', nameEn: 'Drug Interactions', nameFr: 'Interactions Médicamenteuses', nameAr: 'تداخلات الأدوية', icon: ShieldCheck, tier: 0 },
  { path: '/medical-statistics', nameEn: 'Medical Statistics', nameFr: 'Statistiques Médicales', nameAr: 'الإحصاء الطبي', icon: Layers, tier: 0 },
  { path: '/glp-1-hub', nameEn: 'GLP-1 Hub', nameFr: 'Hub GLP-1', nameAr: 'مركز أدوية GLP-1', icon: Sparkles, tier: 4, group: 'reading' as const },
  { path: '/blog', nameEn: 'Medical Journals', nameFr: 'Journaux Médicaux', nameAr: 'المجلات الطبية', icon: BookOpen, tier: 4, group: 'reading' as const },
  { path: '/blog-articles', nameEn: 'Blog', nameFr: 'Blog', nameAr: 'المدونة', icon: Newspaper, tier: 4, group: 'reading' as const },
  { path: '/presentations', nameEn: 'Presentations', nameFr: 'Présentations', nameAr: 'العروض التقديمية', icon: MonitorPlay, tier: 4, group: 'learning' as const },
  { path: '/cours', nameEn: 'Courses (PDF)', nameFr: 'Cours (PDF)', nameAr: 'المحاضرات والدروس', icon: GraduationCap, tier: 4, group: 'learning' as const },
  { path: '/fmp-medecine', nameEn: 'Faculty of Medicine', nameFr: 'Faculté de Médecine', nameAr: 'كلية الطب والصيدلة', icon: GraduationCap, tier: 4, group: 'learning' as const },
  { path: '/ispits', nameEn: 'ISPITS Paramedical', nameFr: 'ISPITS Paramédical', nameAr: 'مناهج معاهد التمريض (ISPITS)', icon: GraduationCap, tier: 4, group: 'learning' as const },
  { path: '/study-tracker', nameEn: 'Study Progress Tracker', nameFr: 'Suivi d\'Études', nameAr: 'متابع التقدم الدراسي', icon: Award, tier: 4, group: 'learning' as const },
  { path: '/flashcard-generator', nameEn: 'Medical Flashcards', nameFr: 'Flashcards Médicales', nameAr: 'البطاقات التعليمية الطبية', icon: Layers, tier: 4, group: 'learning' as const },
  { path: '/case-study-viewer', nameEn: 'Clinical Case Studies', nameFr: 'Cas Cliniques', nameAr: 'الحالات السريرية التفاعلية', icon: Stethoscope, tier: 4, group: 'learning' as const },
  { path: '/drug-sheets', nameEn: 'ICU Drug Reference', nameFr: 'Fiches Médicaments', nameAr: 'جرعات أدوية العناية', icon: Droplet, tier: 4, group: 'learning' as const },
  { path: '/abbreviation-lookup', nameEn: 'Medical Abbreviations', nameFr: 'Abréviations Médicales', nameAr: 'قاموس الاختصارات الطبية', icon: FileText, tier: 4, group: 'learning' as const },
  { path: '/nutrition-hub', nameEn: 'Nutrition Hub', nameFr: 'Hub Nutrition', nameAr: 'تغذية', icon: BookOpen, tier: 4, group: 'reading' as const },

  // Tier 5 — Utilities
  { path: '/pdf-splitter', nameEn: 'PDF Splitter', nameFr: 'Découpeur PDF', nameAr: 'تقسيم ملفات PDF', icon: Scissors, tier: 5 },
  { path: '/pdf-merger', nameEn: 'PDF Merger', nameFr: 'Fusionneur PDF', nameAr: 'دمج ملفات PDF', icon: Layers, tier: 5 },
];

export const TIER_HEADERS: Record<number, Record<LangCode, string>> = {
  1: {
    en: 'Emergency & Critical Care',
    fr: 'Urgences & Soins Critiques'
  },
  2: {
    en: 'Metabolic & Cardiorenal',
    fr: 'Métabolique & Cardiorénal'
  },
  3: {
    en: 'Therapeutic & Dosing Metrics',
    fr: 'Métriques, Perfusions & Doses'
  },
  5: {
    en: 'Medical Utilities',
    fr: 'Utilitaires Médicaux'
  }
};


// The set of clinical module routes, defined once with RELATIVE paths so it can
// be mounted under "/", "/fr", and "/ar" without duplication. `langPath` builds
// the redirect targets for the index/fallback routes in the active language.
export function moduleRoutes(lang: LangCode, langPath: (p: string) => string) {
  const wrapCalculator = (logicalPath: string, node: React.ReactNode) => (
    <CalculatorShell logicalPath={logicalPath} lang={lang}>
      {node}
    </CalculatorShell>
  );

  return (
    <>
      <Route index element={<HomePage lang={lang} />} />
      <Route path="home" element={<HomePage lang={lang} />} />
      <Route path="favorites" element={<FavoritesPage lang={lang} />} />
      <Route path="map-calculator" element={wrapCalculator('/map-calculator', <MapCalculator lang={lang} />)} />
      <Route path="bmi-calculator" element={wrapCalculator('/bmi-calculator', <BmiCalculator lang={lang} />)} />
      <Route path="glasgow-coma-scale" element={wrapCalculator('/glasgow-coma-scale', <GcsCalculator lang={lang} />)} />
      <Route path="drip-rate-calculator" element={wrapCalculator('/drip-rate-calculator', <DripRate lang={lang} />)} />
      <Route path="creatinine-clearance" element={wrapCalculator('/creatinine-clearance', <CreatinineClearance lang={lang} />)} />
      <Route path="mdrd-gfr" element={wrapCalculator('/mdrd-gfr', <MdrdGfr lang={lang} />)} />
      <Route path="ckd-epi-gfr" element={wrapCalculator('/ckd-epi-gfr', <CkdEpiGfr lang={lang} />)} />
      <Route path="wells-score" element={wrapCalculator('/wells-score', <WellsScore lang={lang} />)} />
      <Route path="parkland-formula" element={wrapCalculator('/parkland-formula', <ParklandFormula lang={lang} />)} />
      <Route path="heparin-dosing" element={wrapCalculator('/heparin-dosing', <HeparinDosing lang={lang} />)} />
      <Route path="opioid-conversion" element={wrapCalculator('/opioid-conversion', <OpioidConversion lang={lang} />)} />
      <Route path="maintenance-fluids" element={wrapCalculator('/maintenance-fluids', <MaintenanceFluids lang={lang} />)} />
      <Route path="osmolal-gap" element={wrapCalculator('/osmolal-gap', <OsmolalGap lang={lang} />)} />
      <Route path="timi-score" element={wrapCalculator('/timi-score', <TimiScore lang={lang} />)} />
      <Route path="heart-score" element={wrapCalculator('/heart-score', <HeartScore lang={lang} />)} />
      <Route path="perc-rule" element={wrapCalculator('/perc-rule', <PercRule lang={lang} />)} />
      <Route path="geneva-score" element={wrapCalculator('/geneva-score', <GenevaScore lang={lang} />)} />
      <Route path="nihss-score" element={wrapCalculator('/nihss-score', <NihssScore lang={lang} />)} />
      <Route path="grace-score" element={wrapCalculator('/grace-score', <GraceScore lang={lang} />)} />
      <Route path="bicarb-deficit" element={wrapCalculator('/bicarb-deficit', <BicarbDeficit lang={lang} />)} />
      <Route path="retic-index" element={wrapCalculator('/retic-index', <ReticIndex lang={lang} />)} />
      <Route path="fena" element={wrapCalculator('/fena', <FenaCalculator lang={lang} />)} />
      <Route path="winters-formula" element={wrapCalculator('/winters-formula', <WintersFormula lang={lang} />)} />
      <Route path="has-bled" element={wrapCalculator('/has-bled', <HasBledScore lang={lang} />)} />
      <Route path="ciwa-ar" element={wrapCalculator('/ciwa-ar', <CiwaArScore lang={lang} />)} />
      <Route path="free-water-deficit" element={wrapCalculator('/free-water-deficit', <FreeWaterDeficit lang={lang} />)} />
      <Route path="sodium-correction" element={wrapCalculator('/sodium-correction', <SodiumCorrection lang={lang} />)} />
      <Route path="medical-conversions" element={wrapCalculator('/medical-conversions', <MedicalConversions lang={lang} />)} />
      <Route path="medical-conversions/:category" element={wrapCalculator('/medical-conversions', <MedicalConversions lang={lang} />)} />
      <Route path="corrected-calcium" element={wrapCalculator('/corrected-calcium', <CorrectedCalcium lang={lang} />)} />
      <Route path="qsofa-score" element={wrapCalculator('/qsofa-score', <QsofaScore lang={lang} />)} />
      <Route path="curb65-score" element={wrapCalculator('/curb65-score', <Curb65Score lang={lang} />)} />
      <Route path="cha2ds2-vasc" element={wrapCalculator('/cha2ds2-vasc', <Cha2ds2VascScore lang={lang} />)} />
      <Route path="phq9-score" element={wrapCalculator('/phq9-score', <Phq9Score lang={lang} />)} />
      <Route path="meld-score" element={wrapCalculator('/meld-score', <MeldScore lang={lang} />)} />
      <Route path="sirs-criteria" element={wrapCalculator('/sirs-criteria', <SirsCriteria lang={lang} />)} />
      <Route path="pf-ratio" element={wrapCalculator('/pf-ratio', <PfRatio lang={lang} />)} />
      <Route path="tidal-volume" element={wrapCalculator('/tidal-volume', <TidalVolume lang={lang} />)} />
      <Route path="anc-calculator" element={wrapCalculator('/anc-calculator', <AncCalculator lang={lang} />)} />
      <Route path="adjusted-body-weight" element={wrapCalculator('/adjusted-body-weight', <AdjustedBodyWeight lang={lang} />)} />
      <Route path="steroid-conversion" element={wrapCalculator('/steroid-conversion', <SteroidConversion lang={lang} />)} />
      <Route path="phenytoin-correction" element={wrapCalculator('/phenytoin-correction', <PhenytoinCorrection lang={lang} />)} />
      <Route path="ascvd-risk" element={wrapCalculator('/ascvd-risk', <AscvdRisk lang={lang} />)} />
      <Route path="vancomycin-dosing" element={wrapCalculator('/vancomycin-dosing', <VancomycinDosing lang={lang} />)} />
      <Route path="aminoglycoside-dosing" element={wrapCalculator('/aminoglycoside-dosing', <AminoglycosideDosing lang={lang} />)} />
      <Route path="pesi-score" element={wrapCalculator('/pesi-score', <PesiScore lang={lang} />)} />
      <Route path="bova-score" element={wrapCalculator('/bova-score', <BovaScore lang={lang} />)} />
      <Route path="apache-ii-score" element={wrapCalculator('/apache-ii-score', <ApacheIIScore lang={lang} />)} />
      <Route path="saps-ii-score" element={wrapCalculator('/saps-ii-score', <SapsIIScore lang={lang} />)} />
      <Route path="drug-interactions" element={wrapCalculator('/drug-interactions', <DrugInteractions lang={lang} />)} />
      <Route path="medical-statistics" element={wrapCalculator('/medical-statistics', <MedicalStatistics lang={lang} />)} />
      <Route path="pdf-splitter" element={<PdfSplitter lang={lang} />} />
      <Route path="pdf-merger" element={<PdfMerger lang={lang} />} />
      <Route path="blog" element={<MedicalBlog lang={lang} />} />
      <Route path="blog/:slug" element={<MedicalBlog lang={lang} />} />
      <Route path="blog-articles" element={<Blog lang={lang} />} />
      <Route path="blog-articles/:slug" element={<Blog lang={lang} />} />
      <Route path="presentations" element={<Presentations lang={lang} />} />
      <Route path="presentations/:slug" element={<Presentations lang={lang} />} />
      <Route path="cours" element={<Courses lang={lang} />} />
      <Route path="cours/:slug" element={<Courses lang={lang} />} />
      <Route path="fmp-medecine" element={<FmpMedecine lang={lang} />} />
      <Route path="fmp-medecine/:moduleSlug" element={<FmpMedecine lang={lang} />} />
      <Route path="ispits" element={<IspitsAcademic lang={lang} />} />
      <Route path="ispits/:moduleSlug" element={<IspitsAcademic lang={lang} />} />
      <Route path="nutrition-tdee" element={wrapCalculator('/nutrition-tdee', <NutritionTdee lang={lang} />)} />
      <Route path="nutrition-must" element={wrapCalculator('/nutrition-must', <NutritionMust lang={lang} />)} />
      <Route path="nutrition-nrs2002" element={wrapCalculator('/nutrition-nrs2002', <NutritionNrs2002 lang={lang} />)} />
      <Route path="nutrition-hub" element={<NutritionHub lang={lang} />} />
      <Route path="glp-1-hub" element={<Glp1Hub lang={lang} />} />
      <Route path="hub-glp1" element={<Glp1Hub lang={lang} />} />
      <Route path="مركز-glp1" element={<Glp1Hub lang={lang} />} />
      <Route path="%D9%85%D8%B1%D9%83%D8%B2-glp1" element={<Glp1Hub lang={lang} />} />
      <Route path="flashcard-generator" element={<FlashcardGenerator lang={lang} />} />
      <Route path="case-study-viewer" element={<CaseStudyViewer lang={lang} />} />
      <Route path="drug-sheets" element={<DrugSheets lang={lang} />} />
      <Route path="study-tracker" element={<StudyTracker lang={lang} />} />
      <Route path="abbreviation-lookup" element={<AbbreviationLookup lang={lang} />} />
      <Route path="about" element={<About lang={lang} />} />
      <Route path="conditions/:conditionSlug" element={<ConditionHub lang={lang} />} />
      <Route path="specialties/:specialtySlug" element={<SpecialtyHub lang={lang} />} />
      <Route path="disclaimer" element={<Disclaimer lang={lang} />} />
      <Route path="privacy" element={<Privacy lang={lang} />} />
      <Route path="terms" element={<Terms lang={lang} />} />
      <Route path="pricing" element={<PricingPage lang={lang} />} />
      <Route path="tarifs" element={<PricingPage lang={lang} />} />
      <Route path="embed-gallery" element={<EmbedGallery lang={lang} />} />
      <Route path="for-hospitals" element={<ForHospitals lang={lang} />} />
      <Route path="apgar-score" element={wrapCalculator('/apgar-score', <ApgarScore lang={lang} />)} />
      <Route path="sofa-score" element={wrapCalculator('/sofa-score', <SofaScore lang={lang} />)} />
      <Route path="child-pugh-score" element={wrapCalculator('/child-pugh-score', <ChildPughScore lang={lang} />)} />
      <Route path="anion-gap" element={wrapCalculator('/anion-gap', <AnionGap lang={lang} />)} />
      <Route path="aa-gradient" element={wrapCalculator('/aa-gradient', <AaGradient lang={lang} />)} />
      <Route path="compare/:slug1-vs-:slug2" element={<Compare lang={lang} />} />
      <Route path="clinical-library" element={<ClinicalLibrary lang={lang} />} />
      <Route path="clinical-library/:view" element={<ClinicalLibrary lang={lang} />} />
      <Route path="clinical-library/:view/:subId" element={<ClinicalLibrary lang={lang} />} />
      {/* Clinical Q&A Pages — the 100x SEO multiplier */}
      <Route path="q/:questionSlug" element={<ClinicalQuestionPage lang={lang} />} />
      {/* Programmatic SEO Guides */}
      <Route path="clinical-guide" element={<ProgrammaticGuidePage lang={lang} />} />
      <Route path="clinical-guide/:guideSlug" element={<ProgrammaticGuidePage lang={lang} />} />
    </>
  );
}

// Routes for the embed widgets
export function embedRoutes(lang: LangCode) {
  return (
    <>
      <Route path="embed/map-calculator" element={<EmbedLayout lang={lang} calculatorSlug="map-calculator"><MapCalculator lang={lang} /></EmbedLayout>} />
      <Route path="embed/bmi-calculator" element={<EmbedLayout lang={lang} calculatorSlug="bmi-calculator"><BmiCalculator lang={lang} /></EmbedLayout>} />
      <Route path="embed/glasgow-coma-scale" element={<EmbedLayout lang={lang} calculatorSlug="glasgow-coma-scale"><GcsCalculator lang={lang} /></EmbedLayout>} />
    </>
  );
}
