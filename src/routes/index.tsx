import React, { ErrorInfo } from 'react';
import { Route } from 'react-router-dom';
import { LangCode } from '../types';
import EmbedLayout from '../components/EmbedLayout';
import CalculatorShell from '../components/CalculatorShell';
import { Activity, BookOpen, HeartPulse, Menu, X, LayoutDashboard, Calculator, Droplet, Brain, TestTube, AlertOctagon, ArrowRightLeft, AlertTriangle, Stethoscope, Wind, FileText, ShieldCheck, Sparkles, ChevronRight, Search, Globe, Scale, MonitorPlay, GraduationCap, Newspaper, Scissors, Layers, Award, Pill, FlaskConical, Thermometer, Syringe, ShieldAlert } from 'lucide-react';

const pageLoaders: (() => Promise<any>)[] = [];

const safeLazy = (loader: () => Promise<any>) => {
  return React.lazy(async () => {
    try {
      return await loader();
    } catch (error: any) {
      const errStr = error?.toString() || error?.message || '';
      const isChunkError =
        errStr.includes('Failed to fetch dynamically imported module') ||
        errStr.includes('Loading chunk') ||
        errStr.includes('MIME type') ||
        errStr.includes('Importing a module script failed');

      const lastReload = Number(sessionStorage.getItem('cc_chunk_reload_time') || 0);
      const now = Date.now();

      if (isChunkError && (now - lastReload > 5000)) {
        sessionStorage.setItem('cc_chunk_reload_time', String(now));
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(regs => {
            for (const r of regs) r.unregister();
          });
        }
        if ('caches' in window) {
          caches.keys().then(keys => {
            for (const k of keys) caches.delete(k);
          });
        }
        window.location.reload();
        return new Promise(() => {});
      }

      throw error;
    }
  });
};

const createLazyPage = (loader: () => Promise<any>) => {
  pageLoaders.push(loader);
  return safeLazy(loader);
};

const MapCalculator = createLazyPage(() => import('../pages/MapCalculator'));
const BmiCalculator = createLazyPage(() => import('../pages/BmiCalculator'));
const GcsCalculator = createLazyPage(() => import('../pages/GcsCalculator'));
const DripRate = createLazyPage(() => import('../pages/DripRate'));
const CreatinineClearance = createLazyPage(() => import('../pages/CreatinineClearance'));
const WellsScore = createLazyPage(() => import('../pages/WellsScore'));
const WellsPeScore = createLazyPage(() => import('../pages/WellsPeScore'));
const MedicalConversions = createLazyPage(() => import('../pages/MedicalConversions'));
const CorrectedCalcium = createLazyPage(() => import('../pages/CorrectedCalcium'));
const QsofaScore = createLazyPage(() => import('../pages/QsofaScore'));
const Curb65Score = createLazyPage(() => import('../pages/Curb65Score'));
const Cha2ds2VascScore = createLazyPage(() => import('../pages/Cha2ds2VascScore'));
const Phq9Score = createLazyPage(() => import('../pages/Phq9Score'));
const MeldScore = createLazyPage(() => import('../pages/MeldScore'));
const SirsCriteria = createLazyPage(() => import('../pages/SirsCriteria'));
const PfRatio = createLazyPage(() => import('../pages/PfRatio'));
const TidalVolume = createLazyPage(() => import('../pages/TidalVolume'));
const AncCalculator = createLazyPage(() => import('../pages/AncCalculator'));
const AdjustedBodyWeight = createLazyPage(() => import('../pages/AdjustedBodyWeight'));
const SteroidConversion = createLazyPage(() => import('../pages/SteroidConversion'));

const About = createLazyPage(() => import('../pages/About'));
const Disclaimer = createLazyPage(() => import('../pages/Disclaimer'));
const Privacy = createLazyPage(() => import('../pages/Privacy'));
const Terms = createLazyPage(() => import('../pages/Terms'));
const ApgarScore = createLazyPage(() => import('../pages/ApgarScore'));
const SofaScore = createLazyPage(() => import('../pages/SofaScore'));
const ChildPughScore = createLazyPage(() => import('../pages/ChildPughScore'));
const AnionGap = createLazyPage(() => import('../pages/AnionGap'));
const AaGradient = createLazyPage(() => import('../pages/AaGradient'));
const Compare = createLazyPage(() => import('../pages/Compare'));
const NutritionTdee = createLazyPage(() => import('../pages/NutritionTdee'));
const NutritionMust = createLazyPage(() => import('../pages/NutritionMust'));
const NutritionNrs2002 = createLazyPage(() => import('../pages/NutritionNrs2002'));
const ConditionHub = createLazyPage(() => import('../pages/ConditionHub'));
const MdrdGfr = createLazyPage(() => import('../pages/MdrdGfr'));
const CkdEpiGfr = createLazyPage(() => import('../pages/CkdEpiGfr'));
const EmbedGallery = createLazyPage(() => import('../pages/EmbedGallery'));
const ForHospitals = createLazyPage(() => import('../pages/ForHospitals'));
const SpecialtyHub = createLazyPage(() => import('../pages/SpecialtyHub'));
const ParklandFormula = createLazyPage(() => import('../pages/ParklandFormula'));
const FenaCalculator = createLazyPage(() => import('../pages/FenaCalculator'));
const WintersFormula = createLazyPage(() => import('../pages/WintersFormula'));
const HasBledScore = createLazyPage(() => import('../pages/HasBledScore'));
const CiwaArScore = createLazyPage(() => import('../pages/CiwaArScore'));
const FreeWaterDeficit = createLazyPage(() => import('../pages/FreeWaterDeficit'));
const SodiumCorrection = createLazyPage(() => import('../pages/SodiumCorrection'));
const HeparinDosing = createLazyPage(() => import('../pages/HeparinDosing'));
const OpioidConversion = createLazyPage(() => import('../pages/OpioidConversion'));
const MaintenanceFluids = createLazyPage(() => import('../pages/MaintenanceFluids'));
const OsmolalGap = createLazyPage(() => import('../pages/OsmolalGap'));
const TimiScore = createLazyPage(() => import('../pages/TimiScore'));
const HeartScore = createLazyPage(() => import('../pages/HeartScore'));
const PercRule = createLazyPage(() => import('../pages/PercRule'));
const GenevaScore = createLazyPage(() => import('../pages/GenevaScore'));
const NihssScore = createLazyPage(() => import('../pages/NihssScore'));
const GraceScore = createLazyPage(() => import('../pages/GraceScore'));
const BicarbDeficit = createLazyPage(() => import('../pages/BicarbDeficit'));
const ReticIndex = createLazyPage(() => import('../pages/ReticIndex'));
const PhenytoinCorrection = createLazyPage(() => import('../pages/PhenytoinCorrection'));
const AscvdRisk = createLazyPage(() => import('../pages/AscvdRisk'));
const VancomycinDosing = createLazyPage(() => import('../pages/VancomycinDosing'));
const AminoglycosideDosing = createLazyPage(() => import('../pages/AminoglycosideDosing'));
const PesiScore = createLazyPage(() => import('../pages/PesiScore'));
const BovaScore = createLazyPage(() => import('../pages/BovaScore'));
const ApacheIIScore = createLazyPage(() => import('../pages/ApacheIIScore'));
const SapsIIScore = createLazyPage(() => import('../pages/SapsIIScore'));
const MedicalStatistics = createLazyPage(() => import('../pages/MedicalStatistics'));
const FavoritesPage = createLazyPage(() => import('../pages/FavoritesPage'));
const PricingPage = createLazyPage(() => import('../pages/PricingPage'));

const BishopScore = createLazyPage(() => import('../pages/BishopScore'));
const CentorScore = createLazyPage(() => import('../pages/CentorScore'));
const EditorialBoard = createLazyPage(() => import('../pages/EditorialBoard'));
const PediatricGcs = createLazyPage(() => import('../pages/PediatricGcs'));
const HollidaySegarFluids = createLazyPage(() => import('../pages/HollidaySegarFluids'));
const PediatricDosage = createLazyPage(() => import('../pages/PediatricDosage'));
const NaegeleEddCalculator = createLazyPage(() => import('../pages/NaegeleEddCalculator'));
const GestationalAgeCrl = createLazyPage(() => import('../pages/GestationalAgeCrl'));
const FourTsHitScore = createLazyPage(() => import('../pages/FourTsHitScore'));
const SynapseEnginePage = createLazyPage(() => import('../pages/SynapseEnginePage'));
const MasccRiskIndex = createLazyPage(() => import('../pages/MasccRiskIndex'));
const RumackMatthewNomogram = createLazyPage(() => import('../pages/RumackMatthewNomogram'));
const FraminghamRiskScore = createLazyPage(() => import('../pages/FraminghamRiskScore'));
const HfaPeffScore = createLazyPage(() => import('../pages/HfaPeffScore'));
const SchwartzGfr = createLazyPage(() => import('../pages/SchwartzGfr'));
const BradenScale = createLazyPage(() => import('../pages/BradenScale'));
const MorseFallScale = createLazyPage(() => import('../pages/MorseFallScale'));
const News2Score = createLazyPage(() => import('../pages/News2Score'));
const MewsScore = createLazyPage(() => import('../pages/MewsScore'));
const WongBakerFaces = createLazyPage(() => import('../pages/WongBakerFaces'));
const FlaccScore = createLazyPage(() => import('../pages/FlaccScore'));
const RassScore = createLazyPage(() => import('../pages/RassScore'));
const CamIcu = createLazyPage(() => import('../pages/CamIcu'));
const InsulinSlidingScale = createLazyPage(() => import('../pages/InsulinSlidingScale'));
const AscvdRiskScore = createLazyPage(() => import('../pages/AscvdRiskScore'));
const BenzoEquivalence = createLazyPage(() => import('../pages/BenzoEquivalence'));
const TpnMacronutrients = createLazyPage(() => import('../pages/TpnMacronutrients'));
const DigoxinDosing = createLazyPage(() => import('../pages/DigoxinDosing'));
const ProtamineReversal = createLazyPage(() => import('../pages/ProtamineReversal'));
const PhenytoinLoading = createLazyPage(() => import('../pages/PhenytoinLoading'));
const WarfarinDosing = createLazyPage(() => import('../pages/WarfarinDosing'));
const RcriScore = createLazyPage(() => import('../pages/RcriScore'));
const ApriScore = createLazyPage(() => import('../pages/ApriScore'));
const MeldNaScore = createLazyPage(() => import('../pages/MeldNaScore'));
const Curb65V2 = createLazyPage(() => import('../pages/Curb65'));
const SirsCriteriaV2 = createLazyPage(() => import('../pages/SirsCriteria'));
const QSofaScoreV2 = createLazyPage(() => import('../pages/QsofaScore'));
const AnionGapV2 = createLazyPage(() => import('../pages/AnionGap'));
const CorrectedCalciumV2 = createLazyPage(() => import('../pages/CorrectedCalcium'));
const FenaCalculatorV2 = createLazyPage(() => import('../pages/FenaCalculator'));
const NntCalculator = createLazyPage(() => import('../pages/NntCalculator'));
const SampleSizeCalculator = createLazyPage(() => import('../pages/SampleSizeCalculator'));
const OrToRrConverter = createLazyPage(() => import('../pages/OrToRrConverter'));
const FragilityIndex = createLazyPage(() => import('../pages/FragilityIndex'));

// Fast-Track 25 High-Yield Clinical Calculators
const AlvaradoScore = createLazyPage(() => import('../pages/AlvaradoScore'));
const RansonsCriteria = createLazyPage(() => import('../pages/RansonsCriteria'));
const BisapScore = createLazyPage(() => import('../pages/BisapScore'));
const GlasgowBlatchford = createLazyPage(() => import('../pages/GlasgowBlatchford'));
const OttawaRules = createLazyPage(() => import('../pages/OttawaRules'));
const Fib4Index = createLazyPage(() => import('../pages/Fib4Index'));
const SaagCalculator = createLazyPage(() => import('../pages/SaagCalculator'));
const MaddreysDf = createLazyPage(() => import('../pages/MaddreysDf'));
const LilleModel = createLazyPage(() => import('../pages/LilleModel'));
const FeUreaCalculator = createLazyPage(() => import('../pages/FeUreaCalculator'));
const DeltaDeltaCalculator = createLazyPage(() => import('../pages/DeltaDeltaCalculator'));
const SerumOsmolality = createLazyPage(() => import('../pages/SerumOsmolality'));
const UrineAnionGap = createLazyPage(() => import('../pages/UrineAnionGap'));
const Abcd2Score = createLazyPage(() => import('../pages/Abcd2Score'));
const Gad7Score = createLazyPage(() => import('../pages/Gad7Score'));
const ModifiedRankinScale = createLazyPage(() => import('../pages/ModifiedRankinScale'));
const CapriniScore = createLazyPage(() => import('../pages/CapriniScore'));
const MallampatiScore = createLazyPage(() => import('../pages/MallampatiScore'));
const CanadianCSpine = createLazyPage(() => import('../pages/CanadianCSpine'));
const AhaPreventRisk = createLazyPage(() => import('../pages/AhaPreventRisk'));
const DaptScore = createLazyPage(() => import('../pages/DaptScore'));
const NyhaClassification = createLazyPage(() => import('../pages/NyhaClassification'));
const PsiPortScore = createLazyPage(() => import('../pages/PsiPortScore'));
const EcogPerformance = createLazyPage(() => import('../pages/EcogPerformance'));
const PecarnHeadTrauma = createLazyPage(() => import('../pages/PecarnHeadTrauma'));

export const HomePage = safeLazy(() => import('../pages/HomePage'));
export const NotFound = safeLazy(() => import('../pages/NotFound'));

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
export const CONTENT_ROUTES = ['/about', '/editorial-board', '/comite-editorial', '/disclaimer', '/privacy', '/terms', '/embed-gallery', '/for-hospitals', '/synapse-engine'];

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
    if (error?.message?.includes('Failed to fetch dynamically imported module') || error?.message?.includes('Loading chunk')) {
      const hasReloaded = sessionStorage.getItem('cc_chunk_reload');
      if (!hasReloaded) {
        sessionStorage.setItem('cc_chunk_reload', 'true');
        window.location.reload();
      }
    }
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
  { path: '/wells-pe-score', nameEn: 'Wells PE Score', nameFr: 'Score de Wells EP', nameAr: 'نقاط ويلز للجلطة الرئوية', icon: AlertOctagon, tier: 2 },
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
  { path: '/bishop-score', nameEn: 'Bishop Score', nameFr: 'Score de Bishop', nameAr: 'مقياس بيشوب للولادة', icon: Activity, tier: 2 },
  { path: '/centor-score', nameEn: 'Centor Score', nameFr: 'Score de MacIsaac', nameAr: 'مقياس سينتور لالتهاب الحلق', icon: Activity, tier: 2 },
  { path: '/pediatric-gcs', nameEn: 'Pediatric GCS', nameFr: 'Glasgow Pédiatrique', nameAr: 'غلاسكو للأطفال', icon: Brain, tier: 1 },
  { path: '/holliday-segar-fluids', nameEn: 'Holliday-Segar Fluids', nameFr: 'Fluides Holliday-Segar', nameAr: 'سوائل الأطفال', icon: Droplet, tier: 1 },
  { path: '/pediatric-dosage', nameEn: 'Pediatric Dosage', nameFr: 'Dosage Pédiatrique', nameAr: 'جرعات الأطفال', icon: Pill, tier: 1 },
  { path: '/naegele-edd-calculator', nameEn: 'Naegele EDD Calculator', nameFr: 'Calculateur DPA Naegele', nameAr: 'حساب موعد الولادة', icon: HeartPulse, tier: 2 },
  { path: '/gestational-age-crl', nameEn: 'Gestational Age CRL', nameFr: 'Âge Gestationnel LCC', nameAr: 'عمر الحمل بالسونار', icon: Activity, tier: 2 },
  { path: '/four-ts-hit-score', nameEn: '4Ts HIT Score', nameFr: 'Score 4T TIH', nameAr: 'مقياس 4T للجلطات', icon: AlertOctagon, tier: 2 },
  { path: '/mascc-risk-index', nameEn: 'MASCC Risk Index', nameFr: 'Score MASCC Neutropénie', nameAr: 'مقياس ماسك للسرطان', icon: ShieldCheck, tier: 2 },
  { path: '/rumack-matthew-nomogram', nameEn: 'Rumack-Matthew Nomogram', nameFr: 'Nomogramme Rumack-Matthew', nameAr: 'تسمم الباراسيتامول', icon: AlertTriangle, tier: 1 },
  { path: '/framingham-risk-score', nameEn: 'Framingham Risk Score', nameFr: 'Score de Framingham', nameAr: 'مقياس فرامينغهام للقلب', icon: HeartPulse, tier: 2 },
  { path: '/hfa-peff-score', nameEn: 'HFA-PEFF Score', nameFr: 'Score HFA-PEFF ICFEP', nameAr: 'مقياس قصور القلب HFA-PEFF', icon: HeartPulse, tier: 2 },
  { path: '/schwartz-pediatric-gfr', nameEn: 'Schwartz Pediatric GFR', nameFr: 'DFG Pédiatrique Schwartz', nameAr: 'وظائف كلى الأطفال', icon: TestTube, tier: 2 },
  { path: '/braden-scale', nameEn: 'Braden Scale', nameFr: 'Échelle de Braden', nameAr: 'مقياس برادن للقرح السريرية', icon: HeartPulse, tier: 2 },
  { path: '/morse-fall-scale', nameEn: 'Morse Fall Scale', nameFr: 'Échelle de Chute Morse', nameAr: 'مقياس مورس للسقوط', icon: Activity, tier: 2 },
  { path: '/news2-score', nameEn: 'NEWS-2 Score', nameFr: 'Score NEWS-2', nameAr: 'مقياس NEWS-2 للطوارئ', icon: AlertOctagon, tier: 1 },
  { path: '/mews-score', nameEn: 'MEWS Score', nameFr: 'Score MEWS', nameAr: 'مقياس MEWS للطوارئ', icon: Activity, tier: 1 },
  { path: '/wong-baker-faces', nameEn: 'Wong-Baker FACES', nameFr: 'Échelle Wong-Baker', nameAr: 'مقياس وونغ-بيكر للألم', icon: Activity, tier: 3 },
  { path: '/flacc-score', nameEn: 'FLACC Pain Scale', nameFr: 'Échelle FLACC', nameAr: 'مقياس فلاك للألم', icon: Activity, tier: 3 },
  { path: '/rass-score', nameEn: 'RASS Score', nameFr: 'Score RASS', nameAr: 'مقياس ريتشموند (RASS)', icon: Activity, tier: 2 },
  { path: '/cam-icu', nameEn: 'CAM-ICU', nameFr: 'CAM-ICU', nameAr: 'مقياس CAM-ICU للهذيان', icon: Activity, tier: 2 },
  { path: '/insulin-sliding-scale', nameEn: 'Insulin Sliding Scale', nameFr: 'Échelle d\'Insuline', nameAr: 'مقياس الإنسولين المتدرج', icon: Activity, tier: 1 },

  // Tier 3: Infusions, Metrics & Pharmacology
  { path: '/ascvd-risk-score', nameEn: 'ASCVD Risk Estimator', nameFr: 'Évaluateur ASCVD', nameAr: 'مقياس خطر ASCVD', icon: HeartPulse, tier: 1 },
  { path: '/benzo-equivalence', nameEn: 'Benzodiazepine Equiv', nameFr: 'Équivalence Benzo', nameAr: 'مكافئ البنزوديازيبين', icon: ArrowRightLeft, tier: 2 },
  { path: '/tpn-macronutrients', nameEn: 'TPN Macronutrients', nameFr: 'Macronutriments NPT', nameAr: 'مغذيات التغذية الوريدية', icon: LayoutDashboard, tier: 3 },
  { path: '/digoxin-dosing', nameEn: 'Digoxin Dosing', nameFr: 'Dose de Digoxine', nameAr: 'جرعة الديجوكسين', icon: HeartPulse, tier: 2 },
  { path: '/protamine-reversal', nameEn: 'Protamine Reversal', nameFr: 'Inversion Protamine', nameAr: 'معاكسة البروتامين', icon: ShieldAlert, tier: 2 },
  { path: '/phenytoin-loading', nameEn: 'Phenytoin Loading', nameFr: 'Charge Phénytoïne', nameAr: 'جرعة الفينيتوين', icon: Syringe, tier: 2 },
  { path: '/warfarin-dosing', nameEn: 'Warfarin Dosing', nameFr: 'Ajustement Warfarine', nameAr: 'جرعة الوارفارين', icon: Activity, tier: 2 },
  { path: '/rcri-score', nameEn: 'RCRI Score', nameFr: 'Score RCRI', nameAr: 'مؤشر الخطر القلبي', icon: HeartPulse, tier: 2 },
  { path: '/apri-score', nameEn: 'APRI Score', nameFr: 'Score APRI', nameAr: 'مؤشر تليف الكبد', icon: Droplet, tier: 2 },
  { path: '/meld-na-score', nameEn: 'MELD-Na Score', nameFr: 'Score MELD-Na', nameAr: 'مؤشر وظائف الكبد', icon: Activity, tier: 2 },
  { path: '/curb-65', nameEn: 'CURB-65', nameFr: 'CURB-65', nameAr: 'مقياس الالتهاب الرئوي', icon: Wind, tier: 2 },
  { path: '/sirs-criteria', nameEn: 'SIRS Criteria', nameFr: 'Critères SIRS', nameAr: 'معايير SIRS', icon: Thermometer, tier: 2 },
  { path: '/qsofa-score', nameEn: 'qSOFA Score', nameFr: 'Score qSOFA', nameAr: 'مقياس qSOFA', icon: AlertTriangle, tier: 2 },
  { path: '/anion-gap', nameEn: 'Anion Gap', nameFr: 'Trou Anionique', nameAr: 'الفجوة الأنيونية', icon: Activity, tier: 2 },
  { path: '/corrected-calcium', nameEn: 'Corrected Calcium', nameFr: 'Calcium Corrigé', nameAr: 'الكالسيوم المصحح', icon: FlaskConical, tier: 2 },
  { path: '/fena-calculator', nameEn: 'FeNa Calculator', nameFr: 'Calculateur FeNa', nameAr: 'حاسبة FeNa', icon: Droplet, tier: 2 },
  { path: '/nnt-calculator', nameEn: 'Number Needed to Treat (NNT)', nameFr: 'Nombre Nécessaire à Traiter', nameAr: 'العدد المطلوب للعلاج', icon: Calculator, tier: 3 },
  { path: '/sample-size-calculator', nameEn: 'Sample Size Calculator', nameFr: 'Calculateur Taille Échantillon', nameAr: 'حاسبة حجم العينة', icon: Calculator, tier: 3 },
  { path: '/or-to-rr', nameEn: 'OR to RR Converter', nameFr: 'Convertisseur RC en RR', nameAr: 'محول OR إلى RR', icon: ArrowRightLeft, tier: 3 },
  { path: '/fragility-index', nameEn: 'Fragility Index', nameFr: 'Indice de Fragilité', nameAr: 'مؤشر الهشاشة', icon: ShieldAlert, tier: 3 },
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
  
  // Fast-Track 25 Clinical Calculators
  { path: '/alvarado-score', nameEn: 'Alvarado Score Appendicitis', nameFr: "Score d'Alvarado Appendicite", nameAr: 'مقياس ألفارادو لالتهاب الزائدة', icon: Activity, tier: 1 },
  { path: '/ransons-criteria', nameEn: "Ranson's Criteria Pancreatitis", nameFr: 'Critères de Ranson Pancréatite', nameAr: 'معايير رانسون لالتهاب البنكرياس', icon: AlertTriangle, tier: 1 },
  { path: '/bisap-score', nameEn: 'BISAP Score Pancreatitis', nameFr: 'Score BISAP Pancréatite', nameAr: 'مقياس بيساب للبنكرياس', icon: Activity, tier: 1 },
  { path: '/glasgow-blatchford', nameEn: 'Glasgow-Blatchford Bleed', nameFr: 'Score de Glasgow-Blatchford', nameAr: 'مقياس غلاسكو بلاتشفورد للنزيف', icon: Droplet, tier: 1 },
  { path: '/ottawa-rules', nameEn: 'Ottawa Ankle & Knee Rules', nameFr: "Règles d'Ottawa Cheville & Genou", nameAr: 'قواعد أوتاوا للكسور', icon: ShieldCheck, tier: 1 },
  { path: '/fib4-index', nameEn: 'FIB-4 Liver Fibrosis Index', nameFr: 'Indice FIB-4 Fibrose Hépatique', nameAr: 'مؤشر فيب-4 لتليف الكبد', icon: Activity, tier: 2 },
  { path: '/saag-calculator', nameEn: 'SAAG Ascites Albumin Gradient', nameFr: 'Gradient SAAG Ascite', nameAr: 'مدروج ألبومين المصل والحبن SAAG', icon: TestTube, tier: 2 },
  { path: '/maddreys-df', nameEn: "Maddrey's Discriminant Function", nameFr: 'Score de Maddrey Hépatite', nameAr: 'معامل مادري لالتهاب الكبد الكحولي', icon: Pill, tier: 2 },
  { path: '/lille-model', nameEn: 'Lille Model Alcoholic Hepatitis', nameFr: 'Modèle de Lille Hépatite', nameAr: 'نموذج ليل للاستجابة للكورتيزون', icon: Pill, tier: 2 },
  { path: '/feurea-calculator', nameEn: 'FEUrea Fractional Excretion', nameFr: "FEUrée Fraction d'Excrétion", nameAr: 'الكسر المفرغ من اليوريا FEUrea', icon: Droplet, tier: 2 },
  { path: '/delta-delta', nameEn: 'Delta-Delta & Delta Ratio', nameFr: 'Delta-Delta & Ratio Delta', nameAr: 'حاسبة دلتا-دلتا والنسبة الفجوية', icon: Activity, tier: 2 },
  { path: '/serum-osmolality', nameEn: 'Serum Osmolality & Osmolar Gap', nameFr: 'Osmolalité & Trou Osmolaire', nameAr: 'الحلولية المصلية والفجوة الحلولية', icon: TestTube, tier: 2 },
  { path: '/urine-anion-gap', nameEn: 'Urine Anion Gap (UAG)', nameFr: 'Trou Anionique Urinaire (TAU)', nameAr: 'الفجوة الأنيونية البولية', icon: Droplet, tier: 2 },
  { path: '/abcd2-score', nameEn: 'ABCD² Score for TIA Stroke Risk', nameFr: 'Score ABCD² Risque AVC post-AIT', nameAr: 'مقياس ABCD² لخطر السكتة', icon: Brain, tier: 1 },
  { path: '/gad7-score', nameEn: 'GAD-7 Anxiety Scale', nameFr: 'Échelle GAD-7 Anxiété', nameAr: 'مقياس القلق GAD-7', icon: HeartPulse, tier: 3 },
  { path: '/modified-rankin-scale', nameEn: 'Modified Rankin Scale (mRS)', nameFr: 'Échelle de Rankin Modifiée', nameAr: 'مقياس رانكين المعدل mRS', icon: Award, tier: 3 },
  { path: '/caprini-score', nameEn: 'Caprini VTE Risk Score', nameFr: 'Score de Caprini Risque MTEV', nameAr: 'مقياس كابريني للجلطات الجراحية', icon: ShieldAlert, tier: 2 },
  { path: '/mallampati-score', nameEn: 'Mallampati Airway Score', nameFr: 'Classification de Mallampati', nameAr: 'تصنيف مالمباتي للمجرى التنفسي', icon: Activity, tier: 1 },
  { path: '/canadian-c-spine', nameEn: 'Canadian C-Spine Rule', nameFr: 'Règle Canadienne Rachis Cervical', nameAr: 'قاعدة العمود الفقري العنقي الكندية', icon: ShieldCheck, tier: 1 },
  { path: '/aha-prevent-risk', nameEn: 'AHA PREVENT™ 10-Year CVD Risk', nameFr: 'Score AHA PREVENT Risque CV', nameAr: 'حاسبة مخاطر القلب AHA PREVENT', icon: HeartPulse, tier: 2 },
  { path: '/dapt-score', nameEn: 'DAPT Score Post-PCI', nameFr: 'Score DAPT Post-Angioplastie', nameAr: 'نقاط DAPT لتحديد مدة مضادات الصفائح', icon: HeartPulse, tier: 2 },
  { path: '/nyha-classification', nameEn: 'NYHA Heart Failure Class', nameFr: 'Classification NYHA Insuffisance Cardiaque', nameAr: 'تصنيف NYHA لقصور القلب', icon: HeartPulse, tier: 2 },
  { path: '/psi-port-score', nameEn: 'PSI / PORT Pneumonia Score', nameFr: 'Score PSI / PORT Pneumonie', nameAr: 'مؤشر شدة الالتهاب الرئوي PSI', icon: Wind, tier: 1 },
  { path: '/ecog-performance', nameEn: 'ECOG Performance Status', nameFr: 'Score de Performance ECOG OMS', nameAr: 'مقياس الأداء الوظيفي ECOG', icon: Activity, tier: 3 },
  { path: '/pecarn-head-trauma', nameEn: 'PECARN Pediatric Head Trauma', nameFr: 'Règle PECARN Traumatisme Crânien', nameAr: 'قاعدة بيكارن لإصابات الرأس لدى الأطفال', icon: Brain, tier: 1 },

  { path: '/medical-statistics', nameEn: 'Medical Statistics', nameFr: 'Statistiques Médicales', nameAr: 'الإحصاء الطبي', icon: Layers, tier: 3 },
  { path: '/synapse-engine', nameEn: 'Synapse Engine (Guidelines)', nameFr: 'Moteur Synapse (Recommandations)', nameAr: 'محرك الإرشادات الطبية', icon: Sparkles, tier: 0 },
];

export const TIER_HEADERS: Record<number, Record<LangCode, string>> = {
  1: {
    en: 'Emergency & Critical Care',
    fr: 'Urgences & Soins Critiques',
    es: 'Urgencias y Cuidados Críticos',
    ar: 'الطوارئ والرعاية الحرجة'
  },
  2: {
    en: 'Metabolic & Cardiorenal',
    fr: 'Métabolique & Cardiorénal',
    es: 'Metabólico y Cardiorrenal',
    ar: 'الاضطرابات الأيضية والقلبية الكلوية'
  },
  3: {
    en: 'Therapeutic & Dosing Metrics',
    fr: 'Métriques, Perfusions & Doses',
    es: 'Métricas Terapéuticas y Dosificación',
    ar: 'الجرعات العلاجية والمقاييس الدوائية'
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
      <Route path="wells-pe-score" element={wrapCalculator('/wells-pe-score', <WellsPeScore lang={lang} />)} />
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
      <Route path="medical-statistics" element={wrapCalculator('/medical-statistics', <MedicalStatistics lang={lang} />)} />

      <Route path="nutrition-tdee" element={wrapCalculator('/nutrition-tdee', <NutritionTdee lang={lang} />)} />
      <Route path="nutrition-must" element={wrapCalculator('/nutrition-must', <NutritionMust lang={lang} />)} />
      <Route path="nutrition-nrs2002" element={wrapCalculator('/nutrition-nrs2002', <NutritionNrs2002 lang={lang} />)} />
      <Route path="synapse-engine" element={<SynapseEnginePage lang={lang} langPath={langPath} />} />
      <Route path="about" element={<About lang={lang} />} />
      <Route path="editorial-board" element={<EditorialBoard lang={lang} />} />
      <Route path="comite-editorial" element={<EditorialBoard lang={lang} />} />
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

      <Route path="bishop-score" element={wrapCalculator('/bishop-score', <BishopScore lang={lang} />)} />
      <Route path="centor-score" element={wrapCalculator('/centor-score', <CentorScore lang={lang} />)} />
      <Route path="pediatric-gcs" element={wrapCalculator('/pediatric-gcs', <PediatricGcs lang={lang} />)} />
      <Route path="holliday-segar-fluids" element={wrapCalculator('/holliday-segar-fluids', <HollidaySegarFluids lang={lang} />)} />
      <Route path="pediatric-dosage" element={wrapCalculator('/pediatric-dosage', <PediatricDosage lang={lang} />)} />
      <Route path="naegele-edd-calculator" element={wrapCalculator('/naegele-edd-calculator', <NaegeleEddCalculator lang={lang} />)} />
      <Route path="gestational-age-crl" element={wrapCalculator('/gestational-age-crl', <GestationalAgeCrl lang={lang} />)} />
      <Route path="four-ts-hit-score" element={wrapCalculator('/four-ts-hit-score', <FourTsHitScore lang={lang} />)} />
      <Route path="mascc-risk-index" element={wrapCalculator('/mascc-risk-index', <MasccRiskIndex lang={lang} />)} />
      <Route path="rumack-matthew-nomogram" element={wrapCalculator('/rumack-matthew-nomogram', <RumackMatthewNomogram lang={lang} />)} />
      <Route path="framingham-risk-score" element={wrapCalculator('/framingham-risk-score', <FraminghamRiskScore lang={lang} />)} />
      <Route path="hfa-peff-score" element={wrapCalculator('/hfa-peff-score', <HfaPeffScore lang={lang} />)} />
      <Route path="schwartz-pediatric-gfr" element={wrapCalculator('/schwartz-pediatric-gfr', <SchwartzGfr lang={lang} />)} />
      <Route path="braden-scale" element={wrapCalculator('/braden-scale', <BradenScale lang={lang} />)} />
      <Route path="morse-fall-scale" element={wrapCalculator('/morse-fall-scale', <MorseFallScale lang={lang} />)} />
      <Route path="news2-score" element={wrapCalculator('/news2-score', <News2Score lang={lang} />)} />
      <Route path="mews-score" element={wrapCalculator('/mews-score', <MewsScore lang={lang} />)} />
      <Route path="wong-baker-faces" element={wrapCalculator('/wong-baker-faces', <WongBakerFaces lang={lang} />)} />
      <Route path="flacc-score" element={wrapCalculator('/flacc-score', <FlaccScore lang={lang} />)} />
      <Route path="rass-score" element={wrapCalculator('/rass-score', <RassScore lang={lang} />)} />
      <Route path="cam-icu" element={wrapCalculator('/cam-icu', <CamIcu lang={lang} />)} />
      <Route path="insulin-sliding-scale" element={wrapCalculator('/insulin-sliding-scale', <InsulinSlidingScale lang={lang} />)} />
      <Route path="ascvd-risk-score" element={wrapCalculator('/ascvd-risk-score', <AscvdRiskScore lang={lang} />)} />
      <Route path="benzo-equivalence" element={wrapCalculator('/benzo-equivalence', <BenzoEquivalence lang={lang} />)} />
      <Route path="tpn-macronutrients" element={wrapCalculator('/tpn-macronutrients', <TpnMacronutrients lang={lang} />)} />
      <Route path="digoxin-dosing" element={wrapCalculator('/digoxin-dosing', <DigoxinDosing lang={lang} />)} />
      <Route path="protamine-reversal" element={wrapCalculator('/protamine-reversal', <ProtamineReversal lang={lang} />)} />
      <Route path="phenytoin-loading" element={wrapCalculator('/phenytoin-loading', <PhenytoinLoading lang={lang} />)} />
      <Route path="warfarin-dosing" element={wrapCalculator('/warfarin-dosing', <WarfarinDosing lang={lang} />)} />
      <Route path="rcri-score" element={wrapCalculator('/rcri-score', <RcriScore lang={lang} />)} />
      <Route path="apri-score" element={wrapCalculator('/apri-score', <ApriScore lang={lang} />)} />
      <Route path="meld-na-score" element={wrapCalculator('/meld-na-score', <MeldNaScore lang={lang} />)} />
      <Route path="curb-65" element={wrapCalculator('/curb-65', <Curb65V2 lang={lang} />)} />
      <Route path="sirs-criteria" element={wrapCalculator('/sirs-criteria', <SirsCriteriaV2 lang={lang} />)} />
      <Route path="qsofa-score" element={wrapCalculator('/qsofa-score', <QSofaScoreV2 lang={lang} />)} />
      <Route path="anion-gap" element={wrapCalculator('/anion-gap', <AnionGapV2 lang={lang} />)} />
      <Route path="corrected-calcium" element={wrapCalculator('/corrected-calcium', <CorrectedCalciumV2 lang={lang} />)} />
      <Route path="fena-calculator" element={wrapCalculator('/fena-calculator', <FenaCalculatorV2 lang={lang} />)} />
      <Route path="nnt-calculator" element={wrapCalculator('/nnt-calculator', <NntCalculator lang={lang} />)} />
      <Route path="sample-size-calculator" element={wrapCalculator('/sample-size-calculator', <SampleSizeCalculator lang={lang} />)} />
      <Route path="or-to-rr" element={wrapCalculator('/or-to-rr', <OrToRrConverter lang={lang} />)} />
      <Route path="fragility-index" element={wrapCalculator('/fragility-index', <FragilityIndex lang={lang} />)} />

      {/* Fast-Track 25 High-Yield Clinical Calculators */}
      <Route path="alvarado-score" element={wrapCalculator('/alvarado-score', <AlvaradoScore lang={lang} />)} />
      <Route path="ransons-criteria" element={wrapCalculator('/ransons-criteria', <RansonsCriteria lang={lang} />)} />
      <Route path="bisap-score" element={wrapCalculator('/bisap-score', <BisapScore lang={lang} />)} />
      <Route path="glasgow-blatchford" element={wrapCalculator('/glasgow-blatchford', <GlasgowBlatchford lang={lang} />)} />
      <Route path="ottawa-rules" element={wrapCalculator('/ottawa-rules', <OttawaRules lang={lang} />)} />
      <Route path="fib4-index" element={wrapCalculator('/fib4-index', <Fib4Index lang={lang} />)} />
      <Route path="saag-calculator" element={wrapCalculator('/saag-calculator', <SaagCalculator lang={lang} />)} />
      <Route path="maddreys-df" element={wrapCalculator('/maddreys-df', <MaddreysDf lang={lang} />)} />
      <Route path="lille-model" element={wrapCalculator('/lille-model', <LilleModel lang={lang} />)} />
      <Route path="feurea-calculator" element={wrapCalculator('/feurea-calculator', <FeUreaCalculator lang={lang} />)} />
      <Route path="delta-delta" element={wrapCalculator('/delta-delta', <DeltaDeltaCalculator lang={lang} />)} />
      <Route path="serum-osmolality" element={wrapCalculator('/serum-osmolality', <SerumOsmolality lang={lang} />)} />
      <Route path="urine-anion-gap" element={wrapCalculator('/urine-anion-gap', <UrineAnionGap lang={lang} />)} />
      <Route path="abcd2-score" element={wrapCalculator('/abcd2-score', <Abcd2Score lang={lang} />)} />
      <Route path="gad7-score" element={wrapCalculator('/gad7-score', <Gad7Score lang={lang} />)} />
      <Route path="modified-rankin-scale" element={wrapCalculator('/modified-rankin-scale', <ModifiedRankinScale lang={lang} />)} />
      <Route path="caprini-score" element={wrapCalculator('/caprini-score', <CapriniScore lang={lang} />)} />
      <Route path="mallampati-score" element={wrapCalculator('/mallampati-score', <MallampatiScore lang={lang} />)} />
      <Route path="canadian-c-spine" element={wrapCalculator('/canadian-c-spine', <CanadianCSpine lang={lang} />)} />
      <Route path="aha-prevent-risk" element={wrapCalculator('/aha-prevent-risk', <AhaPreventRisk lang={lang} />)} />
      <Route path="dapt-score" element={wrapCalculator('/dapt-score', <DaptScore lang={lang} />)} />
      <Route path="nyha-classification" element={wrapCalculator('/nyha-classification', <NyhaClassification lang={lang} />)} />
      <Route path="psi-port-score" element={wrapCalculator('/psi-port-score', <PsiPortScore lang={lang} />)} />
      <Route path="ecog-performance" element={wrapCalculator('/ecog-performance', <EcogPerformance lang={lang} />)} />
      <Route path="pecarn-head-trauma" element={wrapCalculator('/pecarn-head-trauma', <PecarnHeadTrauma lang={lang} />)} />
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
