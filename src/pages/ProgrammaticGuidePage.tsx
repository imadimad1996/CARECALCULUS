import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Activity, Stethoscope, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, ExternalLink, Sparkles } from 'lucide-react';
import { LangCode } from '../types';
import programmaticData from '../data/programmaticEngine.json';
import seoMaps from '../data/seoMaps.json';
import { ORIGIN } from '../utils/seo';

interface Props {
  lang: LangCode;
}

const nameEnMap: Record<string, string> = (seoMaps as any).nameEnMap || {};
const nameFrMap: Record<string, string> = (seoMaps as any).nameFrMap || {};

export default function ProgrammaticGuidePage({ lang }: Props) {
  const { guideSlug } = useParams<{ guideSlug: string }>();
  const isFr = lang === 'fr';

  if (!guideSlug) {
    const pageTitle = isFr 
      ? 'Guides de Décision Clinique et Protocoles | CareCalculus' 
      : 'Clinical Intersection Guides & Management Protocols | CareCalculus';
    const metaDesc = isFr
      ? 'Découvrez nos guides de protocoles cliniques transversaux reliant des calculateurs de premier plan à des états pathologiques spécifiques.'
      : 'Explore clinical protocols linking leading calculators with specific disease states (Sepsis, ARDS, Cirrhosis, Renal Injury, etc.).';
      
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 pb-32">
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={metaDesc} />
        </Helmet>
        
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-gradient-to-br from-slate-900 to-cyan-950 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-md">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              {isFr ? 'Index des Protocoles' : 'Clinical Index'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              {isFr ? 'Guides Cliniques' : 'Clinical Guides'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              {isFr 
                ? 'Consultez les guides de décision reliant nos calculateurs phares à des contextes pathologiques précis pour optimiser les choix thérapeutiques.' 
                : 'Browse medical guides linking our primary calculation tools directly with specific physiological conditions to streamline bedside workflows.'}
            </p>
          </div>

          <div className="space-y-6">
            {programmaticData.dataSets.diseases.map((disease) => {
              // Get related calculators
              const relatedCalculators = disease.relatedCalculators.map(cSlug => 
                programmaticData.dataSets.calculators.find(c => c.slug === cSlug)
              ).filter(Boolean);

              return (
                <div key={disease.slug} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <div className="p-2 bg-cyan-50 text-cyan-700 rounded-xl">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">{disease.name}</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedCalculators.map((calc) => {
                      if (!calc) return null;
                      const guideLink = `/clinical-guide/${calc.slug}-in-${disease.slug}`;
                      const calcTitle = isFr ? (nameFrMap[`/${calc.slug}`] || calc.name) : (nameEnMap[`/${calc.slug}`] || calc.name);
                      
                      return (
                        <Link 
                          key={calc.slug}
                          to={isFr ? `/fr${guideLink}` : guideLink}
                          className="p-4 rounded-xl border border-slate-100 hover:border-cyan-500 hover:bg-cyan-50/20 transition flex items-center justify-between group"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="text-sm font-bold text-slate-800 group-hover:text-cyan-700 transition block truncate">
                              {calcTitle}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {isFr ? 'Protocole clinique' : 'Clinical targets & guide'}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 transition shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Parse guideSlug e.g. "map-calculator-in-sepsis" -> calcSlug="map-calculator", diseaseSlug="sepsis"
  const parts = guideSlug ? guideSlug.split('-in-') : [];
  const calcSlug = parts[0] || '';
  const diseaseSlug = parts[1] || '';

  const calcInfo = programmaticData.dataSets.calculators.find((c: any) => c.slug === calcSlug);
  const diseaseInfo = programmaticData.dataSets.diseases.find((d: any) => d.slug === diseaseSlug);

  if (!calcInfo || !diseaseInfo) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-900 mb-2">
            {isFr ? 'Guide Clinique Introuvable' : 'Clinical Guide Not Found'}
          </h1>
          <p className="text-sm text-slate-600 mb-6">
            {isFr
              ? 'Le guide sélectionné n’est pas disponible ou l’URL est incorrecte.'
              : 'The requested clinical intersection guide is either under review or invalid.'}
          </p>
          <Link
            to={isFr ? '/fr/home' : '/home'}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-cyan-600 text-white font-medium rounded-xl hover:bg-cyan-700 transition"
          >
            {isFr ? 'Retour à l’accueil' : 'Return Home'}
          </Link>
        </div>
      </div>
    );
  }

  const calcTitle = isFr ? (nameFrMap[`/${calcSlug}`] || calcInfo.name) : (nameEnMap[`/${calcSlug}`] || calcInfo.name);
  const diseaseTitle = isFr ? diseaseInfo.name : diseaseInfo.name;

  const pageTitle = isFr
    ? `${calcTitle} dans ${diseaseTitle} : Guide & Objectifs | CareCalculus`
    : `${calcTitle} in ${diseaseTitle}: Clinical Targets & Management Guide | CareCalculus`;

  const metaDesc = isFr
    ? `Guide clinique fondé sur des preuves pour l'utilisation de ${calcTitle} dans la prise en charge de ${diseaseTitle}. Seuils quantitatifs, réanimation et intégration DSE.`
    : `Evidence-based clinical guide on utilizing the ${calcTitle} in ${diseaseTitle} management. Quantitative targets, physiological interaction, and EHR integration.`;

  const canonicalUrl = `${ORIGIN}/clinical-guide/${guideSlug}`;

  // Answer-first block (40-60 words for AI Overviews / Perplexity citations)
  const answerFirstText = isFr
    ? `Dans le cadre de ${diseaseTitle}, le score ${calcTitle} constitue un repère hémodynamique et pronostique majeur. Selon les recommandations cliniques internationales, la surveillance et l'ajustement précoce via ce calculateur réduisent significativement la mortalité et optimisent la prise en charge en soins intensifs ou aux urgences.`
    : `In the management of ${diseaseTitle}, the ${calcTitle} serves as a foundational prognostic and hemodynamic benchmark. According to international clinical practice guidelines, serial monitoring and rapid optimization guided by this tool significantly reduce morbidity and mortality across emergency, ICU, and inpatient environments.`;

  const schemaJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: pageTitle,
      description: metaDesc,
      url: canonicalUrl,
      author: { '@type': 'Organization', name: 'CareCalculus Clinical Board', url: ORIGIN },
      publisher: { '@type': 'Organization', name: 'CareCalculus', logo: { '@type': 'ImageObject', url: `${ORIGIN}/icon.svg` } },
      about: [
        { '@type': 'MedicalCondition', name: diseaseTitle },
        { '@type': 'MedicalCalculator', name: calcTitle, url: `${ORIGIN}/${calcSlug}` }
      ],
      citation: 'Surviving Sepsis Campaign Guidelines, ATS/IDSA Guidelines, ACC/AHA Clinical Practice Guidelines'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: isFr ? `Pourquoi utiliser ${calcTitle} en cas de ${diseaseTitle} ?` : `Why use the ${calcTitle} in ${diseaseTitle}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: answerFirstText
          }
        },
        {
          '@type': 'Question',
          name: isFr ? `Comment interpréter les résultats de ${calcTitle} ?` : `How do you interpret ${calcTitle} results?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: isFr
              ? `Les seuils critiques doivent être interprétés en corrélation avec l'état clinique global du patient. Utilisez l'outil interactif CareCalculus pour un calcul instantané et un export DSE.`
              : `Critical cutoffs must be interpreted in direct correlation with overall patient clinical status and serial physiological trends. Launch the interactive CareCalculus tool below for instant calculation and EHR dotphrase export.`
          }
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'CareCalculus', item: ORIGIN },
        { '@type': 'ListItem', position: 2, name: isFr ? 'Guides Cliniques' : 'Clinical Guides', item: `${ORIGIN}/home` },
        { '@type': 'ListItem', position: 3, name: `${calcTitle} in ${diseaseTitle}`, item: canonicalUrl }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify(schemaJsonLd)}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <Link to={isFr ? '/fr/home' : '/home'} className="hover:text-cyan-600 transition">
            {isFr ? 'Accueil' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{calcTitle} in {diseaseTitle}</span>
        </nav>

        {/* Header Hero */}
        <div className="bg-gradient-to-br from-cyan-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl mb-8 border border-cyan-800/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              {isFr ? 'Protocole & Objectifs Cliniques' : 'Clinical Protocol & Targets'}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-4">
              {calcTitle} <span className="text-cyan-400 font-light">in</span> {diseaseTitle}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              {metaDesc}
            </p>
          </div>
        </div>

        {/* Answer-First Block for AI Citations & Featured Snippets */}
        <article className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-cyan-100 mb-8 relative">
          <div className="flex items-center gap-2 text-cyan-700 font-bold text-sm uppercase tracking-wider mb-3">
            <ShieldCheck className="w-5 h-5 text-cyan-600" />
            {isFr ? 'Synthèse Pratique / Réponse Rapide' : 'Clinical Synthesis & Rapid Answer'}
          </div>
          <p className="text-slate-800 text-base sm:text-lg font-medium leading-relaxed bg-cyan-50/50 p-5 rounded-xl border-l-4 border-cyan-600 mb-6">
            {answerFirstText}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                {isFr ? 'Application Clinique' : 'Physiological Rationale'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isFr
                  ? `L'évaluation systématique permet d'ajuster en temps réel la thérapeutique, de guider le remplissage vasculaire, la titration des drogues vasoactives et l'orientation en unité de soins intensifs.`
                  : `Systematic scoring enables precise titration of resuscitative fluids, vasoactive support, and timely disposition decision-making between general wards, step-down units, and intensive care.`}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                {isFr ? 'Intégration au Dossier Patient (DSE)' : 'EHR & Workflow Integration'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isFr
                  ? `Calculez instantanément et générez une note structurée SBAR/SOAP pré-formatée avec horodatage pour votre dossier informatisé.`
                  : `Calculate instantly and export timestamped SBAR/SOAP documentation notes formatted directly for Epic, Cerner, and hospital electronic health record systems.`}
              </p>
            </div>
          </div>
        </article>

        {/* Interactive Launch Card */}
        <div className="bg-gradient-to-r from-cyan-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg mb-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold mb-1">
              {isFr ? `Ouvrir ${calcTitle} Interactif` : `Launch Interactive ${calcTitle}`}
            </h2>
            <p className="text-cyan-100 text-xs sm:text-sm">
              {isFr
                ? 'Accédez au calculateur en direct avec aide à la décision et export de note.'
                : 'Access the live calculator with clinical decision support and dotphrase copy.'}
            </p>
          </div>
          <Link
            to={isFr ? `/fr/${calcSlug}` : `/${calcSlug}`}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-cyan-900 font-bold rounded-xl shadow-md hover:bg-cyan-50 transition shrink-0"
          >
            {isFr ? 'Calculer Maintenant' : 'Calculate Now'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Related Intersections (Spokes) */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 mb-10">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-600" />
            {isFr ? `Autres outils et scores pour : ${diseaseTitle}` : `Other Clinical Scoring Tools for ${diseaseTitle}`}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {diseaseInfo.relatedCalculators.map((relatedSlug: string) => {
              const relatedCalc = programmaticData.dataSets.calculators.find((c: any) => c.slug === relatedSlug);
              if (!relatedCalc || relatedSlug === calcSlug) return null;
              const relTitle = isFr ? (nameFrMap[`/${relatedSlug}`] || relatedCalc.name) : (nameEnMap[`/${relatedSlug}`] || relatedCalc.name);
              return (
                <Link
                  key={relatedSlug}
                  to={`/clinical-guide/${relatedSlug}-in-${diseaseSlug}`}
                  className="p-4 rounded-xl border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50/30 transition flex items-center justify-between group"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-800 group-hover:text-cyan-700 transition">
                      {relTitle} in {diseaseTitle}
                    </div>
                    <div className="text-xs text-slate-500">
                      {isFr ? 'Protocole clinique & cibles' : 'Clinical target & triage guide'}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 transition" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Clinical Disclaimer & Review Footer */}
        <footer className="text-center text-xs text-slate-500 border-t border-slate-200 pt-6">
          <p className="mb-2 font-medium">
            {isFr
              ? 'Revu par le Comité Scientifique et Clinique CareCalculus — Juillet 2026.'
              : 'Reviewed and verified by the CareCalculus Clinical Board — July 2026.'}
          </p>
          <p className="max-w-2xl mx-auto">
            {isFr
              ? 'Avertissement : Les calculateurs et guides de décision clinique sont destinés exclusivement aux professionnels de santé qualifiés. Ils ne se substituent en aucun cas à un jugement médical individuel.'
              : 'Disclaimer: Clinical decision support tools and calculation guides are intended strictly for licensed healthcare professionals and do not substitute for formal clinical judgment.'}
          </p>
        </footer>
      </div>
    </div>
  );
}