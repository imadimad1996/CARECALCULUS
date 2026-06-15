import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';
import ClinicalExportButton from '../components/ClinicalExportButton';

const translations: Translations = {
  en: {
    title: "PHQ-9 Depression Detection",
    subtitle: "Patient Health Questionnaire for depression screening",
    q1: "1. Little interest or pleasure in doing things",
    q2: "2. Feeling down, depressed, or hopeless",
    q3: "3. Trouble falling or staying asleep, or sleeping too much",
    q4: "4. Feeling tired or having little energy",
    q5: "5. Poor appetite or overeating",
    q6: "6. Feeling bad about yourself - or that you are a failure",
    q7: "7. Trouble concentrating on things",
    q8: "8. Moving or speaking so slowly that other people could have noticed? Or the opposite",
    q9: "9. Thoughts that you would be better off dead, or of hurting yourself",
    a0: "Not at all (0)",
    a1: "Several days (1)",
    a2: "More than half the days (2)",
    a3: "Nearly every day (3)",
    result: "PHQ-9 Score",
    formula: "Sum of 9 items (0-27)",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "0-4: Minimal depression. 5-9: Mild depression. 10-14: Moderate depression. 15-19: Moderately severe depression. 20-27: Severe depression.",
    references: "References: Kroenke K, et al. The PHQ-9: validity of a brief depression severity measure.",
    cat0: "Minimal Depression (0-4)",
    cat1: "Mild Depression (5-9)",
    cat2: "Moderate Depression (10-14)",
    cat3: "Moderately Severe (15-19)",
    cat4: "Severe Depression (20-27)"
  },
  fr: {
    title: "Questionnaire PHQ-9 (Dépression)",
    subtitle: "Évaluation de la sévérité de la dépression",
    q1: "1. Peu d'intérêt ou de plaisir à faire les choses",
    q2: "2. Être triste, déprimé(e) ou désespéré(e)",
    q3: "3. Difficultés à s'endormir, à rester endormi(e), ou trop dormir",
    q4: "4. Se sentir fatigué(e) ou avoir peu d'énergie",
    q5: "5. Manque d'appétit ou manger trop",
    q6: "6. Mauvaise opinion de vous-même - ou sentiment d'être un(e) raté(e)",
    q7: "7. Difficultés à se concentrer",
    q8: "8. Bouger ou parler si lentement que les autres auraient pu le remarquer? Ou au contraire",
    q9: "9. Pensées que vous seriez mieux mort(e) ou de vous faire du mal",
    a0: "Jamais (0)",
    a1: "Plusieurs jours (1)",
    a2: "Plus de la moitié du temps (2)",
    a3: "Presque tous les jours (3)",
    result: "Score PHQ-9",
    formula: "Somme des 9 éléments (0-27)",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "0-4 : Dépression minime. 5-9 : Légère. 10-14 : Modérée. 15-19 : Modérément sévère. 20-27 : Sévère.",
    references: "Références: Kroenke K, et al.",
    cat0: "Dépression Minime (0-4)",
    cat1: "Dépression Légère (5-9)",
    cat2: "Dépression Modérée (10-14)",
    cat3: "Modérément Sévère (15-19)",
    cat4: "Dépression Sévère (20-27)"
  },
  ar: {
    title: "استبيان صحة المريض PHQ-9",
    subtitle: "فحص وتقييم شدة الاكتئاب",
    q1: "1. قلة الاهتمام أو انعدام المتعة في القيام بالأشياء",
    q2: "2. الشعور بالإحباط، الاكتئاب، أو اليأس",
    q3: "3. صعوبة في النوم أو البقاء نائماً، أو النوم لفترات طويلة جداً",
    q4: "4. الشعور بالتعب أو انخفاض الطاقة",
    q5: "5. ضعف الشهية أو الإفراط في الأكل",
    q6: "6. الشعور بالسوء تجاه نفسك - أو أنك فاشل",
    q7: "7. صعوبة في التركيز على الأشياء",
    q8: "8. التحدث أو التحرك ببطء شديد لاحظه الآخرون؟ أو العكس (تململ)",
    q9: "9. أفكار بأنه من الأفضل لو كنت ميتاً، أو أفكار لإيذاء نفسك",
    a0: "إطلاقاً (0)",
    a1: "في بعض الأيام (1)",
    a2: "أكثر من نصف الأيام (2)",
    a3: "كل يوم تقريباً (3)",
    result: "نتيجة PHQ-9",
    formula: "مجموع 9 أسئلة (0-27)",
    clinicalTitle: "التفسير السريري",
    clinicalText: "0-4: اكتئاب طفيف. 5-9: اكتئاب خفيف. 10-14: اكتئاب معتدل. 15-19: شديد نسبياً. 20-27: اكتئاب شديد.",
    references: "المراجع: Kroenke K, et al.",
    cat0: "اكتئاب طفيف (0-4)",
    cat1: "اكتئاب خفيف (5-9)",
    cat2: "اكتئاب معتدل (10-14)",
    cat3: "اكتئاب شديد نسبياً (15-19)",
    cat4: "اكتئاب شديد (20-27)"
  }
};

const questions = [ 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9' ] as const;
const options = [ 'a0', 'a1', 'a2', 'a3' ] as const;

export default function Phq9Score({ lang }: { lang: LangCode }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const currentText = translations[lang];
  const isRtl = lang === 'ar';

  const handleAnswer = (q: string, value: number) => {
    setAnswers(prev => ({ ...prev, [q]: value }));
  };

  const scoreValue = useMemo(() => {
    let total = 0;
    for (const key of questions) {
      total += answers[key] || 0;
    }
    return total;
  }, [answers]);

  useEffect(() => {
    if (scoreValue > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('phq9-score', lang, scoreValue);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [scoreValue, lang]);

  const category = useMemo(() => {
    if (scoreValue >= 20) return { label: currentText.cat4, bg: 'bg-red-500/10 border-red-500/20', color: 'text-red-500' };
    if (scoreValue >= 15) return { label: currentText.cat3, bg: 'bg-orange-500/10 border-orange-500/20', color: 'text-orange-500' };
    if (scoreValue >= 10) return { label: currentText.cat2, bg: 'bg-amber-500/10 border-amber-500/20', color: 'text-amber-500' };
    if (scoreValue >= 5) return { label: currentText.cat1, bg: 'bg-blue-500/10 border-blue-500/20', color: 'text-blue-500' };
    return { label: currentText.cat0, bg: 'bg-emerald-500/10 border-emerald-500/20', color: 'text-emerald-500' };
  }, [scoreValue, currentText]);

  return (
    <>
      <div className="max-w-3xl mb-12">
        <h1 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3 ${isRtl ? 'leading-normal' : ''}`}>
          {currentText.title}
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-gray-950/5 p-6 md:p-8 space-y-8">
            
            {questions.map((q, idx) => (
              <div key={idx} className="space-y-3 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                <p className="text-sm font-medium text-gray-800">{currentText[q]}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => handleAnswer(q, optIdx)}
                      className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all text-left md:text-center ${answers[q] === optIdx ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                    >
                      {currentText[opt]}
                    </button>
                  ))}
                </div>
              </div>
            ))}

          </div>
        </div>

        <div className="lg:col-span-4 relative">
          <div className="sticky top-28 bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 flex flex-col justify-between p-8 min-h-[320px]">
            <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                {currentText.result}
              </span>
              
              <div className="flex items-baseline gap-2 tabular-nums">
                <span className="text-7xl font-bold tracking-tighter transition-all duration-300">
                  {scoreValue}
                </span>
                <span className="text-xl font-medium text-gray-400">/ 27</span>
              </div>
            </div>

            <div className="relative z-10 mt-10">
              <div className={`p-4 rounded-xl border flex justify-between items-center transition-all ${category.bg} ${category.color}`}>
                <div className="font-semibold text-sm">
                  {category.label}
                </div>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={questions.map((q, idx) => ({
                  label: `Q${idx + 1}`,
                  value: answers[q] !== undefined ? `${answers[q]} - ${currentText['a' + answers[q]]}` : 'Not answered'
                }))}
                results={[
                  { label: currentText.result, value: `${scoreValue} / 27` },
                  { label: 'Depression Severity', value: category.label }
                ]}
                formula={currentText.formula}
                disclaimer={currentText.clinicalText}
                references={currentText.references}
                lang={lang}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-10 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-8 text-xs text-gray-400">
          <span className="font-semibold text-gray-500">{layoutTranslations[lang].reviewedBy}</span>
          <span>&middot;</span>
          <span>{layoutTranslations[lang].specialists}</span>
          <span>&middot;</span>
          <span>{layoutTranslations[lang].updated}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{currentText.clinicalTitle}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{currentText.clinicalText}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div className="w-full">
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{layoutTranslations[lang].mathMetric}</h2>
              <div className="font-mono text-xs bg-gray-100 text-gray-700 py-2 px-3 rounded-md border border-gray-200 uppercase tracking-tight" dir="ltr">
                {currentText.formula}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{layoutTranslations[lang].evidenceLit}</h2>
              <p className="text-gray-500 text-xs leading-relaxed italic">{currentText.references}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
