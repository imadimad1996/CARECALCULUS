import React from 'react';
import { FileText, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LangCode } from '../types';
import { useLang } from '../utils/lang';

const T = {
  en: {
    title: 'Terms of Use',
    updated: 'Last updated: June 2026',
    sections: [
      {
        heading: 'Acceptance of Terms',
        body: 'By accessing or using CareCalculus you agree to be bound by these Terms of Use. If you do not agree, please do not use this platform.',
      },
      {
        heading: 'Permitted Use',
        body: 'CareCalculus is provided free of charge for lawful, non-commercial clinical and educational use by healthcare professionals and students. You may not use this platform to provide medical advice to the general public, to replace a licensed clinical service, or for any unlawful purpose.',
      },
      {
        heading: 'No Medical Advice',
        body: 'Nothing on this platform constitutes medical advice, diagnosis, or treatment. All calculator outputs are for clinical decision-support only. See our Medical Disclaimer for full details.',
      },
      {
        heading: 'Accuracy and Updates',
        body: 'We make reasonable efforts to keep formulas accurate and aligned with current guidelines. We do not warrant that all content is complete, current, or error-free. You are responsible for verifying formula accuracy against your institutional standards.',
      },
      {
        heading: 'Intellectual Property',
        body: 'The CareCalculus name, design, and codebase are proprietary. The underlying clinical formulas and scoring algorithms are in the public domain (sourced from published scientific literature). You may not reproduce or redistribute the site\'s user interface or code without written permission.',
      },
      {
        heading: 'Limitation of Liability',
        body: 'To the fullest extent permitted by law, CareCalculus and its developers shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of this platform or reliance on its outputs.',
      },
      {
        heading: 'Availability',
        body: 'We do not guarantee uninterrupted availability. The platform may be updated, modified, or temporarily unavailable without notice.',
      },
      {
        heading: 'Governing Law',
        body: 'These terms are governed by applicable international law. Any dispute shall be resolved in good faith between the parties.',
      },
    ],
  },
  fr: {
    title: 'Conditions d\'utilisation',
    updated: 'Dernière mise à jour : juin 2026',
    sections: [
      {
        heading: 'Acceptation des conditions',
        body: 'En accédant à CareCalculus ou en l\'utilisant, vous acceptez d\'être lié par ces Conditions d\'utilisation. Si vous n\'êtes pas d\'accord, veuillez ne pas utiliser cette plateforme.',
      },
      {
        heading: 'Utilisation autorisée',
        body: 'CareCalculus est fourni gratuitement pour un usage clinique et éducatif légal et non commercial par les professionnels de santé et les étudiants. Vous n\'êtes pas autorisé à utiliser cette plateforme pour dispenser des conseils médicaux au grand public ou remplacer un service clinique agréé.',
      },
      {
        heading: 'Aucun conseil médical',
        body: 'Rien sur cette plateforme ne constitue un avis médical, un diagnostic ou un traitement. Tous les résultats des calculateurs sont uniquement destinés à l\'aide à la décision clinique. Consultez notre Avertissement médical pour plus de détails.',
      },
      {
        heading: 'Exactitude et mises à jour',
        body: 'Nous faisons des efforts raisonnables pour maintenir l\'exactitude des formules et leur alignement avec les recommandations actuelles. Nous ne garantissons pas que tout le contenu est complet, actuel ou exempt d\'erreurs.',
      },
      {
        heading: 'Propriété intellectuelle',
        body: 'Le nom, le design et le code de CareCalculus sont propriétaires. Les formules cliniques sous-jacentes sont dans le domaine public. Vous n\'êtes pas autorisé à reproduire ou redistribuer l\'interface utilisateur ou le code sans autorisation écrite.',
      },
      {
        heading: 'Limitation de responsabilité',
        body: 'Dans toute la mesure permise par la loi, CareCalculus et ses développeurs ne sauraient être tenus responsables des dommages découlant de votre utilisation de cette plateforme.',
      },
      {
        heading: 'Disponibilité',
        body: 'Nous ne garantissons pas une disponibilité ininterrompue. La plateforme peut être mise à jour, modifiée ou temporairement indisponible sans préavis.',
      },
      {
        heading: 'Droit applicable',
        body: 'Ces conditions sont régies par le droit international applicable. Tout litige sera résolu de bonne foi entre les parties.',
      },
    ],
  },
  ar: {
    title: 'شروط الاستخدام',
    updated: 'آخر تحديث: يونيو 2026',
    sections: [
      {
        heading: 'قبول الشروط',
        body: 'بالوصول إلى كير كالكولوس أو استخدامها، فإنك توافق على الالتزام بشروط الاستخدام هذه. إذا كنت لا توافق، يرجى عدم استخدام هذه المنصة.',
      },
      {
        heading: 'الاستخدام المسموح به',
        body: 'تُقدَّم كير كالكولوس مجانًا للاستخدام السريري والتعليمي القانوني وغير التجاري من قِبَل المختصين الصحيين والطلاب. لا يُسمح باستخدام هذه المنصة لتقديم نصائح طبية للعامة أو لاستبدال خدمة سريرية مرخصة.',
      },
      {
        heading: 'لا توجد نصيحة طبية',
        body: 'لا يُشكّل أي شيء على هذه المنصة نصيحة طبية أو تشخيصًا أو علاجًا. جميع مخرجات الحاسبات مخصصة لدعم القرار السريري فقط. راجع إخلاء المسؤولية الطبية للتفاصيل الكاملة.',
      },
      {
        heading: 'الدقة والتحديثات',
        body: 'نبذل جهودًا معقولة للحفاظ على دقة المعادلات وتوافقها مع الإرشادات الحالية. لا نضمن أن جميع المحتوى مكتمل أو حديث أو خالٍ من الأخطاء.',
      },
      {
        heading: 'الملكية الفكرية',
        body: 'اسم كير كالكولوس وتصميمها وقاعدة كودها ملكية خاصة. المعادلات السريرية الأساسية في المجال العام. لا يُسمح بإعادة إنتاج واجهة المستخدم أو الكود أو توزيعها دون إذن كتابي.',
      },
      {
        heading: 'تحديد المسؤولية',
        body: 'بالقدر الأقصى المسموح به قانونًا، لن تكون كير كالكولوس ومطوروها مسؤولين عن أي أضرار تنشأ عن استخدامك لهذه المنصة.',
      },
      {
        heading: 'التوافر',
        body: 'لا نضمن التوافر المتواصل. قد يتم تحديث المنصة أو تعديلها أو جعلها غير متاحة مؤقتًا دون إشعار مسبق.',
      },
      {
        heading: 'القانون الحاكم',
        body: 'تخضع هذه الشروط للقانون الدولي المعمول به. يُحلّ أي نزاع بحسن نية بين الطرفين.',
      },
    ],
  },
};

export default function Terms({ lang }: { lang: LangCode }) {
  const { langPath } = useLang();
  const t = T[lang];
  const isRtl = lang === 'ar';

  return (
    <div className="space-y-8 pb-8 max-w-3xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-slate-100 rounded-xl">
            <FileText className="w-6 h-6 text-slate-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">{t.title}</h1>
        </div>
        <p className="text-xs text-gray-400 font-mono ml-1">{t.updated}</p>
      </div>

      <div className="space-y-4">
        {t.sections.map((section, i) => (
          <section key={i} className="bg-white border border-gray-100 rounded-2xl p-6 space-y-2">
            <h2 className="text-sm font-black text-gray-900">{section.heading}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{section.body}</p>
          </section>
        ))}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-start gap-3">
        <HeartPulse className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 leading-relaxed">
          {lang === 'fr'
            ? 'Voir aussi notre '
            : lang === 'ar'
              ? 'راجع أيضًا '
              : 'Also see our '}
          <Link to={langPath('/privacy')} className="underline text-blue-600 font-semibold hover:text-blue-800">
            {lang === 'fr' ? 'Politique de confidentialité' : lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </Link>
          {lang === 'fr' ? ' et notre ' : lang === 'ar' ? ' و' : ' and our '}
          <Link to={langPath('/disclaimer')} className="underline text-blue-600 font-semibold hover:text-blue-800">
            {lang === 'fr' ? 'Avertissement médical' : lang === 'ar' ? 'إخلاء المسؤولية الطبية' : 'Medical Disclaimer'}
          </Link>.
        </p>
      </div>
    </div>
  );
}
