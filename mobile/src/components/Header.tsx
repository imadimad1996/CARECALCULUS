import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ShieldCheck, Stethoscope, RefreshCw } from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';

export const Header: React.FC<{ title?: string }> = ({ title = 'CareCalculus' }) => {
  const { unitSystem, toggleUnitSystem, isPro } = useAppStore();

  const handleUnitToggle = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    toggleUnitSystem();
  };

  return (
    <View className="bg-slate-900 px-4 pt-12 pb-4 flex-row items-center justify-between border-b border-slate-800">
      {/* Brand / Title */}
      <View className="flex-row items-center space-x-2">
        <View className="w-9 h-9 rounded-xl bg-brand-600 items-center justify-center shadow-md">
          <Stethoscope size={20} color="#ffffff" />
        </View>
        <View>
          <Text className="text-white text-lg font-bold tracking-tight">{title}</Text>
          <Text className="text-slate-400 text-xs font-medium">Clinical Calculators</Text>
        </View>
      </View>

      {/* Right Controls */}
      <View className="flex-row items-center space-x-2">
        {/* SI / US Unit Toggle */}
        <TouchableOpacity
          onPress={handleUnitToggle}
          activeOpacity={0.7}
          className="flex-row items-center bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 space-x-1.5"
        >
          <RefreshCw size={12} color="#14b8a6" />
          <Text className="text-brand-500 font-bold text-xs">{unitSystem}</Text>
        </TouchableOpacity>

        {/* Pro Pass Status */}
        {isPro ? (
          <View className="flex-row items-center bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/40 space-x-1">
            <ShieldCheck size={14} color="#f59e0b" />
            <Text className="text-amber-400 font-bold text-xs">PRO</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};
