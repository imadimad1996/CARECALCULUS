import React, { useState, useMemo, useEffect } from 'react';
import { BookOpen, Download, GraduationCap, Search, ExternalLink, FileText, Flame, Layers } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { ISPITS_MODULES, ISPITS_MODULE_BY_SLUG, IspitsModule } from '../utils/ispitsModules';
import { LangCode } from '../types';
import { buildJsonLd } from '../utils/seo';
import pdfTranscriptsData from '../data/pdf-transcripts.json';
import GamificationLock from '../components/GamificationLock';

const pdfTranscripts = pdfTranscriptsData as Record<string, { text: string; numpages: number }>;

const translations = {
  en: {
    title: "ISPITS Paramedical Academy",
    subtitle: "Academic library of ISPITS nursing and health technology modules.",
    searchPlaceholder: "Search module, description, or semester...",
    allSemesters: "All Semesters",
    allSpecialties: "All Specialties",
    specialtyLabel: "Specialty",
    specialty_common: "Common Trunk",
    specialty_nursing: "Nursing Care",
    specialty_anesthesia: "Anesthesia & ICU",
    specialty_midwifery: "Sage-Femme (Midwifery)",
    specialty_health_tech: "Health Techniques",
    specialty_rehab: "Rehabilitation",
    allPopularity: "All Popularity",
    popVeryHigh: "Very High (≥85%)",
    popHigh: "High (65-84%)",
    popMedium: "Medium (45-64%)",
    popModerate: "Moderate (<45%)",
    popularity: "Popularity",
    semester: "Semester",
    pdfAvailable: "PDF Available",
    webSearchRequired: "Web Search",
    previewTitle: "Study Dashboard",
    noModuleSelected: "Select a module to begin",
    noModuleSelectedDesc: "Select any paramedical module from the left list to review its curriculum, pre-view the PDF handbook, and search for study resources online.",
    downloadPdf: "Download PDF",
    openNewTab: "Open in New Tab",
    googleSearch: "Search Google",
    googlePdfSearch: "Find PDF on Google",
    ispitsNetSearch: "Find on ISPITS.net",
    webLinks: "External Clinical Resources",
    statModules: "Modules Registered",
    statSpecialties: "Specialties",
    statSemesters: "Semesters",
    notAvailable: "PDF Handbook not loaded directly. You can find it online using the search helper links below.",
  },
  fr: {
    title: "Académie Paramédicale ISPITS",
    subtitle: "Médiathèque des cours et modules des Instituts Supérieurs des Professions Infirmières (ISPITS).",
    searchPlaceholder: "Rechercher un module, description, semestre...",
    allSemesters: "Tous les Semestres",
    allSpecialties: "Toutes les Spécialités",
    specialtyLabel: "Spécialité",
    specialty_common: "Tronc Commun",
    specialty_nursing: "Soins Infirmiers",
    specialty_anesthesia: "Anesthésie Réanimation",
    specialty_midwifery: "Sage-Femme",
    specialty_health_tech: "Techniques de Santé",
    specialty_rehab: "Rééducation & Réhabilitation",
    allPopularity: "Toutes popularités",
    popVeryHigh: "Très Haute (≥85%)",
    popHigh: "Haute (65-84%)",
    popMedium: "Moyenne (45-64%)",
    popModerate: "Modérée (<45%)",
    popularity: "Popularité",
    semester: "Semestre",
    pdfAvailable: "Document PDF Disponible",
    webSearchRequired: "Recherche Web",
    previewTitle: "Espace d'Étude Interactif",
    noModuleSelected: "Sélectionnez un module pour commencer",
    noModuleSelectedDesc: "Choisissez un module paramédical dans la liste de gauche pour consulter son programme, prévisualiser le manuel PDF officiel et rechercher des ressources.",
    downloadPdf: "Télécharger le PDF",
    openNewTab: "Ouvrir dans un nouvel onglet",
    googleSearch: "Rechercher sur Google",
    googlePdfSearch: "Trouver le PDF sur Google",
    ispitsNetSearch: "Rechercher sur ISPITS.net",
    webLinks: "Ressources Cliniques Externes",
    statModules: "Modules Enregistrés",
    statSpecialties: "Spécialités",
    statSemesters: "Semestres",
    notAvailable: "Ce document PDF n'est pas chargé directement. Utilisez les liens ci-dessous pour le trouver en ligne.",
  }
};

export default function IspitsAcademic({ lang }: { lang: LangCode }) {
  const t = translations[lang] || translations.en;
  const isRtl = false;
  const { moduleSlug } = useParams<{ moduleSlug?: string }>();
  const navigate = useNavigate();

  const [selectedModule, setSelectedModule] = useState<IspitsModule | null>(() => {
    if (moduleSlug && ISPITS_MODULE_BY_SLUG[moduleSlug]) return ISPITS_MODULE_BY_SLUG[moduleSlug];
    return null;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<'all' | 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6'>('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState<'all' | 'common' | 'nursing' | 'anesthesia' | 'midwifery' | 'health_tech' | 'rehab'>('all');
  const [selectedPopFilter, setSelectedPopFilter] = useState<'all' | 'very_high' | 'high' | 'medium' | 'moderate'>('all');
  const [activePartIndex, setActivePartIndex] = useState(0);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

  // Sync selected module when the URL slug changes (e.g. browser back/forward)
  useEffect(() => {
    if (moduleSlug && ISPITS_MODULE_BY_SLUG[moduleSlug]) {
      setSelectedModule(ISPITS_MODULE_BY_SLUG[moduleSlug]);
    } else if (!moduleSlug) {
      setSelectedModule(null);
    }
    setActivePartIndex(0);
  }, [moduleSlug]);

  const getPopularityLevel = (pctStr: string): string => {
    const pct = parseInt(pctStr.replace('%', '').trim());
    if (pct >= 85) return 'very_high';
    if (pct >= 65) return 'high';
    if (pct >= 45) return 'medium';
    return 'moderate';
  };

  // Filter modules
  const filteredModules = useMemo(() => {
    return ISPITS_MODULES.filter(m => {
      const matchesSearch = 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.semester.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSemester = selectedSemester === 'all' || m.semester === selectedSemester;
      const matchesSpecialty = selectedSpecialty === 'all' || m.specialty === selectedSpecialty;

      const popLevel = getPopularityLevel(m.popularity);
      const matchesPop = selectedPopFilter === 'all' || popLevel === selectedPopFilter;

      return matchesSearch && matchesSemester && matchesSpecialty && matchesPop;
    });
  }, [searchQuery, selectedSemester, selectedSpecialty, selectedPopFilter]);

  // Dynamic colors for semester tags
  const getSemesterBadgeClass = (sem: string): string => {
    if (sem === 'S1' || sem === 'S2') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (sem === 'S3' || sem === 'S4') return 'bg-sky-50 text-sky-700 border-sky-100';
    return 'bg-violet-50 text-violet-700 border-violet-100';
  };

  // Popularity color indicators
  const getPopularityColor = (pctStr: string): string => {
    const pct = parseInt(pctStr.replace('%', '').trim());
    if (pct >= 85) return '#E74C3C'; // Red
    if (pct >= 65) return '#F0B429'; // Gold
    if (pct >= 45) return '#4A90D9'; // Blue
    return '#7A8099'; // Gray
  };

  const getPopularityBgClass = (pctStr: string): string => {
    const pct = parseInt(pctStr.replace('%', '').trim());
    if (pct >= 85) return 'bg-red-50 text-red-700 border-red-100';
    if (pct >= 65) return 'bg-amber-50 text-amber-700 border-amber-100';
    if (pct >= 45) return 'bg-blue-50 text-blue-700 border-blue-100';
    return 'bg-gray-50 text-gray-700 border-gray-100';
  };

  const handleSelectModule = (mod: IspitsModule) => {
    setSelectedModule(mod);
    setIsMobileDetailOpen(true);
    // Update the URL so each module gets its own deep-linkable URL.
    const prefix = lang === 'en' ? '' : `/${lang}`;
    navigate(`${prefix}/ispits/${mod.slug}`, { replace: false });
  };

  const stats = useMemo(() => {
    const total = ISPITS_MODULES.length;
    const withPdfs = ISPITS_MODULES.filter(m => m.pdf_file || (m.pdf_parts && m.pdf_parts.length > 0)).length;
    return { total, withPdfs };
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-sky-55 text-sky-600 rounded-md border border-sky-100 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono font-black text-sky-600 uppercase tracking-widest leading-none">
                ISPITS ACADEMY MOROCCO
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
              {t.title}
            </h1>
            <p className="text-xs text-gray-400 font-semibold max-w-xl">
              {t.subtitle}
            </p>
          </div>
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 max-w-sm w-full md:w-auto">
            <div className="bg-gray-50 border border-gray-150 p-3 rounded-xl text-center">
              <span className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">{t.statModules}</span>
              <span className="text-lg font-black text-slate-700">{stats.total}</span>
            </div>
            <div className="bg-sky-50/50 border border-sky-100 p-3 rounded-xl text-center">
              <span className="block text-xs font-mono font-bold text-sky-500 uppercase tracking-wider">{t.statSpecialties}</span>
              <span className="text-lg font-black text-sky-600">6 Filières</span>
            </div>
            <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl text-center">
              <span className="block text-xs font-mono font-bold text-blue-500 uppercase tracking-wider">{t.statSemesters}</span>
              <span className="text-lg font-black text-blue-600">6 Semestres</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter Rail */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs space-y-4">
        {/* Search, Specialty, and Popularity Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`} />
            <input
              id="ispits-search-bar"
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full py-2 bg-gray-50 focus:bg-white text-gray-900 border border-gray-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100/40 outline-none rounded-xl text-xs font-bold transition-all placeholder-gray-400 ${
                isRtl ? 'pr-9 pl-8 text-right' : 'pl-9 pr-8 text-left'
              }`}
              style={{ minHeight: '40px' }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0 justify-end">
            {/* Specialty Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold hidden sm:inline">
                {t.specialtyLabel}:
              </span>
              <select
                id="ispits-specialty-select"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value as any)}
                className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100/30"
                style={{ minHeight: '40px' }}
              >
                <option value="all">{t.allSpecialties}</option>
                <option value="common">{t.specialty_common}</option>
                <option value="nursing">{t.specialty_nursing}</option>
                <option value="anesthesia">{t.specialty_anesthesia}</option>
                <option value="midwifery">{t.specialty_midwifery}</option>
                <option value="health_tech">{t.specialty_health_tech}</option>
                <option value="rehab">{t.specialty_rehab}</option>
              </select>
            </div>

            {/* Popularity Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold hidden sm:inline">
                {t.popularity}:
              </span>
              <select
                id="ispits-popularity-select"
                value={selectedPopFilter}
                onChange={(e) => setSelectedPopFilter(e.target.value as any)}
                className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100/30"
                style={{ minHeight: '40px' }}
              >
                <option value="all">{t.allPopularity}</option>
                <option value="very_high">{t.popVeryHigh}</option>
                <option value="high">{t.popHigh}</option>
                <option value="medium">{t.popMedium}</option>
                <option value="moderate">{t.popModerate}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Academic Semester Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin border-t border-gray-100 pt-3">
          {([
            { value: 'all', label: t.allSemesters },
            { value: 'S1', label: 'Semestre 1' },
            { value: 'S2', label: 'Semestre 2' },
            { value: 'S3', label: 'Semestre 3' },
            { value: 'S4', label: 'Semestre 4' },
            { value: 'S5', label: 'Semestre 5' },
            { value: 'S6', label: 'Semestre 6' }
          ] as const).map((tab) => {
            const isActive = selectedSemester === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setSelectedSemester(tab.value)}
                className={`py-2 px-4 rounded-full text-xs font-bold whitespace-nowrap transition-all border tracking-tight uppercase cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white border-sky-600 shadow-md font-extrabold'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-gray-800'
                }`}
                style={{ minHeight: '36px' }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Split Layout Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Modules Feed */}
        <div className="lg:col-span-5 space-y-3 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin">
          {filteredModules.length === 0 ? (
            <div className="bg-white p-8 text-center border border-gray-200 rounded-xl space-y-2">
              <FileText className="w-8 h-8 text-gray-300 mx-auto animate-pulse" />
              <p className="text-xs font-bold text-gray-400">Aucun module ne correspond à vos filtres.</p>
            </div>
          ) : (
            filteredModules.map((item) => {
              const isSelected = selectedModule?.rank === item.rank;
              const hasPdf = !!item.pdf_file || !!(item.pdf_parts && item.pdf_parts.length > 0);
              return (
                <div
                  key={item.rank}
                  onClick={() => handleSelectModule(item)}
                  className={`bg-white p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col gap-3 group relative overflow-hidden ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50/10 ring-2 ring-sky-500/20 shadow-md scale-[1.01]'
                      : 'border-gray-200 hover:border-sky-300 hover:shadow-xs'
                  }`}
                >
                  {/* Decorative side accent */}
                  <div className={`absolute top-0 bottom-0 left-0 w-1 ${isSelected ? 'bg-sky-500' : 'bg-transparent'}`} />

                  {/* Header Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-[10px] font-black text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                        #{item.rank}
                      </span>
                      <span className={`px-2 py-0.5 border text-[9px] font-mono font-black uppercase tracking-wider rounded-md ${getSemesterBadgeClass(item.semester)}`}>
                        {item.semester}
                      </span>
                      <span className="px-2 py-0.5 border text-[9px] font-mono font-bold bg-slate-50 text-slate-600 rounded">
                        {t[`specialty_${item.specialty}` as keyof typeof t] || item.specialty}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded-md border flex items-center gap-1 ${
                        hasPdf
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700 font-extrabold'
                          : 'bg-amber-50 border-amber-100 text-amber-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${hasPdf ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                        {hasPdf ? t.pdfAvailable : t.webSearchRequired}
                      </span>
                    </div>
                  </div>

                  {/* Body Title */}
                  <div className="space-y-1">
                    <h3 className={`text-xs sm:text-sm font-black leading-snug group-hover:text-sky-600 transition-colors uppercase ${
                      isSelected ? 'text-sky-700' : 'text-slate-800'
                    }`}>
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 leading-relaxed font-semibold line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Popularity progress indicator bar */}
                  <div className="space-y-1 pt-1 border-t border-gray-100/50">
                    <div className="flex items-center justify-between text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                        Popularité
                      </span>
                      <span className="text-slate-600 font-black">{item.popularity}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden border border-gray-200/50">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: item.popularity,
                          backgroundColor: getPopularityColor(item.popularity)
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Textbook PDF Preview or Web search referrals */}
        <div className="hidden lg:block lg:col-span-7 sticky top-6">
          {!selectedModule ? (
            <div className="bg-white p-12 text-center border border-gray-200/80 rounded-2xl min-h-[500px] flex flex-col justify-center items-center shadow-xs">
              <div className="p-4 bg-sky-50 text-sky-600 rounded-full border border-sky-100 mb-4 animate-bounce">
                <BookOpen className="w-10 h-10" />
              </div>
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2">
                {t.noModuleSelected}
              </h2>
              <p className="text-xs text-gray-400 max-w-sm leading-relaxed font-semibold">
                {t.noModuleSelectedDesc}
              </p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200/85 rounded-2xl overflow-hidden flex flex-col min-h-[640px] shadow-sm">
              {/* Preview Header panel */}
              <div className="p-5 bg-gray-50 border-b border-gray-150 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 bg-sky-50 border border-sky-100 text-sky-700 font-mono text-[9px] font-black uppercase rounded">
                      MODULE #{selectedModule.rank}
                    </span>
                    <span className={`px-2.5 py-0.5 border text-[9px] font-mono font-black uppercase rounded ${getSemesterBadgeClass(selectedModule.semester)}`}>
                      {selectedModule.semester}
                    </span>
                    <span className="px-2 py-0.5 border text-[9px] font-mono font-bold bg-slate-100 text-slate-700 rounded">
                      {t[`specialty_${selectedModule.specialty}` as keyof typeof t] || selectedModule.specialty}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded-md border uppercase flex items-center gap-1 ${getPopularityBgClass(selectedModule.popularity)}`}>
                    <Flame className="w-3.5 h-3.5" />
                    Popularité: {selectedModule.popularity}
                  </span>
                </div>

                <div className="space-y-1">
                  <h2 className="text-sm sm:text-base font-black text-slate-800 uppercase tracking-tight leading-snug">
                    {selectedModule.name}
                  </h2>
                  <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                    {selectedModule.description}
                  </p>
                </div>
              </div>

              {/* PDF Preview Frame or Web search suggestions */}
              <div className="flex-1 bg-gray-100 p-4 min-h-[460px] flex flex-col">
                {selectedModule.pdf_parts && selectedModule.pdf_parts.length > 0 && (
                  <div className="flex gap-2 mb-3 bg-white p-1.5 rounded-xl border border-gray-200">
                    {selectedModule.pdf_parts.map((part, index) => (
                      <button
                        key={index}
                        onClick={() => setActivePartIndex(index)}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all uppercase cursor-pointer ${
                          activePartIndex === index
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                        }`}
                      >
                        Partie {index + 1}
                      </button>
                    ))}
                  </div>
                )}
                {selectedModule.pdf_file || (selectedModule.pdf_parts && selectedModule.pdf_parts[activePartIndex]) ? (
                  <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs relative min-h-[420px]">
                    <GamificationLock id={`ispits_${selectedModule.pdf_file || selectedModule.pdf_parts![activePartIndex]}`}>
                      <iframe
                        id="ispits-pdf-frame"
                        src={`/pdf/ispits/${encodeURIComponent(selectedModule.pdf_file || selectedModule.pdf_parts![activePartIndex])}#toolbar=0&navpanes=0`}
                        className="w-full h-full border-0 absolute inset-0"
                        title={selectedModule.name}
                      />
                    </GamificationLock>
                  </div>
                ) : (
                  <div className="flex-1 bg-white border border-gray-200 rounded-xl p-8 text-center flex flex-col justify-center items-center gap-4">
                    <FileText className="w-12 h-12 text-gray-300 animate-pulse" />
                    <div className="space-y-1.5 max-w-sm">
                      <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                        MANUEL PDF NON DISPONIBLE
                      </h4>
                      <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
                        {t.notAvailable}
                      </p>
                    </div>
                  </div>
                )}

                {/* SEO Text Content Container */}
                {selectedModule.pdf_file && (
                  (() => {
                    const pdfFileName = selectedModule.pdf_file;
                    const transcriptKey = `pdf/ispits/${pdfFileName}`;
                    const transcript = pdfTranscripts[transcriptKey];
                    
                    if (transcript && transcript.text) {
                      return (
                        <div className="mt-4 bg-white rounded-xl border border-gray-200 overflow-hidden">
                          <details className="group">
                            <summary className="px-4 py-3 text-xs font-bold text-gray-600 cursor-pointer list-none flex items-center justify-between hover:bg-gray-50 transition">
                              <span>Voir le texte du document (SEO)</span>
                              <span className="transition group-open:rotate-180">
                                <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16"><polyline points="6 9 12 15 18 9"/></svg>
                              </span>
                            </summary>
                            <div className="p-4 border-t border-gray-100 max-h-96 overflow-y-auto">
                              <div className="prose prose-sm max-w-none text-xs text-gray-500 whitespace-pre-wrap">
                                {transcript.text}
                              </div>
                            </div>
                          </details>
                        </div>
                      );
                    }
                    return null;
                  })()
                )}

                {/* External Action Links Panel */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-gray-250">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-sky-600" />
                    {t.webLinks}
                  </span>

                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent("ISPITS " + selectedModule.name + " cours filetype:pdf")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-slate-800 rounded-lg text-[10px] font-bold tracking-tight flex items-center gap-1 transition"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {t.googlePdfSearch}
                    </a>
                    
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent("ISPITS " + selectedModule.name + " " + (lang === 'fr' ? 'cours' : 'modules'))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-slate-800 rounded-lg text-[10px] font-bold tracking-tight flex items-center gap-1 transition"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {t.googleSearch}
                    </a>

                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent("site:ispits.net " + selectedModule.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-sky-50 border border-sky-100 text-sky-700 hover:bg-sky-100 rounded-lg text-[10px] font-bold tracking-tight flex items-center gap-1 transition"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {t.ispitsNetSearch}
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom Frame Controls */}
              <div className="p-4 bg-gray-50 border-t border-gray-150 flex flex-wrap items-center justify-between gap-4 shrink-0">
                <span className="text-[10px] font-mono text-gray-400">
                  Instituts Supérieurs des Professions Infirmières et Techniques de Santé — Maroc
                </span>
                
                {(selectedModule.pdf_file || (selectedModule.pdf_parts && selectedModule.pdf_parts[activePartIndex])) && (
                  <div className="flex gap-2">
                    <a
                      href={`/pdf/ispits/${encodeURIComponent(selectedModule.pdf_file || selectedModule.pdf_parts![activePartIndex])}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 font-mono uppercase border border-gray-300"
                      style={{ minHeight: '38px' }}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{t.openNewTab}</span>
                    </a>

                    <a
                      href={`/pdf/ispits/${encodeURIComponent(selectedModule.pdf_file || selectedModule.pdf_parts![activePartIndex])}`}
                      download={selectedModule.pdf_file || selectedModule.pdf_parts![activePartIndex]}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 font-mono uppercase shadow-md active:scale-95 cursor-pointer"
                      style={{ minHeight: '38px' }}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t.downloadPdf}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Detail Modal Overlay */}
      {isMobileDetailOpen && selectedModule && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] shadow-2xl animate-slide-in">
            {/* Header */}
            <div className="p-4 bg-gray-50 border-b border-gray-150 flex justify-between items-start gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-sky-50 text-sky-700 font-mono text-[9px] font-black rounded border border-sky-150">
                    MODULE #{selectedModule.rank}
                  </span>
                  <span className={`px-2 py-0.5 text-[9px] font-mono font-black rounded border ${getSemesterBadgeClass(selectedModule.semester)}`}>
                    {selectedModule.semester}
                  </span>
                  <span className="px-2 py-0.5 border text-[9px] font-mono font-bold bg-slate-100 text-slate-700 rounded">
                    {t[`specialty_${selectedModule.specialty}` as keyof typeof t] || selectedModule.specialty}
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-800 uppercase leading-snug">
                  {selectedModule.name}
                </h3>
              </div>
              <button
                onClick={() => setIsMobileDetailOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                style={{ minWidth: '32px', minHeight: '32px' }}
              >
                ✕
              </button>
            </div>

            {/* Content frame */}
            <div className="flex-1 bg-gray-100 p-4 overflow-y-auto space-y-4">
              <p className="text-xs text-gray-500 font-semibold bg-white p-3.5 rounded-xl border border-gray-150 leading-relaxed">
                {selectedModule.description}
              </p>

              {/* PDF Preview inside Mobile Modal */}
              {selectedModule.pdf_parts && selectedModule.pdf_parts.length > 0 && (
                <div className="flex gap-2 mb-3 bg-white p-1 rounded-lg border border-gray-200">
                  {selectedModule.pdf_parts.map((part, index) => (
                    <button
                      key={index}
                      onClick={() => setActivePartIndex(index)}
                      className={`flex-1 py-1 px-2 rounded text-xs font-bold transition-all uppercase cursor-pointer ${
                        activePartIndex === index
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      Partie {index + 1}
                    </button>
                  ))}
                </div>
              )}
              {selectedModule.pdf_file || (selectedModule.pdf_parts && selectedModule.pdf_parts[activePartIndex]) ? (
                <div className="w-full h-80 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs relative">
                  <iframe
                    src={`/pdf/ispits/${encodeURIComponent(selectedModule.pdf_file || selectedModule.pdf_parts![activePartIndex])}#toolbar=0&navpanes=0`}
                    className="w-full h-full border-0 absolute inset-0"
                    title={selectedModule.name}
                  />
                </div>
              ) : (
                <div className="p-6 bg-white border border-gray-200 rounded-xl text-center space-y-2">
                  <FileText className="w-10 h-10 text-gray-300 mx-auto" />
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">PDF non disponible</h4>
                  <p className="text-[11px] text-gray-400 leading-normal font-medium">{t.notAvailable}</p>
                </div>
              )}

              {/* Links */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-150 space-y-2">
                <span className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                  {t.webLinks}
                </span>
                <div className="flex flex-col gap-2">
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent("ISPITS " + selectedModule.name + " cours filetype:pdf")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-slate-800 rounded-lg text-xs font-bold tracking-tight flex items-center justify-between transition"
                  >
                    <span>{t.googlePdfSearch}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent("ISPITS " + selectedModule.name + " cours")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-slate-800 rounded-lg text-xs font-bold tracking-tight flex items-center justify-between transition"
                  >
                    <span>{t.googleSearch}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent("site:ispits.net " + selectedModule.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-slate-800 rounded-lg text-xs font-bold tracking-tight flex items-center justify-between transition"
                  >
                    <span>{t.ispitsNetSearch}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-gray-50 border-t border-gray-150 flex gap-2">
              <button
                onClick={() => setIsMobileDetailOpen(false)}
                className="flex-1 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-lg transition font-mono uppercase cursor-pointer border border-gray-300"
                style={{ minHeight: '44px' }}
              >
                Fermer
              </button>
              {(selectedModule.pdf_file || (selectedModule.pdf_parts && selectedModule.pdf_parts[activePartIndex])) && (
                <a
                  href={`/pdf/ispits/${encodeURIComponent(selectedModule.pdf_file || selectedModule.pdf_parts![activePartIndex])}`}
                  download={selectedModule.pdf_file || selectedModule.pdf_parts![activePartIndex]}
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 font-mono uppercase shadow-md cursor-pointer"
                  style={{ minHeight: '44px' }}
                >
                  <Download className="w-4 h-4" />
                  <span>{t.downloadPdf}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
