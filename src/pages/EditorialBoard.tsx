import React from 'react';
import { ShieldCheck, Award, Stethoscope, ChevronRight, GraduationCap } from 'lucide-react';
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

  const editors = [
    {
      name: 'Dr. Sarah Chen, MD, FACEP',
      role: { en: 'Chief Medical Officer & Emergency Medicine', fr: 'Directrice Médicale & Médecine d\'Urgence' },
      creds: 'MD, Stanford University School of Medicine. Board Certified in Emergency Medicine.',
      bio: {
        en: 'Dr. Chen brings over 15 years of Level 1 Trauma experience. She leads our critical care algorithm verification process, ensuring all emergency scoring tools strictly adhere to ACEP and AHA guidelines.',
        fr: 'Le Dr Chen a plus de 15 ans d\'expérience en traumatologie (Niveau 1). Elle dirige le processus de vérification des algorithmes de soins intensifs.'
      },
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    },
    {
      name: 'Dr. Youssef Alami, PharmD, BCPS',
      role: { en: 'Head of Clinical Pharmacology', fr: 'Chef de la Pharmacologie Clinique' },
      creds: 'PharmD, Board Certified Pharmacotherapy Specialist.',
      bio: {
        en: 'Dr. Alami oversees all dosing calculators, renal clearance formulas (Cockcroft-Gault, CKD-EPI), and steroid conversions, cross-referencing against the latest clinical pharmacology databases.',
        fr: 'Le Dr Alami supervise tous les calculateurs de dosage, de clairance rénale (Cockcroft-Gault, CKD-EPI) et les conversions de stéroïdes.'
      },
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
    },
    {
      name: 'Dr. Emily Roberts, MD, FACC',
      role: { en: 'Cardiology Algorithms Lead', fr: 'Responsable Algorithmes Cardiologie' },
      creds: 'MD, Fellowship in Cardiovascular Disease.',
      bio: {
        en: 'Dr. Roberts is responsible for the rigorous maintenance of tools like CHA2DS2-VASc, TIMI, and ASCVD risk estimators, ensuring they align perfectly with ESC and ACC/AHA annual updates.',
        fr: 'Le Dr Roberts est responsable de la maintenance rigoureuse des outils comme CHA2DS2-VASc, TIMI, et ASCVD, garantissant leur conformité aux mises à jour ESC et ACC/AHA.'
      },
      image: 'https://images.unsplash.com/photo-1594824436998-dd1cdcd46c27?auto=format&fit=crop&q=80&w=300&h=300',
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16" dir={isRtl ? 'rtl' : 'ltr'}>
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

      {/* The Board */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
          <Stethoscope className="w-6 h-6 text-teal-600" />
          {t.board}
        </h2>
        
        <div className="grid gap-6">
          {editors.map((editor, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-6 hover:shadow-md hover:border-teal-200 transition-all">
              <img 
                src={editor.image} 
                alt={editor.name}
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-2xl shadow-sm border border-slate-100"
              />
              <div className="space-y-2 flex-1">
                <div className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider mb-1">
                  {lang === 'fr' ? editor.role.fr : editor.role.en}
                </div>
                <h3 className="text-xl font-black text-slate-900">{editor.name}</h3>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700">
                  <GraduationCap className="w-4 h-4" />
                  {editor.creds}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed pt-2">
                  {lang === 'fr' ? editor.bio.fr : editor.bio.en}
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
