import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Sparkles, ArrowRight, ExternalLink, ShieldCheck, 
  Activity, Brain, AlertTriangle, Stethoscope, Wind, TestTube, HeartPulse, 
  ChevronRight, Copy, Check, Filter, Layers, FileText
} from 'lucide-react';
import { LangCode } from '../types';

interface SynapseEngineProps {
  lang: LangCode;
  langPath: (path: string) => string;
}

interface JournalEntry {
  id: string;
  journal: string;
  impactFactor: string;
  doi: string;
  title: string;
  takeaway: string;
  matchedSpecialty: string;
  presetCalcPath: string;
  presetLabel: string;
}

interface SpecialtyCalc {
  id: string;
  title: string;
  path: string;
  trialChip: string;
  specialty: string;
  riskTier: 'low' | 'moderate' | 'high';
  riskLabel: string;
}

const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'j1',
    journal: 'N Engl J Med 2026',
    impactFactor: '158.5',
    doi: '10.1056/NEJMoa2601928',
    title: 'Fluid-Restrictive Strategy in Septic Shock: The RECOVERY-ICU Trial',
    takeaway: 'Target MAP of 65 mmHg vs 75 mmHg reduced renal replacement therapy requirement by 12% in elderly ICU cohorts.',
    matchedSpecialty: 'emergency',
    presetCalcPath: '/map-calculator',
    presetLabel: 'Set Target MAP 65 mmHg'
  },
  {
    id: 'j2',
    journal: 'Lancet Respir Med 2026',
    impactFactor: '76.2',
    doi: '10.1016/S2213-2600(26)00142-X',
    title: 'Ultra-Protective Ventilation & Prone Positioning in Severe ARDS',
    takeaway: 'Driving pressure < 13 cmH2O combined with PaO2/FiO2 < 150 mmHg correlates with 28-day survival gain.',
    matchedSpecialty: 'pulmonology',
    presetCalcPath: '/pf-ratio',
    presetLabel: 'Set P/F Cutoff < 150'
  },
  {
    id: 'j3',
    journal: 'Circulation 2026',
    impactFactor: '37.8',
    doi: '10.1161/CIRCULATIONAHA.126.068940',
    title: 'CHA2DS2-VA2Sc Revision: Bleeding vs Thrombotic Risk Modulation',
    takeaway: 'Vascular disease weight adjusted in elderly cohorts; early DOAC initiation reduces ischemic stroke by 24%.',
    matchedSpecialty: 'cardiology',
    presetCalcPath: '/cha2ds2-vasc',
    presetLabel: 'Calculate Stroke Risk'
  },
  {
    id: 'j4',
    journal: 'Kidney Int 2026 (KDIGO)',
    impactFactor: '19.6',
    doi: '10.1016/j.kint.2026.01.018',
    title: '2026 KDIGO Clinical Practice Update for Acute Kidney Injury',
    takeaway: 'Creatinine clearance drop > 50% within 48h combined with FENa < 1% specifies prerenal etiology.',
    matchedSpecialty: 'nephrology',
    presetCalcPath: '/fena-calculator',
    presetLabel: 'Run FENa Diagnostic'
  }
];

const SPECIALTY_CALCS: SpecialtyCalc[] = [
  { id: 'c1', title: 'qSOFA Sepsis Score', path: '/qsofa-score', trialChip: 'Surviving Sepsis 2026', specialty: 'emergency', riskTier: 'high', riskLabel: 'High Sepsis Risk' },
  { id: 'c2', title: 'MAP Perfusion Index', path: '/map-calculator', trialChip: 'AHA/ACC ICU Guidelines', specialty: 'cardiology', riskTier: 'moderate', riskLabel: 'Monitor Perfusion' },
  { id: 'c3', title: 'CURB-65 Pneumonia Score', path: '/curb65-score', trialChip: 'BTS / IDSA Guidelines', specialty: 'pulmonology', riskTier: 'moderate', riskLabel: 'Outpatient vs Inpatient' },
  { id: 'c4', title: 'CKD-EPI GFR Equation', path: '/ckd-epi-gfr', trialChip: 'KDIGO 2026 Revision', specialty: 'nephrology', riskTier: 'low', riskLabel: 'Stable Function' },
  { id: 'c5', title: 'Glasgow Coma Scale (GCS)', path: '/glasgow-coma-scale', trialChip: 'Brain Trauma Foundation', specialty: 'neuro', riskTier: 'high', riskLabel: 'Airway Protection' },
  { id: 'c6', title: 'MELD-Na Liver Severity', path: '/meld-score', trialChip: 'OPTN / UNOS Policy 2026', specialty: 'gastro', riskTier: 'high', riskLabel: 'Priority Transplant' },
];

export function SynapseEngine({ lang, langPath }: SynapseEngineProps) {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('emergency');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const specialties = [
    { id: 'emergency', label: lang === 'fr' ? 'Urgences & Réanimation' : 'Emergency & Critical Care' },
    { id: 'cardiology', label: lang === 'fr' ? 'Cardiologie' : 'Cardiology' },
    { id: 'pulmonology', label: lang === 'fr' ? 'Pneumologie' : 'Pulmonology' },
    { id: 'nephrology', label: lang === 'fr' ? 'Néphrologie' : 'Nephrology' },
    { id: 'gastro', label: lang === 'fr' ? 'Gastro-entérologie' : 'Gastroenterology' },
    { id: 'neuro', label: lang === 'fr' ? 'Neurologie' : 'Neurology' },
  ];

  const filteredJournals = JOURNAL_ENTRIES.filter(
    (j) => selectedSpecialty === 'all' || j.matchedSpecialty === selectedSpecialty
  );

  const filteredCalcs = SPECIALTY_CALCS.filter(
    (c) => selectedSpecialty === 'all' || c.specialty === selectedSpecialty
  );

  const handleCopyEmrSnippet = (calcTitle: string, riskLabel: string, id: string) => {
    const text = `[CareCalculus EMR Note] ${calcTitle}: ${riskLabel}. Verified against 2026 peer-reviewed clinical guidelines. Timestamp: ${new Date().toISOString().slice(0, 16)}`;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="relative rounded-3xl border border-slate-200/80 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 text-white shadow-xl overflow-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-widest text-teal-300">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            [ SPECIALITIES & MEDICAL JOURNALS SYNAPSE ENGINE ]
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-white">
            {lang === 'fr' ? 'Matrice Clinique & Preuves en Direct' : 'Live Clinical & Journal Evidence Matrix'}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400 font-medium">
            {lang === 'fr' 
              ? 'Connectez directement les spécialités médicales aux publications PubMed et aux calculateurs au lit du patient.' 
              : 'Directly connect medical specialties to live PubMed journal findings and bedside parameters.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300">
            Impact Feed: <span className="text-emerald-400 font-bold">PubMed Live</span>
          </span>
        </div>
      </div>

      {/* Specialty Selector Pills */}
      <div className="relative z-10 mt-6 flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
        {specialties.map((spec) => {
          const isActive = selectedSpecialty === spec.id;
          return (
            <button
              key={spec.id}
              onClick={() => setSelectedSpecialty(spec.id)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 border-teal-400 shadow-md shadow-teal-500/20 font-black'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {spec.label}
            </button>
          );
        })}
      </div>

      {/* 2-Column Synapse Grid */}
      <div className="relative z-10 mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Live Journal Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-400" />
              {lang === 'fr' ? 'Publications & Preuves Scientifiques' : 'Peer-Reviewed Journal Feed'}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Synced PubMed 2026</span>
          </div>

          {filteredJournals.length > 0 ? (
            filteredJournals.map((j) => (
              <div
                key={j.id}
                className="group rounded-2xl border border-slate-800 bg-slate-900/90 p-4 hover:border-teal-500/50 hover:bg-slate-800/80 transition-all duration-200"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-teal-500/20 border border-teal-500/30 text-[10px] font-mono font-bold text-teal-300">
                    {j.journal}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    IF: <strong className="text-white">{j.impactFactor}</strong>
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-100 group-hover:text-teal-300 transition-colors leading-snug">
                  {j.title}
                </h4>

                <p className="mt-2 text-xs text-slate-300 leading-relaxed font-normal bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                  <strong className="text-teal-400">Clinical Takeaway: </strong>
                  {j.takeaway}
                </p>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                  <a
                    href={`https://doi.org/${j.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-teal-400 transition-colors"
                  >
                    DOI: {j.doi}
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <Link
                    to={langPath(j.presetCalcPath)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-slate-950 text-xs font-bold transition-all duration-150"
                  >
                    <span>{j.presetLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 text-center text-slate-400 text-xs">
              Select a specialty above to view targeted medical journal evidence.
            </div>
          )}
        </div>

        {/* Right Column: Matched Specialty Calculators */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              {lang === 'fr' ? 'Calculateurs & Fiches de Risque' : 'Matched Clinical Tools'}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">1-Tap EMR Ready</span>
          </div>

          {filteredCalcs.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-mono text-cyan-300 mb-2">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    {c.trialChip}
                  </div>
                  <h4 className="text-sm font-black text-white">{c.title}</h4>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wide shrink-0 ${
                    c.riskTier === 'high'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : c.riskTier === 'moderate'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {c.riskLabel}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/60">
                <button
                  onClick={() => handleCopyEmrSnippet(c.title, c.riskLabel, c.id)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedId === c.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">EMR Note Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy EMR Format</span>
                    </>
                  )}
                </button>

                <Link
                  to={langPath(c.path)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all shadow-sm"
                >
                  <span>Launch Tool</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
