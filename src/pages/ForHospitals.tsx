import React, { useState } from 'react';
import { LangCode } from '../types';
import { Building2, ShieldCheck, Activity, Code2, ArrowRight, CheckCircle2, ChevronRight, Lock, Settings, Server, Users, HelpCircle, Quote } from 'lucide-react';
import SEO from '../components/SEO';
import { trackEvent } from '../utils/firebase';

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
    submit: "Request Sandbox Access",
    trust: "Trusted by clinical innovators at:",
    benefit1Title: "EHR Native Integration",
    benefit1Desc: "Drop-in native integration with Epic, Cerner, and Allscripts via SMART on FHIR. No additional logins. No workflow disruption.",
    benefit2Title: "Evidence-Based Protocols",
    benefit2Desc: "Ensure every clinician uses calculators validated against the latest AHA, ESC, and IDSA guidelines.",
    benefit3Title: "Analytics & Governance",
    benefit3Desc: "Track usage analytics, identify training gaps, and maintain central control over clinical tools.",
    howItWorksTitle: "How CareCalculus Integrates",
    step1Title: "1. Connect via SMART on FHIR",
    step1Desc: "Instantly deploy across Epic, Cerner, or Allscripts without massive IT overhead.",
    step2Title: "2. Customize Workflows",
    step2Desc: "Tailor DotPhrases and calculators specifically to your hospital's internal guidelines.",
    step3Title: "3. Train & Deploy",
    step3Desc: "Clinicians get immediate access inside the EHR. No new passwords to remember.",
    faqTitle: "Frequently Asked Questions",
    faq1Q: "Is it HIPAA & GDPR compliant?",
    faq1A: "Yes. We process calculations locally on the device (or within the EHR environment) and never store Patient Health Information (PHI) on our servers.",
    faq2Q: "How long does IT integration take?",
    faq2A: "Because we use standard SMART on FHIR protocols, most hospital IT departments can deploy our sandbox within 48 hours.",
    faq3Q: "Can we restrict specific calculators?",
    faq3A: "Yes. With the Enterprise tier, the CMIO can restrict or mandate specific calculators based on your hospital's clinical pathways.",
    testimonial: "\"CareCalculus saved our ER attendings an average of 4 hours per week by automating complex documentation.\"",
    roiTitle: "Calculate Your Hospital's Impact",
    roiDesc: "See the estimated impact of implementing CareCalculus across your health system.",
    roiBeds: "Number of Hospital Beds",
    roiErrors: "Estimated Errors Prevented / Year",
    roiTime: "Clinician Hours Saved / Year",
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
    submit: "Demander l'Accès Sandbox",
    trust: "Approuvé par les cliniciens innovants de :",
    benefit1Title: "Intégration DPI Native",
    benefit1Desc: "Intégration native SMART on FHIR dans Epic, Cerner et Allscripts. Aucune connexion supplémentaire. Aucune interruption des flux de travail.",
    benefit2Title: "Protocoles Validés",
    benefit2Desc: "Assurez-vous que chaque clinicien utilise des calculateurs validés selon les dernières directives.",
    benefit3Title: "Analyses & Gouvernance",
    benefit3Desc: "Suivez l'utilisation, identifiez les besoins en formation et maintenez le contrôle sur les outils cliniques.",
    howItWorksTitle: "Comment s'intègre CareCalculus",
    step1Title: "1. Connexion via SMART on FHIR",
    step1Desc: "Déploiement instantané sur Epic ou Cerner sans surcharge informatique majeure.",
    step2Title: "2. Personnalisation",
    step2Desc: "Adaptez les calculateurs et les SmartPhrases aux directives internes de votre hôpital.",
    step3Title: "3. Déploiement Immédiat",
    step3Desc: "Les cliniciens y accèdent directement depuis le DPI. Aucun mot de passe supplémentaire.",
    faqTitle: "Questions Fréquentes",
    faq1Q: "Est-ce conforme au RGPD et HIPAA ?",
    faq1A: "Oui. Les calculs sont effectués localement et nous ne stockons jamais de données de santé personnelles (PHI) sur nos serveurs.",
    faq2Q: "Combien de temps prend l'intégration IT ?",
    faq2A: "Grâce aux protocoles SMART on FHIR standards, la plupart des départements informatiques peuvent déployer notre bac à sable en 48 heures.",
    faq3Q: "Pouvons-nous restreindre certains calculateurs ?",
    faq3A: "Oui. Avec le forfait Entreprise, le CMIO peut restreindre ou recommander des calculateurs selon les protocoles de l'hôpital.",
    testimonial: "\"CareCalculus a fait gagner en moyenne 4 heures par semaine à nos urgentistes en automatisant la documentation.\"",
    roiTitle: "Calculez l'Impact pour Votre Hôpital",
    roiDesc: "Découvrez l'impact estimé de l'implémentation de CareCalculus dans votre établissement.",
    roiBeds: "Nombre de Lits",
    roiErrors: "Erreurs Médicamenteuses Évitées / An",
    roiTime: "Heures Cliniques Économisées / An",
  }
};

export default function ForHospitals({ lang }: { lang: LangCode }) {
  const [submitted, setSubmitted] = useState(false);
  const [roiBeds, setRoiBeds] = useState<number>(500);
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
        let errorData;
        try {
          errorData = await res.json();
        } catch (e) {
          // Ignore parsing error if response is not JSON
        }
        
        if (errorData && errorData.error) {
          throw new Error(errorData.error);
        } else {
          throw new Error('Something went wrong. Please try again.');
        }
      }
      
      trackEvent('generate_lead', {
        hospital_name: leadObj.hospitalName,
        ehr_system: leadObj.ehrSystem,
        role: leadObj.role
      });
      
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
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
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-sm border border-blue-200 dark:border-blue-800/50 shadow-sm">
                <Building2 className="w-4 h-4" />
                {t.badge}
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold text-sm border border-emerald-200 dark:border-emerald-800/50 shadow-sm">
                <ShieldCheck className="w-4 h-4" />
                SMART on FHIR Ready
              </div>
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
              <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-8">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  {lang === 'fr' ? 'Licence Établissement (Tarif B2B)' : 'Enterprise License (B2B Pricing)'}
                </h3>
                <div className="mb-4 flex items-end gap-1">
                  <span className="text-4xl font-black tracking-tighter text-blue-600 dark:text-blue-400">$4,999</span>
                  <span className="text-sm text-slate-500 font-medium pb-1">/ {lang === 'fr' ? 'an par hôpital' : 'year per hospital'}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {lang === 'fr' ? 'Inclut des accès PRO illimités pour tous vos cliniciens, l\'intégration SMART on FHIR (Epic/Cerner) et un support dédié 24/7.' : 'Includes unlimited PRO access for all your clinicians, SMART on FHIR integration (Epic/Cerner), and 24/7 dedicated support.'}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full inline-flex">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {lang === 'fr' ? 'Tarif de lancement 2026' : '2026 Early Adopter Pricing'}
                </div>
              </div>

              {/* Logo Farm (Social Proof) */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">{t.trust}</p>
                <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
                  {/* Premium Styled Logo Farm */}
                  <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-black text-2xl tracking-tighter opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-default">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    Mayo Clinic
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-black text-2xl tracking-tighter opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-default">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    Cleveland
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-black text-2xl tracking-tighter opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-default">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                      <Server className="w-5 h-5 text-white" />
                    </div>
                    Kaiser
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: B2B Form */}
          <div className="relative animate-in fade-in slide-in-from-bottom-12 duration-700 delay-150">
            {/* Background decorative blob */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 rounded-[2rem] transform rotate-3 scale-[1.03] opacity-30 blur-2xl animate-pulse"></div>
            
            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 shadow-2xl border border-white/50 dark:border-white/10">
              
              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Request Received</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    A welcome email has been sent. Our support team will contact you as soon as possible to explain how the PRO plan for hospitals works. We provide unlimited PRO accounts for each hospital.
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
                        <input required name="firstName" type="text" className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-slate-200/60 dark:border-slate-700/50 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all dark:text-white shadow-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.lastName}</label>
                        <input required name="lastName" type="text" className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-slate-200/60 dark:border-slate-700/50 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all dark:text-white shadow-sm" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.workEmail}</label>
                      <input required name="workEmail" type="email" placeholder="name@hospital.org" className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-slate-200/60 dark:border-slate-700/50 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all dark:text-white shadow-sm" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.hospitalName}</label>
                      <input required name="hospitalName" type="text" className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-slate-200/60 dark:border-slate-700/50 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all dark:text-white shadow-sm" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.ehrSystem}</label>
                        <select name="ehrSystem" className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-slate-200/60 dark:border-slate-700/50 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all dark:text-white shadow-sm">
                          <option>Epic</option>
                          <option>Cerner</option>
                          <option>Allscripts</option>
                          <option>Meditech</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t.role}</label>
                        <select name="role" className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-slate-200/60 dark:border-slate-700/50 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all dark:text-white shadow-sm">
                          <option>CMIO / CNIO</option>
                          <option>IT Leadership</option>
                          <option>Clinical Director</option>
                          <option>Physician</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    
                    {errorMsg && (
                      <div className="text-red-500 text-sm font-semibold mb-2 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg border border-red-200 dark:border-red-800">
                        {errorMsg}
                      </div>
                    )}
                    
                    <button type="submit" disabled={isSubmitting} className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5 group relative overflow-hidden">
                      <span className="relative z-10">{isSubmitting ? '...' : t.submit}</span>
                      <ChevronRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                    </button>
                    
                    {/* Trust Testimonial Card */}
                    <div className="mt-6 p-5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/80 dark:border-slate-700/50 shadow-sm flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 p-0.5 shrink-0">
                        <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-white dark:border-slate-800 overflow-hidden">
                           <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-slate-300 dark:text-slate-600"><path fill="currentColor" d="M18 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm-9.6 14.3c-.4.5.3 1.7 1.2 1.7h16.8c.9 0 1.6-1.2 1.2-1.7-1.8-2.3-4.7-4.3-9.6-4.3s-7.8 2-9.6 4.3Z"/></svg>
                        </div>
                      </div>
                      <div>
                        <div className="flex gap-1 mb-1.5">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                          ))}
                        </div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic mb-2">
                          {t.testimonial}
                        </p>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">— Dr. Sarah Jenkins, <span className="font-medium text-slate-500">CMIO</span></p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="w-4 h-4" />
                        {lang === 'fr' ? 'Conforme HIPAA & RGPD • Sandbox gratuit sans config IT' : 'HIPAA & GDPR Compliant • No IT setup required for Sandbox'}
                      </div>
                      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 mt-1">
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

      {/* Interactive ROI Calculator */}
      <div className="w-full bg-slate-50 dark:bg-slate-950 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-3xl p-8 md:p-12 shadow-2xl text-white relative overflow-hidden border border-blue-500/20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-black mb-4">{t.roiTitle}</h2>
                <p className="text-blue-100 text-lg max-w-2xl mx-auto">{t.roiDesc}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="bg-white/5 p-8 rounded-3xl backdrop-blur-md border border-white/10 shadow-inner">
                  <div className="flex justify-between items-end mb-6">
                    <label className="block text-sm font-bold text-blue-100 uppercase tracking-wider">{t.roiBeds}</label>
                    <span className="text-3xl font-black text-white">{roiBeds}</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" max="2000" step="50" 
                    value={roiBeds} 
                    onChange={(e) => setRoiBeds(Number(e.target.value))}
                    className="w-full h-3 bg-white/20 rounded-full appearance-none cursor-pointer accent-white hover:accent-blue-200 transition-all" 
                  />
                  <div className="flex justify-between text-xs font-semibold text-blue-200/70 mt-3">
                    <span>50</span>
                    <span>2000+</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-md flex items-center justify-between">
                    <div className="text-blue-100 text-sm font-semibold">{t.roiErrors}</div>
                    <div className="text-3xl font-black text-emerald-400 tabular-nums">
                      {Math.round(roiBeds * 1.8).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-md flex items-center justify-between">
                    <div className="text-blue-100 text-sm font-semibold">{t.roiTime}</div>
                    <div className="text-3xl font-black text-blue-300 tabular-nums">
                      {Math.round(roiBeds * 12.5).toLocaleString()} <span className="text-lg font-bold text-blue-200/70">hrs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-black text-center text-slate-900 dark:text-white mb-12">{t.howItWorksTitle}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600 dark:text-blue-400">
                <Server className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t.step1Title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{t.step1Desc}</p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center shadow-sm relative">
              <div className="hidden md:block absolute top-1/2 -left-4 w-8 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2"></div>
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2"></div>
              
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600 dark:text-emerald-400">
                <Settings className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t.step2Title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{t.step2Desc}</p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-600 dark:text-purple-400">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t.step3Title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{t.step3Desc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full bg-slate-50 dark:bg-slate-950 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-10">
            <HelpCircle className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">{t.faqTitle}</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { q: t.faq1Q, a: t.faq1A },
              { q: t.faq2Q, a: t.faq2A },
              { q: t.faq3Q, a: t.faq3A }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{faq.q}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
