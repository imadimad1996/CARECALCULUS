import React from 'react';
import { LangCode } from '../types';
import AiAnswerPanel from './AiAnswerPanel';

interface CalculatorShellProps {
  logicalPath: string;
  lang: LangCode;
  children: React.ReactNode;
}

export default function CalculatorShell({ logicalPath, lang, children }: CalculatorShellProps) {
  return (
    <div className="space-y-8">
      <AiAnswerPanel logicalPath={logicalPath} lang={lang} />
      {children}
    </div>
  );
}
