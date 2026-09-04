import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, Bone } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_EMERGENCY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Ottawa Ankle & Knee Rules (Fracture Decision Rule)",
    subtitle: "Evidence-based clinical decision rules to rule out acute fractures and avoid unnecessary radiography",
    tabAnkle: "Ottawa Ankle & Foot Rules",
    tabKnee: "Ottawa Knee Rule",
    anklePain: "Pain in the malleolar zone (ankle injury)",
    latMall: "Bone tenderness at posterior edge or tip of lateral malleolus (distal 6 cm)",
    medMall: "Bone tenderness at posterior edge or tip of medial malleolus (distal 6 cm)",
    midfootPain: "Pain in the midfoot zone (foot injury)",
    navicular: "Bone tenderness at the navicular bone",
    fifthMet: "Bone tenderness at the base of the 5th metatarsal",
    weightBearingAnkle: "Inability to bear weight both immediately after injury and in the ED (4 steps)",
    kneePain: "Acute knee injury presentation",
    age55: "Age ≥ 55 years",
    patella: "Isolated tenderness of patella (no bone tenderness of knee other than patella)",
    fibHead: "Tenderness at head of fibula",
    flexion: "Inability to flex knee to 90 degrees",
    weightBearingKnee: "Inability to bear weight both immediately and in the ED (4 steps, unable to transfer weight twice)",
    result: "Radiographic Recommendation",
    clinicalTitle: "Evidence-Based Radiography Guidance",
    references: "Stiell IG, et al. Decision rules for the use of radiography in acute ankle injuries. JAMA. 1993;269(9):1127-1132. (PMID: 8433468). Stiell IG, et al. Prospective validation of a decision rule for radiography in acute knee injuries. JAMA. 1996;275(8):611-615. (PMID: 8594242).",
    faqs: [
      { question: "What are the Ottawa Rules?", answer: "The Ottawa Ankle, Foot, and Knee Rules are highly sensitive clinical decision guidelines developed by Dr. Ian Stiell to identify which acute musculoskeletal injury patients require X-rays and who can be safely discharged without radiography." },
      { question: "How sensitive are the Ottawa Rules for fractures?", answer: "The rules exhibit near 98–100% sensitivity for clinically significant malleolar, midfoot, and knee fractures, safely reducing unnecessary emergency radiography by 30–40%." },
      { question: "What counts as inability to bear weight?", answer: "The patient is unable to take four steps independently (two steps on each foot), even if limping, both immediately following the trauma and during examination in the emergency department." }
    ],
    xrayRequired: "Radiography Indicated (X-ray Recommended)",
    xrayRequiredDesc: "One or more positive criteria present. Obtain plain film radiography to rule out acute malleolar, metatarsal, or knee fracture.",
    xrayNotRequired: "Radiography NOT Indicated (No X-ray Needed)",
    xrayNotRequiredDesc: "No positive criteria. Clinically significant acute fracture can be ruled out with >98% sensitivity. Reassure patient, provide RICE protocol (Rest, Ice, Compression, Elevation), and provide return precautions."
  },
  fr: {
    title: "Règles d'Ottawa (Cheville, Pied et Genou)",
    subtitle: "Règles de décision clinique pour éliminer une fracture et éviter les radiographies inutiles",
    tabAnkle: "Règles Cheville & Pied",
    tabKnee: "Règle du Genou",
    anklePain: "Douleur dans la zone malléolaire (traumatisme de la cheville)",
    latMall: "Douleur à la palpation du bord postérieur ou de la pointe de la malléole latérale (6 cm distaux)",
    medMall: "Douleur à la palpation du bord postérieur ou de la pointe de la malléole médiale (6 cm distaux)",
    midfootPain: "Douleur au niveau du médiopied",
    navicular: "Douleur à la palpation de l'os naviculaire",
    fifthMet: "Douleur à la palpation de la base du 5e métatarsien",
    weightBearingAnkle: "Impossibilité de faire 4 pas en appui complet (immédiatement et aux urgences)",
    kneePain: "Traumatisme aigu du genou",
    age55: "Âge ≥ 55 ans",
    patella: "Douleur isolée de la rotule (patella)",
    fibHead: "Douleur à la palpation de la tête de la fibula (péroné)",
    flexion: "Impossibilité de fléchir le genou à 90°",
    weightBearingKnee: "Impossibilité de faire 4 pas en appui (immédiatement et aux urgences)",
    result: "Indication Radiologique",
    clinicalTitle: "Recommandation d'Imagerie Médicale",
    references: "Stiell IG, et al. JAMA. 1993;269(9):1127-1132. (PMID: 8433468). Stiell IG, et al. JAMA. 1996;275(8):611-615. (PMID: 8594242).",
    faqs: [
      { question: "Que sont les règles d'Ottawa ?", answer: "Les règles d'Ottawa sont des critères d'aide à la décision hautement sensibles permettant d'exclure une fracture sans recourir systématiquement à la radiographie chez les patients consultant pour traumatisme aigu." },
      { question: "Quelle est la sensibilité des règles d'Ottawa ?", answer: "Leur sensibilité approche 100% pour détecter les fractures malléolaires, du médiopied et du genou, permettant de réduire d'environ 35% les radiographies inutiles." },
      { question: "Comment évaluer l'impossibilité d'appui ?", answer: "Le patient est incapable de faire 4 pas (deux pas sur chaque pied, même en boitant), à la fois au moment de l'accident et lors de l'examen clinique." }
    ],
    xrayRequired: "Radiographie Indiquée (Radiographie Recommandée)",
    xrayRequiredDesc: "Au moins un critère positif. Réaliser des radiographies standard pour éliminer une fracture osseuse.",
    xrayNotRequired: "Radiographie NON Indiquée (Pas de Radio Nécessaire)",
    xrayNotRequiredDesc: "Aucun critère positif. Une fracture cliniquement significative est écartée avec une sensibilité > 98%. Traitement fonctionnel (protocole GREC), antalgiques et consignes de retour."
  }
};

export default function OttawaRules({ lang }: { lang: LangCode }) {
  const [activeTab, setActiveTab] = useState<'ankle' | 'knee'>('ankle');

  // Ankle / Foot state
  const [anklePain, setAnklePain] = useState<boolean>(true);
  const [latMall, setLatMall] = useState<boolean>(false);
  const [medMall, setMedMall] = useState<boolean>(false);
  const [midfootPain, setMidfootPain] = useState<boolean>(false);
  const [navicular, setNavicular] = useState<boolean>(false);
  const [fifthMet, setFifthMet] = useState<boolean>(false);
  const [weightBearingAnkle, setWeightBearingAnkle] = useState<boolean>(false);

  // Knee state
  const [age55, setAge55] = useState<boolean>(false);
  const [patella, setPatella] = useState<boolean>(false);
  const [fibHead, setFibHead] = useState<boolean>(false);
  const [flexion, setFlexion] = useState<boolean>(false);
  const [weightBearingKnee, setWeightBearingKnee] = useState<boolean>(false);

  const currentText = translations[lang] || translations.en;

  const ankleXrayNeeded = useMemo(() => {
    if (anklePain && (latMall || medMall || weightBearingAnkle)) return true;
    return false;
  }, [anklePain, latMall, medMall, weightBearingAnkle]);

  const footXrayNeeded = useMemo(() => {
    if (midfootPain && (navicular || fifthMet || weightBearingAnkle)) return true;
    return false;
  }, [midfootPain, navicular, fifthMet, weightBearingAnkle]);

  const kneeXrayNeeded = useMemo(() => {
    return age55 || patella || fibHead || flexion || weightBearingKnee;
  }, [age55, patella, fibHead, flexion, weightBearingKnee]);

  const isPositive = activeTab === 'ankle' ? (ankleXrayNeeded || footXrayNeeded) : kneeXrayNeeded;

  useEffect(() => {
    trackCalculatorUsage('ottawa-rules', lang);
  }, [lang]);

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/ottawa-rules"
        scoringSystem="Ottawa Clinical Radiography Decision Rules"
        howToSteps={[
          lang === 'fr' ? 'Choisir l\'articulation traumatisée : Cheville/Pied ou Genou.' : 'Select the traumatized joint: Ankle/Foot or Knee.',
          lang === 'fr' ? 'Palper les repères osseux clés (malléoles, 5e métatarsien, naviculaire, tête fibula, rotule).' : 'Palpate key bony landmarks (posterior malleoli, 5th metatarsal, navicular, fibula head, patella).',
          lang === 'fr' ? 'Tester la capacité d\'appui complet sur 4 pas consécutifs.' : 'Assess capacity to bear weight for 4 full steps.',
          lang === 'fr' ? 'Si aucun critère n\'est présent, la fracture est éliminée sans radiographie.' : 'If all criteria are negative, clinically significant fracture is ruled out without imaging.'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700 mb-2">
          <Stethoscope className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Traumatologie & Urgences' : 'Emergency Medicine & Orthopedic Traumatology'}</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
          {currentText.title}
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed">
          {currentText.subtitle}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('ankle')}
          className={`px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${activeTab === 'ankle' ? 'bg-teal-700 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
        >
          {currentText.tabAnkle}
        </button>
        <button
          onClick={() => setActiveTab('knee')}
          className={`px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${activeTab === 'knee' ? 'bg-teal-700 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
        >
          {currentText.tabKnee}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 space-y-6">
          {activeTab === 'ankle' ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-teal-800 mb-3">1. Malleolar Zone (Ankle Series)</h3>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer">
                    <input type="checkbox" checked={anklePain} onChange={(e) => setAnklePain(e.target.checked)} className="w-4 h-4 text-teal-600 rounded" />
                    <span className="text-sm font-medium text-gray-900">{currentText.anklePain}</span>
                  </label>
                  {anklePain && (
                    <div className="pl-6 space-y-2 border-l-2 border-teal-500">
                      <label className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-200 cursor-pointer bg-white">
                        <input type="checkbox" checked={latMall} onChange={(e) => setLatMall(e.target.checked)} className="w-4 h-4 text-teal-600 rounded" />
                        <span className="text-xs text-gray-800">{currentText.latMall}</span>
                      </label>
                      <label className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-200 cursor-pointer bg-white">
                        <input type="checkbox" checked={medMall} onChange={(e) => setMedMall(e.target.checked)} className="w-4 h-4 text-teal-600 rounded" />
                        <span className="text-xs text-gray-800">{currentText.medMall}</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-teal-800 mb-3">2. Midfoot Zone (Foot Series)</h3>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer">
                    <input type="checkbox" checked={midfootPain} onChange={(e) => setMidfootPain(e.target.checked)} className="w-4 h-4 text-teal-600 rounded" />
                    <span className="text-sm font-medium text-gray-900">{currentText.midfootPain}</span>
                  </label>
                  {midfootPain && (
                    <div className="pl-6 space-y-2 border-l-2 border-teal-500">
                      <label className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-200 cursor-pointer bg-white">
                        <input type="checkbox" checked={navicular} onChange={(e) => setNavicular(e.target.checked)} className="w-4 h-4 text-teal-600 rounded" />
                        <span className="text-xs text-gray-800">{currentText.navicular}</span>
                      </label>
                      <label className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-200 cursor-pointer bg-white">
                        <input type="checkbox" checked={fifthMet} onChange={(e) => setFifthMet(e.target.checked)} className="w-4 h-4 text-teal-600 rounded" />
                        <span className="text-xs text-gray-800">{currentText.fifthMet}</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-teal-800 mb-3">3. Weight-Bearing Ability</h3>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer">
                  <input type="checkbox" checked={weightBearingAnkle} onChange={(e) => setWeightBearingAnkle(e.target.checked)} className="w-4 h-4 text-teal-600 rounded" />
                  <span className="text-sm font-medium text-gray-900">{currentText.weightBearingAnkle}</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-teal-800 mb-2">Ottawa Knee Criteria</h3>
              <p className="text-xs text-gray-500 mb-4">A knee X-ray is only required for acute knee injury patients who satisfy 1 or more criteria:</p>
              <div className="space-y-3">
                {[
                  { label: currentText.age55, val: age55, set: setAge55 },
                  { label: currentText.patella, val: patella, set: setPatella },
                  { label: currentText.fibHead, val: fibHead, set: setFibHead },
                  { label: currentText.flexion, val: flexion, set: setFlexion },
                  { label: currentText.weightBearingKnee, val: weightBearingKnee, set: setWeightBearingKnee }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => item.set(!item.val)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${item.val ? 'bg-teal-50 border-teal-500 shadow-sm' : 'bg-gray-50/70 border-gray-200 hover:bg-gray-100/60'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-all ${item.val ? 'bg-teal-600 text-white' : 'border border-gray-300 bg-white'}`}>
                        {item.val ? '✓' : ''}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 p-6 md:p-8 relative">
            <div className="absolute top-0 right-0 p-24 bg-gradient-to-bl from-teal-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-5">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block">
                {currentText.result}
              </span>
              
              <div className="flex items-center gap-3">
                <span className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isPositive ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {isPositive ? currentText.xrayRequired : currentText.xrayNotRequired}
                </span>
              </div>

              <div className={`p-4 rounded-xl border ${isPositive ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
                <p className="text-xs leading-relaxed">
                  {isPositive ? currentText.xrayRequiredDesc : currentText.xrayNotRequiredDesc}
                </p>
              </div>

              {activeTab === 'ankle' && (
                <div className="text-xs space-y-1 text-gray-300 bg-white/5 p-3 rounded-lg border border-white/10">
                  <div className="flex justify-between">
                    <span>Ankle Series:</span>
                    <span className={`font-bold ${ankleXrayNeeded ? 'text-rose-400' : 'text-emerald-400'}`}>{ankleXrayNeeded ? 'Indicated' : 'Not needed'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Foot Series:</span>
                    <span className={`font-bold ${footXrayNeeded ? 'text-rose-400' : 'text-emerald-400'}`}>{footXrayNeeded ? 'Indicated' : 'Not needed'}</span>
                  </div>
                </div>
              )}

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "Selected Evaluation", value: activeTab === 'ankle' ? "Ankle & Foot Rules" : "Knee Rule" },
                  { label: "Radiography Status", value: isPositive ? "Indicated" : "Not Required (Ruled Out)" }
                ]}
                results={[
                  { label: "Recommendation", value: isPositive ? currentText.xrayRequired : currentText.xrayNotRequired }
                ]}
                formula="Ottawa Rules (Stiell et al., JAMA 1993, 1996)"
                disclaimer="Sensitivity >98% for acute fracture. Clinical judgement supersedes clinical decision rules."
                references="Stiell IG, et al. JAMA. 1993;269(9):1127-1132."
                lang={lang}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <MedicalReviewerCard reviewer={REVIEWER_EMERGENCY} />
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900 block mb-1">Foundational Evidence:</span>
          <p className="italic mb-2">{currentText.references}</p>
          <div className="flex flex-wrap gap-4 text-teal-700">
            <a href="https://pubmed.ncbi.nlm.nih.gov/8433468/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Stiell IG et al. (1993) Ottawa Ankle Rules JAMA <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://pubmed.ncbi.nlm.nih.gov/8594242/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Stiell IG et al. (1996) Ottawa Knee Rule JAMA <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
