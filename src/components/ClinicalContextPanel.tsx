import React, { useState } from 'react';
import { BookOpen, AlertTriangle, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { LangCode } from '../types';

interface ClinicalContextProps {
  lang: LangCode;
  pearls?: string[] | string;
  pitfalls?: string[] | string;
  evidence?: string | string[];
  references?: string[] | string;
}

const normalizeList = (item?: string[] | string | null): string[] => {
  if (!item) return [];
  if (Array.isArray(item)) {
    return item
      .map(entry => (typeof entry === 'string' ? entry.trim() : String(entry || '')))
      .filter(entry => entry.length > 0);
  }
  if (typeof item === 'string') {
    const trimmed = item.trim();
    if (!trimmed) return [];
    if (trimmed.includes('\n')) {
      return trimmed
        .split('\n')
        .map(line => line.trim().replace(/^[-•*]\s*/, ''))
        .filter(line => line.length > 0);
    }
    return [trimmed];
  }
  return [];
};

export default function ClinicalContextPanel({ lang, pearls, pitfalls, evidence, references }: ClinicalContextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
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
    },
    es: {
      title: 'Contexto Clínico y Evidencia',
      pearlsTitle: 'Perlas Clínicas',
      pitfallsTitle: 'Errores Frecuentes',
      evidenceTitle: 'Evidencia y Fórmula',
      referencesTitle: 'Referencias',
      expand: 'Mostrar Detalles',
      collapse: 'Ocultar Detalles'
    }
  }[lang] || { 
    title: 'Clinical Context & Evidence', 
    pearlsTitle: 'Pearls', 
    pitfallsTitle: 'Pitfalls', 
    evidenceTitle: 'Evidence & Formula', 
    referencesTitle: 'References', 
    expand: 'Show Details', 
    collapse: 'Hide Details' 
  };

  const pearlsList = normalizeList(pearls);
  const pitfallsList = normalizeList(pitfalls);
  const referencesList = normalizeList(references);
  const evidenceText = Array.isArray(evidence) 
    ? evidence.filter(Boolean).join('<br/><br/>') 
    : (typeof evidence === 'string' ? evidence : '');

  if (pearlsList.length === 0 && pitfallsList.length === 0 && !evidenceText && referencesList.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm" dir="ltr">
      <button 
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
        aria-expanded={isExpanded}
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
            {pearlsList.length > 0 && (
              <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
                <h4 className="flex items-center gap-2 font-bold text-teal-800 mb-2">
                  <Lightbulb className="w-4 h-4 text-teal-600" />
                  {t.pearlsTitle}
                </h4>
                <ul className="space-y-1">
                  {pearlsList.map((item, idx) => (
                    <li key={idx} className="text-sm text-teal-900 flex items-start gap-2">
                      <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-500" />
                      <span dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pitfalls */}
            {pitfallsList.length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <h4 className="flex items-center gap-2 font-bold text-red-800 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  {t.pitfallsTitle}
                </h4>
                <ul className="space-y-1">
                  {pitfallsList.map((item, idx) => (
                    <li key={idx} className="text-sm text-red-900 flex items-start gap-2">
                      <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Evidence */}
          {evidenceText && (
            <div className="pt-2 border-t border-gray-100">
              <h4 className="font-bold text-gray-800 mb-2">{t.evidenceTitle}</h4>
              <div className="text-sm text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: evidenceText }} />
            </div>
          )}

          {/* References */}
          {referencesList.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <h4 className="font-bold text-gray-800 mb-2">{t.referencesTitle}</h4>
              <ol className="list-decimal pl-5 space-y-1">
                {referencesList.map((ref, idx) => (
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
