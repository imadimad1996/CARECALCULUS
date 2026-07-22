import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../../src/components/Header';
import { CalculatorCard } from '../../../src/components/CalculatorCard';
import { CLINICAL_CALCULATORS_CATALOG } from '../../../src/core/calculators';
import { Zap, ShieldAlert, Sparkles, WifiOff, FileText } from 'lucide-react-native';

import { AdBanner } from '../../../src/components/AdBanner';

export default function HomeScreen() {
  const router = useRouter();
  const emergencyTools = CLINICAL_CALCULATORS_CATALOG.filter((c) => c.isEmergency);
  const popularTools = CLINICAL_CALCULATORS_CATALOG.filter((c) => c.isPopular);

  return (
    <View className="flex-1 bg-slate-950">
      <Header title="CareCalculus Mobile" />

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Offline Banner */}
        <View className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 flex-row items-center space-x-3 mb-5">
          <View className="w-8 h-8 rounded-lg bg-emerald-950/80 items-center justify-center border border-emerald-800/60">
            <WifiOff size={16} color="#10b981" />
          </View>
          <View className="flex-1">
            <Text className="text-white text-xs font-bold">100% Offline ICU Emergency Ready</Text>
            <Text className="text-slate-400 text-xs">Zero network latency. All 88+ formulas bundled locally.</Text>
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View className="flex-row space-x-3 mb-5">
          <TouchableOpacity
            onPress={() => router.push('/ehr/smart-paste')}
            activeOpacity={0.7}
            className="flex-1 bg-brand-950/60 p-4 rounded-2xl border border-brand-700/60 items-center justify-center"
          >
            <FileText size={22} color="#14b8a6" className="mb-1" />
            <Text className="text-brand-200 text-xs font-bold mt-1 text-center">EHR Smart Paste</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/pricing')}
            activeOpacity={0.7}
            className="flex-1 bg-amber-950/40 p-4 rounded-2xl border border-amber-700/60 items-center justify-center"
          >
            <Sparkles size={22} color="#f59e0b" className="mb-1" />
            <Text className="text-amber-200 text-xs font-bold mt-1 text-center">Get Pro Pass</Text>
          </TouchableOpacity>
        </View>

        {/* Emergency ICU Score Cards Section */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center space-x-2">
            <ShieldAlert size={18} color="#ef4444" />
            <Text className="text-white text-base font-bold">ICU / ER Emergency Tools</Text>
          </View>
        </View>

        {emergencyTools.map((calc) => (
          <CalculatorCard
            key={calc.id}
            calculator={calc}
            onPress={() => router.push(`/calculator/${calc.id}`)}
          />
        ))}

        {/* Most Popular Score Cards */}
        <View className="flex-row items-center space-x-2 mt-4 mb-3">
          <Zap size={18} color="#14b8a6" />
          <Text className="text-white text-base font-bold">Bedside Standard Tools</Text>
        </View>

        {popularTools.map((calc) => (
          <CalculatorCard
            key={calc.id}
            calculator={calc}
            onPress={() => router.push(`/calculator/${calc.id}`)}
          />
        ))}

        <View className="h-10" />
      </ScrollView>
      <AdBanner />
    </View>
  );
}
