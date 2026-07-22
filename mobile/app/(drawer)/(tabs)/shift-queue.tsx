import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Header } from '../../../src/components/Header';
import { useQueueStore } from '../../../src/store/useQueueStore';
import { Users, Trash2, Copy, PlusCircle, Clock, BedDouble } from 'lucide-react-native';

import { AdBanner } from '../../../src/components/AdBanner';

export default function ShiftQueueScreen() {
  const router = useRouter();
  const { records, removeRecord, clearAll } = useQueueStore();

  const handleCopyHandoverDotPhrase = async () => {
    if (records.length === 0) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}

    const text = records
      .map(
        (r) =>
          `[Bed ${r.bedNumber} - ${r.patientInitials}] ${r.calculatorTitle}: ${r.calculatedScore} (${r.interpretation})`
      )
      .join('\n');

    const summaryPhrase = `*** SHIFT HANDOVER / PATIENT QUEUE SCORE LOG ***\nTimestamp: ${new Date().toLocaleString()}\n\n${text}\n\nGenerated via CareCalculus Mobile`;
    await Clipboard.setStringAsync(summaryPhrase);

    Alert.alert('EHR Handover Copied', 'All shift patient records copied to clipboard for Epic / Cerner SmartPaste.');
  };

  const handleClearAll = () => {
    Alert.alert('Clear Shift Queue', 'Are you sure you want to delete all patient records from local SQLite storage?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: clearAll },
    ]);
  };

  return (
    <View className="flex-1 bg-slate-950">
      <Header title="Bedside Shift Queue" />

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View className="bg-brand-950/40 p-4 rounded-2xl border border-brand-700/50 mb-4 flex-row items-center justify-between">
          <View className="flex-1 pr-2">
            <View className="flex-row items-center space-x-1.5 mb-1">
              <Users size={16} color="#14b8a6" />
              <Text className="text-brand-300 text-sm font-bold">Shift Queue (Encrypted SQLite)</Text>
            </View>
            <Text className="text-slate-400 text-xs leading-4">
              Local patient score tracker for ICU rounds & shift handoffs. Zero cloud transmission.
            </Text>
          </View>
          {records.length > 0 ? (
            <TouchableOpacity
              onPress={handleCopyHandoverDotPhrase}
              activeOpacity={0.7}
              className="bg-brand-600 px-3 py-2 rounded-xl flex-row items-center space-x-1"
            >
              <Copy size={13} color="#ffffff" />
              <Text className="text-white text-xs font-bold">Export</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Action Header */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            {records.length} Active Patients on Queue
          </Text>
          {records.length > 0 ? (
            <TouchableOpacity onPress={handleClearAll} className="flex-row items-center space-x-1">
              <Trash2 size={12} color="#ef4444" />
              <Text className="text-red-400 text-xs font-bold">Clear Queue</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Patient Cards */}
        {records.map((r) => (
          <View
            key={r.id}
            className="bg-slate-850 p-4 rounded-2xl border border-slate-800 mb-3"
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center space-x-2">
                <View className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 flex-row items-center space-x-1">
                  <BedDouble size={12} color="#14b8a6" />
                  <Text className="text-white text-xs font-bold">Bed {r.bedNumber}</Text>
                </View>
                <Text className="text-brand-300 text-xs font-bold">({r.patientInitials})</Text>
              </View>

              <TouchableOpacity onPress={() => removeRecord(r.id)}>
                <Trash2 size={16} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Text className="text-white text-sm font-bold mb-1">
              {r.calculatorTitle}: <Text className="text-brand-400">{r.calculatedScore}</Text>
            </Text>

            <Text className="text-slate-300 text-xs mb-2 leading-4">{r.interpretation}</Text>

            <View className="flex-row items-center justify-between pt-2 border-t border-slate-800">
              <View className="flex-row items-center space-x-1">
                <Clock size={11} color="#64748b" />
                <Text className="text-slate-500 text-[10px]">
                  {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              <Text className="text-slate-500 text-[10px] font-semibold">{r.unitStandard}</Text>
            </View>
          </View>
        ))}

        {records.length === 0 ? (
          <View className="p-8 items-center justify-center bg-slate-900/40 rounded-2xl border border-slate-800 border-dashed my-4">
            <PlusCircle size={36} color="#475569" className="mb-2" />
            <Text className="text-slate-300 text-base font-bold mb-1">No Shift Patients Logged</Text>
            <Text className="text-slate-500 text-xs text-center mb-4">
              Open any clinical calculator and tap "Add to Shift Queue" to track score cards for bedside rounds.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(drawer)/(tabs)/calculators')}
              className="bg-brand-600 px-4 py-2 rounded-xl"
            >
              <Text className="text-white text-xs font-bold">Open Calculator Catalog</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View className="h-10" />
      </ScrollView>
      <AdBanner />
    </View>
  );
}
