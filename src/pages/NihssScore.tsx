import React, { useState, useMemo, useEffect } from 'react';
import { Brain, Activity, AlertTriangle, ChevronDown, Check } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd } from '../components/JsonLd';
import ClinicalContextPanel from '../components/ClinicalContextPanel';

const translations: Translations = {
  en: {
    title: "NIH Stroke Scale (NIHSS)",
    subtitle: "Quantifies the impairment caused by a stroke",
    categories: [
      {
        id: '1a', title: '1a. Level of Consciousness',
        options: [
          { v: 0, l: 'Alert, keenly responsive' },
          { v: 1, l: 'Not alert, but arousable by minor stimulation' },
          { v: 2, l: 'Not alert, requires repeated stimulation' },
          { v: 3, l: 'Responds only with reflex motor or autonomic effects, or totally unresponsive' }
        ]
      },
      {
        id: '1b', title: '1b. LOC Questions (Month & Age)',
        options: [
          { v: 0, l: 'Answers both questions correctly' },
          { v: 1, l: 'Answers one question correctly' },
          { v: 2, l: 'Answers neither question correctly' }
        ]
      },
      {
        id: '1c', title: '1c. LOC Commands (Open/close eyes, grip/release hand)',
        options: [
          { v: 0, l: 'Performs both tasks correctly' },
          { v: 1, l: 'Performs one task correctly' },
          { v: 2, l: 'Performs neither task correctly' }
        ]
      },
      {
        id: '2', title: '2. Best Gaze',
        options: [
          { v: 0, l: 'Normal' },
          { v: 1, l: 'Partial gaze palsy' },
          { v: 2, l: 'Forced deviation or total gaze paresis' }
        ]
      },
      {
        id: '3', title: '3. Visual',
        options: [
          { v: 0, l: 'No visual loss' },
          { v: 1, l: 'Partial hemianopia' },
          { v: 2, l: 'Complete hemianopia' },
          { v: 3, l: 'Bilateral hemianopia (blind including cortical blindness)' }
        ]
      },
      {
        id: '4', title: '4. Facial Palsy',
        options: [
          { v: 0, l: 'Normal symmetrical movements' },
          { v: 1, l: 'Minor paralysis (flattened nasolabial fold, asymmetry on smiling)' },
          { v: 2, l: 'Partial paralysis (total or near-total paralysis of lower face)' },
          { v: 3, l: 'Complete paralysis of one or both sides (absence of facial movement in the upper and lower face)' }
        ]
      },
      {
        id: '5a', title: '5a. Motor Arm - Left',
        options: [
          { v: 0, l: 'No drift for 10 seconds' },
          { v: 1, l: 'Drift, but does not hit bed' },
          { v: 2, l: 'Some effort against gravity, but cannot sustain (hits bed)' },
          { v: 3, l: 'No effort against gravity' },
          { v: 4, l: 'No movement' }
        ]
      },
      {
        id: '5b', title: '5b. Motor Arm - Right',
        options: [
          { v: 0, l: 'No drift for 10 seconds' },
          { v: 1, l: 'Drift, but does not hit bed' },
          { v: 2, l: 'Some effort against gravity, but cannot sustain (hits bed)' },
          { v: 3, l: 'No effort against gravity' },
          { v: 4, l: 'No movement' }
        ]
      },
      {
        id: '6a', title: '6a. Motor Leg - Left',
        options: [
          { v: 0, l: 'No drift for 5 seconds' },
          { v: 1, l: 'Drift, but does not hit bed' },
          { v: 2, l: 'Some effort against gravity, but cannot sustain (hits bed)' },
          { v: 3, l: 'No effort against gravity' },
          { v: 4, l: 'No movement' }
        ]
      },
      {
        id: '6b', title: '6b. Motor Leg - Right',
        options: [
          { v: 0, l: 'No drift for 5 seconds' },
          { v: 1, l: 'Drift, but does not hit bed' },
          { v: 2, l: 'Some effort against gravity, but cannot sustain (hits bed)' },
          { v: 3, l: 'No effort against gravity' },
          { v: 4, l: 'No movement' }
        ]
      },
      {
        id: '7', title: '7. Limb Ataxia',
        options: [
          { v: 0, l: 'Absent' },
          { v: 1, l: 'Present in one limb' },
          { v: 2, l: 'Present in two limbs' }
        ]
      },
      {
        id: '8', title: '8. Sensory',
        options: [
          { v: 0, l: 'Normal; no sensory loss' },
          { v: 1, l: 'Mild-to-moderate sensory loss' },
          { v: 2, l: 'Severe-to-total sensory loss' }
        ]
      },
      {
        id: '9', title: '9. Best Language',
        options: [
          { v: 0, l: 'No aphasia' },
          { v: 1, l: 'Mild-to-moderate aphasia' },
          { v: 2, l: 'Severe aphasia' },
          { v: 3, l: 'Mute, global aphasia' }
        ]
      },
      {
        id: '10', title: '10. Dysarthria',
        options: [
          { v: 0, l: 'Normal' },
          { v: 1, l: 'Mild-to-moderate dysarthria' },
          { v: 2, l: 'Severe dysarthria, mute, or anarthric' }
        ]
      },
      {
        id: '11', title: '11. Extinction and Inattention (Neglect)',
        options: [
          { v: 0, l: 'No abnormality' },
          { v: 1, l: 'Visual, tactile, auditory, spatial, or personal inattention' },
          { v: 2, l: 'Profound hemi-inattention or extinction to more than one modality' }
        ]
      }
    ],
    resultTitle: "NIHSS Score",
    riskTitle: "Stroke Severity",
    severityLevels: {
      0: 'No stroke symptoms',
      1: 'Minor stroke',
      5: 'Moderate stroke',
      16: 'Moderate to severe stroke',
      21: 'Severe stroke'
    },
    clinicalTitle: "Clinical Context",
    pearls: [
      "The NIHSS is the standard for quantifying stroke severity and guiding thrombolytic therapy (tPA).",
      "Always assess items in the strict order presented. Do not go back to change scores.",
      "Score what the patient actually does, not what you think they can do.",
      "For aphasic patients, you must still score the items strictly as directed, even if they cannot follow commands."
    ],
    pitfalls: [
      "The NIHSS is heavily weighted toward anterior circulation strokes. It can score 0 for severe posterior circulation strokes (e.g., cerebellar infarct, Wallenberg syndrome).",
      "Don't confuse dysarthria (motor speech issue, item 10) with aphasia (language processing issue, item 9)."
    ],
    evidence: "Scores < 5 generally indicate a minor stroke. Scores > 15 are predictive of a severe stroke with higher risk of hemorrhagic transformation if thrombolytics are used.",
    references: "Brott T, Adams HP Jr, Olinger CP, et al. Measurements of acute cerebral infarction: a clinical examination scale. Stroke. 1989;20(7):864-70."
  },
  fr: {
    title: "Score NIHSS (AVC)",
    subtitle: "Quantifie la sévérité du déficit neurologique lors d'un AVC",
    categories: [
      {
        id: '1a', title: '1a. Niveau de Conscience',
        options: [
          { v: 0, l: 'Alerte' },
          { v: 1, l: 'Somnolent, réveillable à la stimulation mineure' },
          { v: 2, l: 'Obnubilé, nécessite des stimulations répétées' },
          { v: 3, l: 'Coma, répond uniquement par des réflexes ou aréactif' }
        ]
      },
      {
        id: '1b', title: '1b. Questions (Mois & Âge)',
        options: [
          { v: 0, l: 'Répond correctement aux 2 questions' },
          { v: 1, l: 'Répond correctement à 1 question' },
          { v: 2, l: 'Ne répond à aucune question' }
        ]
      },
      {
        id: '1c', title: '1c. Ordres (Ouvrir/fermer yeux, serrer la main)',
        options: [
          { v: 0, l: 'Exécute les 2 ordres' },
          { v: 1, l: 'Exécute 1 ordre' },
          { v: 2, l: 'N\'exécute aucun ordre' }
        ]
      },
      {
        id: '2', title: '2. Regard',
        options: [
          { v: 0, l: 'Normal' },
          { v: 1, l: 'Parésie partielle du regard' },
          { v: 2, l: 'Déviation forcée ou parésie totale' }
        ]
      },
      {
        id: '3', title: '3. Champ Visuel',
        options: [
          { v: 0, l: 'Aucune perte visuelle' },
          { v: 1, l: 'Hémianopsie partielle' },
          { v: 2, l: 'Hémianopsie complète' },
          { v: 3, l: 'Hémianopsie bilatérale ou cécité' }
        ]
      },
      {
        id: '4', title: '4. Paralysie Faciale',
        options: [
          { v: 0, l: 'Mouvements normaux symétriques' },
          { v: 1, l: 'Paralysie mineure (effacement du pli nasogénien, asymétrie au sourire)' },
          { v: 2, l: 'Paralysie partielle (paralysie totale ou quasi-totale de la face inférieure)' },
          { v: 3, l: 'Paralysie complète (absence de mouvement, face supérieure et inférieure)' }
        ]
      },
      {
        id: '5a', title: '5a. Motricité MS - Gauche',
        options: [
          { v: 0, l: 'Maintien 10s sans chute' },
          { v: 1, l: 'Chute avant 10s mais ne touche pas le lit' },
          { v: 2, l: 'Quelque effort contre la gravité (touche le lit)' },
          { v: 3, l: 'Aucun effort contre la gravité (glisse sur le lit)' },
          { v: 4, l: 'Aucun mouvement' }
        ]
      },
      {
        id: '5b', title: '5b. Motricité MS - Droit',
        options: [
          { v: 0, l: 'Maintien 10s sans chute' },
          { v: 1, l: 'Chute avant 10s mais ne touche pas le lit' },
          { v: 2, l: 'Quelque effort contre la gravité (touche le lit)' },
          { v: 3, l: 'Aucun effort contre la gravité (glisse sur le lit)' },
          { v: 4, l: 'Aucun mouvement' }
        ]
      },
      {
        id: '6a', title: '6a. Motricité MI - Gauche',
        options: [
          { v: 0, l: 'Maintien 5s sans chute' },
          { v: 1, l: 'Chute avant 5s mais ne touche pas le lit' },
          { v: 2, l: 'Quelque effort contre la gravité (touche le lit)' },
          { v: 3, l: 'Aucun effort contre la gravité (glisse sur le lit)' },
          { v: 4, l: 'Aucun mouvement' }
        ]
      },
      {
        id: '6b', title: '6b. Motricité MI - Droit',
        options: [
          { v: 0, l: 'Maintien 5s sans chute' },
          { v: 1, l: 'Chute avant 5s mais ne touche pas le lit' },
          { v: 2, l: 'Quelque effort contre la gravité (touche le lit)' },
          { v: 3, l: 'Aucun effort contre la gravité (glisse sur le lit)' },
          { v: 4, l: 'Aucun mouvement' }
        ]
      },
      {
        id: '7', title: '7. Ataxie',
        options: [
          { v: 0, l: 'Absente' },
          { v: 1, l: 'Présente dans 1 membre' },
          { v: 2, l: 'Présente dans 2 membres' }
        ]
      },
      {
        id: '8', title: '8. Sensibilité',
        options: [
          { v: 0, l: 'Normale' },
          { v: 1, l: 'Perte de sensibilité légère à modérée' },
          { v: 2, l: 'Perte de sensibilité sévère à totale' }
        ]
      },
      {
        id: '9', title: '9. Langage',
        options: [
          { v: 0, l: 'Pas d\'aphasie' },
          { v: 1, l: 'Aphasie légère à modérée' },
          { v: 2, l: 'Aphasie sévère' },
          { v: 3, l: 'Mutisme, aphasie globale' }
        ]
      },
      {
        id: '10', title: '10. Dysarthrie',
        options: [
          { v: 0, l: 'Normale' },
          { v: 1, l: 'Dysarthrie légère à modérée' },
          { v: 2, l: 'Dysarthrie sévère, mutisme ou anarthrie' }
        ]
      },
      {
        id: '11', title: '11. Extinction / Négligence',
        options: [
          { v: 0, l: 'Pas d\'anomalie' },
          { v: 1, l: 'Négligence visuelle, tactile, spatiale ou auditive' },
          { v: 2, l: 'Hémi-négligence profonde sur plus d\'une modalité' }
        ]
      }
    ],
    resultTitle: "Score NIHSS",
    riskTitle: "Sévérité de l'AVC",
    severityLevels: {
      0: 'Aucun symptôme d\'AVC',
      1: 'AVC mineur',
      5: 'AVC modéré',
      16: 'AVC modéré à sévère',
      21: 'AVC sévère'
    },
    clinicalTitle: "Contexte Clinique",
    pearls: [
      "Le NIHSS est le standard pour quantifier la sévérité d'un AVC et guider la thrombolyse.",
      "Évaluez toujours les items dans l'ordre strict. Ne revenez pas en arrière pour modifier un score.",
      "Notez ce que le patient fait réellement, pas ce que vous pensez qu'il peut faire."
    ],
    pitfalls: [
      "Le NIHSS est biaisé vers les AVC de la circulation antérieure. Un infarctus sévère du cervelet peut avoir un score de 0.",
      "Ne pas confondre dysarthrie (trouble moteur, item 10) et aphasie (trouble du langage, item 9)."
    ],
    evidence: "Scores < 5 indiquent un AVC mineur. Scores > 15 prédisent un AVC sévère avec un risque plus élevé de transformation hémorragique post-thrombolyse.",
    references: "Brott T, Adams HP Jr, Olinger CP, et al. Measurements of acute cerebral infarction: a clinical examination scale. Stroke. 1989;20(7):864-70."
  }
};

export default function NihssScore({ lang }: { lang: LangCode }) {
  const currentText = translations[lang] || translations.en;
  const categories = currentText.categories as any[];

  // initialize all to 0 or null? In complex scales, forcing the user to select is safer, but NIHSS often defaults to 0. 
  // Let's use null to force explicit selection for all 15 items to avoid false zeros.
  const [selections, setSelections] = useState<Record<string, number | null>>(
    categories.reduce((acc, cat) => ({ ...acc, [cat.id]: null }), {})
  );

  const [expandedCat, setExpandedCat] = useState<string | null>(categories[0].id);

  const handleSelect = (catId: string, value: number) => {
    setSelections(prev => ({ ...prev, [catId]: value }));
    // Auto-advance to next empty
    const currentIndex = categories.findIndex(c => c.id === catId);
    if (currentIndex < categories.length - 1) {
      setExpandedCat(categories[currentIndex + 1].id);
    }
  };

  const score = useMemo(() => {
    let total = 0;
    for (const key in selections) {
      if (selections[key] === null) return null;
      total += selections[key] as number;
    }
    return total;
  }, [selections]);

  const riskAssessment = useMemo(() => {
    if (score === null) return null;
    const lvls = currentText.severityLevels as any;
    if (score === 0) return lvls[0];
    if (score >= 1 && score <= 4) return lvls[1];
    if (score >= 5 && score <= 15) return lvls[5];
    if (score >= 16 && score <= 20) return lvls[16];
    return lvls[21];
  }, [score, lang, currentText]);

  const missingCount = categories.length - Object.values(selections).filter(v => v !== null).length;

  useEffect(() => {
    if (score !== null) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('nihss-score', lang, score);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [score, lang]);

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "MedicalWebPage",
            "@id": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}nihss-score`,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}nihss-score`,
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "inLanguage": lang
          },
          {
            "@type": "MedicalCalculator",
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}nihss-score`,
            "relevantSpecialty": {
              "@type": "MedicalSpecialty",
              "name": "Neurology"
            }
          }
        ]
      }} />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-purple-500/5 via-violet-500/5 to-fuchsia-500/5 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-3xl mb-12 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100/50 border border-purple-200 text-purple-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Brain className="w-3.5 h-3.5" />
          <span>Neurology / Emergency</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          {currentText.title as string}
        </h1>
        <p className="text-slate-600 text-base md:text-lg max-w-2xl leading-relaxed">
          {currentText.subtitle as string}
        </p>
        <div className="mt-4 flex gap-3">
          <EmbedCodeButton calculatorSlug="nihss-score" lang={lang} title={currentText.title as string} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
            {categories.map((cat, index) => {
              const isExpanded = expandedCat === cat.id;
              const hasSelection = selections[cat.id] !== null;
              
              return (
                <div key={cat.id} className={`transition-colors ${isExpanded ? 'bg-slate-50/50' : 'bg-white hover:bg-slate-50/30'}`}>
                  <button
                    onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                        hasSelection ? 'bg-purple-500 border-purple-500 text-white' : 'bg-transparent border-slate-300 text-slate-500'
                      }`}>
                        {hasSelection ? <Check className="w-3.5 h-3.5" /> : index + 1}
                      </div>
                      <span className={`font-bold ${hasSelection ? 'text-purple-900' : 'text-slate-700'}`}>
                        {cat.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      {hasSelection && (
                        <span className="font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-md text-sm">
                          +{selections[cat.id]}
                        </span>
                      )}
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 space-y-2 animate-in fade-in slide-in-from-top-2">
                      {cat.options.map((opt: any) => (
                        <button
                          key={opt.v}
                          onClick={() => handleSelect(cat.id, opt.v)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left ${
                            selections[cat.id] === opt.v
                              ? 'border-purple-500 bg-purple-50 text-purple-900'
                              : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-white'
                          }`}
                        >
                          <span className="text-sm font-medium">{opt.l}</span>
                          <span className={`font-bold ml-4 ${selections[cat.id] === opt.v ? 'text-purple-600' : 'text-slate-400'}`}>
                            {opt.v}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 sticky top-24">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
              {currentText.resultTitle as string}
            </h3>

            {score !== null ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`p-6 rounded-2xl border relative overflow-hidden group ${
                  score > 15 ? 'bg-red-50 border-red-200 text-red-900' :
                  score > 4 ? 'bg-amber-50 border-amber-200 text-amber-900' :
                  'bg-purple-50 border-purple-200 text-purple-900'
                }`}>
                  <div className="flex items-baseline gap-2 mb-4 justify-center">
                    <span className="text-6xl font-extrabold tracking-tight">{score}</span>
                    <span className="text-xl font-semibold opacity-80">/ 42</span>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">{currentText.riskTitle as string}</div>
                    <div className="text-lg font-black">{riskAssessment}</div>
                  </div>
                </div>

                <div className="space-y-2">
                   <button 
                     onClick={() => {
                        setSelections(categories.reduce((acc, cat) => ({ ...acc, [cat.id]: 0 }), {}));
                     }}
                     className="w-full py-2 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                   >
                     {lang === 'fr' ? 'Tout définir à 0 (Normal)' : 'Set all to 0 (Normal)'}
                   </button>
                </div>

                <ClinicalExportButton
                  title={currentText.title as string}
                  inputs={categories.map(c => ({
                    label: c.title,
                    value: selections[c.id] !== null 
                      ? `${selections[c.id]} - ${c.options.find((o: any) => o.v === selections[c.id])?.l}` 
                      : 'Missing'
                  }))}
                  results={[
                    { label: currentText.resultTitle as string, value: `${score}/42` },
                    { label: currentText.riskTitle as string, value: riskAssessment as string }
                  ]}
                  disclaimer={lang === 'fr' ? "Ceci est un outil d'aide à la décision. Il ne remplace pas le jugement clinique." : "This tool is for decision support only and does not replace clinical judgment."}
                  references={currentText.references as string}
                  lang={lang}
                />
              </div>
            ) : (
              <div className="py-12 px-4 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 font-medium text-sm flex flex-col items-center gap-3">
                <Activity className="w-8 h-8 opacity-20" />
                {missingCount > 0 
                  ? (lang === 'fr' ? `${missingCount} item(s) restant(s)` : `${missingCount} item(s) remaining`)
                  : (lang === 'fr' ? "Calcule..." : "Calculating...")}
                
                <button 
                   onClick={() => {
                      setSelections(categories.reduce((acc, cat) => ({ ...acc, [cat.id]: 0 }), {}));
                      setExpandedCat(null);
                   }}
                   className="mt-4 py-2 px-4 rounded-xl border border-slate-200 bg-white shadow-sm text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                 >
                   {lang === 'fr' ? 'Score Normal = 0' : 'Set All Normal (0)'}
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ClinicalContextPanel
        lang={lang}
        pearls={currentText.pearls as string[]}
        pitfalls={currentText.pitfalls as string[]}
        evidence={currentText.evidence as string}
        references={[currentText.references as string]}
      />
    </>
  );
}
