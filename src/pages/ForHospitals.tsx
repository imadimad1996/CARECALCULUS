import React from 'react';
import { LangCode } from '../types';
import { Building2, ShieldCheck, Activity, Code2, ArrowRight } from 'lucide-react';

const T = {
  en: {
    badge: "Enterprise Solutions",
    title: "Empower your clinical teams with CareCalculus Enterprise",
    desc: "Embed validated clinical calculators directly into your hospital's Electronic Health Record (EHR) workflows. Eliminate cognitive load, reduce medication errors, and standardize clinical decision support across your entire health system.",
    ctaContact: "Contact Sales",
    ctaDoc: "View API Documentation",
    benefit1Title: "Evidence-Based Validation",
    benefit1Desc: "Every calculator is peer-reviewed and cited against the latest clinical guidelines (AHA, ESC, IDSA, ARDSNet).",
    benefit2Title: "EHR Integration (SMART/FHIR)",
    benefit2Desc: "Embed widgets natively within Epic, Cerner, or Allscripts using our SMART on FHIR compliant components.",
    benefit3Title: "Usage Analytics",
    benefit3Desc: "Track which tools your clinicians use most to identify training opportunities and standardize care protocols.",
    footerTitle: "Ready to standardize your clinical decision support?",
    footerDesc: "Join leading health systems that trust CareCalculus for error-free, instantaneous medical calculations.",
    ctaDemo: "Request a Demo",
  },
  fr: {
    badge: "Solutions Entreprise",
    title: "Optimisez vos équipes cliniques avec CareCalculus Enterprise",
    desc: "Intégrez des calculateurs cliniques validés directement dans les flux de travail du dossier patient informatisé (DPI) de votre hôpital. Éliminez la charge cognitive, réduisez les erreurs de médication et standardisez l'aide à la décision clinique dans tout votre réseau de santé.",
    ctaContact: "Contacter le service commercial",
    ctaDoc: "Voir la documentation de l'API",
    benefit1Title: "Validation basée sur les preuves",
    benefit1Desc: "Chaque calculateur est révisé par des pairs et cité conformément aux dernières directives cliniques (AHA, ESC, IDSA, ARDSNet).",
    benefit2Title: "Intégration DPI (SMART/FHIR)",
    benefit2Desc: "Intégrez les widgets nativement dans Epic, Cerner ou Allscripts à l'aide de nos composants compatibles SMART on FHIR.",
    benefit3Title: "Analyses d'utilisation",
    benefit3Desc: "Suivez les outils les plus utilisés par vos cliniciens pour identifier les opportunités de formation et standardiser les protocoles de soins.",
    footerTitle: "Prêt à standardiser votre aide à la décision clinique ?",
    footerDesc: "Rejoignez les principaux réseaux de santé qui font confiance à CareCalculus pour des calculs médicaux instantanés et sans erreur.",
    ctaDemo: "Demander une démo",
  },
  ar: {
    badge: "حلول المؤسسات للمستشفيات",
    title: "تمكين فرقك السريرية مع كير كالكولوس للمؤسسات",
    desc: "قم بدمج الحاسبات السريرية المعتمدة مباشرة في تدفقات عمل السجل الصحي الإلكتروني (EHR) في مستشفاك. تخلص من العبء الذهني، وقلل من الأخطاء الدوائية، ووحد دعم القرار السريري عبر نظامك الصحي بالكامل.",
    ctaContact: "الاتصال بالمبيعات",
    ctaDoc: "عرض وثائق واجهة البرمجة (API)",
    benefit1Title: "التحقق القائم على الأدلة",
    benefit1Desc: "تتم مراجعة كل حاسبة من قبل ممارسين معتمدين والاستشهاد بها مقابل أحدث الإرشادات السريرية (AHA, ESC, IDSA, ARDSNet).",
    benefit2Title: "تكامل السجل الصحي (SMART/FHIR)",
    benefit2Desc: "قم بدمج الأدوات برمجياً داخل أنظمة Epic أو Cerner أو Allscripts باستخدام مكوناتنا المتوافقة مع SMART on FHIR.",
    benefit3Title: "تحليلات الاستخدام",
    benefit3Desc: "تتبع الأدوات الأكثر استخداماً من قبل الأطباء لتحديد فرص التدريب وتوحيد بروتوكولات الرعاية الصحية.",
    footerTitle: "جاهز لتوحيد دعم القرار السريري في منشأتك؟",
    footerDesc: "انضم إلى الأنظمة الصحية الرائدة التي تثق في كير كالكولوس لإجراء حسابات طبية فورية وخالية من الأخطاء.",
    ctaDemo: "طلب عرض توضيحي",
  }
};

export default function ForHospitals({ lang }: { lang: LangCode }) {
  const isRtl = lang === 'ar';
  const t = T[lang] || T.en;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm mb-6">
            <Building2 className="w-4 h-4" />
            {t.badge}
          </div>
          <h1 className={`text-4xl md:text-6xl font-display font-bold text-slate-900 leading-tight mb-6 ${isRtl ? 'leading-normal' : ''}`}>
            {t.title}
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-8">
            {t.desc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
              {t.ctaContact} <ArrowRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
            <button className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold transition-colors">
              {t.ctaDoc}
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-3xl transform rotate-3 scale-105" />
          <img 
            src="https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
            alt="Clinical Team using EHR" 
            className="rounded-3xl relative z-10 shadow-2xl border border-white/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">{t.benefit1Title}</h3>
          <p className="text-slate-600">{t.benefit1Desc}</p>
        </div>
        <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <Code2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">{t.benefit2Title}</h3>
          <p className="text-slate-600">{t.benefit2Desc}</p>
        </div>
        <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
            <Activity className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">{t.benefit3Title}</h3>
          <p className="text-slate-600">{t.benefit3Desc}</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-teal-500 rounded-full blur-3xl opacity-20" />
        
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 relative z-10">{t.footerTitle}</h2>
        <p className="text-slate-300 max-w-2xl mx-auto mb-8 relative z-10 text-lg">
          {t.footerDesc}
        </p>
        <button className="px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-bold transition-colors relative z-10">
          {t.ctaDemo}
        </button>
      </div>
    </div>
  );
}

