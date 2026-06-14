import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, BookOpen, Clock, Tag, Calendar, User, ChevronRight, Bookmark, Share2, Sparkles, CheckCircle2, ArrowLeft, HeartPulse, Stethoscope, Scale, ShieldAlert, Award, ArrowUpRight } from 'lucide-react';
import { LangCode } from '../types';
import { MASTER_ORL, generateMasterContent, t } from '../utils/masterListContent';
import { slugify, findBySlug } from '../utils/slug';
import { useLang } from '../utils/lang';

interface OrlSpecializationProps {
  lang: LangCode;
}

export default function OrlSpecialization({ lang }: OrlSpecializationProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { langPath } = useLang();

  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const isRtl = lang === 'ar';

  // Calculator states
  const [subsite, setSubsite] = useState<'glottis' | 'supraglottis' | 'subglottis'>('glottis');
  const [tStage, setTStage] = useState<string>('T1');
  const [nStage, setNStage] = useState<string>('N0');
  const [mStage, setMStage] = useState<string>('M0');

  const openPost = (a: any) => navigate(langPath(`/orl/${slugify(t(a.title, 'en'), a.id)}`));
  const closePost = () => navigate(langPath('/orl'));

  const activePost = useMemo(
    () => findBySlug(MASTER_ORL, slug, a => t(a.title, 'en')),
    [slug]
  );

  // Sync scroll on post swap
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [slug]);

  // Handle wrong slug redirect
  useEffect(() => {
    if (slug && !activePost) navigate(langPath('/orl'), { replace: true });
  }, [slug, activePost, navigate]);

  // SEO updates
  useEffect(() => {
    if (!activePost) {
      document.title = lang === 'fr' ? 'Spécialisation ORL & Cancer du Larynx' : lang === 'ar' ? 'تخصص الأنف والأذن والحنجرة وسرطان الحنجرة' : 'ORL & Laryngeal Cancer Specialization';
      return;
    }
    document.title = `${t(activePost.title, lang)} | CareCalculus ORL`;
  }, [activePost, lang]);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const sharePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // TNM staging calculations
  const stageGroup = useMemo(() => {
    if (mStage === 'M1') return 'Stage IVC';
    if (tStage === 'T4b' || nStage === 'N3') return 'Stage IVB';
    if (tStage === 'T4a' || nStage === 'N2') return 'Stage IVA';
    if (tStage === 'T3' || nStage === 'N1') return 'Stage III';
    if (tStage === 'T2') return 'Stage II';
    return 'Stage I'; // T1 N0 M0
  }, [tStage, nStage, mStage]);

  // Staging labels and texts
  const translations = {
    title: { en: 'ORL / Laryngeal Cancer Specialization', fr: 'Spécialisation ORL & Cancer du Larynx', ar: 'تخصص الأنف والأذن والحنجرة وسرطان الحنجرة' },
    sub: { en: 'Clinical Staging Tools and Evidence-Based Literature Database', fr: 'Outils de stadification clinique et bibliothèque de recherche scientifique', ar: 'أدوات التصنيف السريري وقاعدة بيانات الأبحاث الطبية المعتمدة' },
    calcHeader: { en: 'Laryngeal Cancer TNM Staging Calculator (AJCC 8th Ed.)', fr: 'Calculateur de Stadification TNM du Cancer Laryngé (AJCC 8e)', ar: 'حاسبة تصنيف سرطان الحنجرة TNM (الطبعة الثامنة)' },
    subsiteLabel: { en: 'Anatomical Subsite', fr: 'Sous-site anatomique', ar: 'الموقع التشريحي الفرعي' },
    tLabel: { en: 'Primary Tumor (T)', fr: 'Tumeur primaire (T)', ar: 'الورم الأولي (T)' },
    nLabel: { en: 'Regional Lymph Nodes (N)', fr: 'Ganglions régionaux (N)', ar: 'العقد اللمفاوية الإقليمية (N)' },
    mLabel: { en: 'Distant Metastasis (M)', fr: 'Métastase à distance (M)', ar: 'الانتشار البعيد (M)' },
    calcStage: { en: 'Calculated Stage Group:', fr: 'Groupe de stade calculé :', ar: 'مجموعة المرحلة المحسوبة:' },
    recommendations: { en: 'Clinical Staging Recommendations', fr: 'Recommandations cliniques de stadification', ar: 'التوجيهات السريرية للمرحلة' },
    details: { en: 'Scientific Article Directory', fr: 'Répertoire des articles scientifiques', ar: 'فهرس المقالات والأبحاث العلمية' },
    back: { en: 'Back to Specialization', fr: 'Retour à la Spécialisation', ar: 'الرجوع للتخصص' },
    readMore: { en: 'Read Article', fr: 'Lire l\'article', ar: 'اقرأ المقال' }
  };

  const getTDescriptions = () => {
    if (subsite === 'supraglottis') {
      return {
        T1: {
          en: 'T1: Tumor limited to one subsite of supraglottis with normal vocal cord mobility.',
          fr: 'T1 : Tumeur limitée à un seul sous-site de la supraglotte, mobilité normale des cordes vocales.',
          ar: 'T1: ورم محدود في موقع فرعي واحد من فوق المزمار مع حركة طبيعية للحبال الصوتية.'
        },
        T2: {
          en: 'T2: Tumor invades mucosa of adjacent subsite of supraglottis, glottis, or region outside supraglottis without larynx fixation.',
          fr: 'T2 : Tumeur envahit la muqueuse d\'un sous-site adjacent de la supraglotte ou glotte sans fixation laryngée.',
          ar: 'T2: ورم يغزو الغشاء المخاطي للموقع المجاور لفوق المزمار أو المزمار دون تثبيت الحنجرة.'
        },
        T3: {
          en: 'T3: Tumor limited to larynx with vocal cord fixation and/or paraglottic space or pre-epiglottic tissue invasion.',
          fr: 'T3 : Tumeur limitée au larynx avec fixation des cordes vocales et/ou invasion de l\'espace paraglottique.',
          ar: 'T3: ورم محدود في الحنجرة مع تثبيت الحبل الصوتي أو غزو الحيز المجاورة للمزمار.'
        },
        T4a: {
          en: 'T4a: Tumor invades through thyroid cartilage and/or tissues beyond larynx (e.g., trachea, soft tissues of neck).',
          fr: 'T4a : Tumeur envahit à travers le cartilage thyroïde et/ou les tissus extralaryngés.',
          ar: 'T4a: ورم يغزو من خلال الغضروف الدرقي أو الأنسجة خارج الحنجرة (مثل الرغامي أو الرقبة).'
        },
        T4b: {
          en: 'T4b: Tumor invades prevertebral space, encases carotid artery, or invades mediastinal structures.',
          fr: 'T4b : Tumeur envahit l\'espace prévertébral, la carotide ou le médiastin.',
          ar: 'T4b: ورم يغزو الحيز أمام الفقار، أو يغلف الشريان السباتي، أو يغزو المنصف.'
        }
      };
    } else if (subsite === 'glottis') {
      return {
        T1: {
          en: 'T1: Tumor limited to vocal cord(s) with normal mobility (may involve anterior/posterior commissures).',
          fr: 'T1 : Tumeur limitée aux cordes vocales avec mobilité normale.',
          ar: 'T1: ورم محدود في الحبل (الحبال) الصوتية مع حركة طبيعية.'
        },
        T2: {
          en: 'T2: Tumor extends to supraglottis and/or subglottis, and/or with impaired vocal cord mobility.',
          fr: 'T2 : Tumeur s\'étend vers la supraglotte ou sous-glotte, et/ou avec mobilité réduite des cordes.',
          ar: 'T2: ورم يمتد إلى فوق المزمار أو تحت المزمار، أو يرافقه ضعف في حركة الحبل الصوتي.'
        },
        T3: {
          en: 'T3: Tumor limited to larynx with vocal cord fixation and/or paraglottic space invasion.',
          fr: 'T3 : Tumeur limitée au larynx avec fixation des cordes vocales et/ou invasion paraglottique.',
          ar: 'T3: ورم محدود في الحنجرة مع تثبيت الحبل الصوتي أو غزو الحيز المجاور للمزمار.'
        },
        T4a: {
          en: 'T4a: Tumor invades through thyroid cartilage and/or tissues beyond larynx.',
          fr: 'T4a : Tumeur envahit à travers le cartilage thyroïde et/ou les tissus extralaryngés.',
          ar: 'T4a: ورم يغزو من خلال الغضروف الدرقي أو الأنسجة خارج الحنجرة.'
        },
        T4b: {
          en: 'T4b: Tumor invades prevertebral space, encases carotid artery, or invades mediastinal structures.',
          fr: 'T4b : Tumeur envahit l\'espace prévertébral, la carotide ou le médiastin.',
          ar: 'T4b: ورم يغزو الحيز أمام الفقار، أو يغلف الشريان السباتي، أو يغزو المنصف.'
        }
      };
    } else {
      return {
        T1: {
          en: 'T1: Tumor limited to subglottis.',
          fr: 'T1 : Tumeur limitée à la sous-glotte.',
          ar: 'T1: ورم محدود في منطقة تحت المزمار.'
        },
        T2: {
          en: 'T2: Tumor extends to vocal cord(s) with normal or impaired mobility.',
          fr: 'T2 : Tumeur s\'étend aux cordes vocales avec mobilité normale ou diminuée.',
          ar: 'T2: ورم يمتد إلى الحبل (الحبال) الصوتية مع حركة طبيعية أو ضعيفة.'
        },
        T3: {
          en: 'T3: Tumor limited to larynx with vocal cord fixation.',
          fr: 'T3 : Tumeur limitée au larynx avec fixation des cordes vocales.',
          ar: 'T3: ورم محدود في الحنجرة مع تثبيت الحبل الصوتي.'
        },
        T4a: {
          en: 'T4a: Tumor invades through cricoid or thyroid cartilage and/or tissues beyond larynx.',
          fr: 'T4a : Tumeur envahit à travers les cartilages cricoïde ou thyroïde et/ou les tissus extralaryngés.',
          ar: 'T4a: ورم يغزو من خلال الغضروف الحلقي أو الدرقي أو الأنسجة خارج الحنجرة.'
        },
        T4b: {
          en: 'T4b: Tumor invades prevertebral space, encases carotid artery, or invades mediastinal structures.',
          fr: 'T4b : Tumeur envahit l\'espace prévertébral, la carotide ou le médiastin.',
          ar: 'T4b: ورم يغزو الحيز أمام الفقار، أو يغلف الشريان السباتي، أو يغزو المنصف.'
        }
      };
    }
  };

  const getNDescriptions = () => {
    return {
      N0: { en: 'N0: No regional lymph node metastasis.', fr: 'N0 : Pas de métastase ganglionnaire régionale.', ar: 'N0: لا توجد نقائل في الغدد اللمفاوية الإقليمية.' },
      N1: { en: 'N1: Metastasis in a single ipsilateral lymph node, ≤ 3 cm.', fr: 'N1 : Métastase dans un ganglion ipsilatéral unique ≤ 3 cm.', ar: 'N1: نقيلة في غدة لمفاوية واحدة في نفس الجانب ≤ 3 سم.' },
      N2: { en: 'N2: Metastasis in single ipsilateral node (3-6 cm), multiple ipsilateral nodes (≤6 cm), or bilateral/contralateral nodes.', fr: 'N2 : Métastase ganglionnaire multiple ou bilatérale ≤ 6 cm, ou ganglion unique de 3 à 6 cm.', ar: 'N2: نقيلة في غدة واحدة في نفس الجانب (3-6 سم)، أو غدد متعددة في نفس الجانب (≤ 6 سم)، أو غدد في كلا الجانبين.' },
      N3: { en: 'N3: Metastasis in lymph node > 6 cm, or with extranodal extension.', fr: 'N3 : Métastase ganglionnaire > 6 cm ou rupture capsulaire.', ar: 'N3: نقيلة في غدة لمفاوية > 6 سم، أو انتشار خارج الغدة.' }
    };
  };

  const getMDescriptions = () => {
    return {
      M0: { en: 'M0: No distant metastasis.', fr: 'M0 : Pas de métastase à distance.', ar: 'M0: لا توجد نقائل بعيدة.' },
      M1: { en: 'M1: Distant metastasis present (most commonly lung, liver, bone).', fr: 'M1 : Présence de métastase(s) à distance (poumon, foie, os).', ar: 'M1: توجد نقائل بعيدة (غالباً الرئتين، الكبد، العظام).' }
    };
  };

  const getRecommendationText = () => {
    if (stageGroup === 'Stage I' || stageGroup === 'Stage II') {
      return {
        en: 'Early stage disease. Mainstay of treatment is single-modality therapy: transoral laser microsurgery (TLM), partial laryngectomy, or definitive radiotherapy to preserve voice and avoid tracheostomy.',
        fr: 'Stade précoce. Le traitement repose sur une modalité unique : microchirurgie laser transorale (TLM), laryngectomie partielle ou radiothérapie exclusive pour préserver la voix.',
        ar: 'المرحلة المبكرة. يعتمد العلاج على أسلوب علاجي واحد: الجراحة المجهرية بالليزر عبر الفم (TLM)، استئصال الحنجرة الجزئي، أو العلاج الإشعاعي النهائي للحفاظ على الصوت وتجنب شق الرغامي.'
      };
    }
    if (stageGroup === 'Stage III') {
      return {
        en: 'Locally advanced disease. Requires multidisciplinary management. Options include larynx-preservation protocols using concurrent chemoradiotherapy (CRT) or surgical resection (e.g., partial or total laryngectomy) followed by adjuvant therapy.',
        fr: 'Stade localement avancé. Prise en charge multidisciplinaire. Les options incluent les protocoles de préservation laryngée par chimioradiothérapie (CRT) ou chirurgie avec traitement adjuvant.',
        ar: 'مرحلة متقدمة موضعياً. تتطلب إدارة متعددة التخصصات. تشمل الخيارات بروتوكولات الحفاظ على الحنجرة باستخدام العلاج الكيميائي الإشعاعي المتزامن (CRT) أو الاستئصال الجراحي متبوعاً بالعلاج المساند.'
      };
    }
    if (stageGroup === 'Stage IVA' || stageGroup === 'Stage IVB') {
      return {
        en: 'Severely advanced regional disease. Often requires total laryngectomy with neck dissection, reconstruction, and postoperative adjuvant radiotherapy or chemoradiotherapy. In case of unresectable (IVB), induction chemotherapy followed by CRT or clinical trials.',
        fr: 'Stade régional très avancé. Nécessite souvent une laryngectomie totale avec évidement ganglionnaire, reconstruction et chimioradiothérapie adjuvante. Pour les cas inopérables (IVB), chimioradiothérapie.',
        ar: 'مرحلة إقليمية متقدمة للغاية. تتطلب غالباً استئصال الحنجرة بالكامل مع تشريح العنق، وإعادة البناء، تليها أشعة أو علاج كيميائي مساند. للحالات غير القابلة للاستئصال (IVB)، يعتمد العلاج الكيميائي الإشعاعي.'
      };
    }
    return {
      en: 'Metastatic disease. Treatment is systemic and palliative: chemotherapy, immunotherapy (immune checkpoint inhibitors like pembrolizumab/nivolumab), or clinical trials, combined with local symptom control.',
      fr: 'Maladie métastatique. Le traitement est systémique et palliatif : chimiothérapie, immunothérapie (pembrolizumab/nivolumab) ou essais cliniques, combinés au contrôle des symptômes.',
      ar: 'مرض منتشر. العلاج يكون جهازياً وتلطيفياً: العلاج الكيميائي، العلاج المناعي (مثبطات نقاط التفتيش المناعية مثل بيمبروليزوماب)، أو التجارب السريرية، مصحوباً بالتحكم الموضعي في الأعراض.'
    };
  };

  const getStageColor = () => {
    if (stageGroup === 'Stage I') return 'bg-emerald-50 border-emerald-250 text-emerald-700 dark:bg-emerald-950/20';
    if (stageGroup === 'Stage II') return 'bg-blue-50 border-blue-250 text-blue-700 dark:bg-blue-950/20';
    if (stageGroup === 'Stage III') return 'bg-amber-50 border-amber-250 text-amber-700 dark:bg-amber-950/20';
    return 'bg-red-50 border-red-250 text-red-700 dark:bg-red-950/20';
  };

  const filtered = useMemo(() => {
    if (!searchTerm) return MASTER_ORL;
    const q = searchTerm.toLowerCase();
    return MASTER_ORL.filter(a =>
      t(a.title, 'en').toLowerCase().includes(q) ||
      t(a.title, 'fr').toLowerCase().includes(q) ||
      t(a.title, 'ar').toLowerCase().includes(q) ||
      t(a.snippet, 'en').toLowerCase().includes(q) ||
      a.author.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  const activeTDesc = getTDescriptions()[tStage as keyof ReturnType<typeof getTDescriptions>];
  const activeNDesc = getNDescriptions()[nStage as keyof ReturnType<typeof getNDescriptions>];
  const activeMDesc = getMDescriptions()[mStage as keyof ReturnType<typeof getMDescriptions>];
  const activeRecommendation = getRecommendationText();

  // Reader View
  if (activePost) {
    const contentText = generateMasterContent(activePost.id, t(activePost.title, 'en'), t(activePost.snippet, 'en'), lang);
    return (
      <div className={`animate-fade-in space-y-6 text-gray-850 ${isRtl ? 'text-right' : 'text-left'}`}>
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 flex flex-wrap items-center justify-between gap-4 shadow-xs">
          <button
            onClick={closePost}
            className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 font-black text-xs tracking-tight rounded-xl transition border border-gray-200/80"
            style={{ minHeight: '38px' }}
          >
            <ArrowLeft className={`w-4 h-4 shrink-0 ${isRtl ? 'rotate-180' : ''}`} />
            <span>{translations.back[lang]}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => toggleBookmark(activePost.id, e)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                bookmarkedIds.includes(activePost.id)
                  ? 'bg-amber-50 border-amber-200 text-amber-600'
                  : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
              style={{ minHeight: '38px' }}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds.includes(activePost.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span className="hidden sm:inline">
                {bookmarkedIds.includes(activePost.id) ? (lang === 'fr' ? 'Enregistré' : lang === 'ar' ? 'محفوظ' : 'Saved') : (lang === 'fr' ? 'Enregistrer' : lang === 'ar' ? 'حفظ' : 'Save')}
              </span>
            </button>
            <button
              onClick={sharePost}
              className="px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              style={{ minHeight: '38px' }}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600">{lang === 'fr' ? 'Copié' : lang === 'ar' ? 'تم النسخ' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{lang === 'fr' ? 'Partager' : lang === 'ar' ? 'مشاركة' : 'Share'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        <article className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-200/85 shadow-xs space-y-6 select-text">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border font-mono text-[9px] font-black uppercase rounded-md tracking-wider bg-amber-50 border-amber-150 text-amber-700">
                <HeartPulse className="w-3.5 h-3.5" />
                {lang === 'fr' ? 'ORL / Oncologie' : lang === 'ar' ? 'أنف وأذن وحنجرة / أورام' : 'ORL / Oncology'}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                {activePost.readTime}
              </span>
              <span className="text-gray-200">•</span>
              <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                {activePost.date}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {t(activePost.title, lang)}
            </h1>

            <div className="flex items-center gap-2.5 text-xs p-4 bg-slate-50 border border-gray-150 rounded-2xl">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-black uppercase font-mono">
                {activePost.author.replace('Dr. ', '').replace('Prof. ', '').slice(0, 2)}
              </div>
              <div className="flex-1">
                <span className="text-gray-400 block font-mono text-[9px] uppercase tracking-wider">{lang === 'fr' ? 'AUTEUR' : lang === 'ar' ? 'الكاتب' : 'AUTHOR'}</span>
                <span className="font-extrabold text-slate-800">{activePost.author}</span>
              </div>
              <div className="border-l border-gray-250 pl-4">
                <span className="text-gray-400 block font-mono text-[9px] uppercase tracking-wider">{lang === 'fr' ? 'RÉVISEUR' : lang === 'ar' ? 'المراجع' : 'REVIEWER'}</span>
                <span className="font-extrabold text-emerald-700">{activePost.reviewer}</span>
              </div>
            </div>
          </div>

          <div className="prose max-w-none text-slate-700 text-xs sm:text-sm md:text-[15px] leading-relaxed">
            {contentText.split('\n\n').map((block, i) => {
              if (block.startsWith('### ')) {
                return (
                  <h3 key={i} className="text-sm font-black text-slate-900 border-l-4 border-blue-600 pl-3 py-1.5 uppercase tracking-tight bg-slate-50/50 rounded-r-md mt-6 mb-3">
                    {block.replace('### ', '')}
                  </h3>
                );
              }
              if (block.startsWith('* ') || /^\d+\.\s/.test(block)) {
                const items = block.split('\n');
                const ordered = /^\d+\.\s/.test(block);
                const List = ordered ? 'ol' : 'ul';
                return (
                  <List key={i} className={`${ordered ? 'list-decimal' : 'list-disc'} pl-5 space-y-1.5 text-xs sm:text-sm text-gray-655 font-semibold my-4`}>
                    {items.map((li, idx) => (
                      <li key={idx}>{li.replace(/^\*\s/, '').replace(/^\d+\.\s/, '')}</li>
                    ))}
                  </List>
                );
              }
              return (
                <p key={i} className="text-slate-655 leading-relaxed font-semibold my-3">
                  {block}
                </p>
              );
            })}
          </div>

          {activePost.clinicalImpact && (
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-150 space-y-1.5 text-xs sm:text-sm">
              <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-600 font-extrabold block">
                {lang === 'fr' ? 'RÉSULTAT CLINIQUE CONSEILLÉ' : lang === 'ar' ? 'الأثر السريري المعتمد' : 'E-E-A-T CLINICAL IMPACT'}
              </span>
              <p className="font-bold text-emerald-800 leading-normal">{t(activePost.clinicalImpact, lang)}</p>
            </div>
          )}

          <div className="pt-6 border-t border-gray-150 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 font-mono text-[9px] uppercase tracking-widest font-black">MEDLINE INDEX:</span>
              <span className="font-mono text-gray-500 font-bold bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
                doi:{activePost.doi}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-bold">
                {activePost.citationCount} {lang === 'fr' ? 'Citations' : lang === 'ar' ? 'اقتباساً' : 'Citations'}
              </span>
            </div>
          </div>
        </article>
      </div>
    );
  }

  // Directory & Calculator View
  return (
    <div className={`space-y-8 animate-fade-in text-gray-850 ${isRtl ? 'text-right' : 'text-left'}`}>
      
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-10 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold uppercase rounded-lg tracking-widest">
            <Stethoscope className="w-3.5 h-3.5" />
            {lang === 'fr' ? 'MODULE ONCOLOGIE ORL' : lang === 'ar' ? 'وحدة أورام الأنف والأذن والحنجرة' : 'ORL ONCOLOGY MODULE'}
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            {translations.title[lang]}
          </h1>

          <p className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-2xl font-medium">
            {translations.sub[lang]}
          </p>
        </div>
      </div>

      {/* TNM Calculator Block */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <Scale className="w-6 h-6 text-indigo-600 shrink-0" />
          <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">
            {translations.calcHeader[lang]}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Form Side */}
          <div className="md:col-span-7 space-y-5">
            {/* Subsite Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-black text-gray-400 uppercase tracking-wider">
                {translations.subsiteLabel[lang]}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['glottis', 'supraglottis', 'subglottis'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSubsite(s);
                      setTStage('T1'); // reset T-stage as criteria shift
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition border capitalize ${
                      subsite === s
                        ? 'bg-indigo-650 text-white border-indigo-650 shadow-xs'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                    style={{ minHeight: '38px' }}
                  >
                    {lang === 'fr' ? (s === 'glottis' ? 'Glotte' : s === 'supraglottis' ? 'Supraglotte' : 'Sous-glotte') : lang === 'ar' ? (s === 'glottis' ? 'المزمار' : s === 'supraglottis' ? 'فوق المزمار' : 'تحت المزمار') : s}
                  </button>
                ))}
              </div>
            </div>

            {/* T stage selection */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-black text-gray-400 uppercase tracking-wider">
                {translations.tLabel[lang]}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['T1', 'T2', 'T3', 'T4a', 'T4b'].map((tVal) => (
                  <button
                    key={tVal}
                    onClick={() => setTStage(tVal)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-mono font-bold transition border ${
                      tStage === tVal
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-gray-650 border-gray-200 hover:bg-gray-50'
                    }`}
                    style={{ minHeight: '34px' }}
                  >
                    {tVal}
                  </button>
                ))}
              </div>
              <div className="p-3.5 bg-slate-50 border border-gray-150 rounded-xl text-[11px] font-semibold text-gray-600 leading-relaxed">
                {activeTDesc[lang] || activeTDesc['en']}
              </div>
            </div>

            {/* N stage selection */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-black text-gray-400 uppercase tracking-wider">
                {translations.nLabel[lang]}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['N0', 'N1', 'N2', 'N3'].map((nVal) => (
                  <button
                    key={nVal}
                    onClick={() => setNStage(nVal)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-mono font-bold transition border ${
                      nStage === nVal
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-gray-650 border-gray-200 hover:bg-gray-50'
                    }`}
                    style={{ minHeight: '34px' }}
                  >
                    {nVal}
                  </button>
                ))}
              </div>
              <div className="p-3.5 bg-slate-50 border border-gray-150 rounded-xl text-[11px] font-semibold text-gray-600 leading-relaxed">
                {activeNDesc[lang] || activeNDesc['en']}
              </div>
            </div>

            {/* M stage selection */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-black text-gray-400 uppercase tracking-wider">
                {translations.mLabel[lang]}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['M0', 'M1'].map((mVal) => (
                  <button
                    key={mVal}
                    onClick={() => setMStage(mVal)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-mono font-bold transition border ${
                      mStage === mVal
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-gray-650 border-gray-200 hover:bg-gray-50'
                    }`}
                    style={{ minHeight: '34px' }}
                  >
                    {mVal}
                  </button>
                ))}
              </div>
              <div className="p-3.5 bg-slate-50 border border-gray-150 rounded-xl text-[11px] font-semibold text-gray-600 leading-relaxed">
                {activeMDesc[lang] || activeMDesc['en']}
              </div>
            </div>
          </div>

          {/* Results Side */}
          <div className="md:col-span-5 flex flex-col justify-between p-5 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl text-white">
            <div className="space-y-4">
              <span className="text-[9px] font-mono font-black text-indigo-400 uppercase tracking-widest block">
                AJCC 8th Edition Output
              </span>
              
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">
                  {translations.calcStage[lang]}
                </span>
                <div className={`inline-flex items-center gap-1.5 px-4 py-2 border font-black rounded-xl text-lg sm:text-2xl mt-1.5 ${getStageColor()}`}>
                  {lang === 'fr' ? stageGroup.replace('Stage', 'Stade') : lang === 'ar' ? stageGroup.replace('Stage', 'المرحلة') : stageGroup}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 block mb-1">
                  TNM formula:
                </span>
                <span className="font-mono text-sm font-extrabold text-indigo-300">
                  {tStage} {nStage} {mStage} ({subsite})
                </span>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-400">
                  <Award className="w-3.5 h-3.5" />
                  <span>{translations.recommendations[lang]}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-normal font-semibold">
                  {activeRecommendation[lang] || activeRecommendation['en']}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 text-[9px] font-mono text-slate-500">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-500" />
              <span>AJCC staging requires pathology verification. For informational clinical use only.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article directory search & header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-gray-150 pb-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>{translations.details[lang]}</span>
          </h2>

          <div className="relative max-w-sm w-full">
            <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`} />
            <input
              id="orl-articles-search"
              type="text"
              placeholder={lang === 'fr' ? 'Rechercher articles...' : lang === 'ar' ? 'ابحث في مقالات الأنف والأذن والحنجرة...' : 'Search ORL articles...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full py-2 bg-white text-gray-900 border border-gray-200 outline-none rounded-xl text-xs font-bold focus:border-indigo-500 transition-all ${isRtl ? 'pr-9 pl-4 text-right' : 'pl-9 pr-4 text-left'}`}
              style={{ minHeight: '38px' }}
            />
          </div>
        </div>

        {/* Directory Grid */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-gray-200/80">
            <Search className="w-6 h-6 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-500">No articles match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(a => (
              <button
                key={a.id}
                onClick={() => openPost(a)}
                className="text-left bg-white p-5 rounded-3xl border border-gray-200/80 hover:border-indigo-300 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3 w-full">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-indigo-150 bg-indigo-50/50 text-indigo-700 font-mono text-[8px] font-black uppercase rounded-md tracking-wider">
                      ORL / Oncology
                    </span>
                    <span className="text-[9px] font-mono text-gray-400 font-bold">{a.date}</span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 leading-snug group-hover:text-indigo-700 transition-colors line-clamp-2 uppercase">
                    {t(a.title, lang)}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-semibold leading-relaxed line-clamp-3">
                    {t(a.snippet, lang)}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 w-full">
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-gray-400">
                    <Clock className="w-3 h-3" />
                    {a.readTime}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 group-hover:gap-2 transition-all">
                    {translations.readMore[lang]}
                    <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
