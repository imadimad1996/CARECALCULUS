import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Layers, CheckCircle2, Trash2 } from 'lucide-react';
import { LangCode } from '../types';
import { useLang } from '../utils/lang';

export default function StudyTracker({ lang }: { lang: LangCode }) {
  const { langPath } = useLang();
  const isRtl = lang === 'ar';
  
  const [completedCases, setCompletedCases] = useState<string[]>([]);
  const [flashcardCount, setFlashcardCount] = useState(0);

  useEffect(() => {
    setCompletedCases(JSON.parse(localStorage.getItem('carecalculus-completed-cases') || '[]'));
    const fc = JSON.parse(localStorage.getItem('carecalculus-flashcards') || '[]');
    setFlashcardCount(fc.filter((c: any) => c.mastered).length);
  }, []);

  const clearData = () => {
    if (confirm(lang === 'fr' ? "Réinitialiser toutes vos statistiques ?" : isRtl ? "هل تريد إزالة جميع إحصائيات الدراسة والمذاكرة؟" : "Reset all study progress?")) {
      localStorage.removeItem('carecalculus-completed-cases');
      localStorage.removeItem('carecalculus-flashcards');
      setCompletedCases([]);
      setFlashcardCount(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <span className="text-[10px] font-mono font-black text-purple-600 uppercase tracking-widest">
            {lang === 'fr' ? 'SUIVI D\'APPRENTISSAGE PERSONNEL' : isRtl ? 'لوحة المتابعة والمستوى الدراسي' : 'OFFLINE STUDY HUB'}
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">
            {lang === 'fr' ? 'Tableau de Bord Études' : isRtl ? 'متابع التقدم الدراسي والتحصيل' : 'Study Progress Tracker'}
          </h1>
        </div>
        
        <button 
          onClick={clearData}
          className="shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 border border-red-255 hover:bg-red-50 text-red-600 text-xs font-bold rounded-xl transition cursor-pointer"
          style={{ minHeight: '38px' }}
        >
          <Trash2 className="w-4 h-4" />
          <span>RESET PROGRESS</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-gray-400 font-bold uppercase block">Clinical Cases Done</span>
            <span className="text-xl font-black text-slate-800">{completedCases.length}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-gray-400 font-bold uppercase block">Flashcards Mastered</span>
            <span className="text-xl font-black text-slate-800">{flashcardCount}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-gray-400 font-bold uppercase block">Current Study Streak</span>
            <span className="text-xl font-black text-slate-800">2 Days</span>
          </div>
        </div>
      </div>

      {/* Study Achievements Matrix */}
      <div className="bg-white rounded-3xl border border-gray-200/85 p-6 md:p-8 space-y-4 shadow-xs">
        <h3 className="text-xs font-mono font-black uppercase text-slate-800 tracking-wider">
          {lang === 'fr' ? 'Historique des Modules complétés' : isRtl ? 'الأوسمة والملفات السريرية المنجزة' : 'Clinical Achievements & Log'}
        </h3>
        {completedCases.length > 0 ? (
          <div className="space-y-2">
            {completedCases.map((caseId, idx) => (
              <div key={idx} className="p-3 bg-gray-50 border border-gray-150 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-650" />
                  <span className="text-xs font-bold text-slate-700 capitalize">{caseId} Shock Protocol Case</span>
                </div>
                <span className="text-[10px] font-mono text-gray-400 font-bold uppercase">100% Score</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 font-semibold">{lang === 'fr' ? 'Aucune simulation complétée pour l\'instant.' : isRtl ? 'لم تقم بإكمال أي حالة مراجعة تفاعلية حتى الآن.' : 'No case studies completed yet. Complete clinical quizzes to earn certifications.'}</p>
        )}
      </div>
    </div>
  );
}
