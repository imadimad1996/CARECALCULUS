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
    id: 'medical-statistics',
    title: {"en":"Medical Statistics","fr":"Statistiques Médicales","ar":"الإحصاء الطبي"},
    category: {"en":"Medical Tools","fr":"Outils Médicaux"},
    path: '/medical-statistics',
    keywords: ["medical-statistics","statistics","odds ratio","relative risk","nnt","fragility index"],
    specialties: [],
    icon: Layers,
    isFeatured: false
  },
  {
    id: 'insulin-sliding-scale',
    title: {"en":"Insulin Sliding Scale (SSI)","fr":"Échelle d'Insuline Mobile (SSI)","ar":"مقياس الإنسولين المتدرج"},
    category: {"en":"Pharmacology & Dosing","fr":"Pharmacologie & Dosages"},
    path: '/insulin-sliding-scale',
    keywords: ["insulin","sliding scale","ssi","glycemia","diabetes","diabete","glucose","endocrinology"],
    specialties: ["endocrinology","internal-medicine","emergency"],
    icon: Syringe,
    isFeatured: true
  },
  {
    id: 'schwartz-pediatric-gfr',
    title: {"en":"Schwartz Pediatric GFR (Bedside)","fr":"DFG Pédiatrique Schwartz","ar":"معدل الترشيح الكبيبي للأطفال شوارتز"},
    category: {"en":"Metabolic & Renal","fr":"Métabolique & Rénal"},
    path: '/schwartz-pediatric-gfr',
    keywords: ["schwartz","pediatric gfr","dfg pediatrique","creatinine","renal","nephrology","pediatrics"],
    specialties: ["pediatrics","nephrology"],
    icon: TestTube,
    isFeatured: false
  },
  // Fast-Track 25 High-Yield Clinical Calculators
  {
    id: 'alvarado-score',
    title: {"en":"Alvarado Score for Acute Appendicitis","fr":"Score d'Alvarado (Appendicite Aiguë)","ar":"مقياس ألفارادو لالتهاب الزائدة"},
    category: {"en":"Emergency & Surgery","fr":"Urgences & Chirurgie"},
    path: '/alvarado-score',
    keywords: ["alvarado","appendicitis","mantrels","right lower quadrant","acute abdomen","appendicite"],
    specialties: ["emergency","surgery","gastroenterology"],
    icon: Activity,
    isFeatured: true
  },
  {
    id: 'ransons-criteria',
    title: {"en":"Ranson's Criteria for Pancreatitis","fr":"Critères de Ranson (Pancréatite)","ar":"معايير رانسون لالتهاب البنكرياس"},
    category: {"en":"Gastroenterology & Critical Care","fr":"Hépato-Gastroentérologie & Soins Critiques"},
    path: '/ransons-criteria',
    keywords: ["ranson","pancreatitis","pancreatite","amylase","lipase","mortality"],
    specialties: ["gastroenterology","emergency","critical-care"],
    icon: AlertTriangle,
    isFeatured: true
  },
  {
    id: 'bisap-score',
    title: {"en":"BISAP Score for Pancreatitis Mortality","fr":"Score BISAP (Pancréatite Aiguë)","ar":"مقياس بيساب لشدة التهاب البنكرياس"},
    category: {"en":"Gastroenterology & Critical Care","fr":"Hépato-Gastroentérologie & Soins Critiques"},
    path: '/bisap-score',
    keywords: ["bisap","pancreatitis","bun","sirs","pleural effusion","pancreatite"],
    specialties: ["gastroenterology","emergency","critical-care"],
    icon: Activity,
    isFeatured: true
  },
  {
    id: 'glasgow-blatchford',
    title: {"en":"Glasgow-Blatchford Bleeding Score","fr":"Score de Glasgow-Blatchford (Hémorragie Digestive)","ar":"مقياس غلاسكو بلاتشفورد للنزيف الهضمي"},
    category: {"en":"Gastroenterology & Emergency","fr":"Hépato-Gastroentérologie & Urgences"},
    path: '/glasgow-blatchford',
    keywords: ["glasgow blatchford","gbs","gi bleed","upper gi bleeding","melena","hemorragie digestive"],
    specialties: ["gastroenterology","emergency","internal-medicine"],
    icon: Droplet,
    isFeatured: true
  },
  {
    id: 'ottawa-rules',
    title: {"en":"Ottawa Ankle, Foot & Knee Rules","fr":"Règles d'Ottawa (Cheville, Pied & Genou)","ar":"قواعد أوتاوا لكسور الكاحل والركبة"},
    category: {"en":"Orthopedics & Emergency","fr":"Orthopédie & Urgences"},
    path: '/ottawa-rules',
    keywords: ["ottawa ankle","ottawa knee","fracture","malleolus","radiography","entorse"],
    specialties: ["orthopedics","emergency"],
    icon: ShieldCheck,
    isFeatured: true
  },
  {
    id: 'fib4-index',
    title: {"en":"FIB-4 Liver Fibrosis Index","fr":"Indice FIB-4 (Fibrose Hépatique)","ar":"مؤشر فيب-4 لتليف الكبد"},
    category: {"en":"Hepatology & Gastroenterology","fr":"Hépatologie & Gastroentérologie"},
    path: '/fib4-index',
    keywords: ["fib-4","fib4","fibrosis","nafld","mash","cirrhosis","alt","ast","platelets"],
    specialties: ["gastroenterology","internal-medicine"],
    icon: Activity,
    isFeatured: true
  },
  {
    id: 'saag-calculator',
    title: {"en":"Serum-Ascites Albumin Gradient (SAAG)","fr":"Gradient d'Albumine Sérum-Ascite (SAAG)","ar":"مدروج ألبومين المصل والحبن SAAG"},
    category: {"en":"Hepatology & Gastroenterology","fr":"Hépatologie & Gastroentérologie"},
    path: '/saag-calculator',
    keywords: ["saag","ascites","portal hypertension","cirrhosis","peritoneal carcinomatosis"],
    specialties: ["gastroenterology","internal-medicine"],
    icon: TestTube,
    isFeatured: true
  },
  {
    id: 'maddreys-df',
    title: {"en":"Maddrey's Discriminant Function (MDF)","fr":"Score de Maddrey (Hépatite Alcoolique)","ar":"معامل مادري لالتهاب الكبد الكحولي"},
    category: {"en":"Hepatology & Pharmacology","fr":"Hépatologie & Pharmacologie"},
    path: '/maddreys-df',
    keywords: ["maddrey","mdf","alcoholic hepatitis","prednisolone","corticosteroid","prothrombin time"],
    specialties: ["gastroenterology","critical-care","internal-medicine"],
    icon: Pill,
    isFeatured: true
  },
  {
    id: 'lille-model',
    title: {"en":"Lille Model for Alcoholic Hepatitis","fr":"Modèle de Lille (Hépatite Alcoolique)","ar":"نموذج ليل لتقييم الاستجابة للكورتيزون"},
    category: {"en":"Hepatology & Critical Care","fr":"Hépatologie & Soins Critiques"},
    path: '/lille-model',
    keywords: ["lille model","alcoholic hepatitis","steroid response","day 7","prednisolone","liver transplant"],
    specialties: ["gastroenterology","critical-care"],
    icon: Pill,
    isFeatured: true
  },
  {
    id: 'feurea-calculator',
    title: {"en":"Fractional Excretion of Urea (FEUrea)","fr":"Fraction d'Excrétion de l'Urée (FEUrée)","ar":"الكسر المفرغ من اليوريا FEUrea"},
    category: {"en":"Metabolic & Renal","fr":"Métabolique & Rénal"},
    path: '/feurea-calculator',
    keywords: ["feurea","fractional excretion","prerenal","atn","diuretics","acute kidney injury"],
    specialties: ["nephrology","critical-care","internal-medicine"],
    icon: Droplet,
    isFeatured: true
  },
  {
    id: 'delta-delta',
    title: {"en":"Delta-Delta & Delta Ratio Calculator","fr":"Calculateur Delta-Delta & Ratio Delta","ar":"حاسبة دلتا-دلتا والنسبة الفجوية"},
    category: {"en":"Metabolic & Renal","fr":"Métabolique & Rénal"},
    path: '/delta-delta',
    keywords: ["delta delta","delta ratio","hagma","nagma","acid base","anion gap","metabolic acidosis"],
    specialties: ["nephrology","critical-care","emergency"],
    icon: Activity,
    isFeatured: true
  },
  {
    id: 'serum-osmolality',
    title: {"en":"Serum Osmolality & Osmolar Gap","fr":"Osmolalité Plasmatique & Trou Osmolaire","ar":"الحلولية المصلية والفجوة الحلولية"},
    category: {"en":"Metabolic & Critical Care","fr":"Métabolique & Soins Intensifs"},
    path: '/serum-osmolality',
    keywords: ["serum osmolality","osmolar gap","toxic alcohol","ethylene glycol","methanol","hyponatremia"],
    specialties: ["emergency","nephrology","toxicology"],
    icon: TestTube,
    isFeatured: true
  },
  {
    id: 'urine-anion-gap',
    title: {"en":"Urine Anion Gap (UAG)","fr":"Trou Anionique Urinaire (TAU)","ar":"الفجوة الأنيونية البولية"},
    category: {"en":"Metabolic & Renal","fr":"Métabolique & Rénal"},
    path: '/urine-anion-gap',
    keywords: ["urine anion gap","uag","rta","renal tubular acidosis","diarrhea","ammonium"],
    specialties: ["nephrology","internal-medicine"],
    icon: Droplet,
    isFeatured: true
  },
  {
    id: 'abcd2-score',
    title: {"en":"ABCD² Score for TIA Stroke Risk","fr":"Score ABCD² (Risque d'AVC post-AIT)","ar":"مقياس ABCD² لخطر السكتة الدماغية"},
    category: {"en":"Neurology & Emergency","fr":"Neurologie & Urgences"},
    path: '/abcd2-score',
    keywords: ["abcd2","tia","stroke","ait","avc","transient ischemic attack"],
    specialties: ["neurology","emergency"],
    icon: Brain,
    isFeatured: true
  },
  {
    id: 'gad7-score',
    title: {"en":"GAD-7 Anxiety Screening Scale","fr":"Échelle GAD-7 (Dépistage de l'Anxiété)","ar":"مقياس القلق العام GAD-7"},
    category: {"en":"Psychiatry & Behavioral Health","fr":"Psychiatrie & Santé Mentale"},
    path: '/gad7-score',
    keywords: ["gad-7","gad7","anxiety","anxiete","generalized anxiety","panic","psychiatry"],
    specialties: ["psychiatry","primary-care"],
    icon: HeartPulse,
    isFeatured: true
  },
  {
    id: 'modified-rankin-scale',
    title: {"en":"Modified Rankin Scale (mRS)","fr":"Échelle de Rankin Modifiée (mRS)","ar":"مقياس رانكين المعدل للعجز العصبي"},
    category: {"en":"Neurology & Rehabilitation","fr":"Neurologie & Réadaptation"},
    path: '/modified-rankin-scale',
    keywords: ["modified rankin","mrs","stroke outcome","disability","avc","handicap"],
    specialties: ["neurology","physical-therapy"],
    icon: ShieldCheck,
    isFeatured: true
  },
  {
    id: 'caprini-score',
    title: {"en":"Caprini Score for Surgical VTE Risk","fr":"Score de Caprini (Risque MTEV Chirurgical)","ar":"مقياس كابريني للجلطات الوريدية الجراحية"},
    category: {"en":"Surgery & Hematology","fr":"Chirurgie & Hématologie"},
    path: '/caprini-score',
    keywords: ["caprini","vte","dvt","pe","surgical prophylaxis","thromboprophylaxis","lmwh"],
    specialties: ["surgery","hematology","anesthesiology"],
    icon: ShieldAlert,
    isFeatured: true
  },
  {
    id: 'mallampati-score',
    title: {"en":"Modified Mallampati Airway Score","fr":"Classification de Mallampati Modifiée","ar":"تصنيف مالمباتي لتقييم صعوبة التنبيب"},
    category: {"en":"Anesthesiology & Airway","fr":"Anesthésie & Voies Aériennes"},
    path: '/mallampati-score',
    keywords: ["mallampati","difficult airway","intubation","laryngoscopy","anesthesia","oropharynx"],
    specialties: ["anesthesiology","emergency","critical-care"],
    icon: Activity,
    isFeatured: true
  },
  {
    id: 'canadian-c-spine',
    title: {"en":"Canadian C-Spine Rule","fr":"Règle Canadienne du Rachis Cervical","ar":"قاعدة العمود الفقري العنقي الكندية"},
    category: {"en":"Emergency & Trauma","fr":"Urgences & Traumatologie"},
    path: '/canadian-c-spine',
    keywords: ["canadian c-spine","ccr","cervical fracture","trauma","neck injury","c-collar"],
    specialties: ["emergency","trauma","orthopedics"],
    icon: ShieldCheck,
    isFeatured: true
  },
  {
    id: 'aha-prevent-risk',
    title: {"en":"AHA PREVENT™ 10-Year CVD Risk","fr":"Calculateur AHA PREVENT™ (Risque CV à 10 Ans)","ar":"حاسبة مخاطر أمراض القلب AHA PREVENT"},
    category: {"en":"Cardiology & Prevention","fr":"Cardiologie & Prévention"},
    path: '/aha-prevent-risk',
    keywords: ["aha prevent","prevent equations","ascvd","heart failure","statin","10-year risk"],
    specialties: ["cardiology","internal-medicine","endocrinology"],
    icon: HeartPulse,
    isFeatured: true
  },
  {
    id: 'dapt-score',
    title: {"en":"DAPT Score for Post-PCI Antiplatelet Duration","fr":"Score DAPT (Durée de Bithérapie Antiagrégante)","ar":"نقاط DAPT لتحديد مدة مضادات الصفائح"},
    category: {"en":"Cardiology","fr":"Cardiologie"},
    path: '/dapt-score',
    keywords: ["dapt score","pci","stent","aspirin","clopidogrel","ticagrelor","antiplatelet"],
    specialties: ["cardiology"],
    icon: HeartPulse,
    isFeatured: true
  },
  {
    id: 'nyha-classification',
    title: {"en":"NYHA Heart Failure Functional Classification","fr":"Classification Fonctionnelle NYHA (Insuffisance Cardiaque)","ar":"تصنيف NYHA الوظيفي لقصور القلب"},
    category: {"en":"Cardiology","fr":"Cardiologie"},
    path: '/nyha-classification',
    keywords: ["nyha","heart failure","dyspnea","gdmt","functional class","insuffisance cardiaque"],
    specialties: ["cardiology","internal-medicine"],
    icon: HeartPulse,
    isFeatured: true
  },
  {
    id: 'psi-port-score',
    title: {"en":"Pneumonia Severity Index (PSI / PORT)","fr":"Score PSI / PORT (Pneumonie Communautaire)","ar":"مؤشر شدة الالتهاب الرئوي PSI"},
    category: {"en":"Pulmonology & Infectious Disease","fr":"Pneumologie & Infectiologie"},
    path: '/psi-port-score',
    keywords: ["psi","port score","pneumonia","community acquired pneumonia","cap","curb-65"],
    specialties: ["pulmonology","emergency","internal-medicine"],
    icon: Wind,
    isFeatured: true
  },
  {
    id: 'ecog-performance',
    title: {"en":"ECOG / WHO Performance Status","fr":"Score de Performance ECOG / OMS","ar":"مقياس الأداء الوظيفي ECOG في الأورام"},
    category: {"en":"Oncology & Hematology","fr":"Oncologie & Hématologie"},
    path: '/ecog-performance',
    keywords: ["ecog","performance status","karnofsky","chemotherapy eligibility","oncology","cancer"],
    specialties: ["oncology","hematology","palliative"],
    icon: Activity,
    isFeatured: true
  },
  {
    id: 'pecarn-head-trauma',
    title: {"en":"PECARN Pediatric Head Trauma Rule","fr":"Règle PECARN (Traumatisme Crânien Pédiatrique)","ar":"قاعدة بيكارن لإصابات الرأس لدى الأطفال"},
    category: {"en":"Pediatrics & Emergency","fr":"Pédiatrie & Urgences"},
    path: '/pecarn-head-trauma',
    keywords: ["pecarn","pediatric head trauma","citbi","head ct","concussion","skull fracture"],
    specialties: ["pediatrics","emergency","trauma"],
    icon: Brain,
    isFeatured: true
  },
  {
    id: 'crusade-score',
    title: {"en":"CRUSADE Bleeding Score in Post-ACS","fr":"Score CRUSADE (Risque Hémorragique SCA)","ar":"مقياس كروسيد للنزيف القلبي بعد متلازمة الشريان التاجي"},
    category: {"en":"Cardiology & Critical Care","fr":"Cardiologie & Urgences"},
    path: '/crusade-score',
    keywords: ["crusade","bleeding","acs","nstemi","stemi","pci","anticoagulation"],
    specialties: ["cardiology","emergency","critical-care"],
    icon: ShieldAlert,
    isFeatured: true
  },
  {
    id: 'heart-pathway',
    title: {"en":"HEART Pathway Accelerated Protocol","fr":"Protocole HEART Pathway (Douleur Thoracique)","ar":"مسار هارت السريع لألم الصدر"},
    category: {"en":"Emergency & Critical Care","fr":"Urgences & Soins Intensifs"},
    path: '/heart-pathway',
    keywords: ["heart pathway","chest pain","troponin","mace","accelerated diagnostic protocol"],
    specialties: ["emergency","cardiology"],
    icon: HeartPulse,
    isFeatured: true
  },
  {
    id: 'spesi-score',
    title: {"en":"sPESI Pulmonary Embolism Severity Index","fr":"Score sPESI (Index Simplifié Embolie Pulmonaire)","ar":"مؤشر شدة الانصمام الرئوي المبسط sPESI"},
    category: {"en":"Pulmonology & Emergency","fr":"Pneumologie & Urgences"},
    path: '/spesi-score',
    keywords: ["spesi","pesi","pulmonary embolism","outpatient pe","30-day mortality","embolie pulmonaire"],
    specialties: ["pulmonology","emergency","critical-care"],
    icon: Wind,
    isFeatured: true
  },
  {
    id: 'revised-geneva',
    title: {"en":"Revised Geneva Score for Pulmonary Embolism","fr":"Score de Genève Révisé (Embolie Pulmonaire)","ar":"مقيas جنيف المعدل لاحتمالية الانصمام الرئوي"},
    category: {"en":"Pulmonology & Emergency","fr":"Pneumologie & Urgences"},
    path: '/revised-geneva',
    keywords: ["geneva score","pulmonary embolism","pe pretest probability","d-dimer","ctpa"],
    specialties: ["pulmonology","emergency","internal-medicine"],
    icon: Activity,
    isFeatured: true
  },
  {
    id: 'orbit-bleeding-score',
    title: {"en":"ORBIT Bleeding Score in Atrial Fibrillation","fr":"Score ORBIT (Risque Saignement Fibrillation Atriale)","ar":"مقياس أوربيت لخطر النزيف في الرجفان الأذيني"},
    category: {"en":"Cardiology","fr":"Cardiologie"},
    path: '/orbit-bleeding-score',
    keywords: ["orbit score","bleeding risk","atrial fibrillation","afib","doac","anticoagulation"],
    specialties: ["cardiology","hematology","internal-medicine"],
    icon: ShieldAlert,
    isFeatured: true
  },
  {
    id: 'hunt-hess',
    title: {"en":"Hunt & Hess Scale for Subarachnoid Hemorrhage","fr":"Échelle de Hunt et Hess (Hémorragie Sous-Arachnoïdienne)","ar":"مقياس هنت وهيس لتصنيف النزف تحت العنكبوتية"},
    category: {"en":"Neurology & Neurosurgery","fr":"Neurologie & Neurochirurgie"},
    path: '/hunt-hess',
    keywords: ["hunt hess","subarachnoid hemorrhage","sah","aneurysm","headache","coma"],
    specialties: ["neurology","emergency","critical-care"],
    icon: Brain,
    isFeatured: true
  },
  {
    id: 'four-score',
    title: {"en":"FOUR Coma Score (ICU & Intubation)","fr":"Score FOUR (Coma et Conscience en Réanimation)","ar":"مقياس فور لتقييم الغيبوبة للمرضى المنبوبين"},
    category: {"en":"Neurology & Critical Care","fr":"Neurologie & Soins Intensifs"},
    path: '/four-score',
    keywords: ["four score","coma","gcs alternative","intubation","brainstem reflexes","icu"],
    specialties: ["neurology","critical-care","emergency"],
    icon: Brain,
    isFeatured: true
  },
  {
    id: 'padua-score',
    title: {"en":"Padua Prediction Score for Medical Inpatient VTE","fr":"Score de Padoue (Risque MTEV en Médecine)","ar":"مقياس بادوا للتنبؤ بالانصمام الخثاري الوريدي الطبي"},
    category: {"en":"Internal Medicine & Hematology","fr":"Médecine Interne & Hématologie"},
    path: '/padua-score',
    keywords: ["padua score","vte prophylaxis","dvt prevention","medical inpatients","lmwh"],
    specialties: ["internal-medicine","hematology","critical-care"],
    icon: ShieldAlert,
    isFeatured: true
  },
  {
    id: 'bun-creatinine-ratio',
    title: {"en":"BUN / Creatinine Ratio Calculator","fr":"Ratio Urée / Créatinine (BUN/Cr)","ar":"حاسبة نسبة نيتروجين اليوريا إلى الكرياتينين"},
    category: {"en":"Nephrology & Renal Medicine","fr":"Néphrologie"},
    path: '/bun-creatinine-ratio',
    keywords: ["bun creatinine ratio","prerenal azotemia","acute kidney injury","aki","gi bleed"],
    specialties: ["nephrology","internal-medicine","emergency"],
    icon: Droplet,
    isFeatured: true
  },
  {
    id: 'upcr-calculator',
    title: {"en":"UPCR & UACR Proteinuria Calculator","fr":"Calculateur UPCR & UACR (Protéinurie / Albuminurie)","ar":"حاسبة نسبة البروتين والألبومين إلى الكرياتينين في البول"},
    category: {"en":"Nephrology & Renal Medicine","fr":"Néphrologie"},
    path: '/upcr-calculator',
    keywords: ["upcr","uacr","proteinuria","microalbuminuria","kdigo","chronic kidney disease"],
    specialties: ["nephrology","endocrinology","internal-medicine"],
    icon: Droplet,
    isFeatured: true
  },
  {
    id: 'calcium-phosphate-product',
    title: {"en":"Calcium × Phosphate Product (Ca × Pi)","fr":"Produit Phospho-Calcique (Ca × Pi)","ar":"حاسبة حاصل ضرب الكالسيوم والفوسفات"},
    category: {"en":"Nephrology & Metabolism","fr":"Néphrologie & Métabolisme"},
    path: '/calcium-phosphate-product',
    keywords: ["calcium phosphate product","calciphylaxis","ckd-mbd","vascular calcification","end stage renal"],
    specialties: ["nephrology","endocrinology"],
    icon: Activity,
    isFeatured: true
  },
  {
    id: 'urine-osmolal-gap',
    title: {"en":"Urine Osmolal Gap & Ammonium Calculator","fr":"Trou Osmolaire Urinaire & Ammonium (RTA)","ar":"حاسبة الفجوة الحلولية البولية والأمونيوم"},
    category: {"en":"Nephrology & Acid-Base","fr":"Néphrologie & Équilibre Acido-Basique"},
    path: '/urine-osmolal-gap',
    keywords: ["urine osmolal gap","ammonium","renal tubular acidosis","rta","normal anion gap acidosis"],
    specialties: ["nephrology","critical-care","internal-medicine"],
    icon: Droplet,
    isFeatured: true
  },
  {
    id: 'homa-ir',
    title: {"en":"HOMA-IR & Beta-Cell Function Calculator","fr":"Calculateur HOMA-IR & Fonction Bêta-Pancréatique","ar":"حاسبة مؤشر هوما لمقاومة الأنسولين ووظيفة خلايا بيتا"},
    category: {"en":"Endocrinology & Metabolism","fr":"Endocrinologie & Métabolisme"},
    path: '/homa-ir',
    keywords: ["homa-ir","insulin resistance","quicki","prediabetes","metabolic syndrome","beta cell"],
    specialties: ["endocrinology","internal-medicine","cardiology"],
    icon: Activity,
    isFeatured: true
  },
  {
    id: 'meld-3-score',
    title: {"en":"MELD 3.0 Score (OPTN Liver Allocation)","fr":"Score MELD 3.0 (Attribution de Greffe Hépatique)","ar":"مقياس ميلد 3.0 لتخصيص كبد المتبرعين"},
    category: {"en":"Gastroenterology & Hepatology","fr":"Hépato-Gastroentérologie"},
    path: '/meld-3-score',
    keywords: ["meld 3.0","meld score","liver transplant","cirrhosis mortality","optn","unos"],
    specialties: ["gastroenterology","hepatology","transplant"],
    icon: Activity,
    isFeatured: true
  },
  {
    id: 'ganzoni-formula',
    title: {"en":"Ganzoni Formula for Iron Deficit","fr":"Formule de Ganzoni (Déficit en Fer & Fer IV)","ar":"معادلة غانزوني لحساب عوز الحديد والحديد الوريدي"},
    category: {"en":"Hematology & Nephrology","fr":"Hématologie & Néphrologie"},
    path: '/ganzoni-formula',
    keywords: ["ganzoni formula","iron deficit","iv iron","ferric carboxymaltose","iron sucrose","anemia"],
    specialties: ["hematology","nephrology","internal-medicine"],
    icon: Pill,
    isFeatured: true
  },
  {
    id: 'lactate-clearance',
    title: {"en":"Lactate Clearance in Sepsis Resuscitation","fr":"Clairance du Lactate (Réanimation du Sepsis)","ar":"حاسبة تصفية اللاكتات في إنعاش الصدمة الإنتانية"},
    category: {"en":"Emergency & Critical Care","fr":"Urgences & Soins Intensifs"},
    path: '/lactate-clearance',
    keywords: ["lactate clearance","septic shock","surviving sepsis","resuscitation kinetics","hyperlactatemia"],
    specialties: ["critical-care","emergency"],
    icon: Activity,
    isFeatured: true
  },
  {
    id: 'child-pugh-decompensated',
    title: {"en":"Child-Pugh Score for Cirrhosis & Surgical Mortality","fr":"Score de Child-Pugh (Cirrhose & Risque Chirurgical)","ar":"تصنيف تشايلد-بو لشدة تشمع الكبد وبقاء المريض"},
    category: {"en":"Gastroenterology & Hepatology","fr":"Hépato-Gastroentérologie"},
    path: '/child-pugh-decompensated',
    keywords: ["child pugh","cirrhosis","decompensated liver","surgical mortality","ascites","encephalopathy"],
    specialties: ["gastroenterology","hepatology","surgery"],
    icon: Activity,
    isFeatured: true
  },
  {
    id: 'smart-cop',
    title: {"en":"SMART-COP Score for Severe CAP","fr":"Score SMART-COP (Pneumonie Aiguë Communautaire)","ar":"مقياس سمارت كوب للتنبؤ بالحاجة إلى العناية المركزة في الالتهاب الرئوي"},
    category: {"en":"Pulmonology & Critical Care","fr":"Pneumologie & Réanimation"},
    path: '/smart-cop',
    keywords: ["smart cop","pneumonia","cap","icu admission","mechanical ventilation","vasopressors"],
    specialties: ["pulmonology","critical-care","emergency"],
    icon: Wind,
    isFeatured: true
  },
  {
    id: 'centor-mcisaac',
    title: {"en":"Modified Centor / McIsaac Strep Score","fr":"Score de Centor Modifié (McIsaac - Angine à Streptocoque)","ar":"مقياس ماك آيزاك وسنتور المعدل لالتهاب الحلق العقدي"},
    category: {"en":"Emergency & Infectious Disease","fr":"Urgences & Infectiologie"},
    path: '/centor-mcisaac',
    keywords: ["centor score","mcisaac","group a strep","pharyngitis","tonsillitis","radt"],
    specialties: ["emergency","pediatrics","infectious-disease"],
    icon: Activity,
    isFeatured: true
  },
  {
    id: 'oasis-score',
    title: {"en":"OASIS Score (Oxford Acute Severity of Illness)","fr":"Score OASIS (Sévérité en Réanimation Sans Biologie)","ar":"مقياس أواسيس لتقييم شدة المرض في العناية المركزة بدون تحاليل"},
    category: {"en":"Critical Care","fr":"Soins Intensifs & Réanimation"},
    path: '/oasis-score',
    keywords: ["oasis score","icu mortality","severity of illness","non laboratory model","mimic"],
    specialties: ["critical-care","anesthesiology"],
    icon: Activity,
    isFeatured: true
  },
  {
    id: 'saps-3-score',
    title: {"en":"SAPS 3 Score (First-Hour ICU Physiology)","fr":"Score SAPS 3 (Gravité en Réanimation à la 1ère Heure)","ar":"مقياس سابس 3 للفسيولوجيا الحادة في الساعة الأولى بالعناية"},
    category: {"en":"Critical Care","fr":"Soins Intensifs & Réanimation"},
    path: '/saps-3-score',
    keywords: ["saps 3","icu mortality","acute physiology","admission score","critical care prediction"],
    specialties: ["critical-care","anesthesiology"],
    icon: Activity,
    isFeatured: true
  },
  {
    id: 'frax-score',
    title: {"en":"FRAX 10-Year Fracture Risk Calculator","fr":"Calculateur FRAX (Risque de Fracture Ostéoporotique à 10 Ans)","ar":"حاسبة فراكس لتقييم خطر كسور الهشاشة العظمية خلال 10 سنوات"},
    category: {"en":"Endocrinology & Rheumatology","fr":"Rhumatologie & Endocrinologie"},
    path: '/frax-score',
    keywords: ["frax","osteoporosis","fracture risk","bone mineral density","t-score","bisphosphonate"],
    specialties: ["endocrinology","rheumatology","internal-medicine"],
    icon: Activity,
    isFeatured: true
  },
  {
    id: 'pregnancy-weight-gain',
    title: {"en":"Pregnancy Weight Gain Calculator (IOM Guidelines)","fr":"Prise de Poids pendant la Grossesse (Normes IOM)","ar":"حاسبة زيادة الوزن أثناء الحمل وفق توصيات معهد الطب IOM"},
    category: {"en":"Obstetrics & Gynecology","fr":"Gynécologie & Obstétrique"},
    path: '/pregnancy-weight-gain',
    keywords: ["pregnancy weight gain","gestational weight gain","iom guidelines","acog","prenatal bmi"],
    specialties: ["obstetrics","pediatrics","nutrition"],
    icon: HeartPulse,
    isFeatured: true
  },
  {
    id: 'epds-score',
    title: {"en":"Edinburgh Postnatal Depression Scale (EPDS)","fr":"Échelle d'Édimbourg (Dépression Post-Partum - EPDS)","ar":"مقياس إدنبرة لاكتئاب ما بعد الولادة EPDS"},
    category: {"en":"Psychiatry & Obstetrics","fr":"Psychiatrie & Obstétrique"},
    path: '/epds-score',
    keywords: ["epds","postnatal depression","postpartum depression","perinatal mental health","maternal screening"],
    specialties: ["psychiatry","obstetrics","pediatrics"],
    icon: Brain,
    isFeatured: true
  },
  {
    id: 'pediatric-bp-percentiles',
    title: {"en":"Pediatric Blood Pressure Percentiles (AAP 2017)","fr":"Tension Artérielle Pédiatrique (Normes AAP 2017)","ar":"النسب المئوية لضغط الدم لدى الأطفال وفق الأكاديمية الأمريكية AAP"},
    category: {"en":"Pediatrics & Nephrology","fr":"Pédiatrie & Néphrologie"},
    path: '/pediatric-bp-percentiles',
    keywords: ["pediatric blood pressure","bp percentiles","aap 2017","pediatric hypertension","staging"],
    specialties: ["pediatrics","cardiology","nephrology"],
    icon: HeartPulse,
    isFeatured: true
  }
];

