import React from 'react';
import { SynapseEngine } from '../components/SynapseEngine';
import { LangCode } from '../types';

interface SynapseEnginePageProps {
  lang: LangCode;
  langPath?: (path: string) => string;
}

export default function SynapseEnginePage({ lang, langPath }: SynapseEnginePageProps) {
  const fallbackLangPath = (p: string) => `/${lang === 'en' ? '' : lang + '/'}${p.replace(/^\//, '')}`;
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <SynapseEngine lang={lang} langPath={langPath || fallbackLangPath} />
    </div>
  );
}
