import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';
import { LangCode } from '../types';
import faqDb from '../data/faqDb.json';
import seoMaps from '../data/seoMaps.json';

const nameEnMap: Record<string, string> = (seoMaps as any).nameEnMap;
const nameFrMap: Record<string, string> = (seoMaps as any).nameFrMap || {};
const nameArMap: Record<string, string> = (seoMaps as any).nameArMap || {};

// Map of question slug -> {calculatorPath, question, answer, lang}
// Built from faqDb: each key is a calculator path, value is array of Q&A
interface QAEntry {
  question: string;
  answer: string;
}

const T = {
  en: {
    backTo: 'Back to Calculator',
    relatedQuestions: 'Related Clinical Questions',
    reviewedBy: 'Reviewed by CareCalculus Clinical Board',
    updated: 'Updated: July 2026',
    openCalculator: 'Open Calculator →',
    disclaimer: 'For clinical decision support only. Always verify with current guidelines.',
    sources: 'Clinical Sources',
    sourceNote: 'Content reviewed against peer-reviewed literature and current clinical practice guidelines.'
  },
  fr: {
    backTo: 'Retour au Calculateur',
    relatedQuestions: 'Questions Cliniques Associées',
    reviewedBy: 'Validé par le Comité Clinique CareCalculus',
    updated: 'Mis à jour : Juillet 2026',
    openCalculator: 'Ouvrir le Calculateur →',
    disclaimer: 'Aide à la décision clinique uniquement. Vérifiez toujours avec les recommandations en vigueur.',
    sources: 'Références Cliniques',
    sourceNote: 'Contenu revu selon la littérature médicale et les recommandations cliniques actuelles.'
  },
  ar: {
    backTo: 'العودة إلى الحاسبة',
    relatedQuestions: 'أسئلة طبية متعلقة',
    reviewedBy: 'تمت المراجعة من قبل اللجنة الطبية لـ CareCalculus',
    updated: 'آخر تحديث: يوليو 2026',
    openCalculator: 'فتح الحاسبة ←',
    disclaimer: 'للدعم في القرار السريري فقط. تحقق دائمًا من الإرشادات الحالية.',
    sources: 'المصادر الطبية',
    sourceNote: 'تمت مراجعة المحتوى استنادًا إلى الأدلة العلمية والإرشادات السريرية الحديثة.'
  }
};

// Slugify a question string for URL usage
function slugifyQuestion(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

// Build a lookup map: questionSlug -> { calcPath, question, answer }
type QALookup = Record<string, { calcPath: string; question: string; answer: string }>;

function buildQALookup(): QALookup {
  const lookup: QALookup = {};
  for (const [calcPath, entries] of Object.entries(faqDb as Record<string, QAEntry[]>)) {
    for (const entry of entries) {
      const slug = slugifyQuestion(entry.question);
      if (slug) {
        lookup[slug] = { calcPath, question: entry.question, answer: entry.answer };
      }
    }
  }
  return lookup;
}

const QA_LOOKUP = buildQALookup();

interface Props {
  lang: LangCode;
}

export default function ClinicalQuestionPage({ lang }: Props) {
  const { questionSlug } = useParams<{ questionSlug: string }>();
  const t = T[lang] || T.en;
  const isRtl = false;

  const entry = questionSlug ? QA_LOOKUP[questionSlug] : undefined;

  const calcPath = entry?.calcPath || '';
  const calcName =
    lang === 'fr' ? (nameFrMap[calcPath] || nameEnMap[calcPath] || calcPath)
    : (nameEnMap[calcPath] || calcPath);

  const prefix = lang === 'en' ? '' : `/${lang}`;

  // Related questions from the same calculator
  const relatedEntries: QAEntry[] = entry
    ? ((faqDb as Record<string, QAEntry[]>)[calcPath] || []).filter(
        (e) => e.question !== entry.question
      )
    : [];

  // Inject SEO meta + JSON-LD schema
  useEffect(() => {
    if (!entry) return;

    document.title = `${entry.question} | CareCalculus`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', 'description'); document.head.appendChild(meta); }
    meta.setAttribute('content', entry.answer.slice(0, 160));

    // FAQPage JSON-LD
    const existing = document.getElementById('cc-faq-schema');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.id = 'cc-faq-schema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [{
        '@type': 'Question',
        name: entry.question,
        acceptedAnswer: { '@type': 'Answer', text: entry.answer }
      },
      ...relatedEntries.map((e) => ({
        '@type': 'Question',
        name: e.question,
        acceptedAnswer: { '@type': 'Answer', text: e.answer }
      }))]
    });
    document.head.appendChild(script);

    return () => { script.remove(); };
  }, [entry, relatedEntries]);

  if (!entry) {
    return (
      <div className="py-20 text-center" dir={isRtl ? 'rtl' : 'ltr'}>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Question not found</h1>
        <Link to={`${prefix}/`} className="text-blue-600 hover:underline">← Return to home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Breadcrumb back link */}
      <div className="mb-6">
        <Link
          to={`${prefix}${calcPath}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          {t.backTo}: {calcName}
        </Link>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Clinical Q&A</span>
        </div>

        <h1 className="text-2xl font-black text-gray-900 leading-tight mb-6">
          {entry.question}
        </h1>

        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 mb-6">
          <p className="text-gray-800 leading-relaxed text-base">{entry.answer}</p>
        </div>

        {/* Review badge */}
        <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          {t.reviewedBy} • {t.updated}
        </div>
      </div>

      {/* CTA to open the interactive calculator */}
      <Link
        to={`${prefix}${calcPath}`}
        className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-2xl p-5 mb-8 shadow-md transition-all group"
      >
        <div>
          <div className="text-xs font-bold opacity-70 uppercase tracking-widest mb-1">Interactive Tool</div>
          <div className="font-black text-lg">{calcName}</div>
        </div>
        <ExternalLink className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Related Questions */}
      {relatedEntries.length > 0 && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-5">
            {t.relatedQuestions}
          </h2>
          <div className="space-y-3">
            {relatedEntries.map((rel) => {
              const relSlug = slugifyQuestion(rel.question);
              return (
                <Link
                  key={relSlug}
                  to={`${prefix}/q/${relSlug}`}
                  className="flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50/50 border border-gray-100 hover:border-indigo-200 rounded-2xl text-sm font-semibold text-gray-800 hover:text-indigo-700 transition-all"
                >
                  <span>{rel.question}</span>
                  <ArrowRight className={`w-4 h-4 text-slate-400 shrink-0 ${isRtl ? 'rotate-180' : ''}`} />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-center text-gray-400 mt-6 leading-relaxed px-4">
        {t.disclaimer}
      </p>
    </div>
  );
}
