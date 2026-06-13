import React from 'react';
import { ShieldCheck, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LangCode } from '../types';
import { useLang } from '../utils/lang';

const T = {
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: June 2026',
    intro: 'CareCalculus is designed with privacy as a default. This page explains what data we collect (very little) and how we use it.',
    sections: [
      {
        heading: 'No Personal Data Collected',
        body: 'CareCalculus does not collect, store, or transmit any personally identifiable information (PII). We do not require account registration. No medical data you enter into our calculators is sent to any server — all calculations are performed locally in your browser.',
      },
      {
        heading: 'Local Storage Only',
        body: 'We use your browser\'s localStorage exclusively to remember your language preference (carecalculus-lang) and unit standard preference (carecalculus-standard). This data never leaves your device and is not shared with any third party.',
      },
      {
        heading: 'No Tracking or Analytics',
        body: 'CareCalculus does not use Google Analytics, Facebook Pixel, or any third-party tracking scripts. We do not build user profiles, track browsing history, or use advertising cookies.',
      },
      {
        heading: 'Third-Party Services',
        body: 'We do not embed third-party widgets that collect data. Our only external dependency is the Lucide icon library (CSS/SVG, no tracking). The site is hosted as static files and served via a CDN.',
      },
      {
        heading: 'Cookies',
        body: 'We do not use any cookies. Preferences are stored in localStorage only, which is not transmitted with HTTP requests.',
      },
      {
        heading: 'GDPR & CCPA Compliance',
        body: 'Because we collect no personal data, the vast majority of GDPR and CCPA obligations do not apply. There is no data to access, correct, export, or delete. If you wish to clear your language/unit preferences, you can clear localStorage in your browser settings at any time.',
      },
      {
        heading: 'Changes to This Policy',
        body: 'If we introduce any analytics or data collection in the future, this policy will be updated before those changes take effect and a notice will appear on the site.',
      },
    ],
  },
  fr: {
    title: 'Politique de confidentialité',
    updated: 'Dernière mise à jour : juin 2026',
    intro: 'CareCalculus est conçu avec la confidentialité par défaut. Cette page explique quelles données nous collectons (très peu) et comment nous les utilisons.',
    sections: [
      {
        heading: 'Aucune donnée personnelle collectée',
        body: 'CareCalculus ne collecte, ne stocke ni ne transmet aucune information personnelle identifiable (IPI). Nous n\'exigeons pas d\'inscription. Aucune donnée médicale saisie dans nos calculateurs n\'est envoyée à un serveur — tous les calculs sont effectués localement dans votre navigateur.',
      },
      {
        heading: 'Stockage local uniquement',
        body: 'Nous utilisons uniquement le localStorage de votre navigateur pour mémoriser votre préférence de langue (carecalculus-lang) et votre préférence d\'unité (carecalculus-standard). Ces données ne quittent jamais votre appareil.',
      },
      {
        heading: 'Aucun suivi ni analyse',
        body: 'CareCalculus n\'utilise pas Google Analytics, Facebook Pixel ni aucun script de suivi tiers. Nous ne construisons pas de profils d\'utilisateurs, ne suivons pas l\'historique de navigation et n\'utilisons pas de cookies publicitaires.',
      },
      {
        heading: 'Services tiers',
        body: 'Nous n\'intégrons pas de widgets tiers qui collectent des données. Notre seule dépendance externe est la bibliothèque d\'icônes Lucide (CSS/SVG, sans suivi).',
      },
      {
        heading: 'Cookies',
        body: 'Nous n\'utilisons aucun cookie. Les préférences sont stockées uniquement dans le localStorage, qui n\'est pas transmis avec les requêtes HTTP.',
      },
      {
        heading: 'Conformité RGPD & CCPA',
        body: 'Comme nous ne collectons aucune donnée personnelle, la grande majorité des obligations RGPD et CCPA ne s\'appliquent pas. Si vous souhaitez effacer vos préférences, vous pouvez vider le localStorage dans les paramètres de votre navigateur.',
      },
      {
        heading: 'Modifications de cette politique',
        body: 'Si nous introduisons des analyses ou une collecte de données à l\'avenir, cette politique sera mise à jour avant l\'entrée en vigueur de ces changements.',
      },
    ],
  },
  ar: {
    title: 'سياسة الخصوصية',
    updated: 'آخر تحديث: يونيو 2026',
    intro: 'صُممت كير كالكولوس مع الخصوصية بوصفها خيارًا افتراضيًا. توضح هذه الصفحة البيانات التي نجمعها (القليل جداً) وكيفية استخدامها.',
    sections: [
      {
        heading: 'لا يتم جمع بيانات شخصية',
        body: 'لا تجمع كير كالكولوس أي معلومات تعريف شخصية أو تخزنها أو تنقلها. لا نشترط تسجيل حساب. لا يتم إرسال أي بيانات طبية تُدخلها في حاسباتنا إلى أي خادم — جميع العمليات الحسابية تُجرى محليًا في متصفحك.',
      },
      {
        heading: 'التخزين المحلي فقط',
        body: 'نستخدم localStorage في متصفحك حصريًا لتذكر تفضيل اللغة (carecalculus-lang) وتفضيل وحدة القياس (carecalculus-standard). هذه البيانات لا تغادر جهازك أبدًا.',
      },
      {
        heading: 'لا تتبع ولا تحليلات',
        body: 'لا تستخدم كير كالكولوس Google Analytics أو Facebook Pixel أو أي نصوص برمجية تتبع تابعة لجهات خارجية. لا نبني ملفات تعريفية للمستخدمين، ولا نتتبع سجل التصفح، ولا نستخدم ملفات تعريف الارتباط الإعلانية.',
      },
      {
        heading: 'خدمات الطرف الثالث',
        body: 'لا ندمج أدوات تابعة لجهات خارجية تجمع البيانات. تبعيتنا الخارجية الوحيدة هي مكتبة أيقونات Lucide (CSS/SVG، بدون تتبع).',
      },
      {
        heading: 'ملفات تعريف الارتباط',
        body: 'لا نستخدم أي ملفات تعريف ارتباط. تُخزَّن التفضيلات في localStorage فقط، وهو لا يُرسل مع طلبات HTTP.',
      },
      {
        heading: 'الامتثال للائحة GDPR وقانون CCPA',
        body: 'بما أننا لا نجمع أي بيانات شخصية، فإن معظم التزامات GDPR وCCPA لا تنطبق. إذا رغبت في مسح تفضيلاتك، يمكنك مسح localStorage من إعدادات متصفحك في أي وقت.',
      },
      {
        heading: 'التغييرات على هذه السياسة',
        body: 'إذا أدخلنا أي تحليلات أو جمع بيانات في المستقبل، سيتم تحديث هذه السياسة قبل دخول تلك التغييرات حيز التنفيذ.',
      },
    ],
  },
};

export default function Privacy({ lang }: { lang: LangCode }) {
  const { langPath } = useLang();
  const t = T[lang];
  const isRtl = lang === 'ar';

  return (
    <div className="space-y-8 pb-8 max-w-3xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-emerald-100 rounded-xl">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">{t.title}</h1>
        </div>
        <p className="text-xs text-gray-400 font-mono ml-1">{t.updated}</p>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
        <p className="text-sm text-emerald-800 leading-relaxed font-semibold">{t.intro}</p>
      </div>

      <div className="space-y-4">
        {t.sections.map((section, i) => (
          <section key={i} className="bg-white border border-gray-100 rounded-2xl p-6 space-y-2">
            <h2 className="text-sm font-black text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              {section.heading}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">{section.body}</p>
          </section>
        ))}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-start gap-3">
        <HeartPulse className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 leading-relaxed">
          {lang === 'fr'
            ? 'Pour toute question sur cette politique, consultez également nos '
            : lang === 'ar'
              ? 'لأي أسئلة حول هذه السياسة، راجع أيضًا '
              : 'For any questions about this policy, also see our '}
          <Link to={langPath('/terms')} className="underline text-blue-600 font-semibold hover:text-blue-800">
            {lang === 'fr' ? 'Conditions d\'utilisation' : lang === 'ar' ? 'شروط الاستخدام' : 'Terms of Use'}
          </Link>.
        </p>
      </div>
    </div>
  );
}
