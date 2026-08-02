export interface CaseStep {
  title: string;
  titleFr?: string;
  titleAr?: string;
  description: string;
  descriptionFr?: string;
  descriptionAr?: string;
  vitals?: { hr: number; bp: string; temp: number; rr: number; spo2: number };
  question?: {
    text: string;
    textFr?: string;
    textAr?: string;
    options: string[];
    optionsFr?: string[];
    optionsAr?: string[];
    correctIndex: number;
    rationale: string;
    rationaleFr?: string;
    rationaleAr?: string;
  };
}

export interface ClinicalCase {
  id: string;
  titleEn: string;
  titleFr: string;
  titleAr: string;
  steps: CaseStep[];
}

export const CASE_STUDIES_DB: ClinicalCase[] = [
  {
    id: "sepsis",
    titleEn: "Case #1 — Sepsis & Septic Shock in 68M",
    titleFr: "Cas #1 — Sepsis & Choc Septique chez un Patient de 68 ans",
    titleAr: "حالة رقم ١ — تسمم وصدمة إنتانية لمريض يبلغ ٦٨ عامًا",
    steps: [
      {
        title: "Step 1: Patient Presentation",
        titleFr: "Étape 1 : Présentation du patient",
        titleAr: "الخطوة ١: تقديم حالة المريض",
        description: "A 68-year-old male with a history of COPD presents from a nursing home with altered mental status, productive cough, and fever. On arrival, he is lethargic and responds only to loud verbal commands.",
        descriptionFr: "Un homme de 68 ans ayant des antécédents de BPCO est transféré d'un Ehpad pour altération de l'état mental, toux grasse et fièvre. À son arrivée, il est léthargique et ne répond qu'aux commandes verbales fortes.",
        descriptionAr: "رجل يبلغ من العمر 68 عاماً يعاني من تاريخ مرضي لمرض الانسداد الرئوي المزمن (COPD)، يتم تحويله من دار رعاية المسنين بسبب تغير في الحالة العقلية، وسعال رطب، وحمى. عند وصوله، كان في حالة خمول واستجاب فقط للأوامر اللفظية العالية.",
        vitals: { hr: 112, bp: "94/56", temp: 38.9, rr: 26, spo2: 89 }
      },
      {
        title: "Step 2: Risk Scoring",
        titleFr: "Étape 2 : Évaluation du risque",
        titleAr: "الخطوة ٢: تقييم المخاطر السريرية",
        description: "The clinician must immediately evaluate the risk of organ dysfunction. Which bedside score is most appropriate to evaluate critical illness risk in this non-ICU setting?",
        descriptionFr: "Le clinicien doit immédiatement évaluer le risque de dysfonctionnement d'organes. Quel score de chevet est le plus approprié pour évaluer le risque de maladie grave dans ce contexte hors réanimation ?",
        descriptionAr: "يجب على الممارس الصحي تقييم خطر فشل الأعضاء فوراً. ما هو المقياس السريري بجانب السرير الأكثر ملاءمة لتقييم خطر المرض الحرج في هذا الإطار خارج العناية المركزة؟",
        question: {
          text: "Select the most appropriate clinical scoring scheme:",
          textFr: "Sélectionnez le système de scoring clinique le plus approprié :",
          textAr: "اختر نظام التقييم السريري الأكثر ملاءمة:",
          options: ["SIRS Criteria", "qSOFA Score", "MELD Score", "Glasgow Coma Scale (GCS) only"],
          optionsFr: ["Critères du SIRS", "Score qSOFA", "Score MELD", "Échelle de Glasgow (GCS) seule"],
          optionsAr: ["معايير SIRS", "مؤشر qSOFA", "مؤشر MELD", "مقياس غلاسكو (GCS) فقط"],
          correctIndex: 1,
          rationale: "qSOFA (Quick SOFA) is designed specifically as a rapid bedside tool to identify patients outside the ICU at high risk of death from sepsis (respiratory rate >=22/min, altered mentation, systolic BP <=100 mmHg). The patient meets all 3 criteria.",
          rationaleFr: "Le qSOFA (Quick SOFA) est conçu spécifiquement comme un outil de chevet rapide pour identifier les patients hors réanimation présentant un risque élevé de décès par sepsis (fréquence respiratoire >=22/min, état mental altéré, PA systolique <=100 mmHg). Le patient remplit ces 3 critères.",
          rationaleAr: "تم تصميم مؤشر qSOFA (الـ SOFA السريع) خصيصاً كأداة سريعة بجانب السرير لتحديد المرضى خارج العناية المركزة المعرضين لخطر الوفاة بسبب التسمم الدموي (معدل التنفس >=22/دقيقة، وتغير الحالة العقلية، وضغط الدم الانقباضي <=100 ملم زئبقي). المريض يستوفي المعايير الثلاثة بالكامل."
        }
      }
    ]
  },
  {
    id: "dka",
    titleEn: "Case #2 — Severe Diabetic Ketoacidosis in 24M",
    titleFr: "Cas #2 — Acidocétose Diabétique Sévère chez un Patient de 24 ans",
    titleAr: "حالة رقم ٢ — حماض كيتوني سكري شديد لمريض يبلغ ٢٤ عامًا",
    steps: [
      {
        title: "Step 1: Initial Presentation",
        titleFr: "Étape 1 : Présentation Initiale",
        titleAr: "الخطوة ١: العرض الأولي",
        description: "A 24-year-old male with known Type 1 Diabetes presents to the ED with abdominal pain, vomiting, and confusion. He reports missing his insulin doses for the last two days. He is breathing deeply and rapidly (Kussmaul breathing) and his breath smells fruity.",
        descriptionFr: "Un homme de 24 ans atteint de diabète de type 1 connu se présente aux urgences avec des douleurs abdominales, des vomissements et de la confusion. Il signale avoir omis ses doses d'insuline ces deux derniers jours. Sa respiration est ample et rapide (respiration de Kussmaul) et son haleine a une odeur fruitée.",
        descriptionAr: "شاب يبلغ من العمر 24 عاماً يعاني من داء السكري من النوع الأول، وصل إلى قسم الطوارئ وهو يعاني من ألم في البطن، وقيء، وارتباك. يذكر أنه فاتته جرعات الأنسولين في اليومين الماضيين. يتنفس بعمق وبسرعة (تنفس كوسماول) وتفوح من أنفاسه رائحة فاكهية.",
        vitals: { hr: 125, bp: "105/65", temp: 37.1, rr: 32, spo2: 98 }
      },
      {
        title: "Step 2: Initial Investigations",
        titleFr: "Étape 2 : Examens Initiaux",
        titleAr: "الخطوة ٢: الفحوصات الأولية",
        description: "Point-of-care blood glucose reads 'HIGH' (>600 mg/dL). VBG shows pH 7.08, pCO2 20 mmHg, HCO3 9 mEq/L. Serum potassium is 3.1 mEq/L. Which is the MOST appropriate next step in management?",
        descriptionFr: "La glycémie capillaire indique 'HIGH' (>600 mg/dL). Les gaz du sang veineux montrent un pH à 7.08, pCO2 20 mmHg, HCO3 9 mEq/L. Le potassium sérique est à 3.1 mEq/L. Quelle est l'étape suivante LA PLUS appropriée dans la prise en charge ?",
        descriptionAr: "جهاز قياس السكر السريع يشير إلى 'HIGH' (>600 ملغ/ديسيلتر). تحليل غازات الدم الوريدي يظهر درجة حموضة 7.08، وضغط ثاني أكسيد الكربون 20 ملم زئبق، والبيكربونات 9 ملي مكافئ/لتر. البوتاسيوم في الدم 3.1 ملي مكافئ/لتر. ما هي الخطوة التالية الأكثر ملاءمة في العلاج؟",
        question: {
          text: "What is the priority intervention?",
          textFr: "Quelle est l'intervention prioritaire ?",
          textAr: "ما هو التدخل ذو الأولوية؟",
          options: ["Start IV regular insulin infusion immediately", "Administer IV Sodium Bicarbonate", "Administer IV fluids and potassium replacement", "Intubate the patient"],
          optionsFr: ["Débuter immédiatement une perfusion d'insuline rapide", "Administrer du bicarbonate de sodium en IV", "Administrer des fluides IV et remplacer le potassium", "Intuber le patient"],
          optionsAr: ["بدء تسريب الأنسولين العادي عن طريق الوريد فوراً", "إعطاء بيكربونات الصوديوم عن طريق الوريد", "إعطاء السوائل الوريدية وتعويض البوتاسيوم", "تنبيب المريض"],
          correctIndex: 2,
          rationale: "In DKA, profound total body potassium deficit exists. Giving insulin when serum potassium is <3.3 mEq/L will drive K+ into cells and cause severe hypokalemia and fatal arrhythmias. Fluid resuscitation and potassium replacement must occur BEFORE initiating insulin.",
          rationaleFr: "Dans l'ACD, il existe un déficit profond en potassium corporel total. L'administration d'insuline lorsque le potassium sérique est <3.3 mEq/L va faire entrer le K+ dans les cellules et provoquer une hypokaliémie sévère et des arythmies fatales. La réanimation liquidienne et le remplacement du potassium doivent avoir lieu AVANT l'initiation de l'insuline.",
          rationaleAr: "في الحماض الكيتوني السكري، يوجد نقص شديد في إجمالي البوتاسيوم في الجسم. إعطاء الأنسولين عندما يكون البوتاسيوم في الدم <3.3 ملي مكافئ/لتر سيدفع البوتاسيوم إلى داخل الخلايا ويسبب نقص بوتاسيوم الدم الشديد وعدم انتظام ضربات القلب القاتل. يجب إعطاء السوائل وتعويض البوتاسيوم قبل بدء الأنسولين."
        }
      }
    ]
  },
  {
    id: "ards",
    titleEn: "Case #3 — Acute Respiratory Distress Syndrome (ARDS) in 55F",
    titleFr: "Cas #3 — Syndrome de Détresse Respiratoire Aiguë (SDRA) chez une Femme de 55 ans",
    titleAr: "حالة رقم ٣ — متلازمة الضائقة التنفسية الحادة لمريضة تبلغ ٥٥ عامًا",
    steps: [
      {
        title: "Step 1: Escalating Oxygen Needs",
        titleFr: "Étape 1 : Besoins en Oxygène Croissants",
        titleAr: "الخطوة ١: تزايد الحاجة للأكسجين",
        description: "A 55-year-old female admitted 3 days ago for severe viral pneumonia is rapidly deteriorating. She is now on a non-rebreather mask at 15L/min but remains profoundly hypoxemic. Chest X-ray shows bilateral diffuse infiltrates.",
        descriptionFr: "Une femme de 55 ans admise il y a 3 jours pour une pneumonie virale sévère se détériore rapidement. Elle est actuellement sous masque à haute concentration à 15L/min mais reste profondément hypoxémique. La radiographie pulmonaire montre des infiltrats diffus bilatéraux.",
        descriptionAr: "مريضة تبلغ من العمر 55 عاماً أُدخلت قبل 3 أيام بسبب التهاب رئوي فيروسي حاد تتدهور حالتها بسرعة. هي الآن على قناع أكسجين غير قابل لإعادة التنفس بمعدل 15 لتر/دقيقة ولكنها تظل تعاني من نقص شديد في أكسجة الدم. تصوير الصدر بالأشعة السينية يظهر ارتشاحات ثنائية منتشرة.",
        vitals: { hr: 130, bp: "110/70", temp: 39.2, rr: 38, spo2: 84 }
      },
      {
        title: "Step 2: Ventilator Management",
        titleFr: "Étape 2 : Gestion du Respirateur",
        titleAr: "الخطوة ٢: إدارة جهاز التنفس الصناعي",
        description: "The patient is intubated. ABG on FiO2 1.0 reveals PaO2 65 mmHg (P/F ratio = 65). She meets Berlin criteria for severe ARDS. What initial tidal volume setting is appropriate according to ARDSnet protocol?",
        descriptionFr: "La patiente est intubée. Les gaz du sang sous FiO2 1.0 révèlent une PaO2 de 65 mmHg (rapport P/F = 65). Elle remplit les critères de Berlin pour un SDRA sévère. Quel réglage initial du volume courant est approprié selon le protocole ARDSnet ?",
        descriptionAr: "تم تنبيب المريضة. تحليل غازات الدم الشرياني على نسبة أكسجين FiO2 1.0 يظهر PaO2 65 ملم زئبق (نسبة P/F = 65). هي تستوفي معايير برلين لـ ARDS الشديد. ما هو إعداد الحجم المدي (Tidal Volume) الأولي المناسب وفقاً لبروتوكول ARDSnet؟",
        question: {
          text: "Select the correct initial ventilation strategy:",
          textFr: "Sélectionnez la stratégie de ventilation initiale correcte :",
          textAr: "اختر استراتيجية التهوية الأولية الصحيحة:",
          options: ["10-12 mL/kg Predicted Body Weight", "8-10 mL/kg Actual Body Weight", "4-6 mL/kg Predicted Body Weight", "15 mL/kg Predicted Body Weight"],
          optionsFr: ["10-12 mL/kg Poids Corporel Prédit", "8-10 mL/kg Poids Corporel Réel", "4-6 mL/kg Poids Corporel Prédit", "15 mL/kg Poids Corporel Prédit"],
          optionsAr: ["10-12 مل/كجم من وزن الجسم المتوقع", "8-10 مل/كجم من وزن الجسم الفعلي", "4-6 مل/كجم من وزن الجسم المتوقع", "15 مل/كجم من وزن الجسم المتوقع"],
          correctIndex: 2,
          rationale: "The ARDSnet protocol strongly advocates for lung-protective ventilation using low tidal volumes of 4-6 mL/kg based on Predicted Body Weight (PBW) to prevent volutrauma and barotrauma in ARDS.",
          rationaleFr: "Le protocole ARDSnet recommande fortement une ventilation protectrice des poumons en utilisant de faibles volumes courants de 4 à 6 mL/kg basés sur le poids corporel prédit (PBW) pour prévenir le volutrauma et le barotrauma dans le SDRA.",
          rationaleAr: "يدعو بروتوكول ARDSnet بشدة إلى استخدام تهوية واقية للرئة باستخدام أحجام مدية منخفضة تتراوح بين 4-6 مل/كجم بناءً على وزن الجسم المتوقع (PBW) لمنع الرضح الحجمي والرضح الضغطي في حالات الضائقة التنفسية الحادة."
        }
      }
    ]
  }
];
