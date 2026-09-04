import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, Activity as ActivityIcon } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_ONCOLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "ECOG / WHO Performance Status Scale",
    subtitle: "Quantifies functional capacity, chemotherapy eligibility, and prognostic status in cancer patients",
    selectGrade: "Select Patient Functional & Activity Level",
    grade0: "Grade 0: Fully Active",
    grade0Desc: "Fully active, able to carry on all pre-disease performance without restriction.",
    grade1: "Grade 1: Strenuous Activity Restricted",
    grade1Desc: "Restricted in physically strenuous activity but ambulatory and able to carry out light or sedentary work (e.g., light house work, office work).",
    grade2: "Grade 2: Ambulatory & Self-Caring",
    grade2Desc: "Ambulatory and capable of all self-care but unable to carry out any work activities. Up and about more than 50% of waking hours.",
    grade3: "Grade 3: Limited Self-Care",
    grade3Desc: "Capable of only limited self-care. Confined to bed or chair more than 50% of waking hours.",
    grade4: "Grade 4: Completely Disabled",
    grade4Desc: "Completely disabled. Cannot carry on any self-care. Totally confined to bed or chair (100% of waking hours).",
    grade5: "Grade 5: Deceased",
    grade5Desc: "Patient deceased.",
    result: "ECOG Performance Status",
    karnofskyEquivalent: "Karnofsky Performance Equivalent",
    chemoTitle: "Chemotherapy Eligibility & Clinical Guidance",
    references: "Oken MM, Creech RH, Tormey DC, et al. Toxicity and response criteria of the Eastern Cooperative Oncology Group. Am J Clin Oncol. 1982;5(6):649-655. (PMID: 7165009).",
    faqs: [
      { question: "Why is ECOG Performance Status essential in oncology?", answer: "ECOG Performance Status is the primary determinant of a patient's ability to tolerate cytotoxic chemotherapy, targeted therapy, and immunotherapy without excessive toxicity. It is also a mandatory inclusion criterion for almost all oncology clinical trials." },
      { question: "What is the chemotherapy cutoff?", answer: "Patients with ECOG 0 or 1 generally tolerate standard multi-agent chemotherapy regimens. Patients with ECOG 2 may receive dose-attenuated or single-agent therapies. For ECOG 3 or 4, standard cytotoxic chemotherapy is usually contraindicated due to high mortality, prioritizing palliative and best supportive care." },
      { question: "How does ECOG correlate with the Karnofsky Performance Scale (KPS)?", answer: "ECOG 0 ≈ KPS 100-90%; ECOG 1 ≈ KPS 80-70%; ECOG 2 ≈ KPS 60-50%; ECOG 3 ≈ KPS 40-30%; ECOG 4 ≈ KPS 20-10%." }
    ],
    g0_1: "ECOG 0 – 1: Standard Systemic Therapy Candidate",
    g0_1Desc: "Excellent functional reserve. Eligible for standard full-dose combination chemotherapy regimens, clinical trials, and immunotherapies.",
    g2: "ECOG 2: Borderline / Dose-Attenuated Candidate",
    g2Desc: "Intermediate functional reserve. May tolerate single-agent systemic therapy or dose-modified regimens with close adverse effect monitoring.",
    g3_4: "ECOG 3 – 4: Poor Tolerance (Best Supportive Care)",
    g3_4Desc: "Severely impaired functional capacity. Cytotoxic chemotherapy generally increases morbidity and mortality without survival benefit. Emphasize palliative care, symptom management, and hospice consultation.",
    g5: "ECOG 5: Deceased",
    g5Desc: "Patient deceased."
  },
  fr: {
    title: "Score de Performance ECOG / OMS",
    subtitle: "Évaluation de l'état général, de l'autonomie et de l'éligibilité à la chimiothérapie en oncologie",
    selectGrade: "Sélectionnez le niveau d'autonomie du patient",
    grade0: "Grade 0 : Parfaitement autonome",
    grade0Desc: "Entièrement actif, capable de poursuivre toutes ses activités antérieures sans restriction.",
    grade1: "Grade 1 : Activités intenses restreintes",
    grade1Desc: "Gêne pour les efforts physiques soutenus, mais autonome pour les travaux légers ou sédentaires (bureau, ménage léger).",
    grade2: "Grade 2 : Autonome mais incapable de travailler",
    grade2Desc: "Capable de subvenir seul(e) à ses besoins élémentaires. Debout plus de 50% des heures de veille.",
    grade3: "Grade 3 : Autonomie limitée (Alité > 50% du temps)",
    grade3Desc: "Autonomie réduite pour les soins personnels. Alité ou au fauteuil plus de 50% de la journée.",
    grade4: "Grade 4 : Dépendance totale (Alité en permanence)",
    grade4Desc: "Incapable de subvenir à ses besoins corporels sans aide. Alité en permanence (100% du temps de veille).",
    grade5: "Grade 5 : Décès",
    grade5Desc: "Patient décédé.",
    result: "Statut de Performance ECOG",
    karnofskyEquivalent: "Équivalence Indice de Karnofsky",
    chemoTitle: "Éligibilité aux Traitements Oncologiques",
    references: "Oken MM, et al. Am J Clin Oncol. 1982;5(6):649-655. (PMID: 7165009).",
    faqs: [
      { question: "Quel est le rôle de l'indice ECOG ?", answer: "Il guide le choix des thérapeutiques oncologiques (chimiothérapie, immunothérapie) et conditionne l'inclusion dans les essais cliniques." }
    ],
    g0_1: "ECOG 0 – 1 : Éligible aux protocoles standards",
    g0_1Desc: "Excellente réserve fonctionnelle. Candidat aux polychimiothérapies à doses pleines et aux essais thérapeutiques.",
    g2: "ECOG 2 : Éligibilité limite / Posologies adaptées",
    g2Desc: "Tolérance intermédiaire. Privilégier les monothérapies ou les adaptations de dose avec surveillance clinique rapprochée.",
    g3_4: "ECOG 3 – 4 : Contre-indication aux cytotoxiques lourds",
    g3_4Desc: "Risque toxique majeur. Prise en charge axée sur les soins de support, le contrôle symptomatique et les soins palliatifs.",
    g5: "ECOG 5 : Décès",
    g5Desc: "Patient décédé."
  }
};

export default function EcogPerformance({ lang }: { lang: LangCode }) {
  const [grade, setGrade] = useState<number>(1);

  const currentText = translations[lang] || translations.en;

  useEffect(() => {
    trackCalculatorUsage('ecog-performance', lang, grade);
  }, [grade, lang]);

  const items = [
    { num: 0, title: currentText.grade0, desc: currentText.grade0Desc, kps: "100 - 90%" },
    { num: 1, title: currentText.grade1, desc: currentText.grade1Desc, kps: "80 - 70%" },
    { num: 2, title: currentText.grade2, desc: currentText.grade2Desc, kps: "60 - 50%" },
    { num: 3, title: currentText.grade3, desc: currentText.grade3Desc, kps: "40 - 30%" },
    { num: 4, title: currentText.grade4, desc: currentText.grade4Desc, kps: "20 - 10%" },
    { num: 5, title: currentText.grade5, desc: currentText.grade5Desc, kps: "0%" }
  ];

  const category = useMemo(() => {
    if (grade <= 1) return 'g0_1';
    if (grade === 2) return 'g2';
    if (grade <= 4) return 'g3_4';
    return 'g5';
  }, [grade]);

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/ecog-performance"
        scoringSystem="ECOG / WHO Performance Status"
        howToSteps={[
          lang === 'fr' ? 'Évaluer le temps passé au lit ou au fauteuil durant les heures de veille.' : 'Assess percentage of waking hours spent confined to bed or chair.',
          lang === 'fr' ? 'Sélectionner le grade de 0 (activité normale) à 4 (dépendant total).' : 'Select grade from 0 (fully active) to 4 (completely disabled).',
          lang === 'fr' ? 'Les grades 0 et 1 permettent les chimiothérapies intensives; grades 3-4 privilégient les soins de support.' : 'Grades 0-1 indicate systemic chemotherapy fitness; grades 3-4 prioritize supportive care.'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-700 mb-2">
          <ActivityIcon className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Oncologie & Hématologie' : 'Oncology & Supportive Care'}</span>
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
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
              {currentText.selectGrade}
            </label>

            <div className="space-y-3">
              {items.map((item) => {
                const isSelected = grade === item.num;
                return (
                  <button
                    key={item.num}
                    type="button"
                    onClick={() => setGrade(item.num)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? item.num <= 1
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                          : item.num === 2
                          ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                          : 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 shadow-sm'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold text-sm ${isSelected ? 'text-gray-900' : 'text-gray-800'}`}>
                        {item.title}
                      </span>
                      <div className="flex gap-2 items-center">
                        <span className="text-xs text-gray-500">KPS: {item.kps}</span>
                        <span className={`text-xs px-2.5 py-0.5 rounded font-bold ${
                          item.num <= 1 ? 'bg-emerald-100 text-emerald-800' : item.num === 2 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          ECOG {item.num}
                        </span>
                      </div>
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
            <div className="absolute top-0 right-0 p-24 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-5">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block">
                {currentText.result}
              </span>
              
              <div className="flex items-baseline gap-3 tabular-nums">
                <span className={`text-5xl md:text-6xl font-extrabold tracking-tight ${
                  grade <= 1 ? 'text-emerald-400' : grade === 2 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  ECOG {grade}
                </span>
              </div>

              <div className="text-xs text-gray-300">
                <span className="text-gray-400">{currentText.karnofskyEquivalent}:</span>{' '}
                <span className="font-bold text-white">{items[grade].kps}</span>
              </div>

              <div className={`p-4 rounded-xl border ${
                category === 'g0_1'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : category === 'g2'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                <div className="font-bold text-sm mb-1">
                  {category === 'g0_1' ? currentText.g0_1 : category === 'g2' ? currentText.g2 : category === 'g3_4' ? currentText.g3_4 : currentText.g5}
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  {category === 'g0_1' ? currentText.g0_1Desc : category === 'g2' ? currentText.g2Desc : category === 'g3_4' ? currentText.g3_4Desc : currentText.g5Desc}
                </p>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "Assigned Status", value: items[grade].title },
                  { label: "Karnofsky Equivalent", value: items[grade].kps }
                ]}
                results={[
                  { label: "ECOG Score", value: `Grade ${grade}` },
                  { label: "Chemotherapy Eligibility", value: grade <= 1 ? "Standard Regimen Candidate" : grade === 2 ? "Dose-Modified / Single Agent" : "Best Supportive Care / Palliative" }
                ]}
                formula="Oken MM et al. ECOG Performance Status 0-5 Scale"
                disclaimer="ECOG 0-1 represents standard chemotherapy fitness; ECOG 3-4 indicates high toxic vulnerability."
                references="Oken MM, et al. Am J Clin Oncol. 1982;5(6):649-655."
                lang={lang}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <MedicalReviewerCard reviewer={REVIEWER_ONCOLOGY} />
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900 block mb-1">Foundational Evidence:</span>
          <p className="italic mb-2">{currentText.references}</p>
          <div className="flex flex-wrap gap-4 text-purple-700">
            <a href="https://pubmed.ncbi.nlm.nih.gov/7165009/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Oken MM et al. (1982) American Journal of Clinical Oncology <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
