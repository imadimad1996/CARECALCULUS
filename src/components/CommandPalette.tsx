import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { 
  Search, X, ArrowRight, Activity, Flame, Stethoscope, 
  HeartPulse, Wind, ShieldAlert, Droplet, Pill, TestTube, 
  Sparkles, Layers, BookOpen, AlertTriangle, AlertOctagon, Check
} from 'lucide-react';
import { LangCode } from '../types';
import { ALL_CALCULATORS, CalculatorMeta } from '../data/calculators';
import { useLang } from '../utils/lang';

export interface CommandPaletteProps {
  isOpen?: boolean;
  onClose?: () => void;
  lang?: LangCode;
}

// Accent & diacritic normalization helper
export function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// Medical clinical synonym dictionary for instant intelligent matching
const CLINICAL_SYNONYMS: Record<string, string[]> = {
  // Renal & Kidney
  'crcl': ['creatinine', 'cockcroft', 'clearance', 'gfr', 'ckd'],
  'egfr': ['ckd-epi', 'mdrd', 'schwartz', 'gfr', 'creatinine', 'clearance', 'kidney', 'rein'],
  'gfr': ['ckd-epi', 'mdrd', 'schwartz', 'creatinine', 'clearance', 'dfg'],
  'dfg': ['ckd-epi', 'mdrd', 'schwartz', 'creatinine', 'clairance'],
  'ckd': ['ckd-epi', 'mdrd', 'creatinine', 'clearance', 'fena'],
  'aki': ['fena', 'creatinine', 'free-water-deficit', 'sodium'],
  'kdigo': ['creatinine', 'fena', 'ckd-epi'],
  'creatine': ['creatinine', 'clearance'],

  // Thrombosis & Embolism
  'dvt': ['wells', 'thrombosis', 'tvp', 'clot', 'phlebitis', 'phlebite'],
  'tvp': ['wells', 'thrombosis', 'dvt', 'phlebite', 'phlebitis'],
  'pe': ['wells', 'pulmonary embolism', 'ep', 'perc', 'geneva', 'pesi', 'bova'],
  'ep': ['wells', 'embolie pulmonaire', 'pe', 'perc', 'geneva', 'pesi'],
  'vte': ['wells', 'dvt', 'pe', 'thrombosis', 'has-bled'],
  'clot': ['wells', 'dvt', 'pe', 'has-bled', 'four-ts'],
  'thrombose': ['wells', 'dvt', 'pe', 'tvp'],

  // Cardiology & Chest Pain
  'afib': ['cha2ds2-vasc', 'has-bled', 'stroke', 'atrial fibrillation', 'fa', 'acfa'],
  'af': ['cha2ds2-vasc', 'has-bled', 'stroke', 'atrial fibrillation'],
  'fa': ['cha2ds2-vasc', 'has-bled', 'fibrillation auriculaire', 'avc'],
  'acfa': ['cha2ds2-vasc', 'has-bled', 'fibrillation auriculaire'],
  'acs': ['heart', 'timi', 'grace', 'chest pain', 'stemi', 'nstemi', 'troponin', 'sca'],
  'sca': ['heart', 'timi', 'grace', 'syndrome coronarien', 'troponine'],
  'chest pain': ['heart', 'timi', 'grace', 'perc', 'geneva', 'douleur thoracique'],
  'douleur thoracique': ['heart', 'timi', 'grace', 'chest pain'],
  'troponin': ['heart', 'timi', 'grace', 'acs'],
  'troponine': ['heart', 'timi', 'grace', 'acs'],
  'stemi': ['heart', 'timi', 'grace'],
  'nstemi': ['heart', 'timi', 'grace'],

  // ICU, Sepsis & Critical Care
  'sepsis': ['qsofa', 'sofa', 'sirs', 'infection', 'shock'],
  'septique': ['qsofa', 'sofa', 'sirs', 'infection', 'choc'],
  'shock': ['map', 'qsofa', 'sofa', 'parkland', 'lactate'],
  'choc': ['map', 'qsofa', 'sofa', 'parkland'],
  'icu': ['sofa', 'apache', 'saps', 'cam-icu', 'rass', 'qsofa', 'tidal-volume'],
  'rea': ['sofa', 'apache', 'saps', 'cam-icu', 'rass', 'qsofa', 'reanimation'],
  'gcs': ['glasgow', 'coma', 'neuro', 'pediatric-gcs'],
  'coma': ['glasgow', 'gcs', 'pediatric-gcs', 'rass'],
  'neuro': ['glasgow', 'gcs', 'nihss', 'cam-icu', 'rass'],
  'stroke': ['nihss', 'cha2ds2-vasc', 'has-bled', 'avc'],
  'avc': ['nihss', 'cha2ds2-vasc', 'has-bled', 'stroke'],

  // Pulmonary & Blood Gas
  'abg': ['winters', 'anion-gap', 'pf-ratio', 'aa-gradient', 'acidosis'],
  'gas': ['winters', 'anion-gap', 'pf-ratio', 'aa-gradient'],
  'gaz': ['winters', 'anion-gap', 'pf-ratio', 'aa-gradient'],
  'pao2': ['pf-ratio', 'aa-gradient', 'curb65', 'sofa', 'apache'],
  'fio2': ['pf-ratio', 'aa-gradient'],
  'ards': ['pf-ratio', 'tidal-volume', 'aa-gradient', 'sdra'],
  'sdra': ['pf-ratio', 'tidal-volume', 'aa-gradient', 'ards'],
  'pneumonia': ['curb65', 'curb-65', 'pesi', 'pf-ratio', 'pneumopathie', 'poumon'],
  'pneumopathie': ['curb65', 'curb-65', 'pesi'],
  'curb': ['curb65', 'curb-65', 'pneumonia'],
  'copd': ['abg', 'pf-ratio', 'curb65', 'bpco'],
  'bpco': ['abg', 'pf-ratio', 'curb65'],

  // Hemodynamics
  'map': ['pressure', 'pam', 'arterial', 'sbp', 'dbp', 'blood pressure'],
  'pam': ['pression arterielle moyenne', 'map', 'tension'],
  'bp': ['map', 'qsofa', 'curb65', 'has-bled', 'ascvd'],
  'hypertension': ['has-bled', 'ascvd', 'framingham', 'map'],

  // Liver & Gastro
  'liver': ['meld', 'meld-na', 'child-pugh', 'apri', 'cirrhosis', 'hepatic', 'foie'],
  'cirrhosis': ['meld', 'meld-na', 'child-pugh', 'apri', 'cirrhose'],
  'foie': ['meld', 'meld-na', 'child-pugh', 'apri'],
  'cirrhose': ['meld', 'meld-na', 'child-pugh', 'apri'],
  'hepatite': ['meld', 'child-pugh', 'apri'],

  // Electrolytes & Acid-Base
  'sodium': ['sodium-correction', 'free-water-deficit', 'fena', 'hyponatremia', 'hypernatremia', 'na'],
  'hyponatremia': ['sodium-correction', 'free-water-deficit'],
  'hypernatremia': ['free-water-deficit', 'sodium-correction'],
  'calcium': ['corrected-calcium', 'albumin'],
  'anion gap': ['anion-gap', 'winters', 'osmolal-gap', 'bicarb-deficit'],
  'dka': ['anion-gap', 'bicarb-deficit', 'insulin-sliding-scale', 'winters'],
  'acidosis': ['winters', 'anion-gap', 'bicarb-deficit', 'acidose'],
  'acidose': ['winters', 'anion-gap', 'bicarb-deficit'],

  // Pharmacology, Burns & Fluids
  'burn': ['parkland', 'fluids', 'brulure'],
  'brulure': ['parkland', 'fluids', 'burn'],
  'fluids': ['parkland', 'maintenance-fluids', 'holliday-segar-fluids', 'drip-rate-calculator'],
  'steroid': ['steroid-conversion', 'hydrocortisone', 'prednisone', 'dexamethasone', 'corticoid', 'corticoide'],
  'corticoid': ['steroid-conversion', 'corticoide'],
  'corticoide': ['steroid-conversion', 'steroid'],
  'prednisone': ['steroid-conversion'],
  'dexamethasone': ['steroid-conversion'],
  'hydrocortisone': ['steroid-conversion'],
  'heparin': ['heparin-dosing', 'four-ts-hit-score', 'protamine-reversal', 'heparine'],
  'heparine': ['heparin-dosing', 'four-ts-hit-score', 'protamine-reversal'],
  'opioid': ['opioid-conversion', 'morphine', 'mme', 'opioide'],
  'morphine': ['opioid-conversion'],
  'vancomycin': ['vancomycin-dosing', 'creatinine-clearance'],
  'vanco': ['vancomycin-dosing'],
  'insulin': ['insulin-sliding-scale', 'insuline'],
  'weight': ['adjusted-body-weight', 'bmi-calculator', 'poids', 'ibw', 'abw'],
  'poids': ['adjusted-body-weight', 'bmi-calculator', 'ibw', 'abw'],
  'bmi': ['bmi-calculator', 'adjusted-body-weight', 'imc'],
  'imc': ['bmi-calculator', 'adjusted-body-weight', 'bmi'],
  'ibw': ['adjusted-body-weight', 'tidal-volume'],
  'abw': ['adjusted-body-weight'],
};

// Popular Bedside Shortcuts for quick launch when search query is empty
const QUICK_LAUNCH_ITEMS = [
  { id: 'map', path: '/map-calculator', labelEn: 'MAP (Perfusion)', labelFr: 'PAM (Perfusion)', icon: Activity },
  { id: 'gcs', path: '/glasgow-coma-scale', labelEn: 'Glasgow Coma Scale (GCS)', labelFr: 'Score de Glasgow (GCS)', icon: HeartPulse },
  { id: 'wells', path: '/wells-score', labelEn: "Wells' Criteria (DVT)", labelFr: 'Score de Wells (TVP)', icon: AlertOctagon },
  { id: 'wells-pe', path: '/wells-pe-score', labelEn: "Wells' Score (PE)", labelFr: 'Score de Wells (EP)', icon: AlertOctagon },
  { id: 'qsofa', path: '/qsofa-score', labelEn: 'qSOFA (Sepsis)', labelFr: 'Score qSOFA Sepsis', icon: AlertTriangle },
  { id: 'ckd', path: '/ckd-epi-gfr', labelEn: 'CKD-EPI (eGFR)', labelFr: 'CKD-EPI (DFG)', icon: TestTube },
  { id: 'crcl', path: '/creatinine-clearance', labelEn: 'Creatinine Clearance', labelFr: 'Clairance Créatinine', icon: TestTube },
  { id: 'curb65', path: '/curb65-score', labelEn: 'CURB-65 (Pneumonia)', labelFr: 'CURB-65 (Pneumonie)', icon: Stethoscope },
  { id: 'meld', path: '/meld-score', labelEn: 'MELD Score (Liver)', labelFr: 'Score MELD (Foie)', icon: Activity },
  { id: 'cha2ds2', path: '/cha2ds2-vasc', labelEn: 'CHA2DS2-VASc (AFib Stroke)', labelFr: 'CHA2DS2-VASc (FA AVC)', icon: HeartPulse },
];

export default function CommandPalette(props: CommandPaletteProps) {
  // Support both controlled and uncontrolled mode
  const { lang: contextLang, langPath } = useLang();
  const activeLang = props.lang || contextLang || 'en';
  const navigate = useNavigate();

  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = props.isOpen !== undefined ? props.isOpen : internalIsOpen;

  const handleClose = () => {
    if (props.onClose) {
      props.onClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Listen to keyboard shortcut (Ctrl+K or Cmd+K) and custom events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        e.stopPropagation();
        if (props.isOpen !== undefined) {
          if (isOpen && props.onClose) props.onClose();
        } else {
          setInternalIsOpen(prev => !prev);
        }
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        handleClose();
      }
    };

    const handleCustomOpen = () => {
      if (props.isOpen === undefined) {
        setInternalIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('carecalculus:open-command-palette', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('carecalculus:open-command-palette', handleCustomOpen);
    };
  }, [isOpen, props.isOpen, props.onClose]);

  // Focus input on open & reset query on close
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setQuery('');
      setSelectedIndex(0);
      setSelectedSpecialty('all');
    }
  }, [isOpen]);

  // Intelligent Search Engine
  const searchResults = useMemo(() => {
    const cleanQuery = normalizeText(query);
    if (!cleanQuery) {
      // Empty query: filter by specialty or return featured calculators
      if (selectedSpecialty === 'all') {
        return ALL_CALCULATORS.filter(c => c.isFeatured).slice(0, 10);
      }
      return ALL_CALCULATORS.filter(c => c.specialties?.includes(selectedSpecialty));
    }

    const queryTokens = cleanQuery.split(/\s+/).filter(Boolean);

    // Expand query with clinical synonyms
    const expandedTerms = new Set<string>(queryTokens);
    for (const token of queryTokens) {
      for (const [synKey, relatedTerms] of Object.entries(CLINICAL_SYNONYMS)) {
        if (token === synKey || synKey.includes(token)) {
          relatedTerms.forEach(t => expandedTerms.add(normalizeText(t)));
        }
      }
    }

    const scoredItems = ALL_CALCULATORS.map(calc => {
      const titleEn = normalizeText(calc.title.en || '');
      const titleFr = normalizeText(calc.title.fr || '');
      const titleEs = normalizeText(calc.title.es || '');
      const titleAr = normalizeText(calc.title.ar || '');
      const catEn = normalizeText(calc.category.en || '');
      const catFr = normalizeText(calc.category.fr || '');
      const pathText = normalizeText(calc.path || '');
      const keywords = calc.keywords.map(k => normalizeText(k));

      const searchableText = `${titleEn} ${titleFr} ${titleEs} ${titleAr} ${catEn} ${catFr} ${pathText} ${keywords.join(' ')}`;

      // Multi-token match: check if EVERY token from query matches directly or via synonym
      const allTokensMatch = queryTokens.every(token => {
        if (searchableText.includes(token)) return true;
        // Check if any expanded synonym of this token exists in the item
        for (const [synKey, relatedTerms] of Object.entries(CLINICAL_SYNONYMS)) {
          if (token === synKey || synKey.includes(token)) {
            if (relatedTerms.some(term => searchableText.includes(normalizeText(term)))) {
              return true;
            }
          }
        }
        return false;
      });

      if (!allTokensMatch) return null;

      // Filter by specialty if selected
      if (selectedSpecialty !== 'all' && !calc.specialties?.includes(selectedSpecialty)) {
        return null;
      }

      // Compute relevance score
      let score = 0;
      const activeTitle = normalizeText(calc.title[activeLang] || calc.title.en);

      // Exact title match gets top priority
      if (activeTitle === cleanQuery || titleEn === cleanQuery) score += 120;
      else if (activeTitle.startsWith(cleanQuery) || titleEn.startsWith(cleanQuery)) score += 80;
      else if (activeTitle.includes(cleanQuery) || titleEn.includes(cleanQuery)) score += 50;

      // Token in title
      queryTokens.forEach(t => {
        if (activeTitle.includes(t)) score += 25;
        if (keywords.some(k => k === t)) score += 20;
        else if (keywords.some(k => k.includes(t))) score += 10;
        if (pathText.includes(t)) score += 15;
      });

      if (calc.isFeatured) score += 5;

      return { calc, score };
    }).filter((res): res is { calc: CalculatorMeta; score: number } => res !== null);

    scoredItems.sort((a, b) => b.score - a.score);
    return scoredItems.map(item => item.calc);
  }, [query, selectedSpecialty, activeLang]);

  // Keep selected item within bounds
  useEffect(() => {
    if (selectedIndex >= searchResults.length) {
      setSelectedIndex(0);
    }
  }, [searchResults.length, selectedIndex]);

  // Auto-scroll the selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const handleSelect = (path: string) => {
    const finalPath = langPath ? langPath(path) : path;
    handleClose();
    navigate(finalPath);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults[selectedIndex]) {
        handleSelect(searchResults[selectedIndex].path);
      }
    }
  };

  if (!isOpen) return null;

  const placeholders = {
    en: 'Search 150+ clinical calculators, formulas, scores (e.g., dvt wells, gcs, crcl, map)...',
    fr: 'Rechercher 150+ calculateurs, scores, formules (ex: wells tvp, glasgow, clairance, pam)...',
    es: 'Buscar 150+ calculadoras, escalas clínicas (ej: wells tvp, glasgow, aclaramiento, pam)...',
    ar: 'ابحث في أكثر من 150 حاسبة طبية ومعادلة سريرية...'
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-8 sm:pt-16 px-4 bg-slate-950/75 backdrop-blur-md transition-opacity animate-in fade-in duration-150"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Clinical Decision Support Global Search"
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800/90 overflow-hidden flex flex-col max-h-[85vh] transition-all transform animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/5 dark:ring-white/10"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Unified Search Header with Ambient Glow & Clean Styling */}
        <div className="relative flex items-center px-4 sm:px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 shrink-0 mr-3 border border-teal-100 dark:border-teal-900/40">
            <Search className="w-5 h-5" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder={placeholders[activeLang as keyof typeof placeholders] || placeholders.en}
            className="command-palette-input flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm sm:text-base font-medium"
            autoComplete="off"
            spellCheck="false"
          />

          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mr-2 cursor-pointer"
              title="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleClose}
            className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer"
            title="Press Escape to close"
          >
            ESC
          </button>
        </div>

        {/* Quick Filter Specialty Tabs */}
        <div className="px-4 py-2.5 bg-slate-50/70 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { id: 'all', en: 'All', fr: 'Tous' },
            { id: 'emergency', en: 'Emergency & ICU', fr: 'Urgences & Réa' },
            { id: 'cardiology', en: 'Cardiology', fr: 'Cardiologie' },
            { id: 'pulmonology', en: 'Pulmonology', fr: 'Pneumologie' },
            { id: 'nephrology', en: 'Nephrology', fr: 'Néphrologie' },
            { id: 'pharmaco', en: 'Pharmacology', fr: 'Pharmacologie' },
          ].map(spec => {
            const isTabActive = selectedSpecialty === spec.id;
            return (
              <button
                key={spec.id}
                type="button"
                onClick={() => { setSelectedSpecialty(spec.id); setSelectedIndex(0); }}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isTabActive
                    ? 'bg-teal-600 text-white shadow-xs font-bold'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/70 dark:border-slate-700'
                }`}
              >
                {activeLang === 'fr' ? spec.fr : spec.en}
              </button>
            );
          })}
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent flex-1">
          {searchResults.length === 0 ? (
            <div className="py-12 px-6 text-center">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                {activeLang === 'fr' ? 'Aucun calculateur trouvé' : 'No clinical calculators found'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5 leading-relaxed">
                {activeLang === 'fr'
                  ? "Essayez d'utiliser des termes clés comme 'sepsis', 'wells', 'clairance', 'pam' ou vérifiez l'orthographe."
                  : "Try searching clinical acronyms like 'DVT', 'PE', 'GCS', 'SOFA', 'CrCl', or 'MAP'."}
              </p>

              {/* Instant Suggestions fallback */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 max-w-md mx-auto">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                  {activeLang === 'fr' ? 'Recommandations cliniques :' : 'Popular Bedside Standards:'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {QUICK_LAUNCH_ITEMS.slice(0, 4).map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item.path)}
                      className="px-3 py-1.5 bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 text-xs font-semibold rounded-xl border border-teal-200/70 dark:border-teal-800/60 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <item.icon className="w-3.5 h-3.5" />
                      <span>{activeLang === 'fr' ? item.labelFr : item.labelEn}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {!query && (
                <div className="px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                  <span>{activeLang === 'fr' ? 'Calculateurs Fréquents' : 'Featured Bedside Tools'}</span>
                  <span>{searchResults.length} {activeLang === 'fr' ? 'outils' : 'tools'}</span>
                </div>
              )}

              {searchResults.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                const title = item.title[activeLang] || item.title.en;
                const category = item.category[activeLang] || item.category.en;
                const IconComponent = item.icon || Activity;

                return (
                  <div
                    key={item.id}
                    ref={el => { itemRefs.current[idx] = el; }}
                    onClick={() => handleSelect(item.path)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`group flex items-center justify-between px-3.5 py-3 rounded-2xl cursor-pointer transition-all duration-150 ${
                      isSelected 
                        ? 'bg-teal-500/10 dark:bg-teal-500/15 border border-teal-500/30 text-teal-950 dark:text-teal-100 shadow-xs' 
                        : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`p-2.5 rounded-xl transition-all duration-150 shrink-0 ${
                        isSelected 
                          ? 'bg-teal-600 text-white shadow-xs scale-105' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                          {title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {category}
                          </span>
                          {item.isFeatured && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
                              Gold Standard
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {isSelected ? (
                        <span className="text-xs text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20">
                          <span>{activeLang === 'fr' ? 'Ouvrir' : 'Open'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 transition-colors text-xs font-mono">
                          ↵
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Polished Command Palette Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-mono text-[10px] shadow-3xs">↑↓</kbd>
              <span>{activeLang === 'fr' ? 'Naviguer' : 'Navigate'}</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-mono text-[10px] shadow-3xs">↵</kbd>
              <span>{activeLang === 'fr' ? 'Sélectionner' : 'Select'}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-medium text-slate-400">
              CareCalculus Evidence-Based CDS
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
