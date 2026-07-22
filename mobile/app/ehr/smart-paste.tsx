import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { FileText, Copy, Check, ChevronLeft, Sparkles } from 'lucide-react-native';

const PRESET_DOTPHRASES = [
  {
    title: 'ICU Admission Sepsis / qSOFA Note',
    phrase: `.SEPSIS_EVAL - Sepsis-3 Protocol Evaluation:\nqSOFA Score: {score}/3.\nMAP: {map} mmHg. Target MAP >= 65 mmHg.\nBlood cultures drawn x2. Broad spectrum antibiotics initiated. IV crystalloid fluid resuscitation 30 mL/kg underway.\nRe-assess lactate and hemodynamics q2h.`,
  },
  {
    title: 'GCS & Neuro Handoff Note',
    phrase: `.GCS_NOTE - Acute Neuro Evaluation:\nGCS Score: {gcs} (Eye: {e}, Verbal: {v}, Motor: {m}).\nPupils equal and reactive to light. Cranial nerves intact.\nAirway status: Protected. Neuro checks q1h.`,
  },
  {
    title: 'Nephrology eGFR & CrCl Note',
    phrase: `.RENAL_FUNC - Renal Function Assessment:\neGFR (CKD-EPI 2021): {egfr} mL/min/1.73m².\nSerum Creatinine: {cr} mg/dL.\nMedication dosing adjusted for renal function per hospital pharmacy protocol.`,
  },
  {
    title: 'Afib Anticoagulation (CHA₂DS₂-VASc) Note',
    phrase: `.AFIB_RISK - Atrial Fibrillation Thromboembolic Risk:\nCHA₂DS₂-VASc Score: {score} (Annual stroke risk: {risk}%).\nAnticoagulation Recommendation: Initiated DOAC therapy per 2023 ACC/AHA guidelines.`,
  },
];

export default function SmartPasteScreen() {
  const router = useRouter();
  const [selectedPhrase, setSelectedPhrase] = useState(PRESET_DOTPHRASES[0].phrase);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    await Clipboard.setStringAsync(selectedPhrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <View className="flex-1 bg-slate-950">
      {/* Header */}
      <View className="px-4 pt-12 pb-4 bg-slate-900 border-b border-slate-800 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center space-x-1">
          <ChevronLeft size={20} color="#14b8a6" />
          <Text className="text-brand-400 text-sm font-bold">Close</Text>
        </TouchableOpacity>
        <Text className="text-white text-base font-bold">EHR SmartPaste Generator</Text>
        <View className="w-6" />
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Intro */}
        <View className="bg-brand-950/40 p-4 rounded-2xl border border-brand-700/50 mb-5 flex-row items-center space-x-3">
          <FileText size={24} color="#14b8a6" />
          <View className="flex-1">
            <Text className="text-white text-sm font-bold">Epic / Cerner / Meditech Ready</Text>
            <Text className="text-slate-400 text-xs">
              1-Click clinical dotphrase formatter for progress notes, ICU handoffs, and admission summaries.
            </Text>
          </View>
        </View>

        {/* Presets */}
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
          Select Preset DotPhrase Template
        </Text>

        <View className="space-y-2 mb-4">
          {PRESET_DOTPHRASES.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setSelectedPhrase(item.phrase)}
              activeOpacity={0.7}
              className={`p-3 rounded-xl border ${
                selectedPhrase === item.phrase
                  ? 'bg-brand-950/60 border-brand-500'
                  : 'bg-slate-850 border-slate-800'
              }`}
            >
              <Text className="text-white text-sm font-bold">{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Formatter Textarea */}
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
          Interactive DotPhrase Editor
        </Text>

        <View className="bg-slate-900 rounded-2xl border border-slate-800 p-4 mb-4">
          <TextInput
            multiline
            numberOfLines={8}
            value={selectedPhrase}
            onChangeText={setSelectedPhrase}
            className="text-brand-200 text-sm font-mono leading-5"
            style={{ textAlignVertical: 'top', minHeight: 140 }}
          />
        </View>

        {/* Copy Action */}
        <TouchableOpacity
          onPress={handleCopy}
          activeOpacity={0.8}
          className="bg-brand-600 py-3.5 px-4 rounded-2xl flex-row items-center justify-center space-x-2 mb-6"
        >
          {copied ? (
            <>
              <Check size={18} color="#ffffff" />
              <Text className="text-white text-sm font-bold">Copied to Clipboard!</Text>
            </>
          ) : (
            <>
              <Copy size={18} color="#ffffff" />
              <Text className="text-white text-sm font-bold">Copy DotPhrase to Clipboard</Text>
            </>
          )}
        </TouchableOpacity>

        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
