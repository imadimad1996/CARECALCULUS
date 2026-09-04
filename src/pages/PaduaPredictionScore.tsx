import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, ShieldAlert } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_INTERNAL_MEDICINE } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Padua Prediction Score for VTE",
    subtitle: "Stratifies venous thromboembolism risk in hospitalized medical (non-surgical) patients to guide thromboprophylaxis",
    cancerLabel: "Active Cancer",
    cancerDesc: "Metastases, local cancer, or chemo/radiotherapy in previous 6 months (+3 points)",
    prevVteLabel: "Previous VTE",
    prevVteDesc: "Documented history of DVT or PE, excluding superficial thrombophlebitis (+3 points)",
    mobilityLabel: "Reduced Mobility",
    mobilityDesc: "Bedrest with bathroom privileges for at least 3 days (+3 points)",
    thrombophiliaLabel: "Known Thrombophilic Condition",
    thrombophiliaDesc: "Deficiency of antithrombin/protein C/S, Factor V Leiden, prothrombin 20210A, or antiphospholipid (+3 points)",
    traumaLabel: "Recent Trauma or Surgery (≤ 1 month)",
    traumaDesc: "Major trauma or surgical procedure within past 4 weeks (+2 points)",
    ageLabel: "Elderly Age (≥ 70 years)",
    ageDesc: "Patient aged 70 or older (+1 point)",
    heartRespLabel: "Heart and/or Respiratory Failure",
    heartRespDesc: "Decompensated heart failure (NYHA III/IV) or severe respiratory insufficiency (+1 point)",
    amiStrokeLabel: "Acute MI or Ischemic Stroke",
    amiStrokeDesc: "Recent acute coronary syndrome or ischemic cerebral infarction (+1 point)",
    infectionLabel: "Acute Infection or Rheumatologic Disorder",
    infectionDesc: "Active acute sepsis/infection or flare of autoimmune/rheumatologic disease (+1 point)",
    obesityLabel: "Obesity (BMI ≥ 30 kg/m²)",
    obesityDesc: "Body mass index meeting WHO obesity threshold (+1 point)",
    hormoneLabel: "Ongoing Hormonal Treatment",
    hormoneDesc: "Estrogen replacement, oral contraceptives, or SERMs (+1 point)",
    yes: "Yes",
    no: "No",
    resultTitle: "Padua Score & Thromboprophylaxis Guidance",
    scoreLabel: "Total Padua Score",
    points: "points",
    lowRisk: "Score < 4: Low VTE Risk (~0.3%)",
    lowRiskDesc: "Low risk of in-hospital venous thromboembolism (~0.3% without prophylaxis). Routine pharmacologic thromboprophylaxis is NOT indicated per CHEST/ACCP guidelines, as bleeding hazard outweighs thrombosis prevention. Consider early ambulation and mechanical compression if indicated.",
    highRisk: "Score ≥ 4: High VTE Risk (~11.0%)",
    highRiskDesc: "High risk of in-hospital VTE (~11.0% without prophylaxis). Pharmacologic thromboprophylaxis is STRONGLY INDICATED (e.g. Enoxaparin 40 mg SC daily or Dalteparin 5,000 units SC daily, adjusted for renal function) unless absolute bleeding contraindications exist.",
    references: "Barbar S, Noventa F, Rossetto V, et al. A risk assessment model for the identification of hospitalized medical patients at risk for venous thromboembolism: the Padua Prediction Score. J Thromb Haemost. 2010;8(11):2450-2457. (PMID: 20738765). Kahn SR, et al. Prevention of VTE in nonsurgical patients: Antithrombotic Therapy and Prevention of Thrombosis, 9th ed: ACCP Guidelines. Chest. 2012;141(2 Suppl):e195S-e226S.",
    faqs: [
      {
        question: "When should the Padua Score be evaluated?",
        answer: "The Padua Score should be calculated upon hospital admission for all non-surgical adult medical inpatients, and reassessed if clinical status, mobility, or hospital stay changes significantly."
      },
      {
        question: "What if a high-risk patient has a contraindication to anticoagulation?",
        answer: "If active major bleeding, severe thrombocytopenia (platelets < 50,000/µL), or acute intracranial hemorrhage precludes pharmacologic heparin/LMWH, intermittent pneumatic compression (IPC) devices or graduated compression stockings should be applied until bleeding risks subside."
      }
    ]
  },
  fr: {
    title: "Score de Padoue (Risque MTEV en Médecine)",
    subtitle: "Stratifie le risque thromboembolique veineux chez le patient hospitalisé en médecine pour guider la thromboprophylaxie",
    cancerLabel: "Cancer Actif",
    cancerDesc: "Métastases, cancer local ou chimio/radiothérapie dans les 6 derniers mois (+3 points)",
    prevVteLabel: "Antécédent de MTEV",
    prevVteDesc: "Antécédent documenté de TVP ou d'EP, hors thrombophlébite superficielle (+3 points)",
    mobilityLabel: "Mobilité Réduite",
    mobilityDesc: "Alitement avec autorisations toilettes pendant au moins 3 jours (+3 points)",
    thrombophiliaLabel: "Thrombophilie Connue",
    thrombophiliaDesc: "Déficit antithrombine/protéine C/S, facteur V Leiden, mutation prothrombine, SAPL (+3 points)",
    traumaLabel: "Traumatisme ou Chirurgie Récente (≤ 1 mois)",
    traumaDesc: "Chirurgie ou traumatisme majeur au cours des 4 dernières semaines (+2 points)",
    ageLabel: "Âge Avancé (≥ 70 ans)",
    ageDesc: "Patient âgé de 70 ans ou plus (+1 point)",
    heartRespLabel: "Insuffisance Cardiaque et/ou Respiratoire",
    heartRespDesc: "Insuffisance cardiaque décompensée (NYHA III/IV) ou insuffisance respiratoire sévère (+1 point)",
    amiStrokeLabel: "Infarctus Aigu du Myocarde ou AVC Ischémique",
    amiStrokeDesc: "Syndrome coronarien aigu ou infarctus cérébral récent (+1 point)",
    infectionLabel: "Infection Aiguë ou Affection Rhumatologique",
    infectionDesc: "Sepsis/infection aiguë ou poussée de connectivite/rhumatisme inflammatoire (+1 point)",
    obesityLabel: "Obésité (IMC ≥ 30 kg/m²)",
    obesityDesc: "Indice de masse corporelle ≥ 30 (+1 point)",
    hormoneLabel: "Traitement Hormonal en Cours",
    hormoneDesc: "Traitement hormonal substitutif, contraception œstroprogestative ou modulateurs des RE (+1 point)",
    yes: "Oui",
    no: "Non",
    resultTitle: "Score de Padoue & Recommandations de Prophylaxie",
    scoreLabel: "Score Total de Padoue",
    points: "points",
    lowRisk: "Score < 4 : Risque MTEV Faible (~0,3%)",
    lowRiskDesc: "Risque faible de maladie thromboembolique veineuse (~0,3% sans traitement). La thromboprophylaxie pharmacologique systématique n'est PAS indiquée selon les recommandations ACCP/CHEST, car le risque hémorragique surpasse le bénéfice. Privilégier le lever précoce.",
    highRisk: "Score ≥ 4 : Risque MTEV Élevé (~11,0%)",
    highRiskDesc: "Risque thromboembolique élevé (~11,0% sans prophylaxie). La thromboprophylaxie anticoagulante pharmacologique est FORTEMENT RECOMMANDÉE (ex. Enoxaparine 40 mg SC/j ou Daltéparine 5000 UI SC/j adaptée au rein) en l'absence de contre-indication hémorragique.",
    references: "Barbar S, et al. A risk assessment model for the identification of hospitalized medical patients at risk for venous thromboembolism: the Padua Prediction Score. J Thromb Haemost. 2010;8(11):2450-2457. Recommandations CHEST/ACCP.",
    faqs: [
      {
        question: "Quand calculer le score de Padoue ?",
        answer: "À l'admission hospitalière de tout patient adulte admis dans un service de médecine non chirurgicale, et à chaque modification notable de son autonomie ou de son état clinique."
      },
      {
        question: "Que faire si le patient à haut risque saigne ou a des plaquettes basses ?",
        answer: "En cas de contre-indication formelle aux anticoagulants (saignement actif, thrombopénie sévère < 50 000/µL), une prophylaxie mécanique (compression pneumatique intermittente ou bas de contention) doit être mise en place."
      }
    ]
  }
};

export default function PaduaPredictionScore({ lang }: { lang: LangCode }) {
  const t = translations[lang] || translations.en;

  const [cancer, setCancer] = useState<boolean>(false);
  const [prevVte, setPrevVte] = useState<boolean>(false);
  const [reducedMobility, setReducedMobility] = useState<boolean>(false);
  const [thrombophilia, setThrombophilia] = useState<boolean>(false);
  const [recentTrauma, setRecentTrauma] = useState<boolean>(false);
  const [ageOver70, setAgeOver70] = useState<boolean>(false);
  const [heartResp, setHeartResp] = useState<boolean>(false);
  const [amiStroke, setAmiStroke] = useState<boolean>(false);
  const [infection, setInfection] = useState<boolean>(false);
  const [obesity, setObesity] = useState<boolean>(false);
  const [hormonal, setHormonal] = useState<boolean>(false);

  const score = useMemo(() => {
    let pts = 0;
    if (cancer) pts += 3;
    if (prevVte) pts += 3;
    if (reducedMobility) pts += 3;
    if (thrombophilia) pts += 3;
    if (recentTrauma) pts += 2;
    if (ageOver70) pts += 1;
    if (heartResp) pts += 1;
    if (amiStroke) pts += 1;
    if (infection) pts += 1;
    if (obesity) pts += 1;
    if (hormonal) pts += 1;
    return pts;
  }, [cancer, prevVte, reducedMobility, thrombophilia, recentTrauma, ageOver70, heartResp, amiStroke, infection, obesity, hormonal]);

  const isHighRisk = score >= 4;

  useEffect(() => {
    trackCalculatorUsage('padua-score', lang, score);
  }, [score, isHighRisk, lang]);

  const exportInputs = {
    [t.cancerLabel]: cancer ? t.yes : t.no,
    [t.prevVteLabel]: prevVte ? t.yes : t.no,
    [t.mobilityLabel]: reducedMobility ? t.yes : t.no,
    [t.thrombophiliaLabel]: thrombophilia ? t.yes : t.no,
    [t.traumaLabel]: recentTrauma ? t.yes : t.no,
    [t.ageLabel]: ageOver70 ? t.yes : t.no,
    [t.heartRespLabel]: heartResp ? t.yes : t.no,
    [t.amiStrokeLabel]: amiStroke ? t.yes : t.no,
    [t.infectionLabel]: infection ? t.yes : t.no,
    [t.obesityLabel]: obesity ? t.yes : t.no,
    [t.hormoneLabel]: hormonal ? t.yes : t.no,
  };
  const toExportList = (obj: Record<string, any>) => Object.entries(obj).map(([label, value]) => ({ label, value: String(value) }));


  const exportResults = {
    [t.scoreLabel]: `${score} / 20 ${t.points}`,
    [t.resultTitle]: isHighRisk ? t.highRisk : t.lowRisk
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CalcPageSchemas
        name={t.title}
        description={t.subtitle}
        path="/padua-score"
        howToSteps={[
          "Step 1: Evaluate major risk factors (+3 each): cancer, prior VTE, reduced mobility ≥ 3 days, thrombophilia.",
          "Step 2: Check intermediate/minor factors: trauma/surgery (+2), age ≥ 70, cardiopulmonary failure, stroke, infection, BMI ≥ 30, hormones (+1 each).",
          "Step 3: Sum points. Score < 4 indicates low VTE risk. Score ≥ 4 mandates pharmacologic thromboprophylaxis."
        ]}
        faqs={t.faqs}
      />

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-cyan-50 dark:bg-cyan-950/60 rounded-xl text-cyan-600 dark:text-cyan-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t.title}</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1">{t.subtitle}</p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {[
            { id: 'cancer', label: t.cancerLabel, desc: t.cancerDesc, val: cancer, setVal: setCancer, pts: '+3' },
            { id: 'prevVte', label: t.prevVteLabel, desc: t.prevVteDesc, val: prevVte, setVal: setPrevVte, pts: '+3' },
            { id: 'mobility', label: t.mobilityLabel, desc: t.mobilityDesc, val: reducedMobility, setVal: setReducedMobility, pts: '+3' },
            { id: 'thrombophilia', label: t.thrombophiliaLabel, desc: t.thrombophiliaDesc, val: thrombophilia, setVal: setThrombophilia, pts: '+3' },
            { id: 'trauma', label: t.traumaLabel, desc: t.traumaDesc, val: recentTrauma, setVal: setRecentTrauma, pts: '+2' },
            { id: 'age', label: t.ageLabel, desc: t.ageDesc, val: ageOver70, setVal: setAgeOver70, pts: '+1' },
            { id: 'heartResp', label: t.heartRespLabel, desc: t.heartRespDesc, val: heartResp, setVal: setHeartResp, pts: '+1' },
            { id: 'amiStroke', label: t.amiStrokeLabel, desc: t.amiStrokeDesc, val: amiStroke, setVal: setAmiStroke, pts: '+1' },
            { id: 'infection', label: t.infectionLabel, desc: t.infectionDesc, val: infection, setVal: setInfection, pts: '+1' },
            { id: 'obesity', label: t.obesityLabel, desc: t.obesityDesc, val: obesity, setVal: setObesity, pts: '+1' },
            { id: 'hormone', label: t.hormoneLabel, desc: t.hormoneDesc, val: hormonal, setVal: setHormonal, pts: '+1' },
          ].map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors gap-3">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-base">
                  {item.label} <span className="text-xs text-cyan-600 dark:text-cyan-400 font-bold">({item.pts})</span>
                </p>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => item.setVal(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all min-h-[44px] ${
                    !item.val
                      ? 'bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-white'
                      : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {t.no}
                </button>
                <button
                  type="button"
                  onClick={() => item.setVal(true)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all min-h-[44px] ${
                    item.val
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {t.yes}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Results Box */}
        <div className={`mt-8 p-6 rounded-2xl border ${
          !isHighRisk
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.resultTitle}</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{score}</span>
                <span className="text-lg text-slate-600 dark:text-slate-300 font-medium">/ 20 {t.points}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 ${
                !isHighRisk
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300'
              }`}>
                {!isHighRisk ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                {!isHighRisk ? "LOW VTE RISK (< 4)" : "HIGH VTE RISK (≥ 4)"}
              </span>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {!isHighRisk ? t.lowRiskDesc : t.highRiskDesc}
          </p>

          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <ClinicalExportButton
              calculatorName="Padua Prediction Score"
              inputs={toExportList(exportInputs)}
              results={toExportList(exportResults)}
              formula="Padua Score: Cancer (3), Prior VTE (3), Reduced mobility (3), Thrombophilia (3), Trauma/surgery (2), Age≥70 (1), Heart/resp failure (1), MI/stroke (1), Infection (1), Obesity (1), Hormones (1)"
              disclaimer="Clinical decision tool for medical inpatients. Score ≥ 4 indicates pharmacological thromboprophylaxis unless bleeding contraindication exists."
              references={t.references}
              lang={lang}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          {lang === 'fr' ? "Questions Fréquentes (FAQ)" : "Frequently Asked Questions"}
        </h2>
        <div className="space-y-4">
          {t.faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-1">{faq.question}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <MedicalReviewerCard reviewer={REVIEWER_INTERNAL_MEDICINE} lang={lang} />
    </div>
  );
}
