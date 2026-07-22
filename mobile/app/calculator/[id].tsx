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
} from '../../src/core/formulas';
import { useQueueStore } from '../../src/store/useQueueStore';
import { ChevronLeft, Share2, PlusCircle } from 'lucide-react-native';

export default function CalculatorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const addRecord = useQueueStore((state) => state.addRecord);

  const calcMeta = CLINICAL_CALCULATORS_CATALOG.find((c) => c.id === id) || CLINICAL_CALCULATORS_CATALOG[0];

  // State for MAP
  const [sbp, setSbp] = useState(120);
  const [dbp, setDbp] = useState(80);

  // State for GCS
  const [gcsEye, setGcsEye] = useState(4);
  const [gcsVerbal, setGcsVerbal] = useState(5);
  const [gcsMotor, setGcsMotor] = useState(6);

  // State for qSOFA
  const [qsofaRr, setQsofaRr] = useState(20);
  const [qsofaAms, setQsofaAms] = useState(false);
  const [qsofaSbp, setQsofaSbp] = useState(110);

  // State for CURB-65
  const [curbConfusion, setCurbConfusion] = useState(false);
  const [curbBun, setCurbBun] = useState(15);
  const [curbRr, setCurbRr] = useState(20);
  const [curbSbp, setCurbSbp] = useState(120);
  const [curbDbp, setCurbDbp] = useState(80);
  const [curbAge, setCurbAge] = useState(55);

  // State for MELD
  const [meldBili, setMeldBili] = useState(1.2);
  const [meldCr, setMeldCr] = useState(1.0);
  const [meldInr, setMeldInr] = useState(1.1);

  // State for CKD-EPI
  const [ckdCr, setCkdCr] = useState(1.0);
  const [ckdAge, setCkdAge] = useState(60);
  const [ckdSex, setCkdSex] = useState<'male' | 'female'>('male');

  // State for Bedside Queue Add Modal/Input
  const [bedNum, setBedNum] = useState('');
  const [initials, setInitials] = useState('');
  const [showQueueModal, setShowQueueModal] = useState(false);

  // Calculate Result
  let scoreValue: string | number = '';
  let interpretation = '';
  let severity: 'normal' | 'warning' | 'emergency' = 'normal';
  let dotPhrase = '';

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
    const res = calculateCURB65({ confusion: curbConfusion, bunMgDl: curbBun, rr: curbRr, sbp: curbSbp, dbp: curbDbp, age: curbAge });
    scoreValue = `${res.score} / 5 (Mortality ${res.mortality})`;
    interpretation = `${res.recommendation} 30-Day Mortality Estimate: ${res.mortality}.`;
    severity = res.severity;
    dotPhrase = `.CURB65 - CURB-65 Pneumonia Score: ${res.score}/5. Mortality: ${res.mortality}. Rec: ${res.recommendation}`;
  } else if (calcMeta.id === 'meld') {
    const res = calculateMELD({ bilirubinMgDl: meldBili, creatinineMgDl: meldCr, inr: meldInr });
    scoreValue = `${res.meldScore} Points`;
    interpretation = res.interpretation;
    severity = res.severity;
    dotPhrase = `.MELD - MELD Score: ${res.meldScore} points. Bili: ${meldBili}, Cr: ${meldCr}, INR: ${meldInr}. 3-Mo Mortality: ${res.threeMonthMortality}`;
  } else if (calcMeta.id === 'ckdepi') {
    const res = calculateCKDEPI2021({ scrMgDl: ckdCr, age: ckdAge, sex: ckdSex });
    scoreValue = `${res.egfr} mL/min/1.73m²`;
    interpretation = res.interpretation;
    severity = res.severity;
    dotPhrase = `.CKDEPI - eGFR (CKD-EPI 2021): ${res.egfr} mL/min/1.73m². Stage: ${res.stage}`;
  } else {
    // Default fallback calculation (MAP)
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
      unitStandard: calcMeta.defaultUnitSystem,
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
          Clinical Parameters & Inputs
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
            <NumericInput label="BUN (Blood Urea Nitrogen)" value={curbBun} onChange={setCurbBun} unit="mg/dL" />
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
            <NumericInput label="Total Bilirubin" value={meldBili} onChange={setMeldBili} unit="mg/dL" />
            <NumericInput label="Serum Creatinine" value={meldCr} onChange={setMeldCr} unit="mg/dL" />
            <NumericInput label="INR" value={meldInr} onChange={setMeldInr} unit="" />
          </>
        )}

        {calcMeta.id === 'ckdepi' && (
          <>
            <NumericInput label="Serum Creatinine" value={ckdCr} onChange={setCkdCr} unit="mg/dL" />
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

        <View className="h-12" />
      </ScrollView>
    </View>
  );
}
