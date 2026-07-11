import React from 'react';
import { BookOpen, Sparkles, ListChecks } from 'lucide-react';
import { LangCode } from '../types';
import { getFaqData, getHowToSchema, getLocalizedMeta } from '../utils/seo';

interface AiAnswerPanelProps {
  logicalPath: string;
  lang: LangCode;
}

const labels = {
  en: {
    badge: 'AI-ready summary',
    direct: 'Direct answer',
    steps: 'Key steps',
    faq: 'Common questions',
    evidence: 'Why this page is easy to cite',
  },
  fr: {
    badge: 'Résumé AI-friendly',
    direct: 'Réponse directe',
    steps: 'Étapes clés',
    faq: 'Questions fréquentes',
    evidence: 'Pourquoi cette page se cite bien',
  },
  
} as const;

const evidenceCopy = {
  en: 'Structured summary, explicit clinical language, and route-level FAQs help both crawlers and answer engines extract this page.',
  fr: 'Un résumé structuré, un langage clinique explicite et des FAQ au niveau de la page aident les moteurs d’exploration et les systèmes de réponse à extraire le contenu.',
  
} as const;

export default function AiAnswerPanel({ logicalPath, lang }: AiAnswerPanelProps) {
  const meta = getLocalizedMeta(logicalPath, lang);
  const faqs = getFaqData(logicalPath) ?? [];
  const howTo = getHowToSchema(logicalPath);
  const steps = Array.isArray(howTo?.step) ? howTo.step : [];
  const text = labels[lang];
  const pageTitle = meta.title.split(' | ')[0];

  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white/90 shadow-sm overflow-hidden">
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-[#0b3c39] px-6 py-6 sm:px-8 sm:py-7 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 right-0 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-8 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-mono font-extrabold uppercase tracking-[0.24em] text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" />
              {text.badge}
            </div>
            <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
              {pageTitle}
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-slate-300">
              {meta.desc}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300">
            <div className="font-mono uppercase tracking-[0.22em] text-cyan-300">{text.evidence}</div>
            <div className="mt-2 max-w-sm leading-6">
              {evidenceCopy[lang]}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-cyan-100 bg-cyan-50/50 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
              <BookOpen className="h-4 w-4" />
              {text.direct}
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              {meta.desc}
            </p>
          </div>

          {steps.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
                <ListChecks className="h-4 w-4" />
                {text.steps}
              </div>
              <ol className="mt-4 space-y-3">
                {steps.slice(0, 4).map((step: any, idx: number) => (
                  <li key={`${step.name}-${idx}`} className="flex gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold text-white">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900">{step.name}</div>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
            <BookOpen className="h-4 w-4" />
            {text.faq}
          </div>
          {faqs.length > 0 ? (
            faqs.slice(0, 4).map((faq, idx) => (
              <details key={`${faq.question}-${idx}`} className="group rounded-2xl border border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.03)]">
                <summary className="cursor-pointer list-none px-4 py-4 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50">
                  <span className="inline-flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
                    <span>{faq.question}</span>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-sm leading-7 text-slate-600">
                  {faq.answer}
                </div>
              </details>
            ))
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-600">
              {meta.desc}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
