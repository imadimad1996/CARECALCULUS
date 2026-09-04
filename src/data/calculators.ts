import { 
  LucideIcon, AlertOctagon, HeartPulse, Activity, AlertTriangle, Stethoscope, Wind, TestTube, Brain, Droplet, Pill, ShieldCheck, ArrowRightLeft, LayoutDashboard, BookOpen, Globe, ShieldAlert, Syringe, FlaskConical, Calculator, Layers, Sparkles, FileText 
} from 'lucide-react';

export interface CalculatorMeta {
  id: string;
  title: { en: string; fr: string; es?: string; ar?: string };
  category: { en: string; fr: string; es?: string; ar?: string };
  path: string;
  keywords: string[];
  specialties: string[];
  icon: LucideIcon;
  isFeatured?: boolean;
}

export const ALL_CALCULATORS: CalculatorMeta[] = [
  {
    id: 'wells',
    title: {"en":"Wells' Criteria for DVT","fr":"Score de Wells pour TVP"},
    category: {"en":"Emergency & Critical Care","fr":"Urgences & Soins Intensifs"},
    path: '/wells-score',
    keywords: ["dvt","thrombosis","wells","tvp","embolism"],
    specialties: ["pulmonology","cardiology"],
    icon: AlertOctagon,
    isFeatured: true
  },
  {
    id: 'wells-pe',
    title: {"en":"Wells' Criteria for PE","fr":"Score de Wells pour EP"},
    category: {"en":"Emergency & Critical Care","fr":"Urgences & Soins Intensifs"},
    path: '/wells-pe-score',
    keywords: ["pe","pulmonary embolism","wells","ep","embolie"],
    specialties: ["pulmonology","cardiology"],
    icon: AlertOctagon,
    isFeatured: true
  },
  {
    id: 'heart',
    title: {"en":"HEART Score for Chest Pain","fr":"Score HEART Douleur Thoracique"},
    category: {"en":"Emergency & Critical Care","fr":"Urgences & Soins Intensifs"},
    path: '/heart-score',
    keywords: ["heart","chest pain","acs","mace","douleur thoracique","stemi","nstemi","troponin"],
    specialties: ["emergency","cardiology"],
    icon: HeartPulse,
    isFeatured: false
  },
  {
    id: 'grace',
    title: {"en":"GRACE Score for ACS Risk","fr":"Score de GRACE (SCA)"},
    category: {"en":"Cardiology","fr":"Cardiologie"},
    path: '/grace-score',
    keywords: ["grace","acs","stemi","nstemi","mortality","coronary","sca"],
    specialties: ["cardiology"],
    icon: HeartPulse,
    isFeatured: false
  },
  {
    id: 'sofa',
    title: {"en":"SOFA Score (Sepsis)","fr":"Score SOFA (Sepsis)"},
    category: {"en":"Emergency & Critical Care","fr":"Urgences & Soins Intensifs"},
    path: '/sofa-score',
    keywords: ["sofa","sepsis","organ failure","icu","rea"],
    specialties: ["emergency"],
    icon: Activity,
    isFeatured: false
  },
  {
    id: 'qsofa',
    title: {"en":"qSOFA Score (Quick Sepsis)","fr":"Score qSOFA Sepsis Rapide"},
    category: {"en":"Emergency & Critical Care","fr":"Urgences & Soins Intensifs"},
    path: '/qsofa-score',
    keywords: ["qsofa","sepsis","quick sofa","emergency"],
    specialties: ["emergency"],
    icon: AlertTriangle,
    isFeatured: true
  },
  {
    id: 'curb65',
    title: {"en":"CURB-65 Pneumonia Severity","fr":"Score CURB-65 Pneumopathie"},
    category: {"en":"Pulmonology","fr":"Pneumologie"},
    path: '/curb65-score',
    keywords: ["curb65","curb-65","pneumonia","pulmonary","pneumopathie"],
    specialties: ["pulmonology","emergency"],
    icon: Stethoscope,
    isFeatured: true
  },
  {
    id: 'map',
    title: {"en":"Mean Arterial Pressure (MAP)","fr":"Pression Artérielle Moyenne (PAM)"},
    category: {"en":"Cardiology","fr":"Cardiologie"},
    path: '/map-calculator',
    keywords: ["map","pam","pressure","arterial","pression"],
    specialties: ["cardiology","emergency"],
    icon: Activity,
    isFeatured: true
  },
  {
    id: 'pf',
    title: {"en":"P/F Ratio (PaO2/FiO2)","fr":"Rapport P/F (PaO2/FiO2)"},
    category: {"en":"Pulmonology","fr":"Pneumologie"},
    path: '/pf-ratio',
    keywords: ["pf ratio","pao2","fio2","ards","sdra"],
    specialties: ["pulmonology","emergency"],
    icon: Wind,
    isFeatured: true
  },
  {
    id: 'anc',
    title: {"en":"Absolute Neutrophil Count (ANC)","fr":"PNN - Polynucléaires Neutrophiles"},
    category: {"en":"Hematology & Oncology","fr":"Hématologie & Oncologie"},
    path: '/anc-calculator',
    keywords: ["anc","neutrophil","pnn","neutropenia","oncology"],
    specialties: ["hematology"],
    icon: TestTube,
    isFeatured: false
  },
  {
    id: 'gcs',
    title: {"en":"Glasgow Coma Scale (GCS)","fr":"Échelle de Glasgow (GCS)"},
    category: {"en":"Neurology & ICU","fr":"Neurologie & Réanimation"},
    path: '/glasgow-coma-scale',
    keywords: ["gcs","glasgow","coma","neuro","brain"],
    specialties: ["neuro","emergency"],
    icon: Brain,
    isFeatured: true
  },
  {
    id: 'creat',
    title: {"en":"Cockcroft-Gault Creatinine Clearance","fr":"Clairance de la Créatinine"},
    category: {"en":"Nephrology","fr":"Néphrologie"},
    path: '/creatinine-clearance',
    keywords: ["cockcroft","creatinine","gfr","dfg","kidney","renal"],
    specialties: ["nephrology"],
    icon: TestTube,
    isFeatured: true
  },
  {
    id: 'meld',
    title: {"en":"MELD & MELD-Na Score","fr":"Score MELD (Hépatologie)"},
    category: {"en":"Gastroenterology","fr":"Gastro-entérologie"},
    path: '/meld-score',
    keywords: ["meld","liver","cirrhosis","hepatology","foie"],
    specialties: ["gastro"],
    icon: Activity,
    isFeatured: true
  },
  {
    id: 'cha2ds2',
    title: {"en":"CHA₂DS₂-VASc Score","fr":"Score CHA₂DS₂-VASc"},
    category: {"en":"Cardiology","fr":"Cardiologie"},
    path: '/cha2ds2-vasc',
    keywords: ["cha2ds2","afib","stroke","anticoagulation","fa"],
    specialties: ["cardiology"],
    icon: HeartPulse,
    isFeatured: true
  },
  {
    id: 'hasbled',
    title: {"en":"HAS-BLED Bleeding Risk","fr":"Score HAS-BLED Risque Hémorragique"},
    category: {"en":"Cardiology","fr":"Cardiologie"},
    path: '/has-bled-score',
    keywords: ["hasbled","bleeding","hemorrhage","anticoagulation"],
    specialties: ["cardiology"],
    icon: Activity,
    isFeatured: false
  },
  {
    id: 'sirs',
    title: {"en":"SIRS Criteria","fr":"Critères du SIRS"},
    category: {"en":"Emergency & Critical Care","fr":"Urgences & Soins Intensifs"},
    path: '/sirs-criteria',
    keywords: ["sirs","inflammation","sepsis","fever"],
    specialties: ["emergency"],
    icon: Activity,
    isFeatured: false
  },
  {
    id: 'pgcs',
    title: {"en":"Pediatric Glasgow Coma Scale (pGCS)","fr":"Échelle de Glasgow Pédiatrique (pGCS)"},
    category: {"en":"Pediatrics","fr":"Pédiatrie"},
    path: '/pediatric-gcs',
    keywords: ["pediatric gcs","pgcs","pediatric glasgow","infant gcs","child gcs"],
    specialties: ["pediatrics","emergency"],
    icon: Brain,
    isFeatured: true
  },
  {
    id: 'holliday',
    title: {"en":"Holliday-Segar Pediatric Fluids (4-2-1)","fr":"Fluides Pédiatriques Holliday-Segar (4-2-1)"},
    category: {"en":"Pediatrics","fr":"Pédiatrie"},
    path: '/holliday-segar-fluids',
    keywords: ["holliday segar","4-2-1 rule","pediatric fluids","maintenance fluids"],
    specialties: ["pediatrics"],
    icon: Droplet,
    isFeatured: true
  },
  {
    id: 'peds-dose',
    title: {"en":"Pediatric Weight & BSA Dosage","fr":"Calculateur de Posologie Pédiatrique"},
    category: {"en":"Pediatrics & Pharmacology","fr":"Pédiatrie & Pharmacologie"},
    path: '/pediatric-dosage',
    keywords: ["pediatric dosage","mg kg dose","bsa calculator","child dosing"],
    specialties: ["pediatrics","pharmaco"],
    icon: Pill,
    isFeatured: true
  },
  {
    id: 'naegele',
    title: {"en":"Naegele's Rule EDD Calculator","fr":"Calculateur de Terme (Naegele)"},
    category: {"en":"Obstetrics & Gynecology","fr":"Obstétrique & Gynécologie"},
    path: '/naegele-edd-calculator',
    keywords: ["naegele","edd","due date","gestational age","lmp","dpa","ddr"],
    specialties: ["obgyn"],
    icon: HeartPulse,
    isFeatured: true
  },
  {
    id: 'crl',
    title: {"en":"Gestational Age from CRL","fr":"Âge Gestationnel par LCC / CRL"},
    category: {"en":"Obstetrics & Gynecology","fr":"Obstétrique & Gynécologie"},
    path: '/gestational-age-crl',
    keywords: ["crl","lcc","ultrasound dating","crown rump length","1st trimester"],
    specialties: ["obgyn"],
    icon: Activity,
    isFeatured: true
  },
  {
    id: 'fourts',
    title: {"en":"4Ts Score for HIT","fr":"Score des 4T pour la TIH"},
    category: {"en":"Hematology & Critical Care","fr":"Hématologie & Soins Intensifs"},
    path: '/four-ts-hit-score',
    keywords: ["4ts hit","heparin induced thrombocytopenia","tih","heparin"],
    specialties: ["hematology","emergency"],
    icon: AlertOctagon,
    isFeatured: true
  },
  {
    id: 'mascc',
    title: {"en":"MASCC Risk Index (Febrile Neutropenia)","fr":"Score MASCC Neutropénie Fébrile"},
    category: {"en":"Hematology & Oncology","fr":"Hématologie & Oncologie"},
    path: '/mascc-risk-index',
    keywords: ["mascc","febrile neutropenia","neutropenie febrile","cancer risk"],
    specialties: ["hematology"],
    icon: ShieldCheck,
    isFeatured: true
  },
  {
    id: 'rumack',
    title: {"en":"Rumack-Matthew Nomogram (Paracetamol)","fr":"Nomogramme Rumack-Matthew (Paracétamol)"},
    category: {"en":"Toxicology & Emergency","fr":"Toxicologie & Urgences"},
    path: '/rumack-matthew-nomogram',
    keywords: ["rumack matthew","paracetamol","acetaminophen","toxicity","nac"],
    specialties: ["toxicology","emergency"],
    icon: AlertTriangle,
    isFeatured: true
  },
  {
    id: 'framingham',
    title: {"en":"Framingham 10-Yr CVD Risk Score","fr":"Score de Risque Framingham (10 ans)"},
    category: {"en":"Cardiology","fr":"Cardiologie"},
    path: '/framingham-risk-score',
    keywords: ["framingham","cvd risk","coronary risk","heart risk","cardiovascular"],
    specialties: ["cardiology"],
    icon: HeartPulse,
    isFeatured: true
  },
  {
    id: 'hfapeff',
    title: {"en":"HFA-PEFF Score (HFpEF Diagnosis)","fr":"Score HFA-PEFF (Diagnostic ICFEP)"},
    category: {"en":"Cardiology","fr":"Cardiologie"},
    path: '/hfa-peff-score',
    keywords: ["hfa peff","hfpeff","heart failure","preserved ejection fraction","icfep"],
    specialties: ["cardiology"],
    icon: HeartPulse,
    isFeatured: true
  },
  {
    id: 'schwartz',
    title: {"en":"Bedside Schwartz Pediatric eGFR","fr":"Formule de Schwartz Pédiatrique (DFG)"},
    category: {"en":"Nephrology & Pediatrics","fr":"Néphrologie & Pédiatrie"},
    path: '/schwartz-pediatric-gfr',
    keywords: ["schwartz egfr","pediatric gfr","schwartz formula","child kidney"],
    specialties: ["nephrology","pediatrics"],
    icon: TestTube,
    isFeatured: true
  },
  {
    id: 'tdee',
    title: {"en":"Nutrition TDEE","fr":"Nutrition TDEE"},
    category: {"en":"Nutrition","fr":"Nutrition"},
    path: '/nutrition-tdee',
    keywords: ["tdee","calories","energy","nutrition"],
    specialties: ["nutrition"],
    icon: Activity,
    isFeatured: true
  },
  {
    id: 'must',
    title: {"en":"MUST Score","fr":"Score MUST"},
    category: {"en":"Nutrition","fr":"Nutrition"},
    path: '/nutrition-must',
    keywords: ["must","malnutrition","screening","nutrition"],
    specialties: ["nutrition"],
    icon: Activity,
    isFeatured: true
  },
  {
    id: 'iv',
    title: {"en":"IV Drip Rate","fr":"Débit Perfusion"},
    category: {"en":"Pharmacology","fr":"Pharmacologie"},
    path: '/drip-rate-calculator',
    keywords: ["iv","drip","infusion","drops","rate"],
    specialties: ["pharmaco","emergency"],
    icon: Droplet,
    isFeatured: true
  },
  {
    id: 'steroid',
    title: {"en":"Steroid Conversion","fr":"Équivalences Stéroïdes"},
    category: {"en":"Pharmacology","fr":"Pharmacologie"},
    path: '/steroid-conversion',
    keywords: ["steroid","corticosteroid","conversion","prednisone"],
    specialties: ["pharmaco"],
    icon: ArrowRightLeft,
    isFeatured: true
  },
  {
    id: 'ibw',
    title: {"en":"IBW & ABW","fr":"Poids Idéal"},
    category: {"en":"Nutrition & Pharmacology","fr":"Nutrition & Pharmacologie"},
    path: '/adjusted-body-weight',
    keywords: ["ibw","abw","ideal body weight","adjusted body weight","dosing"],
    specialties: ["nutrition","pharmaco"],
    icon: LayoutDashboard,
    isFeatured: true
  },
  {
    id: 'unit',
    title: {"en":"Unit Conversions","fr":"Conversions d'Unités"},
    category: {"en":"Pharmacology","fr":"Pharmacologie"},
    path: '/medical-conversions',
    keywords: ["unit","conversion","metric","imperial","weight","temperature"],
    specialties: ["pharmaco"],
    icon: ArrowRightLeft,
    isFeatured: true
  },

  {
    id: 'parkland-formula',
    title: {"en":"Parkland Burn Fluid","fr":"Formule de Parkland Brûlure","ar":"معادلة باركلاند للحروق"},
    category: {"en":"Emergency & Critical Care","fr":"Urgences & Soins Intensifs"},
    path: '/parkland-formula',
    keywords: ["parkland-formula"],
    specialties: ["emergency"],
    icon: Droplet,
    isFeatured: false
  },
  {
    id: 'fena',
    title: {"en":"FENa Sodium Excretion","fr":"FENa Excrétion Sodium","ar":"حساب FENa للكلى"},
    category: {"en":"Emergency & Critical Care","fr":"Urgences & Soins Intensifs"},
    path: '/fena',
    keywords: ["fena"],
    specialties: ["emergency"],
    icon: TestTube,
    isFeatured: false
  },
  {
    id: 'winters-formula',
    title: {"en":"Winters Formula Acidosis","fr":"Formule de Winters Acidose","ar":"معادلة وينترز للحموضة"},
    category: {"en":"Emergency & Critical Care","fr":"Urgences & Soins Intensifs"},
    path: '/winters-formula',
    keywords: ["winters-formula"],
    specialties: ["emergency"],
    icon: Wind,
    isFeatured: false
  },
  {
    id: 'has-bled',
    title: {"en":"HAS-BLED Bleeding Risk","fr":"Score HAS-BLED Risque Hémorragique","ar":"مقياس HAS-BLED للنزيف"},
    category: {"en":"Emergency & Critical Care","fr":"Urgences & Soins Intensifs"},
    path: '/has-bled',
    keywords: ["has-bled"],
    specialties: ["emergency"],
    icon: HeartPulse,
    isFeatured: false
  },
  {
    id: 'tidal-volume',
    title: {"en":"Tidal Volume ARDS","fr":"Volume Courant (Tidal)","ar":"حجم الهواء التنفسي المتوقع"},
    category: {"en":"Emergency & Critical Care","fr":"Urgences & Soins Intensifs"},
    path: '/tidal-volume',
    keywords: ["tidal-volume"],
    specialties: ["emergency"],
    icon: Wind,
    isFeatured: false
  },
  {
    id: 'apgar',
    title: {"en":"APGAR Score","fr":"Score d’APGAR","ar":"مقياس أبغار للوليد APGAR"},
    category: {"en":"Emergency & Critical Care","fr":"Urgences & Soins Intensifs"},
    path: '/apgar-score',
    keywords: ["apgar"],
    specialties: ["emergency"],
    icon: Activity,
    isFeatured: false
  },
  {
    id: 'ciwa-ar',
    title: {"en":"CIWA-Ar Alcohol Score","fr":"Score CIWA-Ar Alcool","ar":"مقياس CIWA-Ar لانسحاب الكحول"},
    category: {"en":"Emergency & Critical Care","fr":"Urgences & Soins Intensifs"},
    path: '/ciwa-ar',
    keywords: ["ciwa-ar"],
    specialties: ["emergency"],
    icon: Activity,
    isFeatured: false
  },
  {
    id: 'timi',
    title: {"en":"TIMI Score NSTEMI","fr":"Score TIMI NSTEMI","ar":"نقاط TIMI لنقص التروية"},
    category: {"en":"Emergency & Critical Care","fr":"Urgences & Soins Intensifs"},
    path: '/timi-score',
    keywords: ["timi"],
    specialties: ["emergency"],
    icon: HeartPulse,
    isFeatured: false
  },
  {
    id: 'perc-rule',
    title: {"en":"PERC Rule for PE","fr":"Score PERC Embolie Pulmonaire","ar":"قاعدة PERC لاستبعاد الجلطة الرئوية"},
    category: {"en":"Emergency & Critical Care","fr":"Urgences & Soins Intensifs"},
    path: '/perc-rule',
    keywords: ["perc-rule"],
    specialties: ["emergency"],
    icon: Wind,
    isFeatured: false
  },
  {
    id: 'geneva',
    title: {"en":"Geneva Score PE","fr":"Score de Genève EP","ar":"مقياس جنيف للجلطة الرئوية"},
    category: {"en":"Emergency & Critical Care","fr":"Urgences & Soins Intensifs"},
    path: '/geneva-score',
    keywords: ["geneva"],
    specialties: ["emergency"],
    icon: Wind,
    isFeatured: false
  },
  {
    id: 'pesi',
    title: {"en":"PESI Score PE","fr":"Score PESI EP","ar":"مقياس PESI للجلطة الرئوية"},
    category: {"en":"Emergency & Critical Care","fr":"Urgences & Soins Intensifs"},
    path: '/pesi-score',
    keywords: ["pesi"],
    specialties: ["emergency"],
    icon: Wind,
    isFeatured: false
  },
  {
    id: 'bova',
    title: {"en":"Bova Score PE","fr":"Score Bova EP","ar":"مقياس بوفا للجلطة الرئوية"},
    category: {"en":"Emergency & Critical Care","fr":"Urgences & Soins Intensifs"},
    path: '/bova-score',
    keywords: ["bova"],
    specialties: ["emergency"],
    icon: HeartPulse,
    isFeatured: false
  },
  {
    id: 'apache-ii',
    title: {"en":"APACHE II","fr":"Score APACHE II","ar":"مقياس أباتشي للرعاية المركزة"},
    category: {"en":"Emergency & Critical Care","fr":"Urgences & Soins Intensifs"},
    path: '/apache-ii-score',
    keywords: ["apache-ii"],
    specialties: ["emergency"],
    icon: Activity,
    isFeatured: false
  },
  {
    id: 'saps-ii',
    title: {"en":"SAPS II","fr":"Score SAPS II","ar":"مقياس SAPS II"},
    category: {"en":"Emergency & Critical Care","fr":"Urgences & Soins Intensifs"},
    path: '/saps-ii-score',
    keywords: ["saps-ii"],
    specialties: ["emergency"],
    icon: Activity,
    isFeatured: false
  },
  {
    id: 'nihss',
    title: {"en":"NIHSS Stroke Scale","fr":"Score NIHSS AVC","ar":"مقياس السكتة الدماغية NIHSS"},
    category: {"en":"Emergency & Critical Care","fr":"Urgences & Soins Intensifs"},
    path: '/nihss-score',
    keywords: ["nihss"],
    specialties: ["emergency"],
    icon: Brain,
    isFeatured: false
  },
  {
    id: 'mdrd-gfr',
    title: {"en":"MDRD GFR Score","fr":"MDRD DFG Score","ar":"معدل الترشيح الكبيبي MDRD"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/mdrd-gfr',
    keywords: ["mdrd-gfr"],
    specialties: ["general"],
    icon: TestTube,
    isFeatured: false
  },
  {
    id: 'ckd-epi-gfr',
    title: {"en":"CKD-EPI GFR Score","fr":"CKD-EPI DFG Score","ar":"معدل الترشيح الكبيبي CKD-EPI"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/ckd-epi-gfr',
    keywords: ["ckd-epi-gfr"],
    specialties: ["general"],
    icon: TestTube,
    isFeatured: false
  },
  {
    id: 'corrected-calcium',
    title: {"en":"Corrected Calcium","fr":"Calcium Corrigé Albumin","ar":"الكالسيوم المصحح بالألبومين"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/corrected-calcium',
    keywords: ["corrected-calcium"],
    specialties: ["general"],
    icon: TestTube,
    isFeatured: false
  },
  {
    id: 'ascvd-risk',
    title: {"en":"ASCVD Risk","fr":"Risque ASCVD","ar":"خطر أمراض القلب"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/ascvd-risk',
    keywords: ["ascvd-risk"],
    specialties: ["general"],
    icon: HeartPulse,
    isFeatured: false
  },
  {
    id: 'retic-index',
    title: {"en":"Reticulocyte Index","fr":"Indice Réticulocytaire","ar":"مؤشر الخلايا الشبكية"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/retic-index',
    keywords: ["retic-index"],
    specialties: ["general"],
    icon: Droplet,
    isFeatured: false
  },
  {
    id: 'child-pugh',
    title: {"en":"Child-Pugh Score","fr":"Score de Child-Pugh","ar":"تصنيف تشايلد بيو للكبد"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/child-pugh-score',
    keywords: ["child-pugh"],
    specialties: ["general"],
    icon: Activity,
    isFeatured: false
  },
  {
    id: 'anion-gap',
    title: {"en":"Anion Gap","fr":"Trou Anionique","ar":"الفجوة الأنيونية للدم"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/anion-gap',
    keywords: ["anion-gap"],
    specialties: ["general"],
    icon: TestTube,
    isFeatured: false
  },
  {
    id: 'osmolal-gap',
    title: {"en":"Osmolal Gap","fr":"Trou Osmolaire","ar":"الفجوة الأسموزية للدم"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/osmolal-gap',
    keywords: ["osmolal-gap"],
    specialties: ["general"],
    icon: TestTube,
    isFeatured: false
  },
  {
    id: 'aa-gradient',
    title: {"en":"A-a Gradient","fr":"Gradient Alvéolo-Artériel","ar":"فرق الأكسجين A-a Gradient"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/aa-gradient',
    keywords: ["aa-gradient"],
    specialties: ["general"],
    icon: Wind,
    isFeatured: false
  },
  {
    id: 'free-water-deficit',
    title: {"en":"Free Water Deficit","fr":"Déficit en Eau Libre","ar":"نقص الماء الحر في فرط الصوديوم"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/free-water-deficit',
    keywords: ["free-water-deficit"],
    specialties: ["general"],
    icon: Droplet,
    isFeatured: false
  },
  {
    id: 'sodium-correction',
    title: {"en":"Sodium Correction Rate","fr":"Correction de Sodium","ar":"معدل تصحيح الصوديوم"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/sodium-correction',
    keywords: ["sodium-correction"],
    specialties: ["general"],
    icon: Activity,
    isFeatured: false
  },
  {
    id: 'nutrition-nrs2002',
    title: {"en":"NRS-2002 Nutrition Risk","fr":"NRS-2002 Risque Nutritionnel","ar":"أداة NRS-2002 للمخاطر الغذائية"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/nutrition-nrs2002',
    keywords: ["nutrition-nrs2002"],
    specialties: ["general"],
    icon: AlertOctagon,
    isFeatured: false
  },
  {
    id: 'bishop',
    title: {"en":"Bishop Score","fr":"Score de Bishop","ar":"مقياس بيشوب للولادة"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/bishop-score',
    keywords: ["bishop"],
    specialties: ["general"],
    icon: Activity,
    isFeatured: false
  },
  {
    id: 'centor',
    title: {"en":"Centor Score","fr":"Score de MacIsaac","ar":"مقياس سينتور لالتهاب الحلق"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/centor-score',
    keywords: ["centor"],
    specialties: ["general"],
    icon: Activity,
    isFeatured: false
  },
  {
    id: 'braden-scale',
    title: {"en":"Braden Scale","fr":"Échelle de Braden","ar":"مقياس برادن للقرح السريرية"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/braden-scale',
    keywords: ["braden-scale"],
    specialties: ["general"],
    icon: HeartPulse,
    isFeatured: false
  },
  {
    id: 'morse-fall-scale',
    title: {"en":"Morse Fall Scale","fr":"Échelle de Chute Morse","ar":"مقياس مورس للسقوط"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/morse-fall-scale',
    keywords: ["morse-fall-scale"],
    specialties: ["general"],
    icon: Activity,
    isFeatured: false
  },
  {
    id: 'news2',
    title: {"en":"NEWS-2 Score","fr":"Score NEWS-2","ar":"مقياس NEWS-2 للطوارئ"},
    category: {"en":"Emergency & Critical Care","fr":"Urgences & Soins Intensifs"},
    path: '/news2-score',
    keywords: ["news2"],
    specialties: ["emergency"],
    icon: AlertOctagon,
    isFeatured: false
  },
  {
    id: 'mews',
    title: {"en":"MEWS Score","fr":"Score MEWS","ar":"مقياس MEWS للطوارئ"},
    category: {"en":"Emergency & Critical Care","fr":"Urgences & Soins Intensifs"},
    path: '/mews-score',
    keywords: ["mews"],
    specialties: ["emergency"],
    icon: Activity,
    isFeatured: false
  },
  {
    id: 'wong-baker-faces',
    title: {"en":"Wong-Baker FACES","fr":"Échelle Wong-Baker","ar":"مقياس وونغ-بيكر للألم"},
    category: {"en":"Pharmacology & Dosing","fr":"Pharmacologie & Dosages"},
    path: '/wong-baker-faces',
    keywords: ["wong-baker-faces"],
    specialties: ["pharmaco"],
    icon: Activity,
    isFeatured: false
  },
  {
    id: 'flacc',
    title: {"en":"FLACC Pain Scale","fr":"Échelle FLACC","ar":"مقياس فلاك للألم"},
    category: {"en":"Pharmacology & Dosing","fr":"Pharmacologie & Dosages"},
    path: '/flacc-score',
    keywords: ["flacc"],
    specialties: ["pharmaco"],
    icon: Activity,
    isFeatured: false
  },
  {
    id: 'rass',
    title: {"en":"RASS Score","fr":"Score RASS","ar":"مقياس ريتشموند (RASS)"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/rass-score',
    keywords: ["rass"],
    specialties: ["general"],
    icon: Activity,
    isFeatured: false
  },
  {
    id: 'cam-icu',
    title: {"en":"CAM-ICU","fr":"CAM-ICU","ar":"مقياس CAM-ICU للهذيان"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/cam-icu',
    keywords: ["cam-icu"],
    specialties: ["general"],
    icon: Activity,
    isFeatured: false
  },
  {
    id: 'ascvd-risk',
    title: {"en":"ASCVD Risk Estimator","fr":"Évaluateur ASCVD","ar":"مقياس خطر ASCVD"},
    category: {"en":"Emergency & Critical Care","fr":"Urgences & Soins Intensifs"},
    path: '/ascvd-risk-score',
    keywords: ["ascvd-risk"],
    specialties: ["emergency"],
    icon: HeartPulse,
    isFeatured: false
  },
  {
    id: 'benzo-equivalence',
    title: {"en":"Benzodiazepine Equiv","fr":"Équivalence Benzo","ar":"مكافئ البنزوديازيبين"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/benzo-equivalence',
    keywords: ["benzo-equivalence"],
    specialties: ["general"],
    icon: ArrowRightLeft,
    isFeatured: false
  },
  {
    id: 'tpn-macronutrients',
    title: {"en":"TPN Macronutrients","fr":"Macronutriments NPT","ar":"مغذيات التغذية الوريدية"},
    category: {"en":"Pharmacology & Dosing","fr":"Pharmacologie & Dosages"},
    path: '/tpn-macronutrients',
    keywords: ["tpn-macronutrients"],
    specialties: ["pharmaco"],
    icon: LayoutDashboard,
    isFeatured: false
  },
  {
    id: 'digoxin-dosing',
    title: {"en":"Digoxin Dosing","fr":"Dose de Digoxine","ar":"جرعة الديجوكسين"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/digoxin-dosing',
    keywords: ["digoxin-dosing"],
    specialties: ["general"],
    icon: HeartPulse,
    isFeatured: false
  },
  {
    id: 'protamine-reversal',
    title: {"en":"Protamine Reversal","fr":"Inversion Protamine","ar":"معاكسة البروتامين"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/protamine-reversal',
    keywords: ["protamine-reversal"],
    specialties: ["general"],
    icon: ShieldAlert,
    isFeatured: false
  },
  {
    id: 'phenytoin-loading',
    title: {"en":"Phenytoin Loading","fr":"Charge Phénytoïne","ar":"جرعة الفينيتوين"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/phenytoin-loading',
    keywords: ["phenytoin-loading"],
    specialties: ["general"],
    icon: Syringe,
    isFeatured: false
  },
  {
    id: 'warfarin-dosing',
    title: {"en":"Warfarin Dosing","fr":"Ajustement Warfarine","ar":"جرعة الوارفارين"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/warfarin-dosing',
    keywords: ["warfarin-dosing"],
    specialties: ["general"],
    icon: Activity,
    isFeatured: false
  },
  {
    id: 'rcri',
    title: {"en":"RCRI Score","fr":"Score RCRI","ar":"مؤشر الخطر القلبي"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/rcri-score',
    keywords: ["rcri"],
    specialties: ["general"],
    icon: HeartPulse,
    isFeatured: false
  },
  {
    id: 'apri',
    title: {"en":"APRI Score","fr":"Score APRI","ar":"مؤشر تليف الكبد"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/apri-score',
    keywords: ["apri"],
    specialties: ["general"],
    icon: Droplet,
    isFeatured: false
  },
  {
    id: 'meld-na',
    title: {"en":"MELD-Na Score","fr":"Score MELD-Na","ar":"مؤشر وظائف الكبد"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/meld-na-score',
    keywords: ["meld-na"],
    specialties: ["general"],
    icon: Activity,
    isFeatured: false
  },
  {
    id: 'curb-65',
    title: {"en":"CURB-65","fr":"CURB-65","ar":"مقياس الالتهاب الرئوي"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/curb-65',
    keywords: ["curb-65"],
    specialties: ["general"],
    icon: Wind,
    isFeatured: false
  },
  {
    id: 'anion-gap',
    title: {"en":"Anion Gap","fr":"Trou Anionique","ar":"الفجوة الأنيونية"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/anion-gap',
    keywords: ["anion-gap"],
    specialties: ["general"],
    icon: Activity,
    isFeatured: false
  },
  {
    id: 'corrected-calcium',
    title: {"en":"Corrected Calcium","fr":"Calcium Corrigé","ar":"الكالسيوم المصحح"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/corrected-calcium',
    keywords: ["corrected-calcium"],
    specialties: ["general"],
    icon: FlaskConical,
    isFeatured: false
  },
  {
    id: 'fena',
    title: {"en":"FeNa Calculator","fr":"Calculateur FeNa","ar":"حاسبة FeNa"},
    category: {"en":"Internal Medicine","fr":"Médecine Interne"},
    path: '/fena-calculator',
    keywords: ["fena"],
    specialties: ["general"],
    icon: Droplet,
    isFeatured: false
  },
  {
    id: 'nnt',
    title: {"en":"Number Needed to Treat (NNT)","fr":"Nombre Nécessaire à Traiter","ar":"العدد المطلوب للعلاج"},
    category: {"en":"Pharmacology & Dosing","fr":"Pharmacologie & Dosages"},
    path: '/nnt-calculator',
    keywords: ["nnt"],
    specialties: ["pharmaco"],
    icon: Calculator,
    isFeatured: false
  },
  {
    id: 'sample-size',
    title: {"en":"Sample Size Calculator","fr":"Calculateur Taille Échantillon","ar":"حاسبة حجم العينة"},
    category: {"en":"Pharmacology & Dosing","fr":"Pharmacologie & Dosages"},
    path: '/sample-size-calculator',
    keywords: ["sample-size"],
    specialties: ["pharmaco"],
    icon: Calculator,
    isFeatured: false
  },
  {
    id: 'or-to-rr',
    title: {"en":"OR to RR Converter","fr":"Convertisseur RC en RR","ar":"محول OR إلى RR"},
    category: {"en":"Pharmacology & Dosing","fr":"Pharmacologie & Dosages"},
    path: '/or-to-rr',
    keywords: ["or-to-rr"],
    specialties: ["pharmaco"],
    icon: ArrowRightLeft,
    isFeatured: false
  },
  {
    id: 'fragility-index',
    title: {"en":"Fragility Index","fr":"Indice de Fragilité","ar":"مؤشر الهشاشة"},
    category: {"en":"Pharmacology & Dosing","fr":"Pharmacologie & Dosages"},
    path: '/fragility-index',
    keywords: ["fragility-index"],
    specialties: ["pharmaco"],
    icon: ShieldAlert,
    isFeatured: false
  },
  {
    id: 'bicarb-deficit',
    title: {"en":"Bicarbonate Deficit","fr":"Déficit en Bicarbonate","ar":"نقص البيكربونات"},
    category: {"en":"Pharmacology & Dosing","fr":"Pharmacologie & Dosages"},
    path: '/bicarb-deficit',
    keywords: ["bicarb-deficit"],
    specialties: ["pharmaco"],
    icon: Droplet,
    isFeatured: false
  },
  {
    id: 'bmi',
    title: {"en":"BMI Calculator","fr":"Calculateur IMC","ar":"مؤشر كتلة وزن الجسم BMI"},
    category: {"en":"Pharmacology & Dosing","fr":"Pharmacologie & Dosages"},
    path: '/bmi-calculator',
    keywords: ["bmi"],
    specialties: ["pharmaco"],
    icon: LayoutDashboard,
    isFeatured: false
  },
  {
    id: 'phq9',
    title: {"en":"PHQ-9 Depression","fr":"Score PHQ-9 Dépression","ar":"مقياس PHQ-9 لتشخيص الاكتئاب"},
    category: {"en":"Pharmacology & Dosing","fr":"Pharmacologie & Dosages"},
    path: '/phq9-score',
    keywords: ["phq9"],
    specialties: ["pharmaco"],
    icon: Brain,
    isFeatured: false
  },
  {
    id: 'heparin-dosing',
    title: {"en":"Heparin Dosing","fr":"Dosage Héparine","ar":"جرعة الهيبارين"},
    category: {"en":"Pharmacology & Dosing","fr":"Pharmacologie & Dosages"},
    path: '/heparin-dosing',
    keywords: ["heparin-dosing"],
    specialties: ["pharmaco"],
    icon: Activity,
    isFeatured: false
  },
  {
    id: 'vancomycin-dosing',
    title: {"en":"Vancomycin Dosing","fr":"Dosage Vancomycine","ar":"جرعة الفانكومايسين"},
    category: {"en":"Pharmacology & Dosing","fr":"Pharmacologie & Dosages"},
    path: '/vancomycin-dosing',
    keywords: ["vancomycin-dosing"],
    specialties: ["pharmaco"],
    icon: Pill,
    isFeatured: false
  },
  {
    id: 'aminoglycoside-dosing',
    title: {"en":"Aminoglycoside Dosing","fr":"Dosage Aminosides","ar":"جرعة الأمينوغليكوزيد"},
    category: {"en":"Pharmacology & Dosing","fr":"Pharmacologie & Dosages"},
    path: '/aminoglycoside-dosing',
    keywords: ["aminoglycoside-dosing"],
    specialties: ["pharmaco"],
    icon: Pill,
    isFeatured: false
  },
  {
    id: 'opioid-conversion',
    title: {"en":"Opioid Conversion","fr":"Conversion Opioïdes","ar":"تحويل مسكنات الألم"},
    category: {"en":"Pharmacology & Dosing","fr":"Pharmacologie & Dosages"},
    path: '/opioid-conversion',
    keywords: ["opioid-conversion"],
    specialties: ["pharmaco"],
    icon: ArrowRightLeft,
    isFeatured: false
  },
  {
    id: 'maintenance-fluids',
    title: {"en":"Maintenance IV Fluids","fr":"Fluides d’Entretien IV","ar":"السوائل الوريدية اليومية"},
    category: {"en":"Pharmacology & Dosing","fr":"Pharmacologie & Dosages"},
    path: '/maintenance-fluids',
    keywords: ["maintenance-fluids"],
    specialties: ["pharmaco"],
    icon: Droplet,
    isFeatured: false
  },
  {
    id: 'phenytoin-correction',
    title: {"en":"Phenytoin Correction","fr":"Correction Phénytoïne","ar":"تصحيح الفينيتوين"},
    category: {"en":"Pharmacology & Dosing","fr":"Pharmacologie & Dosages"},
    path: '/phenytoin-correction',
    keywords: ["phenytoin-correction"],
    specialties: ["pharmaco"],
    icon: Pill,
    isFeatured: false
  },
  {
    id: 'drug-interactions',
    title: {"en":"Drug Interactions","fr":"Interactions Médicamenteuses","ar":"تداخلات الأدوية"},
    category: {"en":"Medical Tools","fr":"Outils Médicaux"},
    path: '/drug-interactions',
    keywords: ["drug-interactions"],
    specialties: [],
    icon: ShieldCheck,
    isFeatured: false
  },
  {
    id: 'medical-statistics',
    title: {"en":"Medical Statistics","fr":"Statistiques Médicales","ar":"الإحصاء الطبي"},
    category: {"en":"Medical Tools","fr":"Outils Médicaux"},
    path: '/medical-statistics',
    keywords: ["medical-statistics"],
    specialties: [],
    icon: Layers,
    isFeatured: false
  },
  {
    id: 'glp-1-hub',
    title: {"en":"GLP-1 Hub","fr":"Hub GLP-1","ar":"مركز أدوية GLP-1"},
    category: {"en":"Medical Tools","fr":"Outils Médicaux"},
    path: '/glp-1-hub',
    keywords: ["glp-1-hub"],
    specialties: [],
    icon: Sparkles,
    isFeatured: false
  },

];
