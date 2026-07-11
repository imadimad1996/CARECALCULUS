import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Target, TrendingUp, CheckCircle2, Calendar, Plus, Trash2, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface StudyLog {
  id: string;
  date: string;
  subject: string;
  durationMinutes: number;
  notes: string;
  type: 'reading' | 'calculator_practice' | 'case_study' | 'revision';
}

interface StudyTrackerProps {
  lang?: 'en' | 'fr' | 'ar';
}

const T = {
  en: {
    title: 'Clinical Study Tracker',
    subtitle: 'Log your calculator practice sessions, case studies, and clinical reading.',
    addLog: 'Log Study Session',
    totalHours: 'Total Study Time',
    hours: 'hrs',
    mins: 'mins',
    sessionsCompleted: 'Sessions Logged',
    practiceType: 'Primary Focus',
    recentActivity: 'Recent Study Log',
    emptyActivity: 'No study sessions recorded yet. Click "Log Study Session" to begin!',
    subjectLabel: 'Subject / Topic',
    subjectPlaceholder: 'e.g., Sepsis Management & SOFA Score',
    durationLabel: 'Duration (Minutes)',
    typeLabel: 'Activity Type',
    notesLabel: 'Key Takeaways / Notes',
    notesPlaceholder: 'What clinical pearls did you learn?',
    saveBtn: 'Save Session',
    cancelBtn: 'Cancel',
    deleteConfirm: 'Are you sure you want to delete this log entry?',
    types: {
      reading: 'Clinical Reading',
      calculator_practice: 'Calculator Practice',
      case_study: 'Case Study Simulation',
      revision: 'General Revision'
    },
    defaultLogs: [
      {
        subject: 'Sepsis Guidelines & qSOFA Assessment',
        notes: 'Reviewed the updated Surviving Sepsis criteria and practiced qSOFA staging on 5 hypothetical patient profiles.'
      },
      {
        subject: 'Renal Function & GFR Calculation',
        notes: 'Compared CKD-EPI vs Cockcroft-Gault formulas in elderly patients with fluctuating serum creatinine.'
      }
    ]
  },
  fr: {
    title: 'Suivi des Etudes Cliniques',
    subtitle: 'Enregistrez vos sessions de pratique des calculateurs, cas cliniques et lectures.',
    addLog: 'Enregistrer une session',
    totalHours: 'Temps total detude',
    hours: 'h',
    mins: 'min',
    sessionsCompleted: 'Sessions enregistrees',
    practiceType: 'Objectif principal',
    recentActivity: 'Journal recent',
    emptyActivity: 'Aucune session enregistree pour le moment. Cliquez sur "Enregistrer une session" pour commencer !',
    subjectLabel: 'Sujet / Theme',
    subjectPlaceholder: 'ex. Prise en charge du sepsis et score SOFA',
    durationLabel: 'Duree (Minutes)',
    typeLabel: 'Type dactivite',
    notesLabel: 'Points cles / Notes',
    notesPlaceholder: 'Quelles perles cliniques avez-vous retenues ?',
    saveBtn: 'Enregistrer',
    cancelBtn: 'Annuler',
    deleteConfirm: 'Etes-vous sur de vouloir supprimer cette entree ?',
    types: {
      reading: 'Lecture clinique',
      calculator_practice: 'Pratique des calculateurs',
      case_study: 'Simulation de cas clinique',
      revision: 'Revision generale'
    },
    defaultLogs: [
      {
        subject: 'Directives Sepsis & Evaluation qSOFA',
        notes: 'Revue des criteres de Surviving Sepsis et pratique du staging qSOFA sur 5 profils patients.'
      },
      {
        subject: 'Fonction renale & Calcul du DFG',
        notes: 'Comparaison des formules CKD-EPI et Cockcroft-Gault chez les patients ages.'
      }
    ]
  }
};

export const StudyTracker: React.FC<StudyTrackerProps> = ({ lang = 'en' }) => {
  const currentLang = (lang && T[lang]) ? lang : 'en';
  const t = T[currentLang];
  const isRtl = currentLang === 'ar';

  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState('30');
  const [notes, setNotes] = useState('');
  const [type, setType] = useState<StudyLog['type']>('calculator_practice');

  useEffect(() => {
    const saved = localStorage.getItem('carecalculus_study_logs');
    if (saved) {
      try {
        setLogs(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load study logs:', e);
      }
    } else {
      const defaults: StudyLog[] = [
        {
          id: '1',
          date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
          subject: t.defaultLogs[0].subject,
          durationMinutes: 45,
          notes: t.defaultLogs[0].notes,
          type: 'case_study'
        },
        {
          id: '2',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          subject: t.defaultLogs[1].subject,
          durationMinutes: 30,
          notes: t.defaultLogs[1].notes,
          type: 'calculator_practice'
        }
      ];
      setLogs(defaults);
      localStorage.setItem('carecalculus_study_logs', JSON.stringify(defaults));
    }
  }, [currentLang]);

  const saveLogs = (updated: StudyLog[]) => {
    setLogs(updated);
    localStorage.setItem('carecalculus_study_logs', JSON.stringify(updated));
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    const newLog: StudyLog = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      subject,
      durationMinutes: parseInt(duration, 10) || 0,
      notes,
      type
    };

    saveLogs([newLog, ...logs]);
    setShowModal(false);
    setSubject('');
    setDuration('30');
    setNotes('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t.deleteConfirm)) {
      saveLogs(logs.filter(l => l.id !== id));
    }
  };

  const totalMinutes = logs.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              {t.title}
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              {t.subtitle}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl shadow-sm transition-colors w-fit"
          >
            <Plus className="w-5 h-5" />
            {t.addLog}
          </button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60 flex items-center gap-4">
            <div className="p-3 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-xl">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{t.totalHours}</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {totalHours} <span className="text-sm font-normal text-slate-500">{t.hours}</span> {remainingMins} <span className="text-sm font-normal text-slate-500">{t.mins}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60 flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{t.sessionsCompleted}</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {logs.length}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60 flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
              <Target className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{t.practiceType}</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-1 truncate max-w-[180px]">
                {t.types.calculator_practice}
              </div>
            </div>
          </div>
        </div>

        {/* Activity List */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700/60">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              {t.recentActivity}
            </h2>
          </div>

          {logs.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              <Award className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p>{t.emptyActivity}</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {logs.map((log) => (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={log.id}
                  className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">
                        {t.types[log.type] || log.type}
                      </span>
                      <span className="text-sm text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {log.date}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                      {log.subject}
                    </h3>
                    {log.notes && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        {log.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-lg font-bold text-slate-900 dark:text-white">
                        {log.durationMinutes}
                      </span>
                      <span className="text-xs text-slate-500 block">{t.mins}</span>
                    </div>
                    <button
                      onClick={() => handleDelete(log.id)}
                      className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              {t.addLog}
            </h3>
            <form onSubmit={handleAddLog} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.subjectLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.subjectPlaceholder}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.durationLabel}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.typeLabel}
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="calculator_practice">{t.types.calculator_practice}</option>
                    <option value="case_study">{t.types.case_study}</option>
                    <option value="reading">{t.types.reading}</option>
                    <option value="revision">{t.types.revision}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.notesLabel}
                </label>
                <textarea
                  rows={3}
                  placeholder={t.notesPlaceholder}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl shadow-sm transition-colors"
                >
                  {t.saveBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyTracker;
