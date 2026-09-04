import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, Eye } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_PERIOPERATIVE } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Modified Mallampati Airway Classification",
    subtitle: "Assesses oropharyngeal anatomy to predict difficult endotracheal intubation and direct laryngoscopy",
    instructions: "Patient sitting upright, mouth open maximally, tongue protruded WITHOUT phonation ('saying ah'):",
    class1Title: "Class I: Full Visibility",
    class1Desc: "Soft palate, fauces, entire uvula, and anterior/posterior tonsillar pillars are clearly visible.",
    class2Title: "Class II: Moderate Visibility",
    class2Desc: "Soft palate, fauces, and portion of uvula visible. Tonsillar pillars hidden behind tongue base.",
    class3Title: "Class III: Partial Visibility",
    class3Desc: "Soft palate and base of uvula visible only. Tonsillar pillars and posterior pharyngeal wall hidden.",
    class4Title: "Class IV: Hard Palate Only",
    class4Desc: "Hard palate only visible. Soft palate is completely obscured by the tongue.",
    result: "Mallampati Classification",
    airwayTitle: "Anticipated Intubation Difficulty",
    references: "Samsoon GL, Young JR. Difficult tracheal intubation: a retrospective study. Anaesthesia. 1987;42(5):487-490. (PMID: 3592174). Mallampati SR, et al. Can Anaesth Soc J. 1985;32(4):429-434.",
    faqs: [
      { question: "How should the Mallampati assessment be performed?", answer: "The patient must be seated upright with head in a neutral position, mouth opened maximally, and tongue protruded as far as possible WITHOUT phonation. Phonation ('saying ah') elevates the soft palate and falsely underestimates intubation difficulty." },
      { question: "What does Class III or IV imply?", answer: "Mallampati Class III and IV strongly correlate with difficult direct laryngoscopy (Cormack-Lehane Grade 3-4). Anesthesiologists should ensure immediate availability of video laryngoscopy, bougie / stylet, and advanced difficult airway equipment." },
      { question: "Is Mallampati sufficient on its own?", answer: "No single airway test is foolproof. Mallampati should be combined with thyromental distance (< 6 cm), cervical spine mobility, interincisor gap (< 3 cm), and upper lip bite test (LEMON rule)." }
    ],
    class1Result: "Mallampati Class I: Low Difficulty Expected",
    class1ResultDesc: "Direct laryngoscopy typically reveals full glottic view (Cormack-Lehane 1). Standard intubation equipment suitable.",
    class2Result: "Mallampati Class II: Low to Mild Difficulty",
    class2ResultDesc: "Direct laryngoscopy typically reveals Cormack-Lehane 1-2. Standard intubation equipment with stylet available.",
    class3Result: "Mallampati Class III: Moderate to High Difficulty",
    class3ResultDesc: "High likelihood of difficult direct laryngoscopy (Cormack-Lehane 3). First-line video laryngoscope (GlideScope, C-MAC) and bougie strongly recommended.",
    class4Result: "Mallampati Class IV: Extremely High Difficulty (Difficult Airway)",
    class4ResultDesc: "Very high probability of failed direct laryngoscopy. Primary video laryngoscopy, fiberoptic bronchoscopy, supraglottic airway back-up, and surgical airway readiness required."
  },
  fr: {
    title: "Classification de Mallampati Modifiée",
    subtitle: "Évaluation de l'oropharynx pour prédire une intubation orotrachéale difficile en anesthésie et réanimation",
    instructions: "Patient assis tête neutre, bouche grande ouverte, langue tirée au maximum SANS phonation :",
    class1Title: "Classe I : Visibilité Complète",
    class1Desc: "Palais mou, luette entière, piliers amygdaliens antérieur et postérieur visibles.",
    class2Title: "Classe II : Visibilité Modérée",
    class2Desc: "Palais mou, luette visible en totalité ou presque. Piliers masqués par la base de langue.",
    class3Title: "Classe III : Visibilité Partielle",
    class3Desc: "Palais mou et base de la luette visibles uniquement. Voile postérieur invisible.",
    class4Title: "Classe IV : Palais Dur Seul",
    class4Desc: "Palais osseux dur visible exclusivement. Palais mou totalement masqué par la langue.",
    result: "Classe de Mallampati",
    airwayTitle: "Prédiction d'Intubation Difficile",
    references: "Samsoon GL, et al. Anaesthesia. 1987;42(5):487-490. (PMID: 3592174).",
    faqs: [
      { question: "Comment réaliser correctement le test de Mallampati ?", answer: "Patient assis en position neutre, ouvrant grand la bouche et tirant la langue au maximum, sans émettre de son (la phonation soulève artificiellement le voile et fausse le score)." },
      { question: "Que faire en cas de classe III ou IV ?", answer: "Ces classes sont très prédictives d'une laryngoscopie difficile. Prévoir d'emblée un vidéolaryngoscope, un mandrin long béquillé (Eschmann / bougie) et le chariot d'intubation difficile." }
    ],
    class1Result: "Classe I : Faible risque d'intubation difficile",
    class1ResultDesc: "Laryngoscopie directe sans difficulté prévisible (Cormack-Lehane 1).",
    class2Result: "Classe II : Risque standard",
    class2ResultDesc: "Visualisation glottique généralement aisée. Matériel standard avec mandrin.",
    class3Result: "Classe III : Risque élevé d'intubation difficile",
    class3ResultDesc: "Forte probabilité de glotte mal visualisée (Cormack 3). Vidéolaryngoscopie de première intention et bougie recommandées.",
    class4Result: "Classe IV : Risque majeur (Voies Aériennes Difficiles)",
    class4ResultDesc: "Risque extrême d'échec de la laryngoscopie directe. Vidéolaryngoscope, fibroscope ou intubation vigile sous anesthésie locale à envisager."
  }
};

export default function MallampatiScore({ lang }: { lang: LangCode }) {
  const [selectedClass, setSelectedClass] = useState<number>(1);

  const currentText = translations[lang] || translations.en;

  useEffect(() => {
    trackCalculatorUsage('mallampati-score', lang, selectedClass);
  }, [selectedClass, lang]);

  const classes = [
    { num: 1, title: currentText.class1Title, desc: currentText.class1Desc, badge: "Class I" },
    { num: 2, title: currentText.class2Title, desc: currentText.class2Desc, badge: "Class II" },
    { num: 3, title: currentText.class3Title, desc: currentText.class3Desc, badge: "Class III" },
    { num: 4, title: currentText.class4Title, desc: currentText.class4Desc, badge: "Class IV" }
  ];

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/mallampati-score"
        scoringSystem="Modified Mallampati Classification"
        howToSteps={[
          lang === 'fr' ? 'Faire asseoir le patient bouche ouverte au maximum et langue tirée sans phonation.' : 'Position patient sitting upright, mouth open maximally, tongue protruded without phonation.',
          lang === 'fr' ? 'Identifier les structures anatomiques visibles (palais mou, luette, piliers).' : 'Identify anatomical structures visible (soft palate, uvula, tonsillar pillars).',
          lang === 'fr' ? 'Les classes III et IV prédisent une intubation difficile justifiant un vidéolaryngoscope.' : 'Classes III and IV predict difficult intubation warranting video laryngoscopy readiness.'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2">
          <Eye className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Anesthésie-Réanimation & Voies Aériennes' : 'Anesthesia & Airway Management'}</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
          {currentText.title}
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 pb-2 border-b border-gray-100">
              {currentText.instructions}
            </p>

            <div className="space-y-3">
              {classes.map((item) => {
                const isSelected = selectedClass === item.num;
                return (
                  <button
                    key={item.num}
                    type="button"
                    onClick={() => setSelectedClass(item.num)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? item.num <= 2
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                          : 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 shadow-sm'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold text-sm ${isSelected ? 'text-gray-900' : 'text-gray-800'}`}>
                        {item.title}
                      </span>
                      <span className={`text-xs px-2.5 py-0.5 rounded font-bold ${
                        item.num <= 2 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 p-6 md:p-8 relative">
            <div className="absolute top-0 right-0 p-24 bg-gradient-to-bl from-teal-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-5">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block">
                {currentText.result}
              </span>
              
              <div className="flex items-baseline gap-3 tabular-nums">
                <span className={`text-5xl md:text-6xl font-extrabold tracking-tight ${
                  selectedClass <= 2 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  Class {selectedClass === 1 ? 'I' : selectedClass === 2 ? 'II' : selectedClass === 3 ? 'III' : 'IV'}
                </span>
              </div>

              <div className={`p-4 rounded-xl border ${
                selectedClass <= 2 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                <div className="font-bold text-sm mb-1">
                  {selectedClass === 1
                    ? currentText.class1Result
                    : selectedClass === 2
                    ? currentText.class2Result
                    : selectedClass === 3
                    ? currentText.class3Result
                    : currentText.class4Result}
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  {selectedClass === 1
                    ? currentText.class1ResultDesc
                    : selectedClass === 2
                    ? currentText.class2ResultDesc
                    : selectedClass === 3
                    ? currentText.class3ResultDesc
                    : currentText.class4ResultDesc}
                </p>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "Anatomical View", value: classes[selectedClass - 1].title }
                ]}
                results={[
                  { label: "Mallampati Classification", value: `Class ${selectedClass === 1 ? 'I' : selectedClass === 2 ? 'II' : selectedClass === 3 ? 'III' : 'IV'}` },
                  { label: "Intubation Difficulty", value: selectedClass <= 2 ? "Low Predicted Difficulty" : "High Predicted Difficulty (Difficult Airway)" },
                  { label: "Airway Recommendation", value: selectedClass <= 2 ? "Standard Laryngoscopy" : "Prepare Video Laryngoscope & Bougie" }
                ]}
                formula="Samsoon & Young Modified Mallampati 4-Grade System"
                disclaimer="Mallampati Classes III and IV predict difficult direct laryngoscopy; prepare advanced airway adjuncts."
                references="Samsoon GL, Young JR. Anaesthesia. 1987;42(5):487-490."
                lang={lang}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <MedicalReviewerCard reviewer={REVIEWER_PERIOPERATIVE} />
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900 block mb-1">Foundational Evidence:</span>
          <p className="italic mb-2">{currentText.references}</p>
          <div className="flex flex-wrap gap-4 text-teal-700">
            <a href="https://pubmed.ncbi.nlm.nih.gov/3592174/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Samsoon GL & Young JR (1987) Anaesthesia <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
