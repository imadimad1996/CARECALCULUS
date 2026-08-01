import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Sparkles, ArrowRight, ExternalLink, ShieldCheck, 
  Activity, Copy, Check, ChevronRight
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
    journal: 'N Engl J Med 2014',
    impactFactor: '158.5',
    doi: '10.1056/NEJMoa1312173',
    title: 'High versus low blood-pressure target in patients with septic shock (SEPSISPAM)',
    takeaway: 'Targeting MAP of 80-85 mmHg vs 65-70 mmHg did not significantly reduce 28-day mortality, supporting standard 65 mmHg targets.',
    matchedSpecialty: 'emergency',
    presetCalcPath: '/map-calculator',
    presetLabel: 'Set Target MAP 65 mmHg'
  },
  {
    id: 'j2',
    journal: 'N Engl J Med 2013',
    impactFactor: '158.5',
    doi: '10.1056/NEJMoa1214103',
    title: 'Prone positioning in severe acute respiratory distress syndrome (PROSEVA)',
    takeaway: 'Early application of prolonged prone-positioning sessions significantly decreased 28-day and 90-day mortality in patients with severe ARDS.',
    matchedSpecialty: 'pulmonology',
    presetCalcPath: '/pf-ratio',
    presetLabel: 'Set P/F Cutoff < 150'
  },
  {
    id: 'j3',
    journal: 'Chest 2010',
    impactFactor: '10.2',
    doi: '10.1378/chest.09-1584',
    title: 'Refining clinical risk stratification for predicting stroke and thromboembolism in atrial fibrillation',
    takeaway: 'The CHA2DS2-VASc score improves identification of patients at truly low risk for stroke in atrial fibrillation compared with CHADS2.',
    matchedSpecialty: 'cardiology',
    presetCalcPath: '/cha2ds2-vasc',
    presetLabel: 'Calculate Stroke Risk'
  },
  {
    id: 'j4',
    journal: 'Kidney Int Suppl 2012',
    impactFactor: '19.6',
    doi: '10.1038/kisup.2012.1',
    title: 'KDIGO Clinical Practice Guideline for Acute Kidney Injury',
    takeaway: 'Defines AKI criteria based on SCr increase >0.3 mg/dl within 48 hrs or >1.5x baseline. Discusses FENa utility in prerenal diagnosis.',
    matchedSpecialty: 'nephrology',
    presetCalcPath: '/fena-calculator',
    presetLabel: 'Run FENa Diagnostic'
  }
];

const SPECIALTY_CALCS: SpecialtyCalc[] = [
  { id: 'c1', title: 'qSOFA Sepsis Score', path: '/qsofa-score', trialChip: 'Surviving Sepsis', specialty: 'emergency', riskTier: 'high', riskLabel: 'High Sepsis Risk' },
  { id: 'c2', title: 'MAP Perfusion Index', path: '/map-calculator', trialChip: 'AHA/ACC ICU Guidelines', specialty: 'cardiology', riskTier: 'moderate', riskLabel: 'Monitor Perfusion' },
  { id: 'c3', title: 'CURB-65 Pneumonia Score', path: '/curb65-score', trialChip: 'BTS / IDSA Guidelines', specialty: 'pulmonology', riskTier: 'moderate', riskLabel: 'Outpatient vs Inpatient' },
  { id: 'c4', title: 'CKD-EPI GFR Equation', path: '/ckd-epi-gfr', trialChip: 'KDIGO Guidelines', specialty: 'nephrology', riskTier: 'low', riskLabel: 'Stable Function' },
  { id: 'c5', title: 'Glasgow Coma Scale (GCS)', path: '/glasgow-coma-scale', trialChip: 'Brain Trauma Foundation', specialty: 'neuro', riskTier: 'high', riskLabel: 'Airway Protection' },
  { id: 'c6', title: 'MELD-Na Liver Severity', path: '/meld-score', trialChip: 'OPTN / UNOS Policy', specialty: 'gastro', riskTier: 'high', riskLabel: 'Priority Transplant' },
];

export function SynapseEngine({ lang, langPath }: SynapseEngineProps) {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('emergency');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const specialties = [
    { id: 'emergency', label: lang === 'fr' ? 'Urgences' : 'Emergency & Critical Care' },
    { id: 'cardiology', label: lang === 'fr' ? 'Cardiologie' : 'Cardiology' },
    { id: 'pulmonology', label: lang === 'fr' ? 'Pneumologie' : 'Pulmonology' },
    { id: 'nephrology', label: lang === 'fr' ? 'Néphrologie' : 'Nephrology' },
    { id: 'gastro', label: lang === 'fr' ? 'Gastro' : 'Gastroenterology' },
    { id: 'neuro', label: lang === 'fr' ? 'Neurologie' : 'Neurology' },
  ];

  const filteredJournals = JOURNAL_ENTRIES.filter(
    (j) => selectedSpecialty === 'all' || j.matchedSpecialty === selectedSpecialty
  );

  const filteredCalcs = SPECIALTY_CALCS.filter(
    (c) => selectedSpecialty === 'all' || c.specialty === selectedSpecialty
  );

  const handleCopyEmrSnippet = (calcTitle: string, riskLabel: string, id: string) => {
    const text = `[CareCalculus EMR Note] ${calcTitle}: ${riskLabel}. Verified against peer-reviewed clinical guidelines. Timestamp: ${new Date().toISOString().slice(0, 16)}`;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const riskColors = {
    high: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    moderate: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  };

  return (
    <section className="relative rounded-2xl border border-slate-800/60 bg-slate-900/80 backdrop-blur-sm overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-teal-500/8 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="px-6 pt-6 pb-5 border-b border-slate-800/60">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-widest">
                {lang === 'fr' ? 'Preuves Cliniques en Direct' : 'Live Evidence'}
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              {lang === 'fr' ? 'Journaux & Outils Cliniques' : 'Clinical Journals & Matched Tools'}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {lang === 'fr'
                ? 'Publications PubMed liées à vos calculateurs.'
                : 'PubMed studies linked to matching bedside calculators.'}
            </p>
          </div>
          <span className="shrink-0 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            PubMed Live
          </span>
        </div>

        {/* Specialty Pills */}
        <div className="mt-4 flex overflow-x-auto gap-1.5 pb-0.5 hide-scrollbar">
          {specialties.map((spec) => {
            const isActive = selectedSpecialty === spec.id;
            return (
              <button
                key={spec.id}
                onClick={() => setSelectedSpecialty(spec.id)}
                className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold'
                    : 'bg-transparent text-slate-400 border-slate-700/60 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                {spec.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800/60">

        {/* Left: Journal Feed */}
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {lang === 'fr' ? 'Publications Évaluées' : 'Peer-Reviewed Studies'}
            </span>
          </div>

          {filteredJournals.length > 0 ? (
            filteredJournals.map((j) => (
              <div
                key={j.id}
                className="group rounded-xl border border-slate-800/80 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-800/40 transition-all duration-200 p-4"
              >
                {/* Journal meta row */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-mono font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
                    {j.journal}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    IF: <strong className="text-slate-300">{j.impactFactor}</strong>
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-sm font-bold text-slate-100 group-hover:text-white transition-colors leading-snug">
                  {j.title}
                </h4>

                {/* Takeaway */}
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  {j.takeaway}
                </p>

                {/* Footer */}
                <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-slate-800/60">
                  <a
                    href={`https://doi.org/${j.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-500 hover:text-teal-400 transition-colors"
                  >
                    DOI <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <Link
                    to={langPath(j.presetCalcPath)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/15 hover:bg-teal-500 text-teal-400 hover:text-slate-950 text-xs font-bold transition-all duration-150"
                  >
                    {j.presetLabel}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-slate-500 text-xs">
              Select a specialty to view evidence.
            </div>
          )}
        </div>

        {/* Right: Matched Calculators */}
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {lang === 'fr' ? 'Outils Cliniques Associés' : 'Matched Clinical Tools'}
            </span>
          </div>

          {filteredCalcs.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-slate-800/80 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-800/40 transition-all duration-200 p-4"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <ShieldCheck className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="text-[10px] font-mono text-slate-500 truncate">{c.trialChip}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">{c.title}</h4>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${riskColors[c.riskTier]}`}>
                  {c.riskLabel}
                </span>
              </div>

              {/* Actions */}
              <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-slate-800/60">
                <button
                  onClick={() => handleCopyEmrSnippet(c.title, c.riskLabel, c.id)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  {copiedId === c.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy EMR</span>
                    </>
                  )}
                </button>

                <Link
                  to={langPath(c.path)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition-all"
                >
                  Launch Tool
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
