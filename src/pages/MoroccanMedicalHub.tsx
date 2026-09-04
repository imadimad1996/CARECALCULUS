import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  GraduationCap, BookOpen, Download, FileText, Search, ExternalLink, 
  ChevronRight, Stethoscope, Award, CheckCircle2, ArrowRight, Activity, Filter
} from 'lucide-react';
import { LangCode } from '../types';
import { Helmet } from 'react-helmet-async';

interface CourseModule {
  id: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  category: 'fmp' | 'ispits' | 'both';
  faculty: string;
  descriptionFr: string;
  descriptionEn: string;
  pdfFile: string;
  fileSize: string;
  associatedCalculators: { name: string; path: string }[];
  keyTopics: string[];
}

const MEDICAL_MODULES: CourseModule[] = [
  {
    id: 'anat-physio-1',
    slug: 'anatomie-et-physiologie-i',
    titleFr: 'Anatomie & Physiologie Humaine I',
    titleEn: 'Human Anatomy & Physiology I',
    category: 'both',
    faculty: 'FMP Casablanca / ISPITS',
    descriptionFr: 'Étude fondamentale de l\'ostéologie, arthrologie, myologie, appareil cardiovasculaire et mécanique ventilatoire respiratoire. Notions clés pour examens et pratique clinique.',
    descriptionEn: 'Foundational study of musculoskeletal anatomy, cardiovascular hemodynamics, and respiratory mechanics for medical and paramedical students.',
    pdfFile: '/pdf/fmp/Cahier-Galien-Lille-Anatomie-Generale-Cours-1.pdf',
    fileSize: '4.9 MB',
    associatedCalculators: [
      { name: 'Calculateur PAM', path: '/map-calculator' },
      { name: 'Volume Courant SDRA', path: '/tidal-volume' },
      { name: 'Rapport PaO2/FiO2', path: '/pf-ratio' }
    ],
    keyTopics: ['Ostéologie', 'Hémodynamique', 'Cycle Cardiaque', 'Mécanique Respiratoire', 'Capillaires']
  },
  {
    id: 'anat-3',
    slug: 'anatomie-iii',
    titleFr: 'Anatomie Clinique & Topographique III',
    titleEn: 'Clinical & Topographical Anatomy III',
    category: 'fmp',
    faculty: 'Faculté de Médecine et de Pharmacie (FMP)',
    descriptionFr: 'Anatomie du thorax, médiastin, abdomen et pelvis. Rapports anatomiques essentiels pour la chirurgie générale et les urgences médico-chirurgicales.',
    descriptionEn: 'Thoracic, mediastinal, abdominal and pelvic regional anatomy with surgical and emergency clinical correlations.',
    pdfFile: '/pdf/fmp/Descritptif-du-module-Anatomie-IV-.pdf',
    fileSize: '260 KB',
    associatedCalculators: [
      { name: 'Score de Wells (TVP)', path: '/wells-score' },
      { name: 'Gradient A-a', path: '/aa-gradient' }
    ],
    keyTopics: ['Médiastin', 'Plèvre & Poumons', 'Péritoine', 'Tronc Cœliaque', 'Loges Musculaires']
  },
  {
    id: 'soins-nephro',
    slug: 'soins-infirmiers-en-nephrologie-et-dialyse',
    titleFr: 'Soins Infirmiers en Néphrologie & Dialyse',
    titleEn: 'Nursing Care in Nephrology & Dialysis',
    category: 'ispits',
    faculty: 'Institut Supérieur des Professions Infirmières (ISPITS)',
    descriptionFr: 'Prise en charge infirmière de l\'insuffisance rénale aiguë et chronique, hémodialyse, dialyse péritonéale, surveillance des abords vasculaires (FAV) et calculs de clairance.',
    descriptionEn: 'Nursing protocols for acute kidney injury (AKI), chronic kidney disease (CKD), hemodialysis monitoring, arteriovenous fistula care, and clearance equations.',
    pdfFile: '/pdf/fmp/chap-1_fondamentaux-pathologie-digestive_octobre-2014.pdf',
    fileSize: '13.8 MB',
    associatedCalculators: [
      { name: 'Clairance Créatinine (Cockcroft)', path: '/creatinine-clearance' },
      { name: 'DFG CKD-EPI 2021', path: '/ckd-epi-gfr' },
      { name: 'Fraction d\'Excrétion Sodium (FENa)', path: '/fena' }
    ],
    keyTopics: ['Insuffisance Rénale Aiguë', 'Stades MRC', 'Hémodialyse', 'Trou Anionique', 'Surveillance FAV']
  },
  {
    id: 'semiologie',
    slug: 'semiologie-medicale',
    titleFr: 'Polycopié de Sémiologie Médicale & Examen Clinique',
    titleEn: 'Medical Semiology & Clinical Examination Handbook',
    category: 'fmp',
    faculty: 'FMP Rabat / Casablanca',
    descriptionFr: 'Le manuel de référence complet de sémiologie médicale : interrogatoire, examen respiratoire, cardiovasculaire, neurologique, digestif et hématologique.',
    descriptionEn: 'Comprehensive clinical semiology reference covering physical examination across cardiology, pulmonology, neurology, and gastroenterology.',
    pdfFile: '/pdf/fmp/poly-semiologie.pdf',
    fileSize: '18.2 MB',
    associatedCalculators: [
      { name: 'Échelle de Glasgow (GCS)', path: '/glasgow-coma-scale' },
      { name: 'Score qSOFA', path: '/qsofa-score' },
      { name: 'Score CURB-65', path: '/curb65-score' }
    ],
    keyTopics: ['Auscultation Cardiaque', 'Souffles Vasculaires', 'Examen Neurologique', 'Palpation Abdominale']
  },
  {
    id: 'pharmaco-gen',
    slug: 'pharmacologie-generale',
    titleFr: 'Pharmacologie Générale & Adaptation Posologique',
    titleEn: 'General Pharmacology & Drug Dosing Manual',
    category: 'both',
    faculty: 'FMP & ISPITS Maroc',
    descriptionFr: 'Pharmacocinétique, pharmacodynamie, voies d\'administration, calculs de doses pédiatriques et adaptation posologique chez l\'insuffisant rénal et hépatique.',
    descriptionEn: 'Pharmacokinetics, volume of distribution, clearance, half-life, and organ-adjusted dosing calculators for hospital practice.',
    pdfFile: '/pdf/fmp/poly_pharmacologie_generale.pdf',
    fileSize: '7.4 MB',
    associatedCalculators: [
      { name: 'Conversion Corticoïdes', path: '/steroid-conversion' },
      { name: 'Poids Ajusté & Idéal', path: '/adjusted-body-weight' },
      { name: 'Débit de Perfusion IV', path: '/drip-rate-calculator' }
    ],
    keyTopics: ['Clairance & Demi-vie', 'Antibioprophylaxie', 'Biodisponibilité', 'Index Thérapeutique']
  },
  {
    id: 'hemato-hemostase',
    slug: 'hematologie-et-hemostase',
    titleFr: 'Hématologie Fondamentale & Hémostase Clinique',
    titleEn: 'Hematology & Clinical Hemostasis',
    category: 'both',
    faculty: 'FMP & Technologie de Laboratoire',
    descriptionFr: 'Étude des lignées sanguines, anémies, leucopénies, hémostase primaire, coagulation plasmatique (TP, TCA, Fibrinogène) et surveillance des anticoagulants.',
    descriptionEn: 'Hematopoiesis, differential count, primary hemostasis, coagulation cascade (PT/INR, aPTT), and anticoagulant monitoring protocols.',
    pdfFile: '/pdf/fmp/140-421-SH_H2026_JFL16_jan.pdf',
    fileSize: '281 KB',
    associatedCalculators: [
      { name: 'Score 4Ts (TIH)', path: '/four-ts-hit-score' },
      { name: 'Neutrophiles Absolus (ANC)', path: '/anc-calculator' },
      { name: 'Index Réticulocytaire', path: '/retic-index' }
    ],
    keyTopics: ['Frottis Sanguin', 'Cascade Coagulation', 'Surveillance Héparine', 'Score 4Ts', 'D-Dimères']
  },
  {
    id: 'anapath',
    slug: 'anatomie-pathologique',
    titleFr: 'Anatomie Pathologique Générale & Spéciale',
    titleEn: 'General & Special Pathological Anatomy',
    category: 'fmp',
    faculty: 'FMP Maroc',
    descriptionFr: 'Lésions élémentaires cellulaires, inflammation aiguë et chronique, processus tumoral, oncogénèse et staging TNM.',
    descriptionEn: 'Cellular pathology, acute/chronic inflammation, neoplasia, oncogenesis, and histological staging guidelines.',
    pdfFile: '/pdf/fmp/poly-anatomie-pathologique.pdf',
    fileSize: '20.7 MB',
    associatedCalculators: [
      { name: 'Score Child-Pugh', path: '/child-pugh-score' },
      { name: 'Score MELD', path: '/meld-score' }
    ],
    keyTopics: ['Biopsies', 'Inflammation', 'Dysplasie & Métaplasie', 'Staging Tumoral', 'Granulomes']
  },
  {
    id: 'ortho-urgences',
    slug: 'orthopedie-et-traumatologie',
    titleFr: 'Orthopédie, Traumatologie & Urgences (iECN)',
    titleEn: 'Orthopedics, Traumatology & Emergency Triage',
    category: 'fmp',
    faculty: 'Faculté de Médecine / ECN',
    descriptionFr: 'Prise en charge des fractures, entorses, luxations, traumatismes crâniens, polytraumatisés et scores de gravité en salle de déchoquage.',
    descriptionEn: 'Emergency orthopedic management, fractures, polytrauma protocols, and emergency triage scales.',
    pdfFile: '/pdf/fmp/livre iECN orthopédie traumatologie v2 - Partie 1.pdf',
    fileSize: '13.5 MB',
    associatedCalculators: [
      { name: 'Échelle GCS', path: '/glasgow-coma-scale' },
      { name: 'Formule de Parkland (Brûlures)', path: '/parkland-formula' }
    ],
    keyTopics: ['Polytraumatisé', 'Fractures Ouvertes', 'Embolie Graisseuse', 'Syndrome des Loges']
  }
];

interface MoroccanMedicalHubProps {
  type: 'fmp' | 'ispits' | 'all';
  lang: LangCode;
}

export default function MoroccanMedicalHub({ type, lang }: MoroccanMedicalHubProps) {
  const { moduleSlug } = useParams<{ moduleSlug?: string }>();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'fmp' | 'ispits'>(
    type === 'fmp' ? 'fmp' : type === 'ispits' ? 'ispits' : 'all'
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Filter modules
  const filteredModules = useMemo(() => {
    return MEDICAL_MODULES.filter(m => {
      const matchesCategory = 
        selectedCategory === 'all' || 
        m.category === selectedCategory || 
        m.category === 'both';

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch = 
        m.titleFr.toLowerCase().includes(q) ||
        m.titleEn.toLowerCase().includes(q) ||
        m.descriptionFr.toLowerCase().includes(q) ||
        m.keyTopics.some(t => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Deep-linked module if URL has slug
  const activeModule = useMemo(() => {
    if (!moduleSlug) return null;
    return MEDICAL_MODULES.find(m => m.slug === moduleSlug.toLowerCase());
  }, [moduleSlug]);

  const pageTitle = lang === 'fr'
    ? 'Modules Médecine FMP & ISPITS Maroc — Cours & Polycopiés PDF Gratuits | CareCalculus'
    : 'Moroccan Medical & Nursing Academic Hub (FMP & ISPITS) — Free PDF Modules | CareCalculus';

  const pageDesc = lang === 'fr'
    ? 'Consultez et téléchargez les référentiels officiels de médecine (FMP Rabat, Casablanca) et soins infirmiers (ISPITS). Polycopiés académiques en PDF, résumés cliniques et calculateurs médicaux associés.'
    : 'Access official Moroccan Faculty of Medicine (FMP) and Nursing Academy (ISPITS) academic course modules. Free PDF handbooks, revision guides, and bedside clinical calculators.';

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={lang === 'fr' ? 'https://fr.carecalculus.com/cours' : 'https://www.carecalculus.com/cours'} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: 'Référentiel Universitaire FMP & ISPITS Maroc',
            description: pageDesc,
            provider: {
              '@type': 'EducationalOrganization',
              name: 'CareCalculus Medical Academic Registry',
              url: 'https://carecalculus.com'
            },
            educationalCredentialAwarded: 'Certificat de Compétence Clinique',
            hasCourseInstance: {
              '@type': 'CourseInstance',
              courseMode: 'Online Free Clinical Access'
            }
          })}
        </script>
      </Helmet>

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 sm:p-12 mb-10 shadow-2xl border border-teal-500/20 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <GraduationCap className="w-4 h-4" />
            <span>FMP & ISPITS Maroc — Référentiels Académiques 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            {lang === 'fr' 
              ? 'Bibliothèque des Cours Médicaux & Paramédicaux'
              : 'Medical & Nursing Academic Curriculum Library'}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            {lang === 'fr'
              ? 'Accédez gratuitement aux 43 polycopiés de cours, résumés de sémiologie, pharmacologie et soins intensifs dispensés dans les Facultés de Médecine (FMP) et Instituts Paramédicaux (ISPITS). Chaque module intègre directement les calculateurs cliniques de garde correspondants.'
              : 'Access 43 verified academic syllabi, clinical examination handbooks, pharmacology modules, and nursing protocols from Moroccan medical faculties. Each module links directly to corresponding bedside calculators.'}
          </p>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700/60 max-w-lg">
            <div>
              <div className="text-2xl font-black text-teal-400">43+</div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Polycopiés PDF</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400">100%</div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Gratuit & Open</div>
            </div>
            <div>
              <div className="text-2xl font-black text-cyan-400">24/7</div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Accès Hôpital</div>
            </div>
          </div>
        </div>
      </div>

      {/* Target Module Alert (if deep-linked from Google Search) */}
      {activeModule && (
        <div className="mb-8 p-6 bg-teal-50 dark:bg-teal-950/40 border-2 border-teal-500 rounded-2xl shadow-lg animate-in fade-in slide-in-from-top-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <span className="px-2.5 py-0.5 rounded-md bg-teal-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                Module Indexé Google Recommandé
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                {lang === 'fr' ? activeModule.titleFr : activeModule.titleEn}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
                {lang === 'fr' ? activeModule.descriptionFr : activeModule.descriptionEn}
              </p>
            </div>
            <a
              href={activeModule.pdfFile}
              download
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>{lang === 'fr' ? 'Télécharger le Cours PDF' : 'Download Course PDF'} ({activeModule.fileSize})</span>
            </a>
          </div>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        {/* Institutional Filter Pills */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            Tous les Modules
          </button>
          <button
            onClick={() => setSelectedCategory('fmp')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'fmp'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>FMP Médecine</span>
          </button>
          <button
            onClick={() => setSelectedCategory('ispits')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'ispits'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>ISPITS Paramédical</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'fr' ? 'Rechercher un module, sujet, organe...' : 'Search course, topic, organ...'}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
          />
        </div>
      </div>

      {/* Course Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredModules.map((module) => (
          <div
            key={module.id}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
          >
            <div>
              {/* Card Badge & Size */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                  {module.faculty}
                </span>
                <span className="text-[11px] font-mono text-slate-400 font-semibold">
                  PDF • {module.fileSize}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {lang === 'fr' ? module.titleFr : module.titleEn}
              </h3>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                {lang === 'fr' ? module.descriptionFr : module.descriptionEn}
              </p>

              {/* Key Topics */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {module.keyTopics.map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-[10px] font-medium"
                  >
                    #{topic}
                  </span>
                ))}
              </div>

              {/* Associated Clinical Calculators */}
              {module.associatedCalculators.length > 0 && (
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
                    {lang === 'fr' ? 'Outils de calculs associés pour ce cours :' : 'Associated bedside clinical tools:'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {module.associatedCalculators.map((calc) => (
                      <Link
                        key={calc.path}
                        to={calc.path}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-900/40 text-slate-700 dark:text-slate-200 hover:text-teal-700 text-xs font-semibold rounded-lg transition-colors"
                      >
                        <Activity className="w-3 h-3 text-teal-600" />
                        <span>{calc.name}</span>
                        <ChevronRight className="w-3 h-3 opacity-60" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
              <Link
                to={`/ispits/${module.slug}`}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Fiche détaillée →
              </Link>
              <a
                href={module.pdfFile}
                download
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger PDF</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Academic Partnership & E-E-A-T Disclaimer */}
      <div className="mt-16 p-8 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs leading-relaxed space-y-3">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
          <BookOpen className="w-4 h-4 text-teal-600" />
          <span>Accompagnement Pédagogique Médical & Paramédical (Maroc & Francophonie)</span>
        </div>
        <p>
          Ces supports de cours et polycopiés sont mis à disposition à titre pédagogique pour les étudiants des Facultés de Médecine et de Pharmacie (FMP), des Instituts Supérieurs des Professions Infirmières (ISPITS) et des internes en stage hospitalier. Les calculateurs CareCalculus permettent de relier la théorie clinique aux calculs de posologie et scores de gravité en temps réel au lit du malade.
        </p>
      </div>
    </div>
  );
}
