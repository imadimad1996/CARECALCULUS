import React from 'react';
import { HeartPulse, ShieldCheck, Globe, BookOpen, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LangCode } from '../types';
import { useLang } from '../utils/lang';

const T = {
  en: {
    title: 'About CareCalculus',
    mission: 'Our Mission',
    missionText: 'CareCalculus is a free, open-access clinical decision-support platform built for nurses, emergency physicians, ICU specialists, pharmacists, and healthcare students worldwide. Our goal is to provide fast, accurate, multilingual medical calculators that work in any clinical environment — including offline.',
    what: 'What We Build',
    whatText: 'We develop evidence-based scoring tools and calculators covering emergency medicine, critical care, internal medicine, nephrology, hepatology, cardiology, pulmonology, and pharmacology. Every formula is sourced from published peer-reviewed guidelines.',
    sources: 'Our Formula Sources',
    sourcesText: 'All clinical formulas and scoring algorithms implemented on this platform are derived from published guidelines and peer-reviewed literature, including:',
    multilingual: 'Multilingual by Design',
    multilingualText: 'CareCalculus is designed from the ground up to serve clinicians in English, French, and Arabic — covering North American, European, and MENA regional clinical standards.',
    disclaimer: 'Important Notice',
    disclaimerText: 'CareCalculus is a clinical decision-support tool, not a substitute for professional medical judgment. See our full',
    disclaimerLink: 'Medical Disclaimer',
    contact: 'Contact',
    contactText: 'For formula corrections, guideline updates, or accessibility feedback, use the feedback link in your browser or reach us via GitHub Issues.',
  },
  fr: {
    title: 'À propos de CareCalculus',
    mission: 'Notre Mission',
    missionText: 'CareCalculus est une plateforme d\'aide à la décision clinique gratuite et libre d\'accès, conçue pour les infirmiers, médecins urgentistes, réanimateurs, pharmaciens et étudiants en médecine du monde entier. Notre objectif est de fournir des calculateurs médicaux rapides, précis et multilingues, fonctionnant dans tout environnement clinique — y compris hors ligne.',
    what: 'Ce que nous développons',
    whatText: 'Nous développons des outils de scoring et des calculateurs fondés sur les preuves pour les urgences, les soins intensifs, la médecine interne, la néphrologie, l\'hépatologie, la cardiologie, la pneumologie et la pharmacologie. Chaque formule est tirée des recommandations publiées.',
    sources: 'Sources des formules',
    sourcesText: 'Toutes les formules cliniques implémentées sur cette plateforme sont issues de recommandations publiées et de la littérature médicale révisée par des experts, notamment :',
    multilingual: 'Multilingue par conception',
    multilingualText: 'CareCalculus est conçu de A à Z pour servir les cliniciens en anglais, français et arabe — couvrant les standards cliniques nord-américains, européens et de la région MENA.',
    disclaimer: 'Avis important',
    disclaimerText: 'CareCalculus est un outil d\'aide à la décision clinique, non un substitut au jugement médical professionnel. Voir notre',
    disclaimerLink: 'Avertissement médical',
    contact: 'Contact',
    contactText: 'Pour des corrections de formules, mises à jour de recommandations ou retours sur l\'accessibilité, utilisez le lien de commentaires de votre navigateur ou contactez-nous via GitHub Issues.',
  },
  ar: {
    title: 'عن منصة كير كالكولوس',
    mission: 'مهمتنا',
    missionText: 'كير كالكولوس منصة مجانية مفتوحة لدعم القرار السريري، مصممة للممرضين والأطباء الطارئين ومختصي العناية المركزة والصيادلة وطلاب الطب حول العالم. هدفنا توفير حاسبات طبية سريعة ودقيقة ومتعددة اللغات، تعمل في أي بيئة سريرية — بما فيها الوضع غير المتصل بالإنترنت.',
    what: 'ما نبنيه',
    whatText: 'نطور أدوات تقييم وحاسبات قائمة على الأدلة تشمل طب الطوارئ والعناية المركزة والطب الباطني وأمراض الكلى والكبد وأمراض القلب وطب الرئة وعلم الأدوية. كل معادلة مستمدة من المبادئ التوجيهية المنشورة والمراجعة علميًا.',
    sources: 'مصادر معادلاتنا',
    sourcesText: 'جميع المعادلات السريرية المُطبَّقة على هذه المنصة مستمدة من المبادئ التوجيهية المنشورة والأدبيات الطبية المُحكَّمة، بما فيها:',
    multilingual: 'متعدد اللغات بالتصميم',
    multilingualText: 'صُممت كير كالكولوس من الأساس لخدمة الأطباء والممارسين باللغات الإنجليزية والفرنسية والعربية — مغطيةً المعايير السريرية لأمريكا الشمالية وأوروبا ومنطقة الشرق الأوسط وشمال أفريقيا.',
    disclaimer: 'تنبيه مهم',
    disclaimerText: 'كير كالكولوس أداة لدعم القرار السريري، وليست بديلاً عن الحكم الطبي المهني. راجع',
    disclaimerLink: 'إخلاء المسؤولية الطبية',
    contact: 'التواصل',
    contactText: 'لتصحيح المعادلات أو تحديث الإرشادات أو ملاحظات الوصول، استخدم رابط الملاحظات في متصفحك أو تواصل معنا عبر GitHub Issues.',
  },
};

const SOURCES = ['AHA (American Heart Association)', 'ESC (European Society of Cardiology)', 'NIH (National Institutes of Health)', 'SFAR (Société Française d\'Anesthésie-Réanimation)', 'SRLF (Société de Réanimation de Langue Française)', 'CDC (Centers for Disease Control)', 'HAS (Haute Autorité de Santé)', 'PubMed peer-reviewed literature'];

export default function About({ lang }: { lang: LangCode }) {
  const { langPath } = useLang();
  const t = T[lang];
  const isRtl = lang === 'ar';

  return (
    <div className="space-y-10 pb-8 max-w-3xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-blue-100 rounded-xl">
          <HeartPulse className="w-6 h-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">{t.title}</h1>
      </div>

      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-3">
        <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-blue-600" />
          {t.mission}
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">{t.missionText}</p>
      </section>

      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-3">
        <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <Calculator className="w-4 h-4 text-blue-600" />
          {t.what}
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">{t.whatText}</p>
      </section>

      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-3">
        <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          {t.sources}
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">{t.sourcesText}</p>
        <ul className="space-y-1.5 mt-2">
          {SOURCES.map(s => (
            <li key={s} className="flex items-center gap-2 text-xs text-gray-600">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-3">
        <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-600" />
          {t.multilingual}
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">{t.multilingualText}</p>
      </section>

      <section className="bg-amber-50 border border-amber-100 rounded-2xl p-6 space-y-3">
        <h2 className="text-sm font-black text-amber-800 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          {t.disclaimer}
        </h2>
        <p className="text-sm text-amber-800 leading-relaxed">
          {t.disclaimerText}{' '}
          <Link to={langPath('/disclaimer')} className="underline font-bold hover:text-amber-900">
            {t.disclaimerLink}
          </Link>.
        </p>
      </section>

      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-3">
        <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">{t.contact}</h2>
        <p className="text-sm text-gray-600 leading-relaxed">{t.contactText}</p>
      </section>
    </div>
  );
}
