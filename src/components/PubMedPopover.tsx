import React, { useState } from 'react';
import { ExternalLink, BookOpen, CheckCircle2, Award } from 'lucide-react';

export interface PubMedPopoverProps {
  pmid: string;
  title: string;
  journal: string;
  year: number | string;
  authors: string;
  sampleSize?: string;
  pValue?: string;
  keyConclusion: string;
  children: React.ReactNode;
}

export const PubMedPopover: React.FC<PubMedPopoverProps> = ({
  pmid,
  title,
  journal,
  year,
  authors,
  sampleSize,
  pValue,
  keyConclusion,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const pubmedUrl = `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;

  return (
    <span className="relative inline-block" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <span
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer underline decoration-cyan-500/50 underline-offset-4 hover:text-cyan-400 font-semibold transition-colors"
      >
        {children}
      </span>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 sm:w-96 p-4 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-50 text-white animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
              <BookOpen className="w-3.5 h-3.5" />
              <span>PMID: {pmid}</span>
            </div>
            <a
              href={pubmedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 font-semibold transition"
            >
              <span>PubMed</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <h4 className="font-bold text-sm text-slate-100 leading-snug mb-1">{title}</h4>
          <p className="text-xs text-slate-400 mb-3">{journal} ({year}) • {authors}</p>

          <div className="grid grid-cols-2 gap-2 mb-3 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50 text-xs">
            {sampleSize && (
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Cohort (N)</span>
                <span className="font-bold text-emerald-400">{sampleSize}</span>
              </div>
            )}
            {pValue && (
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Significance</span>
                <span className="font-bold text-cyan-400">{pValue}</span>
              </div>
            )}
          </div>

          <div className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 flex items-start gap-2">
            <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed"><strong className="text-slate-200">Conclusion:</strong> {keyConclusion}</p>
          </div>
        </div>
      )}
    </span>
  );
};
