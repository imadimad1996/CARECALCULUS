import React, { useState } from 'react';
import { LangCode } from '../types';
import { Building2, ShieldCheck, Activity, Code2, ArrowRight, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import SEO from '../components/SEO';

const T = {
  en: {
    seoTitle: "Enterprise Clinical Decision Support | CareCalculus for Hospitals",
    seoDesc: "Embed validated clinical calculators directly into your hospital's EHR workflows. Reduce medication errors and standardize decision support.",
    badge: "CareCalculus Enterprise",
    title: "Standardize Clinical Decisions Across Your Health System",
    desc: "Integrate peer-reviewed calculators natively into Epic and Cerner. Eliminate cognitive overload and reduce medication errors with our SMART on FHIR solutions.",
    formTitle: "Request a Demo",
    formSub: "See how CareCalculus integrates with your EHR.",
    firstName: "First Name",
    lastName: "Last Name",
    workEmail: "Work Email",
    hospitalName: "Hospital / Health System",
    ehrSystem: "Primary EHR System",
    role: "Your Role",
    submit: "Schedule Demo",
    trust: "Trusted by clinical innovators at:",
    benefit1Title: "EHR Native Integration",
    benefit1Desc: "Seamlessly embed inside Epic, Cerner, or Allscripts without disrupting clinical workflows.",
    benefit2Title: "Evidence-Based Protocols",
    benefit2Desc: "Ensure every clinician uses calculators validated against the latest AHA, ESC, and IDSA guidelines.",
    benefit3Title: "Analytics & Governance",
    benefit3Desc: "Track usage analytics, identify training gaps, and maintain central control over clinical tools."
  },
  fr: {
    seoTitle: "Aide à la Décision Clinique pour Hôpitaux | CareCalculus Enterprise",
    seoDesc: "Intégrez des calculateurs validés dans votre DPI (Epic, Cerner). Réduisez les erreurs médicamenteuses et standardisez l'aide à la décision.",
    badge: "CareCalculus Enterprise",
    title: "Standardisez les Décisions Cliniques dans Votre Hôpital",
    desc: "Intégrez des calculateurs validés nativement dans Epic et Cerner. Éliminez la surcharge cognitive et réduisez les erreurs médicamenteuses.",
    formTitle: "Demander une Démo",
    formSub: "Découvrez l'intégration de CareCalculus dans votre DPI.",
    firstName: "Prénom",
    lastName: "Nom",
    workEmail: "Email Professionnel",
    hospitalName: "Hôpital / Établissement",
    ehrSystem: "Système DPI (EHR)",
    role: "Votre Fonction",
    submit: "Planifier la Démo",
    trust: "Approuvé par les cliniciens innovants de :",
    benefit1Title: "Intégration DPI Native",
    benefit1Desc: "Intégration transparente dans Epic, Cerner ou Allscripts sans perturber les flux de travail.",
    benefit2Title: "Protocoles Validés",
    benefit2Desc: "Assurez-vous que chaque clinicien utilise des calculateurs validés selon les dernières directives.",
    benefit3Title: "Analyses & Gouvernance",
    benefit3Desc: "Suivez l'utilisation, identifiez les besoins en formation et maintenez le contrôle sur les outils cliniques."
  }
};

export default function ForHospitals({ lang }: { lang: LangCode }) {
  const [submitted, setSubmitted] = useState(false);
  const isRtl = false;
  const t = T[lang] || T.en;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const leadObj = Object.fromEntries(formData.entries());
      
      const res = await fetch('/api/b2b-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadObj)
      });
      
      if (!res.ok) {
        throw new Error('Failed to submit request');
      }
      
      setSubmitted(true);
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-full bg-slate-50 dark:bg-slate-950 font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      <SEO 
        logicalPath="/for-hospitals" 
        lang={lang} 
        title={t.seoTitle}
        description={t.seoDesc}
      />

      {/* Hero Section */}
      <div className="w-full max-w-full max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Copy */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-sm mb-8 border border-blue-200 dark:border-blue-800/50">
              <Building2 className="w-4 h-4" />
              {t.badge}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
              {t.title}
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
              {t.desc}
            </p>

            <div className="space-y-6 mb-12">
              {[
                t.benefit1Title,
                t.benefit2Title,
                t.benefit3Title
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">{benefit}</span>
                </div>
              ))}
            </div>

            <div>
              <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  {lang === 'fr' ? 'Rejoignez le Programme Pilote' : 'Join the Pilot Program'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {lang === 'fr' ? 'Devenez l\'un de nos hôpitaux fondateurs. Co-concevez des fonctionnalités et obtenez une tarification à vie pour l\'ensemble de votre système de santé.' : 'Become one of our founding hospital partners. Co-design features and secure lifetime legacy pricing for your entire health system.'}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full inline-flex">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {lang === 'fr' ? '3 places restantes pour 2026' : '3 spots remaining for 2026'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: B2B Form */}
          <div className="relative animate-in fade-in slide-in-from-bottom-12 duration-700 delay-150">
            {/* Background decorative blob */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-[2rem] transform rotate-3 scale-[1.02] opacity-20 blur-xl"></div>
            
            <div className="relative bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-2xl border border-slate-200 dark:border-slate-800">
              
              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Request Received</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Our enterprise team will contact you shortly to schedule your personalized demo.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{t.formTitle}</h2>
                    <p className="text-slate-500 dark:text-slate-400">{t.formSub}</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.firstName}</label>
                        <input required name="firstName" type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.lastName}</label>
                        <input required name="lastName" type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.workEmail}</label>
                      <input required name="workEmail" type="email" placeholder="name@hospital.org" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.hospitalName}</label>
                      <input required name="hospitalName" type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.ehrSystem}</label>
                        <select name="ehrSystem" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white">
                          <option>Epic</option>
                          <option>Cerner</option>
                          <option>Allscripts</option>
                          <option>Meditech</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.role}</label>
                        <select name="role" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white">
                          <option>CMIO / CNIO</option>
                          <option>IT Leadership</option>
                          <option>Clinical Director</option>
                          <option>Physician</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    
                    {errorMsg && (
                      <div className="text-red-500 text-sm font-semibold mb-2">
                        {errorMsg}
                      </div>
                    )}
                    <button type="submit" disabled={isSubmitting} className="w-full py-4 mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25">
                      <span>{isSubmitting ? '...' : t.submit}</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    
                    <div className="flex flex-col items-center justify-center gap-1.5 mt-4">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        {lang === 'fr' ? 'Bons de Commande, Virements & ACH acceptés' : 'Purchase Orders, Wire Transfers & ACH Accepted'}
                      </div>
                      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mt-2">
                        <Lock className="w-3 h-3" />
                        We respect your privacy. No spam.
                      </div>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
