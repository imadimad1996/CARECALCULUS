import React from 'react';
import { ShieldCheck, Award, Stethoscope, ChevronRight, GraduationCap, Linkedin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LangCode } from '../types';
import { useLang } from '../utils/lang';

export default function EditorialBoard({ lang }: { lang: LangCode }) {
  const { langPath } = useLang();
  const isRtl = false;

  const t = {
    en: {
      title: 'Medical Editorial Board',
      subtitle: 'Rigorous E-E-A-T standard (Experience, Expertise, Authoritativeness, and Trustworthiness).',
      desc: 'CareCalculus is developed and continuously reviewed by a dedicated team of clinical professionals. Every algorithm, cutoff value, and clinical interpretation goes through a strict peer-review process before deployment to ensure 100% compliance with current international guidelines.',
      board: 'The Board',
      policy: 'Our Editorial Policy',
      policyDesc: 'All clinical formulas are strictly sourced from peer-reviewed literature (e.g., NEJM, JAMA, Lancet) and official societal guidelines (AHA, ESC, KDIGO, ESPEN). We do not use generative AI to write clinical logic or dosing recommendations. All updates are manually verified by our board.'
    },
    fr: {
      title: 'Comité de Rédaction Médicale',
      subtitle: 'Standard E-E-A-T (Expérience, Expertise, Autorité et Fiabilité).',
      desc: 'CareCalculus est développé et continuellement révisé par une équipe dédiée de professionnels cliniques. Chaque algorithme, valeur seuil et interprétation clinique passe par un processus strict de révision par les pairs avant déploiement pour garantir une conformité totale aux recommandations internationales.',
      board: 'Le Comité',
      policy: 'Notre Politique Éditoriale',
      policyDesc: 'Toutes les formules cliniques proviennent de la littérature validée par les pairs (ex: NEJM, JAMA, Lancet) et des sociétés savantes (AHA, ESC, KDIGO, ESPEN). L\'IA n\'est pas utilisée pour rédiger la logique clinique. Chaque mise à jour est vérifiée manuellement.'
    }
  }[lang] || {
    title: 'Medical Editorial Board',
    subtitle: 'Rigorous E-E-A-T standard (Experience, Expertise, Authoritativeness, and Trustworthiness).',
    desc: 'CareCalculus is developed and continuously reviewed by a dedicated team of clinical professionals. Every algorithm, cutoff value, and clinical interpretation goes through a strict peer-review process before deployment to ensure 100% compliance with current international guidelines.',
    board: 'The Board',
    policy: 'Our Editorial Policy',
    policyDesc: 'All clinical formulas are strictly sourced from peer-reviewed literature (e.g., NEJM, JAMA, Lancet) and official societal guidelines (AHA, ESC, KDIGO, ESPEN). We do not use generative AI to write clinical logic or dosing recommendations. All updates are manually verified by our board.'
  };

  const methodology = [
    {
      title: { en: 'Primary Literature Sourcing', fr: 'Sources Littéraires Primaires' },
      desc: { 
        en: 'Every clinical algorithm is derived exclusively from peer-reviewed landmark trials and meta-analyses published in tier-one medical journals (NEJM, JAMA, Lancet, Circulation). We explicitly cite PubMed PMIDs for every formula.',
        fr: 'Chaque algorithme clinique dérive exclusivement d\'essais majeurs validés par des pairs publiés dans des revues médicales de premier plan (NEJM, JAMA, Lancet). Nous citons explicitement les PMIDs de PubMed.' 
      },
      icon: <GraduationCap className="w-8 h-8 text-blue-500" />
    },
    {
      title: { en: 'Guideline Validation', fr: 'Validation par Recommandations' },
      desc: {
        en: 'Our formulas strictly align with the latest published consensus guidelines from international societies including AHA/ACC, ESC, KDIGO, Surviving Sepsis Campaign, GOLD, and NICE.',
        fr: 'Nos formules s\'alignent strictement sur les dernières recommandations publiées par les sociétés internationales incluant AHA/ACC, ESC, KDIGO, Surviving Sepsis Campaign, GOLD, et NICE.'
      },
      icon: <Award className="w-8 h-8 text-teal-500" />
    },
    {
      title: { en: 'Algorithmic Double-Check', fr: 'Double Vérification Algorithmique' },
      desc: {
        en: 'Prior to deployment, unit conversion logic (SI/US), edge-case bounds, and age/weight safety constraints are manually verified via dual-computation against verified datasets.',
        fr: 'Avant déploiement, la logique de conversion d\'unités, les limites extrêmes, et les contraintes de sécurité âge/poids sont vérifiées manuellement.'
      },
      icon: <ShieldCheck className="w-8 h-8 text-purple-500" />
    }
  ];

  return (
    <div className="w-full max-w-full max-w-4xl mx-auto space-y-12 pb-16" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 rounded-full border border-teal-200 text-xs font-bold uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" />
          E-E-A-T COMPLIANCE
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{t.title}</h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{t.desc}</p>
      </div>

      {/* Policy Box */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-3xl rounded-full" />
        <div className="p-3 bg-white/10 rounded-2xl border border-white/20 shrink-0">
          <Award className="w-6 h-6 text-teal-400" />
        </div>
        <div className="relative z-10">
          <h2 className="text-lg font-black text-white mb-2">{t.policy}</h2>
          <p className="text-sm text-slate-300 leading-relaxed">{t.policyDesc}</p>
        </div>
      </div>

      {/* The Methodology Framework */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
          <Stethoscope className="w-6 h-6 text-teal-600" />
          {lang === 'fr' ? 'Cadre Méthodologique Clinique' : 'Clinical Methodology Framework'}
        </h2>
        
        <div className="grid gap-6">
          {methodology.map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-6 hover:shadow-md hover:border-teal-200 transition-all items-start">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shrink-0">
                {item.icon}
              </div>
              <div className="space-y-2 flex-1 pt-1">
                <h3 className="text-xl font-black text-slate-900">
                  {lang === 'fr' ? item.title.fr : item.title.en}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {lang === 'fr' ? item.desc.fr : item.desc.en}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer Link back to about */}
      <div className="flex justify-center pt-8">
        <Link to={langPath('/about')} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-teal-600 transition-colors">
          Return to About CareCalculus
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
