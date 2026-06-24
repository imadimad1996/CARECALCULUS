import React, { useState, useEffect } from 'react';
import { Sparkles, Layers, CheckCircle2, AlertCircle, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { LangCode } from '../types';
import { useLang } from '../utils/lang';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  mastered: boolean;
}

const PRESETS = {
  en: [
    { front: "MAP Target in Septic Shock", back: "≥ 65 mmHg to maintain vital organ perfusion." },
    { front: "GCS score threshold for intubation", back: "GCS ≤ 8 (Score of 8, intubate!)" },
    { front: "Reversible Causes of Cardiac Arrest (5 H's)", back: "Hypoxia, Hypovolemia, Hydrogen ion (acidosis), Hypo-/Hyperkalemia, Hypothermia." }
  ],
  fr: [
    { front: "Cible de PAM dans le choc septique", back: "≥ 65 mmHg pour maintenir la perfusion des organes vitaux." },
    { front: "Seuil du score GCS pour l'intubation", back: "GCS ≤ 8 (Éviter l'inhalation et protéger les voies aériennes)." },
    { front: "Causes réversibles d'arrêt cardiaque (5 H)", back: "Hypoxie, Hypovolémie, Ions Hydrogène (acidose), Hypo-/Hyperkaliémie, Hypothermie." }
  ],
  ar: [
    { front: "الضغط الشرياني المتوسط المستهدف في الصدمة الإنتانية", back: "أكبر من أو يساوي 65 ملم زئبقي للحفاظ على تروية الأعضاء الحيوية." },
    { front: "مؤشر مقياس غلاسكو (GCS) لتأمين مسلك الهواء (الأنبوب)", back: "مجموع نقاط غلاسكو أقل من أو يساوي 8 نقاط (GCS ≤ 8)." },
    { front: "الأسباب القابلة للانعكاس لتوقف القلب (5 H)", back: "نقص الأكسجين، نقص حجم الدم، حموضة الدم (الهيدروجين)، نقص/زيادة البوتاسيوم، انخفاض حرارة الجسم." }
  ]
};

export default function FlashcardGenerator({ lang }: { lang: LangCode }) {
  const { langPath } = useLang();
  const isRtl = lang === 'ar';
  
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('carecalculus-flashcards');
    if (saved) {
      setDeck(JSON.parse(saved));
    } else {
      loadPreset();
    }
  }, [lang]);

  const saveDeck = (newDeck: Flashcard[]) => {
    setDeck(newDeck);
    localStorage.setItem('carecalculus-flashcards', JSON.stringify(newDeck));
    window.dispatchEvent(new CustomEvent('study-activity', { detail: { type: 'flashcard', count: newDeck.length } }));
  };

  const loadPreset = () => {
    const items = PRESETS[lang] || PRESETS.en;
    const initial = items.map((item, idx) => ({
      id: `preset-${idx}`,
      front: item.front,
      back: item.back,
      mastered: false
    }));
    saveDeck(initial);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const addCustomCard = () => {
    if (!inputText.includes('=')) {
      alert(lang === 'fr' ? "Utilisez le format: Question = Réponse" : isRtl ? "استخدم التنسيق: السؤال = الجواب" : "Use the format: Question = Answer");
      return;
    }
    const [front, back] = inputText.split('=').map(s => s.trim());
    if (front && back) {
      const newCard: Flashcard = {
        id: `custom-${Date.now()}`,
        front,
        back,
        mastered: false
      };
      const updated = [...deck, newCard];
      saveDeck(updated);
      setInputText('');
    }
  };

  const toggleMastered = (id: string) => {
    const updated = deck.map(c => c.id === id ? { ...c, mastered: !c.mastered } : c);
    saveDeck(updated);
  };

  const deleteCard = (id: string) => {
    const updated = deck.filter(c => c.id !== id);
    saveDeck(updated);
    if (currentIndex >= updated.length && updated.length > 0) {
      setCurrentIndex(updated.length - 1);
    }
    setIsFlipped(false);
  };

  const activeCards = deck;

  return (
    <div className="max-w-3xl mx-auto py-6 px-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="mb-8 text-center sm:text-left">
        <span className="text-[10px] font-mono font-black text-blue-600 uppercase tracking-widest">
          {lang === 'fr' ? 'APPRENTISSAGE MÉDICAL ACTIF' : isRtl ? 'أدوات المذاكرة والبطاقات التعليمية' : 'ACTIVE CLINICAL RETRIEVAL'}
        </span>
        <h1 className="text-3xl font-black text-slate-900 mt-1">
          {lang === 'fr' ? 'Générateur de Flashcards' : isRtl ? 'منشئ البطاقات التعليمية الطبية' : 'Medical Flashcard Generator'}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          {lang === 'fr' ? 'Créez vos propres fiches d\'apprentissage pour réviser à tout moment.' : isRtl ? 'أنشئ بطاقات المراجعة السريعة للحفظ والمذاكرة السريرية في الطوارئ.' : 'Generate study cards to practice active clinical recall at bedside.'}
        </p>
      </div>

      {activeCards.length > 0 ? (
        <div className="space-y-6">
          {/* Card Frame */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[220px] bg-white rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-md cursor-pointer relative flex flex-col justify-between p-8 transition-all duration-300 transform select-none"
            style={{ perspective: '1000px' }}
          >
            <div className="flex items-center justify-between text-xs text-gray-400 font-mono font-bold">
              <span>CARD {currentIndex + 1} OF {activeCards.length}</span>
              <span className="px-2 py-0.5 rounded bg-gray-100 uppercase text-[9px]">
                {isFlipped ? (lang === 'fr' ? 'RÉPONSE' : isRtl ? 'الجواب' : 'REVERSE') : (lang === 'fr' ? 'QUESTION' : isRtl ? 'السؤال' : 'FRONT')}
              </span>
            </div>

            <div className="py-6 text-center">
              <p className={`text-lg font-bold text-slate-800 ${isRtl ? 'font-arabic' : 'font-sans'}`}>
                {isFlipped ? activeCards[currentIndex].back : activeCards[currentIndex].front}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMastered(activeCards[currentIndex].id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-colors ${
                  activeCards[currentIndex].mastered 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                    : 'bg-gray-50 text-gray-500 hover:text-gray-800 border border-gray-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {activeCards[currentIndex].mastered 
                  ? (lang === 'fr' ? 'Maîtrisé !' : isRtl ? 'تم الحفظ !' : 'Mastered!') 
                  : (lang === 'fr' ? 'Marquer maîtrisé' : isRtl ? 'تحديد كمحفوظ' : 'Mark Mastered')}
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCard(activeCards[currentIndex].id);
                }}
                className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(prev => (prev > 0 ? prev - 1 : activeCards.length - 1));
                setIsFlipped(false);
              }}
              className="flex-1 py-3 px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              <span>{lang === 'fr' ? 'Précédent' : isRtl ? 'السابق' : 'Previous'}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(prev => (prev < activeCards.length - 1 ? prev + 1 : 0));
                setIsFlipped(false);
              }}
              className="flex-1 py-3 px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <span>{lang === 'fr' ? 'Suivant' : isRtl ? 'التالي' : 'Next'}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-300">
          <Layers className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-xs font-semibold text-gray-500">{lang === 'fr' ? 'Aucune flashcard dans votre deck.' : isRtl ? 'لا توجد بطاقات في مجموعتك الحالية.' : 'No flashcards in your deck.'}</p>
          <button onClick={loadPreset} className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl">{lang === 'fr' ? 'Charger les presets' : isRtl ? 'تحميل البطاقات التلقائية' : 'Load Presets'}</button>
        </div>
      )}

      {/* Input Section */}
      <div className="mt-10 bg-white rounded-3xl border border-gray-200/80 p-6 space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 font-mono">
          {lang === 'fr' ? 'Ajouter des Fiches Personnalisées' : isRtl ? 'إضافة بطاقة مراجعة جديدة' : 'Add Custom Cards'}
        </h3>
        <textarea
          rows={2}
          placeholder={lang === 'fr' ? "Exemple: Acidose métabolique = pH < 7.35 et HCO3 < 22" : isRtl ? "مثال: الحماض الاستقلابي = pH < 7.35 و HCO3 < 22" : "Example: Metabolic acidosis = pH < 7.35 and HCO3 < 22"}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full p-3 border border-gray-200 focus:border-blue-500 outline-none rounded-xl text-xs font-semibold bg-gray-50/50"
        />
        <div className="flex justify-between items-center gap-4">
          <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {lang === 'fr' ? "Séparez la question de la réponse par le signe =" : isRtl ? "افصل بين السؤال والجواب برمز (=)" : "Separate question & answer with the = symbol"}
          </span>
          <button 
            onClick={addCustomCard}
            className="px-4 py-2 bg-blue-650 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition"
          >
            {lang === 'fr' ? 'Ajouter' : isRtl ? 'إضافة بطاقة' : 'Add Card'}
          </button>
        </div>
      </div>
    </div>
  );
}
