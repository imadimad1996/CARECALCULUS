import React, { useState } from 'react';
import { BookOpen, AlertTriangle, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { LangCode } from '../types';

interface ClinicalContextProps {
  lang: LangCode;
  pearls: string[];
  pitfalls: string[];
  evidence: string;
  references: string[];
}

export default function ClinicalContextPanel({ lang, pearls, pitfalls, evidence, references }: ClinicalContextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isRtl = false; // Arabic is not currently in LangCode

  const t = {
    en: {
      title: 'Clinical Context & Evidence',
      pearlsTitle: 'Pearls',
      pitfallsTitle: 'Pitfalls',
      evidenceTitle: 'Evidence & Formula',
      referencesTitle: 'References',
      expand: 'Show Details',
      collapse: 'Hide Details'
    },
    fr: {
      title: 'Contexte Clinique & Preuves',
      pearlsTitle: 'Perles',
      pitfallsTitle: 'Pièges',
      evidenceTitle: 'Preuves & Formule',
      referencesTitle: 'Références',
      expand: 'Afficher les détails',
      collapse: 'Masquer les détails'
    }
  }[lang] || { title: 'Clinical Context', pearlsTitle: 'Pearls', pitfallsTitle: 'Pitfalls', evidenceTitle: 'Evidence', referencesTitle: 'References', expand: 'Expand', collapse: 'Collapse' };

  return (
    <div className="mt-8 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm" dir={isRtl ? 'rtl' : 'ltr'}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-teal-600" />
          <h3 className="font-bold text-gray-900">{t.title}</h3>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </button>

      {isExpanded && (
        <div className="p-5 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pearls */}
            {pearls && pearls.length > 0 && (
              <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
                <h4 className="flex items-center gap-2 font-bold text-teal-800 mb-2">
                  <Lightbulb className="w-4 h-4 text-teal-600" />
                  {t.pearlsTitle}
                </h4>
                <ul className="space-y-1">
                  {pearls.map((item, idx) => (
                    <li key={idx} className="text-sm text-teal-900 flex items-start gap-2">
                      <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pitfalls */}
            {pitfalls && pitfalls.length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <h4 className="flex items-center gap-2 font-bold text-red-800 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  {t.pitfallsTitle}
                </h4>
                <ul className="space-y-1">
                  {pitfalls.map((item, idx) => (
                    <li key={idx} className="text-sm text-red-900 flex items-start gap-2">
                      <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Evidence */}
          {evidence && (
            <div className="pt-2 border-t border-gray-100">
              <h4 className="font-bold text-gray-800 mb-2">{t.evidenceTitle}</h4>
              <div className="text-sm text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: evidence }} />
            </div>
          )}

          {/* References */}
          {references && references.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <h4 className="font-bold text-gray-800 mb-2">{t.referencesTitle}</h4>
              <ol className="list-decimal pl-5 space-y-1">
                {references.map((ref, idx) => (
                  <li key={idx} className="text-xs text-gray-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: ref }} />
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
