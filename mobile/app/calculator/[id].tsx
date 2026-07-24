import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import { ResultCard } from '../../src/components/ResultCard';
import { NumericInput, RadioGroup } from '../../src/components/CalculatorInput';
import { CLINICAL_CALCULATORS_CATALOG } from '../../src/core/calculators';
import {
  calculateMAP,
  calculateGCS,
  calculateQSOFA,
  calculateCURB65,
  calculateMELD,
  calculateCKDEPI2021,
  calculateCHA2DS2VASc,
  calculateWellsPE,
  calculateAnionGap,
  calculateSodiumCorrection,
  calculatePFRatio,
  calculateCockcroftGault,
  calculateHASBLED,
  calculateHEARTScore,
  calculateNIHSS,
} from '../../src/core/formulas';
import {
  ureaToBun,
  scrUmolLToMgDl,
  biliUmolLToMgDl,
  glucoseMmolLToMgDl,
  lbsToKg,
} from '../../src/core/units';
import { useAppStore } from '../../src/store/useAppStore';
import { useQueueStore } from '../../src/store/useQueueStore';
import { ChevronLeft } from 'lucide-react-native';

export default function CalculatorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const unitSystem = useAppStore((state) => state.unitSystem);
  const addRecord = useQueueStore((state) => state.addRecord);

  const calcMeta = CLINICAL_CALCULATORS_CATALOG.find((c) => c.id === id) || CLINICAL_CALCULATORS_CATALOG[0];

  // 1. MAP State
  const [sbp, setSbp] = useState(120);
  const [dbp, setDbp] = useState(80);

  // 2. GCS State
  const [gcsEye, setGcsEye] = useState(4);
  const [gcsVerbal, setGcsVerbal] = useState(5);
  const [gcsMotor, setGcsMotor] = useState(6);

  // 3. qSOFA State
  const [qsofaRr, setQsofaRr] = useState(20);
  const [qsofaAms, setQsofaAms] = useState(false);
  const [qsofaSbp, setQsofaSbp] = useState(110);

  // 4. CURB-65 State
  const [curbConfusion, setCurbConfusion] = useState(false);
  const [curbBun, setCurbBun] = useState(15);
  const [curbRr, setCurbRr] = useState(20);
  const [curbSbp, setCurbSbp] = useState(120);
  const [curbDbp, setCurbDbp] = useState(80);
  const [curbAge, setCurbAge] = useState(55);

  // 5. MELD State
  const [meldBili, setMeldBili] = useState(1.2);
  const [meldCr, setMeldCr] = useState(1.0);
  const [meldInr, setMeldInr] = useState(1.1);

  // 6. CKD-EPI State
  const [ckdCr, setCkdCr] = useState(1.0);
  const [ckdAge, setCkdAge] = useState(60);
  const [ckdSex, setCkdSex] = useState<'male' | 'female'>('male');

  // 7. CHA₂DS₂-VASc State
  const [chaChf, setChaChf] = useState(false);
  const [chaHtn, setChaHtn] = useState(false);
  const [chaAge, setChaAge] = useState(68);
  const [chaDiabetes, setChaDiabetes] = useState(false);
  const [chaStroke, setChaStroke] = useState(false);
  const [chaVascular, setChaVascular] = useState(false);
  const [chaSex, setChaSex] = useState<'male' | 'female'>('male');

  // 8. Wells PE State
  const [wellsDvt, setWellsDvt] = useState(false);
  const [wellsPeLikely, setWellsPeLikely] = useState(false);
  const [wellsHr100, setWellsHr100] = useState(false);
  const [wellsSurgery, setWellsSurgery] = useState(false);
  const [wellsPrev, setWellsPrev] = useState(false);
  const [wellsHemoptysis, setWellsHemoptysis] = useState(false);
  const [wellsMalignancy, setWellsMalignancy] = useState(false);

  // 9. Serum Anion Gap State
  const [agNa, setAgNa] = useState(140);
  const [agCl, setAgCl] = useState(104);
  const [agHco3, setAgHco3] = useState(24);
  const [agAlbumin, setAgAlbumin] = useState(4.0);

  // 10. Sodium Correction State
  const [naMeasured, setNaMeasured] = useState(130);
  const [naGlucose, setNaGlucose] = useState(350);

  // 11. P/F Ratio State
  const [pfPao2, setPfPao2] = useState(85);
  const [pfFio2, setPfFio2] = useState(50);

  // 12. Cockcroft-Gault CrCl State
  const [crclAge, setCrclAge] = useState(65);
  const [crclWeight, setCrclWeight] = useState(70);
  const [crclCr, setCrclCr] = useState(1.2);
  const [crclSex, setCrclSex] = useState<'male' | 'female'>('male');

  // 13. HAS-BLED State
  const [hbHtn, setHbHtn] = useState(false);
  const [hbRenal, setHbRenal] = useState(false);
  const [hbLiver, setHbLiver] = useState(false);
  const [hbStroke, setHbStroke] = useState(false);
  const [hbBleeding, setHbBleeding] = useState(false);
  const [hbInr, setHbInr] = useState(false);
  const [hbElderly, setHbElderly] = useState(false);
  const [hbDrugs, setHbDrugs] = useState(false);
  const [hbAlcohol, setHbAlcohol] = useState(false);

  // 14. HEART Score State
  const [heartHistory, setHeartHistory] = useState<0 | 1 | 2>(1);
  const [heartEcg, setHeartEcg] = useState<0 | 1 | 2>(0);
  const [heartAge, setHeartAge] = useState<0 | 1 | 2>(1);
  const [heartRisk, setHeartRisk] = useState<0 | 1 | 2>(1);
  const [heartTroponin, setHeartTroponin] = useState<0 | 1 | 2>(0);

  // 15. NIHSS State
  const [nihLoc, setNihLoc] = useState(0);
  const [nihGaze, setNihGaze] = useState(0);
  const [nihVisual, setNihVisual] = useState(0);
  const [nihFacial, setNihFacial] = useState(0);
  const [nihMotorArmL, setNihMotorArmL] = useState(0);
  const [nihMotorArmR, setNihMotorArmR] = useState(0);
  const [nihMotorLegL, setNihMotorLegL] = useState(0);
  const [nihMotorLegR, setNihMotorLegR] = useState(0);
  const [nihLanguage, setNihLanguage] = useState(0);
  const [nihDysarthria, setNihDysarthria] = useState(0);

  // Shift Queue Modal state
  const [bedNum, setBedNum] = useState('');
  const [initials, setInitials] = useState('');
  const [showQueueModal, setShowQueueModal] = useState(false);

  // Output variables
  let scoreValue: string | number = '';
  let interpretation = '';
  let severity: 'normal' | 'warning' | 'emergency' = 'normal';
  let dotPhrase = '';

  const isMetric = unitSystem === 'Metric (SI)';

  if (calcMeta.id === 'map') {
    const res = calculateMAP({ sbp, dbp });
    scoreValue = `${res.map} mmHg`;
    interpretation = res.interpretation;
    severity = res.severity;
    dotPhrase = `.MAP - Mean Arterial Pressure: ${res.map} mmHg (SBP: ${sbp}, DBP: ${dbp}). Interpretation: ${res.interpretation}`;
  } else if (calcMeta.id === 'gcs') {
    const res = calculateGCS({ eye: gcsEye, verbal: gcsVerbal, motor: gcsMotor });
    scoreValue = `${res.score} / 15 (${res.breakdown})`;
    interpretation = res.interpretation;
    severity = res.severity;
    dotPhrase = `.GCS - Glasgow Coma Scale: ${res.score}/15 (${res.breakdown}). Interpretation: ${res.interpretation}`;
  } else if (calcMeta.id === 'qsofa') {
    const res = calculateQSOFA({ rr: qsofaRr, alteredMentalStatus: qsofaAms, sbp: qsofaSbp });
    scoreValue = `${res.score} / 3`;
    interpretation = res.interpretation;
    severity = res.severity;
    dotPhrase = `.QSOFA - Quick SOFA Score: ${res.score}/3. Risk: ${res.highRisk ? 'HIGH RISK' : 'LOW RISK'}. Interpretation: ${res.interpretation}`;
  } else if (calcMeta.id === 'curb65') {
    const bunMg = isMetric ? ureaToBun(curbBun) : curbBun;
    const res = calculateCURB65({ confusion: curbConfusion, bunMgDl: bunMg, rr: curbRr, sbp: curbSbp, dbp: curbDbp, age: curbAge });
    scoreValue = `${res.score} / 5 (Mortality ${res.mortality})`;
    interpretation = `${res.recommendation} 30-Day Mortality Estimate: ${res.mortality}.`;
    severity = res.severity;
    dotPhrase = `.CURB65 - CURB-65 Pneumonia Score: ${res.score}/5. Mortality: ${res.mortality}. Rec: ${res.recommendation}`;
  } else if (calcMeta.id === 'meld') {
    const biliMg = isMetric ? biliUmolLToMgDl(meldBili) : meldBili;
    const crMg = isMetric ? scrUmolLToMgDl(meldCr) : meldCr;
    const res = calculateMELD({ bilirubinMgDl: biliMg, creatinineMgDl: crMg, inr: meldInr });
    scoreValue = `${res.meldScore} Points`;
    interpretation = res.interpretation;
    severity = res.severity;
    dotPhrase = `.MELD - MELD Score: ${res.meldScore} points. Bili: ${meldBili}, Cr: ${meldCr}, INR: ${meldInr}. 3-Mo Mortality: ${res.threeMonthMortality}`;
  } else if (calcMeta.id === 'ckdepi') {
    const crMg = isMetric ? scrUmolLToMgDl(ckdCr) : ckdCr;
    const res = calculateCKDEPI2021({ scrMgDl: crMg, age: ckdAge, sex: ckdSex });
    scoreValue = `${res.egfr} mL/min/1.73m²`;
    interpretation = res.interpretation;
    severity = res.severity;
    dotPhrase = `.CKDEPI - eGFR (CKD-EPI 2021): ${res.egfr} mL/min/1.73m². Stage: ${res.stage}`;
  } else if (calcMeta.id === 'cha2ds2vasc') {
    const res = calculateCHA2DS2VASc({
      chf: chaChf,
      hypertension: chaHtn,
      age: chaAge,
      diabetes: chaDiabetes,
      strokeTia: chaStroke,
      vascularDisease: chaVascular,
      sex: chaSex,
    });
    scoreValue = `${res.score} Points`;
    interpretation = `Annual Stroke Risk: ${res.strokeRiskAnnual}. ${res.recommendation}`;
    severity = res.severity;
    dotPhrase = `.CHA2DS2VASC - CHA₂DS₂-VASc Score: ${res.score} points. Annual stroke risk: ${res.strokeRiskAnnual}. Rec: ${res.recommendation}`;
  } else if (calcMeta.id === 'wells-pe') {
    const res = calculateWellsPE({
      clinicalDvtSigns: wellsDvt,
      peLikely: wellsPeLikely,
      heartRateOver100: wellsHr100,
      immobilizationOrSurgery: wellsSurgery,
      previousDvtPe: wellsPrev,
      hemoptysis: wellsHemoptysis,
      malignancy: wellsMalignancy,
    });
    scoreValue = `${res.score} Points (${res.peProbability})`;
    interpretation = `${res.recommendation} (PE Probability: ${res.peProbability})`;
    severity = res.severity;
    dotPhrase = `.WELLSPE - Wells Criteria for PE: ${res.score} pts. Risk: ${res.peProbability}. Rec: ${res.recommendation}`;
  } else if (calcMeta.id === 'anion-gap') {
    const res = calculateAnionGap({ na: agNa, cl: agCl, hco3: agHco3, albumin: agAlbumin });
    scoreValue = res.correctedAnionGap !== undefined ? `${res.correctedAnionGap} mEq/L (Corr)` : `${res.anionGap} mEq/L`;
    interpretation = res.interpretation;
    severity = res.severity;
    dotPhrase = `.ANIONGAP - Serum Anion Gap: ${res.anionGap} mEq/L ${res.correctedAnionGap ? `(Albumin-corrected: ${res.correctedAnionGap} mEq/L)` : ''}. Interpretation: ${res.interpretation}`;
  } else if (calcMeta.id === 'sodium-correction') {
    const glucMg = isMetric ? glucoseMmolLToMgDl(naGlucose) : naGlucose;
    const res = calculateSodiumCorrection({ measuredNa: naMeasured, glucoseMgDl: glucMg });
    scoreValue = `${res.correctedNaStandard} mEq/L`;
    interpretation = `${res.interpretation} (Standard 1.6 factor: ${res.correctedNaStandard} mEq/L; Katz 2.4 factor: ${res.correctedNaKatz} mEq/L)`;
    severity = res.severity;
    dotPhrase = `.SODIUMCORR - Corrected Sodium for Hyperglycemia: ${res.correctedNaStandard} mEq/L (Measured Na: ${naMeasured}, Glucose: ${naGlucose}). Interpretation: ${res.interpretation}`;
  } else if (calcMeta.id === 'pf-ratio') {
    const res = calculatePFRatio({ pao2: pfPao2, fio2Percent: pfFio2 });
    scoreValue = `${res.pfRatio} mmHg`;
    interpretation = `${res.ardsCategory}. ${res.interpretation}`;
    severity = res.severity;
    dotPhrase = `.PFRATIO - PaO2/FiO2 Ratio: ${res.pfRatio} mmHg (PaO2: ${pfPao2}, FiO2: ${pfFio2}%). Classification: ${res.ardsCategory}`;
  } else if (calcMeta.id === 'crcl') {
    const weightKg = isMetric ? crclWeight : lbsToKg(crclWeight);
    const crMg = isMetric ? scrUmolLToMgDl(crclCr) : crclCr;
    const res = calculateCockcroftGault({ age: crclAge, weightKg, scrMgDl: crMg, sex: crclSex });
    scoreValue = `${res.crcl} mL/min`;
    interpretation = res.interpretation;
    severity = res.severity;
    dotPhrase = `.CRCL - Cockcroft-Gault CrCl: ${res.crcl} mL/min (Age: ${crclAge}, Wt: ${crclWeight} ${isMetric ? 'kg' : 'lbs'}, Cr: ${crclCr}). Interpretation: ${res.interpretation}`;
  } else if (calcMeta.id === 'has-bled') {
    const res = calculateHASBLED({
      hypertension: hbHtn,
      abnormalRenal: hbRenal,
      abnormalLiver: hbLiver,
      strokeHistory: hbStroke,
      bleedingHistory: hbBleeding,
      labileInr: hbInr,
      elderlyAge: hbElderly,
      drugsConcomitant: hbDrugs,
      alcoholExcess: hbAlcohol,
    });
    scoreValue = `${res.score} Points`;
    interpretation = `Annual Bleeding Risk: ${res.annualBleedingRisk}. ${res.recommendation}`;
    severity = res.severity;
    dotPhrase = `.HASBLED - HAS-BLED Bleeding Risk: ${res.score} points. Annual bleeding risk: ${res.annualBleedingRisk}. Rec: ${res.recommendation}`;
  } else if (calcMeta.id === 'heart') {
    const res = calculateHEARTScore({
      history: heartHistory,
      ecg: heartEcg,
      age: heartAge,
      riskFactors: heartRisk,
      troponin: heartTroponin,
    });
    scoreValue = `${res.score} Points`;
    interpretation = `MACE Risk: ${res.maceRisk}. ${res.recommendation}`;
    severity = res.severity;
    dotPhrase = `.HEART - HEART Score for Chest Pain: ${res.score} points. MACE risk: ${res.maceRisk}. Rec: ${res.recommendation}`;
  } else if (calcMeta.id === 'nihss') {
    const res = calculateNIHSS({
      loc: nihLoc,
      locQuestions: 0,
      locCommands: 0,
      bestGaze: nihGaze,
      visual: nihVisual,
      facialPalsy: nihFacial,
      motorArmLeft: nihMotorArmL,
      motorArmRight: nihMotorArmR,
      motorLegLeft: nihMotorLegL,
      motorLegRight: nihMotorLegR,
      limbAtaxia: 0,
      sensory: 0,
      bestLanguage: nihLanguage,
      dysarthria: nihDysarthria,
      extinction: 0,
    });
    scoreValue = `${res.score} Points`;
    interpretation = `${res.strokeSeverity}. ${res.interpretation}`;
    severity = res.severity;
    dotPhrase = `.NIHSS - NIH Stroke Scale: ${res.score} points. Severity: ${res.strokeSeverity}. Interpretation: ${res.interpretation}`;
  } else {
    const res = calculateMAP({ sbp: 120, dbp: 80 });
    scoreValue = `${res.map} mmHg`;
    interpretation = res.interpretation;
    severity = res.severity;
    dotPhrase = `.MAP: ${res.map} mmHg`;
  }

  const handleSaveToQueue = async () => {
    if (!bedNum || !initials) {
      Alert.alert('Bed & Initials Required', 'Please enter Bed Number and Patient Initials to add to Shift Queue.');
      return;
    }
    const success = await addRecord({
      bedNumber: bedNum,
      patientInitials: initials,
      calculatorId: calcMeta.id,
      calculatorTitle: calcMeta.title,
      calculatedScore: String(scoreValue),
      interpretation,
      unitStandard: unitSystem,
    });
    if (success) {
      setShowQueueModal(false);
      setBedNum('');
      setInitials('');
      Alert.alert('Added to Queue', `Patient ${initials} (Bed ${bedNum}) logged to SQLite Shift Queue.`);
    }
  };

  return (
    <View className="flex-1 bg-slate-950">
      <Header title={calcMeta.abbreviation} />

      {/* Navigation Top Bar */}
      <View className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center space-x-1"
        >
          <ChevronLeft size={20} color="#14b8a6" />
          <Text className="text-brand-400 text-sm font-bold">Back</Text>
        </TouchableOpacity>
        <Text className="text-white text-sm font-bold">{calcMeta.title}</Text>
        <View className="w-6" />
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Result Card */}
        <ResultCard
          scoreTitle={calcMeta.title}
          scoreValue={scoreValue}
          interpretation={interpretation}
          severity={severity}
          guidelineReference={calcMeta.guidelineReference}
          dotPhrase={dotPhrase}
          onAddToQueue={() => setShowQueueModal(true)}
        />

        {/* Modal / Panel for Bedside Patient Queue Inputs */}
        {showQueueModal ? (
          <View className="bg-slate-850 p-4 rounded-2xl border border-brand-500 mb-5">
            <Text className="text-white text-sm font-bold mb-2">Log Patient to Shift Queue</Text>
            <View className="flex-row space-x-3 mb-3">
              <View className="flex-1">
                <Text className="text-slate-400 text-xs mb-1">Bed Number</Text>
                <TextInput
                  value={bedNum}
                  onChangeText={setBedNum}
                  placeholder="e.g. 12B"
                  placeholderTextColor="#64748b"
                  className="bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 font-bold"
                />
              </View>
              <View className="flex-1">
                <Text className="text-slate-400 text-xs mb-1">Patient Initials</Text>
                <TextInput
                  value={initials}
                  onChangeText={setInitials}
                  placeholder="e.g. J.D."
                  placeholderTextColor="#64748b"
                  className="bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 font-bold"
                />
              </View>
            </View>
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={() => setShowQueueModal(false)}
                className="flex-1 bg-slate-800 py-2 rounded-xl items-center"
              >
                <Text className="text-slate-400 text-xs font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveToQueue}
                className="flex-1 bg-brand-600 py-2 rounded-xl items-center"
              >
                <Text className="text-white text-xs font-bold">Save Record</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* Dynamic Inputs Form based on Calculator ID */}
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
          Clinical Parameters & Inputs ({unitSystem})
        </Text>

        {calcMeta.id === 'map' && (
          <>
            <NumericInput label="Systolic BP (SBP)" value={sbp} onChange={setSbp} unit="mmHg" />
            <NumericInput label="Diastolic BP (DBP)" value={dbp} onChange={setDbp} unit="mmHg" />
          </>
        )}

        {calcMeta.id === 'gcs' && (
          <>
            <RadioGroup
              label="Eye Opening (E)"
              selectedValue={gcsEye}
              onSelect={setGcsEye}
              options={[
                { label: 'Spontaneous (E4)', value: 4, pts: 4 },
                { label: 'To Sound / Speech (E3)', value: 3, pts: 3 },
                { label: 'To Pressure / Pain (E2)', value: 2, pts: 2 },
                { label: 'None (E1)', value: 1, pts: 1 },
              ]}
            />
            <RadioGroup
              label="Verbal Response (V)"
              selectedValue={gcsVerbal}
              onSelect={setGcsVerbal}
              options={[
                { label: 'Oriented (V5)', value: 5, pts: 5 },
                { label: 'Confused (V4)', value: 4, pts: 4 },
                { label: 'Inappropriate Words (V3)', value: 3, pts: 3 },
                { label: 'Incomprehensible Sounds (V2)', value: 2, pts: 2 },
                { label: 'None (V1)', value: 1, pts: 1 },
              ]}
            />
            <RadioGroup
              label="Motor Response (M)"
              selectedValue={gcsMotor}
              onSelect={setGcsMotor}
              options={[
                { label: 'Obeys Commands (M6)', value: 6, pts: 6 },
                { label: 'Localizes Pain (M5)', value: 5, pts: 5 },
                { label: 'Normal Flexion / Withdrawal (M4)', value: 4, pts: 4 },
                { label: 'Abnormal Flexion / Decorticate (M3)', value: 3, pts: 3 },
                { label: 'Extension / Decerebrate (M2)', value: 2, pts: 2 },
                { label: 'None (M1)', value: 1, pts: 1 },
              ]}
            />
          </>
        )}

        {calcMeta.id === 'qsofa' && (
          <>
            <NumericInput label="Respiratory Rate" value={qsofaRr} onChange={setQsofaRr} unit="breaths/min" />
            <NumericInput label="Systolic BP (SBP)" value={qsofaSbp} onChange={setQsofaSbp} unit="mmHg" />
            <RadioGroup
              label="Altered Mental Status (GCS < 15)"
              selectedValue={qsofaAms}
              onSelect={setQsofaAms}
              options={[
                { label: 'Yes (Altered consciousness)', value: true, pts: 1 },
                { label: 'No (Alert and oriented)', value: false, pts: 0 },
              ]}
            />
          </>
        )}

        {calcMeta.id === 'curb65' && (
          <>
            <NumericInput label="Patient Age" value={curbAge} onChange={setCurbAge} unit="years" />
            <NumericInput
              label={isMetric ? 'Serum Urea' : 'BUN (Blood Urea Nitrogen)'}
              value={curbBun}
              onChange={setCurbBun}
              unit={isMetric ? 'mmol/L' : 'mg/dL'}
            />
            <NumericInput label="Respiratory Rate" value={curbRr} onChange={setCurbRr} unit="breaths/min" />
            <NumericInput label="Systolic BP" value={curbSbp} onChange={setCurbSbp} unit="mmHg" />
            <NumericInput label="Diastolic BP" value={curbDbp} onChange={setCurbDbp} unit="mmHg" />
            <RadioGroup
              label="Acute Confusion"
              selectedValue={curbConfusion}
              onSelect={setCurbConfusion}
              options={[
                { label: 'Present (New onset disorientation)', value: true, pts: 1 },
                { label: 'Absent', value: false, pts: 0 },
              ]}
            />
          </>
        )}

        {calcMeta.id === 'meld' && (
          <>
            <NumericInput
              label="Total Bilirubin"
              value={meldBili}
              onChange={setMeldBili}
              unit={isMetric ? 'µmol/L' : 'mg/dL'}
            />
            <NumericInput
              label="Serum Creatinine"
              value={meldCr}
              onChange={setMeldCr}
              unit={isMetric ? 'µmol/L' : 'mg/dL'}
            />
            <NumericInput label="INR" value={meldInr} onChange={setMeldInr} unit="" />
          </>
        )}

        {calcMeta.id === 'ckdepi' && (
          <>
            <NumericInput
              label="Serum Creatinine"
              value={ckdCr}
              onChange={setCkdCr}
              unit={isMetric ? 'µmol/L' : 'mg/dL'}
            />
            <NumericInput label="Age" value={ckdAge} onChange={setCkdAge} unit="years" />
            <RadioGroup
              label="Biological Sex"
              selectedValue={ckdSex}
              onSelect={setCkdSex}
              options={[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
              ]}
            />
          </>
        )}

        {calcMeta.id === 'cha2ds2vasc' && (
          <>
            <NumericInput label="Age" value={chaAge} onChange={setChaAge} unit="years" />
            <RadioGroup
              label="Biological Sex"
              selectedValue={chaSex}
              onSelect={setChaSex}
              options={[
                { label: 'Female', value: 'female', pts: 1 },
                { label: 'Male', value: 'male', pts: 0 },
              ]}
            />
            <RadioGroup
              label="Congestive Heart Failure History"
              selectedValue={chaChf}
              onSelect={setChaChf}
              options={[
                { label: 'Yes', value: true, pts: 1 },
                { label: 'No', value: false, pts: 0 },
              ]}
            />
            <RadioGroup
              label="Hypertension History"
              selectedValue={chaHtn}
              onSelect={setChaHtn}
              options={[
                { label: 'Yes', value: true, pts: 1 },
                { label: 'No', value: false, pts: 0 },
              ]}
            />
            <RadioGroup
              label="Diabetes Mellitus"
              selectedValue={chaDiabetes}
              onSelect={setChaDiabetes}
              options={[
                { label: 'Yes', value: true, pts: 1 },
                { label: 'No', value: false, pts: 0 },
              ]}
            />
            <RadioGroup
              label="Prior Stroke / TIA / Thromboembolism"
              selectedValue={chaStroke}
              onSelect={setChaStroke}
              options={[
                { label: 'Yes', value: true, pts: 2 },
                { label: 'No', value: false, pts: 0 },
              ]}
            />
            <RadioGroup
              label="Vascular Disease (Prior MI, PAD, Aortic plaque)"
              selectedValue={chaVascular}
              onSelect={setChaVascular}
              options={[
                { label: 'Yes', value: true, pts: 1 },
                { label: 'No', value: false, pts: 0 },
              ]}
            />
          </>
        )}

        {calcMeta.id === 'wells-pe' && (
          <>
            <RadioGroup
              label="Clinical Signs / Symptoms of DVT"
              selectedValue={wellsDvt}
              onSelect={setWellsDvt}
              options={[
                { label: 'Yes (Leg swelling, calf pain)', value: true, pts: 3 },
                { label: 'No', value: false, pts: 0 },
              ]}
            />
            <RadioGroup
              label="PE is #1 Diagnosis or Equally Likely"
              selectedValue={wellsPeLikely}
              onSelect={setWellsPeLikely}
              options={[
                { label: 'Yes', value: true, pts: 3 },
                { label: 'No', value: false, pts: 0 },
              ]}
            />
            <RadioGroup
              label="Heart Rate > 100 bpm"
              selectedValue={wellsHr100}
              onSelect={setWellsHr100}
              options={[
                { label: 'Yes', value: true, pts: 1.5 },
                { label: 'No', value: false, pts: 0 },
              ]}
            />
            <RadioGroup
              label="Immobilization >= 3 Days or Surgery in Past 4 Weeks"
              selectedValue={wellsSurgery}
              onSelect={setWellsSurgery}
              options={[
                { label: 'Yes', value: true, pts: 1.5 },
                { label: 'No', value: false, pts: 0 },
              ]}
            />
            <RadioGroup
              label="Previous Objectively Diagnosed DVT or PE"
              selectedValue={wellsPrev}
              onSelect={setWellsPrev}
              options={[
                { label: 'Yes', value: true, pts: 1.5 },
                { label: 'No', value: false, pts: 0 },
              ]}
            />
            <RadioGroup
              label="Hemoptysis (Coughing up blood)"
              selectedValue={wellsHemoptysis}
              onSelect={setWellsHemoptysis}
              options={[
                { label: 'Yes', value: true, pts: 1 },
                { label: 'No', value: false, pts: 0 },
              ]}
            />
            <RadioGroup
              label="Malignancy (Treatment within 6 mo or palliative)"
              selectedValue={wellsMalignancy}
              onSelect={setWellsMalignancy}
              options={[
                { label: 'Yes', value: true, pts: 1 },
                { label: 'No', value: false, pts: 0 },
              ]}
            />
          </>
        )}

        {calcMeta.id === 'anion-gap' && (
          <>
            <NumericInput label="Serum Sodium (Na)" value={agNa} onChange={setAgNa} unit="mEq/L" />
            <NumericInput label="Serum Chloride (Cl)" value={agCl} onChange={setAgCl} unit="mEq/L" />
            <NumericInput label="Serum Bicarbonate (HCO3)" value={agHco3} onChange={setAgHco3} unit="mEq/L" />
            <NumericInput label="Serum Albumin (Optional)" value={agAlbumin} onChange={setAgAlbumin} unit="g/dL" />
          </>
        )}

        {calcMeta.id === 'sodium-correction' && (
          <>
            <NumericInput label="Measured Serum Sodium" value={naMeasured} onChange={setNaMeasured} unit="mEq/L" />
            <NumericInput
              label="Serum Glucose"
              value={naGlucose}
              onChange={setNaGlucose}
              unit={isMetric ? 'mmol/L' : 'mg/dL'}
            />
          </>
        )}

        {calcMeta.id === 'pf-ratio' && (
          <>
            <NumericInput label="PaO₂ (Arterial Oxygen Tension)" value={pfPao2} onChange={setPfPao2} unit="mmHg" />
            <NumericInput label="FiO₂ (Inspired Fraction of O₂)" value={pfFio2} onChange={setPfFio2} unit="%" />
          </>
        )}

        {calcMeta.id === 'crcl' && (
          <>
            <NumericInput label="Patient Age" value={crclAge} onChange={setCrclAge} unit="years" />
            <NumericInput
              label="Patient Weight"
              value={crclWeight}
              onChange={setCrclWeight}
              unit={isMetric ? 'kg' : 'lbs'}
            />
            <NumericInput
              label="Serum Creatinine"
              value={crclCr}
              onChange={setCrclCr}
              unit={isMetric ? 'µmol/L' : 'mg/dL'}
            />
            <RadioGroup
              label="Biological Sex"
              selectedValue={crclSex}
              onSelect={setCrclSex}
              options={[
                { label: 'Male', value: 'male' },
                { label: 'Female (0.85 multiplier)', value: 'female' },
              ]}
            />
          </>
        )}

        {calcMeta.id === 'has-bled' && (
          <>
            <RadioGroup
              label="Hypertension (Uncontrolled SBP > 160)"
              selectedValue={hbHtn}
              onSelect={setHbHtn}
              options={[
                { label: 'Yes', value: true, pts: 1 },
                { label: 'No', value: false, pts: 0 },
              ]}
            />
            <RadioGroup
              label="Abnormal Renal Function (Dialysis, Cr > 2.26)"
              selectedValue={hbRenal}
              onSelect={setHbRenal}
              options={[
                { label: 'Yes', value: true, pts: 1 },
                { label: 'No', value: false, pts: 0 },
              ]}
            />
            <RadioGroup
              label="Abnormal Liver Function (Cirrhosis, Bili > 2x)"
              selectedValue={hbLiver}
              onSelect={setHbLiver}
              options={[
                { label: 'Yes', value: true, pts: 1 },
                { label: 'No', value: false, pts: 0 },
              ]}
            />
            <RadioGroup
              label="Prior Stroke History"
              selectedValue={hbStroke}
              onSelect={setHbStroke}
              options={[
                { label: 'Yes', value: true, pts: 1 },
                { label: 'No', value: false, pts: 0 },
              ]}
            />
            <RadioGroup
              label="Prior Major Bleeding or Anemia Disposition"
              selectedValue={hbBleeding}
              onSelect={setHbBleeding}
              options={[
                { label: 'Yes', value: true, pts: 1 },
                { label: 'No', value: false, pts: 0 },
              ]}
            />
            <RadioGroup
              label="Labile INRs (Unstable / < 60% time in range)"
              selectedValue={hbInr}
              onSelect={setHbInr}
              options={[
                { label: 'Yes', value: true, pts: 1 },
                { label: 'No', value: false, pts: 0 },
              ]}
            />
            <RadioGroup
              label="Elderly (Age > 65 years)"
              selectedValue={hbElderly}
              onSelect={setHbElderly}
              options={[
                { label: 'Yes', value: true, pts: 1 },
                { label: 'No', value: false, pts: 0 },
              ]}
            />
            <RadioGroup
              label="Concomitant Antiplatelets / NSAIDs"
              selectedValue={hbDrugs}
              onSelect={setHbDrugs}
              options={[
                { label: 'Yes', value: true, pts: 1 },
                { label: 'No', value: false, pts: 0 },
              ]}
            />
            <RadioGroup
              label="Alcohol Excess (>= 8 drinks/week)"
              selectedValue={hbAlcohol}
              onSelect={setHbAlcohol}
              options={[
                { label: 'Yes', value: true, pts: 1 },
                { label: 'No', value: false, pts: 0 },
              ]}
            />
          </>
        )}

        {calcMeta.id === 'heart' && (
          <>
            <RadioGroup
              label="History Suspicion for Acute Coronary Syndrome"
              selectedValue={heartHistory}
              onSelect={setHeartHistory}
              options={[
                { label: 'Highly suspicious', value: 2, pts: 2 },
                { label: 'Moderately suspicious', value: 1, pts: 1 },
                { label: 'Slightly suspicious', value: 0, pts: 0 },
              ]}
            />
            <RadioGroup
              label="ECG Findings"
              selectedValue={heartEcg}
              onSelect={setHeartEcg}
              options={[
                { label: 'Significant ST-depression', value: 2, pts: 2 },
                { label: 'Nonspecific repolarization disturbance', value: 1, pts: 1 },
                { label: 'Normal', value: 0, pts: 0 },
              ]}
            />
            <RadioGroup
              label="Patient Age"
              selectedValue={heartAge}
              onSelect={setHeartAge}
              options={[
                { label: '>= 65 years', value: 2, pts: 2 },
                { label: '45 - 64 years', value: 1, pts: 1 },
                { label: '< 45 years', value: 0, pts: 0 },
              ]}
            />
            <RadioGroup
              label="Risk Factors (HTN, Hyperlipidemia, DM, Smoking, Obesity, Family Hx)"
              selectedValue={heartRisk}
              onSelect={setHeartRisk}
              options={[
                { label: '>= 3 risk factors or history of CAD', value: 2, pts: 2 },
                { label: '1 or 2 risk factors', value: 1, pts: 1 },
                { label: 'No known risk factors', value: 0, pts: 0 },
              ]}
            />
            <RadioGroup
              label="Initial Cardiac Troponin"
              selectedValue={heartTroponin}
              onSelect={setHeartTroponin}
              options={[
                { label: '> 3x normal limit', value: 2, pts: 2 },
                { label: '1 - 3x normal limit', value: 1, pts: 1 },
                { label: '<= normal limit', value: 0, pts: 0 },
              ]}
            />
          </>
        )}

        {calcMeta.id === 'nihss' && (
          <>
            <RadioGroup
              label="1a. Level of Consciousness"
              selectedValue={nihLoc}
              onSelect={setNihLoc}
              options={[
                { label: 'Alert, keenly responsive', value: 0, pts: 0 },
                { label: 'Not alert; responsive to minor stimulation', value: 1, pts: 1 },
                { label: 'Not alert; requires repeated stimulation', value: 2, pts: 2 },
                { label: 'Unresponsive or reflex responses only', value: 3, pts: 3 },
              ]}
            />
            <RadioGroup
              label="2. Best Gaze"
              selectedValue={nihGaze}
              onSelect={setNihGaze}
              options={[
                { label: 'Normal horizontal eye movement', value: 0, pts: 0 },
                { label: 'Partial gaze palsy', value: 1, pts: 1 },
                { label: 'Forced deviation or total gaze paresis', value: 2, pts: 2 },
              ]}
            />
            <RadioGroup
              label="3. Visual Fields"
              selectedValue={nihVisual}
              onSelect={setNihVisual}
              options={[
                { label: 'No visual loss', value: 0, pts: 0 },
                { label: 'Partial hemianopia', value: 1, pts: 1 },
                { label: 'Complete hemianopia', value: 2, pts: 2 },
                { label: 'Bilateral hemianopia / Blind', value: 3, pts: 3 },
              ]}
            />
            <RadioGroup
              label="4. Facial Palsy"
              selectedValue={nihFacial}
              onSelect={setNihFacial}
              options={[
                { label: 'Normal symmetrical movements', value: 0, pts: 0 },
                { label: 'Minor paralysis (flattened nasolabial fold)', value: 1, pts: 1 },
                { label: 'Partial paralysis (lower face)', value: 2, pts: 2 },
                { label: 'Complete paralysis (upper and lower face)', value: 3, pts: 3 },
              ]}
            />
            <RadioGroup
              label="5a. Motor Arm (Left)"
              selectedValue={nihMotorArmL}
              onSelect={setNihMotorArmL}
              options={[
                { label: 'No drift (holds 10 sec)', value: 0, pts: 0 },
                { label: 'Drift before 10 sec', value: 1, pts: 1 },
                { label: 'Falls before 10 sec, some effort vs gravity', value: 2, pts: 2 },
                { label: 'No effort vs gravity, limb drops', value: 3, pts: 3 },
                { label: 'No movement', value: 4, pts: 4 },
              ]}
            />
            <RadioGroup
              label="5b. Motor Arm (Right)"
              selectedValue={nihMotorArmR}
              onSelect={setNihMotorArmR}
              options={[
                { label: 'No drift (holds 10 sec)', value: 0, pts: 0 },
                { label: 'Drift before 10 sec', value: 1, pts: 1 },
                { label: 'Falls before 10 sec, some effort vs gravity', value: 2, pts: 2 },
                { label: 'No effort vs gravity, limb drops', value: 3, pts: 3 },
                { label: 'No movement', value: 4, pts: 4 },
              ]}
            />
            <RadioGroup
              label="6a. Motor Leg (Left)"
              selectedValue={nihMotorLegL}
              onSelect={setNihMotorLegL}
              options={[
                { label: 'No drift (holds 5 sec)', value: 0, pts: 0 },
                { label: 'Drift before 5 sec', value: 1, pts: 1 },
                { label: 'Falls before 5 sec, effort vs gravity', value: 2, pts: 2 },
                { label: 'No effort vs gravity', value: 3, pts: 3 },
                { label: 'No movement', value: 4, pts: 4 },
              ]}
            />
            <RadioGroup
              label="6b. Motor Leg (Right)"
              selectedValue={nihMotorLegR}
              onSelect={setNihMotorLegR}
              options={[
                { label: 'No drift (holds 5 sec)', value: 0, pts: 0 },
                { label: 'Drift before 5 sec', value: 1, pts: 1 },
                { label: 'Falls before 5 sec, effort vs gravity', value: 2, pts: 2 },
                { label: 'No effort vs gravity', value: 3, pts: 3 },
                { label: 'No movement', value: 4, pts: 4 },
              ]}
            />
            <RadioGroup
              label="9. Best Language (Aphasia)"
              selectedValue={nihLanguage}
              onSelect={setNihLanguage}
              options={[
                { label: 'Normal fluency and comprehension', value: 0, pts: 0 },
                { label: 'Mild to moderate aphasia', value: 1, pts: 1 },
                { label: 'Severe aphasia (fragmentary expression)', value: 2, pts: 2 },
                { label: 'Mute / Global aphasia', value: 3, pts: 3 },
              ]}
            />
            <RadioGroup
              label="10. Dysarthria"
              selectedValue={nihDysarthria}
              onSelect={setNihDysarthria}
              options={[
                { label: 'Normal articulation', value: 0, pts: 0 },
                { label: 'Mild to moderate dysarthria (slurred words)', value: 1, pts: 1 },
                { label: 'Severe dysarthria (unintelligible / mute)', value: 2, pts: 2 },
              ]}
            />
          </>
        )}

        <View className="h-12" />
      </ScrollView>
    </View>
  );
}
