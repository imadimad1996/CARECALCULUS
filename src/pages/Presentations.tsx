import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MonitorPlay, Upload, FileText, Download, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Play, RefreshCw, Sparkles, BookOpen, Trash2, Calendar, FileType } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LangCode, Translations } from '../types';
import { slugify, findBySlug } from '../utils/slug';
import { useLang } from '../utils/lang';

interface PresentationSubject {
  id: string;
  title: string;
  author: string;
  date: string;
  size: string;
  slideCount: number;
  category: string;
  description: string;
  slides: Array<{
    title: string;
    points: string[];
    diagramType?: 'hemodynamic' | 'neuro' | 'lungs' | 'pharmacology' | 'default';
  }>;
  isUserUploaded?: boolean;
}

const DEFAULT_SUBJECTS: PresentationSubject[] = [
  {
    id: 'pptx-1',
    title: 'Advanced Hemodynamic Performance & Organ Flow Targets',
    author: 'Prof. Alice Vance, MD (CareCalculus Scientific Division)',
    date: '2026-05-12',
    size: '12.4 MB',
    slideCount: 5,
    category: 'Intensive Care / Cardiología',
    description: 'Pathophysiology of Mean Arterial Pressure (MAP), autoregulation shifts in chronic hypertension, and microvascular shock targets.',
    slides: [
      {
        title: 'Hemodynamic Targeting: Beyond the 65 mmHg Mandate',
        points: [
          'Overview of circulatory perfusion gradient and venous return drivers.',
          'Critical review of universal MAP target of 65 mmHg in septic shock cohorts.',
          'Sepsis-induced vasomotor paralysis: microvascular shunt pathophysiology.'
        ],
        diagramType: 'hemodynamic'
      },
      {
        title: 'Microvascular Autoregulation & Organ Perfusion',
        points: [
          'Shifted cortical renal perfusion curves in hypertensive patients.',
          'Why standard MAP targets of 65 mmHg trigger subclinical acute kidney injury (AKI).',
          'Setting personalized perfusion targets based on prior diastolic status.'
        ],
        diagramType: 'hemodynamic'
      },
      {
        title: 'End-Organ Assessment Metrics & Perfusion Rubrics',
        points: [
          'Somatic indicators: capillary refill time (CRT) and serial lactate markers.',
          'Evaluating renal reserve: hourly urinary output thresholds (0.5 mL/kg/hr).',
          'Lactate kinetic clearance rate: targeting >10% clearance hourly.'
        ],
        diagramType: 'pharmacology'
      },
      {
        title: 'Inotropic Support & Vasopressor Titration Protocols',
        points: [
          'First Line: Norepinephrine titration indices and beta-receptor limits.',
          'Secondary rescue: Early initiation of Vasopressin in profound shock.',
          'Mitigating tachyarrhythmias: avoidance of hyper-adrenergic toxicity.'
        ],
        diagramType: 'pharmacology'
      },
      {
        title: 'Scientific Conclusions & Consensus',
        points: [
          'Target 65 mmHg in young, previously normotensive septic individuals.',
          'Elevate MAP to 75-80 mmHg in geriatric or chronically hypertensive cohorts.',
          'Integrate tissue perfusion markers into real-time closed-loop EHR flows.'
        ],
        diagramType: 'default'
      }
    ]
  },
  {
    id: 'pptx-2',
    title: 'Pulmonary Mechanics: Low-Tidal Volume Vent Protocol',
    author: 'Dr. Marcus Thorne, Ph.D. (Pulmonary Medicine & ICU)',
    date: '2026-04-29',
    size: '8.1 MB',
    slideCount: 5,
    category: 'Pulmonology / ICU',
    description: 'Clinical slides clarifying the ARDSNet protocol, ideal body weight calculations (Devine formula), and preventing lung injury.',
    slides: [
      {
        title: 'Lung-Protective Ventilation & ARDS Mechanics',
        points: [
          'Pathophysiology of Acute Respiratory Distress Syndrome (ARDS).',
          'Ventilator-induced lung injury (VILI): volutrauma and barotrauma.',
          'P/F Ratio (PaO2/FiO2) staging criteria: Mild, Moderate, and Severe.'
        ],
        diagramType: 'lungs'
      },
      {
        title: 'Dosing Tidal Volume according to Predicted Weight (PBW)',
        points: [
          'Critical Trap: Ventilating according to actual total body weight.',
          'Formulating PBW using the Devine Equation for physiological height.',
          'Target initial settings: 6 mL/kg PBW (range: 4 - 8 mL/kg).'
        ],
        diagramType: 'lungs'
      },
      {
        title: 'Airway Pressures and Plateau Threshold Monitoring',
        points: [
          'Plateau Pressure (Pplat) compliance check: must keep < 30 cmH2O.',
          'PEEP titration: balancing alveolar recruitment with cardiac preload reduction.',
          'Driving Pressure (Pplat - PEEP): keeping optimal targets < 15 cmH2O.'
        ],
        diagramType: 'lungs'
      },
      {
        title: 'Permissive Hypercapnia & Safe Acid-Base Thresholds',
        points: [
          'Allowing arterial pCO2 to rise to mitigate high mechanical shear stress.',
          'Vigilant management: maintaining pH > 7.15 (range 7.15 - 7.30).',
          'Contraindications: severe hypertension, traumatic brain injury, acute stroke.'
        ],
        diagramType: 'pharmacology'
      },
      {
        title: 'Clinical Summary: The 3-Step ARDSNet Blueprint',
        points: [
          '1. Calculate PBW immediately upon ICU admission.',
          '2. Secure strict compliance with target volume limits (6 mL/kg PBW).',
          '3. Monitor plateau pressures and arterial blood gases every 4-6 hours.'
        ],
        diagramType: 'default'
      }
    ]
  }
];

const translations: Translations = {
  en: {
    title: "Clinical Presentations Finder",
    subtitle: "Upload and review scientific .pptx lecture slides, medical subjects, and clinical tutorials",
    dragDrop: "Drag and drop your .pptx course presentation here",
    orBrowse: "or browse files from your computer",
    uploadedBy: "Uploaded by",
    slidesCount: "slides",
    preseeded: "Predefined Case Studies",
    myUploads: "My Submissions",
    slideNav: "Slide",
    previewBtn: "Launch Interactive Slideshow Player",
    closeBtn: "Close Presentation",
    downloadBtn: "Download File",
    uploadSuccess: "Presentation parsed and indexed successfully!",
    onlyPptx: "Supported file format is Microsoft PowerPoint (.pptx) only.",
    references: "References: American College of Chest Physicians (ACCP); Society of Critical Care Medicine (SCCM).",
    noUploads: "No custom presentations uploaded yet. Drag and drop any .pptx presentation above to mount it instantly."
  },
  fr: {
    title: "Présentations Scientifiques (PPTX)",
    subtitle: "Uploadez et révisez les diaporamas de cours .pptx, présentations médicales et guides de conférence",
    dragDrop: "Glissez-déposez vos présentations de cours .pptx ici",
    orBrowse: "ou parcourez les fichiers de votre ordinateur",
    uploadedBy: "Téléversé par",
    slidesCount: "diapos",
    preseeded: "Études de Cas Prédéfinies",
    myUploads: "Mes Présentations",
    slideNav: "Diapo",
    previewBtn: "Lancer le Lecteur de Diaporama Interactif",
    closeBtn: "Fermer la Présentation",
    downloadBtn: "Télécharger le Fichier",
    uploadSuccess: "La présentation a été analysée et indexée avec succès !",
    onlyPptx: "Le format de fichier pris en charge est exclusivement Microsoft PowerPoint (.pptx).",
    references: "Références: American College of Chest Physicians (ACCP); Société Française de Réanimation de Langue Française (SRLF).",
    noUploads: "Aucune présentation personnalisée. Glissez-déposez n'importe quel fichier .pptx ci-dessus pour l'ajouter."
  },
  ar: {
    title: "العروض التقديمية الطبية (PPTX)",
    subtitle: "رفع ومراجعة شرائح المحاضرات الطبية بصيغة PPTX، وعروض الحالات والمؤتمرات العلمية الحديثة",
    dragDrop: "اسحب وأفلت عرض المحاضرة الطبي بصيغة .pptx هنا",
    orBrowse: "أو اختر الملفات من جهاز الكمبيوتر الخاص بك",
    uploadedBy: "مرفوع بواسطة",
    slidesCount: "شرائح",
    preseeded: "دراسات الحالات المعتمدة",
    myUploads: "ملفاتي المرفوعة",
    slideNav: "شريحة",
    previewBtn: "تشغيل شرائح العرض التفاعلي HUD",
    closeBtn: "إغلاق العرض التقديمي",
    downloadBtn: "تحميل الملف الأصلي",
    uploadSuccess: "تم تحليل وأرشفة العرض التقديمي بنجاح في المكتبة الطبية الرقمية!",
    onlyPptx: "الامتداد المدعوم للملفات هو عروض مايكروسوفت باوربوينت (.pptx) فقط.",
    references: "المراجع والمعايير المعتمدة: الكلية الأمريكية لأخصائيي الصدر (ACCP)؛ الجمعية الدولية للعناية المركزة (SCCM).",
    noUploads: "لم يتم رفع أي عروض مخصصة بعد. اسحب وأفلت أي ملف .pptx بالأعلى لإدراجه فوراً."
  }
};

export default function Presentations({ lang }: { lang: LangCode }) {
  const t = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { langPath } = useLang();

  const [subjects, setSubjects] = useState<PresentationSubject[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('carecalculus-pptx-uploads');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return [...DEFAULT_SUBJECTS, ...parsed];
        } catch (e) {
          return DEFAULT_SUBJECTS;
        }
      }
    }
    return DEFAULT_SUBJECTS;
  });

  // The open presentation is derived from the URL (/presentations/:slug) so each
  // deck is directly linkable and survives a reload.
  const selectedSubject = useMemo(
    () => findBySlug(subjects, slug, s => s.title),
    [subjects, slug]
  );
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<boolean>(false);
  const [isUploadingSim, setIsUploadingSim] = useState(false);
  const [simulatedProgress, setSimulatedProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync custom uploads to localStorage
  const saveCustomUploadedSubjects = (updatedList: PresentationSubject[]) => {
    const customOnly = updatedList.filter(s => s.isUserUploaded);
    localStorage.setItem('carecalculus-pptx-uploads', JSON.stringify(customOnly));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pptx')) {
      setUploadError(t.onlyPptx);
      return;
    }

    setUploadError(null);
    setIsUploadingSim(true);
    setSimulatedProgress(10);

    // Trigger sequential loading simulation
    const interval = setInterval(() => {
      setSimulatedProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploadingSim(false);
            setUploadSuccessMsg(true);

            // Structure a realistic simulated presentation parsed dynamically from uploaded file name!
            const cleanTitle = file.name.replace(/\.[^/.]+$/, "").split('_').join(' ').split('-').join(' ');
            const formattedSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

            const parsedNewSubject: PresentationSubject = {
              id: `user-pptx-${Date.now()}`,
              title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
              author: 'Clinical Faculty Member (Simulated)',
              date: new Date().toISOString().split('T')[0],
              size: formattedSize,
              slideCount: 4,
              category: 'General Clinical Review / CME',
              description: `Uploaded file: ${file.name}. Self-directed presentation containing clinical guidelines, diagnostic indices, and therapeutic benchmarks.`,
              isUserUploaded: true,
              slides: [
                {
                  title: `Slide 1: ${cleanTitle}`,
                  points: [
                    'Primary clinical hypothesis and methodology parameters.',
                    'Review of physiological mechanisms involved in active patient management.',
                    'Stated boundaries, core sample size, and study enrollment criteria.'
                  ],
                  diagramType: 'hemodynamic'
                },
                {
                  title: 'Slide 2: Mathematical / Calculated Indicators',
                  points: [
                    'Dynamic formulation mapped from patient laboratory profiles.',
                    'Standard deviation limits and correlation with historical cohort models.',
                    'Dosing validation thresholds and safety ranges configured.'
                  ],
                  diagramType: 'pharmacology'
                },
                {
                  title: 'Slide 3: Real-Time Diagnostic Performance',
                  points: [
                    'Target organ protection performance results.',
                    'Comparing absolute clinical rates against pre-designed control arms.',
                    'Reduction in ICU length of stay and systemic shock progression.'
                  ],
                  diagramType: 'lungs'
                },
                {
                  title: 'Slide 4: Implementation Guidance',
                  points: [
                    'Deploying standard EHR clinical alerts based on calculations.',
                    'Ongoing nursing training, safety compliance protocols.',
                    'Continuous audit and outcome reporting structures.'
                  ],
                  diagramType: 'default'
                }
              ]
            };

            const newList = [...subjects, parsedNewSubject];
            setSubjects(newList);
            saveCustomUploadedSubjects(newList);

            setTimeout(() => setUploadSuccessMsg(false), 3000);
          }, 450);
          return 100;
        }
        return p + 15;
      });
    }, 180);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDeleteSubject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanList = subjects.filter(s => s.id !== id);
    setSubjects(cleanList);
    saveCustomUploadedSubjects(cleanList);
    if (selectedSubject?.id === id) {
      navigate(langPath('/presentations'));
    }
  };

  const launchSlideshow = (subject: PresentationSubject) => {
    navigate(langPath(`/presentations/${slugify(subject.title, subject.id)}`));
  };

  // Reset to the first slide whenever the open presentation changes (via URL).
  useEffect(() => {
    setActiveSlideIndex(0);
  }, [slug]);

  // Unknown slug → fall back to the presentation library.
  useEffect(() => {
    if (slug && !selectedSubject) navigate(langPath('/presentations'), { replace: true });
  }, [slug, selectedSubject, navigate]);

  const handlePrevSlide = () => {
    if (activeSlideIndex > 0) {
      setActiveSlideIndex(prev => prev - 1);
    }
  };

  const handleNextSlide = () => {
    if (selectedSubject && activeSlideIndex < selectedSubject.slides.length - 1) {
      setActiveSlideIndex(prev => prev + 1);
    }
  };

  const mockDownload = (subject: PresentationSubject) => {
    const dummyContent = `MOCK PPTX DATA FOR ${subject.title}`;
    const blob = new Blob([dummyContent], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${subject.title.toLowerCase().replace(/\s+/g, '-')}.pptx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const activeSlide = selectedSubject ? selectedSubject.slides[activeSlideIndex] : null;

  return (
    <>
      <div className="max-w-4xl mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <MonitorPlay className="w-8 h-8 text-blue-600 shrink-0" />
          <span>{t.title}</span>
        </h1>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-2xl">{t.subtitle}</p>
      </div>

      {/* Slide Player Lightbox / HUD Backdrop */}
      <AnimatePresence>
        {selectedSubject && activeSlide && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 text-white rounded-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh] shadow-2xl"
              style={{ direction: isRtl ? 'rtl' : 'ltr' }}
            >
              {/* Slideshow Reader Bar */}
              <div className="p-4 bg-slate-950 border-b border-slate-850 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <span className="p-1.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-md font-mono text-[9px] uppercase tracking-widest font-extrabold select-none">
                    CME PRESENTATION STATION
                  </span>
                  <h3 className="text-xs font-bold font-mono text-gray-200 uppercase truncate max-w-md">
                    {selectedSubject.title}
                  </h3>
                </div>
                <button
                  onClick={() => navigate(langPath('/presentations'))}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-gray-200 transition-all font-semibold hover:text-white cursor-pointer"
                  style={{ minHeight: '44px' }}
                >
                  {t.closeBtn}
                </button>
              </div>

              {/* Main Slideshow screen */}
              <div className="flex-1 p-6 md:p-10 flex flex-col lg:flex-row gap-6 overflow-y-auto">
                {/* Visual Slide Frame */}
                <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-6 md:p-8 flex flex-col justify-between shadow-inner min-h-[360px] relative overflow-hidden group">
                  
                  {/* Watermark / Tech background visual grids */}
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
                  
                  {/* Top slide indices indicator */}
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 select-none relative z-10">
                    <span>CareCalculus Interactive Slide Deck</span>
                    <span>
                      {t.slideNav} {activeSlideIndex + 1} / {selectedSubject.slides.length}
                    </span>
                  </div>

                  {/* Main Slide Typography and content points */}
                  <div className="my-auto space-y-6 relative z-10">
                    <h2 className="text-xl md:text-2xl font-black text-white tracking-tight border-b border-slate-830 pb-4">
                      {activeSlide.title}
                    </h2>
                    
                    <ul className="space-y-3.5">
                      {activeSlide.points.map((pt, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-gray-350 leading-relaxed">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0 animate-ping" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Diagrammatic HUD accents for silicon valley standard */}
                  <div className="flex justify-between items-end border-t border-slate-850 pt-4 mt-6 text-[9px] font-mono text-gray-600 relative z-10">
                    <div>
                      <span className="block uppercase font-bold text-gray-500">PRESENTER ID</span>
                      <span>{selectedSubject.author}</span>
                    </div>
                    <div className="text-right">
                      <span className="block uppercase font-bold text-gray-500">DIAGRAM MODULE</span>
                      <span className="text-blue-400 capitalize">{activeSlide.diagramType || 'General Pathway'}</span>
                    </div>
                  </div>
                </div>

                {/* Right indices pane */}
                <div className="w-full lg:w-72 flex flex-col justify-between p-4 bg-slate-950/40 border border-slate-830 rounded-xl">
                  <div>
                    <h4 className="text-[10px] font-mono font-extrabold text-blue-400 uppercase tracking-widest mb-3">
                      Slide Index Map
                    </h4>
                    
                    <div className="space-y-1.5">
                      {selectedSubject.slides.map((sld, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveSlideIndex(idx)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center justify-between ${
                            activeSlideIndex === idx
                              ? 'bg-blue-600 text-white font-bold shadow-md'
                              : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'
                          }`}
                          style={{ minHeight: '40px' }}
                        >
                          <span className="truncate max-w-[180px]">{sld.title}</span>
                          <span className="text-[9px] opacity-75">#{idx + 1}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick utility download button inside slide player */}
                  <div className="pt-4 border-t border-slate-850 mt-6 shrink-0">
                    <button
                      onClick={() => mockDownload(selectedSubject)}
                      className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2 font-mono uppercase cursor-pointer border border-slate-700"
                      style={{ minHeight: '44px' }}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t.downloadBtn}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom slide player controller rail */}
              <div className="p-4 bg-slate-950/95 border-t border-slate-800 flex justify-between items-center shrink-0">
                <button
                  onClick={handlePrevSlide}
                  disabled={activeSlideIndex === 0}
                  className={`px-4 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold font-mono transition-all border ${
                    activeSlideIndex === 0
                      ? 'text-gray-600 border-slate-850 cursor-not-allowed opacity-50'
                      : 'text-gray-300 border-slate-700 hover:bg-slate-800 hover:text-white cursor-pointer'
                  }`}
                  style={{ minHeight: '44px' }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>PREV</span>
                </button>

                <div className="flex gap-1.5">
                  {selectedSubject.slides.map((_, idx) => (
                    <span
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        activeSlideIndex === idx ? 'bg-blue-500 w-4' : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNextSlide}
                  disabled={activeSlideIndex === selectedSubject.slides.length - 1}
                  className={`px-4 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold font-mono transition-all border ${
                    activeSlideIndex === selectedSubject.slides.length - 1
                      ? 'text-gray-600 border-slate-850 cursor-not-allowed opacity-50'
                      : 'text-gray-300 border-slate-700 hover:bg-slate-800 hover:text-white cursor-pointer'
                  }`}
                  style={{ minHeight: '44px' }}
                >
                  <span>NEXT</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left col: Upload hub area */}
        <div className="lg:col-span-5 space-y-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 flex flex-col justify-center items-center min-h-[280px] bg-white ${
              isDragging
                ? 'border-blue-600 bg-blue-50/40 ring-4 ring-blue-600/10 scale-[0.99]'
                : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50/10'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pptx"
              className="hidden"
            />

            {!isUploadingSim ? (
              <div className="space-y-5">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-full inline-flex border border-blue-100 shadow-sm animate-bounce">
                  <Upload className="w-10 h-10" />
                </div>
                
                <div>
                  <h3 className="text-sm font-bold text-gray-800 tracking-tight leading-relaxed">
                    {t.dragDrop}
                  </h3>
                  <p className="mt-1.5 text-xs text-gray-400">{t.orBrowse}</p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-mono font-extrabold uppercase">
                  <FileType className="w-3.5 h-3.5" />
                  <span>PPTX ONLY</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 w-full">
                <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider font-mono">
                    PARSING & ANALYZING PRESENTATION...
                  </h4>
                  <p className="text-[10px] text-gray-400">Extracting study points and slide nodes</p>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden max-w-[240px] mx-auto border border-gray-200">
                  <div
                    className="bg-blue-600 h-full transition-all duration-150 rounded-full"
                    style={{ width: `${simulatedProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Feedback alerts container */}
          <AnimatePresence>
            {uploadError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2.5 shadow-xs font-medium"
              >
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{uploadError}</span>
              </motion.div>
            )}

            {uploadSuccessMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2.5 shadow-xs font-medium"
              >
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t.uploadSuccess}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right col: Presentations Library Explorer */}
        <div className="lg:col-span-7 space-y-6">
          {/* Pre-seeded list */}
          <div>
            <h2 className="text-[10px] font-mono leading-none tracking-widest text-slate-400 font-extrabold uppercase pb-3 mb-3 border-b border-gray-100 flex items-center justify-between">
              <span>{t.preseeded}</span>
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            </h2>

            <div className="space-y-3">
              {subjects.filter(s => !s.isUserUploaded).map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => launchSlideshow(sub)}
                  className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-xs transition-all duration-200 cursor-pointer flex flex-col sm:flex-row gap-4 justify-between items-start group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 font-mono text-[9px] uppercase tracking-wider font-extrabold rounded-md">
                        {sub.category}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {sub.date}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-blue-600 transition-colors">
                      {sub.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-normal line-clamp-2">
                      {sub.description}
                    </p>
                  </div>

                  <div className="flex sm:flex-col gap-2 shrink-0 items-end w-full sm:w-auto border-t sm:border-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                    <span className="text-[11px] font-mono text-gray-400 font-bold">
                      {sub.slideCount} {t.slidesCount}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); launchSlideshow(sub); }}
                      className="ml-auto sm:ml-0 py-1.5 px-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-mono text-[10px] font-extrabold uppercase transition-all tracking-wider flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>PLAY</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User uploads list */}
          <div className="pt-2">
            <h2 className="text-[10px] font-mono leading-none tracking-widest text-slate-400 font-extrabold uppercase pb-3 mb-3 border-b border-gray-100">
              {t.myUploads}
            </h2>

            {subjects.filter(s => s.isUserUploaded).length === 0 ? (
              <div className="p-8 text-center bg-gray-50 border border-gray-200 border-dashed rounded-xl space-y-2 select-none">
                <FileText className="w-6 h-6 text-gray-300 mx-auto" />
                <p className="text-xs font-semibold text-gray-400">{t.noUploads}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {subjects.filter(s => s.isUserUploaded).map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => launchSlideshow(sub)}
                    className="bg-white p-4 rounded-xl border border-gray-200 hover:border-indigo-400 hover:shadow-xs transition-all duration-200 cursor-pointer flex flex-col sm:flex-row gap-4 justify-between items-start group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 font-mono text-[9px] uppercase tracking-wider font-extrabold rounded-md border border-indigo-100">
                          {sub.category}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {sub.date}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-indigo-600 transition-colors truncate max-w-sm">
                        {sub.title}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-widest">
                        SIZE: {sub.size}
                      </p>
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0 items-end w-full sm:w-auto border-t sm:border-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                      <button
                        onClick={(e) => handleDeleteSubject(sub.id, e)}
                        className="p-1 px-2 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                        title="Delete Presentation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); launchSlideshow(sub); }}
                        className="ml-auto py-1.5 px-3 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white font-mono text-[10px] font-extrabold uppercase transition-all tracking-wider flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>PLAY</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-150 text-[10px] font-mono text-gray-450 text-center select-none">
        {t.references}
      </div>
    </>
  );
}
