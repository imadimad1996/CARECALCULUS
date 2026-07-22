import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../../src/components/Header';
import { useAppStore } from '../../../src/store/useAppStore';
import { ShieldCheck, RefreshCw, Smartphone, Database, Lock, Info, ExternalLink } from 'lucide-react-native';

import { AdBanner } from '../../../src/components/AdBanner';

export default function SettingsScreen() {
  const router = useRouter();
  const { unitSystem, toggleUnitSystem, isPro, setProStatus } = useAppStore();

  return (
    <View className="flex-1 bg-slate-950">
      <Header title="Settings & Preferences" />

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Pro Pass Subscription Banner */}
        <TouchableOpacity
          onPress={() => router.push('/pricing')}
          activeOpacity={0.8}
          className={`p-4 rounded-2xl border mb-5 ${
            isPro ? 'bg-amber-950/60 border-amber-500/50' : 'bg-brand-950/60 border-brand-500/50'
          }`}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center space-x-3">
              <ShieldCheck size={24} color={isPro ? '#f59e0b' : '#14b8a6'} />
              <View>
                <Text className="text-white text-base font-bold">
                  {isPro ? 'Pro Pass Active' : 'CareCalculus Pro Pass'}
                </Text>
                <Text className="text-slate-400 text-xs">
                  {isPro
                    ? 'Unlimited offline ICU access & EHR export active'
                    : 'Unlock EHR SmartPaste & offline ICU database'}
                </Text>
              </View>
            </View>
            <ExternalLink size={16} color="#94a3b8" />
          </View>
        </TouchableOpacity>

        {/* Clinical Preferences */}
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 ml-1">
          Clinical Preferences
        </Text>

        <View className="bg-slate-850 rounded-2xl border border-slate-800 p-4 mb-5 space-y-4">
          {/* Unit System Toggle */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center space-x-3">
              <RefreshCw size={18} color="#14b8a6" />
              <View>
                <Text className="text-white text-sm font-bold">Unit Standard</Text>
                <Text className="text-slate-400 text-xs">Default laboratory & weight units</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={toggleUnitSystem}
              className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700"
            >
              <Text className="text-brand-300 font-bold text-xs">{unitSystem}</Text>
            </TouchableOpacity>
          </View>

          {/* Dev Pro Toggle */}
          <View className="flex-row items-center justify-between pt-3 border-t border-slate-800">
            <View className="flex-row items-center space-x-3">
              <Smartphone size={18} color="#f59e0b" />
              <View>
                <Text className="text-white text-sm font-bold">Simulate Pro Pass</Text>
                <Text className="text-slate-400 text-xs">Local entitlement simulation</Text>
              </View>
            </View>
            <Switch
              value={isPro}
              onValueChange={setProStatus}
              trackColor={{ false: '#334155', true: '#0d9488' }}
              thumbColor={isPro ? '#14b8a6' : '#94a3b8'}
            />
          </View>
        </View>

        {/* Data & HIPAA Security */}
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 ml-1">
          Data & HIPAA Compliance
        </Text>

        <View className="bg-slate-850 rounded-2xl border border-slate-800 p-4 mb-5 space-y-3">
          <View className="flex-row items-center space-x-3">
            <Lock size={18} color="#10b981" />
            <View className="flex-1">
              <Text className="text-white text-sm font-bold">Local Encrypted SQLite</Text>
              <Text className="text-slate-400 text-xs">
                Zero patient health data (PHI) is transmitted over network connections.
              </Text>
            </View>
          </View>

          <View className="flex-row items-center space-x-3 pt-3 border-t border-slate-800">
            <Database size={18} color="#38bdf8" />
            <View className="flex-1">
              <Text className="text-white text-sm font-bold">Offline Bundle Storage</Text>
              <Text className="text-slate-400 text-xs">
                All 88+ validated formulas are pre-compiled natively in JS binary.
              </Text>
            </View>
          </View>
        </View>

        {/* About & Legal */}
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 ml-1">
          About
        </Text>

        <View className="bg-slate-850 rounded-2xl border border-slate-800 p-4 mb-5 space-y-3">
          <View className="flex-row items-center space-x-3">
            <Info size={18} color="#94a3b8" />
            <View className="flex-1">
              <Text className="text-white text-sm font-bold">CareCalculus Mobile v1.0.0</Text>
              <Text className="text-slate-400 text-xs">
                Android Package: com.carecalculus.app (API Level 34 Target)
              </Text>
            </View>
          </View>
        </View>

        <View className="h-10" />
      </ScrollView>
      <AdBanner />
    </View>
  );
}
